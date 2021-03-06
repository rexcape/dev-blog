---
title: TypeScript 笔记
date: 2021-03-03 19:56:48
tags:
- TypeScript
categories:
- 笔记
---

TypeScript 笔记

<!--more-->

## 简介

JS 的优点

- 易学
- 易用

JS 的缺点

- 过于易学导致程序员不知道实现原理
- 开发过程容易埋下安全隐患
- 维护成本过高

JS 不适合开发大型项目的原因

- 早期（ES6 之前）面向对象的编程很麻烦
- 变量的类型不确定，变量之间的运算会有隐患（不会报错）
- 函数的参数没有类型

JS 产生于第一次浏览器大战，网景和微软的大战，这导致了 JS 的制作周期非常的短，导致没有那么严谨

希望有一门语言可以克服 JS 的缺点，微软设计了 TypeScript 语言来实现这个目的

### TS 是什么

- 以 JS 为基础构建的语言
- 一个 JS 的超集
- 扩展了 JS，并添加了类型
- 可以在任何支持 JS 的平台中执行

TS 不能被 JS 解析器直接执行，TS 代码要编译为 JS

### TS 增加了什么

- 类型
- ES 的特性
- 添加 ES 不具备的新特性
- 丰富的配置选项

## TS 开发环境搭建

1. 下载 Nodejs
2. 安装 Nodejs
3. 使用 npm 全局安装 TS
   1. 进入命令行
   2. 输入 `npm i -g typescript`
4. 创建一个 TS 文件
5. 使用 tsc 对 ts 文件进行编译
   1. 进入命令行
   2. 进入 ts 文件所在目录
   3. 执行命令 `tsc file.ts`

## 基本类型

### 类型声明

- 类型声明是 TS 非常重要的一个特点
- 通过类型声明可以指定 TS 中变量的类型
- 指定类型时，对变量进行赋值时，TS 编译器会自动检查值是否符合类型声明，符合则赋值，否则报错

语法

```typescript
let 变量: 类型;
let 变量: 类型 = 值;
function func(参数: 类型, 参数: 类型): 类型 {
  // ...
}
```

### 自动类型判断

- TS 有自动的类型判断机制
- 当对变量的声明和复制时同时进行的，TS 编译器会自动判断变量的类型
- 所以如果你的变量声明和赋值是同时进行的，可以省略掉类型声明

### 类型

- `number`：数字
- `string`：字符串
- `boolean`：布尔值 true 或者 false
- 字面量：限制变量的值就是该字面量的值
- `any`：任意类型
- `unknown`：类型安全的 any
- `void`：没有值或者 undefined
- `never`：不能是任何值
- `object`：JS 对象
- `array`：JS 数组
- `tuple`：元组，固定长度的数组（TS 新增）
- `enum`：枚举（TS 新增）

### `number` 类型

```typescript
let decimal: number = 6;
let hex: number = 0xf00d;
let binary: number = 0b1010;
let octal: number = 0o744;
let big: bigint = 100n;
```

### 联合类型

可以使用 `|` 连接多个类型

```typescript
let x: boolean | string;
// 字面量
let y: 'male' | 'female';
```

### `any` 类型

`any` 表示的是任意类型，一个变量设置为 `any` 后相当于对**该变量**关闭了 ts 的类型检测

声明变量如果不指定类型，则 TS 解析器会自动判断变量的类型为 `any`

```typescript
let x: any;
x = 1; // 不会报错
x = true; // 不会报错
x = 'hello'; // 不会报错
let y; // d: any
```

同时，`any` 类型的变量可以给任何类型的变量赋值

```typescript
let x;
x = 10;
x = 'hello';
let y: number;
y = x; // 不会报错
```

**显式和隐式的 `any` 不建议使用**

### `unknown` 类型

`unknown` 表示未知类型，是类型安全的 `any`

```typescript
let x: unknown;
x = 10;
x = 'hello';

let y: number;
y = x; // 会报错

if (typeof x === 'number') {
  y = x; // 不会报错
}
```

`unknown` 类型的变量赋值给已知类型的变量会报错

### 类型断言

类型断言，可以告诉解析器 `unknown` 变量的实际类型

```typescript
let x: unknown;
x = 10;

let y: number;
y = x; // 会报错
y = x as number; // 不会报错
y = <number>e; // 不会报错
```

### `void` 类型

如果不显式声明返回值类型，ts 解析器会自动判断返回值类型

`void` 类型表示空，以函数为例就表示没有返回值（或者返回值为 null、undefined）的函数

### `never` 类型

`never` 表示永远不会返回结果

```typescript
function fn(): void {} // 不会报错

function fn2(): never {} // 报错

function fn3(): never {
  throw new Error('报错了');
} // 不会报错

function fn4(): never {
  while (true) {}
} // 不会报错
```

