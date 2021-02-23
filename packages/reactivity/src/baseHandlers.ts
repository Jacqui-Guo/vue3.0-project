// 实现new proxy(target,handler)
// 可变的处理程序
/**
 * 是不是仅读的，仅读的属性set时会报异常
 * 是不是深度的
 */

import { assign, isObject } from "@vue/shared/src";
import { reactive, readonly } from "./reactive";

// 拦截设置的功能
function createGetter(isReadonly = false,shallow = false) { 
    return function get(target: object,key: string | number | symbol,receiver: any) {
        // proxy + reflect 连用
        /**
         * reflect: 后续object上的方法，会被迁移到reflect上 eg: Reflect.getProptypeof()
         * 以前target[key] = value; 方式设置值可能会失败，并不会报异常，也没有返回值标识
         * Reflect方法具备返回值
         */
        const res = Reflect.get(target,key,receiver)
        if(!isReadonly) {
            // 收集依赖，数据变化后更新对应的试图
        }
        if(shallow) {
            return res;
        }
        if(isObject(res)) { // 是对象，要考虑递归
            // vue2是一上来就递归，vue3是当取值时会进行代理，vue3的代理模式是懒代理
            return isReadonly ? readonly(res) : reactive(res)
        }
        return res;
    }
} 

const get = createGetter();
const shallowGet = createGetter(false,true);
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true,true);

// 拦截获取的功能
function createSetter(shallow = false) { 
    return function set(target: object,key: string | number | symbol,value: any,receiver: any) {
        const res = Reflect.set(target,key,value,receiver);
        return res;
    }
}

const set = createSetter();
const shallowSet = createSetter();

let readonlyObj = {
    set: (target: any,key: any)=>{
        console.warn(`${target} set on key ${key} failed`);
    }
};

export const mutableHandlers = {
    get,
    set
} 
export const shallowReactiveHandlers = {
    get: shallowGet,
    set: shallowSet
};

export const readonlyHandlers = assign({
    get: readonlyGet
},readonlyObj);

export const shallowReadonlyHandlers = assign({
    get: shallowReadonlyGet
},readonlyObj);
