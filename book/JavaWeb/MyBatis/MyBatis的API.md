> 其实主要就涉及`SqlSessionFactory`类和`SqlSession`类。

## 1. `SqlSessionFactory`

`SqlSessionFactory`有多个方法创建`SqlSession`实例，常用的有如下两个：

- `openSession()`：会默认开启一个事务，但事务不会自动提交，也就意味着需要手动提交该事务，更新操作数据才会持久化到数据库中。
- `openSession(boolean autoCommit)`：参数为是否自动提交，如果设置为true，那么不需要手动提交事务

## 2. `SqlSession`

`SqlSession`类在MyBatis中是非常强大的一个类，其中含有所有执行语句、提交或回滚事务、获取映射器实例等的方法。

1. 执行语句的方法主要有：
    - `<T> T selectOne(String statement, Object parameter)`：使用查询语句时，若查询的数据唯一，使用selectOne方法返回查询数据
    - `<E> List<E> selectList(String statement, Object parameter)`：使用查询语句时，若查询的数据不唯一，使用selectList方法返回查询的数据集合
    - `int insert(String statement, Object parameter)`：插入
    - `int update(String statement, Object parameter)`：更新
    - `int delete(String statement, Object parameter)`：删除
2. 操作事务的方法主要有：
    - `void commit()`
    - `void rollback()`
3. 其他方法：
    - `close()`：关闭sqlSession

