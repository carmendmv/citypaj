# -*- coding: utf-8 -*-
import os
import glob
from svglib.svglib import svg2rlg
from reportlab.graphics import renderPM

BASE = r'C:\Users\Carmen\Documents\TFG-2DAW\citypaj\docs\memoria'
DIAG = os.path.join(BASE, 'diagramas')
OUT = os.path.join(DIAG, 'png')

os.makedirs(OUT, exist_ok=True)

def convert(name):
    src = os.path.join(DIAG, f'{name}.svg')
    dst = os.path.join(OUT, f'{name}.png')
    if not os.path.exists(src):
        print(f'No encontrado {src}')
        return
    drawing = svg2rlg(src)
    renderPM.drawToFile(drawing, dst, fmt='PNG')
    print(f'Convertido {dst}')

if __name__ == '__main__':
    files = sorted(glob.glob(os.path.join(DIAG, '*.svg')))
    for f in files:
        name = os.path.splitext(os.path.basename(f))[0]
        convert(name)
