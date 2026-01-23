// import fs from 'fs';
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//     plugins: [react()],
//     server: {
//         host: '192.168.209.129',
//         port: 5173,
//         https: {
//             key: fs.readFileSync('./192.168.209.129-key.pem'),
//             cert: fs.readFileSync('./192.168.209.129.pem')
//         }
//     }
// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()]
});
