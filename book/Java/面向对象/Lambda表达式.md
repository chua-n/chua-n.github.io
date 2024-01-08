> 在其他语言中，可以直接处理代码块。Java设计者很长时间以来一直拒绝增加这个特性。毕竟Java的强大之处就在于其简单性和一致性。而就现在来说，问题已经不是是否增强Java来支持函数式编程，而是要如何做到这一点。

## 1. Lambda 表达式语法

Lambda 表达式的主要作用就是代替匿名内部类的繁琐语法，来创建**函数式接口**的实例，它由三部分组成：

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

> 由上可看出，Lambda 表达式的代码不需要 `new Xxx()`这种繁琐的代码，不需要指出重写的方法名字，也不需要给出重写的方法的返回值类型 ，而只需要给出重写的方法括号以及括号里的形参列表即可 。
>
> Lambda 表达式的本质很简单，就是使用简洁的语法来创建函数式接口的实例——这种语法避免了匿名内部类的繁琐。
>
> Lambda 表达式就相当于一个匿名方法。

## 2. Lambda 表达式详解

### 2.1 目标类型

Lambda 表达式的类型，也被称为<font size=5>目标类型(target type)</font>，其必须是函数式接口。

目标类型是通过使用Lambda表达式的上下文推断出来的，同一个Lambda表达式可能与不同的函数式接口联系起来。例如，下面两个赋值是正确的：

```java
// 附：Lambda表达式本就是给函数式接口创建实例，因而将Lambda赋值给变量是可以的。
Callable<Integer> c = () -> 42;
PrivilegeAction<Integer> p = () -> 42;
```

当然，下面的示例必然是错误的：

```java
// Lambda表达式的上下文是Object（目标类型），但Object不是一个函数式接口，因此错误。
Object o = () -> {System.out.pringln("Tricky example"); };
```

如果仍希望进行上述赋值，一个手段是使用函数式接口对 Lambda 表达式进行强制类型转换：

```java
// 以下正确
Object obj = (Runnable) () -> {
    for (int i = 0; i < 100; ++i){
        System.out.println();
    }
};
```

### 2.2 使用局部变量

Lambda表达式也允许使用外层作用域中的变量（像匿名内部类一样），这常常被称作“捕获”。Lambda对于被捕获的变量有一些限制：

- 如果捕获变量是实例/静态字段，则无限制；
- 如果捕获变量是局部变量，则该变量
    - 要么必须显式声明为`final`；
    - 要么必须是事实最终变量（称effectively final），即这个变量初始化后不会再为它赋新值。

对于上述限制，一句话概括即是：Lambda表达式只能捕获指派给它们的局部变量一次。例如，下面的代码无法通过编译，因为portNumber被赋值两次：

> 附：捕获实例字段可以被看作捕获最终局部变量this。

```java
int portNumber = 1337;
Runnable r = () -> System.out.println(portNumber);
portNumber = 31337; // 第二次赋值
```

#### 对局部变量限制的原因

局部变量存储在栈上（实例字段存储在堆上），由于Lambda是在一个线程中使用的，如果Lambda可以直接访问局部变量，则使用Lambda的线程可能会在*分配该变量的线程*将这个变量回收之后再去访问该变量，因此Java设定了Lambda在访问局部变量时实际上是在访问它的副本，而不是原始变量，进一步地，从一致性的角度出发，最终导致Java限定该局部变量不能被二次赋值。

### 2.3 this与super

在lambda表达式中也可以使用`this`和`super`关键字，使用时该二者无任何特殊之处。

当使用`this`时，是指创建这个lambda表达式的方法的`this`参数。例如，下述的`this.toString()`会调用Application对象的`toString`方法，而不是`ActionListener`实例的方法。

```java
public class Application {
    public void init() {
        ActionListener listener = event -> {
            System.out.println(this.toString());
        }
        // ...
    }
}
```

## 3. 方法引用和构造器引用

已知 Lambda 表达式的代码块只有一条代码时，程序就可以省略 Lambda 表达式中代码块的花括号，其实不仅如此，如果 Lambda 表达式的代码块只有一条代码，还可以在代码块中使用**方法引用**和**构造器引用**，它们可以让 Lambda 表达式的代码块更加简洁。

方法引用和构造器引用都需要使用两个英文冒号`::`，如下：

| 种类                   | 语法                        | 说明                                                         | 等效的 Lambda 表达式写法                       |
| ---------------------- | --------------------------- | ------------------------------------------------------------ | ---------------------------------------------- |
| 引用类方法             | `ClassName::staticMethod`   | 函数式接口中被实现方法的全部参数传给该类方法作为参数         | `(a, b, …) -> ClassName.staticMethod(a, b, …)` |
| 引用特定对象的实例方法 | `obj::instanceMethod`       | 函数式接口中被实现方法的全部参数传给该方法作为参数           | `(a, b, …) -> obj.instanceMethod(a, b, …)`     |
| 引用某类对象的实例方法 | `ClassName::instanceMethod` | 函数式接口中被实现方法的第一个参数作为调用者，后面的参数全部传给该方法作为参数 | `(a, b, …) -> a.instanceMethod(b, …)`          |
| 引用构造器             | `ClassName::new`            | 函数式接口中被实现方法的全部参数传给该构造器作为参数         | `(a, b, …) -> new ClassName(a, b, …)`          |

包含对象的方法引用与等价的lambda表达式还有一个细微的差别。考虑一个方法引用，如`separator::equals`，如果separator为null，构造s`eparator::equals`时就会立即抛出一个NPE异常，而lambda表达式`x -> separator.equals(x)`只在调用时才会抛出NPE。（<font color=red>麻意思，没看明白？？？</font>）

### 3.1 引用类方法

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

### 3.2 引用特定对象的实例方法

```java
// Converter converter = from -> "fkit.org".indexOf(from);
Converter converter = "fkit.org"::indexOf;
Integer value = converter.convert("it");
System.out.println(value); // 2
```

### 3.3 引用某类对象的实例方法

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

### 3.4 引用构造器

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

## 4. Lambda表达式与匿名内部类

Lambda表达式与匿名内部类存在如下相同点：

1. Lambda表达式与匿名内部类一样，都可以直接访问"effectively final"的局部变量，以及外部类的成员变量（包括实例变量和类变量）；

2. Lambda表达式创建的对象与匿名内部类生成的对象一样，都可以直接调用从接口中继承的默认方法。

Lambda表达式与匿名内部类主要存在如下区别：

1. 匿名内部类可以为任意接口、抽象类甚至普通类创建实例，但Lambda表达式只能为函数式接口创建实例；

3. 匿名内部类实现的抽象方法的方法体允许调用接口中定义的默认方法，但Lambda表达式的代码块不允许调用接口中定义的默认方法。

## 5. 复合Lambda表达式？？？

在实践中，你可以把多个简单的Lambda表达式复合成复杂的表达式，比如你可以使用让两个谓词之间做一个or操作组合成一个更大的谓词，而且你可以让一个函数的结果成为另一个函数的输入。

你可能会想，函数式接口中怎么可能有更多的方法呢？窍门在于，接口中可以有默认方法，也就是说它们不是抽象方法。

.................以后再说吧................

## 6. 示例

### 使用Lambda表达式调用Arrays的类方法

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
        
        // operand代表正在计算的元素索引
        long[] arr3 = new long[5];
        Arrays.parallelSetAll(arr3, operand -> operand * 5);
        System.out.println(Arrays.toString(arr3));
    }
}
```

