## 1. HashMap类

HashMap是Map接口的典型实现类，其不能保证其中key-value对的顺序，可以使用null作为key或value。

毫无疑问，HashMap判断两个key相等的标准跟Set一样，需要其equals()返回true且hashCode值相等；而HashMap判断两个value相等的标准则只需要equals()返回true。

与HashSet相似，如果使用可变对象作为HashMap的key，并且程序修改了作为key的可变对象，则也可能出现与HashSet类似的情形：程序再也无法准确访问到Map中被修改过的key。

## 2. LinkedHashMap类

LinkedHashMap是HashMap的一个子类，其使用双向链表来维护key-value对的次序（其实只需要考虑key的次序），该链表负责维护Map的迭代顺序，迭代顺序与key-value对的插入顺序保持一致。

LinkedHashMap需要维护元素的插入顺序，因此性能略低于HashMap的性能；但因为它以链表来维护内部顺序，所以在迭代访问Map里的全部元素时将有较好的性能。

## 3. TreeMap类

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

## 4. EnumMap类

EnumMap是一个与枚举类一起使用的Map实现，EnumMap中的所有key都必须是单个枚举类的枚举值。创建EnumMap时必须显式或隐式指定它对应的枚举类。

EnumMap有如下特征：

- EnumMap在内部以数组形式保存，因而其实现形式紧凑、高效；
- EnumMap根据key的自然顺序，即枚举值在枚举类中的定义顺序，来维护key-value对的顺序；
- EnumMap不允许使用null作为key，但允许使用null作为value。但如果只是查询是否包含值为null的key，或只是删除值为null的key，不会抛出异常。

## 5. WeakHashMap

> 需要时再看吧……

## 6. IdentityHashMap

> 需要时再看吧……

## 7. Properties

> 继承自`HashTable`，竟然是个map......
