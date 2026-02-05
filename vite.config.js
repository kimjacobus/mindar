import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    // Helpful when testing on phones on the same Wi‑Fi.
    host: true,
    port: 5173, 
  
       allowedHosts: [
      ".ngrok-free.app",   // allow any subdomain
      "localhost",
      "127.0.0.1"
    ]
  }
});
