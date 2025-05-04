import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // 🔧 clé pour que les chemins soient relatifs dans le build
  plugins: [react()],
});
