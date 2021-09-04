## 1. 简介

YAML 是 "YAML Ain't Markup Language"（YAML 不是一种标记语言）的递归缩写。在开发的这种语言时，YAML 的意思其实是"Yet Another Markup Language"（仍是一种标记语言）。 

YAML非常适合用来做以数据为中心的配置文件。

## 2. 基本语法

`key: value`，其中：

- `key`与`value`之间有空格
- 大小写敏感
- 使用缩进表示层级关系
- 缩进不允许使用tab，只允许空格
- 缩进的空格数不重要，只要相同层级的元素左对齐即可
- `#`表示注释
- 字符串无需加引号，如果要加的话，可加单引号或双引号，它们有如下区别：
    - `''`：字符串内容会被转义
    - `""`：字符串内容不会被转义

## 3. 数据类型

### 3.1 字面值

即单个的、不可再分的值。如：date、boolean、string、number、null。

```yaml
k: v
```

### 3.2 对象

对象为键值对的集合。如map、hash、set、object。

- 行内写法：  

```yaml
k: {k1:v1,k2:v2,k3:v3}
```

- 多行写法：

    ```yaml
    k: 
        k1: v1
        k2: v2
        k3: v3
    ```

### 3.3 数组

一组按次序排列的值。array、list、queue。

- 行内写法

    ```yaml
    k: [v1,v2,v3]
    ```

- 多行写法

    ```yaml
    k:
        - v1
        - v2
        - v3
    ```

### 3.4 示例

对于Java类：

```java
@Data
public class Person {
    private String userName;
    private Boolean boss;
    private Date birth;
    private Integer age;
    private Pet pet;
    private String[] interests;
    private List<String> animal;
    private Map<String, Object> score;
    private Set<Double> salaries;
    private Map<String, List<Pet>> allPets;
}

@Data
class Pet {
    private String name;
    private Double weight;
}
```

YAML表示上述对象：

```yaml
person:
  userName: zhangsan
  boss: false
  birth: 2019/12/12 20:12:33
  age: 18
  pet:
    name: tomcat
    weight: 23.4
  interests: [ 篮球,游泳 ]
  animal:
    - jerry
    - mario
  score:
    english:
      first: 30
      second: 40
      third: 50
    math: [ 131,140,148 ]
    chinese: { first: 128,second: 136 }
  salaries: [ 3999,4999.98,5999.99 ]
  allPets:
    sick:
      - { name: tom }
      - { name: jerry,weight: 47 }
    health: [ { name: mario,weight: 47 } ]
```

## 4. 引用

使用`&`锚点和`*`别名，可以用来建立引用。

如：

```yaml
defaults: &defaults
  adapter:  postgres
  host:     localhost

development:
  database: myapp_development
  <<: *defaults

test:
  database: myapp_test
  <<: *defaults
```

相当于：

```yaml
defaults:
  adapter:  postgres
  host:     localhost

development:
  database: myapp_development
  adapter:  postgres
  host:     localhost

test:
  database: myapp_test
  adapter:  postgres
  host:     localhost
```

其中`&`用来建立锚点，`<<`表示合并到当前数据，`*`用来引用锚点。

下面是另一个例子：

```yaml
- &showell Steve 
- Clark 
- Brian 
- Oren 
- *showell 
```

转为 JavaScript 代码为：

```js
[ 'Steve', 'Clark', 'Brian', 'Oren', 'Steve' ]
```