### `object` 类型

object 就是 JS 里面的对象，**不太实用**（JS 的一切都是对象）

```typescript
let x: object;
x = {};
x = function () {}; // 函数也是对象
```

在限制对象的时候去**限制对象里面包含的属性**，而不是**限制是不是对象**

`{}` 里面可以指定对象中包含哪些属性，必须**完全相同**

```typescript
let x: { name: string };
x = { name: 'abc' }; // 不会报错
x = { name: 'abc', age: 22 }; // 会报错
```

可有可无的字段后面加 `?`

```typescript
let x: { name: string; age?: number };
x = { name: 'abc' }; // 不会报错
x = { name: 'abc', age: 22 }; // 不会报错
```

要对某一字段有特定要求，不限制其他字段

```typescript
let x: { name: string; [propname: string]: any };
x = { name: 'test', a: 1, b: 2, c: 3 }; // 不会报错
x = { a: 1, b: 2, c: 3 }; // 会报错
```

函数结构的类型声明

```typescript
let func: (a: number, b: number) => number;
func = function (x, y): number {
  return x + y;
}; // 结构符合上面的定义
```

### `array` 类型（数组）

类似 JS 的数组

```typescript
let arr: number[]; // number 类型的数组
let arr2: Array<number>; // number 类型的数组
```

指定类型之后，数组里面的变量只能包含特定的类型

### `tuple` 类型

元组是固定长度的数组，存储效率比数组好一点

当数组元素的数量是固定的，可以用元组

```typescript
let t: [string, string];
t = ['hello', 'world']; // 不会报错
t = ['hello']; // 数量不对
t = ['hello', 123]; // 类型不对
```

### `enum` 类型

枚举在处理数据，有一些数据是在几个值之间选择（比如性别只能是男或者女）

```typescript
enum Gender {
  Male,
  Female,
}

let person: { name: string; gender: Gender };
person = {
  name: 'test',
  gender: Gender.Male,
};
```

### &

& 表示同时满足左右两边的字段

```typescript
let person: { name: string } & { age: number };
person = { name: 'hello' }; // 报错
person = { name: 'hello', age: 40 }; // 不会报错
```

### 类型别名

```typescript
let num: 1 | 2 | 3 | 4 | 5;
let num2: 1 | 2 | 3 | 4 | 5; // 复杂
```

使用类型别名来定义复杂的结构

```typescript
type myType = 1 | 2 | 3 | 4 | 5;
let num: myType;
let num2: myType;
```

## 编译选项

前面的那些代码，有的有错误，但是还是可以编译成为 JS，因为符合 JS 的规范

### 自动编译文件

在编译文件时，TS 编译器会自动监视文件的变化，并在文件发生变化时重新编译

在编译时加上 -w 参数

```bash
tsc -w test.ts
```

### ts 配置文件

在项目下新建一个 tsconfig.json 文件，里面不需要写任何东西

```bash
echo {} > tsconfig.json
```

在项目文件夹下执行 tsc，编译器就会自动编译并监视所有 ts 文件

一些配置选项

### `include`

include 指定 ts 编译器要包含哪些文件

`*` 代表任意文件

`**` 代表任意目录

```json
{
  "include": ["./src/**/*"]
}
```

### `exclude`

exclude 指定 ts 编译器要排除哪些文件

默认值：`["node_modules", "bower_components", "jspm_packages"]`

### `files`

指定被编译文件的列表，只有需要编译的文件少时才会用到

### `compilerOptions`

compilerOption 包含多个子选项来完成对编译器的配置

- `target`：设置代码编译的目标版本，可选值 ES3、ES5、ES6/ES2015、ES7/ES2016、ES2017、ES2018、ES2019、ES2020、ESNext
- `lib`：指定代码运行时所包含的库（宿主环境），可选值 ES3、ES5、ES6/ES2015、ES7/ES2016、ES2017、ES2018、ES2019、ES2020、ESNext、DOM、WebWorker、ScriptHost 等等
- `module`：设置编译后代码使用的模块化系统，可选值 CommonJS、UMD、AMD、System、ES2020、ESNext、None
- `outDir`：指定编译后文件所在目录
- `outFile`：将**全局作用域**代码合并为一个文件（不能有模块化）
- `allowJs`：是否对 JS 文件进行编译，默认为 `false`
- `checkJs`：是否检查 JS 代码是否符合语法规范，默认为 `false`
- `removeComments`：是否移除注释，默认为 `false`
- `noEmit`：是否**不生成**编译后生成的文件，默认为 `false`
- `noEmitOnError`：当有错误时是否不生成编译后的文件，默认为 `false`

### `alwaysStrict`

