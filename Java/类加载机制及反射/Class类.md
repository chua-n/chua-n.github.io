**Class 类**提供了大量的**实例方法**来获取该 Class 对象所对应类的详细信息，其大致包含如下方法，其中每个方法都可能包含多个重载的版本，具体应该查阅 API 文档来进行掌握。

对于只能在源代码上保留的注解，使用运行时获得的 Class 对象无法访问到该注解对象。

## 获取 Class 对应类所包含的构造器

| 方法                                                            | 作用                                                                      |
| --------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Constructor<T> getConstructor(Class<?>… parameterTypes)         | 返回此 Class 对象对应类的、带指定形参列表的 public 构造器                 |
| Constructor<?>[] getConstructors()                              | 返回此 Class 对象对应类的所有 public 构造器                               |
| Constructor<T> getDeclaredConstructor(Class<?>… parameterTypes) | 返回此 Class 对象对应类的、带指定形参列表的构造器，与构造器的访问权限无关 |
| Constructor<?>[] getDeclaredConstructors()                      | 返回此 Class 对象对应类的所有构造器，与构造器的访问权限无关               |

## 获取 Class 对应类所包含的方法

| 方法                                                            | 作用 |
| --------------------------------------------------------------- | ---- |
| Method getMethod(String name, Class<?>… parameterTypes)         |      |
| Method[] getMethods()                                           |      |
| Method getDeclaredMethod(String name, Class<?>… parameterTypes) |      |
| Method[] getDeclaredMethods()                                   |      |

## 访问 Class 对应类所包含的成员变量

| 方法                                | 作用 |
| ----------------------------------- | ---- |
| Field getField(String name)         |      |
| Field[] getFields()                 |      |
| Field getDeclaredField(String name) |      |
| Field[] getDeclaredFields()         |      |

## 访问 Class 对应类上所包含的 Annotation

| 方法                                                                               | 作用 |
| ---------------------------------------------------------------------------------- | ---- |
| <A  extends Annotation> A getAnnotation(Class<A> annotationClass)                  |      |
| <A  extends Annotation> A getDeclaredAnnotation(Class<A> annotationClass)          |      |
| Annotation[] getAnnotations()                                                      |      |
| Annotation[] getDeclaredAnnotations()                                              |      |
| <A  extends Annotation> A[] getAnnotationsByType(Class<A> annotationClass)         |      |
| <A  extends Annotation> A[] getDeclaredAnnotationsByType(Class<A> annotationClass) |      |

## 访问该 Class 对应类包含的内部类

| 方法                            | 作用 |
| ------------------------------- | ---- |
| Class<?>[] getDeclaredClasses() |      |

## 访问该 Class 对应类所在的外部类

| 方法                         | 作用 |
| ---------------------------- | ---- |
| Class<?> getDeclaringClass() |      |

## 访问该 Class 对应类所实现的接口

| 方法                       | 作用 |
| -------------------------- | ---- |
| Class<?>[] getInterfaces() |      |

## 访问该 Class 对应类所继承的父类

| 方法                             | 作用 |
| -------------------------------- | ---- |
| Class<? super T> getSuperClass() |      |

## 获取该 Class 对应类的修饰符、所在包、类包等基本信息

| 方法                   | 作用 |
| ---------------------- | ---- |
| int getModifiers()     |      |
| Package getPackage()   |      |
| String getName()       |      |
| String getSimpleName() |      |

## 判断该类是否为接口、枚举、注解类型、数组类等

| 方法                   | 作用                             |
| ---------------------- | -------------------------------- |
| boolean isAnnotation() |                                  |
| boolean ……             | 以后再说吧，这么记似乎没有意义…… |

