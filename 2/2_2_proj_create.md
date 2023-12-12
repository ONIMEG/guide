# 2.2 项目创建

首先，打开 Visual Studio ，点击创建新项目，选择 `类库(.NET Framework)`； 项目名称，解决方案名称、项目路径随意填写，自己记得位置就行。如果你想一个解决方案创建多个项目，最好不要勾选 `将解决方案和项目放在同一目录中`，最后，点击 `创建` 即可完成一个项目的创建。
![dot-net-framework](/dot-net-framework.png)

如果按照默认的创建，名称什么都没改的话，基本上你的 Visual Studio 会是这个样子（这里我把所有折叠的项目都展开了）：
![project-main](/project-main.png)
首先要做的是右键 `引用` -> `添加引用` 然后点击新窗口下的 `浏览` 这个时候，你需要在弹出的文件资源管理器中访问前面[游戏文件](/2/2_1_rela_files.md) `Assembly-CSharp.dll` 文件的文件夹中，按住 `Ctrl`，选中以下 dll 文件：

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