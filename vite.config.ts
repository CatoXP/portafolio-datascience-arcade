import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Project page served from https://<user>.github.io/portfolio-for-fun/
// Leading and trailing slash are both required. Keeping this as a literal
// (rather than a NODE_ENV ternary) means the dev server also runs under the
// subdirectory, so base-path mistakes surface locally instead of after deploy.
export default defineConfig({
  base: '/portfolio-for-fun/',
  plugins: [react()],
  build: {
    target: 'es2020',
  },
});
