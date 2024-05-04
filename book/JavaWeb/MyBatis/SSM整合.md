---
title: SSM 整合
date: 2021-04-15
---

## 1. 生硬整合

在没有新技术的加入之前，整合 SSM（主要是 Spring 与 MyBatis）只能靠生硬的进行，如这里的工程：

- 工程目录

    ![50](https://figure-bed.chua-n.com/JavaWeb/MyBatis/50.png)

- 这里的主要特点是 Service 层的编写，Service 业务方法中含有重复性代码，即使将其封装为一个 MyBtatisUtils 也非佳作：

    ```java
    package com.chuan.ssm.service.impl;
    
    import com.chuan.ssm.domain.Account;
    import com.chuan.ssm.mapper.AccountMapper;
    import com.chuan.ssm.service.AccountService;
    import org.apache.ibatis.io.Resources;
    import org.apache.ibatis.session.SqlSession;
    import org.apache.ibatis.session.SqlSessionFactory;
    import org.apache.ibatis.session.SqlSessionFactoryBuilder;
    import org.springframework.stereotype.Service;
    import java.io.IOException;
    import java.io.InputStream;
    import java.util.List;
    
    /**
     * @author chuan
     * @date 2021/4/15 19:37
     */
    @Service("accountService")
    public class AccountServiceImpl implements AccountService {
        
        @Override
        public void save(Account account) {
            try {
                InputStream resourceAsStream = Resources.getResourceAsStream("sqlMapConfig.xml");
                SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(resourceAsStream);
                SqlSession sqlSession = sqlSessionFactory.openSession();
                AccountMapper mapper = sqlSession.getMapper(AccountMapper.class);
                mapper.save(account);
                sqlSession.commit();
                sqlSession.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        
        @Override
        public List<Account> findAll() {
            try {
                InputStream resourceAsStream = Resources.getResourceAsStream("sqlMapConfig.xml");
                SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(resourceAsStream);
                SqlSession sqlSession = sqlSessionFactory.openSession();
                AccountMapper mapper = sqlSession.getMapper(AccountMapper.class);
                List<Account> accountList = mapper.findAll();
                sqlSession.close();
                return accountList;
            } catch (IOException e) {
                e.printStackTrace();
            }
            return null;
        }
    }
    ```

- applicationContext.xml

    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <beans xmlns="http://www.springframework.org/schema/beans"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:context="http://www.springframework.org/schema/context" 
        xsi:schemaLocation="
           http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd
    ">
        <!--组件扫描：service 和 mapper-->
        <context:component-scan base-package="com.chuan.ssm">
            <!--排除 controller 的扫描-->
            <context:exclude-filter type="annotation" expression="org.springframework.stereotype.Controller"/>
        </context:component-scan>
    </beans>
    ```

- sqlMapConfig.xml

    ```xml
    <?xml version="1.0" encoding="UTF-8" ?>
    <!DOCTYPE configuration PUBLIC "-//mybatis.org/DTD Config 3.0//EN" "http://mybatis.org/dtd/mybatis-3-config.dtd">
    <configuration>
        <!--加载 properties 文件-->
        <properties resource="jdbc.properties"/>
        <!--定义别名-->
        <typeAliases>
            <!--方法 1：逐个编写别名-->
            <typeAlias type="com.chuan.ssm.domain.Account" alias="account"/>
            <!--方法 2：包扫描定义别名，该包中每个类的别名被定义为首字母小写后的类名-->
            <!--<package name="com.chuan.ssm.domain"/>-->
        </typeAliases>
        <!--环境-->
        <environments default="development">
            <environment id="development">
                <transactionManager type="JDBC"/>
                <dataSource type="POOLED">
                    <property name="driver" value="${jdbc.driver}"/>
                    <property name="url" value="${jdbc.url}"/>
                    <property name="username" value="${jdbc.username}"/>
                    <property name="password" value="${jdbc.password}"/>
                </dataSource>
            </environment>
        </environments>
        <!--加载映射-->
        <mappers>
            <!--方法 1：逐个添加映射文件-->
            <!--<mapper resource="com/chuan/mapper/AccountMapper.xml"/>-->
            <!--方法 2：包扫描-->
            <package name="com.chuan.ssm.mapper"/>
        </mappers>
    </configuration>
    ```

## 2. 实际整合

Spring 整合 MyBatis 的思路：

![51](https://figure-bed.chua-n.com/JavaWeb/MyBatis/51.png)

将 SqlSessionFactory 配置到 Spring 容器中：

```xml
<!-- 加载 jdbc.properties -->
<context:property-placeholder location="classpath:jdbc.properties" />
<!-- 配置数据源 -->
<bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">
	<property name="driverClass" value="${jdbc.driver}" />
	<property name="jdbcUrl" value="${jdbc.url}" />
	<property name="user" value="${jdbc.username}" />
	<property name="password" value="${jdbc.password}" />
</bean>
<!-- 配置 MyBatis 的 SqlSessionFactory -->
<bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
	<property name="dataSource" ref="dataSource" />
	<property name="configLocation" value="classpath:sqlMapConfig.xml" />
</bean>
```

具体地，相对上节生硬整合的代码改动如下（减少了 mybatis 核心配置文件的配置、增加了 spring 的配置、优化了业务层代码）：

- sqlMapConfig.xml

    ```xml
    <?xml version="1.0" encoding="UTF-8" ?>
    <!DOCTYPE configuration PUBLIC "-//mybatis.org/DTD Config 3.0//EN" "http://mybatis.org/dtd/mybatis-3-config.dtd">
    <configuration>
        <!--定义别名-->
        <typeAliases>
            <!--方法 1：逐个编写别名-->
            <typeAlias type="com.chuan.ssm.domain.Account" alias="account"/>
            <!--方法 2：包扫描定义别名，该包中每个类的别名被定义为首字母小写后的类名-->
            <!--<package name="com.chuan.ssm.domain"/>-->
        </typeAliases>
    </configuration>
    ```

- applicationContext.xml

    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <beans xmlns="http://www.springframework.org/schema/beans"
           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xmlns:aop="http://www.springframework.org/schema/aop"
           xmlns:tx="http://www.springframework.org/schema/tx"
           xmlns:context="http://www.springframework.org/schema/context"
           xsi:schemaLocation="
           http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
           http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop.xsd
           http://www.springframework.org/schema/tx http://www.springframework.org/schema/tx/spring-tx.xsd
           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd
    ">
        <!--组件扫描：service 和 mapper-->
        <context:component-scan base-package="com.chuan.ssm">
            <!--排除 controller 的扫描-->
            <context:exclude-filter type="annotation" expression="org.springframework.stereotype.Controller"/>
        </context:component-scan>
        <!--加载 properties 文件-->
        <context:property-placeholder location="classpath:jdbc.properties"/>
        <!--配置数据源-->
        <bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">
            <property name="driverClass" value="${jdbc.driver}"/>
            <property name="jdbcUrl" value="${jdbc.url}"/>
            <property name="user" value="${jdbc.username}"/>
            <property name="password" value="${jdbc.password}"/>
        </bean>
    
        <!--配置 SqlSessionFactory-->
        <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
            <property name="dataSource" ref="dataSource"/>
            <!--加载 mybatis 核心文件-->
            <property name="configLocation" value="classpath:sqlMapConfig-spring.xml"/>
        </bean>
        <!--扫描 mapper.xml 所在的包：为 mapper 创建实现类-->
        <bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
            <property name="basePackage" value="com.chuan.ssm.mapper"/>
        </bean>
    
        <!--配置声明式事务控制-->
        <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
            <property name="dataSource" ref="dataSource"/>
        </bean>
        <!--配置事务增强-->
        <tx:advice id="txAdvice">
            <tx:attributes>
                <tx:method name="*"/>
            </tx:attributes>
        </tx:advice>
        <!--事务的 aop 织入-->
        <aop:config>
            <aop:advisor advice-ref="txAdvice"  pointcut="execution(* com.chuan.ssm.service.impl.*.*(..))"/>
        </aop:config>
    </beans>
    ```

- AccountServiceImpl.java

    ```java
    package com.chuan.ssm.service.impl;
    
    import com.chuan.ssm.domain.Account;
    import com.chuan.ssm.mapper.AccountMapper;
    import com.chuan.ssm.service.AccountService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.stereotype.Service;
    import java.util.List;
    
    /**
     * @author chuan
     * @date 2021/4/15 19:37
     */
    @Service("accountService")
    public class AccountServiceImpl implements AccountService {
        @Autowired
        private AccountMapper accountMapper;
    
        @Override
        public void save(Account account) {
            accountMapper.save(account);
        }
    
        @Override
        public List<Account> findAll() {
            return accountMapper.findAll();
        }
    }
    ```
