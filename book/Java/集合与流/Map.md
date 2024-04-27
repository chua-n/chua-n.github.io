---
title: Map
date: 2020-08-08
---

## 1. Map接口

### 1.1 Map的方法

`Map` 也被称为字典/关联数组，`Map<K, V>` 接口中定义了如下常用的方法：

| 方法                                                         | 作用                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `V get(Object key)`                                          | 返回指定 `key` 所对应的 `value`。若不存在该 `key`，返回 `null`。实现类可以禁止键为 `null`。 |
| `V put(K key, V value)`                                      | 添加一个 key-value 对。若 `key` 已存在，会被覆盖             |
| `void putAll(Map<? extends K, ? extends V> entries)`         | 将某 `Map` 中的 key-value 复制到本 `Map` 中                  |
| `boolean containsKey(Object key)`                            | 查询是否包含指定的 `key`                                     |
| `boolean containsValue(Object value)`                        | 查询是否包含指定的 `value`（可能存在多个）                   |
| `boolean isEmpty()`                                          | 查询是否为空                                                 |
| `int size()`                                                 | 返回 key-value 对的数量                                      |
| `default void forEach(BiConsumer<? super K, ? super V> action)` | 对这个 `Map` 中的所有键/值对应用这个动作                     |
| `void clear()`                                               | 清空所有 key-value 对                                        |
| `V remove(Object key)`                                       | 删除指定 key 所对应的 key-value 对，返回被删除 `key` 所关联的 `value`。若 `key` 不存在，返回 `null` |
| `default boolean remove(Object key, Object value)`           | 删除指定 `key,value` 所对应的 key-value 对。若删除失败，返回 `false` |

Java 8为 Map 还增加了如下的特殊方法（待续）：

| 方法                                                         | 作用                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `default V getOrDefault(Object key, V defaultValue)`         | 如果 `key` 存在，就使用获取其对应的值，否则返回 `defaultValue` |
| `default V putIfAbsent(K key, V value)`                      | 如果 `key` 存在，或者 `key` 为 `null`，则放入一个值          |
| `default V compute(K key, BiFunction<? super K, ? super V, ? extends V> remappingFunction)` | 将函数应用到 `key` 和 `get(key)`。将 `key` 与结果关联，但是如果结果为 `null`，则删除这个键。返回 `get(key)` |
| `default V computeIfPresent(K key, BiFunction<? super K, ? super V, ? extends V> remappingFunction)` |                                                              |
| `default V computeIfAbsent(K key, Function<? super K, ? extends V> mappingFunction)` |                                                              |
| `default V merge(K key, V value, BiFunction<? super V, ? super V, ? extends V> remappingFunction)` |                                                              |
| `default V replace(K key, V value)`                          |                                                              |
| `default boolean replace(K key, V oldValue, V newValue)`     |                                                              |
| `default void replaceAll(BiFunction<? super K, ? super V, ? extends V> function)` | 在所有映射条目上应用这个函数，将键与非 `null` 结果关联，但对于 `null` 结果，则将相应的键删除 |
| `default void forEach(BiConsumer<? super K, ? super V> action)` |                                                              |

### 1.2 Map的视图

Map有3种视图：键集、值集合、键/值对集，分别对应如下三个方法：

- `Set<K> keySet()`：返回该 `Map` 中所有 `key` 组成的 `Set` 集合。可以从这个 `Set` 中删除元素，键和相关联的值将从原 `Map` 中删除，但是不能添加任何元素。
- `Collection<V> values()`：返回该 `Map` 里所有 `value` 组成的 `Collection`。可以从这个集合中删除元素，所删除的值及相应的键也将从原 `map` 中删除，但是不能添加任何元素。
- `Set<Map.Entry<K, V>> entrySet()`：将所有 key-value 对打包成 `Set` 集合，每个集合元素都是 `Map.Entry` 对象。可以从返回的 `set` 中删除元素，它们会同时从原来的 `map` 中删除，但是不能添加任何元素。

`Map` 中包括一个内部类`Map.Entry<K, V>`，该类封装了一个 key-value 对，其包含三个方法：

|          `方法`          |                          `作用`                           |
| :----------------------: | :-------------------------------------------------------: |
|       `K getKey()`       |               返回该 `Entry` 里的 `key` 值                |
|      `V getValue()`      |              返回该 `Entry` 里的 `value` 值               |
| `V setValue(V newValue)` | 设置该 `Entry` 里的 `value` 值，并返回新设置的 `value` 值 |

