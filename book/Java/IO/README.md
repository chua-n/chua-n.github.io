> 本意介绍Java的IO体系。

处理压缩文件——java.util.zip包：

```java
package com.chuan;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.zip.GZIPOutputStream;
import org.junit.Test;

public class GZIPTest {
    @Test
    public void testInAndOut() throws IOException {
        FileInputStream in = new FileInputStream("C:\\Users\\chuan\\Desktop\\temp\\hello.txt");
        GZIPOutputStream out = new GZIPOutputStream(new FileOutputStream("C:\\Users\\chuan\\Desktop\\temp\\hello.gz"));
        System.out.println("Writing compressing file from `hello.txt` to `hello.gz`");
        int c;
        // 读写操作
        while ((c = in.read()) != -1)
            out.write(c);
        in.close();
        out.close();
    }
}
```

