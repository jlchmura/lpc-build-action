const esbuild = require("esbuild");
const path = require("path");

// ACTION
esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    banner: { js: "// Copyright 2024 John L Chmura\n" },
    outfile: 'dist/index.js',
    target: ["es2020"],
    platform: 'node',
    format: 'cjs',
    sourcemap: 'linked',
    mainFields: ['module','main'],
    logLevel: 'warning',
    treeShaking: true,
    minify: true,
    // resolve "lpc" from a sibling checkout of jlchmura/lpc-language-server
    alias: { "lpc": path.resolve(__dirname, "../lpc-language-server/server/src/lpc/lpc.ts") }
})
