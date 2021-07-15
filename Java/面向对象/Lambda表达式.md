## 1. 函数式接口

Lambda 表达式是 Java 8 的重要更新，其支持将代码块作为方法参数，允许使用更简洁的代码来创建只有一个抽象方法的接口的实例，这种接口被称为**函数式接口**。

**函数式接口**(functional interface)代表只包含一个抽象方法的接口，其固然可以有多个默认方法和类方法，但只能声明一个抽象方法。Java8 专门为函数式接口提供了`@FunctionalInterface`注解，该注解通常放在接口定义前面，其对程序功能没有任何作用，只是用于告诉编译器执行更严格的检查——检查该接口必须是函数式接口，否则编译器就会报错。

Java8 在 java.util.function 包下预定义了大量函数式接口，典型地包含如下 4 类接口：

| 方法          | 作用                                                                                                                               |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| XxxFunction   | 通常包含一个 apply()抽象方法，该方法对参数进行处理、转换，然后返回一个新的值                                                       |
| XxxConsumer   | 通常包含一个 accept()抽象方法，该方法与 XxxFunction 接口中的 apply()方法基本相似，也负责对参数进行处理，只是该方法不会返回处理结果 |
| XxxxPredicate | 通常包含一个 test()抽象方法，该方法通常用来对参数进行某种判断，然后返回一个 boolean 值                                             |
| XxxSupplier   | 通常包含一个 getAsXxx()抽象方法，该方法不需要输入参数，该方法会按某种逻辑算法返回一个数据                                          |

## 2. Lambda 表达式语法

Lambda 表达式的主要作用就是代替匿名内部类的繁琐语法，它由三部分组成：

1. 形参列表：允许省略形参类型；若只有一个参数，还可省略形参列表的圆括号

2. 箭头：->

3. 代码块：若只含一条语句，可省略花括号；代码块只有一条 return 语句，甚至可以省略 return 关键字，此时 Lambda 表达式会自动返回这条语句的值

以下为之前的 Command 设计模式的例子：

```java
// 匿名内部类写法
public class CommandTest {
    public static void main(String[] args) {
        ProcessArray pa = new ProcessArray();
        int[] array = { 3, -4, 6, 4 };
        // 处理数组，具体处理行为取决于匿名内部类
        pa.process(array, new Command() {
            public void process(int[] target) {
                int sum = 0;
                for (int tmp : target) {
                    sum += tmp;
                }
                System.out.println("数组元素的总和是:" + sum);
            }
        });
    }
}
```

```java
// Lambda表达式写法
public class CommandTest2 {
    public static void main(String[] args) {
        ProcessArray pa = new ProcessArray();
        int[] array = { 3, -4, 6, 4 };
        // 处理数组，具体处理行为取决于Lambda表达式
        pa.process(array, (int[] target) -> {
            int sum = 0;
            for (int tmp : target) {
                sum += tmp;
            }
            System.out.println("数组元素的总和是:" + sum);
        });
    }
}
```

> 由上可看出，Lambda 表达式的代码不需要 new Xxx()这种繁琐的代码，不需要指出重写的方法名字，也不需要给出重写的方法的返回值类型 ，而只需要给出重写的方法括号以及括号里的形参列表即可 。
>
> Lambda 表达式就相当于一个匿名方法。

## 3. Lambda 表达式详解

Lambda 表达式的类型，也被称为“**目标类型**(target type)”，其必须是“函数式接口”。由于 Lambda 表达式的结果就是用来创建实例，因此程序中完全可以使用 Lambda 表达式对一个变量进行赋值：

```java
// Runnable接口中包含一个无参数的方法
// Lambda表达式代表的匿名方法实现了Runnable接口中唯一的、无参数的方法
// 因此下面的Lambda表达式创建了一个Runnable对象
Runnable r = () -> {
    for (int i = 0; i < 100; ++i) {
        System.out.println();
    }
};
```

Lambda 表达式有如下两个限制：

1. Lambda 表达式的目标类型必须是明确的函数式接口；
2. Lambda 表达式只能为函数式接口创建对象，因为 Lambda 表达式只能实现一个方法。

为了保证 Lambda 表达式的目标类型是一个明确的函数式接口，可以有如下三种常见方法：

1. 将 Lambda 表达式赋值给函数式接口类型的变量；

2. 将 Lambda 表达式作为函数式接口类型的参数传给某个方法；

3. 使用函数式接口对 Lambda 表达式进行强制类型转换。

    ```java
    // 以下正确
    Object obj = (Runnable) () -> {
        for (int i = 0; i < 100; ++i){
            System.out.println();
        }
    };
    ```

综上，Lambda 表达式的本质很简单，就是使用简洁的语法来创建函数式接口的实例——这种语法避免了匿名内部类的繁琐。

## 4. 方法引用和构造器引用

