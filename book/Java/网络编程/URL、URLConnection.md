---
title: URL、URLConnection
---

## 1. URL类

| URL类的方法                     | 说明                                                         |
| ------------------------------- | ------------------------------------------------------------ |
| String  getFile()               | 获取该URL的资源名                                            |
| String  getHost()               | 获取该URL的主机名                                            |
| String  getPath()               | 获取该URL的路径部分                                          |
| int  getPort()                  | 获取该URL的端口号                                            |
| String  getProtocol()           | 获取该URL的协议名称                                          |
| String  getQuery()              | 获取该URL的查询字符串部分                                    |
| URLConnection  openConnection() | 返回一个URLConnection对象，它代表了与URL所引用的远程对象的通信连接 |
| InputStream  openStream()       | 打开与此URL的连接，并返回一个用于该取该URL资源的InputStream  |

一般地，创建一个和URL的连接，并发送请求、读取此URL引用的资源需要如下步骤：

1. 通过调用URL对象的openConnection()方法创建URLConnection对象；

2. 设置URLConnection的参数和普通请求属性；

3. 若只是发送GET方式请求，使用connect()方法建立和远程资源之间的实际连接即可；若需要发送POST方式的请求，则需要获取URLConnection实例对应的输出流来发送请求参数；

4. 远程资源变为可用，程序可以访问远程资源的头字段或通过输入流读取远程资源的数据。

## 2. URLConnection类

**URLConnection类**表示应用程序和URL之间的通信连接，程序可以通过URLConnection实例向该URL发送请求、读取URL引用的资源。

URLConnection类的一些方法见下：

- 在建立和远程资源的实际连接之前，程序可以通过如下方法来设置请求头字段：

    | 方法                                          | 说明                                                         |
    | --------------------------------------------- | ------------------------------------------------------------ |
    | setAllowUserInteraction()                     | 设置该URLConnection的allowUserInteraction请求头字段的值      |
    | setDoInput()                                  | 设置该URLConnection的doInput请求头字段的值                   |
    | setDoOutput()                                 | 设置该URLConnection的doOutput请求头字段的值                  |
    | setIfModifiedSince()                          | 设置该URLConnection的ifModifiedSince请求头字段的值           |
    | setUseCaches()                                | 设置该URLConnection的useCaches请求头字段的值                 |
    | setRequestProperty(String  key, String value) | 设置该URLConnection的key请求头字段的值为value                |
    | addRequestProperty(String  key, String value) | 为该URLConnection的key请求头字段增加value值，该方法并不会覆盖原请求头字段的值，而是将新值追加到原请求头字段中 |

- 当远程资源可用后，可使用以下方法来访问头字段和内容：

    | 方法                                | 说明                                                         |
    | ----------------------------------- | ------------------------------------------------------------ |
    | Object  getContent()                | 获取该URLConnection的内容                                    |
    | String  getHeaderField(String name) | 获取指定响应头字段的值                                       |
    | getInputStream()                    | 返回该URLConnection对应的输入流，用于获取URLConnection响应的内容 |
    | getOutputStream()                   | 返回该URLConnection对应的输出流，用于向URLConnection发送请求参数 |

- 访问特定响应头字段的值：

    | 方法                 | 说明                               |
    | -------------------- | ---------------------------------- |
    | getContentEncoding() | 获取content-encoding响应头字段的值 |
    | getContentLength()   | 获取content-length响应头字段的值   |
    | getContentType()     | 获取content-type响应头字段的值     |
    | getDate()            | 获取date响应头字段的值             |
    | getExpiration()      | 获取expires响应头字段的值          |
    | getLastModified()    | 获取last-modified响应头字段的值    |

## 3. 示例1：多线程下载器

