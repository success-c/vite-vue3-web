import { defineConfig } from "vite";
import { resolve } from "path";
import { createHtmlPlugin } from "vite-plugin-html";

import vue from "@vitejs/plugin-vue";
import vueSetupExtend from "vite-plugin-vue-setup-extend-plus";
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),

    // name可以写在script上
    vueSetupExtend(),
    createHtmlPlugin({
      inject: {
        data: {
          env: process.env
        }
      }
    })
  ],
  resolve: {
    alias: {
      "@": resolve("./src")
    },
    extensions: [".js", ".ts", ".json", ".jsx", ".tsx"]
  },
  build: {
    // 浏览器兼容性  “esnext | modules”
    target: "modules",
    outDir: "./dist",
    // 构建后是否生成 sourcemap 文件
    sourcemap: false,
    // 块大小警告大小限制(kb)
    chunkSizeWarningLimit: 1000,
    /** Vite 2.6.x 以上需要配置 minify: "terser", terserOptions 才能生效 */
    minify: "terser",
    /** 在打包代码时移除 console.log、debugger 和 注释 */
    terserOptions: {
      //打包后移除console和注释
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.log"]
      },
      format: {
        /** 删除注释 */
        comments: false
      }
    },

    /** 打包后静态资源目录 */
    assetsDir: "static",
    rollupOptions: {
      output: {
        entryFileNames: "static/js/[name].[hash].js",
        // 用于命名代码拆分时创建的共享块的输出命名
        chunkFileNames: "static/js/[name].[hash].js",
        // 用于输出静态资源的命名，[ext]表示文件扩展名
        assetFileNames: "static/[ext]/[name].[hash].[ext]"
      }
    }
  },

  server: {
    port: 9000
  }
});
