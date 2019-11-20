/* @flow */

import config from '../config'
import { initProxy } from './proxy'
import { initState } from './state'
import { initRender } from './render'
import { initEvents } from './events'
import { mark, measure } from '../util/perf'
import { initLifecycle, callHook } from './lifecycle'
import { initProvide, initInjections } from './inject'
import { extend, mergeOptions, formatComponentName } from '../util/index'


// 在 Vue 的源码中每一个类型的实例 都会有一个 唯一标识
let uid = 0

export function initMixin (Vue: Class<Component>) {

  Vue.prototype._init = function (options?: Object) {
    /** Vue 实例 */
    const vm: Component = this
    // a uid
    vm._uid = uid++

    // a flag to avoid this being observed
    vm._isVue = true

    // merge options
    if (options && options._isComponent) {
      // 开始进行源码分析, 一般都是使用简单的 Vue 实例, 这里是针对组件, 暂时略
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options)
    } else {
      vm.$options = mergeOptions(     // mergeOptions 可以简单的理解为合并, 为我们的 options 增加属性
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }

    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm)
    } else {
      vm._renderProxy = vm
    }


    // expose real self
    vm._self = vm

    initLifecycle(vm)                 // 初始化生命周期的 一些状态变量
    initEvents(vm)                    // 初始化事件的 容器
    initRender(vm)                    // 初始化创建元素的方法
    callHook(vm, 'beforeCreate')      // 调用生命周期函数
    initInjections(vm) // resolve injections before data/props // 初始化注入器 略
    initState(vm)                     // 重点, 初始化状态数据 ( data, property 等 )
    initProvide(vm) // resolve provide after data/props // 略
    callHook(vm, 'created')           // 生命周期函数的调用

    // 前面的代码是组件的创建
    // let app = new Vue( ... )
    // app.$mount( ... )

    if (vm.$options.el) {
      vm.$mount(vm.$options.el) // 组件的挂载, 将组件 挂载 到 el 描述的元素上
      // 会先调用 扩展的 那个 $mount 方法, 生成 render
      // 再调用 原始的 $mount 方法, 获得元素, 再调用 mountComponent 方法
      // 这两个方法都定义在 platforms/web 里面

    }
  }

}

export function initInternalComponent (vm: Component, options: InternalComponentOptions) {
  const opts = vm.$options = Object.create(vm.constructor.options)
  // doing this because it's faster than dynamic enumeration.
  const parentVnode = options._parentVnode
  opts.parent = options.parent
  opts._parentVnode = parentVnode

  const vnodeComponentOptions = parentVnode.componentOptions
  opts.propsData = vnodeComponentOptions.propsData
  opts._parentListeners = vnodeComponentOptions.listeners
  opts._renderChildren = vnodeComponentOptions.children
  opts._componentTag = vnodeComponentOptions.tag

  if (options.render) {
    opts.render = options.render
    opts.staticRenderFns = options.staticRenderFns
  }
}

export function resolveConstructorOptions (Ctor: Class<Component>) {
  let options = Ctor.options
  if (Ctor.super) {
    const superOptions = resolveConstructorOptions(Ctor.super)
    const cachedSuperOptions = Ctor.superOptions
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions
      // check if there are any late-modified/attached options (#4976)
      const modifiedOptions = resolveModifiedOptions(Ctor)
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions)
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions)
      if (options.name) {
        options.components[options.name] = Ctor
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor: Class<Component>): ?Object {
  let modified
  const latest = Ctor.options
  const sealed = Ctor.sealedOptions
  for (const key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) modified = {}
      modified[key] = latest[key]
    }
  }
  return modified
}
