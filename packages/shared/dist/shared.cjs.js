'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const isObject = (value) => typeof value == 'object' && value !== null;
// 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象
// 类似于 es6中的 ... 展开运算符
const assign = Object.assign;

exports.assign = assign;
exports.isObject = isObject;
//# sourceMappingURL=shared.cjs.js.map
