import { defineConfig, esmExternalRequirePlugin } from "vite";

export default defineConfig({
  // use-async-effect is CJS and calls require("react")
  plugins: [esmExternalRequirePlugin({ external: ["react"] })],
  build: {
    lib: {
      entry: "src/index.js",
      formats: ["es"],
      fileName: () => "index.min.js",
    },
    // Lib mode keeps whitespace in ES output by default
    rollupOptions: { output: { minify: true } },
  },
});
