(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.JGVue = factory());
}(this, (function () { 'use strict';

  function help() {
    console.log( '一个帮助函数' );
  }

  function smallHelp() {
    console.log( '一个其他的帮助函数' );
  }

  // 可以使用 ES6 模块语法来编写代码

  function CustomVue( options ) {
    this._data = options.data;
    help();
    smallHelp();
  }

  return CustomVue;

})));
