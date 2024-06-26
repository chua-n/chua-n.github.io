---
title: 一些Java常用接口
date: 2020-09-24
---

## 1. 对象的比较

### 1.1 Comparable：让类本身支持比较

> 虽然`Comparable`接口在源码中未被标注为`@FunctionalInterface`，但根据定义，它确实应该是函数式接口。

```java
public interface Comparable<T> {
    public int compareTo(T o);
}
```

Java 提供了一个 `Comparable<T>` 接口，该接口仅定义了一个`int compareTo(T obj)`方法，一个类只要实现 `Comparable` 接口即可让自己本身的对象支持大小比较。

当一个对象调用`compareTo(T obj)`方法与另一个对象进行比较时，例如`obj1.compareTo(obj2)`：

| 该方法的返回值 |    大小关系    |
| :------------: | :------------: |
|     负整数     | `obj1 < obj2`  |
|       0        | `obj1 == obj2` |
|     正整数     | `obj1 > obj2`  |

通常而言，类的设计者应当做到 `compareTo` 方法与 `equals` 方法兼容。当然有一些情况是例外的，`BigDecimal`。

Java 的一些常用类已经实现了 `Comparable` 接口，并提供了比较大小的标准，比如：

| 类                         | 说明                                                 |
| -------------------------- | ---------------------------------------------------- |
| `BigDecimal/BigInteger` 等 | 按对应的数值大小进行比较                             |
| `Character`                | 按字符的 UNICODE 值进行比较                          |
| `Boolean`                  | `true` 对应的包装类实例大于 `false` 对应的包装类实例 |
| `String`                   | 按字符串中字符的 UNICODE 值进行比较                  |
| `Date, Time`               | 后面的时间/日期大于前面的时间/日期                   |

### 1.2 Comparator：比较器

Java还提供了一个函数式接口 `Comparator<T>`，其被`@FunctionalInterface`修饰。`Comparator`的实现类将作为一个比较器，其作用是让本身不支持比较的两个对象支持比较运算。

#### 抽象方法

`Comparator<T>` 的实现类核心是要实现其中的`int compare(T o1, T o2)`方法。其源码如下：

> 值得注意的是，`Comparator`内实际有两个抽象方法：`int compare(T o1, T o2)`与`boolean equals(Object obj)`，以及若干默认方法和类方法。这似乎与函数式接口的定义违背，然而实际上`equals`是`Object`中的方法，由于所有的类都继承`Object`类，所以`equals`是继承了`Object`中的实现，并不需要额外的实现。因而也可以将函数式接口认为是有且仅有一个除`Object`类中已有方法之外的抽象方法、但可以有多个非抽象方法的接口。

```java
@FunctionalInterface
public interface Comparator<T> {
 int compare(T o1, T o2);

 boolean equals(Object obj);

 // 若干default方法
 // 若干static方法
}
```

| `int compare(T o1, T o2)`的返回值 |  大小关系   |
| :-------------------------------: | :---------: |
|              负整数               | `o1  < o2`  |
|                 0                 | `o1  == o2` |
|              正整数               | `o1  > o2`  |

#### 其他辅助方法

`Comparator`接口包含很多方便的静态方法来创建比较器。

> `comparing`和`thenComparing`有很多重载方法，同时还有一些特化的变体形式，用来避免对`int, long, double`值的装箱。

- `comparing`：键提取器函数，将类型T映射为一个可比较的类型，如`String`。对要比较的对象应用这个函数，然后对返回的键完成比较。

    ```java
    Arrays.sort(people, Comparator.comparing(Person::getName))
    ```

- `thenComparing`：比较器可与此方法串联，来处理比较结果相同的情况：

    ```java
    Arrays.sort(people,Comparator.comparint(Person::getLastName).thenComparing(Person::getFirstName));
    ```

- `nullsFirst`：修改现有比较器，在遇到`null`值时不会抛出异常，而是将该值标记为小于正常值。

    ```java
    Comparator.comparing(Person::getMiddleName(), Comparator.nullsFirst(Comparator.naturalOrder()));
    ```

