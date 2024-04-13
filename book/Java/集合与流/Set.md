---
title: Set
---

## 1. Set 接口

Set，即集合，不允许包含相同的元素，如果试图把两个相同的元素加入同一个 Set 集合中，则添加操作失败，add()方法返回 false，且新元素不会被加入。

HashSet 与 TreeSet 是 Set 接口最常用的两个实现：

1. HashSet 的性能总是比 TreeSet 好，特别是最常用的添加、查询操作，因为 TreeSet 需要额外的红黑树算法来维护集合元素的次序；

2. 只有当需要一个保持排序的 Set 时，才应该使用 TreeSet，否则都应该使用 HashSet。

HashSet 与 LinkedHashSet：

1. 对于普通的插入、删除操作，LinkedHashSet 比 HashSet 略微慢一点，这是由于维护链表所带来的额外开销造成的；

2. 但同样由于有了链表，遍历 LinkedHashSet 会更快。

EnumSet 是所有 Set 实现类中性能最好的，但它只能保存同一个枚举类的枚举值作为集合元素。

必须指出，Set 的三个实现类 HashSet, TreeSet, EnumSet 都是线程不安全的。为了线程安全，通常可以通过 Collections 工具类的`synchronizedSortedSet`方法来“包装”该 Set 集合，此操作最好在创建时运行。

## 2. HashSet 类

HashSet 是 Set 接口的典型实现，大多数时候使用 Set 集合里就是使用这个实现类。

HashSet 具有如下特点：

1. 不保证元素的排列顺序，可能与添加顺序不同；
2. HashSet 不是同步的，如果多个线程同时访问一个 HashSet，必须通过代码来保证同步；
3. 集合元素值可以是 null

HashSet 判断两个元素相等的标准是：

- 两个对象通过 equals()方法比较后相等；
- 并且两个对象的 hashCode()方法返回值也相等。

故而，若要把一个对象放入 HashSet 中，如果需要重写该对象对应类的 equals()方法，也应该同时重写其 hashCode()方法，从而保证当两个对象通过 equals()方法比较返回 true 时两个对象的 hashCode 值也相同；

-   若两个对象 equals()为 true，但 hashCode()不同，将导致 HashSet 把这两个对象保存在 Hash 表的不同位置，从而使两个对象都添加成功，然而这种情况与 Set 集合的理念存在冲突；
-   若两个对象 equals()为 false，但 hashCode()相同，HashSet 会试图把它们保存在同一位置，导致在这个位置用链式结构来保存多个对象，使得 HashSet 的性能下降。

重写 hashCode()方法的基本规则：

-   在程序运行过程中，同一个对象多次调用 hashCode()方法应该返回相同的值；
-   当两个对象通过 equals()方法比较返回 true 时，它们的 hashCode 方法应该返回相等的值；
-   对象中用作 equals()方法比较标准的实例变量，都应该用于计算 hashCode 值。

当向 HashSet 中添加可变对象时，必须十分小心，因为若修改 HashSet 集合中的对象，有可能导致该对象与集合中的其他对象相等，从而导致 HashSet 无法准确访问该对象。

## 3. LinkedHashSet 类

LinkedHashSet 是 HashSet 的一个子类，其也根据元素的 hashCode 值也决定元素的存储位置，但同时使用链表维护元素的次序。正因如此，LinkedHashSet 的性能略低于 HashSet，但在迭代访问 Set 里的全部元素时有很好的性能。

## 4. EnumSet 类

EnumSet 是一个专为枚举类设计的集合类，EnumSet 中的所有元素都必须是指定枚举类型的枚举值，该枚举类型是创建 EnumSet 时显式或隐式地指定。

EnumSet 的集合元素也是有序的，EnumSet 以枚举值在 Enum 类内的定义顺序来决定集合元素的顺序。

EnumSet 在内部以**位向量**的形式存储，这种存储形式非常紧凑、高效，因此 EnumSet 对象占用内存很小且运行效率很好。

EnumSet 不允许加入 null 元素，但若只想判断 EnumSet 是否包含 null 元素或试图删除 null 元素都不会抛出异常，只是删除操作将返回 false。

`EnumSet<E extends Enum<E>>` 类没有任何构造器来创建该类的实例，程序应该通过它提供的类方法来创建 EnumSet 对象，如下静态方法（均具有`static <E extends Enum<E>> EnumSet<E> `前缀）：