生成的代码中是否使用 ES6 的严格模式，默认为 `false`

当有模块的导入导出时，默认禁用掉严格模式

### `noImplicitAny`

不允许隐式 `any` 类型

指定代码中没指定类型的变量是否隐式声明为 `any` 类型

默认为 `false`

### `noImplicitThis`

不允许不明确类型的 `this`

默认为 `false`

### `strictNullChecks`

严格的 `null` 控制

调用某个对象的方法的时候，这个对象有可能时 null，不能对空对象调用方法

默认为 `false`

### `strict`

所有严格检查的总开关

上面所有严格选项的开关

默认为 `false`

## 使用 webpack 打包 TS 代码

要用 webpack，要先用 npm 对包进行管理

在项目文件夹下执行 `npm init -y` 可以自动生成 `package.json` 文件

安装 `webpack` 和 `webpack-cli` 来对代码进行打包

安装 `typescript` 和 `ts-loader` 对代码进行整合

```bash
$ npm i --save-dev webpack webpack-cli typescript ts-loader
...
```

编写 `webpack` 配置文件 `webpack.config.js`

```jsx
// 引入一个包
const path = require('path');

// webpack 中所有的配置信息都应该写在 module.exports 中
module.exports = {
  // 指定入口文件
  entry: './src/index.ts',
  // 指定打包文件所在目录
  output: {
    // 指定打包文件的目录
    path: path.resolve(__dirname, 'dist'),
    // 打包后的文件名
    filename: 'bundle.js',
  },
  // 指定 webpack 打包时要使用的模块
  module: {
    // 指定要加载的规则
    rules: [
      {
        // 指定规则生效的文件
        test: /\.ts$/,
        // 要使用的 loader
        use: 'ts-loader',
        // 要排除的文件
        exclude: /node_modules/,
      },
    ],
  },
};
```

对 ts 编译器进行配置：`tsconfig.json`

```json
{
  "compilerOptions": {
    "module": "ES6",
    "target": "ES6",
    "strict": true
  }
}
```

在 `package.json` 文件的 `script` 部分添加一个打包脚本

```json
"scripts": {
  "build": "webpack"
},
```

### 自动生成 HTML 文件

命令行中执行 `npm i --save-dev html-webpack-plugin` 安装包，可以帮我们自动生成 HTML 文件

在 `webpack.config.js` 中添加

```jsx
// ...
// 引入 HTML 插件
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // ...
  // 配置 webpack 插件
  plugins: [
    // 自动生成文件，引入相关资源
    new HTMLWebpackPlugin(),
  ],
};
```

这样，再执行 `npm run build` 的时候就可以生成一个 `index.html` 文件

也可以传入自定义的参数

```jsx
new HTMLWebpackPlugin({
  title: "这是自定义的 title",
}),
```

也可以自定义模板 HTML 文件

### 开发服务器

命令行中执行 `npm i --save-dev webpack-dev-server` 来安装开发服务器

修改 `package.json` 中的 `scripts`

```json
"scripts": {
  "build": "webpack",
  "dev": "webpack serve --open chrome.exe"
},
```

运行 `npm run dev` 就可以打开开发服务器了

### 编译之前清空 dist 目录

大多数时候需要保持 dist 目录为最新生成的，需要清理之前的 dist 目录

命令行中执行 `npm i --save-dev clean-webpack-plugin` 来安装插件

```json

// ...
// 引入 clean 插件
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

// ...
module.exports = {
  // ...
  // 配置 webpack 插件
  plugins: [
    // 清除 dist 目录
    new CleanWebpackPlugin(),
    // 自动生成文件，引入相关资源
    new HTMLWebpackPlugin({
      title: "这是自定义的 title",
    }),
  ],
};
```

### ts 模块问题

假如在 ts 里面 require 另一个 ts 文件导出的变量，webpack 不知道你要导入的 ts 是可以作为模块被导入的

修改 `webpack.config.js`

```json
// ...
module.exports = {
  // ...
  // 设置引用模块
  resolve: {
    extensions: [".ts", ".js"],
  },
};
```

### 兼容性问题

IE 浏览器不支持最新的 ES 标准，在写完代码之后必须转换为 IE 支持的版本

虽然在 TS 编译器中有这个选项，但是还有一些功能是 TS 编译器中不具备的

TS 编译器只能进行语法的转换，像是 ES6 的 Promise 是不能转换过去的

为了让代码有更好的兼容性，在开发时候推荐安装 Babel

命令行中执行

```bash
npm i --save-dev @babel/core @babel/preset-env babel-loader core-js
```

- `preset-env` 预先设置的环境
- `babel-loader` 将 Babel 和 webpack 结合
- `core-js` 模拟 JS 的运行环境，可以让老版本的浏览器用到新的技术

