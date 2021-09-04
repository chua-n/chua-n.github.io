安装完成git后，需要设置用户名和邮箱：

```bash
git add file1.txt
git add file2.txt file3.txt
git commit -m "add 3 files."
```

注意git config命令的`--global`参数，这意味着这台机器上的所有Git仓库都会使用这个配置，当然也可以对某个仓库指定不同的用户名和email地址。

| Git命令                                              | 说明                            |                                                              |
| ---------------------------------------------------- | ------------------------------- | ------------------------------------------------------------ |
| git init                                             | 把当前目录变成Git可以管理的仓库 | 此时当前目录下会产生一个.git目录                             |
| git add <文件名>                                     | 把文件添加到仓库                | git add readme.txt                                           |
| git commit -m "<提交说明>"                           | 把文件提交到仓库                | commit可以一次提交多个刚add的文件  ![$ git add filel. txt  $ git add file2. txt file3. txt  $ git comit —n •acid 3 files. • ](file:///C:/Users/xucy-e/AppData/Local/Packages/Microsoft.Office.OneNote_8wekyb3d8bbwe/TempState/msohtmlclip/clip_image001.png) |
| git status                                           | 查看仓库当前状态                |                                                              |
| git diff                                             | 查看修改内容                    |                                                              |
| git log                                              | 查看提交历史                    | 可借此确定要回退到哪个版本  每个版本有一个版本号(commit id)，它是一个SHA1计算出来的非常大的数字，用十六进制表示；每提交一个新版本，Git都会把它们自动串成一条时间线。 |
| git reflog                                           | 查看命令历史                    | 可借此确定要回到未来的哪个版本                               |
| git reset --hard HEAD^  git reset --hard <commit id> | 回退到某一版本                  | 在Git中，HEAD表示当前版本，HEAD^表示上一个版本，HEAD^^表示上上个版本，依次类推，当数量比较多时，可以用HEAD~100表示。 |
| git checkout -- <文件名>                             | 撤销文件在工作区的修改          | 让文件回退到最近一次git commit或git   add时的状态。       若file自修改后还没有放入暂存区，则会回退到版本库中的状态    若是file已添加到暂存区后又做了修改，则回退到放入暂存区时的状态 |
| git reset HEAD <文件名>                              | 撤销已放入暂存区的修改          | git reset命令既可以回退版本，也可以把暂存区的修改回退到工作区。当我们用HEAD时，表示最新的版本。 |
| git rm <filename>                                    | 从版本库中删除文件              | 在Git中，删除也是一个修改操作，因此，仍需commit              |

工作区和版本库：

1. **工作区**：即在电脑里能看到的目录

2. **版本库**：repositiory，又名仓库，即工作区中隐藏的目录.git，版本库里存放了很多信息，其中最重要的就是名字为stage或index的暂存区，还有Git为我们自动创建的第一个分支master，以及指向master的一个指针叫HEAD.

实际上，如前所述，把文件往Git版本库里添加的时候，分两步执行——

1. 用git add把文件添加进去，这实际上是把文件修改添加到暂存区；

2. 用git commit提交修改，实际上就是把暂存区的**所有**内容提交到当前分支。

一旦提交后，如果又没有对工作区作任何修改，那么工作区就是“干净”的：

```console
$ git status
On branch master
nothing to commit, working tree clean
```

如果一个文件已经被提交到版本库，那么你永远不用担心误删。不过仍需注意，你会丢失最近一次commit后修改的内容。

