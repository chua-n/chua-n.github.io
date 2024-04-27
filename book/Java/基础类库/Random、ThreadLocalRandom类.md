---
title: Random、ThreadLocalRandom类
---

`Random` 类专门用于生成一个伪随机数，它有两个构造器：一个使用默认的种子（以当前时间作为种子），另一个构造器需要程序员显式传入一个`long`型整数的种子。

`ThreadLocalRandom`类是`Random`的增强版，用来保证系统在并发访问的环境下具有更好的线程安全性。

`Random`和`ThreadLocalRandom`都比`Math`的`random()`方法提供了更多的方式来生成各种伪随机数，可以生成浮点类型的伪随机数，也可以生成整数类型的伪随机数，还可以指定生成随机数的范围。

```java
class RandomTest {
    public static void main(String[] args) {
        Random rand = new Random();
        System.out.println(rand.nextBoolean());
        
        byte[] buffer = new byte[16];
        rand.nextBytes(buffer);
        System.out.println(Arrays.toString(buffer));
        
        // 0.0~1.0之间的double/float数
        System.out.println(rand.nextDouble());
        System.out.println(rand.nextFloat());
        
        // 平均值为0.0，标准差为1.0的伪高斯数
        System.out.println(rand.nextGaussian());
        
        // 处于int/long整数取值范围的伪随机数
        System.out.println(rand.nextInt());
        System.out.println(rand.nextLong());
        
        // 生成[0, 26)之间的伪随机整数
        System.out.println(rand.nextInt(26));
    }
}
```

| 方法                 | 作用                      |
| -------------------- | ------------------------- |
| `Random()`           | 构造一个新的随机数生成器  |
| `int nextInt(int n)` | 返回一个0~n-1之间的随机数 |

