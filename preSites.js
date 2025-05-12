import shell from "shelljs";

// 复制@opentinyvue/vue-docs包到本地
shell.cp("-R", "node_modules/@opentinyvue/vue-docs", "sites");

// 删除一些不需要的依赖
const pkg = JSON.parse(shell.cat("sites/package.json"));
delete pkg.devDependencies["@opentiny-internal/unplugin-virtual-template"];
delete pkg.devDependencies["@opentiny/vue-mobile"];
pkg.scripts["build"] = "vite build --mode pages";
shell.ShellString(JSON.stringify(pkg, null, 2)).to("sites/package.json");

// 修改sites/vite.config.js
const file = "sites/vite.config.ts";
const configJs = shell.cat(file);
const newConfigJs = configJs
  .split("\n")
  .filter((row) => !row.includes("virtualTemplatePlugin"))
  .filter((row) => !row.includes("getAlias"))
  .filter((row) => !row.includes("@mobile-root"))
  .filter((row) => !row.includes("getOptimizeDeps"))
  .filter((row) => !row.includes("@opentiny/vue-renderless/types"))
  .filter((row) => !row.includes("@opentiny/vue-vite-import"))
  .map((row) => (row.includes("importPlugin([") ? "/*" + row : row))
  .filter((row) => !row.includes("vite-plugin-dynamic-import"))
  .map((row) => (row.includes("dynamicImportPlugin()") ? row + "*/" : row));

shell.ShellString(newConfigJs.join("\n")).to(file);

// 修复该.env.pages文件
const envFile = "sites/env/.env.pages";
const envConfig = shell.cat(envFile);
const newEnvConfig = envConfig.split("\n").map((row) => {
  if (row.includes("/playground.html")) {
    return row.replace(
      /VITE_PLAYGROUND_URL=(.+)playground.html/,
      "VITE_PLAYGROUND_URL=/tiny-vue-web-doc/playground.html"
    );
  }
  return row;
});

shell.ShellString(newEnvConfig.join("\n")).to(envFile);
