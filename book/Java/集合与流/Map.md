---
title: Map
date: 2020-08-08
---

> Java类库为映射（map）提供了两个通用的实现：HashMap和TreeMap，这两个类都实现了Map接口。

## 1. Map接口

### 1.1 Map的方法

Map也被称为字典/关联数组，`Map<K, V>`接口中定义了如下常用的方法：

| 方法                                                         | 作用                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `V get(Object key)`                                          | 返回指定key所对应的value。若不存在该key，返回null。实现类可以禁止键为null。 |
| `V put(K key, V value)`                                      | 添加一个key-value对。若key已存在，会被覆盖                   |
| `void putAll(Map<? extends K, ? extends V> entries)`         | 将某Map中的key-value复制到本Map中                            |
| `boolean containsKey(Object key)`                            | 查询是否包含指定的key                                        |
| `boolean containsValue(Object value)`                        | 查询是否包含指定的value（可能存在多个）                      |
| `boolean isEmpty()`                                          | 查询是否为空                                                 |
| `int size()`                                                 | 返回key-value对的数量                                        |
| `default void forEach(BiConsumer<? super K, ? super V> action)` | 对这个Map中的所有键/值对应用这个动作                         |
| `void clear()`                                               | 清空所有key-value对                                          |
| `V remove(Object key)`                                       | 删除指定key所对应的key-value对，返回被删除key所关联的value。若key不存在，返回null |
| `default boolean remove(Object key, Object value)`           | 删除指定key,value所对应的key-value对。若删除失败，返回false  |

Java 8为Map还增加了如下的特殊方法（待续）：

| 方法                                                         | 作用                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `default V getOrDefault(Object key, V defaultValue)`         | 如果key存在，就使用获取其对应的值，否则返回defaultValue      |
| `default V putIfAbsent(K key, V value)`                      | 如果key存在，或者key为null，则放入一个值                     |
| `default V compute(K key, BiFunction<? super K, ? super V, ? extends V> remappingFunction)` | 将函数应用到key和get(key)。将key与结果关联，但是如果结果为null，则删除这个键。返回get(key) |
| `default V computeIfPresent(K key, BiFunction<? super K, ? super V, ? extends V> remappingFunction)` |                                                              |
| `default V computeIfAbsent(K key, Function<? super K, ? extends V> mappingFunction)` |                                                              |
| `default V merge(K key, V value, BiFunction<? super V, ? super V, ? extends V> remappingFunction)` | 如果key与一个非null值v关联，将函数应用到v和value，将key与结果关联，但如果结果为null，则删除这个键；否则，将key与value关联，返回get(key) |
| `default V replace(K key, V value)`                          |                                                              |
| `default boolean replace(K key, V oldValue, V newValue)`     |                                                              |
| `default void replaceAll(BiFunction<? super K, ? super V, ? extends V> function)` | 在所有映射条目上应用这个函数，将键与非null结果关联，但对于null结果，则将相应的键删除 |
| `default void forEach(BiConsumer<? super K, ? super V> action)` |                                                              |

### 1.2 Map的视图

Map有3种视图：键集、值集合、键/值对集，分别对应如下三个方法：

- `Set<K> keySet()`：返回该Map中所有key组成的Set集合。可以从这个set中删除元素，键和相关联的值将从原map中删除，但是不能添加任何元素。
- `Collection<V> values()`：返回该Map里所有value组成的Collection。可以从这个集合中删除元素，所删除的值及相应的键也将从原map中删除，但是不能添加任何元素。
- `Set<Map.Entry<K, V>> entrySet()`：将所有key-value对打包成Set集合，每个集合元素都是Map.Entry对象。可以从返回的set中删除元素，它们会同时从原来的map中删除，但是不能添加任何元素。

Map中包括一个内部类`Map.Entry<K, V>`，该类封装了一个key-value对，其包含三个方法：

