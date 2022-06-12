Objects类提供了一些工具方法来操作对象，这些工具方法大多是“空指针”安全的。

> 如：你不能确定一个引用变量是否为null，如果贸然地调用该变量的toString()方法，则可能引发NullPointerException异常；但如果使用Objects类提供的toString(Object o)方法，就不会引发空指针异常，当o为null时，程序将返回一个"null"字符串。

Java为工具类的命令习惯是添加一个字母s，如操作数组的工具类Arrays，操作集合的工具类Collections。

| 方法                                                         | 说明                                       |
| ------------------------------------------------------------ | ------------------------------------------ |
| `static <T> void requireNonNull(T obj)`                      | 如果obj为null，抛出一个NPE异常             |
| `static <T> void requireNonNull(T obj, String message)`      |                                            |
| `static <T> void requireNonNull(T obj, Supplier<String> messageSupplier)` |                                            |
| `static <T> T requireNonNullElse(T obj, T defaultObj)`       | 如果obj不为null则返回obj，否则返回默认对象 |
| `static <T> T requireNonNullElseGet(T obj, Supplier<T> defaultSupplier)` |                                            |

  
