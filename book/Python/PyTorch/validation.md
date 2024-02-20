---
title: validation
---

> 增加验证集。

打乱训练数据的顺序通常是避免不同批数据的相关性和模型过拟合的重要步骤。然而，对于验证集，无论是否打乱其顺序计算出的验证集损失都是一样的，且打乱顺序还会消耗额外的时间，我们没有必要shuffle the validation data.

由于验证集不需要进行反向传播，因而它不需要储存梯度而将占用较小的内存，故我们可以将在验证集上用到的每批数据的数量是训练集的两倍。

```python
train_ds = TensorDataset(x_train, y_train)
train_dl = DataLoader(train_ds, batch_size=bs, shuffle=True)

valid_ds = TensorDataset(x_valid, y_valid)
valid_dl = DataLoader(valid_ds, batch_size=bs * 2)
```

我们将在每轮（epoch）结束后计算并输出验证集上的损失值：

> 注意：在训练前我们总是会调用`model.train()`函数，在推断前调用`model.eval()`函数，这是因为这些会被层nn.BatchNorm2d, nn.Dropout等使用以确保在不同阶段的适当行为。

```python
model, opt = get_model()
for epoch in range(epochs):
    model.train()
    for xb, yb in train_dl:
        pred = model(xb)
        loss = loss_func(pred, yb)

        loss.backward()
        opt.step()
        opt.zero_grad()

    model.eval()
    with torch.no_grad():
        valid_loss = sum(loss_func(model(xb), yb) for xb, yb in valid_dl)
print(epoch, valid_loss / len(valid_dl))
# 0 tensor(0.3204)
# 1 tensor(0.2949)
```

