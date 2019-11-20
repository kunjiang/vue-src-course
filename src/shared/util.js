/* @flow */

// 这里都是工具方法在 代码 中可能随处可用, 这里就是了解一下

export const emptyObject = Object.freeze({})

// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
export function isUndef (v: any): boolean %checks {
  return v === undefined || v === null
}

export function isDef (v: any): boolean %checks {
  return v !== undefined && v !== null
}

export function isTrue (v: any): boolean %checks {
  return v === true
}

export function isFalse (v: any): boolean %checks {
  return v === false
}

/**
 * Check if value is primitive.
 */
export function isPrimitive (value: any): boolean %checks {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
export function isObject (obj: mixed): boolean %checks {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value, e.g., [object Object].
 */
const _toString = Object.prototype.toString

export function toRawType (value: any): string {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
export function isPlainObject (obj: any): boolean {
  return _toString.call(obj) === '[object Object]'
}

export function isRegExp (v: any): boolean {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
export function isValidArrayIndex (val: any): boolean {
  const n = parseFloat(String(val))
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

export function isPromise (val: any): boolean {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}

/**
 * Convert a value to a string that is actually rendered.
 */
export function toString (val: any): string {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2) // 粗略的将引用类型转换为 JSON
      : String(val) // 粗略的将 基本类型 值 转换成 字符串
}

/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
export function toNumber (val: string): number | string {
  const n = parseFloat(val)
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 * 
 * makeMap 生成一个带有缓存的 函数, 用于判断 数据是否是缓存中的数据, 
 * 代表 判断字符串 ( 标签名 ) 是否为内置的 HTML 标签
 */
export function makeMap (
  str: string,
  expectsLowerCase?: boolean
): (key: string) => true | void {
  const map = Object.create(null)
  const list: Array<string> = str.split(',')
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase
    ? val => map[val.toLowerCase()]
    : val => map[val]
}

/**
 * Check if a tag is a built-in tag.
 */
export const isBuiltInTag = makeMap('slot,component', true)

/**
 * Check if an attribute is a reserved attribute.
 */
export const isReservedAttribute = makeMap('key,ref,slot,slot-scope,is')

/**
 * Remove an item from an array.
 */
export function remove (arr: Array<any>, item: any): Array<any> | void {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether an object has the property.
 */
const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn (obj: Object | Array<*>, key: string): boolean {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 * 
 * 面试经常会面到的方法: 生成带有缓存的 函数 ( 闭包的应用 )
 */
export function cached<F: Function> (fn: F): F {
  const cache = Object.create(null)
  return (function cachedFn (str: string) {
    const hit = cache[str] // 如果已缓存, hit 就是有数据的, 如果为缓存 hit 就是 undefined
    return hit || (cache[str] = fn(str))
  }: any)
}

/**
 * 等价代码
 * 
 * let hit = cached[ str ];
 * if ( hit === undefined ) {
 *   let res = fn( str );
 *   cached[ str ] = res;
 *   return res;
 * } else {
 *   return hit;
 * }
 */


/**
 * Camelize a hyphen-delimited string.
 */
const camelizeRE = /-(\w)/g
export const camelize = cached((str: string): string => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
})

/**
 * Capitalize a string.
 */
export const capitalize = cached((str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
})

/**
 * Hyphenate a camelCase string.
 */
const hyphenateRE = /\B([A-Z])/g
export const hyphenate = cached((str: string): string => {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
})


// vue 运行在浏览器中, 所以需要考虑性能
// 每次数据的更新 -> 虚拟 DOM 的生成( 模板解析的行为 ) -> 因此将经常使用的字符串与算法进行缓存
// 在垃圾回收的原则中有一个统计现象: "使用的越多的数据, 一般都会频繁的使用"
// 1. 每次创建一个数据, 我们就会考虑是否要将其回收
// 2. 在数据达到一定限额的时候, 就会考虑将数据回收 ( 回收不是实时 )
//   - 如果每次都有判断对象是否需要回收, 那么就需要遍历
//   - 将对象进行划分, 统计, 往往一个数据使用完以后就必须要使用了.
//   - 一个对象如果在一次回收之后还保留下来, 统计的结果是这个对象会比较持久在内存中驻留.
// 在模板中常常会使用 "指令", 在 vue 中一个 xxx-xxx-xxx 的形式出现的属性 
// 每次数据的更新都可能会带来 指令的 解析, 所以解析就是字符串处理, 一般会消耗一定的性能.





/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

/* istanbul ignore next */
function polyfillBind (fn: Function, ctx: Object): Function {
  function boundFn (a) {
    const l = arguments.length
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length
  return boundFn
}

function nativeBind (fn: Function, ctx: Object): Function {
  return fn.bind(ctx)
}

export const bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind

/**
 * Convert an Array-like object to a real Array.
 */
export function toArray (list: any, start?: number): Array<any> {
  start = start || 0
  let i = list.length - start
  const ret: Array<any> = new Array(i)
  while (i--) {
    ret[i] = list[i + start]
  }
  return ret
}

/**
 * Mix properties into target object.
 */
export function extend (to: Object, _from: ?Object): Object {
  for (const key in _from) {
    to[key] = _from[key]
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
export function toObject (arr: Array<any>): Object {
  const res = {}
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i])
    }
  }
  return res
}

/* eslint-disable no-unused-vars */

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
export function noop (a?: any, b?: any, c?: any) {} // 什么也不做, 用来占位置

/**
 * Always return false.
 */
export const no = (a?: any, b?: any, c?: any) => false

/* eslint-enable no-unused-vars */

/**
 * Return the same value.
 */
export const identity = (_: any) => _

/**
 * Generate a string containing static keys from compiler modules.
 */
export function genStaticKeys (modules: Array<ModuleOptions>): string {
  return modules.reduce((keys, m) => {
    return keys.concat(m.staticKeys || [])
  }, []).join(',')
}



// 在面试中可能会遇到, 思想重要
// 比较两个对象是否是相等的 两个对象
// 1. js 中对象是无法使用 == 来比较的, 比是地址
// 2. 我们一般会定义如果对象的各个属性值都相等 那么对象就是相等的对象. 例如: {} 就与 {} 相等.
// 算法描述
// 1. 假定对象 a 和 b
// 2. 遍历 a 中的成员, 判断是否每一个 a 中的成员都在 b 中. 并且 与 b 中的对应成员相等.
// 3. 再遍历 b 中的成员, 判断是否每一个 b 中的成员都在 a 中. 并且 与 a 中的对应成员相等.
// 4. 如果成员是引用类型, 递归.

// 抽象一下, 判断两个集合是否相等

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
export function looseEqual (a: any, b: any): boolean {
  if (a === b) return true
  const isObjectA = isObject(a)
  const isObjectB = isObject(b)
  if (isObjectA && isObjectB) {
    try {
      const isArrayA = Array.isArray(a)
      const isArrayB = Array.isArray(b)
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every((e, i) => {
          return looseEqual(e, b[i]) // b 包含 a
        })
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime() // 单独处理 Date 类型, 时间戳应该是一样的
      } else if ( 0 ) {
        // 如果需要考虑其它类型, 添加 if 即可
      } else if (!isArrayA && !isArrayB) {
        const keysA = Object.keys(a)
        const keysB = Object.keys(b)
        // 先判断 key 的长度, 再判断 a 包含于 b
        return keysA.length === keysB.length && keysA.every(key => {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */
export function looseIndexOf (arr: Array<mixed>, val: mixed): number {
  for (let i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) return i
  }
  return -1
}




// 让一个事件 ( 一个函数 ) 只允许调用一次
// 在 vue 中有函数方法 ( on, off 等, once ), once 事件就是这个思路
/**
 * Ensure a function is called only once.
 */
export function once (fn: Function): Function {
  let called = false // 是否调用过
  return function () {
    if (!called) {
      called = true
      fn.apply(this, arguments)
    }
  }
}
