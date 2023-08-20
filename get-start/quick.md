# 速通

这一节会教你怎么准备开发环境，需要安装哪些工具，会循序渐进的带你完成一个模组的编写、编译、测试、上传。（这里的模组指的是，需要对游戏源代码进行修改的模组，并不是修改地图，新增地图那些模组）

## 前期准备

- 需要了解 C# 的一些基本语法，本教程并不会去讲解 C# 的语法。[菜鸟教程](https://www.runoob.com/csharp/csharp-tutorial.html)就是一个非常好的参考资料。
- 最好是了解一些 Harmony2.0 的基本使用。可以参考[官方文档](https://harmony.pardeike.net/)以及宵夜 97 这位 UP 主的[Unity 游戏 Mod 开发教程](https://space.bilibili.com/1306433/channel/collectiondetail?sid=307722)合集中有关 harmony 的部分。
- 开发环境，这里是以 Windows 为例。

## 需要遵守的规则

编写模组需要对游戏进行反编译获得游戏源代码，但是你是**没有**权利将反编译的源码进行开源的。科雷官方也是有一个[守则](https://www.klei.com/mod-player-creation-policy)的，可以了解一下，避免不必要的麻烦。

做出来的模组可以接受捐赠之类的，但是绝不能向玩家收费来解锁更高级的功能。

尊重其他作者的工作成果，做模组都是用爱发电，有些作者公开源码提供其他作者学习，但是并不表示你可以直接照抄。在 GitHub 上，你可以遵守作者提供的许可（license）来对源码进行参考和使用，如果作者没有提供任何许可，你也可以询问作者是否能够使用这些代码。

最最最重要的是，遇到问题先自己先尝试解决一下，最好不要碰到问题就去求助别人，希望他帮你解决。

## 可能会用到的一些工具

下面列出来的工具都是参考使用，你也可以使用你用的顺手的工具进行替代。

### Visual Studio Community 2022

[下载链接](https://visualstudio.microsoft.com/zh-hans/)

这个是创作模组的主力工具，集成式开发环境，用来编写代码，浏览源码，编译代码。

### JetBrains dotPeek

[下载链接](https://www.jetbrains.com/zh-cn/decompiler/)

用来反编译游戏代码，浏览源码，可以由其他工具替代。

### Visual Studio Code

[下载链接](https://code.visualstudio.com/)

文本编辑器，用来编写模组信息，也可以浏览源码。尽量不要用 windows 自带文本编辑器。

### AssetStudio `可选`

[下载链接](https://github.com/Perfare/AssetStudio/releases)

提取游戏内的动画文件需要使用。

### Spriter `可选`

[下载链接](https://brashmonkey.com/spriter-pro/)

修改和制作游戏内动画。

### kanimal-SE `可选`

[下载链接](https://github.com/skairunner/kanimal-SE)

动画文件格式转换。 scml -> kanimal kanimal -> scml

### Kanim Explorer `可选`

[下载链接](https://github.com/romen-h/kanim-explorer)

浏览动画文件以及对动画文件部分信息修改。部分功能依附于 kanimal-SE。

## Visual Studio 安装

在前面提供的链接下载的一般都有 Visual Studio Installer 对于编写模组，我们只需要下载部分组件，如图：
![visual-studio-0](/visual-studio-0.png)
点击左边的修改，只需要勾选这一个：
![visual-studio-1](/visual-studio-1.png)
单个组件那里确保勾选了 4.7.1
![visual-studio-2](/visual-studio-2.png)

## 反编译游戏代码

在 Steam 的游戏列表，右键缺氧，选择 “管理” -> “浏览本地文件”，在打开的文件资源管理器中进入 "./OxygenNotIncluded_Data/Managed" 文件夹，然后其中的 `Assembly-CSharp.dll` 文件就是我们反编译的目标，游戏内的大部分代码都能在这里找到，如果你安装了 DotPeek，那么这个文件应该就是 DotPeek 的图标，双击这个文件 DotPeek 就会自动反编译，或者是右键这个文件点击 “打开方式” 选择 DotPeek 打开，如果你的操作正确，那么 DotPeek 右边的资源管理器就会出现这样的条目：
![dot-peek-list](/dot-peek-list.png)
这个时候我们访问它下面的所有文件，都需要等待一会才能看到，可以选择右键这个项目，点击 "Export to Project" 选择你想要保存源代码的位置即可，这个过程会持续一段时间，请耐心等待。

当文件导出完成后，就可以用 Visual Studio 或者是 Visual Studio Code 来看源代码。

## 制作第一个模组

### 编写 & 编译

首先，打开 Visual Studio ，点击创建新项目，选择 `类库(.NET Framework)`； 项目名称，解决方案名称、项目路径随意填写，自己记得位置就行。如果你想一个解决方案创建多个项目，最好不要勾选 `将解决方案和项目放在同一目录中`，最后，点击 `创建` 即可完成一个项目的创建。
![dot-net-framework](/dot-net-framework.png)

如果按照默认的创建，名称什么都没改的话，基本上你的 Visual Studio 会是这个样子（这里我把所有折叠的项目都展开了）：
![project-main](/project-main.png)
首先要做的是右键 `引用` -> `添加引用` 然后点击新窗口下的 `浏览` 这个时候，你需要在弹出的文件资源管理器中访问前面[反编译游戏代码](#反编译游戏代码) `Assembly-CSharp.dll` 文件的文件夹中，按住 `Ctrl`，选中以下 dll 文件：

必需：

- `Assembly-CSharp.dll`
- `Assembly-CSharp-firstpass.dll`
- `0Harmony.dll`
- `UnityEngine.dll`
- `UnityEngine.CoreModule.dll`

可选：

- `UnityEngine.UI.dll`
- `Unity.TextMeshPro.dll`
- `UnityEngine.ImageConversionModule.dll`

当引用完成之后，回到 `Class1.cs` 这个文件，在这个类上继承 `KMod.UserMod2`，然后实现 `OnLoad` 方法，如下：

```c#
public class Class1 : KMod.UserMod2{
    public override void OnLoad(Harmony harmony) {
        base.OnLoad(harmony);
    }
}
```

随后，我们右键项目，选择 `新建项` 名称就改为 `Patch.cs` 这时，可以选择删除掉文件最开头的几个 `using xxx` 一般编辑器也会有提示 **Using 指令不是必须的**。

如果我们需要对源代码中 `Db.cs` 的代码进行修改，就需要这样做：

首先，在文件头部添加 `using HarmonyLib;`，之后在类中添加：

```c#
[HarmonyPatch(typeof(Db),nameof(Db.Initialize))]
public class Db_Initialize_Patch {
    public static void Prefix() {
        Console.WriteLine("在 Db.Initialize() 之前执行");
    }
    public static void Postfix() {
        Console.WriteLine("在 Db.Initialize() 之后执行");
    }
}
```

这里我仅仅是添加了一些输出语句。

想要我们编写的代码在游戏内执行，就需要对编写好的代码进行编译：右键你的项目（这里是 `ClassLibrary1`），点击 `生成` 如果没有更改设置，那么生成后的 dll 文件在你的项目文件夹下 `./bin/Debug` 文件夹中，有一个同名的 dll 文件，（这里是 `ClassLibrary1.dll`）。记住这个文件，后面的步骤需要使用。

如果我们想正式发布这个模组，建议将 Visual Studio 上方的解决方案配置 `Debug` 更改成 `Release`。

### 模组信息

缺氧的模组信息，是保存在 `mod.yaml` 和 `mod_info.yaml` 中的，这两个文件需要通过 `YAML` 的格式来编写，对于缺氧的模组信息，就非常简单。

首先是 `mod.yaml`

```yaml
title: "模组名称"
description: "关于模组的一些描述"
staticID: "MyFirstMod" # 模组的静态 ID ，可以任意命名，需要用英文字母
```

接着是 `mod_info.yaml`

```yaml
supportedContent: ALL
minimumSupportedBuild: 562984
version: 1.0.0
APIVersion: 2
```

对于这几个字段，`supportedContent` 是指模组支持的游戏版本，可以填写以下几个值：

- `ALL` 表示支持原版以及所有 DLC
- `EXPANSION1_ID` 表示仅支持 Space Out（眼冒金星） DLC
- `VANILLA_ID` 表示仅支持原版游戏

`minimumSupportedBuild` 表示最低能运行模组的版本，这个版本可以从游戏界面下方的代码中获取：
![oni-version](/oni-version.png)
两个 `-` 之中的一串数字就是数字版本号。

`version` 指的是该模组的版本，版本号可以是各种形式的，只是为了分辨模组是否需要更新。

`APIVersion` 这个在缺氧正式更新到 Harmony2.0 之后就固定是 2 了，表示用的是 2.0 的 Harmony。

### 测试模组

将前面所说的编译后的 DLL 文件和 `mod.yaml`、`mod_info.yaml` 文件都放在一个文件夹中（这个文件夹后续就称为 “模组文件夹”）。之后，我们找到安装模组的地方，对于测试模组，只需要将模组文件夹放入`文档\Klei\OxygenNotIncluded\mods\Dev` 文件夹中，如果没有 `Dev` 文件夹可以自己创建。

这个时候进入游戏，就能看到我们的模组已经躺进模组列表了。启用，然后重启游戏，我们的模组就能执行了。

由于我们编写的这个模组，仅仅是打印一些文本，这时就需要找到游戏的日志文件，一般情况下，日志文件存放在 `C:\Users\{你的用户名}\AppData\LocalLow\Klei\Oxygen Not Included` 文件夹中，如果没看到 `AppData` 文件夹，需要对文件资源管理器进行设置：点击 `查看->显示` 勾选中隐藏文件夹就可以看到，`Plyaer.log` 就是刚刚游戏运行的日志。打开日志文件，如果看到我们之前写在 `Console.WriteLine()` 之中的文本：

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

### 更新

如果模组后续有更新，直接选中要更新的模组，点击 `Edit` 就会进入编辑页面，选择需要更新的进行更新。

一个模组的制作流程基本就是这样。
