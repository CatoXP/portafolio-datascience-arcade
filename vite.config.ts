import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Project page served from https://<user>.github.io/portafolio-datascience-arcade/
// Leading and trailing slash are both required. Keeping this as a literal
// (rather than a NODE_ENV ternary) means the dev server also runs under the
// subdirectory, so base-path mistakes surface locally instead of after deploy.
export default defineConfig({
  base: '/portafolio-datascience-arcade/',
  plugins: [react()],
  build: {
    target: 'es2020',
  },
});
