# -*- coding: utf-8 -*-
import os

BASE = r'C:\Users\Carmen\Documents\TFG-2DAW\citypaj\docs\memoria\diagramas'

def write_svg(name, content):
    os.makedirs(BASE, exist_ok=True)
    with open(os.path.join(BASE, f'{name}.svg'), 'w', encoding='utf-8') as f:
        f.write(content)

def box(x, y, w, h, text):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="#ffffff" stroke="#333333" stroke-width="1.5"/>\n<text x="{x+w/2}" y="{y+h/2+5}" font-family="Calibri,Arial,sans-serif" font-size="12" text-anchor="middle" fill="#000000">{text}</text>'

def arrow(x1, y1, x2, y2):
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="#333333" stroke-width="1.2" marker-end="url(#arrowhead)"/>'

common_head = '''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
<defs>
<marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
<polygon points="0 0, 10 3.5, 0 7" fill="#333333"/>
</marker>
</defs>
<rect width="800" height="600" fill="#ffffff"/>
'''

def do01():
    s = common_head + '<text x="400" y="30" font-family="Calibri,Arial,sans-serif" font-size="16" text-anchor="middle" font-weight="bold">Arquitectura general de CityPAJ</text>\n'
    s += box(50, 80, 180, 60, 'Usuario')
    s += arrow(230, 110, 320, 110)
    s += box(320, 80, 180, 60, 'Frontend Next.js')
    s += box(320, 170, 180, 40, 'Puerto 3001')
    s += arrow(410, 150, 410, 230)
    s += box(320, 240, 180, 60, 'Backend Express')
    s += box(320, 330, 180, 40, 'Puerto 3002')
    s += arrow(410, 310, 410, 380)
    s += box(320, 390, 180, 60, 'MySQL 8.0')
    s += box(320, 480, 180, 40, 'Base de datos citypaj')
    s += '</svg>'
    write_svg('01_arquitectura_general', s)

def do02():
    s = common_head + '<text x="400" y="30" font-family="Calibri,Arial,sans-serif" font-size="16" text-anchor="middle" font-weight="bold">Flujo usuario-frontend-backend-base de datos</text>\n'
    s += box(50, 150, 120, 40, 'Usuario')
    s += arrow(170, 170, 270, 170)
    s += box(270, 130, 160, 80, 'Interacción en frontend')
    s += arrow(430, 170, 520, 170)
    s += box(520, 130, 160, 80, 'Peticiones API REST')
    s += arrow(600, 210, 600, 300)
    s += box(480, 300, 240, 80, 'Consultas SQL')
    s += box(480, 430, 240, 40, 'Respuesta JSON')
    s += '</svg>'
    write_svg('02_flujo_usuario_frontend_backend_bbdd', s)

def do03():
    s = common_head + '<text x="400" y="30" font-family="Calibri,Arial,sans-serif" font-size="16" text-anchor="middle" font-weight="bold">Modelo entidad-relación</text>\n'
    s += box(80, 80, 120, 50, 'usuarios')
    s += arrow(200, 105, 280, 105)
    s += box(280, 80, 120, 50, 'anuncios')
    s += arrow(400, 105, 480, 105)
    s += box(480, 80, 120, 50, 'favoritos')
    s += box(80, 180, 120, 50, 'comunidad')
    s += arrow(200, 205, 280, 205)
    s += box(280, 180, 120, 50, 'comentarios')
    s += box(80, 280, 120, 50, 'sugerencias')
    s += box(480, 280, 120, 50, 'propuestas')
    s += box(280, 280, 120, 50, 'eventos')
    s += '</svg>'
    write_svg('03_modelo_entidad_relacion', s)

def do04():
    s = common_head + '<text x="400" y="30" font-family="Calibri,Arial,sans-serif" font-size="16" text-anchor="middle" font-weight="bold">Modelo relacional</text>\n'
    s += box(60, 80, 110, 50, 'usuarios (PK id)')
    s += box(210, 80, 130, 50, 'anuncios (FK usuario)')
    s += box(60, 180, 110, 50, 'comunidad_publicaciones')
    s += box(210, 180, 130, 50, 'comentarios (FK)')
    s += box(60, 280, 110, 50, 'propuestas (FK)')
    s += box(210, 280, 130, 50, 'propuestas_apoyos')
    s += box(60, 380, 110, 50, 'comunidades')
    s += box(210, 380, 130, 50, 'provincias (FK ccaa)')
    s += '</svg>'
    write_svg('04_modelo_relacional', s)

def do05():
    s = common_head + '<text x="400" y="30" font-family="Calibri,Arial,sans-serif" font-size="16" text-anchor="middle" font-weight="bold">Casos de uso</text>\n'
    s += box(60, 100, 120, 40, 'Visitante')
    s += box(60, 200, 120, 40, 'Usuario')
    s += box(60, 300, 120, 40, 'Moderador')
    s += box(60, 400, 120, 40, 'Administrador')
    s += box(300, 120, 180, 40, 'Consultar anuncios')
    s += box(300, 220, 180, 40, 'Publicar y comentar')
    s += box(300, 320, 180, 40, 'Revisar reportes')
    s += box(300, 420, 180, 40, 'Gestionar usuarios')
    s += '</svg>'
    write_svg('05_casos_uso', s)

