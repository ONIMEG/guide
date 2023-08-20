# 模组翻译

这一节内容是怎么实现模组的国际化，也就是支持多种语言。

首先，需要展示在游戏内的文本最开始一定得是英文，而且最好用一个类来存起来，如 `MyNewModStrings.cs`

```cs
namespace MyNewMod{
    public class MyNewModStrings{
        public class BUTTON_1{
          public static LocString NAME = (LocString)"Apply";
          public static LocString TOOL_TIP = (LocString)"Apply someting to this object."
        }
    }
}
```

特定的类建立好之后，我们就需要为这个类创建一个翻译模板，这个就很简单，直接调用官方的工具函数 `ModUtil.RegisterForTranslation()` 比如说我们这里需要翻译的文本类是 `MyNewModStrings`，在我们继承了 `KMod.UserMod2` 类的 `OnLoad()` 方法中直接增加一行 `ModUtil.RegisterForTranslation(typeof(MyNewModStrings))`：

```cs{6}
namespace MyNewMod{
    public class Mod : KMod.UserMod2{
        // ---snip---
        public override void OnLoad(Harmony harmony) {
            // ---snip--
            ModUtil.RegisterForTranslation(typeof(MyNewModStrings))
            // ---snip--
        }
        // ---snip--
    }
}
```

添加这行代码之后，我们启动游戏，并且**启用**模组，之后，我们再查看 `mods` 文件夹下的 `strings_templates` 文件夹中会多出来一个 `mynewmod_template.pot` 文件，实际上这个 `mynewmod` 会是你命名空间也就是 `namespace` 关键字之后的名称。

获取到这个文件之后，使用 [Poedit](https://poedit.net/) 打开这个文件就能够通过翻译模板创建一个语言的翻译了，中文翻译的文件名得是 `zh.po`，其他的名称我没试，但是这个绝对是对的。

在 Poedit 创建完翻译文件之后，就需要在我们编译好的模组文件夹下新建 `translations` 文件夹，将我们翻译好的文件 `zh.po` 放入其中，启动游戏，可以看到我们的翻译都能够正确的加载出来。

但是，有时候游戏内的文本是通过一个 key 来访问的，比如游戏内的建筑，`STRINGS.BUILDINGS.PREFABS.NAME` 就是根据你的建筑 ID 来自动寻找这个文本。这个时候就需要我们根据这样的一个形式来创建一个存储文本的类。

```cs
namespace MyNewMod {
    public class MyNewModStrings {
        // ---snip---
        public class BUILDINGS {
            public class PREFABS {
                public static LocString NAME = "Building Name"
            }
        }
    }
}
```

想要游戏能够访问到我们的文本，就需要将 key 添加到游戏中：

```cs
[HarmonyPatch(typeof(Db), nameof(Db.Initialize))]
public class Db_Initialize_Patch {
    public static void Postfix() {
        LocString.CreateLocStringKeys(typeof(MyNewModStrings.BUILDINGS), "STRINGS.");
        // 这里不写第二个参数默认就是 STRINGS.
    }
}
```

至于为什么在这个地方创建 key。
是因为我一般都是使用 `PLib` 来加载翻译文件的，在模组加载的时候，翻译文件并没有正确加载，但是这个地方执行的时候翻译文本已经正确加载了。
