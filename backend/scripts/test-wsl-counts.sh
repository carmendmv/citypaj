#!/bin/bash
cd /mnt/c/Users/Carmen/Documents/TFG-2DAW/citypaj/backend
node -e "
const mysql=require('mysql2/promise');
mysql.createConnection({host:'localhost',port:3306,database:'citypaj',user:'citypaj_user',password:'citypaj123'}).then(async c=>{
  const [anuncios]=await c.execute('SELECT COUNT(*) as total FROM anuncios');
  const [usuarios]=await c.execute('SELECT COUNT(*) as total FROM usuarios');
  const [sugerencias]=await c.execute('SELECT COUNT(*) as total FROM sugerencias');
  console.log('anuncios:', anuncios[0].total, 'usuarios:', usuarios[0].total, 'sugerencias:', sugerencias[0].total);
  await c.end();
}).catch(e=>console.error('ERROR', e.message));
"
