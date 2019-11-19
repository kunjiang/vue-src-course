// 可以使用 ES6 模块语法来编写代码


import help, { smallHelp } from './help';

export default function CustomVue( options ) {
  this._data = options.data;
  help();
  smallHelp();
}