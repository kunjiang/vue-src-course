import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

/** Vue 构造函数 */
function Vue (options) {
  
  // 初始化
  this._init(options)
}

initMixin(Vue)        // 挂载初始化方法 ( _init )
stateMixin(Vue)       // 挂载 状态处理方法
eventsMixin(Vue)      // 挂载 事件 的方法
lifecycleMixin(Vue)   // 挂载 生命周期方法
renderMixin(Vue)      // 挂载与渲染有关的方法

export default Vue
