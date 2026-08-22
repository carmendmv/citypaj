# -*- coding: utf-8 -*-
import os, re

BASE = r'C:\Users\Carmen\Documents\TFG-2DAW\citypaj\docs\memoria'
files = ['contenido_1.py', 'contenido_2.py', 'contenido_3.py', 'contenido_4.py', 'contenido_5.py']

replacements = [
    (r'(?i)\bse ha aprendido\b', 'se ha adquirido'),
    (r'(?i)\baprendido\b', 'adquirido'),
    (r'(?i)\bcomo alumna\b', 'como estudiante'),
    (r'(?i)\bcomo estudiante\b', 'desde la perspectiva del estudiante'),
    (r'(?i)\bpuesto en práctica\b', 'aplicado'),
    (r'(?i)\breto técnico\b', 'desafío técnico'),
    (r'(?i)\bun reto\b', 'un desafío'),
    (r'(?i)\bmuy complejo\b', 'de notable complejidad'),
    (r'(?i)\bmuy útil\b', 'de gran utilidad'),
    (r'(?i)\bun poco\b', 'parcialmente'),
    (r'(?i)\bben\b\s*\bhecho\b', 'en efecto'),
    (r'(?i)\bes muy\b', 'es sumamente'),
    (r'(?i)\bha sido\b\s*\bmuy\b', 'ha sido sumamente'),
    (r'(?i)\btambién\b', 'asimismo'),
    (r'(?i)\bademás\b', 'adicionalmente'),
    (r'(?i)\bpor eso\b', 'por ello'),
    (r'(?i)\bes por eso\b', 'es por ello'),
    (r'(?i)\bporque\b', 'dado que'),
    (r'(?i)\bya que\b', 'puesto que'),
    (r'(?i)\bentonces\b', 'en consecuencia'),
    (r'(?i)\baunque\b', 'a pesar de que'),
    (r'(?i)\bpues\b', 'en efecto'),
    (r'(?i)\bcreo que\b', 'se considera que'),
    (r'(?i)\bme parece\b', 'resulta pertinente'),
    (r'(?i)\bse ve\b', 'se observa'),
    (r'(?i)\bse nota\b', 'se aprecia'),
    (r'(?i)\bno está mal\b', 'resulta adecuado'),
    (r'(?i)\bbien\b', 'correctamente'),
    (r'(?i)\bse ha hecho\b', 'se ha realizado'),
    (r'(?i)\bhay que\b', 'es necesario'),
    (r'(?i)\bse puede\b', 'es posible'),
    (r'(?i)\bse quiere\b', 'se pretende'),
    (r'(?i)\bse busca\b', 'se pretende'),
    (r'(?i)\bse trata de\b', 'consiste en'),
    (r'(?i)\bpara que\b', 'con el fin de que'),
    (r'(?i)\bde cara a\b', 'con miras a'),
    (r'(?i)\bal final\b', 'en definitiva'),
    (r'(?i)\ben resumen\b', 'en síntesis'),
    (r'(?i)\bsobre todo\b', 'principalmente'),
    (r'(?i)\bmuchas\b', 'numerosas'),
    (r'(?i)\bmuchos\b', 'numerosos'),
    (r'(?i)\bpoco a poco\b', 'progresivamente'),
    (r'(?i)\bde golpe\b', 'de manera conjunta'),
    (r'(?i)\bdel tirón\b', 'de manera conjunta'),
    (r'(?i)\bqueda\b\s*\bclaro\b', 'resulta evidente'),
    (r'(?i)\bva a\b', 'va a'),
    (r'(?i)\bles da\b', 'proporciona'),
    (r'(?i)\bpermite a\b', 'facilita a'),
    (r'(?i)\bse encarga de\b', 'gestiona'),
    (r'(?i)\bse encarga\b', 'asume la responsabilidad'),
]

for f in files:
    path = os.path.join(BASE, f)
    if not os.path.exists(path):
        continue
    with open(path, 'r', encoding='utf-8') as fh:
        text = fh.read()
    for pat, rep in replacements:
        text = re.sub(pat, rep, text)
    with open(path, 'w', encoding='utf-8') as fh:
        fh.write(text)
    print(f'Tono mejorado en {f}')
