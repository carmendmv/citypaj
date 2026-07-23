#!/usr/bin/env node
const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const PORTS = [3001, 3002];
const PROJECT_MARKER = 'TFG-2DAW' + path.sep + 'citypaj';

function isProjectProcess(cmdLine, exePath) {
  if (!cmdLine) return false;
  const text = (cmdLine + ' ' + (exePath || '')).toLowerCase();
  return text.includes(PROJECT_MARKER.toLowerCase()) ||
    text.includes('citypaj');
}

function isSafeToKill(imageName, cmdLine) {
  const lower = (imageName || '').toLowerCase();
  const cmd = (cmdLine || '').toLowerCase();
  if (lower.includes('svchost') || lower.includes('wslrelay') || lower.includes('iphlpsvc')) return false;
  if (cmd.includes('wslrelay.exe') || cmd.includes('svchost.exe')) return false;
  if (lower.includes('node') || lower.includes('next') || lower.includes('nodemon') || lower.includes('concurrently') || lower.includes('ts-node')) return true;
  if (cmd.includes('node') || cmd.includes('next') || cmd.includes('nodemon') || cmd.includes('concurrently') || cmd.includes('ts-node')) return true;
  return isProjectProcess(cmdLine);
}

function run(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
  } catch (err) {
    return err.stdout?.toString() || err.stderr?.toString() || '';
  }
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function killPid(pid, imageName) {
  console.log(`  Cerrando PID ${pid} (${imageName || 'desconocido'})...`);
  try {
    if (process.platform === 'win32') {
      execSync(`taskkill /PID ${pid}`);
      await sleep(1500);
      try { execSync(`taskkill /F /PID ${pid}`); } catch {}
    } else {
      process.kill(pid, 'SIGTERM');
      await sleep(1500);
      try { process.kill(pid, 'SIGKILL'); } catch {}
    }
  } catch {}
}

function getWinProcessInfo(pid) {
  try {
    const cmd = `powershell.exe -NoProfile -Command "Get-CimInstance Win32_Process -Filter \\"ProcessId = ${pid}\\" | Select-Object Name, CommandLine | ConvertTo-Csv -NoTypeInformation"`;
    const out = execSync(cmd, { encoding: 'utf-8' });
    const lines = out.trim().split('\n').filter(l => l.trim());
    const dataLine = lines[lines.length - 1];
    const parts = dataLine.split(',');
    const name = (parts[0] || '').replace(/"/g, '').trim();
    const commandLine = parts.slice(1).join(',').replace(/^"|"$/g, '').trim();
    return { name, commandLine };
  } catch {
    return { name: '', commandLine: '' };
  }
}

function parseLinuxPids() {
  const entries = new Map();
  for (const port of PORTS) {
    try {
      const out = run(`ss -ltnp 2>/dev/null | grep ':${port} '`);
      for (const line of out.split('\n')) {
        const pidMatch = line.match(/pid=(\d+)/);
        const nameMatch = line.match(/users:\(\("([^"]+)"/);
        if (pidMatch) {
          entries.set(pidMatch[1], nameMatch ? nameMatch[1] : '');
        }
      }
    } catch {}
  }
  return Array.from(entries.entries()).map(([pid, name]) => ({ pid, ssName: name }));
}

function parseWinPids() {
  const entries = new Map();
  try {
    const out = run('netstat -ano');
    for (const line of out.split('\n')) {
      if (!line.includes('LISTENING')) continue;
      for (const port of PORTS) {
        if (line.includes(`:${port}`)) {
          const parts = line.trim().split(/\s+/);
          const pid = parts[parts.length - 1];
          if (/^\d+$/.test(pid)) entries.set(pid, '');
        }
      }
    }
  } catch {}
  return Array.from(entries.entries()).map(([pid, ssName]) => ({ pid, ssName }));
}

function getLinuxCmdline(pid) {
  try {
    const buf = fs.readFileSync(`/proc/${pid}/cmdline`);
    return buf.toString('utf-8').replace(/\0/g, ' ').trim();
  } catch {
    return '';
  }
}

function getLinuxExe(pid) {
  try {
    return fs.readlinkSync(`/proc/${pid}/exe`);
  } catch {
    return '';
  }
}

async function killLinuxProjectProcs() {
  try {
    const out = run(`ps -e -o pid,args | grep -E 'citypaj.*(next|nodemon|ts-node|concurrently)' | grep -v grep`);
    const pids = [];
    for (const line of out.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const pid = trimmed.split(/\s+/)[0];
      if (pid === String(process.pid)) continue;
      if (/^\d+$/.test(pid)) pids.push(pid);
    }
    if (pids.length) {
      console.log(`  Cerrando ${pids.length} proceso(s) del proyecto...`);
      run(`kill -9 ${pids.join(' ')}`);
    }
  } catch {}
}

async function main() {
  console.log(`Limpieza de puertos ${PORTS.join(', ')} (${os.platform()})\n`);

  // 1. Matar wrappers del proyecto (next dev, nodemon, concurrently...) para evitar
  //    que respawneen next-server/ts-node mientras limpiamos los listeners.
  if (process.platform !== 'win32') {
    await killLinuxProjectProcs();
    await sleep(1000);
  }

  // 2. Detectar listeners en 3001/3002
  let entries = process.platform === 'win32' ? parseWinPids() : parseLinuxPids();

  if (entries.length === 0) {
    console.log('Puertos libres. Arrancando...');
    process.exit(0);
  }

  let killed = false;
  let blocked = false;

  for (const { pid, ssName } of entries) {
    let imageName = ssName;
    let cmdLine = '';

    if (process.platform === 'win32') {
      const info = getWinProcessInfo(pid);
      imageName = info.name || ssName;
      cmdLine = info.commandLine;
    } else {
      const exe = getLinuxExe(pid);
      const cmd = getLinuxCmdline(pid);
      imageName = path.basename(exe || cmd.split(' ')[0] || ssName) || ssName;
      cmdLine = cmd;
    }

    console.log(`Puerto ocupado por PID ${pid}: ${imageName || 'desconocido'}`);
    if (cmdLine) console.log(`  Cmd: ${cmdLine.substring(0, 120)}`);

    if (!isSafeToKill(imageName, cmdLine)) {
      console.log(`  -> Protegido o ajeno al proyecto. No se cierra.`);
      if (process.platform === 'win32' && (imageName.toLowerCase().includes('svchost') || imageName.toLowerCase().includes('wslrelay'))) {
        console.log('     Puede necesitar reiniciar el servicio iphlpsvc o WSL como administrador.');
      }
      blocked = true;
      continue;
    }

    await killPid(pid, imageName);
    killed = true;
  }

  if (blocked && !killed) {
    console.error('\nError: los puertos 3001/3002 están ocupados por procesos del sistema que no se pueden cerrar automáticamente.');
    process.exit(1);
  }

  if (killed) {
    await sleep(1000);
    const remaining = process.platform === 'win32' ? parseWinPids() : parseLinuxPids();
    if (remaining.length > 0) {
      console.warn('\nAdvertencia: algunos puertos siguen ocupados. Revisa manualmente con `npm run check:ports`.');
      process.exit(1);
    } else {
      console.log('\nPuertos liberados. Arrancando...');
    }
  }

  process.exit(0);
}

main().catch(err => {
  console.error('Error limpiando puertos:', err.message);
  process.exit(1);
});
