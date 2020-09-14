---
title: PowerShell 快速复制文件内容到剪贴板
date: 2020-09-15 06:49:33
tags:
  - PowerShell
categories:
  - 实用
---

介绍使用 Windows PowerShell 快速复制文件内容到剪贴板的方法

<!--more-->

## 方法

假设要复制当前目录下的 `file.txt`，打开 PowerShell，输入

```powershell
> Get-Content file.txt | clip
```

即可将 `file.txt` 的内容复制到剪贴板
