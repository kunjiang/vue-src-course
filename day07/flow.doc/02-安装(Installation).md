<!-- # Installation -->

# 安装

<!-- Installing and setting up Flow for a project -->

安装, 并在项目中使用 Flow.

包管理器:

- Yarn
- npm

编译器:

- Babel
- flow-remove-types

<!-- There are a few ways to setup Flow depending on what tools you're already using. -->

<!-- 有几种方式来安装 Flow, 它依赖于你现在使用的工具. -->

根据你现在使用的工具, 有好几种方式来安装 Flow.

<!-- You can customize this guide from the tools above. -->

你可以使用上面的工具来自定义该指南.


<!-- ## Setup Compiler -->

## 安装编译器 ( flow-remove-types 篇 )

<!-- First you’ll need to setup a compiler to strip away Flow types. You can choose between Babel and flow-remove-types. -->

首先你需要安装编译器来将 Flow 的类型描述删除. 
你可以选择 [Babel](http://babeljs.io/) 或 [flow-remove-types](https://github.com/flowtype/flow-remove-types).

<!-- flow-remove-types is a small CLI tool for stripping Flow type annotations from files. It’s a lighter-weight alternative to Babel for projects that don’t need everything Babel provides. -->

[flow-remove-types](https://github.com/flowtype/flow-remove-types) 是一个小的 CLI 工具. 
它可以将 Flow 的类型描述从文件中删除掉. 
如果项目中不需要 Babel 提供的大多数处理功能, 它是一个轻量级的替代方案.

<!-- First install flow-remove-types with either Yarn or npm. -->

首先使用 yarn 或 npm 安装 `flow-remove-types`

```sh
yarn add --dev flow-remove-types
# 或
npm install --save-dev flow-remove-types
```

<!-- If you then put all your source files in a src directory you can compile them to another directory by running: -->

如果你将所有的代码文件放在 `src` 目录下, 使用下面的命令可以将其编译到另一个目录:

```sh
yarn run flow-remove-types src/ -- -d lib/
# 或
./node_modules/.bin/flow-remove-types src/ -d lib/
```

<!-- You can add this to your package.json scripts easily. -->

你可以将这段代码添加到 `package.json` 文件的 scripts 段中, 可以更加容易的使用.

```json
{
  "name": "my-project",
  "main": "lib/index.js",
  "scripts": {
    "build": "flow-remove-types src/ -d lib/",
    "prepublish": "yarn run build"
  }
}
```

或者

```json
{
  "name": "my-project",
  "main": "lib/index.js",
  "scripts": {
    "build": "flow-remove-types src/ -d lib/",
    "prepublish": "npm run build"
  }
}
```

<!-- > Note: You’ll probably want to add a prepublish script that runs this transform as well, so that it runs before you publish your code to the npm registry. -->

> 注意: 很有可能你会添加 `prepublish` 命令来运行这个转换. 这样, 在将你的代码发布到 npm 仓库之前, 你可以运行该命令.



## 安装编译器 ( Babel 篇 )

首先你需要安装编译器来将 Flow 的类型描述删除. 
你可以选择 [Babel](http://babeljs.io/) 或 [flow-remove-types](https://github.com/flowtype/flow-remove-types).

<!-- Babel is a compiler for JavaScript code that has support for Flow. Babel will take your Flow code and strip out any type annotations. -->

Babel 是一个编译器, 它可以使 JavaScript 支持 Flow. Babel 会删除 Flow 代码和脚本中的所有类型描述.

<!-- First install @babel/core, @babel/cli, and @babel/preset-flow with either Yarn or npm. -->

首先安装 `@babel/core`, `@babel/cli`, 和 `@babel/preset-flow`, 
你可以选择 [Babel](http://babeljs.io/) 或 [flow-remove-types](https://github.com/flowtype/flow-remove-types).

```sh
yarn add --dev @babel/core @babel/cli @babel/preset-flow
# 或
npm install --save-dev @babel/core @babel/cli @babel/preset-flow
```

<!-- Next you need to create a .babelrc file at the root of your project with "@babel/preset-flow" in your "presets". -->

然后, 你需要在项目根目录下创建一个 `.babelrc` 文件. 在文件中添加 `"presets"` 段中添加 `"@babel/preset-flow"`.

```
{
  "presets": [ "@babel/preset-flow" ]
}
```

如果你将所有的代码文件放在 `src` 目录下, 使用下面的命令可以将其编译到另一个目录:

```sh
yarn run flow-remove-types src/ -- -d lib/
# 或
./node_modules/.bin/flow-remove-types src/ -d lib/
```

你可以将这段代码添加到 `package.json` 文件的 scripts 段中, 可以更加容易的使用.

```json
{
  "name": "my-project",
  "main": "lib/index.js",
  "scripts": {
    "build": "flow-remove-types src/ -d lib/",
    "prepublish": "yarn run build"
  }
}
```

或者

```json
{
  "name": "my-project",
  "main": "lib/index.js",
  "scripts": {
    "build": "flow-remove-types src/ -d lib/",
    "prepublish": "npm run build"
  }
}
```

> 注意: 很有可能你会添加 `prepublish` 命令来运行这个转换. 这样, 在将你的代码发布到 npm 仓库之前, 你可以运行该命令.










<!-- ## Setup Flow -->

## 安装 Flow ( yarn 篇 )

<!-- Flow works best when installed per-project with explicit versioning rather than globally. -->

在项目中使用显式版本控制而不是全局安装 Flow 运行的最好.

<!-- Luckily, if you’re already familiar with npm or yarn, this process should be pretty familiar! -->

幸运的是, 如果你已经熟悉 `npm` 或 `yarn`, 那么这个过程就非常熟悉了!

<!-- Add a devDependency on the flow-bin npm package: -->

**将 `flow-bin` 包添加到开发依赖项 ( `devDependency` ) 中:**

```sh
yarn add --dev flow-bin
```

<!-- Run Flow: -->

**运行 Flow:**

```sh
yarn run flow
```

<!-- Note: you may need to run yarn run flow init before executing yarn run flow. -->

注意: 你可能在运行 `yarn run flow` 之前需要先运行 `yarn run flow init`.


## 安装 Flow ( npm 篇 )

在项目中使用显式版本控制而不是全局安装 Flow 运行的最好.

幸运的是, 如果你已经熟悉 `npm` 或 `yarn`, 那么这个过程就非常熟悉了!

**将 `flow-bin` 包添加到开发依赖项 ( `devDependency` ) 中:**

```sh
npm install --save-dev flow-bin
```

<!-- Add a "flow" script to your package.json: -->

**将 `"flow"` 脚本加到 `package.json` 文件中:**

```json
{
  "name": "my-flow-project",
  "version": "1.0.0",
  "devDependency": {
    "flow-bin": "^0.109.0"
  },
  "scripts": {
    "flow": "flow"
  }
}
```

**运行 Flow:**

<!-- The first time, run: -->

首先运行：

```sh
npm run flow init
```

<!-- After running flow with init the first time, run: -->

在运行 `init` 之后运行 `flow`:

```sh
npm run flow
```

