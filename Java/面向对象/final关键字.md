final关键字可用于修饰类、变量、方法，用于表示它修饰的类、方法、变量不可改变。

## 1. final修饰变量

final修饰变量时，表示该变量一旦获得了初始值就不可被改变。

当使用final修饰基本类型变量时，这意味着基本类型变量不能被改变；但对于引用类型变量而言，它保存的仅仅是一个引用，final只保证这个引用类型所引用的地址不会改变，即一直引用同一个对象，然而这个对象完全可以发生改变。

### 1.1 final修饰实例字段

> <font color="red">成员变量无法显式地初始化（可能是因为成员变量是存储在堆上？？？）</font>

类的**成员变量**是随类初始化或对象初始化而初始化的，因此final修饰的成员变量必须由程序员显式地指定初始值。具体地：

1. 类变量：必须在静态初始化块中指定初始值或声明该类变量时指定初始值，而且只能在两个地方的其中之一指定；

2. 实例变量：必须在非静态初始化块、声明该实例变量时或构造器中指定初始值，而且只能在三个地方的其中之一指定。

> 《疯狂Java讲义》：final成员变量在显式初始化之前不能直接访问，但可以通过方法来访问，这是Java设计的一个缺陷。

清华大学郑莉的说法：

1. final实例变量必须在每个构造方法结束之前赋初值，以保证使用之前会被初始化；
2. final类变量必须在声明的同时初始化（因为类变量在所有类的对象产生之前就已经存在了，所以它的存在不依赖于构造方法）。

### 1.2 final修饰局部变量

> <font color="red">局部变量都必须显式初始化（可能是因为成员变量是存储在栈上？？？）</font>

如果final修饰的**局部变量**在定义时没有指定默认值，则可以在后面代码中对该final变量赋初始值，但只能一次，不能重复赋值。

```java
public static void method1() {
    // 声明一个局部变量的同时对其进行初始化：由于是final的，因此在初始化后不能再重新赋值
    final int num = 100;
    // num = 50;  // 本条语句将编译报错
    System.out.println(num);
}

public static void method2() {
    final int num;  // 声明一个局部变量
    num = 100;  // 对该局部变量初始化：由于是final的，因此在初始化后不能再重新赋值
    // num = 50;  // 本条语句将编译报错
    System.out.prinln(num);
}
```

### 1.3 宏替换

对于一个final变量来说，只要它满足三个条件，这个final变量在编译时就不再是一个变量，而是相当于一个直接量，会产生“**宏替换**”：

1. 使用final修饰；
2. 在定义该final变量时指定了初始值；
3. 该初始值可以在编译时就被确定下来。

- FinalReplaceTest.java

    ```java
    public class FinalReplaceTest {
        public static void main(String[] args) {
            
            // 下面定义了4个final“宏变量”
            final int a = 5 + 2;
            final double b = 1.2 / 3;
            final String str = "疯狂" + "Java";
            final String book = "疯狂Java讲义" + 99.0;
    
            // 下面的book2变量的值因为调用了方法，所以无法在编译时被确定下来
            final String book2 = "疯狂Java讲义：" + String.valueOf(99.0);
            
            // 下面定义一个普通的非final变量
            String book3 = "疯狂Java讲义";
        }
    }
    ```

    > 编译后的：FinalReplaceTest.class
    >
    > ```java
    > //
    > // Source code recreated from a .class file by IntelliJ IDEA
    > // (powered by FernFlower decompiler)
    > //
    > 
    > public class FinalReplaceTest {
    >     public FinalReplaceTest() {
    >     }
    > 
    >     public static void main(String[] var0) {
    >         String var6 = "疯狂Java讲义：" + String.valueOf(99.0D);
    >         String var7 = "疯狂Java讲义";
    >     }
    > }
    > ```

- StringJoinTest.java

    ```java
    public class StringJoinTest {
        public static void main(String[] args) {
            String s1 = "疯狂Java";
            // s2变量引用的字符串可以在编译时就确定下来
            // 因此s2直接引用常量池中已有的"疯狂Java"字符串
            String s2 = "疯狂" + "Java";
            System.out.println(s1 == s2); // true
    
            // 定义2个字符串直接量
            String str1 = "疯狂";
            String str2 = "Java";
            // 将 str1 和 str2 进行连接运算
            String s3 = str1 + str2;
            System.out.println(s1 == s3); // false
    
            // 若上述str1和str2使用了final修饰，则s1==s3将会输出true
            final String str3 = "疯狂";
            final String str4 = "Java";
            String s4 = str3 + str4;
            System.out.println(s1 == s4); // true
        }
    }
    ```

