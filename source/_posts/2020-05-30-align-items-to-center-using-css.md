---
title: 将 HTML 元素居中的方法
date: 2020-05-30 10:08:11
tags:
  - CSS
  - 基础知识
---
三种将 HTML 元素居中的方法
<!--more-->

## 左右居中

当元素的 `display` 属性为 `inline` 或者 `inline-block` 时，将**父元素**设定为 `text-align: center;` 即可左右居中

当元素的 `display` 属性为 `block` 时，将**元素本身**的 `margin-left` 和 `margin-right` 设定为 `auto` 即可左右居中

## 上下居中

### position: absolute

使用 `position: absolute` 时，可以参考如下代码

```CSS
#center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
}
```

### flexbox

flexbox 自带 `justify-content` 和 `align-items` 两个属性，分别设定主轴和交叉轴的对齐方式，将这两个属性都设置为 `center` 即可上下左右居中对齐

```CSS
body {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
```

### display: table

HTML 的 `table` 元素有一个 `valign` 属性，是用来设定垂直方向的对齐，可以通过 CSS 将其他元素的 `display` 属性设定为 `table` 去将它当作一个 `table` 去显示

```CSS
body {
  display: table;
  width: 100%;
  min-height: 100vh;
}

# center {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}
```

## 总结

position: absolute 方法是对其元素本身，调整元素本身的属性即可

flexbox、display: table 方法是对其元素内容，先将容器调整为与画面大小相同，然后再设定他的内容的对齐方式

## 参考

[CodingStartup - [HTML] 上下左右置中对齐的三种方法_哔哩哔哩 (゜-゜)つロ 干杯~-bilibili](https://www.bilibili.com/video/BV1o7411G7dq)
