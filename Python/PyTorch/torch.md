PyTorch 是一个基于 python 的科学计算包，主要作用在两个方面：

1. 作为 NumPy 的替代品，可以利用 GPU 的性能进行计算；
2. 作为一个高灵活性、速度快的深度学习平台。

| GPU 计算相关方法                                              | 说明                    |
| ------------------------------------------------------------- | ----------------------- |
| device = torch.device('cuda')                                 | 创建 device 对象        |
| torch.cuda.is_available()                                     | 查看是否有 GPU          |
| torch.cuda.device_count()                                     | 可用 GPU 数量           |
| torch.cuda.current_device()                                   | 查看当前使用的 GPU 序号 |
| torch.cuda.get_device_capability(device)                      | 查看指定 GPU 的容量     |
| torch.cuda.get_device_name(device)                            | 查看指定 GPU 的名称     |
| torch.cuda.empty_cache()                                      | 清空程序占用的 GPU 资源 |
| torch.cuda.manual_seed(seed) torch.cuda.manual_seed_all(seed) | 为 GPU 设置随机种子     |

PyTorch 中所有神经网络的核心都是 `torch.autograd` 包，autograd 包为张量上的所有操作都提供了自动求导机制，它是一个在运行时定义(define-by-run)的框架，这意味着反向传播是根据代码如何运行来决定的，并且每次迭代可以是不同的。

在底层，每一个原始的自动求导运算实际上是两个在 `tensor` 上运行的函数，其中 `forward` 函数计算从输入 `tensors` 获得的输出 `tensors`，而 `backward` 函数接收输出 `tensors` 对于某个标量值的梯度，并且计算输入 `tensors` 相对于该相同标量值的梯度。

使用 `with torch.no_grad()` 封装代码块，可以阻止自动梯度 autograd 跟踪设置为 `.requires_grad=True` 的张量的历史记录，这在评估模型时非常有用，因为模型可能具有 `.requires_grad=True` 的可训练的参数，但是我们不需要在此过程中对他们进行梯度计算：

```python
print(x.requires_grad) # True
print((x ** 2).requires_grad) # True
with torch.no_grad():
    print((x ** 2).requires_grad) # False
```

在 pytorch 中，我们也可以很容易地通过定义 `torch.autorgrad.Function` 的子类来实现 `forward` 和 `backward` 函数，从而定义自己的自动求导运算。然后还可以通过构造实例并像调用函数那样使用它，并传入包含输入数据的张量：

```python
class MyReLU(torch.autograd.Function):
    """
    We can implement our own custom autograd Functions by subclassing
    torch.autograd.Function and implementing the forward and backward passes
    which operate on Tensors.
    """
    @staticmethod
    def forward(ctx, input):
        """
        In the forward pass we receive a Tensor containing the input and return
        a Tensor containing the output. ctx is a context object that can be used
        to stash information for backward computation. You can cache arbitrary
        objects for use in the backward pass using the ctx.save_for_backward method.
        """
        ctx.save_for_backward(input)
        return input.clamp(min=0)
    @staticmethod
    def backward(ctx, grad_output):
        """
        In the backward pass we receive a Tensor containing the gradient of the loss
        with respect to the output, and we need to compute the gradient of the loss
        with respect to the input.
        """
        input, = ctx.saved_tensors
        grad_input = grad_output.clone()
        grad_input[input < 0] = 0
        return grad_input

learning_rate = 1e-6
for t in range(500):
    # To apply our Function, we use Function.apply method. We alias this as 'relu'.
    relu = MyReLU.apply
# Forward pass: compute predicted y using operations; we compute
    # ReLU using our custom autograd operation.
    y_pred = relu(x.mm(w1)).mm(w2)
# Compute and print loss
    loss = (y_pred - y).pow(2).sum()
    if t % 100 == 99:
        print(t, loss.item())
# Use autograd to compute the backward pass.
    loss.backward()
# Update weights using gradient descent
    with torch.no_grad():
        w1 -= learning_rate * w1.grad
        w2 -= learning_rate * w2.grad
# Manually zero the gradients after updating weights
        w1.grad.zero_()
        w2.grad.zero_()
```

PyTorch 中尾缀为`_`的操作表示其是原位（in-place）执行的：

```python
import math

weights = torch.randn(784, 10) / math.sqrt(784)
weights.requires_grad_()
bias = torch.zeros(10, requires_grad=True)
```

