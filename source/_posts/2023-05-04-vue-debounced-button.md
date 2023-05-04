---
title: Vue 按钮防抖
date: 2023-05-04 15:01:25
tags:
  - vue
categories:
  - 实用
---

vue 防止短时间内重复点击按钮

<!--more-->

## 问题描述

需要将现有系统的一些按钮防止短时间内重复点击，以免重复提交请求。

## 使用框架

- [Vuejs3](https://cn.vuejs.org)
- [element-plus](https://element-plus.org)
- [WindiCSS](https://windicss.org/)

## 自定义 directive

使用 vue 的 Plugin 特性，新增一个 `v-limit-click` 指令，监听 `click` 事件，点击后对元素添加 `is-disabled` 和 `cursor-wait` 类并将 `disabled` 设置为 `true`，延迟后取消这两个类并将 `disabled` 设置为 `false`。

> `is-disabled` 是 `element-plus` 中按钮是 `disabled` 的 `class` > `cursor-wait` 是 WindiCSS 中 `cursor: wait` 的简写，加 ! 将这个 `cursor` 设定成为 `important` > `disabled` 是 `HTML` 规范里设定的禁用按钮的属性

```typescript
import { Plugin } from "vue";

interface LimitClickOptions {
  delay?: number;
}

const defaultOption: LimitClickOptions = {
  delay: 200,
};

const classes = ["is-disabled", "!cursor-wait"];

const limitClick = (opts?: LimitClickOptions): Plugin => {
  const { delay } = { ...defaultOption, ...opts };
  return {
    install(app) {
      app.directive("limitClick", {
        mounted(el) {
          el.addEventListener("click", () => {
            el.classList.add(...classes);
            el.disabled = true;
          });
          setTimeout(() => {
            el.classList.remove(...classes);
            el.disabled = false;
          }, delay);
        },
      });
    },
  };
};

export default limitClick;
```

## 将按钮点击事件设置为防抖

对按钮的 `@click` 事件绑定的方法进行修改。缺点：需要修改原来的 `@click` 方法

## 按钮点击后设置 loading

如果发送请求，可以在请求方法开始之前将 v-loading 设置为 true，请求完成后改回 false。缺点：如果请求过快点击两次还会调用两次

## 相关文章

- [自定义指令](https://cn.vuejs.org/guide/reusability/custom-directives.html)
- [Element-UI 中给 el-button 加上防抖](https://juejin.cn/post/6948621847239852062)