|          `方法`          |                    `作用`                     |
| :----------------------: | :-------------------------------------------: |
|       `K getKey()`       |             返回该Entry里的key值              |
|      `V getValue()`      |            返回该Entry里的value值             |
| `V setValue(V newValue)` | 设置该Entry里的value值，并返回新设置的value值 |

## 2. HashMap类

> 类似ArrayList和Vector的关系，HashMap和Hashtable的对比几乎完全一致，还是尽量弃用老版本的Hashtable吧。

HashMap是Map接口的典型实现类，其不能保证其中key-value对的顺序，可以使用null作为key或value。

毫无疑问，HashMap判断两个key相等的标准跟Set一样，需要其equals()返回true且hashCode值相等；而HashMap判断两个value相等的标准则只需要equals()返回true。

与HashSet相似，如果使用可变对象作为HashMap的key，并且程序修改了作为key的可变对象，则也可能出现与HashSet类似的情形：程序再也无法准确访问到Map中被修改过的key。

HashMap的构造器：

- `HashMap()`
- `HashMap(int initialCapacity)`
- `HashMap(int initialCapacity, float loadFactor)`

## 3. LinkedHashMap类

LinkedHashMap是HashMap的一个子类，其使用**双向链表**来维护key-value对的次序（其实只需要考虑key的次序），该链表负责维护Map的迭代顺序，迭代顺序与key-value对的插入顺序保持一致。

LinkedHashMap需要维护元素的插入顺序，因此性能略低于HashMap的性能；但因为它以链表来维护内部顺序，所以在迭代访问Map里的全部元素时将有较好的性能。

