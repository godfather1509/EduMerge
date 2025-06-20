import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import flowbiteReact from "flowbite-react/plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), flowbiteReact()],
  define: {
    global: 'window',
    /*
    enable this to use AWS S3 bucket from frontend using 
    import AWS from 'aws-sdk'
    import S3 from 'aws-sdk/clients/s3'
    */
  },
})