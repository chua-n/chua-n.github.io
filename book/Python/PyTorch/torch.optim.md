---
title: torch.optim
date: 2019-10-15
---

## Optimizer

`torch.optim`是一个实现了各种优化算法的包，最常用的方法如SGD、Nesterov-SGD、Adam、RMSProp都已在其中实现，而且这些接口非常通用，你可以很容易地利用这些接口实现你自己的更复杂的优化算法。

为了使用torch.optim你必须首先创建一个优化器(optimizer)对象，torch.optim中所有的优化器类都派生自`torch.optim.Optimizer`这个基类。

torch.optim中所有的优化器类都派生自`torch.optim.Optimizer`这个基类，其含有如下方法：

- `.add_param_group(param_group)`：添加一个参数组合到优化器的param_groups中
- `.load_state_dict(state_dict)`：加载优化器的状态参数
- `.state_dict()`：将优化器的状态以一个字典的形式返回，其含两个条目：
    - `state`: 一个保存优化器当前状态的字典，其具体内容随优化器的类型不同而不同；
    - `param_groups`: 一个包含所有参数组合的字典
- `.step([,closure])`：执行一次优化步骤，即参数更新
- `.zero_grad()`：清零所有待优化张量的梯度

## 创建优化器

创建优化器的过程如下所示——必须传给优化器一个可迭代的参数，而且必须是tensor；然后设定其他参数，如学习率、权重衰减参数等。

- `optimizer = optim.SGD(model.parameters(), lr=0.01, momentum*0.9)`
- `optimizer = optim.Adam([var1, var2], lr=0.0001)`

优化器也支持传入一组组单独的优化参数，只须将其作为一系列字典类型组成的可迭代对象作为参数传入。

- 每一个字典相当于一组独立的优化参数，且每个字典都应包含一个名为`'params'`的key，其映射到一个属于它的参数列表；
- 其他key应与优化器接受的关键字参数相匹配，如学习率等，这将用作本字典组的优化选项。
- 此时你创建的这个优化器依旧可以传入整体的学习率、权重误差等参数，但如果你的某组优化参数字典已经设置了它们，外部的参数会被内部的覆盖。

```python
optim.SGD([
                {'params': model.base.parameters()},
                {'params': model.classifier.parameters(), 'lr': 1e-3}
            ], lr=1e-2, momentum=0.9)
```

> 以上表明`model.base`的超参数将会使用默认参数(`lr=1e-2, momentum=0.9`)；`model.classifier`的超参数会使用1e-3的学习率，而`momentum`依然为0.9。

## 使用GPU计算

注意，如果你需要通过`.cuda()`方法将模型移动到GPU，一定要先移动、后构造优化器，因为`.cuda()`之后的模型参数和之前的是完全不同的对象。在构造和使用优化器时，通常应该确保优化参数处在一致的位置。

## step()方法

所有优化器都包含一个`.step()`方法来更新你的优化参数，`.step()`方法有两种用法：

- `optimizer.step()`：一旦有梯度的计算，如`backward()`，即可这样调用。

    ```python
    for input, target in dataset:
        optimizer.zero_grad()
        output = model(input)
        loss = loss_fn(output, target)
        loss.backward()
        optimizer.step()
    ```

- `optimizer.step(closure)`：有些优化算法如共轭梯度法, LBFGS等需要多次“重评估”，因此必须传递一个闭包来允许它们重新计算你的模型，这个闭包清空梯度、计算loss然后返回loss。

    ```python
    for input, target in dataset:
        def closure():
            optimizer.zero_grad()
            output = model(input)
            loss = loss_fn(output, target)
            loss.backward()
            return loss
        optimizer.step(closure)
    ```

优化器的`.step()`方法本质上是用来替换如下的参数手动更新：

```python
with torch.no_grad():
    for p in model.parameters():
        p -= p.grad * lr
    model.zero_grad()
# opt.step()
# opt.zero_grad()
# .zero_grad()将梯度重置为0
```