![image-20220619101705344](https://chua-n.gitee.io/figure-bed/notebook/Java/image-20220619101705344.png)

此外，LinkedHashMap可以使用访问顺序而不是插入顺序来迭代处理映射条目。每次调用get或put时，受到影响的项将从当前的位置删除，并放到项链表的尾部（只影响项在链表中的位置，而散列表的桶不会受影响，映射条目总是在键散列码对应的桶中）。

- 要构造这样一个散列映射，调用构造器：`LinkedHashMap<K, V>(initialCapacity, loadFactor, true)`

- LinkedHashMap中这样一个方法，需要的时候可以选择创建一个子类并在子类中覆盖：

    ```java
    protected boolean removeEldestEntry(Map.Entry<K,V> eldest) {
        return false;
    }
    ```

- 访问顺序对于实现缓存的“最近最少使用”原则十分重要。

| 方法                                                         | 作用                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `LinkedHashMap()`                                            |                                                              |
| `LinkedHashMap(int initialCapacity)`                         |                                                              |
| `LinkedHashMap(int initialCapacity, float loadFactor)`       |                                                              |
| `LinkedHashMap(int initialCapacity, float loadFactor, boolean accessOrder)` | accessOrder参数为true时表示访问顺序，为false时表示插入顺序   |
| `protected boolean removeEldestEntry(Map.Entry<K,V> eldest)` | 如果想删除eldest元素，就要覆盖为返回true。eldest参数是预期可能删除的元素，这个方法在向映射中添加一个元素之后调用。LinkedHashMap的默认实现永远返回false。 |

## 4. WeakHashMap

> 需要时再看吧……

| 方法                                                 | 作用 |
| ---------------------------------------------------- | ---- |
| `WeakHashMap()`                                      |      |
| `WeakHashMap(int initialCapacity)`                   |      |
| `WeakHashMap(int initialCapacity, float loadFactor)` |      |

## 5. EnumMap类

EnumMap是一个键类型为枚举类型的映射，创建EnumMap时必须显式或隐式指定它对应的枚举类。EnumMap可以直接且高效地实现为一个值数组。

```java
var personInCharge = new EnumMap<Weekday, Employee>(Weekday.class)
```

EnumMap有如下特征：

- EnumMap在内部以数组形式保存，因而其实现形式紧凑、高效；
- EnumMap根据key的自然顺序，即枚举值在枚举类中的定义顺序，来维护key-value对的顺序；
- EnumMap不允许使用null作为key，但允许使用null作为value。但如果只是查询是否包含值为null的key，或只是删除值为null的key，不会抛出异常。

## 6. IdentityHashMap 类

类 IdentityHashMap 有特殊的用途。在这个类中，键的散列值不是用`hashCode`函数计算的，而是用`System.identityHashCode`方法计算的，这是`Object#hashCode`根据对象的内存地址计算散列码时所使用的方法。而且，在对两个对象进行比较时，IdentityHashMap类使用 `==`，而不是`equals`方法。

| 方法                                   | 作用                                                         |
| -------------------------------------- | ------------------------------------------------------------ |
| `IdentityHashMap()`                    |                                                              |
| `IdentityHashMap(int expectedMaxSize)` | 构造一个空的“标识散列映射集”，其容量是大于 1.5 * expectedMaxSize 的2的最小幂值，expectedMaxSize 的默认值是21 |

## 7. TreeMap类

正如Set接口派生出SortedSet子接口，SortedSet接口有一个TreeSet实现类一样，Map接口也派生出一个SortedMap子接口，SortedMap接口也有一个TreeMap实现类。

TreeMap就是一个红黑树数据结构，每个key-value对即作为红黑树的一个节点。TreeMap存储key-value对时，需要根据key对节点进行排序，因而TreeMap可以保证所有的key-value对处于有序状态。

TreeMap也有两种排序方式：

1. 自然排序：TreeMap的所有key必须实现Comparable接口，且所有的key应该是同一个类的对象，否则会抛出ClassCastException异常。
2. 定制排序：创建TreeMap时传入一个Comparator对象，该对象负责对TreeMap中的所有key进行排序，此时不要求Map的key实现Comparable接口。

与TreeSet类似，TreeMap也提供了一系列根据key顺序访问key-value对的方法：

- 返回类型为Map.Entry

    | 方法                               | 作用                                                         |
    | ---------------------------------- | ------------------------------------------------------------ |
    | Map.Entry  firstEntry()            | 返回Map中最小key所对应的key-value对。若Map为空，返回null     |
    | Map.Entry  lastEntry()             | 返回Map中最大key所对应的key-value对。若Map为空，返回null     |
    | Map.Entry  higherEntry(Object key) | 返回该Map中位于key后一位的key-value对（即大于指定key的最小key所对应的key-value对）。若Map为空，返回null |
    | Map.Entry  lowerEntry(Object key)  | 返回该Map中位于key前一位的key-value对（即小于指定key的最大key所对应的key-value对）。若Map为空，返回null |

- 返回类型为Object（作用同上，只是仅返回key）

    | 方法                          | 作用 |
    | ----------------------------- | ---- |
    | Object  firstKey()            |      |
    | Object  lastKey()             |      |
    | Object  higherKey(Object key) |      |
    | Object  lowerKey(Object key)  |      |

- 返回子Map：

    - 返回类型为SortedMap

        | 方法                                            | 作用                                         |
        | ----------------------------------------------- | -------------------------------------------- |
        | SortedMap  subMap(Object fromKey, object toKey) | 返回子Map，其key的范围是$[fromKey, toKey)  $ |
        | SortedMap  tailMap(Object fromKey)              | 返回子Map，其key的范围是$[fromKey, +\infty]$ |
        | SortedMap  headMap(Object toKey)                | 返回子Map，其key的范围是$(-\infty, toKey)$   |

    - 返回类型为NavigableMap（含义基本同上）：

        | 方法                                                         | 作用 |
        | ------------------------------------------------------------ | ---- |
        | NavigableMap  subMap(Object fromKey, boolean fromInclusive, Object toKey, boolean  toInclusive) |      |
        | NavigableMap  headMap(Object toKey, boolean inclusive)       |      |
        | NavigableMap  tailMap(Object fromKey, boolean inclusive)     |      |

当然，要访问该TreeMap使用的比较器，调用方法：

- `Comparator<? super K> comparator()`：返回对键进行排序的比较器。如果键是用Comparable接口的compareTo方法比较，则返回null。

## 8. Properties

> 继承自`HashTable`，竟然是个map......

