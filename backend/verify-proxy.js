require('dotenv').config();
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const http = require('http');

async function get(port, params) {
  const c = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    database: process.env.DB_NAME || 'citypaj',
    user: process.env.DB_USER || 'citypaj_user',
    password: process.env.DB_PASSWORD || 'citypaj123'
  });
  const [rows] = await c.execute(