```java
import java.io.InputStream;
import java.io.RandomAccessFile;
import java.net.HttpURLConnection;
import java.net.URL;

// 多线程下载工具类
class DownUtil {
    private String path; // 下载资源的路径
    private String targetFile; // 下载的文件的保存位置
    private int threadNum; // 需要使用的线程数
    private DownThread[] threads; // 下载的线程对象
    private int fileSize; // 下载的文件的总大小
    public DownUtil(String path, String targetFile, int threadNum) {
        this.path = path;
        this.threadNum = threadNum;
        threads = new DownThread[threadNum]; // 初始化threads数组
        this.targetFile = targetFile;
    }
    public void download() throws Exception {
        URL url = new URL(path);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setConnectTimeout(5 * 1000);
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Accept",
                                "image/gif, image/jpeg, image/pjpeg, image/pjpeg, "
                                + "application/x-shockwave-flash, application/xaml-xml, "
                                + "application/vnd.ms-xpsdocument, application/x-ms-xbap, "
                                + "application/x-ms-aplication, application/vnd.ms-excel, "
                                + "application/vnd.ms-powerpoint, application/msword, */*");
        conn.setRequestProperty("Accept-Language", "zh-CN");
        conn.setRequestProperty("Charset", "UTF-8");
        conn.setRequestProperty("Connection", "Keep-Alive");
        fileSize = conn.getContentLength(); // 得到文件大小
        conn.disconnect();
        int currentPartSize = fileSize / threadNum + 1;
        RandomAccessFile file = new RandomAccessFile(targetFile, "rw");
        file.setLength(fileSize); // 设置本地文件的大小
        file.close();
        for (int i = 0; i < threadNum; ++i) {
            int startPos = i * currentPartSize; // 计算每个线程开始的位置
            // 每个线程使用一个RandomAccessFile进行下载
            RandomAccessFile currentPart = new RandomAccessFile(targetFile, "rw");
            currentPart.seek(startPos); // 定位该线程的下载位置
            // 创建下载线程
            threads[i] = new DownThread(startPos, currentPartSize, currentPart);
            threads[i].start(); // 启动下载线程
        }
    }
    // 获取下载的完成百分比
    public double getCompleteRate() {
        int sumSize = 0;
        for (int i = 0; i < threadNum; ++i) {
            sumSize += threads[i].length;
        }
        return sumSize * 1.0 / fileSize;
    }
    private class DownThread extends Thread {
        private int startPos;
        private int currentPartSize;
        private RandomAccessFile currentPart;
        public int length;
        public DownThread(int startPos, int currentPartSize, RandomAccessFile currentPart) {
            this.startPos = startPos;
            this.currentPartSize = currentPartSize;
            this.currentPart = currentPart;
        }
        public void run() {
            try {
                URL url = new URL(path);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setConnectTimeout(5 * 1000);
                conn.setRequestMethod("GET");
                conn.setRequestProperty("Accept",
                                        "image/gif, image/jpeg, image/pjpeg, image/pjpeg, "
                                        + "application/x-shockwave-flash, application/xaml-xml, "
                                        + "application/vnd.ms-xpsdocument, application/x-ms-xbap, "
                                        + "application/x-ms-aplication, application/vnd.ms-excel, "
                                        + "application/vnd.ms-powerpoint, application/msword, */*");
                conn.setRequestProperty("Accept-Language", "zh-CN");
                conn.setRequestProperty("Charset", "UTF-8");
                InputStream inStream = conn.getInputStream();
                // 跳过startPos个字节，表明该线程只下载自己负责的那部分文件
                inStream.skip(this.startPos);
                byte[] buffer = new byte[1024];
                int hasRead = 0;
                // 读取网络数据，并写入本地文件
                while (length < currentPartSize && (hasRead = inStream.read(buffer)) != -1) {
                    currentPart.write(buffer, 0, hasRead);
                    length += hasRead;
                }
                currentPart.close();
                inStream.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}

class MultiThreadDown {
    public static void main(String[] args) throws Exception {
        // 试了一下这个https的能下载成功
        final DownUtil downUtil = new DownUtil("https://www.python.org/static/img/python-logo.png", "python.png", 4);
        downUtil.download(); // 开始下载
        new Thread(() -> {
            while (downUtil.getCompleteRate() < 1) {
                // 每隔 0.1 秒查询一次任务的完成进度
                System.out.println("已完成：" + downUtil.getCompleteRate());
                try {
                    Thread.sleep(1000);
                } catch (Exception ex) {
                }
            }
        }).start();
    }
}
```

## 4. 示例2：向Web站点发送GET请求、POST请求，并从Web站点取得响应

```java
import java.io.*;
import java.net.*;
import java.util.*;

class GetPostTest {
    /**
	     * 向指定URL发送GET方式的请求
	     * 
	     * @param url   发送请求的URL
	     * @param param 请求参数，格式满足name1=value1&name2=value2的形式
	     * @return URL代表远程资源的响应
	     */
    public static String sendGet(String url, String param) {
        String result = "";
        String urlName = url + "?" + param;
        try {
            URL realUrl = new URL(urlName);
            // 打开和URL之间的连接
            URLConnection conn = realUrl.openConnection();
            // 设置通用的请求属性
            conn.setRequestProperty("accept", "*/*");
            conn.setRequestProperty("connection", "Keep-Alive");
            conn.setRequestProperty("user-agent", "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1)");
            // 建立实际的连接
            conn.connect();
            // 获取所有的响应头字段
            Map<String, List<String>> map = conn.getHeaderFields();
            // 遍历所有的响应头字段
            for (String key : map.keySet()) {
                System.out.println(key + "--->" + map.get(key));
            }
            try (
                // 定义BufferedReader输入流来读取URL的响应
                BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream(), "utf-8"))) {
                String line;
                while ((line = in.readLine()) != null) {
                    result += "\n" + line;
                }
            }
        } catch (Exception e) {
            System.out.println("发送GET请求出现异常！" + e);
            e.printStackTrace();
        }
        return result;
    }
    /**
	     * 向指定URL发送POST方式的请求
	     * 
	     * @param url   发送请求的URL
	     * @param param 请求参数，格式应该满足name1=value1&name2=value2的形式
	     * @return URL代表远程资源的响应
	     */
    public static String sendPost(String url, String param) {
        String result = "";
        try {
            URL realUrl = new URL(url);
            // 打开和URL之间的连接
            URLConnection conn = realUrl.openConnection();
            // 设置通用的请求属性
            conn.setRequestProperty("accept", "*/*");
            conn.setRequestProperty("connection", "Keep-Alive");
            conn.setRequestProperty("user-agent", "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1)");
            // 发送POST请求必须设置如下两行
            conn.setDoOutput(true);
            conn.setDoInput(true);
            try (
                // 获取URLConnection对象对应的输出流
                PrintWriter out = new PrintWriter(conn.getOutputStream())) {
                // 发送请求参数
                out.print(param);
                // flush输出流的缓冲
                out.flush();
            }
            try (
                // 定义BufferedReader输出流来读取URL的响应
                BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream(), "utf-8"))) {
                String line;
                while ((line = in.readLine()) != null) {
                    result += "\n" + line;
                }
            }
        } catch (Exception e) {
            System.out.println("发送POST请求出现异常！" + e);
            e.printStackTrace();
        }
        return result;
    }
    // 提供主方法，测试发送GET请求和POST请求
    public static void main(String args[]) {
        // 发送GET请求
        String s = GetPostTest.sendGet("http://localhost:8888/abc/a.jsp", null);
        System.out.println(s);
        // 发送POST请求
        String s1 = GetPostTest.sendPost("http://localhost:8888/abc/login.jsp", "name=crazyit.org&pass=leegang");
        System.out.println(s1);
    }
}
```