已知 Lambda 表达式的代码块只有一条代码时，程序就可以省略 Lambda 表达式中代码块的花括号，其实不仅如此，如果 Lambda 表达式的代码块只有一条代码，还可以在代码块中使用**方法引用**和**构造器引用**，方法引用和构造器引用可以让 Lambda 表达式的代码块更加简洁。

方法引用和构造器引用都需要使用两个英文冒号：

| 种类                   | 示例                      | 说明                                                         | 对应的 Lambda 表达式                           |
| ---------------------- | ------------------------- | ------------------------------------------------------------ | ---------------------------------------------- |
| 引用类方法             | `ClassName::staticMethod` | 函数式接口中被实现方法的全部参数传给该类方法作为参数         | `(a, b, …) -> ClassName.staticMethod(a, b, …)` |
| 引用特定对象的实例方法 | `特定对象::实例方法`      | 函数式接口中被实现方法的全部参数传给该方法作为参数           | `(a, b, …) -> 特定对象.实例方法(a, b, …)`      |
| 引用某类对象的实例方法 | `类名::实例方法`          | 函数式接口中被实现方法的第一个参数作为调用者，后面的参数全部传给该方法作为参数 | `(a, b, …) -> a.实例方法(b, …)`                |
| 引用构造器             | `类名::new`               | 函数式接口中被实现方法的全部参数传给该构造器作为参数         | `(a, b, …) -> new 类名(a, b, …)`               |

### 4.1 引用类方法

```java
@FunctionalInterface
interface Converter {
    Integer convert(String from);
}

class Test {
    // 下面代码使用Lambda表达式创建Converter对象
    public static void main(String[] args) {
        Converter converter1 = from -> Integer.valueOf(from);
        Integer val1 = converter1.convert("99");
        System.out.println(val1); // 99
        // 以下同上等价，为“引用类方法”的写法
        Converter converter2 = Integer::valueOf;
        Integer val2 = converter2.convert("99");
        System.out.println(val2); // 99
    }
}
```

### 4.2 引用特定对象的实例方法

```java
// Converter converter = from -> "fkit.org".indexOf(from);
Converter converter = "fkit.org"::indexOf;
Integer value = converter.convert("it");
System.out.println(value); // 2
```

### 4.3 引用某类对象的实例方法

```java
@FunctionalInterface
interface MyTest {
    String test(String a, int b, int c);
}

class Main {
    public static void main(String[] args) {
        // MyTest mt = (a, b, c) -> a.substring(b, c);
        MyTest mt = String::substring;
        String str = mt.test("Java I love you", 2, 9);
        System.out.println(str); // va I Lo;
    }
}
```

### 4.4 引用构造器

```java
@FunctionalInterface
interface MyTest {
    JFrame win(String title);
}

class Main {
    public static void main(String[] args) {
        // MyTest mt = (String a) -> new JFrame(a);
        MyTest mt = JFrame::new;
        JFrame jf = mt.win("My window.");
        System.out.println(jf);
    }
}
```

## 5. Lambda表达式与匿名内部类

Lambda表达式与匿名内部类存在如下相同点：

1. Lambda表达式与匿名内部类一样，都可以直接访问"effectively final"的局部变量，以及外部类的成员变量（包括实例变量和类变量）；

2. Lambda表达式创建的对象与匿名内部类生成的对象一样，都可以直接调用从接口中继承的默认方法。

Lambda表达式与匿名内部类主要存在如下区别：

1. 匿名内部类可以为任意接口创建实例——不管接口包含多少个抽象方法，只要匿名内部类实现所有的抽象方法即可，但Lambda表达式只能为函数式接口创建实例；

2. 匿名内部类可以为抽象类甚至普通类创建实例，但Lambda表达式只能为函数式接口创建实例；

3. 匿名内部类实现的抽象方法的方法体允许调用接口中定义的默认方法，但Lambda表达式的代码块不允许调用接口中定义的默认方法。

## 6. 使用Lambda表达式调用Arrays的类方法

Arrays类的有些方法需要Comparator, XxxOperator, XxxFunction等接口的实例，这些接口都是函数式接口，因此可以使用Lambda表达式来调用Arrays的方法。

```java
class LambdaArrays {
    public static void main(String[] args) {
        String[] arr1 = new String[] { "java", "fkava", "fkit", "ios", "android" };
        Arrays.parallelSort(arr1, (o1, o2) -> o1.length() - o2.length());
        System.out.println(Arrays.toString(arr1));
        // left代表数组中前一个索引处的元素，计算第一个元素时，left为1
        // right代表数组中当前索引处的索引
        int[] arr2 = new int[] { 3, -4, 25, 16, 30, 18 };
        Arrays.parallelPrefix(arr2, (left, right) -> left * right);
        System.out.println(Arrays.toString(arr2));
        long[] arr3 = new long[5];
        // operand代表正在计算的元素索引
        Arrays.parallelSetAll(arr3, operand -> operand * 5);
        System.out.println(Arrays.toString(arr3));
    }
}
```

