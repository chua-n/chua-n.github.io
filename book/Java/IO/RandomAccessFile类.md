---
title: RandomAccessFile类
---

RandomAccessFile是Java输入/输出流体系中功能最丰富的文件内容访问类，它既可以读取文件内容，又可以向文件输出数据。与普通的输入/输出流不同的是，RandomAccessFile支持“随机访问”的方式，程序可以直接跳转到文件的任意地方来读写数据。

由于RandomAccessFile可以自由访问文件的任意位置，所以如果只需要访问文件部分内容，而不是把文件从头读到尾，使用RandomAccessFile将是更好的选择。

RandomAccessFile最大的局限是**只能读写文件**，不能读写其他IO节点。

RandomAccessFile包含了如下两个方法来操作文件记录指针：

| 方法                   | 作用                        |
| ---------------------- | --------------------------- |
| long  getFilePointer() | 返回文件记录指针的当前位置  |
| void  seek(long pos)   | 将文件记录指针定位到pos位置 |

RandomAccessFile类的两个构造器，分别可以以String参数和File参数来指定文件本身，同时，创建RandomAccessFile对象时还需要指定一个mode参数，以指定RandomAccessFile的访问模式：

- "r"
- "rw"
- "rws"
- "rwd"

使用随机文件读写操作进行写操作应该谨慎！因为比如说，如果你选择在一个文件中第一行存放学号为1的学生信息，第8行存放学号为8的学生信息……当所有学生的信息都被正常存放后这当然没什么问题，但如果这里边有某些行没被正确存入，那么这些行对应的文件内容将会是磁盘的垃圾信息！

