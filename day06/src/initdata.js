
// 响应式化的部分
let ARRAY_METHOD = [
  'push',
  'pop',
  'shift',
  'unshift',
  'reverse',
  'sort',
  'splice',
];

let array_methods = Object.create(Array.prototype);

ARRAY_METHOD.forEach(method => {
  array_methods[method] = function () {
    // 调用原来的方法
    console.log('调用的是拦截的 ' + method + ' 方法');

    // 将数据进行响应式化
    for (let i = 0; i < arguments.length; i++) {
      observe(arguments[i]); // 这里还是有一个问题, 在引入 Watcher 后解决
    }

    let res = Array.prototype[method].apply(this, arguments);
    // Array.prototype[ method ].call( this, ...arguments ); // 类比
    return res;
  }
});


// 简化后的版本 
function defineReactive(target, key, value, enumerable) {

  // 函数内部就是一个局部作用域, 这个 value 就只在函数内使用的变量 ( 闭包 )
  if ( typeof value === 'object' && value != null ) {
    // 是非数组的引用类型
    observe(value); // 递归
  }

  let dep = new Dep();

  Object.defineProperty(target, key, {
    configurable: true,
    enumerable: !!enumerable,

    get() {
      // console.log(`读取 ${key} 属性`); // 额外
      // 依赖收集 ( 暂时略 )
      return value;
    },
    set(newVal) {
      // console.log(`设置 ${key} 属性为: ${newVal}`); // 额外
      
      if ( value === newVal ) return;


      // 目的
      // 将重新赋值的数据变成响应式的, 因此如果传入的是对象类型, 那么就需要使用 observe 将其转换为响应式
      if (typeof newVal === 'object' && newVal != null) {
        observe(newVal);
      } 
    
      value = newVal;
      
      // 派发更新, 找到全局的 watcher, 调用 update
      dep.notify();
    }
  });
}


/** 将 某一个对象的属性 访问 映射到 对象的某一个属性成员上 */
function proxy(target, prop, key) {
  Object.defineProperty(target, key, {
    enumerable: true,
    configurable: true,
    get() {
      return target[prop][key];
    },
    set(newVal) {
      target[prop][key] = newVal;
    }
  });
}



/** 将对象 o 变成响应式, vm 就是 vue 实例, 为了在调用时处理上下文 */
function observe( obj ) {
  // 之前没有对 obj 本身进行操作, 这一次就直接对 obj 进行判断
  if ( Array.isArray( obj ) ) {
    // 对其每一个元素处理
    obj.__proto__ = array_methods;
    for ( let i = 0; i < obj.length; i++ ) {
      observe( obj[ i ] ); // 递归处理每一个数组元素
      // 如果想要这么处理, 就在这里继续调用 defineRective
      // defineReactive.call( vm, obj, i, obj[ i ], true ); 
    }
  } else {
    // 对其成员进行处理
    let keys = Object.keys( obj );
    for ( let i = 0; i < keys.length; i++ ) {
      let prop = keys[ i ]; // 属性名
      defineReactive( obj, prop, obj[ prop ], true );
    }
  }
}


JGVue.prototype.initData = function () {
  // 遍历 this._data 的成员, 将 属性转换为响应式 ( 上 ), 将 直接属性, 代理到 实例上
  let keys = Object.keys(this._data);

  // 响应式化
  observe( this._data );

  // 代理
  for (let i = 0; i < keys.length; i++) {
    // 将 this._data[ keys[ i ] ] 映射到 this[ keys[ i ] ] 上
    // 就是要 让 this 提供 keys[ i ] 这个属性
    // 在访问这个属性的时候 相当于在 访文this._data 的这个属性

    proxy(this, '_data', keys[i]);
  }
};