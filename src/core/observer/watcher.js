/* @flow */

import {
  warn,
  remove,
  isObject,
  parsePath,
  _Set as Set,
  handleError,
  noop
} from '../util/index'

import { traverse } from './traverse'
import { queueWatcher } from './scheduler'
import Dep, { pushTarget, popTarget } from './dep'

import type { SimpleSet } from '../util/index'

let uid = 0

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
export default class Watcher {
  vm: Component;
  expression: string; // 关联表达式 或 渲染方法体
  cb: Function; // 在定义 Vue 构造函数的时候, 传入的 watch 
  id: number;
  deep: boolean;
  user: boolean;
  lazy: boolean; // 计算属性, 和 watch 来控制不要让 Watcher 立即执行
  sync: boolean;
  dirty: boolean;
  active: boolean;
                        // 在 Vue 中使用了 二次提交的概念
                        // 每次在数据 渲染 或 计算的时候 就会访问响应式的数据, 就会进行依赖收集
                        // 就将关联的 Watcher 与 dep 相关联,
                        // 在数据发生变化的时候, 根据 dep 找到关联的 watcher, 依次调用 update
                        // 执行完成后会清空 watcher
  deps: Array<Dep>;
  depIds: SimpleSet;
  
  newDeps: Array<Dep>;
  newDepIds: SimpleSet;
  
  before: ?Function; // Watcher 触发之前的, 类似于 生命周期


  getter: Function; // 就是 渲染函数 ( 模板或组件的渲染 ) 或 计算函数 ( watch )
  
  value: any; // 如果是渲染函数, value 无效; 如果是计算属性, 就会有一个值, 值就存储在 value 中

  constructor (
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: ?Object,
    isRenderWatcher?: boolean
  ) {
    this.vm = vm
    if (isRenderWatcher) {
      vm._watcher = this
    }
    vm._watchers.push(this)

    // options
    if (options) {
      this.deep = !!options.deep
      this.user = !!options.user
      this.lazy = !!options.lazy
      this.sync = !!options.sync
      this.before = options.before
    } else {
      this.deep = this.user = this.lazy = this.sync = false
    }
    this.cb = cb
    this.id = ++uid // uid for batching
    this.active = true
    this.dirty = this.lazy // for lazy watchers
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()

    this.expression = process.env.NODE_ENV !== 'production'
      ? expOrFn.toString()
      : ''

    
    // parse expression for getter
    if (typeof expOrFn === 'function') { // 就是 render 函数
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
      if (!this.getter) {
        this.getter = noop
        process.env.NODE_ENV !== 'production' && warn(
          `Failed watching path: "${expOrFn}" ` +
          'Watcher only accepts simple dot-delimited paths. ' +
          'For full control, use a function instead.',
          vm
        )
      }
    }


    // 如果是 lazy 就什么也不做, 否则就立即调用 getter 函数求值 ( expOrFn )
    this.value = this.lazy
      ? undefined
      : this.get()
  }

  /**
   * Evaluate the getter, and re-collect dependencies.
   */
  get () {
    pushTarget(this)
    let value
    const vm = this.vm
    try {
      value = this.getter.call(vm, vm)
    } catch (e) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      } else {
        throw e
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        traverse(value)
      }
      popTarget()
      this.cleanupDeps() // "清空" 关联的 dep 数据
    }
    return value
  }

  /**
   * Add a dependency to this directive.
   */
  addDep (dep: Dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      
      this.newDepIds.add(id)
      this.newDeps.push(dep) // 让 watcher 关联到 dep

      if (!this.depIds.has(id)) {
        dep.addSub(this) // 让 dep 关联到 watcher
      }
    }
  }

  /**
   * Clean up for dependency collection.
   */
  cleanupDeps () {
    let i = this.deps.length
    while (i--) {
      const dep = this.deps[i]
      if (!this.newDepIds.has(dep.id)) { // 在 二次提交中 归档就是 让 旧的 deps 和 新 的 newDeps 一致
        dep.removeSub(this)
      }
    }
    let tmp = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmp
    this.newDepIds.clear()
    tmp = this.deps
    this.deps = this.newDeps // 同步
    this.newDeps = tmp
    this.newDeps.length = 0
  }

  /**
   * Subscriber interface.
   * Will be called when a dependency changes.
   */
  update () {
    /* istanbul ignore else */
    if (this.lazy) {            // 主要针对计算属性, 一般用于求值计算
      this.dirty = true
    } else if (this.sync) {     // 同步, 主要用于 SSR, 同步就表示立即计算 
      this.run()
    } else {
      queueWatcher(this)        // 一般浏览器中的异步运行, 本质上就是异步执行 run
                                // 类比: setTimeout( () => this.run(), 0 )
    }
  }

  /**
   * Scheduler job interface.
   * Will be called by the scheduler.
   * 
   * 调用 get 求值或渲染, 如果求值, 新旧值不同, 触发 cb
   */
  run () {
    if (this.active) {
      const value = this.get() // 要么渲染, 要么求值
      if (
        value !== this.value ||
        // Deep watchers and watchers on Object/Arrays should fire even
        // when the value is the same, because the value may
        // have mutated.
        isObject(value) ||
        this.deep
      ) {
        // set new value
        const oldValue = this.value
        this.value = value
        if (this.user) {
          try {
            this.cb.call(this.vm, value, oldValue)
          } catch (e) {
            handleError(e, this.vm, `callback for watcher "${this.expression}"`)
          }
        } else {
          this.cb.call(this.vm, value, oldValue)
        }
      }
    }
  }

  /**
   * Evaluate the value of the watcher.
   * This only gets called for lazy watchers.
   */
  evaluate () {
    this.value = this.get()
    this.dirty = false
  }

  /**
   * Depend on all deps collected by this watcher.
   */
  depend () {
    let i = this.deps.length
    while (i--) {
      this.deps[i].depend()
    }
  }

  /**
   * Remove self from all dependencies' subscriber list.
   */
  teardown () {
    if (this.active) {
      // remove self from vm's watcher list
      // this is a somewhat expensive operation so we skip it
      // if the vm is being destroyed.
      if (!this.vm._isBeingDestroyed) {
        remove(this.vm._watchers, this)
      }
      let i = this.deps.length
      while (i--) {
        this.deps[i].removeSub(this)
      }
      this.active = false
    }
  }
}
