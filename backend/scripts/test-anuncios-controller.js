const { getAnuncios } = require('../dist/controllers/anuncios-mysql');

const mockRes = {
  status(code) { this.code = code; return this; },
  json(data) { console.log('status:', this.code, 'data:', JSON.stringify(data, null, 2)); },
};

const mockReq = {
  query: { limit: '5', ordenar: 'creado-desc' },
};

getAnuncios(mockReq, mockRes).catch(err => {
  console.error('UNCAUGHT ERROR:', err);
});
