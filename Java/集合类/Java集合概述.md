## 1. Java集合体系

Java集合大致可分为Set, List, Queue, Map四种体系，集合类主要负责保存、盛装其他数据，因此集合类也被称为容器类，所有的集合类都位于java.util包下。

为了处理多线程环境下的并发安全问题，Java在java.util.concurrent包下也提供了一些多线程支持的集合类。

集合类和数组不一样，数组元素可以是基本类型的值/对象，而集合里只能保存对象，即引用类型。

虽然集合里不能放基本类型的值，但Java支持自动装箱。

Java的集合类主要由两个接口派生而出：Collection和Map，Collection和Map是Java集合框架的根接口，这两个接口又包含了一些子接口或实现类。如下图所示，其中最常用的实现类以灰色背景覆盖（另外，粗线框框住的均为接口类型，其他的框可能为接口/类）。

![36](https://chua-n.gitee.io/blog-images/notebooks/Java/36.png)

![37](https://chua-n.gitee.io/blog-images/notebooks/Java/37.png)

## 2. Collection接口

Collection接口是List,     Set, Queue接口的父接口。

### 2.1 Collection的方法

Collection接口里定义了如下操作集合元素的方法：

| 方法                               | 作用                                             |
| ---------------------------------- | ------------------------------------------------ |
| boolean  add(Object o)             | 向集合里添加一个元素，添加成功则返回true         |
| boolean  addAll(Collection c)      | 添加集合c里的所有元素，添加成功则返回true        |
| void  clear()                      | 清除集合里的所有元素，将集合长度变为0            |
| boolean  contains(Object o)        | 判断集合里是否包含指定元素                       |
| boolean  containsAll(Collection c) | 判断集合里是否包含集合c里的所有元素              |
| boolean  isEmpty()                 | 判断集合是否为空（集合长度为0:true，否则:false） |
| Iterator  iterator()               | 返回一个Iterator对象，用于遍历集合里的元素       |
| boolean  remove(Object o)          | 删除指定元素，若集合包含多个该元素，只删除第一个 |
| boolean  removeAll(Collection c)   | 删除集合c里包含的所有元素                        |
| boolean  retainAll(Collection c)   | 只保留集合c里包含的元素，相当于求交集            |
| int  size()                        | 返回集合里元素的个数                             |
| Object[]  toArray()                | 把集合转换成一个数组                             |

当使用System.out.println()方法来输出集合对象时，将输出[ele1,ele2,…]的形式，这是因为所有Collection实现类都重写了toString()方法，该方法一次性地输出集合中的所有元素。

---

Collection集合还有一个removeIf(Predicate filter)方法，可用于批量删除符合filter条件的所有元素，其参数为一个Predicate（谓词）对象，Predicate也是函数式接口，故可用Lambda表达式作为参数。详细以后再说吧……

```java
import java.util.*;

public class PredicateTest {
    public static void main(String[] args) {
        Collection books = new HashSet();
        books.add(new String("轻量级Java EE企业应用实战"));
        books.add(new String("疯狂Java讲义"));
        books.add(new String("疯狂iOS讲义"));
        books.add(new String("疯狂Ajax讲义"));
        books.add(new String("疯狂Android讲义"));
        books.removeIf(ele -> ((String) ele).length() < 10);
        System.out.println(books);
    }
}
```

### 2.2 Collection的遍历

#### 2.2.1 使用Lambda表达式遍历集合

Java为Iterable接口新增了一个forEach(Consumer action)默认方法，其参数类型是一个函数式接口，而Iterable接口是Collection接口的父接口，因此Collection集合可直接调用该方法；

当程序调用Iterable的forEach(Consumer     action)遍历集合元素时，程序会依次将集合元素传给Consumer的accept(T t)方法。

```java
import java.util.*;
public class CollectionEach {
    public static void main(String[] args) {
        Collection books = new HashSet();
        books.add("Java EE");
        books.add("Java SE");
        books.add("Java ME");
        // 调用forEach()方法遍历集合
        books.forEach(obj -> System.out.println(obj));
    }
}
```

#### 2.2.2 使用Iterator遍历集合元素

直接遍历：

```java
import java.util.*;

public class IteratorTest {
    public static void main(String[] args) {
        Collection books = new HashSet();
        books.add("Java EE");
        books.add("Java SE");
        books.add("Java ME");
        // 获取books对应的迭代器
        Iterator it = books.iterator();
        while (it.hasNext()) {
            // it.next()返回的是Object类型，因此需要强制类型转换
            String book = (String) it.next();
            System.out.println(book);
            if (book.equals("Java ME")) {
                // 删除上一次next()方法返回的元素
                it.remove();
            }
            // 对book变量赋值，不会改变集合元素本身
            book = "666666";
        }
        System.out.println(books);
    }
}
```

使用Lambda表达式：

```java
import java.util.*;

public class IteratorTest {
    public static void main(String[] args) {
        Collection books = new HashSet();
        books.add("Java EE");
        books.add("Java SE");
        books.add("Java ME");
        // 获取books对应的迭代器
        Iterator it = books.iterator();
        // 使用Lambda表达式遍历
        it.forEachRemaining(obj -> System.out.println(obj));
    }
}
```

#### 2.2.3 使用foreach循环遍历

foreach循环中的迭代变量也不是集合元素本身，系统只是依次把集合元素的值赋给迭代变量，因此在foreach循环中修改迭代变量的值也没有任何实际意义。

foreach循环迭代访问集合元素时，该集合元素也不能被改变，否则将引发ConcurrentModificationException异常。

```java
import java.util.*;

public class ForeachTest {
    public static void main(String[] args) {
        Collection books = new HashSet();
        books.add("Java EE");
        books.add("Java SE");
        books.add("Java ME");
        for (Object obj : books) {
            // 此处的book变量也不是集合元素本身
            String book = (String) obj;
            System.out.println(book);
            if (book.equals("Java ME")) {
                // 下面会引发异常
                books.remove(book);
            }
        }
        System.out.println(books);
    }
}
```

### 2.3 Collection的流式API

Java 8还新增了Stream, IntStream, LongStream, DoubleStream等流式API，支持串行和并行聚集操作的元素。

1. 其中Stream是一个通用的流接口，而IntStream, LongStream, DoubleStream则代表元素类型为int, long, double的流。

2. Java8还为上面每个流式API提供了对应的Builder，例如Stream.Builder, IntStream.Builder, LongStream.Builder, DoubleStream.Builder，开发者可以通过这些Builder来创建对应的流。

3. 独立使用Stream的步骤如下：
    1. 使用Stream或XxxStream的builder()类方法创建该Stream对应的Builder；

    2. 重复调用Builder的add()方法向该流中添加多个元素；
    3. 调用Builder的build()方法获取对应的Stream；
    4. 调用Stream的聚集方法。

对于大部分聚集方法而言，每个Stream只能执行一次（有点类似“Python迭代器”？），如下程序：

```java
class IntStreamTest {
    public static void main(String[] args) {
        IntStream is = IntStream.builder().add(20).add(13).add(-2).add(18).build();
        // 注意：下面调用聚集方法的代码每次运行只能执行一次
        // 基本聚集函数
        System.out.println(is.max().getAsInt());
        System.out.println(is.min().getAsInt());
        System.out.println(is.sum());
        System.out.println(is.count());
        System.out.println(is.average());
        // is所有元素的平方是否都大于20
        System.out.println(is.allMatch(ele -> ele * ele > 20));
        is是否包含任何元素的平方大于20
            System.out.println(is.anyMatch(ele -> ele * ele > 20));
        // 将is映射成一个新Stream，新Stream的每个元素是原Stream元素的2倍+1
        IntStream newIs = is.map(ele -> ele * 2 + 1);
        // 使用方法引用的方式来遍历集合元素
        newIs.forEach(System.out::println); // 输出41 27 -3 37
    }
}
```

Stream提供了大量的方法进行聚集操作，这些方法既可以是“中间的”(intermediate)，也可以是“末端的”(terminal)。

- **中间方法**：中间操作允许流保持打开状态，并允许直接调用后续方法，如上面的map()方法就是中间方法，中间方法的返回值是另外一个流；

    | 方法                            | 作用                                                         |
    | ------------------------------- | ------------------------------------------------------------ |
    | filter(Predicate  predicate)    | 过滤Stream中所有不符合predicate的元素                        |
    | mapToXxx(ToXxxFunction  mapper) | 对流中的元素执行一对一的转换                                 |
    | peek(Consumer  action)          | 依次对每个元素执行一些操作，该方法返回的流与原有流包含相同的元素。该方法主要用于调试 |
    | distinct()                      | 该方法用于排序流中所有重复的元素（判断元素重复的标准是使用equals()比较返回true） |
    | sorted()                        | 该方法用于保证流中的元素在后续的访问中处于有序状态           |
    | limit(long  maxSize)            | 该方法用于保证对该流的后续访问中最大允许访问的元素个数       |

- **末端方法**：末端方法是对流的最终操作，当对某个Stream执行末端方法后，该流将会被耗尽而无法再使用，如上面的sum(), count(), average()等方法都是末端方法。

    | 方法                            | 作用                                                       |
    | ------------------------------- | ---------------------------------------------------------- |
    | forEach(Consumer  action)       | 遍历流中所有元素，对每个元素执行action                     |
    | toArray()                       | 将流中所有元素转换为一个数组                               |
    | reduce()                        | 该方法有三个重载的版本，都用于通过某种操作来合并流中的元素 |
    | min()                           | 返回流中所有元素的最小值                                   |
    | max()                           | 返回流中所有元素的最大值                                   |
    | count()                         | 返回流中所有元素的数量                                     |
    | anyMatch(Predicate  predicate)  | 判断流中是否至少包含一个元素符合Predicate条件              |
    | allMatch(Predicate  predicate)  | 判断流中是否每个元素都符合Predicate条件                    |
    | noneMatch(Predicate  predicate) | 判断流中是否所有元素都不符合Predicate条件                  |
    | findFirst()                     | 返回流中的第一个元素                                       |
    | findAny()                       | 返回流中的任意一个元素                                     |

Java8允许使用流式API来操作集合，Collection接口提供了一个stream()默认方法，该方法可返回该集合对应的流，接下来即可通过流式API来操作集合元素，由于Stream可以对集合元素进行整体的聚集操作，因此Stream极大地丰富了集合的功能。

## 3. Map接口

### 3.1 Map含义

Map用于保存具有映射关系的数据，因此Map集合里保存着两组值，一组值用于保存Map的key，另外一组值用于保存Map里的value，key和value都可以是任何引用类型的数据，但key不允许重复。

<img src="https://chua-n.gitee.io/blog-images/notebooks/Java/38.png" alt="38" style="zoom:67%;" />

实际上，如果把Map里的key放在一起看，它们就组成了一个Set集合，故而所有对Set元素的要求基本就是对Map里的key的要求，Map里key集和Set里的元素集的存储形式很像。

Map子类和Set子类在名字上也惊人地相似，如下对比：

|       Set       |       Map       |
| :-------------: | :-------------: |
|     HashSet     |     HashMap     |
|  LinkedHashSet  |  LinkedHashMap  |
| SortedSet(接口) | SortedMap(接口) |
|     TreeSet     |     TreeMap     |
|     EnumSet     |     EnumMap     |

实际上，从Java源码来看，Java是先实现了Map，然后通过包装一个所有value都为null的Map就实现了Set集合！

所有的Map实现类都重写了toString()方法，调用Map对象的toString()方法总是返回如下格式的字符串：`{key1=value1, key2=value2, …}`

HashSet和HashMap里用的都是hash算法。

hash算法中，hash表里可以存储元素的位置叫做“桶”。

1. 通常情况下单个“桶”里存储一个元素，此时具有最好的性能：hash算法根据hashCode值计算出“桶”的存储位置，然后从“桶”中取出元素。

2. 但hash表的状态是open的：在发生“hash冲突”的情况下，单个桶会存储多个元素，这些元素以链表形式存储，必须按顺序搜索。

    ![39](https://chua-n.gitee.io/blog-images/notebooks/Java/39.png)

因为使用hash算法来决定其元素的存储，HashSet和HashMap的hash表具有如下属性：

- 容量(capacity)：hash表中桶的数量。
- 初始化容量(initial      capacity)：创建hash表时桶的数量。HashSet和HashMap都允许在构造器中指定初始化容量。
- 尺寸(size)：当前hash表中记录的数量。
- 负载因子(load factor)：$负载因子=size/capacity$。
    - 负载因子为0，表示空的hash表；
    - 0.5表示半满的hash表，依此类推。
    - 轻负载的hash表具有冲突少、适宜插入与查询的特点，但是使用Iterator迭代元素时比较慢。
- 负载极限：一个0-1的数值，其决定了hash表的最大填满程度。当hash表中的负载因子达到指定的“负载极限”时，hash表会自动成倍地增加容量（桶的数量），并将原有的对象重新分配，放入新的桶内，这称为rehashing。HashSet和HashMap的构造器允许指定一个负载极限，其默认值为0.75。

如果开始就知道HashSet和HashMap会保存很多记录，可以在创建时就使用较大的初始化容量，如果初始化容量始终大于HashSet和HashMap所包含的最大记录数/负载极限，就不会发生rehashing。虽然这样可以更高效地增加记录，但也要注意将初始化容量设置太高可能会浪费空间。

### 3.2 哈希算法

HashSet和HashMap里用的都是hash算法。

hash算法中，hash表里可以存储元素的位置叫做“桶”。

1. 通常情况下单个“桶”里存储一个元素，此时具有最好的性能：hash算法根据hashCode值计算出“桶”的存储位置，然后从“桶”中取出元素。

2. 但hash表的状态是open的：在发生“hash冲突”的情况下，单个桶会存储多个元素，这些元素以链表形式存储，必须按顺序搜索。

    ![39](https://chua-n.gitee.io/blog-images/notebooks/Java/39.png)

因为使用hash算法来决定其元素的存储，HashSet和HashMap的hash表具有如下属性：

- 容量(capacity)：hash表中桶的数量。
- 初始化容量(initial      capacity)：创建hash表时桶的数量。HashSet和HashMap都允许在构造器中指定初始化容量。
- 尺寸(size)：当前hash表中记录的数量。
- 负载因子(load factor)：$负载因子=size/capacity$。
    - 负载因子为0，表示空的hash表；
    - 0.5表示半满的hash表，依此类推。
    - 轻负载的hash表具有冲突少、适宜插入与查询的特点，但是使用Iterator迭代元素时比较慢。
- 负载极限：一个0-1的数值，其决定了hash表的最大填满程度。当hash表中的负载因子达到指定的“负载极限”时，hash表会自动成倍地增加容量（桶的数量），并将原有的对象重新分配，放入新的桶内，这称为rehashing。HashSet和HashMap的构造器允许指定一个负载极限，其默认值为0.75。

如果开始就知道HashSet和HashMap会保存很多记录，可以在创建时就使用较大的初始化容量，如果初始化容量始终大于HashSet和HashMap所包含的最大记录数/负载极限，就不会发生rehashing。虽然这样可以更高效地增加记录，但也要注意将初始化容量设置太高可能会浪费空间。

### 3.3 Map的方法

Map也被称为字典/关联数组，Map接口中定义了如下常用的方法：

| 方法                                      | 作用                                                         |
| ----------------------------------------- | ------------------------------------------------------------ |
| void  clear()                             | 清空所有key-value对                                          |
| boolean  containsKey(Object key)          | 查询是否包含指定的key                                        |
| boolean  containsValue(Object value)      | 查询是否包含指定的value（可能存在多个）                      |
| Set  entrySet()                           | 将所有key-value对打包成Set集合，每个集合元素都是Map.Entry对象 |
| Object  get(Object key)                   | 返回指定key所对应的value。若不存在该key，返回null            |
| boolean  isEmpty()                        | 查询是否为空                                                 |
| Set  keySet()                             | 返回该Map中所有key组成的Set集合                              |
| Object  put(Object key, Object value)     | 添加一个key-value对。若key已存在，会被覆盖                   |
| void  putAll(Map m)                       | 将某Map中的key-value复制到本Map中                            |
| Object  remove(Object key)                | 删除指定key所对应的key-value对，返回被删除key所关联的value。若key不存在，返回null |
| boolean  remove(Object key, Object value) | 删除指定key,value所对应的key-value对。若删除失败，返回false  |
| int  size()                               | 返回key-value对的数量                                        |
| Collection  values()                      | 返回该Map里所有value组成的Collection                         |

Java 8为Map还增加了如下的特殊方法（待续）：

| 方法                                                         | 作用 |
| ------------------------------------------------------------ | ---- |
| Object  compute(Object key, BiFunction remappingFunction)    |      |
| Object  computeIfAbsent(Object key, Function mappingFunction) |      |
| Object  computeIfPresent(Object key, BiFunction remappingFunction) |      |
| void  forEach(BiConsumer action)                             |      |
| Object  getOrDefault(Object key, V defaultValue)             |      |
| Object  merge(Object key, Object value, BiFunction remappingFunction) |      |
| Object  putIfAbsent(Object key, Object value)                |      |
| Object  replace(Object key, Object value)                    |      |
| boolean  replace(K key, V oldValue, V newValue)              |      |
| replaceAll(BiFunction  function)                             |      |

### 3.4 Map的内部类——Entry

Map中包括一个**内部类Entry**，该类封装了一个key-value对，其包含三个方法：

|        方法        |                     作用                      |
| :----------------: | :-------------------------------------------: |
|  Object  getKey()  |             返回该Entry里的key值              |
| Object  getValue() |            返回该Entry里的value值             |
| Object  setValue() | 设置该Entry里的value值，并返回新设置的value值 |

### 3.5 其他

类似ArrayList和Vector的关系，HashMap和Hashtable的对比几乎完全一致，还是尽量弃用老版本的Hashtable吧。

Map还有两个特殊的WeakHashMap实现类与IdentityHashMap实现类，以后再看吧……

## 4. Iterator接口

Iterator接口也是Java集合框架的成员，其主要用于遍历Collection集合中的元素，Iterator对象也被称为**迭代器**。

Iterator必须依附于Collection对象，若有一个Iterator对象，则必然有一个与之关联的Collection对象。

Iterator接口里定义了4个方法：

| 方法                                    | 作用                                 |
| --------------------------------------- | ------------------------------------ |
| boolean  hasNext()                      | 被迭代的集合元素还未遍历完时返回true |
| Object  next()                          | 返回集合里的下一个元素               |
| void  remove()                          | 删除集合里上一次next()方法返回的元素 |
| void  forEachRemaining(Consumer action) | 用于使用Lambda表达式来遍历集合元素   |

使用Iterator对集合元素进行迭代时，Iterator并不是把集合元素本身传给了迭代变量，而是把集合元素的值传给了迭代变量，所以修改迭代变量的值对集合元素本身没有任何影响；

当使用Iterator迭代访问Collection集合元素时，Collection集合里的元素不能被改变，只有通过Iterator的remove()方法删除上一次next()方法返回的集合元素才可以；否则会引发java.util.CocurrentModificationException异常。

```java
import java.util.*;

public class IteratorErrorTest {
    public static void main(String[] args) {
        Collection books = new HashSet();
        books.add("Java EE");
        books.add("Java SE");
        books.add("Java ME");
        // 获取books集合对应的迭代器
        Iterator it = books.iterator();
        while (it.hasNext()) {
            String book = (String) it.next();
            System.out.println(book);
            if (book.equals("Java ME")) {
                // 使用Iterator迭代时不能修改集合元素，下面代码引发异常
                books.remove(book);
            }
        }
    }
}
```

Iterator迭代器采用的是**快速失败(fail-fast)机制**，一旦在迭代过程中检测到该集合已经被修改（通常是程序中的其他线程修改），程序立即引发异常，而不是显示修改后的结果，这样可以避免共享资源而引发的潜在问题。

## 5. Collections工具类

Java提供了一个操作Set、List和Map等集合的工具类：Collections，该工具类提供了大量方法对集合元素进行排序、查询和修改等操作，还提供了将集合对象设置为不可变、对集合对象实现同步控制等方法。

### 5.1 对List集合的排序操作的类方法

| 方法                                  | 作用                                                         |
| ------------------------------------- | ------------------------------------------------------------ |
| void  reverse(List list)              | 反转元素顺序                                                 |
| void  shuffle(List list)              | 随机排序                                                     |
| void  sort(List list)                 | 根据元素的自然顺序排序                                       |
| void  sort(List list, Comparator c)   | 根据指定Comparator产生的顺序排序                             |
| void  swap(List list, int i, int j)   | 交换List中索引i和索引j处的元素                               |
| void  rotate(List list, int distance) | 若distance        > 0，将后distance个元素整体移到前面    若distance <        0，将前distance个元素整体移到后面 |

### 5.2 对集合元素的查找、替换操作的类方法

| 方法                                                         | 作用                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| int  binarySearch(List list, Object key)                     | 使用二分法查找指定List中的指定元素。必须保证List中的元素已经有序 |
| Object  max(Collection coll)                                 | 根据元素的自然顺序，返回给定集合中的最大元素                 |
| Object  max(Collection coll, Comparator comp)                | 根据Comparator指定的顺序，返回给定集合中的最大元素           |
| Object  min(Collection coll)                                 | 根据元素的自然顺序，返回给定集合中的最小元素                 |
| Object  min(Collection coll, Comparator comp)                | 根据Comparator指定的顺序，返回给定集合中的最小元素           |
| void  fill(List list, Object obj)                            | 使用指定元素替换指定List集合中的所有元素                     |
| int  frequency(Collection c, Object o)                       | 返回指定集合中指定元素的出现次数                             |
| int  indexOfSubList(List src, List target)                   | 返回子List对象在父List对象中第一次出现的位置索引。若不存在，返回-1 |
| int  lastIndexOfSubList(List src, List target)               | 返回子List对象在父List对象中最后一次出现的位置索引。若不存在，返回-1 |
| boolean  replaceAll(List list, Object oldVal, Object newVal) | 使用一个新值newVal替换List对象的所有旧值oldVal               |

### 5.3 同步控制

Collections类中提供了多个synchronizedXxx()方法，该方法可以将指定集合争装成线程同步的集合，从而可以解决多线程并发访问集合时的线程安全问题。

Java常用集合框架的实现类 HashSet, TreeSet, ArrayList, ArrayDeque, LinkedList, HashMap, TreeMap 都是线程不安全的。Collections提供了多个类方法可以把它们包装成线程同步的集合。

```java
import java.util.*;

public class SynchronizedTest {
    public static void main(String[] args) {
        // 下面程序创建了4个线程安全的集合对象
        Collection c = Collections.synchronizedCollection(new ArrayList());
        List list = Collections.synchronizedList(new ArrayList());
        Set s = Collections.synchronizedSet(new HashSet());
        Map m = Collections.synchronizedMap(new HashMap());
    }
}
```

### 5.4 设置不可变集合

Collections提供了如下三类方法来返回一个不可变的集合，以下方法的参数均是原有的集合对象，返回值是该集合的“只读”版本。

|       方法        | 作用                                                         |
| :---------------: | ------------------------------------------------------------ |
|    emptyXxx()     | 返回一个空的、不可变的集合对象。这里的集合可以是List/Set/Map/SortedSet/SortedMap |
|  singletonXxx()   | 返回一个只包含指定对象（只有一个或一项元素）的、不可变的集合对象。这里的集合可以是List/Map |
| unmodifiableXxx() | 返回指定集合对象的不可变视图。此处的集合可以是List/Set/Map/SortedSet/SortedMap |

### 5.5 Java9 改动

Java 9以后，可以直接调用Set,     List, Map的of()方法创建包含N个元素的不可变集合，不可变意味着程序不能向集合中添加元素，也不能从集合中删除元素。特别地，Map集合还有一个ofEntries()方法。

```java
import java.util.*;

public class Java9Collection {
    public static void main(String[] args) {
        Set set = Set.of("Java", "Kotlin", "Go", "Swift");
        System.out.println(set);
        // 不可变集合，下面代码导致运行时错误
        // set.add("Ruby");
        List list = List.of(34, -25, 67, 231);
        System.out.println(list);
        // 不可变集合，下面代码导致运行时错误
        // list.remove(1);
        Map map = Map.of("语文", 89, "数学", 82, "英语", 92);
        System.out.println(map);
        // 不可变集合，下面代码导致运行时错误
        // map.remove("语文");
        // 使用Map.entry()方法显式构建key-value对
        Map map2 = Map.ofEntries(Map.entry("语文", 89), Map.entry("数学", 82), Map.entry("英语", 92));
        System.out.println(map2);
    }
}
```

## 6. 泛型支持下的集合

Java集合有个缺点——把一个对象“丢进”集合里之后，集合就会“忘记”这个对象的数据类型，当再次取出该对象时，其编译类型就变成了Object类型，尽管运行时类型没变。

增了泛型支持后的集合，完全可以记住集合中元素的类型，并可以在编译时检查集合中元素的类型，如果试图向集合中添加不满足类型要求的对象，编译器会报错。

Java的参数化类型被称为**泛型(Generic)**。

定义泛型：

```java
// Java 7以前
List<String> strList = new ArrayList<String>();
Map<String, Integer> scores = new HashMap<String, Integer>();

// Java 7以后：菱形语法
List<String> strList = new ArrayList<>();
Map<String, Integer> scores = new HashMap<>();
```

示例：

```java
import java.util.*;

public class DiamondTest {
    public static void main(String[] args) {
        // Java自动推断出ArrayList的<>里应该是String
        List<String> books = new ArrayList<>();
        books.add("疯狂Java讲义");
        books.add("疯狂Android讲义");
        // 遍历books集合，集合元素就是String类型
        books.forEach(ele -> System.out.println(ele.length()));
        // Java自动推断出HashMap的<>里应该是String, List<String>
        Map<String, List<String>> schoolsInfo = new HashMap<>();
        List<String> schools = new ArrayList<>();
        schools.add("斜月三星洞");
        schools.add("西天取经路");
        schoolsInfo.put("孙悟空", schools);
        // 遍历Map时，Map的key是String类型，value是List<String>类型
        schoolsInfo.forEach((key, value) -> System.out.println(key + "-->" + value));
    }
}
```

