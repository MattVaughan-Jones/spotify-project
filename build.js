const envFilePlugin = require('esbuild-envfile-plugin');

require('esbuild').build({
    outfile: './client/index.js',
    plugins: [envFilePlugin],
    entryPoints: ['./client/app.jsx'],
    bundle: true,
});
