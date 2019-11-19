<!-- # Getting Started -->

# 开始使用

<!-- Introduction to type checking with Flow -->

使用 Flow 来进行类型校验.

<!-- Flow is a static type checker for your JavaScript code. It does a lot of work to make you more productive. Making you code faster, smarter, more confidently, and to a bigger scale. -->

Flow 是一个静态类型检查的工具, 是检查 JavaScript 代码用的. 
它能提高你的编码效率, 使得你的编码更快, 代码更加整洁, 项目更加可靠. 
同时方便构建更具规模的项目.

<!-- Flow checks your code for errors through static type annotations. These types allow you to tell Flow how you want your code to work, and Flow will make sure it does work that way. -->

Flow 通过静态注解来检查代码中的错误. 
因此, 利用类型定义, 你可以告诉 Flow, 你的代码会如何执行. 
然后, Flow 会确保你的代会按照预计的方式工作.

```js
// @flow
function square( n: number ): number {
  return n * n;
}

square( "2" ); // 报错!
```

<!-- Because Flow understands JavaScript so well, it doesn’t need many of these types. You should only ever have to do a minimal amount of work to describe your code to Flow and it will infer the rest. A lot of the time, Flow can understand your code without any types at all. -->

由于 Flow 非常了解 JavaScript, 因此事实上不需要那么多的类型描述. 
你只需要使用很少的操作来描述你的代码, Flow 会推断其他部分.
大多数时候, 不使用任何类型描述, Flow 就可以正确理解你的代码.

```js
// @flow 
function square( n ) {
  return n * n; // 报错!
}

square( "2" )
```

<!-- You can also adopt Flow incrementally and easily remove it at anytime, so you can try Flow out on any codebase and see how you like it. -->

你可以在代码中增加对 Flow 的支持, 同时也非常容易的将其删除. 那么你可以尝试在任何代码中使用 Flow, 就看你是否喜欢这样了.