- `nullsLast`：修改现有比较器，在遇到`null`值时不会抛出异常，而是将该值标记为大于正常值。

- `naturalOrder`：

- `reverseOrder`：提供自然顺序的逆序。`naturalOrder().reversed()`等同于`reverOrder()`。

- `Comparator reversed()`：生成一个比较器，将逆转这个比较器提供的顺序。

## 2. java.util.function包下定义的大量函数式接口

Java8 在 `java.util.function` 包下预定义了大量函数式接口，典型地包含如下 4 类接口：

| 函数式接口  | 抽象方法     | 说明                                                         |
| ----------- | ------------ | ------------------------------------------------------------ |
| `Function`  | `apply()`    | 对参数进行处理、转换，然后返回一个新的值                     |
| `Consumer`  | `accept()`   | 与 `Function` 接口中的 `apply()` 方法基本相似，也负责对参数进行处理，但其不返回处理结果 |
| `Predicate` | `test()`     | 通常用来对参数进行某种判断，然后返回一个 `boolean` 值        |
| `Supplier`  | `getAsXxx()` | 无参方法，其按某种逻辑算法返回一个数据                       |




| 函数式接口            | 函数描述符          | 其他方法                                     | 原始类型特化                                                 |
| --------------------- | ------------------- | -------------------------------------------- | ------------------------------------------------------------ |
| `Runnable`            |                     |                                              |                                                              |
| `Supplier<T>`         | `() -> T`           |                                              | `BooleanSupplier`<br />`IntSupplier`<br />`LongSupplier`<br />`DoubleSupplier` |
| `Consumer<T>`         | `T -> void`         | `andThen`                                    | `IntConsumer`<br />`LongConsumer`<br />`DoubleConsumer`      |
| `BiConsumer<T, U>`    | `(T, U) -> void`    | `andThen`                                    | `ObjIntConsumer<T>`<br />`ObjLongConsumer<T>`<br />`ObjDoubleConsumer<T>` |
| `Function<T,R>`       | `T -> R`            | `compose`<br />`andThen`<br />`identity`     | `IntFunction<R>`<br />`IntToDoubleFunction`<br />`IntToLongFunction`<br />`LontFunction<R>`<br />`LongToDoubleFunction`<br />`LongToIntFunction`<br />`DoubleFunction<R>`<br />`ToIntFunction<T>`<br />`ToDoubleFunction<T>`<br />`ToLongFunction<T>` |
| `BiFunction<T, U, R>` | `(T, U) -> R`       | `andThen`                                    | `ToIntBiFunction<T, U>`<br />`ToLongBiFunction<T, U>`<br />`ToDoubleBiFunction<T, U>` |
| `UnaryOperator<T>`    | `T -> T`            | `compose`<br />`andThen`<br />`identity`     | `IntUnaryOperator`<br />`LongUnaryOperator`<br />`DoubleUnaryOperator` |
| `BinaryOperator<T>`   | `(T, T) -> T`       | `andThen`<br />`maxBy`<br />`minBy`          | `IntBinaryOperator`<br />`LongBinaryOperator`<br />`DoubleBinaryOperator` |
| `Predict<T>`          | `T -> boolean`      | `and`<br />`or`<br />`negate`<br />`isEqual` | `IntPredict`<br />`LongPredict`<br />`DoublePredict`         |
| `BiPredicate<L, R>`   | `(L, R) -> boolean` | `and`<br />`or`<br />`negate`                |                                                              |

大多数标准函数式接口都提供了非抽象方法来生成或合并函数。例如，`Predicate.isEqual(a)`等同于`a::equals`，不过如果`a`为`null`也能正常工作。再比如 `and, or, negate` 来合并谓词，如`Predicate.isEqual(a).or(Predicate.isEqual(b))`就等同于`x -> a.equal(x) || b.equals(x)`。

## 3. InvocationHandler

```java
package java.lang.reflect;

public interface InvocationHandler {
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable;
}
```

