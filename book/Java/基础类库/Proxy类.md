---
title: Proxy类
---

## 方法

| 方法                                                         | 作用                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `static Class<?> getProxyClass(ClassLoader loader, Class<?>... interfaces)` | 返回实现指定接口的代理类                                     |
| `static Object newProxyInstance(ClassLoader loader, Class<?>[] interfaces, InvocationHandler handler)` | 构造实现指定接口的代理类的一个新实例。所有方法都调用给定处理器对象的`invoke`方法 |
| `static boolean isProxyClass(Class<?> cl)`                   | 如果cl是一个代理类则返回`true`                               |