| 方法                         | 作用                                                         |
| ---------------------------- | ------------------------------------------------------------ |
| `allOf(Class<E> enumType)`   | 创建一个包含指定枚举类里所有枚举值的 EnumSet 集合            |
| `noneOf(Class<E> enumType)`  | 创建一个元素类型为指定枚举类型的空 EnumSet                   |
| `range(E from, E to)`        | 创建一个包含从 from 枚举值到 to 枚举值范围内所有枚举值的 EnumSet 集合 |
| `of(E first, E… rest)`       | 创建一个包含一个或多个枚举值的 EnumSet 集合，传入的多个枚举值必须属于同一个枚举类 |
| `copyOf(Collection<E> c)`    | 使用一个普通集合来创建 EnumSet 集合                          |
| `copyOf(EnumSet<E> s)`       | 创建一个与指定 EnumSet 具有相同元素类型、相同集合元素的 EnumSet 集合 |
| `complementOf(EnumSet<E> s)` | 创建一个元素类型与指定 EnumSet 里元素类型相同的 EnumSet 集合，新 EnumSet 包含原 EnumSet 所不包含的、此枚举类剩下的枚举值 |

## 5. TreeSet 类

TreeSet 是 SortedSet 接口的实现类，TreeSet 可以确保集合处于有序状态。可以以任意顺序将元素插入到集合中，在对集合进行遍历时，值将自动地按照排序后的顺序呈现，排序的动作是用一个树数据结构完成的（当前实现使用的是红黑树）。

将一个元素添加到树中要比添加到散列表中慢，参见下表。但是与检查数组或链表中的重复元素相比，使用树会快很多。如果树中包含n个元素，查找新元素的正确位置平均需要$log_2n$将比较。

![image-20220618234720132](https://figure-bed.chua-n.com/Java/image-20220618234720132.png)

与 HashSet 相比，TreeSet 提供了以下几个额外的方法：

|                          方法                          |                                       作用                                        |
| :----------------------------------------------------: | :-------------------------------------------------------------------------------: |
|                Comparator comparator()                 | 返回使用的 Comparator，对于自然排序返回 null，对于定制排序返回所使用的 Comparator |
|                     Object first()                     |                              返回集合中的第一个元素                               |
|                     Object last()                      |                             返回集合中的最后一个元素                              |
|                 Object lower(Object e)                 |                         返回集合中小于指定元素的最大元素                          |
|                Object higher(Object e)                 |                         返回集合中大于指定元素的最小元素                          |
| SortedSet subSet(Object fromElement, Object toElement) |                     返回此 Set 的子集，范围为[fromEle, toEle)                     |
|          SortedSet headSet(Object toElement)           |                    返回此 Set 的子集，由小于 toEle 的元素组成                     |
|         SortedSet tailSet(Object fromElement)          |                 返回此 Set 的子集，大于或等于 fromEle 的元素组成                  |

### 排序

TreeSet 支持两种排序方法：**自然排序**和**定制排序**，默认为自然排序。

自然排序的集合元素必须都实现了 `Comparable` 接口，当把一个对象加入 TreeSet 集合中时，TreeSet 调用该对象的 `compareTo(Object obj)`方法与容器中的其他对象比较大小，然后根据红黑树结构找到它的存储位置。

- 若两个对象比较后相等，新对象将无法添加到 TreeSet 集合中。

- 由此也意味着，如果需要把一个对象放入 TreeSet 中，在重写该对象对应类的 equals()方法时，应保证该方法与 compareTo(Object obj)方法有一致的结果。

    > 即，若两个对象通过 equals()方法比较返回 true 时，它们通过 compareTo(Object obj)方法比较应返回 0。

-   如果若 TreeSet 中添加一个可变对象后，后面程序修改了该可变对象的实例变量，这将导致它与其他对象的大小顺序发生改变，而 TreeSet 不会再次调整它们的顺序。

自然排序：TreeSet 会调用集合元素的compareTo(Ojbect obj)方法来比较元素之间的大小关系，然后将集合元素按升序排列，这种方式就是自然排序。自然排序的集合元素必须都实现了 Comparable 接口，同时，TreeSet 应该只添加一种类型的对象。

定制排序：如果需要实现定制排序，则需要在创建 TreeSet 集合对象时，提供一个 `Comparator` 对象与该 TreeSet 集合关联，由该 Comparator 对象负责集合元素的排序逻辑。

## 6. NavigableSet 类

| `NavigableSet<E>`的方法          | 作用 |
| -------------------------------- | ---- |
| `E higher(E value)`              |      |
| `E lower(E value)`               |      |
| `E ceiling(E value)`             |      |
| `E floor(E value)`               |      |
| `E pollFirst()`                  |      |
| `E pollLast()`                   |      |
| `Iterator<E> descendingIterator` |      |
