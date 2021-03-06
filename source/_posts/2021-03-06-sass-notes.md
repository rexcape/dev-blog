---
title: Sass 笔记
date: 2021-03-06 11:32:37
tags:
- Sass
categories:
- 笔记
---

Sass 笔记

<!--more-->

## Sass Scss

SASS 语言有两种形式，一种是 SASS 形式，使用缩进来取代大括号，严格限制缩进：

```scss
h1
  font-family: $main-fonts;
  color: $headings-color;
```

另一种是 SCSS，保留完整的大括号，不限制缩进：

```scss
h1 {
  font-family: $main-fonts;
  color: $headings-color;
}
```

除了括号和缩进外二者之间没有区别，下面使用的是 SCSS 形式

## 变量

SASS 和 CSS 不同的地方之一是 SASS 的变量，SASS 用变量存储数据

SASS 的变量以 `$` 开头

```scss
$main-fonts: Arial, sans-serif;
$headings-color: green;

//To use variables:
h1 {
  font-family: $main-fonts;
  color: $headings-color;
}
```

变量可以让许多地方的相同颜色一起更改

## 嵌套

SASS 允许你嵌套 CSS 规则

在一个很大的工程中，CSS 文件会有许多规则。嵌套可以帮你更好地组织代码

```css
nav {
  background-color: red;
}

nav ul {
  list-style: none;
}

nav ul li {
  display: inline-block;
}
```

```scss
nav {
  background-color: red;

  ul {
    list-style: none;

    li {
      display: inline-block;
    }
  }
}
```

## mixin

SASS 中，mixin 是一组可重用的 CSS 声明

CSS 新的特性需要一些时间来在所有浏览器兼容。当新特性加入到浏览器中时，CSS 规则可能需要一些前缀，例如 box-shadow

```css
div {
  -webkit-box-shadow: 0px 0px 4px #fff;
  -moz-box-shadow: 0px 0px 4px #fff;
  -ms-box-shadow: 0px 0px 4px #fff;
  box-shadow: 0px 0px 4px #fff;
}
```

如果每个元素都有这一属性，重写它们将会很浪费时间。同时修改属性的话将耗费相当大的精力。

mixin 就像 CSS 的函数一样：

```scss
@mixin box-shadow($x, $y, $blur, $c){ 
  -webkit-box-shadow: $x $y $blur $c;
  -moz-box-shadow: $x $y $blur $c;
  -ms-box-shadow: $x $y $blur $c;
  box-shadow: $x $y $blur $c;
}
```

`@mixin` 后面跟着一个自定义的名称，参数是可选的。现在如果你想使用 `box-shadow` 这一属性的话，只需要用 `@include` 调用 `mixin` 规则

```scss
div {
  @include box-shadow(0px, 0px, 4px, #fff);
}
```

## if

SASS 中的 `@if` 指令用来测试特定的条件

```scss
@mixin make-bold($bool) {
  @if $bool == true {
    font-weight: bold;
  }
}
```

和 JS 中相同，也可以用 `else if` 和 `else`

```scss
@mixin text-effect($val) {
  @if $val == danger {
    color: red;
  }
  @else if $val == alert {
    color: yellow;
  }
  @else if $val == success {
    color: green;
  }
  @else {
    color: black;
  }
}
```

## for

可以用 `for` 指令来实现循环结构

`@for` 指令有两种用法：`start through end` 和 `start to end`。前者是前开后开，后者是前开后闭

```sass
@for $i from 1 through 12 {
  .col-#{$i} { width: 100%/12 * $i; }
}
```

`#{$i}` 是使用变量 `i` 创建字符串，转换成 CSS 后是这样：

```css
.col-1 {
  width: 8.33333%;
}

.col-2 {
  width: 16.66667%;
}

...

.col-12 {
  width: 100%;
}
```

for 循环是创建网格布局的强大方法

## each

SASS 提供了 `@each` 指令来遍历 `list` 或者 `map` 中的元素

```scss
$colors: (color1: blue, color2: red, color3: green);

@each $key, $color in $colors {
  .#{$color}-text {color: $color;}
}
```

需要用 `$key` 变量来引用映射中的键，否则编译后的 css 会有 color1、color2… 在里面

上面的代码会被转换为下面的 CSS

```css
.blue-text {
  color: blue;
}

.red-text {
  color: red;
}

.green-text {
  color: green;
}
```

## while

`@while` 指令用来执行循环

```scss
$x: 1;
@while $x < 13 {
  .col-#{$x} { width: 100%/12 * $x;}
  $x: $x + 1;
}
```

首先，定义一个变量 `$x` 并设置为 1。然后使用 `while` 指令来创建当 `x` 小于 13 的循环。在设置完 `width` 属性后，`x: x + 1` 用来避免无限循环

## 代码分离

Sass 中的 Partial 是保存 CSS 代码段的单独文件。它们被导入并在其他 Sass 文件中使用。这是一种将相似的代码分组到模块中以保持其组织性的好方法。

部分名称以下划线 _ 字符开头，这告诉 Sass 它是 CSS 的一小段，而不是将其转换为 CSS 文件。另外，Sass 文件以 .scss 文件扩展名结束。要将部分代码导入到另一个 Sass 文件中，请使用 @import指令。

例如，如果你所有的 mixin 都保存在一个名为 _mixins.scss 的 Partial 中。main.scss 中使用它们的方法：

```scss
// In the main.scss file

@import 'mixins'
```

请注意，在 import 语句中不需要下划线和文件扩展名。Sass 理解它是一个 Partial。一旦一个 Partial 被导入到一个文件中，所有的变量、mixin 和其他代码都可以使用。

## extend

Sass有一个名为 extend 的特性，可以很容易地从一个元素借用 CSS 规则，然后在另一个元素上构建它们。

例如，下面的CSS规则块样式是一个.panel类。它有背景颜色、高度和边框

```css
.panel{
  background-color: red;
  height: 70px;
  border: 2px solid green;
}
```

现在你需要另一个叫。big-panel的面板。它具有与.panel相同的基本属性，但也需要一个宽度和字体大小。可以从.panel复制和粘贴初始的CSS规则，但是当您添加更多类型的面板时，代码会变得重复。extend指令是一种简单的方法，可以重用为一个元素编写的规则，然后为另一个元素添加更多的规则:

```css
.big-panel{
  @extend .panel;
  width: 150px;
  font-size: 2em;
}
```

除了新的样式之外，.big-panel将具有与.panel相同的属性。
