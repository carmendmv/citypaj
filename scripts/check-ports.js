#!/usr/bin/env node
const { execSync } = require('child_process');
const os = require('os');

const PORTS = [3001, 3002];

function run(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
  } catch (err) {
    return err.stdout?.toString() || err.message || '';
  }
}

function getProcessInfo(pid) {
  try {
    if (process.platform === 'win32') {
      const out = execSync(`tasklist /fi "pid eq ${pid}" /fo csv /nh`, { encoding: 'utf-8' });
      const parts = out.split(',');
      return parts[1] ? parts[0].replace(/"/g, '').trim() : 'desconocido';
    }
    return execSync(`ps -p ${pid} -o comm=`, { encoding: 'utf-8' }).trim();
  } catch {
    return 'desconocido';
  }
}

console.log(`Sistema: ${os.platform()} ${os.release()}`);
console.log(`Comprobando puertos ${PORTS.join(', ')}...\n`);

let found = false;

if (process.platform === 'win32') {
  const netstat = run('netstat -ano').split('\n');
  for (const port of PORTS) {
    const lines = netstat.filter(line => line.includes(`:${port}`) && line.includes('LISTENING'));
    if (lines.length === 0) {
      console.log(`  Puerto ${port}: LIBRE`);
    } else {
      found = true;
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        const local = parts[1] || '?';
        const pid = parts[parts.length - 1] || '?';
        const name = getProcessInfo(pid);
        console.log(`  Puerto ${port}: OCUPADO`);
        console.log(`    Local: ${local}`);
        console.log(`    PID:   ${pid}`);
        console.log(`    Proceso: ${name}`);
      }
    }
  }
} else {
  for (const port of PORTS) {
    const out = run(`ss -ltnp 2>/dev/null | grep ':${port} '`);
    if (!out.trim()) {
      console.log(`  Puerto ${port}: LIBRE`);
    } else {
      found = true;
      const lines = out.trim().split('\n');
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        const local = parts[3] || '?';
        const usersIndex = parts.findIndex(p => p.startsWith('users:'));
        const info = usersIndex >= 0 ? parts.slice(usersIndex).join(' ') : '';
        const pidMatch = info.match(/pid=(\d+)/);
        const pid = pidMatch ? pidMatch[1] : '?';
        const name = pid !== '?' ? getProcessInfo(pid) : 'desconocido';
        console.log(`  Puerto ${port}: OCUPADO`);
        console.log(`    Local: ${local}`);
        console.log(`    PID:   ${pid}`);
        console.log(`    Proceso: ${name}`);
      }
    }
  }
}

if (!found) {
  console.log('Todos los puertos están libres. Puedes ejecutar npm run dev.');
} else {
  console.log('\nSi algún proceso antiguo ocupa un puerto, ciérralo antes de arrancar:');
  console.log('  Windows PowerShell (como administrador si hace falta): Stop-Process -PID <PID> -Force');
  console.log('  Linux/WSL: kill -9 <PID>');
  process.exit(1);
}
