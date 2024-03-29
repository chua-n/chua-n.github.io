---
title: Cache
---

缓存在很多场景下都是相当有用的。例如，计算或检索一个值的代价很高，并且对同样的输入需要不止一次获取值的时候，就应当考虑使用缓存。 

## 1. 适用场景

Guava Cache与ConcurrentMap很相似，但也不完全一样。最基本的区别是ConcurrentMap会一直保存所有添加的元素，直到显式地移除；相对地，Guava Cache为了限制内存占用，通常都设定为自动回收元素。

> 实际上，如果你不需要Cache中的特性，使用ConcurrentHashMap有更好的内存效率。不过Cache的大多数特性都很难基于旧有的ConcurrentMap复制，甚至根本不可能做到。

通常来说，`Guava Cache`适用于以下一些场景：

- 你愿意消耗一些内存空间来提升速度。
- 你预料到某些键会被查询一次以上。
- 缓存中存放的数据总量不会超出内存容量（Guava Cache是单个应用运行时的本地缓存，它不把数据存放到文件或外部服务器。如果这不符合你的需求，可以尝试[Memcached](http://memcached.org/)这类工具）。

Cache实例通过CacheBuilder**建造者模式**获取，如下：

```java
LoadingCache<Key, Graph> graphs = CacheBuilder.newBuilder()
        .maximumSize(1000)
        .expireAfterWrite(10, TimeUnit.MINUTES)
        .removalListener(MY_LISTENER)
        .build(
            new CacheLoader<Key, Graph>() {
                public Graph load(Key key) throws AnyException {
                    return createExpensiveGraph(key);
                }
        });
```

> 在某些场景下，尽管 LoadingCache 不回收元素，它也是很有用的，因为它会自动加载缓存。

实际上，自定义你的缓存才是Guava Cache最有趣的部分。

`Cache`是接口，`LoadingCache`是继承了Cache的接口。

## 2. 常用类介绍

在使用缓存前，首先问自己一个问题：有没有合理的默认方法来加载或计算与键关联的值？如果有的话，你应当使用CacheLoader。如果没有，或者你想要覆盖默认的加载运算，同时保留"获取缓存-如果没有-则计算"[get-if-absent-compute]的原子语义，你应该在调用get时传入一个Callable实例。缓存元素也可以通过Cache.put方法直接插入，但自动加载是首选的，因为它可以更容易地推断所有缓存内容的一致性。

### 2.1 CacheLoader抽象类

`CacheLoader`是Guava提供的抽象基类，其中只含一个抽象方法`V load(K key) throws Exception`，创建自己的`CacheLoader`时只需简单地实现该方法即可。例如，可以用下面的代码构建`LoadingCache`：

```java
LoadingCache<Key, Graph> graphs = CacheBuilder.newBuilder()
        .maximumSize(1000)
        .build(
            new CacheLoader<Key, Graph>() {
                public Graph load(Key key) throws AnyException {
                    return createExpensiveGraph(key);
                }
            }
		);

// ...
try {
    return graphs.get(key);
} catch (ExecutionException e) {
    throw new OtherException(e.getCause());
}
```

### 2.2 Cache接口

`Cache`是表示Guava缓存的一个基础接口。其他的就不说了，只提一点：`get(K, Callable)`方法。

- `get(K, Callable)`方法：所有类型的Guava Cache，不管有没有自动加载功能，都支持`get(K, Callable)`方法，该方法返回缓存中相应的值，或者用给定的Callable运算并把结果加入到缓存中。在整个加载方法完成前，缓存项相关的可观察状态都不会更改。这个方法简便地实现了“如果有缓存则返回；否则运算、缓存、然后返回”的模式。

    ```java
    Cache<Key, Graph> cache = CacheBuilder.newBuilder()
            .maximumSize(1000)
            .build(); // look Ma, no CacheLoader
    ...
    try {
        // If the key wasn't in the "easy to compute" group, we need to
        // do things the hard way.
        cache.get(key, new Callable<Key, Graph>() {
            @Override
            public Value call() throws AnyException {
                return doThingsTheHardWay(key);
            }
        });
    } catch (ExecutionException e) {
        throw new OtherException(e.getCause());
    }
    ```

- `cache.put(key, value)`方法：直接向缓存中插入值，这会直接覆盖掉给定键之前映射的值。

- `asMap()`方法：返回`ConcurrentMap<K, V>`视图。实际上利用`ConcurrentMap<K, V>`提供的方法也能修改缓存，但需要注意的是那些方法都不能保证缓存项被原子地加载到缓存中。进一步说，所以相比于`asMap().putIfAbsent(K, V)`，应该优先使用`get(K, Callable<V>)`。

### 2.3 LoadingCache接口

`LoadingCache`接口继承自`Cache`接口，通常与`CacheLoader`搭配使用。`LoadingCache`接口常用的方法如下：

- `get(Key key)`方法：查访方法，返回已经缓存的值，否则使用`CacheLoader`向缓存中（原子地）加载新值。

    > 由于`CacheLoader`可能抛出异常，get(Key key)也声明为抛出ExecutionException异常。

- `getUnchecked(Key key)`方法：如果你定义的`CacheLoader`没有声明任何检查型异常，则可以通过getUnchecked方法查找缓存。但必须注意，一旦`CacheLoader`声明了检查型异常，就不可以调用getUnchecked方法。

    ```java
    LoadingCache<Key, Graph> graphs = CacheBuilder.newBuilder()
            .expireAfterAccess(10, TimeUnit.MINUTES)
            .build(
                new CacheLoader<Key, Graph>() {
                    public Graph load(Key key) { // no checked exception
                        return createExpensiveGraph(key);
                    }
                });
    
    ...
    return graphs.getUnchecked(key);
    ```

- `getAll(Iterable<? extends K>)`方法：批量查询。默认情况下，对每个不在缓存中的键，getAll方法会单独调用CacheLoader.load来加载缓存项。如果批量的加载比多个单独加载更高效，可以重载CacheLoader.loadAll来利用这一点，getAll方法的性能也会相应提升。

    > 注：CacheLoader.loadAll的实现可以为没有明确请求的键加载缓存值。例如，为某组中的任意键计算值时，能够获取该组中的所有键值，loadAll方法就可以实现为在同一时间获取该组的其他键值。

## 3. 缓存回收机制

一个残酷的现实是，我们几乎一定没有足够的内存缓存所有数据。你必须决定：什么时候某个缓存项就不值得保留了？Guava Cache提供了三种基本的缓存回收方式：基于容量回收（size-based eviction）、定时回收（Timed Eviction）和基于引用回收（Reference-based Eviction）。

### 3.1 基于容量的回收

可以使用`CacheBuilder.maximumSize(long)`规定缓存项的数目不超过固定值，此时缓存将尝试回收最近没有使用或总体上很少使用的缓存项。需要注意的是在缓存项的数目达到限定值之前，缓存就可能进行回收操作，不过通常而言这种情况发生在缓存项的数目逼近限定值时。

另外，不同的缓存项可以有不同的权重。通过`CacheBuilder.weigher(Weigher)`可以指定一个权重函数，并且用`CacheBuilder.maximumWeight(long)`指定最大权重。在权重限定场景中，权重是在缓存创建时计算的，因此要考虑权重计算的复杂度。

```java
LoadingCache<Key, Graph> graphs = CacheBuilder.newBuilder()
        .maximumWeight(100000)
        .weigher(new Weigher<Key, Graph>() {
            public int weigh(Key k, Graph g) {
                return g.vertices().size();
            }
        })
        .build(
            new CacheLoader<Key, Graph>() {
                public Graph load(Key key) { // no checked exception
                    return createExpensiveGraph(key);
                }
            });
```

### 3.2 定时回收

`CacheBuilder`提供两种定时回收的方法：

- `expireAfterAccess(long, TimeUnit)`：缓存项在给定时间内没有被读/写访问，则回收。这种缓存的回收顺序和基于容量的回收一样。
- `expireAfterWrite(long, TimeUnit)`：缓存项在给定时间内没有被写访问（创建或覆盖），则回收。如果认为缓存数据总是在固定时间后变得陈旧不可用，可以使用这种回收方式。

对定时回收进行测试时，不一定非得花费两秒钟去测试两秒的过期：可以使用`Ticker`接口和`CacheBuilder.ticker(Ticker)`方法在缓存中自定义一个时间源，而不是非得用系统时钟。

### 3.3 基于引用的回收

通过使用弱引用的键、或弱引用的值、或软引用的值，Guava Cache可以把缓存设置为允许被垃圾回收。：

- `CacheBuilder.weakKeys()`：使用弱引用存储键。当键没有其它（强或软）引用时，缓存项可以被垃圾回收。
- `CacheBuilder.weakValues()`：使用弱引用存储值。当值没有其它（强或软）引用时，缓存项可以被垃圾回收。
- `CacheBuilder.softValues()`：使用软引用存储值。软引用只有在响应内存需要时，才按照全局最近最少使用的顺序回收。考虑到使用软引用的性能影响，通常建议使用更有性能预测性的缓存大小限定（见上文，基于容量回收）。

由于垃圾回收仅依赖恒等式（==），上述三种方式中使用缓存时用==而不是equals进行键/值的比较。

### 3.4 回收发生的时机

使用CacheBuilder构建的缓存不会"自动"执行清理和回收工作，也不会在某个缓存项过期后马上清理，也没有诸如此类的清理机制。相反，它会在写操作时顺带做少量的维护工作，或者偶尔在读操作时做——如果写操作实在太少的话。

这样做的原因在于：如果要自动地持续清理缓存，就必须有一个线程，这个线程会和用户操作竞争共享锁。此外，某些环境下线程创建可能受限制，这样CacheBuilder就不可用了。

相反，我们把选择权交到你手里。如果你的缓存是高吞吐的，那就无需担心缓存的维护和清理等工作。如果你的缓存只会偶尔有写操作，而你又不想清理工作阻碍了读操作，那么可以创建自己的维护线程，以固定的时间间隔调用`Cache.cleanUp()`，`ScheduledExecutorService`可以帮助你很好地实现这样的定时调度。

## 4. 显示清除缓存

任何时候，你都可以显式地清除缓存项，而不是等到它被回收：

- 个别清除：`Cache.invalidate(key)`
- 批量清除：`Cache.invalidateAll(keys)`
- 清除所有缓存项：`Cache.invalidateAll()`

## 5. 设置移除监听器

通过`CacheBuilder.removalListener(RemovalListener)`可以声明一个监听器，用以在缓存项被移除时做一些额外操作——缓存项被移除时，`RemovalListener`会获取移除通知`RemovalNotification`，其中包含移除原因`RemovalCause`、键和值。

> 注意，`RemovalListener`抛出的任何异常都会在记录到日志后被丢弃（swallowed）。

```java
CacheLoader<Key, DatabaseConnection> loader = new CacheLoader<Key, DatabaseConnection> () {
    public DatabaseConnection load(Key key) throws Exception {
        return openConnection(key);
    }
};

RemovalListener<Key, DatabaseConnection> removalListener = new RemovalListener<Key, DatabaseConnection>() {
    public void onRemoval(RemovalNotification<Key, DatabaseConnection> removal) {
        DatabaseConnection conn = removal.getValue();
        conn.close(); // tear down properly
    }
};

return CacheBuilder.newBuilder()
    .expireAfterWrite(2, TimeUnit.MINUTES)
    .removalListener(removalListener)
    .build(loader);
```

默认情况下，监听器方法是在移除缓存时同步调用的。因为缓存的维护和请求响应通常是同时进行的，代价高昂的监听器方法在同步模式下会拖慢正常的缓存请求，此时可以使用`RemovalListeners.asynchronous(RemovalListener, Executor)`把监听器装饰为**异步操作**。

## 6. 刷新和重载

刷新操作`LoadingCache.refresh(K)`表示为键加载新值，这个过程可以是异步的。因此刷新和回收不太一样，在刷新操作进行时，缓存仍然可以向其他线程返回旧值，而不像回收操作，读缓存的线程必须等待新值加载完成。

如果刷新过程抛出异常，缓存将保留旧值，而异常会在记录到日志后被丢弃（swallowed）。

重载操作`CacheLoader.reload(K, V)`可以扩展刷新时的行为，这个方法允许开发者在计算新值时使用旧的值。

```java
//有些键不需要刷新，并且我们希望刷新是异步完成的
LoadingCache<Key, Graph> graphs = CacheBuilder.newBuilder()
        .maximumSize(1000)
        .refreshAfterWrite(1, TimeUnit.MINUTES)
        .build(
            new CacheLoader<Key, Graph>() {
                public Graph load(Key key) { // no checked exception
                    return getGraphFromDatabase(key);
                }

                public ListenableFuture<Key, Graph> reload(final Key key, Graph prevGraph) {
                    if (neverNeedsRefresh(key)) {
                        return Futures.immediateFuture(prevGraph);
                    }else{
                        // asynchronous!
                        ListenableFutureTask<Key, Graph> task=ListenableFutureTask.create(new Callable<Key, Graph>() {
                            public Graph call() {
                                return getGraphFromDatabase(key);
                            }
                        });
                        executor.execute(task);
                        return task;
                    }
                }
            });
```

`CacheBuilder.refreshAfterWrite(long, TimeUnit)`方法可以为缓存增加自动定时刷新功能，和`expireAfterWrite`相反，`refreshAfterWrite`通过定时刷新可以让缓存项保持可用。但请注意：缓存项只有在被检索时才会真正刷新（如果`CacheLoader.refresh`实现为异步，那么检索不会被刷新拖慢）。因此，如果你在缓存上同时声明`expireAfterWrite`和`refreshAfterWrite`，缓存并不会因为刷新盲目地定时重置，如果缓存项没有被检索，那刷新就不会真的发生，缓存项在过期时间后也变得可以回收。

## 7. 其他特性

### 7.1 统计

`CacheBuilder.recordStats()`用来开启Guava Cache的统计功能。统计打开后，`Cache.stats()`方法会返回`CacheStats`对象，其中提供如下统计信息：

- `hitRate()`：缓存命中率；
- `averageLoadPenalty()`：加载新值的平均时间，单位为纳秒；
- `evictionCount()`：缓存项被回收的总数，不包括显式清除。

此外，还有其他很多统计信息。这些统计信息对于调整缓存设置是至关重要的，在性能要求高的应用中需要密切关注这些数据。

### 7.2 asMap视图

asMap视图提供了缓存的`ConcurrentMap`形式，但asMap视图与缓存的交互需要注意。

### 7.3 中断

缓存加载方法（如Cache.get）不会抛出InterruptedException。我们也可以让这些方法支持InterruptedException，但这种支持注定是不完备的，并且会增加所有使用者的成本，而只有少数使用者实际获益。

Cache.get请求到未缓存的值时会遇到两种情况：当前线程加载值；或等待另一个正在加载值的线程。这两种情况下的中断是不一样的。等待另一个正在加载值的线程属于较简单的情况：使用可中断的等待就实现了中断支持；但当前线程加载值的情况就比较复杂了：因为加载值的CacheLoader是由用户提供的，如果它是可中断的，那我们也可以实现支持中断，否则我们也无能为力。

如果用户提供的CacheLoader是可中断的，为什么不让Cache.get也支持中断？从某种意义上说，其实是支持的：如果CacheLoader抛出InterruptedException，Cache.get将立刻返回（就和其他异常情况一样）；此外，在加载缓存值的线程中，Cache.get捕捉到InterruptedException后将恢复中断，而其他线程中InterruptedException则被包装成了ExecutionException。

原则上，我们可以拆除包装，把ExecutionException变为InterruptedException，但这会让所有的LoadingCache使用者都要处理中断异常，即使他们提供的CacheLoader不是可中断的。如果你考虑到所有非加载线程的等待仍可以被中断，这种做法也许是值得的。但许多缓存只在单线程中使用，它们的用户仍然必须捕捉不可能抛出的InterruptedException异常。即使是那些跨线程共享缓存的用户，也只是有时候能中断他们的get调用，取决于那个线程先发出请求。

对于这个决定，我们的指导原则是让缓存始终表现得好像是在当前线程加载值。这个原则让使用缓存或每次都计算值可以简单地相互切换。如果老代码（加载值的代码）是不可中断的，那么新代码（使用缓存加载值的代码）多半也应该是不可中断的。

如上所述，Guava Cache在某种意义上支持中断。另一个意义上说，Guava Cache不支持中断，这使得LoadingCache成了一个有漏洞的抽象：当加载过程被中断了，就当作其他异常一样处理，这在大多数情况下是可以的；但如果多个线程在等待加载同一个缓存项，即使加载线程被中断了，它也不应该让其他线程都失败（捕获到包装在ExecutionException里的InterruptedException），正确的行为是让剩余的某个线程重试加载。为此，我们记录了一个[bug](https://code.google.com/p/guava-libraries/issues/detail?id=1122)。然而，与其冒着风险修复这个bug，我们可能会花更多的精力去实现另一个建议AsyncLoadingCache，这个实现会返回一个有正确中断行为的Future对象。

