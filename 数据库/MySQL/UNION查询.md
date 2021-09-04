MySQL允许执行多个查询，即多条SELECT语句，并将结果作为单个查询结果集返回。这些**组合查询**通常称为**并(union)**或**复合查询**(compound query)。

有两种基本情况，其中需要使用组合查询：

1. 在单个查询中从不同的表返回类似结构的数据；

2. 对单个表执行多个查询，按单个查询返回数据。

其实，多数情况下，组合相同表的两个查询完成的工作与具有多个WHERE子句条件的单条查询完成的工作相同，UNION通常只意味着另一种书写方式，可能这种书写会显得简洁。

## UNION

UNION的使用：给出每条SELECT语句，在各条语句之间放上关键字UNION即可：

```sql
SELECT vend_id, prod_id, prod_price
FROM products
WHERE prod_price <= 5
UNION
SELECT vend_id, prod_id, prod_price
FROM products
WHERE vend_id IN (1001, 1002);
```

UNION使用有几条**规则**：

1. UNION必须由两条或以上的SELECT语句组成，语句之间用UNION分隔

2. UNION中的每个查询必须包含相同的列、表达式或聚集函数，各个列不需要以相同的次序列出

3. 列数据类型必须兼容：类型不必完全相同，但必须是DBMS可以隐含转换的类型，如不同的数值类型或不同的日期类型

## UNION ALL

UNION默认从查询结果集中自动去除了重复的行；如果想返回所有匹配行，使用UNION ALL。

```sql
SELECT vend_id, prod_id, prod_price
FROM products
WHERE prod_price <= 5
UNION ALL
SELECT vend_id, prod_id, prod_price
FROM products
WHERE vend_id IN (1001, 1002);
```

![img](https://chua-n.gitee.io/blog-images/notebooks/数据库/5.png)

## UNION与ORDER BY子句

在使用UNION组合查询时，**只能使用一条ORDER BY子句**，它必须出现在最后一条SELECT语句之后。这实际上很好理解，因为UNION查询的结果是按照类似单个查询的结果给出的，即结果是一个整体，所以它的排序只能有一个。

```sql
SELECT vend_id, prod_id, prod_price
FROM products
WHERE prod_price <= 5
UNION
SELECT vend_id, prod_id, prod_price
FROM products
WHERE vend_id IN (1001, 1002)
ORDER BY vend_id, prod_price;
```

![vend id  1001 |  1001 |  1001 |  1002 |  1002 |  1003 |  1003 |  1003 |  prod_id I  ANVOI  ANV02  ANV03  FUI  OLI  TNTI  FC  SLING  prod_pri ce  5.99 |  9.99  14 . 99  3.42  8.99  2.50  2.50  4.49 ](https://chua-n.gitee.io/blog-images/notebooks/数据库/6.png)