def do06():
    s = common_head + '<text x="400" y="30" font-family="Calibri,Arial,sans-serif" font-size="16" text-anchor="middle" font-weight="bold">Flujo de publicación de anuncio</text>\n'
    s += box(100, 80, 160, 50, 'Formulario de anuncio')
    s += arrow(260, 105, 360, 105)
    s += box(360, 80, 160, 50, 'Validación en frontend')
    s += arrow(520, 105, 620, 105)
    s += box(620, 80, 160, 50, 'POST /api/anuncios')
    s += box(100, 200, 160, 50, 'Validación backend')
    s += arrow(260, 225, 360, 225)
    s += box(360, 200, 160, 50, 'Inserción en MySQL')
    s += arrow(520, 225, 620, 225)
    s += box(620, 200, 160, 50, 'Estado pending')
    s += '</svg>'
    write_svg('06_flujo_publicacion_anuncio', s)

def do07():
    s = common_head + '<text x="400" y="30" font-family="Calibri,Arial,sans-serif" font-size="16" text-anchor="middle" font-weight="bold">Flujo de login y autenticación</text>\n'
    s += box(100, 100, 160, 50, 'Formulario login')
    s += arrow(260, 125, 360, 125)
    s += box(360, 100, 160, 50, 'POST /api/auth/login')
    s += arrow(520, 125, 620, 125)
    s += box(620, 100, 160, 50, 'Verificación bcrypt')
    s += box(100, 220, 160, 50, 'Generación JWT')
    s += arrow(260, 245, 360, 245)
    s += box(360, 220, 160, 50, 'Respuesta token')
    s += arrow(520, 245, 620, 245)
    s += box(620, 220, 160, 50, 'Acceso a rutas')
    s += '</svg>'
    write_svg('07_flujo_login_autenticacion', s)

def do08():
    s = common_head + '<text x="400" y="30" font-family="Calibri,Arial,sans-serif" font-size="16" text-anchor="middle" font-weight="bold">Flujo de moderación</text>\n'
    s += box(100, 100, 160, 50, 'Usuario reporta')
    s += arrow(260, 125, 360, 125)
    s += box(360, 100, 160, 50, 'Cola de revisión')
    s += arrow(520, 125, 620, 125)
    s += box(620, 100, 160, 50, 'Moderador revisa')
    s += box(360, 220, 160, 50, 'Decisión: aprobar/rechazar')
    s += arrow(440, 270, 440, 370)
    s += box(320, 370, 160, 50, 'Anuncio aprobado')
    s += box(520, 370, 160, 50, 'Anuncio rechazado')
    s += '</svg>'
    write_svg('08_flujo_moderacion', s)

def do09():
    s = common_head + '<text x="400" y="30" font-family="Calibri,Arial,sans-serif" font-size="16" text-anchor="middle" font-weight="bold">Arquitectura Docker</text>\n'
    s += box(100, 100, 150, 60, 'Docker Compose')
    s += arrow(250, 130, 300, 130)
    s += box(300, 100, 120, 60, 'mysql')
    s += box(300, 200, 120, 60, 'backend')
    s += box(300, 300, 120, 60, 'frontend')
    s += box(300, 400, 120, 60, 'volumes')
    s += '</svg>'
    write_svg('09_arquitectura_docker', s)

def do10():
    s = common_head + '<text x="400" y="30" font-family="Calibri,Arial,sans-serif" font-size="16" text-anchor="middle" font-weight="bold">Estructura de módulos del frontend</text>\n'
    s += box(100, 100, 140, 50, 'src/app')
    s += arrow(240, 125, 300, 125)
    s += box(300, 100, 140, 50, 'Páginas')
    s += box(300, 180, 140, 50, 'components')
    s += box(300, 260, 140, 50, 'hooks')
    s += box(300, 340, 140, 50, 'context')
    s += '</svg>'
    write_svg('10_estructura_modulos_frontend', s)

def do11():
    s = common_head + '<text x="400" y="30" font-family="Calibri,Arial,sans-serif" font-size="16" text-anchor="middle" font-weight="bold">Estructura de módulos del backend</text>\n'
    s += box(100, 100, 140, 50, 'src/index.ts')
    s += arrow(240, 125, 300, 125)
    s += box(300, 100, 140, 50, 'routes')
    s += box(300, 180, 140, 50, 'controllers')
    s += box(300, 260, 140, 50, 'middleware')
    s += box(300, 340, 140, 50, 'config/database')
    s += '</svg>'
    write_svg('11_estructura_modulos_backend', s)

if __name__ == '__main__':
    do01(); do02(); do03(); do04(); do05(); do06(); do07(); do08(); do09(); do10(); do11()
    print('Diagramas SVG creados en', BASE)
