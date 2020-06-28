---
title: Unity 2D 平台跳跃游戏角色转身
date: 2019-10-19 19:34:08
tags:
- Unity 游戏引擎
categories:
- 实用
---

Unity 2D 平台跳跃游戏角色转身的一些方法
<!--more-->

## 方法1 - 设置 Transform 中 Scale 属性为-1

具体实现方法如下

```csharp
int faceDirection = Input.GetAxisRaw("horizontal");
if (!Mathf.Approximately(faceDirection, 0.0f))
{
    transform.localScale = new Vector3(faceDirection, 1, 1);
}
```

## 方法2 - 在动画器中新建相反方向的动画

在动画控制器中，新建一个 x 轴反转的属性，在我之前学习的教程中有具体描述

## 参考

哔哩哔哩作者 [M_studio](https://space.bilibili.com/370283072/) 的视频

[Unity教程 Your First Game|入门Tutorial:05 角色方向&跳跃](https://www.bilibili.com/video/BV154411f7Pa)
