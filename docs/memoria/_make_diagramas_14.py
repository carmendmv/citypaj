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

def actor(x, y, h, name):
    s = f'<line x1="{x+20}" y1="{y}" x2="{x+20}" y2="{y+h}" stroke="#333333" stroke-width="1.2"/>\n'
    s += f'<rect x="{x+10}" y="{y}" width="20" height="30" fill="#ffffff" stroke="#333333" stroke-width="1.5"/>\n'
    s += f'<text x="{x+20}" y="{y+h+15}" font-family="Calibri,Arial,sans-serif" font-size="12" text-anchor="middle" fill="#000000">{name}</text>'
    return s

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
    s += box(320, 80, 180, 60, 'Frontend Next.js (3001)')
    s += arrow(410, 150, 410, 230)
    s += box(320, 240, 180, 60, 'Backend Express (3002)')
    s += arrow(410, 310, 410, 380)
    s += box(320, 390, 180, 60, 'MySQL 8.0 base citypaj')
    s += '</svg>'
    write_svg('01_arquitectura_general', s)

def do02():
    s = common_head + '<text x="400" y="30" font-family="Calibri,Arial,sans-serif" font-size="16" text-anchor="middle" font-weight="bold">Flujo usuario-frontend-backend-base de datos</text>\n'
    s += box(50, 150, 120, 40, 'Usuario')
    s += arrow(170, 170, 270, 170)
    s += box(270, 130, 160, 80, 'Interacción frontend')
    s += arrow(430, 170, 520, 170)
    s += box(520, 130, 160, 80, 'Peticiones API REST')
    s += arrow(600, 210, 600, 300)
    s += box(480, 300, 240, 80, 'Consultas SQL a MySQL')
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
    s += box(80, 180, 120, 50, 'comunidad_publicaciones')
    s += arrow(200, 205, 280, 205)
    s += box(280, 180, 120, 50, 'comunidad_comentarios')
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
    s += box(210, 180, 130, 50, 'comunidad_comentarios')
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
    s = common_head + '<text x="400" y="30" font-family="Calibri,Arial,sans-serif" font-size="16" text-anchor="middle" font-weight="bold">Diagrama de secuencia: login</text>\n'
    s += actor(60, 60, 400, 'Usuario')
    s += actor(260, 60, 400, 'Frontend')
    s += actor(460, 60, 400, 'Backend')
    s += actor(660, 60, 400, 'MySQL')
    s += arrow(80, 120, 270, 140)
    s += box(140, 110, 170, 20, 'Introduce credenciales')
    s += arrow(280, 170, 470, 190)
    s += box(330, 160, 180, 20, 'POST /api/auth/login')
    s += arrow(480, 220, 670, 240)
    s += box(540, 210, 180, 20, 'Consulta usuario')
    s += arrow(670, 270, 480, 290)
    s += box(540, 260, 180, 20, 'Devuelve hash')
    s += arrow(470, 320, 280, 340)
    s += box(300, 310, 210, 20, 'Verifica bcrypt y genera JWT')
    s += arrow(280, 370, 80, 390)
    s += box(100, 360, 180, 20, 'Token y redirección')
    s += '</svg>'
    write_svg('06_secuencia_login', s)

def do07():
    s = common_head + '<text x="400" y="30" font-family="Calibri,Arial,sans-serif" font-size="16" text-anchor="middle" font-weight="bold">Diagrama de secuencia: publicación de anuncio</text>\n'
    s += actor(60, 60, 400, 'Usuario')
    s += actor(260, 60, 400, 'Frontend')
    s += actor(460, 60, 400, 'Backend')
    s += actor(660, 60, 400, 'MySQL')
    s += arrow(80, 120, 270, 140)
    s += box(130, 110, 180, 20, 'Completa formulario')
    s += arrow(280, 170, 470, 190)
    s += box(320, 160, 210, 20, 'POST /api/anuncios')
    s += arrow(480, 220, 670, 240)
    s += box(540, 210, 180, 20, 'INSERT anuncios')
    s += arrow(670, 270, 480, 290)
    s += box(540, 260, 180, 20, 'Confirmación inserción')
    s += arrow(470, 320, 280, 340)
    s += box(320, 310, 210, 20, 'Validación y respuesta')
    s += arrow(280, 370, 80, 390)
    s += box(90, 360, 200, 20, 'Mensaje y listado actualizado')
    s += '</svg>'
    write_svg('07_secuencia_publicacion_anuncio', s)

def do08():
    s = common_head + '<text x="400" y="30" font-family="Calibri,Arial,sans-serif" font-size="16" text-anchor="middle" font-weight="bold">Diagrama de estados de un anuncio</text>\n'
    s += box(80, 120, 120, 50, 'Borrador')
    s += arrow(200, 145, 280, 145)
    s += box(280, 120, 120, 50, 'Pendiente')
    s += arrow(400, 145, 480, 145)
    s += box(480, 120, 120, 50, 'Aprobado')
    s += arrow(540, 175, 540, 260)
    s += box(480, 260, 120, 50, 'Rechazado')
    s += box(280, 260, 120, 50, 'Reportado')
    s += arrow(400, 285, 480, 285)
    s += '</svg>'
    write_svg('08_estados_anuncio', s)

