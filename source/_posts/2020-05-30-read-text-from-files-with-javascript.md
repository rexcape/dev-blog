---
title: JavaScript 从选择的文件中读取文本
date: 2020-05-30 10:03:45
tags:
  - JavaScript
  - 基础知识
categories:
  - 实用
---

在开发词法分析器的前端页面时，需要允许用户从本地上传 c++ 文件，并将文件内容载入到编辑器中，本文介绍如何用 JavaScript 和 input 标签来实现网页加载文本文件内容（注意是加载内容）

<!--more-->

## FileReader

首先介绍一下 `FileReader`，FileReader 对象允许 Web 应用程序异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容，使用 File 对象指定要读取的文件或数据，可以用 `const reader = new FileReader();` 来初始化，详细部分在[FileReader - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader)中

## 读取 Input 标签文件内容

以下是示例代码

```JavaScript
// 获取 input 标签对应的元素
const fileInput = document.getElementById("file-input");
// 读取文件
const file = fileInput.files[0];
```

## 实现

```JavaScript
let fileInput = document.getElementById("file-input");
let file = fileInput.files[0];
let reader = new FileReader();
let text;
reader.addEventListener("loadend", () => {
  text = reader.result;
});
reader.readAsText(file);
```

## 在 React 有状态组件中实现

```JavaScript
handleFileChange() {
  let fileInput = document.getElementById("file-input");
  let file = fileInput.files[0];
  let reader = new FileReader();
  reader.addEventListener("loadend", () => {
    this.setState({
      text: reader.result,
    });
    fileInput.value = "";
  });
  reader.readAsText(file);
}
```

> 注意：因为是加载文件，所以加载完一次后要清除所选文件，否则下次加载同样的文件无法触发 `handleFileCHange` 函数，无法使状态改变了

## 参考

[FileReader - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader)

[操作文件 - 廖雪峰的官方网站](https://www.liaoxuefeng.com/wiki/1022910821149312/1023022494381696)

[用 Javascript 清空(重置)文件类型的 INPUT 元素的值*javascript*无心的专栏-CSDN 博客](https://blog.csdn.net/cuixiping/article/details/37526871)
