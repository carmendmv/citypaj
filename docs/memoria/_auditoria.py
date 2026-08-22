# -*- coding: utf-8 -*-
import os
import re
import json
import subprocess
import glob
from pathlib import Path

BASE = r'C:\Users\Carmen\Documents\TFG-2DAW\citypaj'
OUT = os.path.join(BASE, 'docs', 'memoria')

def run(cmd, cwd=BASE):
    try:
        r = subprocess.run(cmd, cwd=cwd, shell=True, capture_output=True, text=True, timeout=60)
        return r.stdout + r.stderr
    except Exception as e:
        return f'ERROR: {e}'

def read_file(rel, max_lines=None):
    path = os.path.join(BASE, rel)
    if not os.path.exists(path):
        return None
    try:
        with open(path, 'r', encoding='utf-8', errors='ignore') as f:
            if max_lines:
                return ''.join(f.readlines()[:max_lines])
            return f.read()
    except Exception as e:
        return f'ERROR {e}'

def find_files(pattern, maxdepth=5):
    matches = []
    for root, dirs, files in os.walk(BASE):
        depth = root.replace(BASE, '').count(os.sep)
        if depth > maxdepth:
            continue
        for f in files:
            if re.search(pattern, f, re.I):
                matches.append(os.path.relpath(os.path.join(root, f), BASE))
    return sorted(matches)

def list_dir(rel, maxdepth=4):
    path = os.path.join(BASE, rel)
    if not os.path.isdir(path):
        return []
    items = []
    for root, dirs, files in os.walk(path):
        depth = root.replace(path, '').count(os.sep)
        if depth > maxdepth:
            del dirs[:]
            continue
        for f in files:
            items.append(os.path.relpath(os.path.join(root, f), BASE))
    return sorted(items)

def grep(pattern, rel_path, max_matches=200):
    path = os.path.join(BASE, rel_path)
    if not os.path.isdir(path):
        return []
    matches = []
    for root, dirs, files in os.walk(path):
        for f in files:
            if f.endswith(('.ts','.tsx','.js','.jsx','.json','.yml','.yaml','.sql','.env.example','.env')):
                fp = os.path.join(root, f)
                try:
                    with open(fp, 'r', encoding='utf-8', errors='ignore') as fh:
                        for i, line in enumerate(fh, 1):
                            if re.search(pattern, line, re.I):
                                matches.append(f'{os.path.relpath(fp, BASE)}:{i}: {line.strip()}')
                                if len(matches) >= max_matches:
                                    return matches
                except Exception:
                    pass
    return matches

def extract_tables(sql):
    if not sql:
        return []
    return re.findall(r'CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?`?(\w+)`?', sql, re.I)

def extract_endpoints(lines):
    endpoints = []
    for line in lines:
        m = re.search(r'(\w+)\.?(?:get|post|put|patch|delete)\(["\']?(/[^"\')\s,]+)', line)
        if m:
            endpoints.append(f'{m.group(1)} {m.group(2).upper()}')
    return sorted(set(endpoints))

if __name__ == '__main__':
    datos = {}
    datos['repositorio'] = 'https://github.com/carmendmv/citypaj'
    datos['rama'] = run('git branch --show-current').strip()
    datos['status'] = run('git status --short').strip()

    # package.json
    datos['root_package'] = read_file('package.json')
    datos['frontend_package'] = read_file('frontend/package.json')
    datos['backend_package'] = read_file('backend/package.json')

    # docker y env
    datos['docker_compose'] = read_file('docker-compose.yml')
    datos['frontend_dockerfile'] = read_file('frontend/Dockerfile')
    datos['backend_dockerfile'] = read_file('backend/Dockerfile')
    datos['env_example'] = read_file('.env.example')
    datos['backend_env_example'] = read_file('backend/.env.example')

    # README
    datos['readme'] = read_file('README.md')

    # sql
    sql_files = find_files(r'\.sql$') + find_files(r'(?i)schema|migration|seed')
    datos['sql_files'] = sql_files
    init_sql = read_file('database/init.sql')
    datos['init_sql_head'] = init_sql[:20000] if init_sql else None
    datos['tablas'] = extract_tables(init_sql) if init_sql else []

    # files
    datos['find_max4'] = run('find . -maxdepth 4 -type f | sort').strip().splitlines()
    datos['frontend_app'] = list_dir('frontend/src/app', maxdepth=4)
    datos['frontend_components'] = list_dir('frontend/src/components', maxdepth=4) if os.path.isdir(os.path.join(BASE,'frontend/src/components')) else []
    datos['backend_src'] = list_dir('backend/src', maxdepth=5)

    # endpoints
    endpoint_lines = grep(r'\.(get|post|put|patch|delete)\s*\(', 'backend/src', 500)
    datos['endpoints_raw'] = endpoint_lines[:300]
    datos['endpoints'] = extract_endpoints(endpoint_lines)

    # env vars
    datos['env_refs'] = grep(r'process\.env|NEXT_PUBLIC', 'frontend', 300) + grep(r'process\.env', 'backend', 300)

    # commits
    commits = run('git log --date=short --pretty=format:"%h | %ad | %s" --max-count=150').strip().splitlines()
    datos['commits'] = commits

    # controllers/routes
    datos['backend_controllers'] = sorted([os.path.relpath(p, BASE) for p in glob.glob(os.path.join(BASE, 'backend/src/controllers/*'))])
    datos['backend_routes'] = sorted([os.path.relpath(p, BASE) for p in glob.glob(os.path.join(BASE, 'backend/src/routes/*'))])

    # diagramas existentes
    datos['diagramas_svg'] = sorted([os.path.basename(p) for p in glob.glob(os.path.join(OUT, 'diagramas', '*.svg'))])
    datos['diagramas_png'] = sorted([os.path.basename(p) for p in glob.glob(os.path.join(OUT, 'diagramas', 'png', '*.png'))])

    with open(os.path.join(OUT, 'datos_tecnicos.json'), 'w', encoding='utf-8') as f:
        json.dump(datos, f, ensure_ascii=False, indent=2)

    # Informe breve
    lines = []
    lines.append('# Auditoría del repositorio CityPAJ')
    lines.append(f'Repositorio: {datos["repositorio"]}')
    lines.append(f'Rama: {datos["rama"]}')
    lines.append(f'Commits revisados: {len(datos["commits"])}')
    lines.append(f'Tablas en init.sql: {len(datos["tablas"])}')
    lines.append('## Tecnologías')
    for pkg in ['frontend/package.json','backend/package.json','docker-compose.yml']:
        lines.append(f'- {pkg}')
    lines.append('## Diagramas existentes')
    for d in datos['diagramas_svg']:
        lines.append(f'- {d}')
    lines.append('## Tablas')
    for t in datos['tablas'][:80]:
        lines.append(f'- {t}')
    with open(os.path.join(OUT, 'AUDITORIA.md'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))

    print('Auditoría guardada en:')
    print(os.path.join(OUT, 'datos_tecnicos.json'))
    print(os.path.join(OUT, 'AUDITORIA.md'))