## 2. HashMap类

> 类似 `ArrayList` 和 `Vector` 的关系，`HashMap` 和 `Hashtable` 的对比几乎完全一致，还是尽量弃用老版本的 `Hashtable` 吧。

`HashMap` 是 `Map` 接口的典型实现类，其不能保证其中 key-value 对的顺序，可以使用 `null` 作为 key 或 value。

毫无疑问，`HashMap` 判断两个 key 相等的标准跟 Set 一样，需要其 `equals` 返回 `true` 且 `hashCode` 值相等；而 `HashMap` 判断两个 `value` 相等的标准则只需要 `equals` 返回 `true`。

与 `HashSet` 相似，如果使用可变对象作为 `HashMap` 的 key，并且程序修改了作为 key 的可变对象，则也可能出现与 HashSet 类似的情形，程序再也无法准确访问到 Map 中被修改过的 key。

`HashMap` 的构造器：

- `HashMap()`
- `HashMap(int initialCapacity)`
- `HashMap(int initialCapacity, float loadFactor)`

## 3. LinkedHashMap类

`LinkedHashMap` 是 `HashMap` 的一个子类，其使用**双向链表**来维护 key-value 对的次序（其实只需要考虑 key 的次序），该链表负责维护 `Map` 的迭代顺序，迭代顺序与 key-value 对的*插入顺序*保持一致。

`LinkedHashMap` 需要维护元素的插入顺序，因此性能略低于 `HashMap` 的性能；但因为它以链表来维护内部顺序，所以在遍历 `Map` 里的全部元素时将有较好的性能。

