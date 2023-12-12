# 1.5 动画相关工具

## AssetStudioGUI
用于提取一个捆绑包内的动画  
[下载地址](https://github.com/Perfare/AssetStudio/releases)

对于缺氧的动画文件，一般是 `File` -> `Load Floader` ，然后选择缺氧的安装位置，一般是在 C:\Program Files (x86)\Steam\steamapps\common\OxygenNotIncluded 这个目录，然后选中 `OxygenNotIncluded_Data` 文件夹，等待一会后他就会提取游戏内所有的动画资源提取出来，这个时候我们切换到 `Asset List` 这一栏，就可以看到有很多文件，我们可以在 `Filter` 输入框中输入我们想要查找的动画名，动画名一般通过源码找到，当然也可以自己慢慢翻。

例如我要找手动气闸门的动画，在输入框中输入 `door_manual` 可以看到 4 个文件，`door_manual_0`、`door_manual_anim`、`door_manual_build`、`door_manual_kanim`。我们能够操作的文件就是前三个，按住 `Ctrl` 选中前三个，然后单击鼠标右键选择 `Export ...`，选择存放位置，这样就能得到被编译后的动画文件了。一般称之为 `kanim` 格式的动画文件。

## Kanimal-SE
用于 `kanim` 动画文件与 `scml` 动画文件的转换。
[下载地址](https://github.com/skairunner/kanimal-SE)

我们下载好软件后，这个软件是控制台应用，所以我们只能在控制台使用，在我们存放软件的这个文件夹，右键选择 `在终端打开` 这时我们也可以将前面得到的三个文件也放在这里，输入命令：
```bash
.\kanimal-cli.exe scml .\door_manual_0.png .\door_manual_anim.txt .\door_manual_build.txt
```
`scml` 指的是 kanim 格式转换到 scml 格式的动画文件 反之应该写 `kanim`，后面只用跟上 scml 文件就行了。
但是如果你真的执行了上面提供的代码，会发现这玩意用不了，是因为我们后面的 `_anim` 和 `_build` 文件后缀是 `txt`，但是这个软件只认 `bytes` 后缀的文件，所以我们需要把后缀改了才行。非常麻烦。

### Kanim Explorer
直接浏览 kanim 或者 scml 格式的动画文件，同时也能对图层做一些更细致的修改。不过这个只能将源码下载下来之后自己在 vs 里面运行。  
[项目地址](https://github.com/romen-h/kanim-explorer)

我也没怎么用，就是看到有回老猫做冲水马桶动画那个门怎么都不对，然后他问了 aki，是用这个程序把厕所门的图层改了一下才能正常显示的。
### lazy_kanimal
这是我基于 Kanimal-SE 项目写了一个更容易用的程序。
[下载地址（GitHub）](https://github.com/ONIMEG/kanimal-SE/releases)
[下载地址（阿里云盘）](https://www.aliyundrive.com/s/dzTkWZbmsom)

kanim 格式的文件转换到 scml 格式文件只需要将 kanim 的三个文件拖拽到程序上就行反之直接把单个 scml 文件拖拽到应用上。

## Spriter
scml 格式的动画制作。我也不会用，这个直接在网上搜就行。