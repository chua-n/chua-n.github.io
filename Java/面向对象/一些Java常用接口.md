## 1. 让类支持比较

### 1.1 函数式接口：Comparable 

> 虽然Comparable接口在源码中未被标注为@FunctionalInterface，但根据定义，它确实应该是函数式接口。

```java
public interface Comparable<T> {
    public int compareTo(T o);
}
```

Java 提供了一个 Comparable 接口，该接口仅定义了一个`compareTo(Object obj)`方法，其返回一个整数值。Java通过设计Comparable接口让某个类的对象本身支持比较大小，只要该类实现Comparable接口即可。

当一个对象调用`compareTo(Object obj)`方法与另一个对象进行比较时，例如`obj1.compareTo(obj2)`：

| 该方法的返回值 | 大小关系     |
| -------------- | ------------ |
| 负整数         | obj1 < obj2  |
| 0              | obj1 == obj2 |
| 正整数         | obj1 > obj2  |

Java 的一些常用类已经实现了 Comparable 接口，并提供了比较大小的标准，如：

| 类                                         | 说明                                             |
| ------------------------------------------ | ------------------------------------------------ |
| BigDecimal/BigInteger 等数值型对象的包装类 | 按对应的数值大小进行比较                         |
| Character                                  | 按字符的 UNICODE 值进行比较                      |
| Boolean                                    | true 对应的包装类实例大于 false 对应的包装类实例 |
| String                                     | 按字符串中字符的 UNICODE 值进行比较              |
| Date, Time                                 | 后面的时间/日期大于前面的时间/日期               |

### 1.2. 比较器类：函数式接口 Comparator 

Java还提供了一个类似上述Comparable接口的Comparator接口，Comparator是函数式接口，其被@FunctionalInterface修饰。Comparator的实现类将作为一个比较器，其让本身不支持比较的两个对象支持比较运算，Comparator的实现类主要需实现其中的`int compare(T o1, T o2)`方法。

> 值得注意的是，Comparator内实际有两个抽象方法：`int compare(T o1, T o2)`与`boolean equals(Object obj);`，以及若干默认方法和类方法，其源码如下：
>
> ```java
> @FunctionalInterface
> public interface Comparator<T> {
>     int compare(T o1, T o2);
> 
>     boolean equals(Object obj);
> 
> 	// 若干default方法
>     // 若干static方法
> }
> ```
>
> 这似乎与函数式接口的定义违背，然而实际上equals是Object中的方法，由于所有的类都继承Object类，所以equals是继承了Object中的实现，并不需要额外的实现。
>
> 因而也可以将函数式接口认为是有且仅有一个除Object类中已有方法之外的抽象方法、但可以有多个非抽象方法的接口。

`int compare(T o1, T o2)`方法的介绍如下，其用于比较o1和o2的大小。

| `int compare(T o1, T o2)`的返回值 | 大小关系  |
| --------------------------------- | --------- |
| 负整数                            | o1  < o2  |
| 0                                 | o1  == o2 |
| 正整数                            | o1  > o2  |

## 2. java.util.function包下定义的大量函数式接口

Java8 在 java.util.function 包下预定义了大量函数式接口，典型地包含如下 4 类接口：

| 函数式接口  | 抽象方法   | 说明                                                         |
| ----------- | ---------- | ------------------------------------------------------------ |
| `Function`  | apply()    | 对参数进行处理、转换，然后返回一个新的值                     |
| `Consumer`  | accept()   | 与 Function 接口中的 apply()方法基本相似，也负责对参数进行处理，但其不返回处理结果 |
| `Predicate` | test()     | 通常用来对参数进行某种判断，然后返回一个 boolean 值          |
| `Supplier`  | getAsXxx() | 无参方法，其按某种逻辑算法返回一个数据                       |




| 函数式接口            | 函数描述符          | 原始类型特化                                                 |
| --------------------- | ------------------- | ------------------------------------------------------------ |
| `Predict<T>`          | `T -> boolean`      | IntPredict<br />LongPredict<br />DoublePredict               |
| `Consumer<T>`         | `T -> void`         | IntConsumer<br />LongConsumer<br />DoubleConsumer            |
| `Function<T,R>`       | `T -> R`            | IntFunction\<R><br />IntToDoubleFunction<br />IntToLongFunction<br />LontFunction\<R><br />LongToDoubleFunction<br />LongToIntFunction<br />DoubleFunction\<R><br />ToIntFunction\<T><br />ToDoubleFunction\<T><br />ToLongFunction\<T> |
| `Supplier<T>`         | `() -> T`           | BooleanSupplier<br />IntSupplier<br />LongSupplier<br />DoubleSupplier |
| `UnaryOperator<T>`    | `T -> T`            | IntUnaryOperator<br />LongUnaryOperator<br />DoubleUnaryOperator |
| `BinaryOperator<T>`   | `(T, T) -> T`       | IntBinaryOperator<br />LongBinaryOperator<br />DoubleBinaryOperator |
| `BiPredicate<L, R>`   | `(L, R) -> boolean` |                                                              |
| `BiConsumer<T, U>`    | `(T, U) -> void`    | ObjIntConsumer\<T><br />ObjLongConsumer\<T><br />ObjDoubleConsumer\<T> |
| `BiFunction<T, U, R>` | `(T, U) -> R`       | ToIntBiFunction<T, U><br />ToLongBiFunction<T, U><br />ToDoubleBiFunction<T, U> |

