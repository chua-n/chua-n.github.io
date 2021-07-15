## 1. List 接口

List 接口代表的集合表示一个元素有序、可重复的集合，集合中每个元素都有其对应的顺序索引。

由于 List 可以根据位置索引来访问集合中的元素，因此 List 增加了一种新的遍历集合元素的方法，即使用普通的 for 循环来遍历。

显然，List 判断对象相等只需 equals()方法返回 true。

在老版本的 Java 实现中，ArrayList 的实现实际是 Vector 类，对于栈结构也有一个单独的 Stack 类，虽然这些老版本的实现是线程安全的，且功能与新版本的相关类相差无几，但还是建议使用新版本的实现而弃用老版本，即便在需要线程安全的条件下也应该使用新版本的实现然后用 Collections 工具类帮助线程同步。

### 1.1 `listIterator()`方法及其返回的`ListIterator`对象

与 Set 只有一个`iterator()`方法不同，List 还提供有一个`listIterator()`方法，该方法返回一个`ListIterator`对象，`ListIterator`接口继承了`Iterator`接口，提供了专门操作 List 的方法。`ListIterator`接口在 Iterator 接口基础上增加了如下方法：

|         方法          |                  作用                  |
| :-------------------: | :------------------------------------: |
| boolean hasPrevious() | 判断迭代器关联的集合是否还有上一个元素 |
|   Object previous()   |         返回迭代器的上一个元素         |
|  void add(Object o)   |         在指定位置插入一个元素         |

### 1.2 List 接口的方法

List 作为 Collection 接口的子接口，当然可以使用 Collection 接口里的全部方法，此外，List 还支持以下方法：

| 方法                                     | 作用                                                         |
| ---------------------------------------- | ------------------------------------------------------------ |
| void add(int index, Object element)      | 将元素 element 插入到 index 处                               |
| boolean addAll(int index, Collection c)  | 将集合 c 的所有元素插入到 index 处                           |
| Object get(int index)                    | 返回位置 index 处的元素                                      |
| int indexOf(Object o)                    | 返回对象 o 第一次出现的位置索引                              |
| int lastIndexOf(Object o)                | 返回对象 o 最后一次出现的位置索引                            |
| Object remove(int index)                 | 删除并返回 index 索引处的元素                                |
| Object set(int index, Object element)    | 将 index 索引处的元素替换成 element 对象，返回被替换的旧元素 |
| List subList(int fromIndex, int toIndex) | 返回索引[fromIndex, toIndex)处所有集合元素组成的子集         |
| void replaceAll(UnaryOperator operator)  | 根据 operator 指定的计算规则重新设置 List 集合的所有元素     |
| void sort(Comparator c)                  | 根据 Comparator 类型的参数排序                               |

### 1.3 List 的使用建议

关于使用 List 集合有如下建议：

1. 若需要遍历 List 集合元素，对于 ArrayList，应用使用随机访问方法(get)来遍历；对于 LinkedList，应该采用迭代器(Iterator)来遍历。

2. 如果需要经常执行插入、删除操作来改变包含大量数据的 List 集合的大小，可考虑使用 LinkedList 集合，因为使用 ArrayList, Vector 集合可能需要经常重新分配内部数组的大小。

3. 如果多个线程需要同时访问 List 集合中的元素，可考虑使用 Collections 将集合包装成线程安全的集合。

## 2. ArrayList 类

ArrayList 是 List 的一个典型实现，完全支持 List 接口的全部功能。

|           ArrayList 的构造方法            |                             作用                             |
| :---------------------------------------: | :----------------------------------------------------------: |
|             `ArrayList<E>()`              |               创建一个空 list（初始容量为 10）               |
|    `ArrayList<E>(int initialCapacity)`    |           创建一个容量为 initialCapacity 的空 list           |
| `ArrayList<E>(Collection<? extends E> c)` | 按照集合 c 的迭代器返回的顺序构造一个包含指定集合元素的 list |

ArrayList 是基于数组实现的 List 类，所以 ArrayList 类封装了一个动态的、允许再分配的 Object[]数组。

-   ArrayList 使用 initialCapacity 参数来设置该数组的长度，当向 ArrayList 中添加元素超出了该数组的长度时，它们的 initialCapacity 会自动增加；
-   程序员无须关心 initialCapacity 参数，但若向 ArrayList 中添加大量元素时，可使用 ensureCapacity(int minCapacity)方法一次性地增加 initialCapacity，这可以减少重分配的次数，从而提高性能；

-   如果开始就知道 ArrayList 需要保存多少个元素，可以在创建它们时就指定 initialCapacity 大小；

-   当创建空的 ArrayList 时不指定 initialCapacity 参数，则 Object[]数组的长度默认为 10。

ArrayList 提供了两个方法来重新分配 Ojbect[]数组：

| 方法                                 | 解释                                                              |
| ------------------------------------ | ----------------------------------------------------------------- |
| void ensureCapacity(int minCapacity) | 将 ArrayList 集合的 Object[]数组长度增加大于或等于 minCapacity 值 |
| void trimToSize()                    | 调整 ArrayList 的 Object[]数组长度为当前元素的个数                |

## 3. LinkedList 类

LinkedList类是List接口的实现类，因而可以根据索引来随机访问元素；LinkedList同时还实现了Deque接口，这意味着，LinkedList类还可被用作双端队列、栈、队列使用。

LinkedList与ArrayList、ArrayDeque的实现机制完全不同，后两者内部以数组的形式来保存集合中的元素，而LinkedList内部以链表的形式来保存集合中的元素。因此LinkedList随机访问集合元素的性能较差，但在插入、删除元素时性能比较出色。

