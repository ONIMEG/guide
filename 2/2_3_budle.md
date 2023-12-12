# 2.3 项目生成、测试以及上传

想要我们编写的代码在游戏内执行，就需要对编写好的代码进行编译：右键你的项目（这里是 `ClassLibrary1`），点击 `生成` 如果没有更改设置，那么生成后的 dll 文件在你的项目文件夹下 `./bin/Debug` 文件夹中，有一个同名的 dll 文件，（这里是 `ClassLibrary1.dll`）。记住这个文件，后面的步骤需要使用。

如果我们想正式发布这个模组，建议将 Visual Studio 上方的解决方案配置 `Debug` 更改成 `Release`。

## 创建模组文件夹
随便创建一个文件夹，里面创建两个文件 `mod.yaml`、`mod_info.yaml` :

`mod.yml`
```yaml
title: "测试模组"
description: "test"
staticID: "CalYu.TestMod"
```

`mod_info.yml`
```yaml
supportedContent: ALL
minimumSupportedBuild: 562984
version: 1.0.0
APIVersion: 2
```

然后将上一步的 `ClassLibrary1.dll` 复制到这个文件夹中。

## 模组测试

将我们上面创建好的模组文件夹复制到安装模组的地方，对于测试模组，只需要将模组文件夹放入`文档\Klei\OxygenNotIncluded\mods\Dev` 文件夹中，如果没有 `Dev` 文件夹可以自己创建。

将模组文件放入正确的地方之后就可以进入游戏启用模组了。

由于之前的模组只是打印一些文本而已，所以我们进入游戏并确定模组已经启用之后，打开游戏的日志文件，日志文件存放在`C:\Users\{你的用户名}\AppData\LocalLow\Klei\Oxygen Not Included` 文件夹中，如果没看到 `AppData` 文件夹，需要对文件资源管理器进行设置：点击 `查看->显示` 勾选中隐藏文件夹就可以看到，`Plyaer.log` 就是刚刚游戏运行的日志。打开日志文件，如果看到我们之前写在 `Console.WriteLine()` 之中的文本：

```txt
[02:55:05.037] [1] [INFO] Loading MOD dll: ClassLibrary1.dll
Onload 执行

....

[02:55:08.371] [4] [INFO] [Account] Got login for user KU_FzX9zSl-
在 Db.Initialize() 之前执行
在 Db.Initialize() 之后执行
```
就说明我们的模组生效了。


## 上传模组

上传模组的话，需要用到缺氧官方提供的工具，在 Steam 中安装，在下方图片的位置，选中 “工具”：
![steam-tool](/steam-tool.png)
找到 `Oxygen Not Included Uploader` 然后安装。安装完成之后，启动，我们会看到如下界面：
![upload-mod-0](/upload-mod-0.png)
点击 `Add` 会出现一个编写模组信息的窗口：
![upload-mod-1](/upload-mod-1.png)
其中，`Update Data` 需要选中模组文件夹，文件夹下的所有文件都会被上传。

下方的 `Preview Image` 需要是一个图片文件，默认是模组文件夹下的 `preview.png`

`Update Detail` 中，`Name` 是模组名称 `Description` 是模组信息，其格式遵循留言的格式。其中，

```txt
[list]
[*] 列表项
[/list]
是无序列表

[olist]
[*] 列表项
[/olist]
是有序列表
```

最下方的几个复选框，`Mod Type` 表示模组的类型：

- language 翻译模组
- worldgen 地图之类的模组
- new features 新功能
- tweaks 调整
- ui 界面

这个分类一般搜索时才会用到

最后，点击 `Publish!` 等一会，我们做的模组就会上架创意工坊公开订阅了。