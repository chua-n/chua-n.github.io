---
title: File类
---

File类是java.io包下表示磁盘文件信息的类，其中定义了一些与平台无关的方法来操作文件。File能创建、删除、重命名文件和目录，但不能访问文件内容本身（访问文件内容本身需要使用输入/输出流）。

在默认情况下，系统总是依据用户的工作路径来解释相对路径，这个路径由系统属性“user.dir”指定，通常也就是运行JVM时所在的路径。

File类可以使用文件路径字符串来创建File实例。

## File类的方法

- 访问文件名

    | 方法                            |
    | ------------------------------- |
    | String  getName()               |
    | String  getPath()               |
    | File  getAbsoluteFile()         |
    | String  getAbsolutePath()       |
    | String  getParent()             |
    | boolean  renameTo(File newName) |

- 文件检测相关

    | 方法                   |
    | ---------------------- |
    | boolean  exists()      |
    | boolean  canWrite()    |
    | boolean  canRead()     |
    | boolean  isFile()      |
    | boolean  isDirectory() |
    | boolean  isAbsolute()  |

- 获取常规文件信息

    | 方法                 |
    | -------------------- |
    | long  lastModified() |
    | long  length()       |

- 文件操作相关

    | 方法                                                         |
    | ------------------------------------------------------------ |
    | boolean  createNewFile()                                     |
    | boolean  delete()                                            |
    | static  File createTempFile(String prefix, String suffix)    |
    | static  File createTempFile(String prefix, String suffix, File directory) |
    | void  deleteOnExit()                                         |

- 目录操作相关

    | 方法                       | 说明                                             |
    | -------------------------- | ------------------------------------------------ |
    | boolean  mkdir()           |                                                  |
    | String[]  list()           | 可接收一个FilenameFilter参数，筛选符合条件的文件 |
    | File[]  listFiles()        |                                                  |
    | static  File[] listRoots() |                                                  |

