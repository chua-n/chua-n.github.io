## 1. 服务拆分注意事项

![image-20211128174921800](../../resources/images/notebooks/JavaWeb/SpringCloud/image-20211128174921800.png)

微服务远程调用：

![image-20211128175731514](../../resources/images/notebooks/JavaWeb/SpringCloud/image-20211128175731514.png)

远程调用方式分析——根源需要在Java代码中直接发起HTTP请求：

![image-20211128175944257](../../resources/images/notebooks/JavaWeb/SpringCloud/image-20211128175944257.png)

远程调用实现：

- 基于`RestTemplate`发起的HTTP请求实现远程调用
- HTTP请求做远程调用是与语言无关的调用，只要知道对方的IP、端口、接口路径、请求参数即可。

![image-20211128180438194](../../resources/images/notebooks/JavaWeb/SpringCloud/image-20211128180438194.png)

![image-20211128180501635](../../resources/images/notebooks/JavaWeb/SpringCloud/image-20211128180501635.png)

## 2. 微服务远程调用

### 2.1 提供者与消费者

- 服务提供者：一次业务中，被其它微服务调用的服务（提供接口给其它微服务）。
- 服务消费者：一次业务中，调用其它微服务的服务（调用其他微服务提供的接口）。

> 实际上，一个服务既可以是提供者，又可以是消费者，这是一种相对的概念。

