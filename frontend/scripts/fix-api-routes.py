import os
import re

api_dir = os.path.join(os.path.dirname(__file__), '..', 'src', 'app', 'api')

def fix_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'localhost:3002' not in content and 'BACKEND_URL' not in content:
        return

    # Move export const dynamic after imports if it is at the top
    parts = content.split('\n')
    if parts[0].strip() == "export const dynamic = 'force-dynamic';":
        dynamic_line = parts[0]
        parts = parts[1:]
        # remove leading blank lines
        while parts and parts[0].strip() == '':
            parts.pop(0)
        # find last import line
        last_import = -1
        for i, line in enumerate(parts):
            if line.startswith('import '):
                last_import = i
        if last_import >= 0:
            parts.insert(last_import + 1, '')
            parts.insert(last_import + 2, dynamic_line)
            parts.insert(last_import + 3, '')
        else:
            parts.insert(0, dynamic_line)
            parts.insert(1, '')
        content = '\n'.join(parts)

    # Add BACKEND_URL import
    if "from '@/lib/api'" not in content:
        for i, line in enumerate(parts):
            if line.startswith('import '):
                last_import = i
        # re-split after move
        parts = content.split('\n')
        for i, line in enumerate(parts):
            if line.startswith('import '):
                last_import = i
        parts.insert(last_import + 1, "import { BACKEND_URL } from '@/lib/api';")
        content = '\n'.join(parts)

    # Replace URLs inside template strings
    content = re.sub(r'`([^`]*)http://localhost:3002([^`]*)`', r'`\1${BACKEND_URL}\2`', content)

    # Replace URLs inside single-quoted strings, convert to template literal
    def repl(m):
        return f'`{m.group(1)}${{BACKEND_URL}}{m.group(2)}`'
    content = re.sub(r"'([^']*)http://localhost:3002([^']*)'", repl, content)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

for root, dirs, files in os.walk(api_dir):
    for filename in files:
        if filename == 'route.ts':
            fix_file(os.path.join(root, filename))

print('OK')