def do09():
    s = common_head + '<text x="400" y="30" font-family="Calibri,Arial,sans-serif" font-size="16" text-anchor="middle" font-weight="bold">Arquitectura Docker</text>\n'
    s += box(100, 100, 150, 60, 'Docker Compose')
    s += arrow(250, 130, 300, 130)
    s += box(300, 100, 120, 60, 'mysql')
    s += box(300, 200, 120, 60, 'backend (3002)')
    s += box(300, 300, 120, 60, 'frontend (3001)')
    s += box(300, 400, 120, 60, 'volumes')
    s += '</svg>'
    write_svg('09_arquitectura_docker', s)

def do10():
    s = common_head + '<text x="400" y="30" font-family="Calibri,Arial,sans-serif" font-size="16" text-anchor="middle" font-weight="bold">Módulos del frontend</text>\n'
    s += box(80, 80, 180, 40, 'src/app')
    s += arrow(260, 100, 320, 100)
    s += box(320, 80, 140, 40, 'Páginas')
    s += box(320, 160, 140, 40, 'components')
    s += box(320, 240, 140, 40, 'hooks')
    s += box(320, 320, 140, 40, 'lib')
    s += box(320, 400, 140, 40, 'context')
    s += '</svg>'
    write_svg('10_modulos_frontend', s)

def do11():
    s = common_head + '<text x="400" y="30" font-family="Calibri,Arial,sans-serif" font-size="16" text-anchor="middle" font-weight="bold">Módulos del backend</text>\n'
    s += box(80, 80, 180, 40, 'src/index.ts')
    s += arrow(260, 100, 320, 100)
    s += box(320, 80, 140, 40, 'routes')
    s += box(320, 160, 140, 40, 'controllers')
    s += box(320, 240, 140, 40, 'middleware')
    s += box(320, 320, 140, 40, 'config')
    s += box(320, 400, 140, 40, 'types')
    s += '</svg>'
    write_svg('11_modulos_backend', s)

def do12():
    s = common_head + '<text x="400" y="30" font-family="Calibri,Arial,sans-serif" font-size="16" text-anchor="middle" font-weight="bold">Flujo de moderación</text>\n'
    s += box(100, 100, 160, 50, 'Usuario reporta')
    s += arrow(260, 125, 360, 125)
    s += box(360, 100, 160, 50, 'Cola de revisión')
    s += arrow(520, 125, 620, 125)
    s += box(620, 100, 160, 50, 'Moderador revisa')
    s += box(360, 220, 160, 50, 'Decisión aprobar/rechazar')
    s += arrow(440, 270, 440, 370)
    s += box(320, 370, 160, 50, 'Anuncio aprobado')
    s += box(520, 370, 160, 50, 'Anuncio rechazado')
    s += '</svg>'
    write_svg('12_flujo_moderacion', s)

def do13():
    s = common_head + '<text x="400" y="30" font-family="Calibri,Arial,sans-serif" font-size="16" text-anchor="middle" font-weight="bold">Flujo de sugerencias y propuestas</text>\n'
    s += box(80, 80, 160, 50, 'Usuario')
    s += arrow(240, 105, 320, 105)
    s += box(320, 80, 160, 50, 'Enviar sugerencia')
    s += box(320, 180, 160, 50, 'Enviar propuesta')
    s += arrow(480, 205, 560, 205)
    s += box(560, 180, 160, 50, 'Almacenar en BD')
    s += arrow(620, 235, 620, 320)
    s += box(560, 320, 160, 50, 'Panel de revisión')
    s += '</svg>'
    write_svg('13_flujo_sugerencias_propuestas', s)

def do14():
    s = common_head + '<text x="400" y="30" font-family="Calibri,Arial,sans-serif" font-size="16" text-anchor="middle" font-weight="bold">Flujo de comunidad</text>\n'
    s += box(80, 80, 160, 50, 'Usuario')
    s += arrow(240, 105, 320, 105)
    s += box(320, 80, 160, 50, 'Publicar post')
    s += arrow(480, 105, 560, 105)
    s += box(560, 80, 160, 50, 'Comentar y dar like')
    s += box(320, 180, 160, 50, 'Reportar publicación')
    s += arrow(480, 205, 560, 205)
    s += box(560, 180, 160, 50, 'Revisión del moderador')
    s += '</svg>'
    write_svg('14_flujo_comunidad', s)

if __name__ == '__main__':
    for f in ['01','02','03','04','05','06','07','08','09','10','11','12','13','14']:
        globals()['do'+f]()
    print('14 diagramas SVG creados en', BASE)
