// rollup 的配置 每次打包都会走这个配置
// rollup最终需要导出一个配置变量
import path from 'path';
import json from '@rollup/plugin-json'; // 解析json的插件
import resolvePlugin from "@rollup/plugin-node-resolve"; // 解析resolve的插件
import ts from 'rollup-plugin-typescript2';


// 根据环境变量中的target属性 获取对应模块中的package.json

/**
 * 1、先找到文件目录  
 * 2、找到要打包的某个包 process.env.TARGET
 * 3、去当前目录下找到packages.json
 */

const packagesDir = path.resolve(__dirname,'packages'); // 找到packages
const packageDir = path.resolve(packagesDir,process.env.TARGET); // 找到要打包的某个包

// 永远针对的是某个模块
const resolve = (p) => path.resolve(packageDir,p)

const pkg = require(resolve('package.json')); // packages.json 文件


// 执行 yarn run build 可以输出 要打包文件 配置文件的内容
// console.log('rollup-config',pkg);

// 对打包类型，先做一个映射表 根据你提供的formats来格式化需要打包的内容

/**
 * 打包之后文件的输出目录：
 *    需要打包的文件目录下的dist目录   
 *    打包之后的文件名  "module": "dist/shared.esm-bundler.js",
 */

const name =  path.basename(packageDir);

const outputConfig = { // 自定义的
    'esm-bundler': {
        file: resolve(`dist/${name}.esm-bundler.js`),
        format: 'es'
    },
    'cjs': {
        file: resolve(`dist/${name}.cjs.js`),
        format: 'cjs'
    },
    'global': {
        file: resolve(`dist/${name}.global.js`),
        format: 'iife' // 立即执行函数
    }
} 
const options = pkg.buildOptions;

function createConfig(format,output) {
    output.name = options.name;
    output.sourcemap = true;
    // 生成rollup配置
    return {
        input: resolve(`src/index.ts`), // 打包文件的入口文件
        output, // 打包输出文件路径
        plugins: [
            json(),
            resolvePlugin(), // 解析第三方模块
            ts({ // ts要用的话，必须要有一个ts.config.js 执行 npx tsc --init (执行这个命令其实就是执行node_modules/bin/tsc 这个命令)
                tsconfig: path.resolve(__dirname,'tsconfig.json')
            }), 
        ]
    }
}

export default options.formats.map(format => createConfig(format,outputConfig[format]))