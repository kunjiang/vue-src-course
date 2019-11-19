<!-- # Usage -->

# 使用

<!-- How to start using Flow -->

如何开始使用 Flow.

<!-- Once you have installed Flow, you will want to get a feel of how to use Flow at the most basic level. For most new Flow projects, you will follow this general pattern: -->

在[安装](./02-安装(Installation).md) Flow 后, 你会希望了解如何在基本环境下使用 Flow. 在大多数项目中, 你可以遵循下面的事项:

<!-- Initialize your project with flow init. -->
<!-- Start the Flow background process with flow. -->
<!-- Determine which files Flow will monitor with // @flow. -->
<!-- Write Flow code for your project. -->
<!-- Check your code for type errors. -->

- 使用 `flow init` 来初始化项目
- 使用 `flow` 来启动后台处理
- 使用 `// @flow` 标记需要被 Flow 监视的文件
- 在项目中编写 Flow 的代码
- 检查代码的类型错误


<!-- ## Initialize Your Project  -->

## 初始化你的项目

<!-- Preparing a project for Flow requires only one command: -->

初始化 Flow 项目只需要一条命令:

```sh
flow init
```

<!-- Run this command at the top level of your project to create one, empty file called .flowconfig. At its most basic level, .flowconfig tells the Flow background process the root of where to begin checking Flow code for errors. -->

运行该命令, 会在项目根目录创建一个名为 `.flowconfig` 的空文件.
这就构成最基本的项目结构了. 
`.flowconfig` 文件会告诉后台的 Flow 进程从哪里开始对 Flow 代码进行校验.

<!-- And that is it. Your project is now Flow-enabled. -->

此时, 你的项目就已经支持 Flow 了.

<!-- > It is common to have an empty .flowconfig file for your project. However, you can configure and customize Flow in many ways through options available to be added to .flowconfig. -->

> 一般情况下, 你的项目都会有一个空的 `.flowconfig` 文件. 
> 然而, 向 `.flowconfig` 文件添加可用的选项, 你能有很多种方式对 Flow 进行自定义配置.




<!-- ## Run the Flow Background Process  -->

## 运行 Flow 后台进程

<!-- The core benefit to Flow is its ability to quickly check your code for errors. Once you have enabled your project for Flow, you can start the process that allows Flow to check your code incrementally and with great speed. -->

Flow 的一个主要优势是快速地对代码进行错误校验.
一旦你的项目中使用了 Flow, 你可以启动 Flow 后台进程, 它会在你修改代码的同时, 以最快的速度对代码进行校验.

```sh
flow status
```

<!-- This command first starts a background process that will check all Flow files for errors. The background process continues running, monitoring changes to your code and checking those changes incrementally for errors. -->

该命令一开始便会启用后台进程, 用于对 Flow 文件的代码校验.
而后台进程会保持运行状态, 在代码发生变化时监视代码的变更, 并对其进行错误校验. 

<!-- > You can also type flow to accomplish the same effect as status is the default flag to the flow binary. -->

> 你也可以输入 `flow` 来达到同样的效果, 因为 `status` 是 `flow` 命令的默认子命令.

<!-- > Only one background process will be running at any given time, so if you run flow status multiple times, it will use the same process. -->

> 同一时间只会有一个后台进程被运行, 因此如果你多次运行 `flow status`, 它们实际上是同一个进程. 

<!-- > To stop the background process, run flow stop. -->

> 要结束后台进程, 可以运行 `flow stop` 命令.



<!-- ## Prepare Your Code for Flow  -->

## 准备你的 Flow 代码

<!-- The Flow background process monitors all Flow files. However, how does it know which files are Flow files and, thus, should be checked? Placing the following before any code in a JavaScript file is the flag the process uses to answer that question. -->

Flow 后台进程会监视所有的 Flow 文件. 然而, 它是怎么知道哪一个文件是 Flow 文件, 并对其进行校验的呢?
在 JavaScript 文件的**最前面**放置下面的代码, 这个代码标记就是答案.

```js
// @flow
```

<!-- This flag is in the form of a normal JavaScript comment annotated with @flow. The Flow background process gathers all the files with this flag and uses the type information available from all of these files to ensure consistency and error free programming. -->

这个标记由 `@flow` 构成, 它放在 JavaScript 的注释中.
Flow 后台进程会捕获所有含有该标记的文件, 使用这些文件中的类型信息来保证代码的一致性 ( 兼容性 ), 保证程序的正常运行.

<!-- > You can also use the form /* @flow */ for the flag as well. -->

> 你也可以使用 `/* @flow */` 来代替, 结果是一样的.

<!-- > For files in your project without this flag, the Flow background process skips and ignores the code (unless you call flow check --all, which is beyond the scope of basic usage). -->

> 如果项目的代码中没有这个标记, Flow 后台进程会跳过, 忽略文件中的代码.
> ( 除非你使用 `flow check --all` 命令, 这已超出基本用法的范畴 ).



<!-- ## Write Flow Code  -->

## 编写 Flow 代码

<!-- Now that all the setup and initialization is complete, you are ready to write actual Flow code. For each file that you have flagged with // @flow, you now have the full power of Flow and its type-checking available to you. Here is an example Flow file: -->

现在已经完成了所有的步骤和初始化行为, 你已经可以开始编写真正的 Flow 代码了.
含有 `// @flow` 标记的每一个文件, 都拥有 Flow 的全部功能, 以及对代码类型检查的能力.
下面是一个 Flow 文件的案例: 

```js
// @flow

function foo(x: ?number): string {
  if (x) {
    return x; // 译注: 这里会报错
  } 
  return "default string";
}
```

<!-- Notice the types added to the parameter of the function along with a return type at the end of the function. You might be able to tell from looking at this code that there is an error in the return type since the function can also return an int. However, you do not need to visually inspect the code since the Flow background process will be able to catch this error for you when you check your code. -->

值得注意的是, 带有参数类型描述的函数是有返回值类型描述的, 它在函数结尾的地方.
或许, 从代码中你能发现返回值类型有一个错误, 因为函数也可以返回 `int`.
然而, 你不需要逐个去检查你的代码, 因为在你检查代码的时候, Flow 后台进程就会捕获到代码中的错误.



<!-- ## Check Your Code  -->

## 检查你的代码

<!-- The great thing about Flow is that you can get near real-time feedback on the state of your code. At any point that you want to check for errors, just run: -->

在 Flow 中最棒的是你能几乎实时的获得代码的状态的反馈. 在任何时候, 你想了解代码的状态, 只需要运行:

```sh
# 等价于 `flow status`
flow
```

<!-- The first time this is run, the Flow background process will be spawned and all of your Flow files will be checked. Then, as you continue to iterate on your project, the background process will continuously monitor your code such that when you run flow again, the updated result will be near instantaneous. -->

运行该命令后第一时间就会启动 Flow 后台进程, 同时它会校验项目中所有的 Flow 文件.
在你继续为项目迭代的时候, 后台进程会持续运行, 监视你代码的变化, 就像你又运行了 `flow` 一样.
更新的结果也是实时响应.

<!-- For the code above, running flow will yield: -->

针对上面的代码, 运行 `flow` 后会得到:

```
test.js:5
  5:     return x;
                ^ number. This type is incompatible with the expected return type of
  3: function foo(x: ?number): string {
                               ^^^^^^ string
```