![image-20220619101705344](https://figure-bed.chua-n.com/Java/image-20220619101705344.png)

此外，`LinkedHashMap` 也可以使用*访问顺序*而不是插入顺序来迭代处理映射条目。每次调用 `get` 或 `put` 时，受到影响的项将从当前的位置删除，并放到项链表的尾部（只影响项在链表中的位置，而散列表的桶不会受影响，映射条目总是在键散列码对应的桶中）。

- 要构造这样一个散列映射，调用构造器：`LinkedHashMap<K, V>(initialCapacity, loadFactor, true)`

- `LinkedHashMap` 中这样一个方法，需要的时候可以选择创建一个子类并在子类中覆盖：

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
| `LinkedHashMap(int initialCapacity, float loadFactor, boolean accessOrder)` | `accessOrder` 参数为 `true` 时表示访问顺序，为 `false` 时表示插入顺序 |
| `protected boolean removeEldestEntry(Map.Entry<K,V> eldest)` | 如果想删除 `eldest` 元素，就要覆盖为返回 `true`。`eldest` 参数是预期可能删除的元素，这个方法在向映射中添加一个元素之后调用。`LinkedHashMap` 的默认实现永远返回 `false`。 |

## 4. WeakHashMap

> 需要时再看吧……

| 方法                                                 | 作用 |
| ---------------------------------------------------- | ---- |
| `WeakHashMap()`                                      |      |
| `WeakHashMap(int initialCapacity)`                   |      |
| `WeakHashMap(int initialCapacity, float loadFactor)` |      |

## 5. EnumMap类

`EnumMap`是一个键类型为枚举类型的映射，创建 `EnumMap` 时必须显式或隐式指定它对应的枚举类。`EnumMap` 可以直接且高效地实现为一个值数组。

```java
var personInCharge = new EnumMap<Weekday, Employee>(Weekday.class)
```

`EnumMap` 有如下特征：

- `EnumMap` 在内部以数组形式保存，因而其实现形式紧凑、高效；
- `EnumMap` 根据 key 的自然顺序，即枚举值在枚举类中的定义顺序，来维护 key-value 对的顺序；
- `EnumMap` 不允许使用 `null` 作为 key，但允许使用 `null` 作为 value。但如果只是查询是否包含值为 `null` 的key，或只是删除值为 null 的 key，不会抛出异常。

## 6. IdentityHashMap 类

`IdentityHashMap` 有特殊的用途。在这个类中，键的散列值不是用`hashCode`函数计算的，而是用 `System.identityHashCode` 方法计算的，这是`Object#hashCode`根据对象的内存地址计算散列码时所使用的方法。而且，在对两个对象进行比较时，`IdentityHashMap` 类使用 `==`，而不是`equals`方法。

| 方法                                   | 作用                                                         |
| -------------------------------------- | ------------------------------------------------------------ |
| `IdentityHashMap()`                    |                                                              |
| `IdentityHashMap(int expectedMaxSize)` | 构造一个空的“标识散列映射集”，其容量是大于 $1.5 \times expectedMaxSize$ 的2的最小幂值，`expectedMaxSize` 的默认值是 21 |

## 7. TreeMap类

正如 `Set` 接口派生出 `SortedSet` 子接口、`SortedSet` 接口有一个 `TreeSet` 实现类一样，`Map` 接口也派生出一个 `SortedMap` 子接口，`SortedMap` 接口也有一个 `TreeMap` 实现类。

`TreeMap` 就是一个红黑树数据结构，每个 key-value 对即作为红黑树的一个节点。`TreeMap` 存储 key-value 对时，需要根据 key 对节点进行排序，因而 `TreeMap` 可以保证所有的 key-value 对处于有序状态。

`TreeMap` 也有两种排序方式：

- **自然排序**：`TreeMap` 的所有 key 必须实现 `Comparable` 接口，且所有的 key 应该是同一个类的对象，否则会抛出 `ClassCastException` 异常。
- **定制排序**：创建 `TreeMap` 时传入一个 `Comparator` 对象，该对象负责对 `TreeMap` 中的所有 key 进行排序，此时不要求 `Map` 的 key 实现 `Comparable` 接口。

与 `TreeSet` 类似，`TreeMap` 也提供了一系列根据 key 顺序访问 key-value 对的方法：

- 返回类型为 `Map.Entry`

    | 方法                                | 作用                                                         |
    | ----------------------------------- | ------------------------------------------------------------ |
    | `Map.Entry firstEntry()`            | 返回 `Map` 中最小 key 所对应的 key-value 对。若 `Map` 为空，返回 `null` |
    | `Map.Entry lastEntry()`             | 返回 `Map` 中最大 key 所对应的 key-value 对。若 `Map` 为空，返回 `null` |
    | `Map.Entry higherEntry(Object key)` | 返回该 `Map` 中位于 key 后一位的 key-value 对（即大于指定 key 的最小 key 所对应的 key-value 对）。若 `Map` 为空，返回 `null` |
    | `Map.Entry lowerEntry(Object key)`  | 返回该 `Map` 中位于 key 前一位的 key-value 对（即小于指定 key 的最大 key 所对应的 key-value 对）。若 `Map` 为空，返回 `null` |

- 返回类型为 `Object`（作用同上，只是仅返回 key）

    | 方法                           | 作用 |
    | ------------------------------ | ---- |
    | `Object firstKey()`            |      |
    | `Object lastKey()`             |      |
    | `Object higherKey(Object key)` |      |
    | `Object lowerKey(Object key)`  |      |

- 返回子 `Map`：

    - 返回类型为 `SortedMap`

        | 方法                                             | 作用                                              |
        | ------------------------------------------------ | ------------------------------------------------- |
        | `SortedMap subMap(Object fromKey, object toKey)` | 返回子 `Map`，其 key 的范围是$[fromKey, toKey)  $ |
        | `SortedMap tailMap(Object fromKey)`              | 返回子 `Map`，其 key 的范围是$[fromKey, +\infty]$ |
        | `SortedMap headMap(Object toKey)`                | 返回子 `Map`，其 key 的范围是$(-\infty, toKey)$   |

    - 返回类型为 `NavigableMap`（含义基本同上）：

        | 方法                                                         | 作用 |
        | ------------------------------------------------------------ | ---- |
        | `NavigableMap subMap(Object fromKey, boolean fromInclusive, Object toKey, boolean  toInclusive)` |      |
        | `NavigableMap headMap(Object toKey, boolean inclusive)`      |      |
        | `NavigableMap tailMap(Object fromKey, boolean inclusive)`    |      |

当然，要访问该 `TreeMap` 使用的比较器，调用方法：

- `Comparator<? super K> comparator()`：返回对键进行排序的比较器。如果键是用 `Comparable` 接口的 `compareTo` 方法比较，则返回 `null`。

## 8. Properties

> 继承自`HashTable`，竟然是个map......

