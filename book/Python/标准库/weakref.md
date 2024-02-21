---
title: weakref
---

关于weakref标准库：

> \>>> help(weakref)
>
> Help on module weakref:
>
>  
>
> NAME
>
>   weakref - Weak reference support for Python.
>
>  
>
> DESCRIPTION
>
>   This module is an implementation of PEP 205:
>
>  
>
>   http://www.python.org/dev/peps/pep-0205/
>
>  
>
> CLASSES
>
>   builtins.object
>
> ​    _weakrefset.WeakSet
>
> ​    builtins.weakcallableproxy
>
> ​    builtins.weakproxy
>
> ​    builtins.weakref
>
> ​      WeakMethod
>
> ​    finalize
>
>   collections.abc.MutableMapping(collections.abc.Mapping)
>
> ​    WeakKeyDictionary
>
> ​    WeakValueDictionary
>
>  
>
>   CallableProxyType = class weakcallableproxy(object)
>
>    | Methods defined here:
>
> ……

weakref标准库中的弱引用（8.23节）消除了“循环引用数据结构的垃圾回收机制”带来的内存泄露问题。本质来讲，弱引用就是一个对象指针，它不会增加它的引用计数。