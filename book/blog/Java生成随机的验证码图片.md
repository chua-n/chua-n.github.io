---
title: Java生成随机的验证码图片
date: 2021-06-27 09:17:32
categories: Java
tags: coding
---

> 日常琐碎代码片段记录。

<!-- more -->

主要是第一次接触验证码随机生成的内容，感觉挺新鲜的，想着记录一下，实际内容倒没什么特别的干货。

```java
package com.chuan.servlet.web.servlet;

import javax.imageio.ImageIO;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.Random;

@WebServlet("/checkCodeServlet")
public class CheckCodeServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        int height = 50;
        int width = 100;
        // 1. 创建一在内存中的图像对象
        BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);

        // 2. 美化图片
        // 2.1. 填充背景色
        Graphics graphics = image.getGraphics(); // 画笔对象
        graphics.setColor(Color.PINK); // 设置画笔颜色
        graphics.fillRect(0, 0, width, height);
        // 2.2. 画边框
        graphics.setColor(Color.BLUE);
        graphics.drawRect(0, 0, width - 1, height - 1);
        // 2.3. 生成随机字符并写入验证码
        String str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        Random random = new Random();
        for (int i = 0; i < 4; ++i) {
            int index = random.nextInt(str.length());
            char ch = str.charAt(index);
            graphics.drawString(ch + "", (i + 1) * width / 5, height / 2);
        }
        // 2.4. 画干扰线
        // ......

        // 3. 将图片输出到页面中进行展示
        ImageIO.write(image, "jpg", response.getOutputStream());
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doGet(request, response);
    }
}
```