修改配置文件 `webpack.config.js`，对 babel 进行配置

```jsx
// ...
module.exports = {
  // ...
  module: {
    // 指定要加载的规则
    rules: [
      {
        // ...
        use: [
          // 配置 babel
          {
            // 指定加载器
            loader: 'babel-loader',
            // 设置 babel
            options: {
              // 设置预定义的环境
              presets: [
                [
                  // 指定环境插件
                  '@babel/preset-env',
                  // 配置信息
                  {
                    // 要兼容的目标浏览器兼容版本
                    targets: {
                      chrome: '88',
                    },
                    // 指定 corejs 的版本
                    corejs: '3',
                    // 使用 corejs 的方式
                    // usage 表示按需加载
                    useBuiltIns: 'usage',
                  },
                ],
              ],
            },
          },
          'ts-loader',
        ],
        // ...
      },
    ],
  },
  // ...
};
```

use 里面的模块是从后往前加载的，需要先将 TS 文件编译，后转换为兼容的代码

由于 babel 的配置较为复杂，要写一些配置信息

比如你的代码里面没有 Promise 这个类，但是 IE 里面没有这个类，corejs 里面有他自己实现的 Promise，就可以顺利放到 IE 里运行了，但是不代表 IE 就不会报错

babel 只管一部分代码，而 webpack 打包之后默认的会使用箭头函数，所以 IE 浏览器一定会报错，我们需要去指定 webpack 打包时不使用箭头函数

```jsx
// ...
module.exports = {
  // ...
  output: {
    // ...
    environment: {
      arrowFunction: false,
    },
  },
  // ...
};
```

## 类

定义类的语法

```typescript
class 类名 {
  属性名: 类型;
  readonly 只读属性名: 类型;
  static 静态属性名: 类型;

  constructor(参数: 类型) {
    this.属性名 = 参数;
  }

  方法名() {}
  static 静态方法名() {}
}
```

`readonly` 代表只读，可以用在属性

`static` 代表静态，可以用在属性和方法

### 构造函数和 this

构造函数会在对象创建时调用

在构造函数中，`this` 表示当前的实例

在方法中，`this` 表示调用当前方法的对象

### 继承

extends 表示继承

```typescript
class 子类 extends 父类 {}
```

子类会拥有父类拥有的方法和属性

继承可以将多个将多个类中共有的代码抽象到一个父类

如果子类添加了和父类相同的方法，则子类会覆盖掉父类的方法

### super 关键字

super 表示当前类的父类

注意：如果在子类中写了构造函数，子类的构造函数必须对父类的构造函数进行调用

### 抽象类

以 abstract 开头的类是抽象类，抽象类不能用来创建对象

抽象类是专门用来继承的类

抽象类中可以添加抽象方法，抽象方法使用 abstract 开头，没有方法体

抽象方法只能定义在抽象类中，子类必须要对抽象方法进行重写

## 接口

描述一个对象的类型使用 `type`

接口用来定义一个类的结构

`type` 同一个名称只能声明一个

`interface` 同一个名称可以声明多个，必须取到接口所有字段

定义类是，可以让类实现一个接口

接口和抽象类不同：

- 接口里只有方法的定义，抽象类既可以只定义也可以实现
- 抽象类是继承，接口是实现

## 属性的封装

属性可以任意地被修改，会导致对象中的数据变的非常不安全

TS 可以在属性前添加属性的修饰符

public（默认值）：可以在任意位置访问和修改

private：只能在类的内部进行访问

protected：只能在当前类和当前类的子类中访问

对私有属性可以在类中添加方法使私有属性可以被外部访问

getter 方法用来读取属性 setter 方法用来设置属性

TS 中设置 getter 方法的方式

```typescript
class Person {
  private name: string;
  get name() {
    return this.name;
  }
  set name(newName: string) {
    this.name = name;
  }
}

let person = new Person();
person.name = 'newName';
console.log(person.name);
```

TS 可以直接把属性定义在构造函数中

```typescript
class Person {
  constructor(public name: string, public age: number) {}
}
```

## 泛型

在定义函数或者类时，如果遇到类型不明确的，就可以使用泛型

泛型的定义方式

```typescript
function func<T>(arg: T): T {
  return arg;
}
// 可以直接调用具有泛型的函数
func(10);
func<string>('hello');
function func2<T, S>(a: T, b: S): T {
  return a;
}
```

不指定类型，TS 可以自动对类型进行推断，但是不一定能推断出来

也可以指定泛型

```typescript
interface MyInterface {
  length: number;
}
function func3<T extends MyInterface>(a: T): number {
  return a.length;
}
```

泛型可以同时指定多个

`T extends MyInterface` 表示泛型 T 必须是 `MyInterface` 的实现类
