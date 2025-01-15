import shell from "shelljs";

const replacePkgList = [
  "@opentiny/vue-common",
  "@opentiny/vue",
  "@opentiny/vue-design-saas",
  "@opentiny/vue-design-aurora",
  "@opentiny/vue-design-smb",
  "@opentiny/vue-hooks",
  "@opentiny/vue-directive",
  "@opentiny/vue-icon",
  "@opentiny/vue-icon-multicolor",
  "@opentiny/vue-theme",
  "@opentiny/vue-icon-saas",
  "@opentiny/vue-theme-saas",
  "@opentiny/vue-theme-mobile",
];

// 复制@opentiny/vue-docs包到本地
shell.cp("-R", "node_modules/@opentiny/vue-docs", "sites");

// 删除一些不需要的依赖
const pkg = JSON.parse(shell.cat("sites/package.json"));
delete pkg.devDependencies["@opentiny-internal/unplugin-virtual-template"];
delete pkg.devDependencies["@opentiny/vue-mobile"];
shell.ShellString(JSON.stringify(pkg, null, 2)).to("sites/package.json");

// 修改sites/vite.config.js
const file = "sites/vite.config.ts";
const configJs = shell.cat(file);
const newConfigJs = configJs
  .split("\n")
  .filter((row) => !row.includes("virtualTemplatePlugin"))
  .filter((row) => !row.includes("getAlias"))
  .filter((row) => !row.includes("getOptimizeDeps"))
  .filter((row) => !row.includes("@opentiny/vue-renderless/types"))
  .filter((row) => !row.includes("@opentiny/vue-vite-import"))
  .map((row) => (row.includes("importPlugin([") ? "/*" + row : row))
  .filter((row) => !row.includes("vite-plugin-dynamic-import"))
  .map((row) => (row.includes("dynamicImportPlugin()") ? row + "*/" : row));

shell.ShellString(newConfigJs.join("\n")).to(file);
