import { defineConfig } from "rollup";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";

export default defineConfig({
    input: "src/calculator.js",
    output: [
        {
            file: "dist/calculator.esm.js",
            format: "esm",   // modern ESM import eg: import { DraggableCalculator } from 'draggable-calculator';
        },
        {
            file: "dist/calculator.cjs.js",
            format: "cjs",   // CommonJS (Node, older bundlers) eg: const { DraggableCalculator } = require('draggable-calculator');
        },
        {
            file: "dist/calculator.iife.js",
            format: "iife",  // <script> tag support in browsers eg: <script src="dist/calculator.iife.js"></script>
            name: "DraggableCalculator",
        },
    ],
    plugins: [resolve(), commonjs(), terser()],
});
