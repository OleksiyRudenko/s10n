import project from "./package.json";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";

function buildBabelConfig() {
  return {
    babelrc: false,
    presets: [
      [
        "@babel/preset-env",
        {
          modules: false
          // exclude: ["transform-es2015-typeof-symbol"]
        }
      ]
    ],
    plugins: [
      // "external-helpers",
      "@babel/plugin-proposal-object-rest-spread"
    ],
    babelHelpers: "bundled"
  };
}

function buildConfigBuilder({ name, input, dist = "dist" }) {
  return ({
    format,
    transpiled = true,
    minified = false,
    includeExtension = true,
    extension = format,
    sourceMap = false
  }) => {
    function buildFileName() {
      return `${name}${includeExtension ? `.${extension}` : ""}${minified ? ".min" : ""}.js`;
    }

    function buildPlugins() {
      const plugins = [resolve(extension === "browser" ? { browser: true } : undefined)];
      if (transpiled) plugins.push(babel(buildBabelConfig()));
      if (minified) plugins.push(terser());
      if (format === "cjs") plugins.push(commonjs());
      return plugins;
    }

    console.log(">>", format, buildFileName(), dist);
    return {
      input: input,
      output: {
        name,
        format,
        file: dist + "/" + buildFileName(),
        // dir: dist,
        sourcemap: sourceMap,
        exports: "auto"
      },
      plugins: buildPlugins()
    };
  };
}

const buildConfig = buildConfigBuilder({
  name: project.name,
  input: "./src/s10n.js"
});

const configs = [
  buildConfig({ format: "amd" }),
  buildConfig({ format: "cjs" }),
  buildConfig({ format: "umd" }),
  buildConfig({
    format: "umd",
    minified: true,
    includeExtension: false,
    sourceMap: true
  }),
  buildConfig({ format: "iife", extension: "browser" }),
  buildConfig({
    format: "iife",
    extension: "browser",
    minified: true,
    sourceMap: true
  }),
  buildConfig({ format: "esm" }),
  buildConfig({ format: "system" })
];

export default configs;
