# automated-scrpt/ 文件夹说明

这里是一些自动化脚本。主要想法是设置docsify笔记服务开机自启动，以使我能够打开浏览器即可直接查看我的笔记，省去每次“手动进入笔记目录 -> 打开命令行 -> 输入`docsify serve .` -> 最小行命令行窗口”的麻烦。

## 文件说明

### cmd方式

- `autoStart-cmd.vbs`：启动后调用上面的bat脚本来启动docsify。
- `startDocsify.bat`：windows的bat脚本，作用为启动doscify。

> startDocsify.bat脚本似乎无法切换目录，必须放在笔记的根目录notebooks/中才能生效，不方便。

### wsl方式（我选择的是这种）

- `autoStart-wsl.vbs`：启动后将开启wsl，然后wsl调用下面的shell脚本来启动docsify。
- `startDocsify.sh`：linux的shell脚本，作用为启动docsify。

> docsify笔记即可以直接使用python来启动，又可以使用npm安装好doscify命令后使用doscify命令本身来启动。
> 
> 由于在linux中安装nodejs和npm非常方便，比较而言在windows上就非常麻烦且cmd命令行使用起来非常不爽，所以我习惯了在wsl中通过docsify命令来启动docsify笔记，因此最终选用了wsl方式来设置开机自启服务，如果在cmd中需要启用docsify笔记的话，我就选择了python的方式。
> 
> 不选择`startDocsify.bat`脚本的另一方面原因是，我发现该脚本似乎无法切换目录，那么其要生效的话就必须放在笔记的根目录notebooks/中，太违和了，所以一脸嫌弃。

## win10设置开机自启动脚本方法

快捷键`win + R`启动“运行窗口”，输入`shell:startup`即可进入可添加自启动服务的系统目录，将你希望开机自启的脚本放置在该目录下即可。

通常情况你的脚本应该是windows的脚本后缀，即`xxx.bat`，但直接添加bat脚本后开机会弹出其执行的cmd黑框，很碍眼，且将其关闭后相应的脚本服务也关闭了，不方便，所以我这里是在网上搜索后使用的vbs脚本，即上述的`autoStart-xxx.vbs`，通过vbs调用真正需要被执行的bat/shell等脚本，据说其是在后台以windows service的形式来启动，正好满足我的需要。

