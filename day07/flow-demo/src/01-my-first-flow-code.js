/* @flow */

// let num = 10; // js

let num: number = 123; // flow 语法

function foo( num: number, isTrue?: boolean ): string {
  return num + ''
}

foo( 123 )