---
title: Objects类
---

`Objects` 类提供了一些工具方法来操作对象，这些工具方法大多是“空指针”安全的。

> 如：你不能确定一个引用变量是否为`null`，如果贸然地调用该变量的`toString()`方法，则可能引发 `NullPointerException` 异常；但如果使用 `Objects` 类提供的`toString(Object o)` 方法，就不会引发空指针异常，当 `o` 为 `null` 时，程序将返回一个 `"null"` 字符串。

Java 为工具类的命令习惯是添加一个字母s，如操作数组的工具类 `Arrays`，操作集合的工具类 `Collections`。

| 方法                                                         | 说明                                               |
| ------------------------------------------------------------ | -------------------------------------------------- |
| `static <T> void requireNonNull(T obj)`                      | 如果`obj`为`null`，抛出一个NPE异常                 |
| `static <T> void requireNonNull(T obj, String message)`      |                                                    |
| `static <T> void requireNonNull(T obj, Supplier<String> messageSupplier)` |                                                    |
| `static <T> T requireNonNullElse(T obj, T defaultObj)`       | 如果`obj`不为`null`则返回`obj`，否则返回默认对象   |
| `static <T> T requireNonNullElseGet(T obj, Supplier<T> defaultSupplier)` |                                                    |
| `static int hash(Object... objects)`                         | 返回一个散列码，由提供的所有对象的散列码组合而得到 |
| `static int hashCode(Object a)`                              | 如果`a`为`null`返回0，否则返回`a.hashCode()`       |
