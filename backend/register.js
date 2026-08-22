const path = require('path');
const tsconfigPaths = require('tsconfig-paths');

// Registra los alias `@/` para que funcionen en producción con los archivos compilados en dist/
tsconfigPaths.register({
  baseUrl: path.join(__dirname),
  paths: {
    '@/*': ['dist/*'],
    '@/utils/*': ['dist/utils/*'],
    '@/middleware/*': ['dist/middleware/*'],
    '@/routes/*': ['dist/routes/*'],
    '@/controllers/*': ['dist/controllers/*'],
    '@/models/*': ['dist/models/*'],
    '@/types/*': ['dist/types/*']
  }
});
