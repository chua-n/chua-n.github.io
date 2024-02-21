---
title: Tensor
---

`torch.Tensor` 是定义了张量和相关数学操作的 torch 中的一个类。

`torch.Tensor` 是一个张量，非常类似于 NumPy 的 `ndarray`，但 `Tensor` 可以在 GPU 上使用来加速计算。CPU 上的所有张量(CharTensor 除外)都支持与 Numpy 的相互转换。

## 创建Tensor

创建 tensor 的主要方式：

1. To create a tensor with pre-existing data, use [torch.tensor()](https://pytorch.org/docs/stable/torch.html#torch.tensor).

2. To create a tensor with specific size, use torch.\* tensor creation ops (see [Creation Ops](https://pytorch.org/docs/stable/torch.html#tensor-creation-ops)).

3. To create a tensor with the same size (and similar types) as another tensor, use torch.\*\_like tensor creation ops (see [Creation Ops](https://pytorch.org/docs/stable/torch.html#tensor-creation-ops)).

4. To create a tensor with similar type but different size as another tensor, use tensor.new\_\* creation ops.

## Tensor的属性

除了类似 numpy.ndarray 的属性，torch.Tensor 还有如下的特殊属性：

| 属性                 | 说明                                                                                                 |
| -------------------- | ---------------------------------------------------------------------------------------------------- |
| 参考 ndarray 的属性  | 没啥好说的                                                                                           |
| .device              | 这个 tensor 所在的设备，'cpu', 'cuda'等                                                              |
| .layout              | 这个 tensor 在内存中的布局形式，有 torch.strided（稠密张量）和 torch.sparse_coo（稀疏 COO 张量）两种 |
| .requires_grad=False | 为 True 时将会追踪对于该张量的所有操作。 （完成计算后可通过调用.backward()来自动计算所有梯度）       |
| .grad                | 该张量的所有梯度都会自动累加到.grad 属性上                                                           |
| .grad_fn             | 该属性引用了创建 tensor 自身的 Function；若这个张量是用户手动创建的，则.grad_fn=None                 |

## Tensor的数据类型

torch.Tensor 的数值类型对应关系：

| Data type                | dtype                         | CPU tensor         | GPU tensor              |
| ------------------------ | ----------------------------- | ------------------ | ----------------------- |
| 32-bit floating point    | torch.float32 or torch.float  | torch.FloatTensor  | torch.cuda.FloatTensor  |
| 64-bit floating point    | torch.float64 or torch.double | torch.DoubleTensor | torch.cuda.DoubleTensor |
| 16-bit floating point    | torch.float16 or torch.half   | torch.HalfTensor   | torch.cuda.HalfTensor   |
| 8-bit integer (unsigned) | torch.uint8                   | torch.ByteTensor   | torch.cuda.ByteTensor   |
| 8-bit integer (signed)   | torch.int8                    | torch.CharTensor   | torch.cuda.CharTensor   |
| 16-bit integer (signed)  | torch.int16 or torch.short    | torch.ShortTensor  | torch.cuda.ShortTensor  |
| 32-bit integer (signed)  | torch.int32 or torch.int      | torch.IntTensor    | torch.cuda.IntTensor    |
| 64-bit integer (signed)  | torch.int64 or torch.long     | torch.LongTensor   | torch.cuda.LongTensor   |
| Boolean                  | torch.bool                    | torch.BoolTensor   | torch.cuda.BoolTensor   |

torch.Tensor 是 torch.FloatTensor 的别名。

## 操作Tensor的函数

几乎所有 NumPy 的 ndarray 的用法都可以直接用在 torch.Tensor 上。

如下为一些关于 tensor 的函数：

-   `torch.empty(5, 3)`：创建一个没有初始化的 5\*3 的矩阵

    ```python
    tensor([[2.2391e-19, 4.5869e-41, 1.4191e-17],
            [4.5869e-41, 0.0000e+00, 0.0000e+00],
            [0.0000e+00, 0.0000e+00, 0.0000e+00],
            [0.0000e+00, 0.0000e+00, 0.0000e+00],
            [0.0000e+00, 0.0000e+00, 0.0000e+00]])
    ```

-   `torch.rand(5, 3)`：创建一个随机初始化的 5\*3 矩阵

    ```python
    tensor([[0.5307, 0.9752, 0.5376],
            [0.2789, 0.7219, 0.1254],
            [0.6700, 0.6100, 0.3484],
            [0.0922, 0.0779, 0.2446],
            [0.2967, 0.9481, 0.1311]])
    ```

-   `torch.zeros(5, 3, dtype=torch.long)`：构造一个填满 0 且数据类型为 `long` 的矩阵

    ```python
    tensor([[0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]])
    ```

-   `torch.tensor([5.5, 3])`：直接从数据构造张量，总是返回副本

    ```python
    tensor([5.5000, 3.0000])
    ```

-   `torch.from_numpy(a)`：将 `ndarray` 转换为 `Tensor`，返回视图，即两者共享一块内存

    ```python
    a = np.ones(5)
    b = torch.from_numpy(a)
    np.add(a, 1, out=a)
    ```

    ```python
    a = [2. 2. 2. 2. 2.]
    b = tensor([2., 2., 2., 2., 2.], dtype=torch.float64)
    ```

-   `torch.is_tensor(obj)`：判断一个对象 obj 是否是 pytorch 张量

-   `torch.clamp(input, min, max, out=None)`：将 input 中的所有数值限定在[min, max]之内

    > 也即 input 中小于 min 的数置换为 min，大于 max 的数置换为 max，其他不变。min, max 参数可省略一个表示单边操作

## Tensor对象的方法

这里是 Tensor 的一些方法：

-   `.numpy()`：将 torch.Tensor 转换为 numpy.ndarray（这个 Tensor 要求`requires_grad=False`）

    ```python
    a = torch.ones(5)
    # tensor([1., 1., 1., 1., 1.])
    b = a.numpy()
    # [1. 1. 1. 1. 1.]
    ```

-   `.detach().numpy()`：将 torch.Tensor 转换为 numpy.ndarray（这个 Tensor 要求`requires_grad=True`）

    ```python
    >>> x = torch.ones(2, 2, requires_grad=True)
    >>> x.detach().numpy()
    array([[1., 1.],
           [1., 1.]], dtype=float32)
    ```

-   `.detach()`：将一个张量与其计算历史分离，并阻止它未来的计算记录被跟踪

-   `.backward()`：计算导数

-   `.to(device=None, dtype=None)`：

    -   将张量移动到任何设备上，如 CUDA
    -   将张量转换为其他数值类型
    -   如果转换前后的 device 和 dtype 没有变化，则返回视图；否则，返回副本。

    ```python
    if torch.cuda.is_available():
        device = torch.device("cuda")
        # a CUDA device object
        y = torch.ones_like(x, device=device)
        # 直接在GPU上创建tensor
        x = x.to(device)
        # 或者使用`.to("cuda")`方法
        z = x + y
        print(z)
        print(z.to("cpu", torch.double))
        # `.to`也能在移动时改变dtype
    # 输出：
    tensor([1.0445], device='cuda:0')
    tensor([1.0445], dtype=torch.float64)
    ```

-   `.view()`：改变张量形状（torch.tensor 版的 ndarray.reshape)

    > 下边的-1 表示这个维度值根据原形状由其他维度来推测。

    ```python
    x = torch.randn(4, 4)
    y = x.view(16)
    z = x.view(-1, 8)
    print(x.size(), y.size(), z.size())
    # torch.Size([4, 4]) torch.Size([16]) torch.Size([2, 8])
    ```

-   `.item()`：仅包含一个元素的 tensor 由此得到对应的 python 数值

    ```python
    x = torch.randn(1)
    print(x)
    print(x.item())
    
    # tensor([0.0445])
    # 0.0445479191839695
    ```

## 设置随机数种子

Pytorch 设置全局随机数种子使得结果可完全复现，详看[官方](https://pytorch.org/docs/stable/notes/randomness.html)：

1. Pytorch 方面：

    ```python
    seed = 0
    ```

    - `torch.manual_seed(seed)`：为所有设备设置随机种子（含 CPU 和 GPU）
    - `torch.cuda.manual_seed(seed)`：为当前 GPU 设置随机种子
    - `torch.cuda.manual_seed_all(seed)`：为所有 GPU 设置随机种子

2. 有些 pytorch 函数使用了 CUDA 函数，其中的 atmonic 操作是一个不确定性来源；另一方面，cuDNN 中对 pooling, padding, sampling 等操作进行了优化，牺牲了精度来换取计算效率，如需要保证可重复性可使用如下设置：

    > 不过这实际上这样设置对精度影响不大，仅是小数点后几位的差别，若不是对精度要求极高，其实不太建议修改，因为会使计算效率降低，降低的方面据官方说是降低了每秒被处理的批处理项。

    ```python
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False
    # if benchmark=True, deterministic will be False
    ```

3. 有时需要考虑前处理等过程用其他库造成的随机数影响：

    ```python
    import os
    import random
    import numpy as np
    seed = 0

    random.seed(seed)
    np.random.seed(seed)
    os.environ['PYTHONHASHSEED'] = str(seed)
    ```

4. 对于 dataloader 的多线程(num_workers > 1)，由于读取数据的顺序不同，最终运行结果也会有差异（这个以后再了解）：

    ```python
    GLOBAL_SEED = 1
    
    def set_seed(seed):
        random.seed(seed)
        np.random.seed(seed)
        torch.manual_seed(seed)
        torch.cuda.manual_seed(seed)
        torch.cuda.manual_seed_all(seed)
    
    GLOBAL_WORKER_ID = None
    def worker_init_fn(worker_id):
        global GLOBAL_WORKER_ID
        GLOBAL_WORKER_ID = worker_id
        set_seed(GLOBAL_SEED + worker_id)
    
    dataloader = DataLoader(dataset, batch_size=16, shuffle=True, num_workers=2, worker_init_fn=worker_init_fn)
    ```

## 封装数据

> `torch.untils.data`

### DataSet

PyTorch 包含一个`TensorDataset`抽象类，`TensorDataset`是一个封装了`tensor`的`Dataset`，可以是任何东西，但它始终包含一个`__len__`函数（通过Python的标准函数`len`调用）和一个用来索引到内容中的`__getitem__`函数。

`TensorDataset`使得我们可以对张量的第一维进行迭代、索引和切片，这意味着我们在训练中获取同一行中的自变量和因变量会更加容易：

```python
from torch.utils.data import TensorDataset
# x_train, y_train分别是训练集的输入和标签
train_ds = TensorDataset(x_train, y_train)
```

- 没有`TensorDataset`的情况下须如此索引数据：

    ```python
    xb = x_train[start_i:end_i]
    yb = y_train[start_i:end_i]
    ```

- 有了`TensorDataset`之后可以更简洁地索引：

    ```python
    xb, yb = train_ds[start_i:end_i]
    ```

### DataLoader

PyTorch 的`DataLoader`负责批量数据管理，可以使用任意的`TensorDataset`创建一个`DataLoader`，它使得对批量数据的迭代更容易。

`DataLoader`自动为我们提供每一小批量的数据来代替切片的方式：

```python
from torch.utils.data import DataLoader

# x_train, y_train分别是训练集的输入和标签
train_ds = TensorDataset(x_train, y_train)
train_dl = DataLoader(train_ds, batch_size=bs)
```

- 没有`DataLoader`的情况下须如此索引数据：

    ```python
    # n是训练集的数据总量，bs是批量的大小  
    for i in range((n-1)//bs + 1):
        xb,yb = train_ds[i*bs : i*bs+bs]
        pred = model(xb)
    ```

- 有了`DataLoader`之后可以更简洁地索引：

    ```python
    for xb,yb in train_dl:
        pred = model(xb)
    ```

