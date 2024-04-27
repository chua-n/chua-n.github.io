---
title: RandomAccessFile类
---

`RandomAccessFile` 是 Java 输入/输出流体系中功能最丰富的文件内容访问类，它既可以读取文件内容，又可以向文件输出数据。与普通的输入/输出流不同的是，`RandomAccessFile` 支持“随机访问”的方式，程序可以直接跳转到文件的任意地方来读写数据。

由于 `RandomAccessFile` 可以自由访问文件的任意位置，所以如果只需要访问文件部分内容，而不是把文件从头读到尾，使用 `RandomAccessFile` 将是更好的选择。

`RandomAccessFile` 最大的局限是*只能读写文件，不能读写其他 IO 节点*。

`RandomAccessFile` 包含了如下两个方法来操作文件记录指针：

| 方法                    | 作用                            |
| ----------------------- | ------------------------------- |
| `long getFilePointer()` | 返回文件记录指针的当前位置      |
| `void seek(long pos)`   | 将文件记录指针定位到 `pos` 位置 |

`RandomAccessFile` 类的两个构造器，分别可以以 `String` 参数和 `File` 参数来指定文件本身，同时，创建 `RandomAccessFile` 对象时还需要指定一个 `mode` 参数，以指定 `RandomAccessFile` 的访问模式：

- `"r"`
- `"rw"`
- `"rws"`
- `"rwd"`

使用随机文件读写操作进行写操作应该谨慎！因为比如说，如果你选择在一个文件中第一行存放学号为 1 的学生信息，第 8 行存放学号为 8 的学生信息……当所有学生的信息都被正常存放后这当然没什么问题，但如果这里边有某些行没被正确存入，那么这些行对应的文件内容将会是磁盘的垃圾信息！

