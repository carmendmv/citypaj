#!/bin/bash
cd /mnt/c/Users/Carmen/Documents/TFG-2DAW/citypaj/backend
node -e "
const mysql=require('mysql2/promise');
mysql.createConnection({host:'localhost',port:3306,database:'citypaj',user:'citypaj_user',password:'citypaj123'}).then(async c=>{
  const [r]=await c.execute('SELECT 1 as ok, DATABASE() as db');
  console.log('WSL MySQL OK', r[0]);
  await c.end();
}).catch(e=>console.error('WSL MySQL ERROR:', e.message));
"