## 2. final修饰方法

final修饰的方法不可被重写。

即使用final修饰一个private访问权限的方法，依然可以在其子类中定义与该方法同名、同参数列表、同返回值类型的方法。这还是因为private方法其子类无法访问，所以子类无法重写该方法，故而即使用final进行了修饰，在子类中定义这样一个方法也不构成重写。

## 3. final修饰类

final修饰的类不可以有子类。例如java.lang.Math类就是一个final类，其不可以有子类.

使用final定义**不可变类**：

1. 不可变(immutable)类的意思是创建该类的实例后，该实例的实例变量是不可改变的。Java提供的8个包装类和java.lang.String类都是不可变类，当创建它们的实例后，其实例的实例变量不可改变。

2. 要创建自定义的不可变类，可遵守如下规则：

    - 使用private和final来修饰该类的成员变量；
    - 提供带参数的构造器，用于根据传入参数来初始化类里的成员变量；
    - 仅为该类的成员变量提供getter方法，不要提供setter方法，因为普通方法无法修改final修饰的成员变量；
    - 如有必要，重写Object类的hashCode()和equals()方法

3. 示例（这个示例有点问题？）：

    ```java
    public class Address {
        private final String detail;
        private final String postCode;
        public Address() {
            this.detail = "";
            this.postCode = "";
        }
        public Address(String detail, String postCode) {
            this.detail = detail;
            this.postCode = postCode;
        }
        // 仅为两个变量提供getter方法
        public String getDetail() {
            return this.detail;
        }
        public String getPostCode() {
            return this.postCode;
        }
        // 重写equals方法，判断两个对象是否相等
        public boolean equals(Object obj) {
            if (this == obj) {
                return true;
            }
            if (obj != null && obj.getClass() == Address.class) {
                Address ad = (Address) obj;
                // 当detail和postCode相等时，认为两个Address对象相等
                if (this.getDetail().equals(ad.getDetail()) && this.getPostCode().equals(ad.getPostCode())) {
                    return true;
                }
            }
            return false;
        }
        public int hashCode() {
            return detail.hashCode() + postCode.hashCode() * 31;
        }
    }
    ```

## 4. 缓存实例的不可变类

缓存是软件设计中一个非常有用的模式，缓存的实现方式有很多种，这里使用一个数组来作为缓存池，从而实现一个缓存实例的不可变类。

```java
class CacheImmutale {
    private static int MAX_SIZE = 10;
    
    // 使用数组来缓存已有的实例
    private static CacheImmutale[] cache = new CacheImmutale[MAX_SIZE];
    // 记录缓存实例在缓存中的位置，cache[pos-1]是最新缓存的实例
    private static int pos = 0;
    private final String name;
    
    private CacheImmutale(String name) {
        this.name = name;
    }
    
    public String getName() {
        return name;
    }
    
    public static CacheImmutale valueOf(String name) {
        for (int i = 0; i < MAX_SIZE; i++) {
            // 如果已有相同实例，直接返回该缓存的实例
            if (cache[i] != null && cache[i].getName().equals(name)) {
                return cache[i];
            }
        }
        // 若缓存池已满
        if (pos == MAX_SIZE) {
            // 把缓存的第一个对象覆盖
            cache[0] = new CacheImmutale(name);
            pos = 1;
        } else {
            // 把新创建的对象缓存起来
            cache[pos++] = new CacheImmutale(name);
        }
        return cache[pos - 1];
    }
    
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj != null && obj.getClass() == CacheImmutale.class) {
            CacheImmutale ci = (CacheImmutale) obj;
            return name.equals(ci.getName());
        }
        return false;
    }
    
    public int hashCode() {
        return name.hashCode();
    }
}

public class CacheImmutaleTest {
    public static void main(String[] args) {
        CacheImmutale c1 = CacheImmutale.valueOf("hello");
        CacheImmutale c2 = CacheImmutale.valueOf("hello");
        System.out.println(c1 == c2); // true
    }
}
```

