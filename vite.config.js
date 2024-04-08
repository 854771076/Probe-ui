// vite.config.ts
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni';
export default defineConfig({
  // ...
  plugins: [
    // ...
	uni()

	
  ],
  server: {
    host: '0.0.0.0',  // 修改为你要使用的 IP
    port: 8080,  // 修改为你要使用的端口
    strictPort: true
  }
})