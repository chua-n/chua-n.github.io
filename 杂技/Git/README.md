> 此处为Git笔记。通过左侧导航栏进行阅读吧。

[Git撤销远程仓库的修改（push）_CaptainBuggy的博客-CSDN博客_git取消push到远程仓库](https://blog.csdn.net/weixin_43738524/article/details/107005596)

## 临时笔记

### 使用远程分支强行覆盖本地分支：

```bash
git fetch --all // fetch所有分支上的内容，也可以选择只备份一部分内容
git reset --hard origin/master // 重置本地分支（这里master要修改为对应的分支名）
git pull
```

### 分离头指针

在“分离头指针”状态下，如果你做了某些更改然后提交它们，标签不会发生变化， 但你的新提交将不属于任何分支，并且将无法访问，除非通过确切的提交哈希才能访问。 因此，如果你需要进行更改，比如你要修复旧版本中的错误，那么通常需要创建一个新分支：

```bash
$ git checkout -b version2 v2.0.0
Switched to a new branch 'version2'
```

如果在这之后又进行了一次提交，`version2` 分支就会因为这个改动向前移动， 此时它就会和 `v2.0.0` 标签稍微有些不同，这时就要当心了。

