---
title: Optional类
---

## 1. Optional类的含义

变量存在时，`Optional` 类只是对类简单封装；变量不存在时，缺失的值会被建模成一个“空”的 `Optional` 对象，由方法`Optional.empty()`返回。

`Optional.empty()`是一个静态工厂方法，它返回 `Optional` 类的特定单一实例。从语义上说，`null`引用和 `Optional.empty()` 是一回事，但其实它们之间的差别非常大：如果你尝试解引用一个`null`，一定会触发 `NullPointerException`，不过使用 `Optional.empty()` 就完全没事儿，它是 `Optional` 类的一个有效对象，多种场景都能调用。

在代码中始终如一地使用 `Optional` 能够非常清晰地界定出变量值的缺失是结构上的问题，还是你算法上的缺陷，抑或是你数据中的问题。不过，引入 `Optional` 类的意图并非要消除每一个 `null` 引用，与此相反，它的目标是帮助你更好发地设计出普适的API，让程序员看到方法签名，就能了解它是否接受一个 `Optional` 的值，这种强制会让你更积极地将变量从 `Optional` 中解包出来，直面缺失的变量值。

## 2. Optional类的方法

| 方法                                                   | 描述                                                         |
| ------------------------------------------------------ | ------------------------------------------------------------ |
| `Optional.empty()`                                     | 声明一个空的 `Optional`                                      |
| `Optional.of()`                                        | 依据一个非空值创建`Optional`。即将指定值用`Optional`封装之后返回，如果该值为`null`，则抛出`NullPointerException`异常 |
| `Optional.ofNullable()`                                | 创建可接受`null`的`Optional`。即将指定值用`Optional`封装之后返回，如果该值为`null`，则返回一个空的`Optional`对象 |
| `get()`                                                | 如果该值存在，将该值用`Optional`封装返回，否则抛出`NoSuchElementException`异常 |
| `orElse(T other)`                                      | 如果有值则将其返回，否则返回一个默认值                       |
| `orElseGet(Supplier<? extends T> other)`               | 如果有值则将其返回，否则返回一个由指定的`Supplier`接口生成的值 |
| `orElseThrow(Supplier<? extends X> exceptionSupplier)` | 如果有值则将其返回，否则抛出一个由指定的`Supplier`接口生成的异常 |
| `ifPresent(Consumer<? super T>)`                       | 在值存在时执行一个作为参数传入的方法，否则不进行任何操作     |
| `isPresent()`                                          | 如果值存在就返回`true`，否则什么也不做                       |
| `filter`                                               | 如果`Optional`的值存在且满足谓词条件，返回包含该值的`Optional`对象，否则返回一个空的`Optional`对象 |
| `map`                                                  | 如果值存在，就对该值执行提供的`mapping`函数调用（否则什么也不做？） |
| `flatMap`                                              | 如果值存在，就对该值执行提供的`mapping`函数调用，返回一个`Optional`类型的值，否则返回一个空的`Optional`对象 |

## 3. 示例

> 说来说去，感觉`Optional`就是个语法糖？

### 3.1 示例1

原始的使用`null`的写法：

```java
public String getCarInsuranceName(Person person) {
    if (person == null) {
        return "Unkonwn";
    }
    Car car = person.getCar();
    if (car == null) {
        return "Unknown";
    }
    Insurance insurance = car.getInsurance();
    if (insurance == null) {
        return "Unknown";
    }
    return insurance.getName();
}
```

与上相比，处理潜在可能缺失的值时，使用`Optional`具有明显的优势（一种场景是，如果`Person`是从数据库中查询出来的，想要对数据库中不存在指定标识符对应的用户数据的情况进行建模，便可使用`Optional`）：

```java
public String getCarInsuranceName(Optional<Person> person) {
    return person.flatMap(Person::getCar)
        		 .flatMap(Car::getInsurance)
        		 .map(Insurance::getName)
        		 .orElse("Unknown"); // 如果Optional的值为空，设置默认值
}
```

> 这种方式通过类型系统让你的域模型中隐藏的知识显式地体现在你的代码中，换句话说，你永远都不应该忘记语句的首要功能就是沟通，即使对程序设计语言也没有什么不同。

<img src="https://figure-bed.chua-n.com/Java/58.png" alt="58" style="zoom:50%;" />

### 3.2 示例2

原始写法：

```java
public int readDuration(Properties props, String name) {
    String value = props.getProperty(name);
    if (value != null) { // 确保名称对应的属性存在
        try {
            int i = Integer.parseInt(value); // 将String属性转换为数字类型
            if (i > 0) { // 检查返回的数字是否为正数
                return i;
            }
        } catch (NumberFormatException nfe) {
            
        }
    }
    return 0; // 如果前述条件都不满足，返回0
}
```

`Optional`的写法：

```java
public int readDuration(Properties props, String name) {
    return Optional.ofNullable(props.getProperty(name))
        			.flatMap(OptionalUtility::stringToInt)
        			.filter(i -> i > 0)
        			.orElse(0);
}

// 以下是之前建议统一建立起来的工具方法
public static Optional<Integer> stringToInt(String s) {
    try {
        return Optional.of(Integer.parseInt(s));
    } catch (NumberFormatException e) {
        return Optional.empty();
    }
}
```

## 4. 注意事项

### 4.1 序列化

由于`Optional`类设计时就没特别考虑将其作为类的字段使用，所以它也并未实现`Serializable`接口。由于这个原因，如果你的应用使用了某些要求序列化的库或者框架，在域模型中使用`Optional`，有可能引发应用程序故障。

### 4.2 基础类型的Optional

与`Stream`对象一样，`Optional`也提供了类似的基础类型：`OptionalInt, OptionalLong, OptionalDouble`。

尽管在`Stream`中，如果`Stream`对象包含了大量元素，由于性能的考量使用基础类型是不错的选择，然而在`Optional`对象这里这个理由就不成立了，因为`Optional`对象最多包含一个值。因而我们不推荐使用基础类型的`Optional`。

