## 1. Queue接口

Queue用于模拟队列这种数据结构，通常，队列不允许随机访问队列中的元素。

Java的Queue接口中定义了如下几个方法：

- 失败时抛出异常的：

    | 方法                | 作用                                                     |
    | ------------------- | -------------------------------------------------------- |
    | void  add(Object e) | 将某元素添加至队尾。若添加失败（容易限制），抛出异常     |
    | Object  element()   | 获取队列头部的元素，但不删除该元素。若队列为空，抛出异常 |
    | Object  remove()    | 获取并删除队列头部的元素。若队列为空，抛出异常           |

- 失败时正常返回的：

    | 方法                     | 作用                                                     |
    | ------------------------ | -------------------------------------------------------- |
    | boolean  offer(Object e) | 将某元素添加至队尾。若添加失败，返回false                |
    | Object  peek()           | 获取队列头部的元素，但不删除该元素。若队列为空，返回null |
    | Object  poll()           | 获取并删除队列头部的元素。若队列为空，返回null           |

Queue接口有一个Deque子接口，代表一个双端队列，双端队列可以同时从两端来添加、删除元素，故Deque的实现类既可当成队列使用，也可当成栈使用。

Queue接口有一个PriorityQueue实现类，Deque接口有ArrayDeque、LinkedList两个实现类。

## 2. PriorityQueue类

PriorityQueue保存队列元素的顺序并不是按加入队列的顺序，而是按队列元素的大小重新进行排序。

因为需要对队列元素进行排序，PriorityQueue不允许插入null元素。

PriorityQueue的元素有两种排序方式：

1. 自然排序：采用自然排序的PriorityQueue中的元素必须实现了`Comparable`接口，而且应该是同一个类的多个实例，否则可能导致ClassCastException异常；

2. 定排排序：创建PriorityQueue队列时，传入一个`Comparator`对象，该对象负责对队列中的所有元素进行排序，此时不要求队列元素实现Comparable接口。

## 3. Deque接口

Deque接口是Queue接口的子接口，代表一个双端队列，其中定义了一些允许从两端操作队列元素的方法:

- 失败时会抛出异常的：

    | 方法                     | 作用                                             |
    | ------------------------ | ------------------------------------------------ |
    | void  addFirst(Object e) | 在开头插入元素。失败时抛出异常                   |
    | void  addLast(Object e)  | 在末尾插入元素。失败时抛出异常                   |
    | Object  getFirst()       | 获取第一个元素，但不删除。若队列为空，抛出异常   |
    | Object  getLast()        | 获取最后一个元素，但不删除。若队列为空，抛出异常 |
    | Object  removeFirst()    | 获取并删除第一个元素。若队列为空，抛出异常       |
    | Object  removeLast()     | 获取并删除最后一个元素。若队列为空，抛出异常     |

- 失败时以false或null作为返回的：

    | 方法                                     | 作用                                             |
    | ---------------------------------------- | ------------------------------------------------ |
    | boolean  offerFirst(Object e)            | 在开头插入元素。失败时返回false                  |
    | boolean  offerLast(Object e)             | 在末尾插入元素。失败时返回false                  |
    | Object  peekFirst()                      | 获取第一个元素，但不删除。若队列为空，返回null   |
    | Object  peekLast()                       | 获取最后一个元素，但不删除。若队列为空，返回null |
    | Object  pollFirst()                      | 获取并删除第一个元素。若队列为空，返回null       |
    | Object  pollLast()                       | 获取并删除最后一个元素。若队列为空，返回null     |
    | boolean  removeFirstOccurrence(Object o) | 删除第一次出现的元素o。若不存在，返回false       |
    | boolean  removeLastOccurrence(Object o)  | 删除最后一次出现的元素o。若不存在，返回false     |

- 栈方法：

    | 方法                 | 作用                        |
    | -------------------- | --------------------------- |
    | Object  pop()        | 栈方法，等价于removeFirst() |
    | void  push(Object e) | 栈方法，等于价addFrist(e)   |

- 迭代器:

    | 方法                           | 作用           |
    | ------------------------------ | -------------- |
    | Iterator  descendingIterator() | 返回逆序迭代器 |

## 4. ArrayDeque类

Deque接口提供了一个典型的实现类：ArrayDeque，它是一个基于数组实现的双端队列。

创建Deque时同样可指定一个numElements参数，该参数用于指定Object[]数组的长度；若不指定，默认为16。

当然，ArrayDeque可用作“栈”来使用，也可用作队列使用。

