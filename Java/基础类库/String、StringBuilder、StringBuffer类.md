Java 提供了 String, StringBuffer, StringBuilder 三个类来封装字符串，并提供了一系列方法。

1. String 类是不可变类，一旦一个 String 对象被创建，包含在这个对象中的字符序列是不可改变的，直至这个对象被销毁；

2. StringBuilder 类的对象代表一个字符序列可变的字符串，当一个 StringBuilder 对象被创建以后，通过其提供的 append(), insert(), reverse(), setCharAt(), setLength()等方法可以改变这个字符串对象的字符序列。一旦通过 StringBuilder 生成了最终想要的字符串，就可以调用它的 toString()方法将其转换为一个 String 对象。

3. StringBuffer 类同 StringBuilder 类几乎一样，唯一的差别是，StringBuilder 是线程不安全的，而 StringBuffer 是线程安全的，因而性能略低。若不需考虑线程安全，通常会使用前者。

所有字符串都实现了`CharSequence`接口。

## String 类的构造方法

String 类提供了大量构造器来创建 String 对象，如：

| 构造方法                                                         |                                                                                                         |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| String()                                                         | 创建""                                                                                                  |
| String(byte[] bytes, Charset charset)                            | 使用指定的字符集将指定的 byte[]数组解码成一相新的 String 对象                                           |
| String(byte[] bytes, int offset, int length)                     | 使用平台的默认字符集将指定的 byte[]数组从 offset 开始的长度为 length 的子数组解码成一个新的 String 对象 |
| String(byte[] bytes, int offset, int length, String charsetName) | 同上，但使用指定的字符集                                                                                |
| String(byte[] bytes, String charsetName)                         | 使用指定的字符集将指定的 byte[]数组解码成一个新的 String 对象                                           |
| String(char[] value, int offset, int count)                      | 将指定的字符数组从 offset 开始，长度为 count 的字符元素连缀成字符串                                     |
| String(String original)                                          | 根据字符串直接量来创建一个 String 对象，会是一个副本                                                    |
| String(StringBuilder builder)                                    | 根据 StringBuilder 对象来创建对应的 String 对象                                                         |
| String(StringBuffer buffer)                                      | 根据 StringBuffer 对象来创建对应的 String 对象                                                          |

## String 类的方法

String 类也提供了大量方法来操作字符串对象：

| 方法                                                         | 作用                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| int length()                                                 | 返回当前字符串的长度                                         |
| char charAt(int index)                                       | 获取字符串中指定位置的字符                                   |
| boolean startsWith(String prefix)                            | 判断字符串是否以 prefix 开始                                 |
| boolean startsWith(String prefix, int toffset)               | 同上，但从 toffset 位置算起                                  |
| boolean endsWidth(String suffix)                             | 判断字符串是否以 suffix 结尾                                 |
| String substring(int beginIndex)                             | 获取从 beginIndex 位置开始到结束的子字符串                   |
| String substring(int beginIndex, int endIndex)               | 获取[beginIndex, endIndex)之间的字符串                       |
| String replace(char oldChar, char newChar)                   | 将字符串中的第一个 oldChar 替换成 newChar，返回一个新字符串  |
| byte[] getBytes()                                            | 将该 String 对象转换成 byte 数组                             |
| char[] toCharArray()                                         | 将该字符串转换为 char 数组                                   |
| String toLowerCase()                                         | 将字符串转换成小写                                           |
| String toUpperCase()                                         | 将字符串转换成大写                                           |
| int indexOf(int ch)                                          | 找出 ch 字符在该字符串中第一次出现的位置                     |
| int indexOf(int ch, int fromIndex)                           | 同上，但从 fromIndex 开始                                    |
| int indexOf(String str)                                      | 找出 str 子字符串在该字符串中第一次出现的位置                |
| int indexOf(String str, int fromIndex)                       | 同上，但从 fromIndex 开始                                    |
| int lastIndexOf(int ch)                                      | 找出 ch 字符在该字符串中最后一次出现的位置                   |
| int lastIndexOf(int ch, int fromIndex)                       | 同上，但从 fromIndex 开始                                    |
| int lastIndexOf(String str)                                  | 找出 str 子字符串在该字符串中最后一次出现的位置              |
| int lastIndexOf(String str, int fromIndex)                   | 同上，但从 fromIndex 开始                                    |
| int compareTo(String anotherString)                          | 比较两个字符串的大小： <br />1) 相等返回 0；<br />2) 不相等时，依次比较，返回第一个不相等的字符差；<br />3) 若较短字符串恰是较长字符串的首部，返回它们的长度差 |
| String concat(String str)                                    | 连接两个字符串，同+运算                                      |
| boolean contentEquals(StringBuffer sb)                       | 与 StringBuffer 比较内容是否相同                             |
| static String copyValueOf(char[] data)                       | 将字符数组连缀成字符串                                       |
| static String copyValueOf(char[] int offset, int count)      | 将字符数组从 offset 开始的 count 个字符连缀成字符串          |
| static String valueOf(X x)                                   | 一系列用于将基本类型值转换为 String 对象的方法               |
| boolean equals(Object anObject)                              | 将该字符串与指定对象比较，判断二者包含的字符序列是否相等     |
| boolean equalsIgnoreCase(String str)                         | 同上，但忽略大小写                                           |
| void getChars(int srcBegin, int srcEnd, char[] dst, int dstBegin) | 将字符串从 srcBegin 开始，到 srcEnd 结束的字符复制到 dst 字符数组从 dstBegin 开始的位置中 |
| static String join(CharSequence delimiter, CharSequence... elements) |                                                              |
| String repeat(int count)                                     |                                                              |

## StringBuilder/StringBuffer 的相关方法

| 方法                                                         | 作用                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| int length()                                                 | 返回序列长度                                                 |
| int capacity()                                               | 返回容量                                                     |
| void setLength(int newLength)                                | 设置序列长度为 newLength，超出的被截断，不足的补""           |
| public StringBxxx append(String s)                           | 将指定的字符串追加到此序列                                   |
| public StringBxxx.insert(int offset, String str)             | 将字符串 str 插入 offset 处的位置                            |
| public StringBxxx replace(int beginIndex, int endIndex, String str) | 使用给定 String 中的字符替换此序列的[beginIndex, endIndex)中的字符 |
| delete(int beginIndex, int endIndex)                         | 删除[beginIndex, endIndex)中的字符                           |
| String toString()                                            | 返回一个与构造器或缓冲器内容相同的字符串                     |
| public StringBxxx reverse()                                  | 将此字符序列以其反转形式替代                                 |

## Java 9 改动

Java 9 改进了字符串的实现：在 Java 9 以前，字符串采用 char[]数组来保存字符，因此字符串的每个字符占 2 字节；而 Java 9 的字符串采用 byte[]数组再加一个 encoding-flag 字段来保存字符，因此字符串的每个字符只占 1 字节。
