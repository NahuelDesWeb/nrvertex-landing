import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 300,
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), 'index.html'),
        contacto: resolve(process.cwd(), 'contacto.html'),
        floreria: resolve(process.cwd(), 'src/casos/florerializ.html'),
        albornoz: resolve(process.cwd(), 'src/casos/albornoz-obras.html'),
        blog: resolve(process.cwd(), 'blog.html'),
        como_aparecer_google_maps: resolve(process.cwd(), 'blog/como-aparecer-google-maps.html'),
        porque_mi_negocio_no_aparece: resolve(process.cwd(), 'blog/porque-mi-negocio-no-aparece.html'),
        seo_local_caba: resolve(process.cwd(), 'blog/seo-local-caba.html'),
        google_business_profile_pymes: resolve(process.cwd(), 'blog/google-business-profile-pymes.html'),
        como_aparecer_primero_google: resolve(process.cwd(), 'blog/como-aparecer-primero-google.html'),
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('gsap')) return 'vendor-gsap';
            if (id.includes('lenis')) return 'vendor-lenis';
            return 'vendor-core';
          }
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.info', 'console.debug']
      }
    },
    cssCodeSplit: true,
  },
  optimizeDeps: {
    include: ['lenis', 'gsap']
  }
});
