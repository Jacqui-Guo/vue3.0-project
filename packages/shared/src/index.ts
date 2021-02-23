export const isObject = (value: null) => typeof value == 'object' && value !== null;  

// 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象
// 类似于 es6中的 ... 展开运算符
export const assign = Object.assign;