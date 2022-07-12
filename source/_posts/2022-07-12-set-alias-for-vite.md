---
title: vite 设置别名
date: 2022-07-12 21:53:23
tags:
  - vite
categories:
  - 实用
---

为 vite 配置 @ 别名来简化 import

<!--more-->

## 设置成果

可以直接使用 @ 代指 src 来导入模块

Before:

```jsx
import Foo from "../../components";
```

After:

```jsx
import Foo from "@/components";
```

## Vite Config

修改 `vite.config.js` 或 `vite.config.ts`，在其中加上如下配置

```javascript
export default defineConfig({
  // ...
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
```

## TSConfig

如果项目是 `Typescript` 项目，还需要修改 `tsconfig.json`，在 `compolierOptions` 项加上如下配置

```json
{
  "compilerOptions": {
    // ...
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
  // ...
}
```
