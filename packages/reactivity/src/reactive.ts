import { isObject } from "@vue/shared/src";
import {mutableHandlers,shallowReactiveHandlers,readonlyHandlers,shallowReadonlyHandlers} from './baseHandlers';
/**
 * 希望整个数据都变成响应式的
 */

export function reactive(target: any) {
    return createReactiveObject(target,false,mutableHandlers); // 读取的对象，是不是仅读的，
}

/**
 * 希望一个数据只有第一层能变成响应式的
 */
export function shallowReactive(target: any) {
    return createReactiveObject(target,false,shallowReactiveHandlers); 
}

/**
 * 数据是只读的，不能修改
 */
export function readonly(target: any) {
    return createReactiveObject(target,true,readonlyHandlers); 
}

/**
 * 数据可读，且只有第一层是可以修改的
 */
export function shallowReadonly(target: any) {
    return createReactiveObject(target,true,shallowReadonlyHandlers); 
}

// 是不是仅读，是不是深度，每个方法根据不同的参数实现不同的功能(函数克里化)
/**
 * 最核心的需要拦截 new Proxy()
 * 以及数据的修改和读取 get set
 */

/**
 * WeakMap: 会自动辣椒回收，不会造成内存泄漏，存储的key只能是对象
 */ 
const reactiveMap = new WeakMap();
const readonlyMap = new WeakMap(); 

// 创建响应式函数

// 拦截的目标，是否是只读的，响应式函数(四种函数的响应式函数都不同)
export function createReactiveObject(target: any,isReadonly: boolean,baseHandlers: {}) {
    // 如果目标不是对象 就没法拦截了
    if(!isObject(target)) return target;  // reactive这个api只能拦截对象类型

    const proxyMap =  isReadonly ? readonlyMap : reactiveMap;

    // 判断对象是否已经被代理过
    const existProxy = proxyMap.get(target);
    if(existProxy) return existProxy; // 如果已经被代理直接返回

    // 如果某个对象已经被代理过了，就不要再次代理了  (可能一个对象被代理是深度，又被仅读代理了)
    const proxy = new Proxy(target,baseHandlers);

    proxyMap.set(target,proxy); // 将要代理的对象和对应代理结果缓存起来

    return proxy;
}
