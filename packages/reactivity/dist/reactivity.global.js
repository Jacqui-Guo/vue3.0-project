var VueReactivity = (function (exports) {
    'use strict';

    const isObject = (value) => typeof value == 'object' && value !== null;
    // 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象
    // 类似于 es6中的 ... 展开运算符
    const assign = Object.assign;

    // 实现new proxy(target,handler)
    // 拦截设置的功能
    function createGetter(isReadonly = false, shallow = false) {
        return function get(target, key, receiver) {
            // proxy + reflect 连用
            /**
             * reflect: 后续object上的方法，会被迁移到reflect上 eg: Reflect.getProptypeof()
             * 以前target[key] = value; 方式设置值可能会失败，并不会报异常，也没有返回值标识
             * Reflect方法具备返回值
             */
            const res = Reflect.get(target, key, receiver);
            if (shallow) {
                return res;
            }
            if (isObject(res)) { // 是对象，要考虑递归
                // vue2是一上来就递归，vue3是当取值时会进行代理，vue3的代理模式是懒代理
                return isReadonly ? readonly(res) : reactive(res);
            }
            return res;
        };
    }
    const get = createGetter();
    const shallowGet = createGetter(false, true);
    const readonlyGet = createGetter(true);
    const shallowReadonlyGet = createGetter(true, true);
    // 拦截获取的功能
    function createSetter(shallow = false) {
        return function set(target, key, value, receiver) {
            const res = Reflect.set(target, key, value, receiver);
            return res;
        };
    }
    const set = createSetter();
    const shallowSet = createSetter();
    let readonlyObj = {
        set: (target, key) => {
            console.warn(`${target} set on key ${key} failed`);
        }
    };
    const mutableHandlers = {
        get,
        set
    };
    const shallowReactiveHandlers = {
        get: shallowGet,
        set: shallowSet
    };
    const readonlyHandlers = assign({
        get: readonlyGet
    }, readonlyObj);
    const shallowReadonlyHandlers = assign({
        get: shallowReadonlyGet
    }, readonlyObj);

    /**
     * 希望整个数据都变成响应式的
     */
    function reactive(target) {
        return createReactiveObject(target, false, mutableHandlers); // 读取的对象，是不是仅读的，
    }
    /**
     * 希望一个数据只有第一层能变成响应式的
     */
    function shallowReactive(target) {
        return createReactiveObject(target, false, shallowReactiveHandlers);
    }
    /**
     * 数据是只读的，不能修改
     */
    function readonly(target) {
        return createReactiveObject(target, true, readonlyHandlers);
    }
    /**
     * 数据可读，且只有第一层是可以修改的
     */
    function shallowReadonly(target) {
        return createReactiveObject(target, true, shallowReadonlyHandlers);
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
    function createReactiveObject(target, isReadonly, baseHandlers) {
        // 如果目标不是对象 就没法拦截了
        if (!isObject(target))
            return target;
        const proxyMap = isReadonly ? readonlyMap : reactiveMap;
        // 判断对象是否已经被代理过
        const existProxy = proxyMap.get(target);
        if (existProxy)
            return existProxy; // 如果已经被代理直接返回
        // 如果某个对象已经被代理过了，就不要再次代理了  (可能一个对象被代理是深度，又被仅读代理了)
        const proxy = new Proxy(target, baseHandlers);
        proxyMap.set(target, proxy); // 将要代理的对象和对应代理结果缓存起来
        return proxy;
    }

    exports.reactive = reactive;
    exports.readonly = readonly;
    exports.shallowReactive = shallowReactive;
    exports.shallowReadonly = shallowReadonly;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

}({}));
//# sourceMappingURL=reactivity.global.js.map
