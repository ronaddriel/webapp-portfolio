import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
  base: './',
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        home: resolve(__dirname, "home.html"),
        about: resolve(__dirname, "about.html"),
        contact: resolve(__dirname, "contact.html"),
        resume: resolve(__dirname, "resume.html"),
        project1: resolve(__dirname, "1.html"),
        project2: resolve(__dirname, "2.html"),
        project3: resolve(__dirname, "3.html"),
        project4: resolve(__dirname, "4.html"),
        project5: resolve(__dirname, "5.html"),
      },
    },
  },
});
