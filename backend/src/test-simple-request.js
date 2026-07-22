const http = require('http');

async function testRequest() {
  console.log('🔍 TEST SIMPLE REQUEST');
  console.log('=' .repeat(30));
  
  const options = {
    hostname: 'localhost',
    port: 3002,
    path: '/api/anuncios?pagina=1&limite=3',
    method: 'GET'
  };
  
  const req = http.request(options, (res) => {
    console.log(`   Status: ${res.statusCode}`);
    console.log(`   Headers: ${JSON.stringify(res.headers, null, 2)}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log(`   Response length: ${data.length} caracteres`);
      console.log(`   Response preview: ${data.substring(0, 200)}...`);
      
      if (res.statusCode === 200) {
        console.log('   ✅ REQUEST EXITOSO');
        try {
          const jsonData = JSON.parse(data);
          console.log(`   📊 Success: ${jsonData.success}`);
          console.log(`   📊 Data length: ${jsonData.data?.length || 0}`);
          console.log(`   📊 Total: ${jsonData.meta?.total || 0}`);
        } catch (parseError) {
          console.log(`   ❌ Error parsing JSON: ${parseError.message}`);
        }
      } else {
        console.log(`   ❌ REQUEST FALLÓ: ${res.statusCode}`);
        try {
          const errorData = JSON.parse(data);
          console.log(`   📊 Error: ${errorData.error}`);
          if (errorData.details) console.log(`   📊 Details: ${errorData.details}`);
        } catch (parseError) {
          console.log(`   📊 Raw error: ${data}`);
        }
      }
    });
  });
  
  req.on('error', (error) => {
    console.log(`   ❌ Error de conexión: ${error.message}`);
  });
  
  req.setTimeout(5000, () => {
    console.log('   ❌ Timeout');
    req.destroy();
  });
  
  req.end();
  
  console.log('📋 Request enviado, esperando respuesta...');
}

testRequest();
