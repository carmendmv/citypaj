#!/bin/bash
cd /mnt/c/Users/Carmen/Documents/TFG-2DAW/citypaj/backend
nohup node dist/index.js > /mnt/c/Users/Carmen/Documents/TFG-2DAW/citypaj/backend/backend.log 2>&1 &
echo "Backend iniciado en segundo plano, PID $!"
echo "Ver logs en backend/backend.log"
