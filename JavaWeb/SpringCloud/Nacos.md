## 1. Nacos注册中心

Nacos是阿里巴巴的产品，现在是SpringCloud中的一个组件，相比Eureka功能更加丰富，在国内受欢迎程度较高。

### Nacos的安装

安装个这竟然还比较特殊......

## 2. 服务注册

![image-20211128211348606](../../resources/images/notebooks/JavaWeb/SpringCloud/image-20211128211348606.png)

![image-20211128211407488](../../resources/images/notebooks/JavaWeb/SpringCloud/image-20211128211407488.png)

## 3. Nacos服务分级存储模型

- 一级是服务，例如userservice
- 二级是集群，例如杭州、上海
- 三级是实例，例如杭州机房的某台部署了userservice的服务器

![image-20211128212006476](../../resources/images/notebooks/JavaWeb/SpringCloud/image-20211128212006476.png)

![image-20211128212122650](../../resources/images/notebooks/JavaWeb/SpringCloud/image-20211128212122650.png)

设置实例的集群属性：

- 修改application.yml文件，添加`spring.cloud.nacos.discovery.cluster-name`属性即可。

![image-20211128212328655](../../resources/images/notebooks/JavaWeb/SpringCloud/image-20211128212328655.png)

## 4. Nacos负载均衡

