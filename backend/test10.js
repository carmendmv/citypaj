const { getAnuncios } = require('./dist/controllers/anuncios-mysql');

const req = {
  query: { limit: '10', ordenar: 'creado-desc' }
};
let resBody = null;
let resStatus = 200;
const res = {
  status: (code) => { resStatus = code; return res; },
  json: (body) => { resBody = body; }
};

getAnuncios(req, res).then(() => {
  console.log('Status:', resStatus);
  console.log('Body keys:', Object.keys(resBody || {}));
  console.log('Data length:', resBody?.data?.length);
  if (resBody?.data?.length > 0) {
    console.log('First item:', JSON.stringify(resBody.data[0], null, 2));
  } else {
    console.log('Full body:', JSON.stringify(resBody, null, 2));
  }
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
