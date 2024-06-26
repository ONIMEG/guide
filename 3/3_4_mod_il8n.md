# 3.4 模组多语言

> 我们的模组可能不只有中文用户使用

就像 3.1 节做的那样，我们将模组中所有用到的字符串都存放在一个 `Strings` 类里，字符串都用静态的变量去存储，当我们需要用到字符串的时候，直接写入对应的变量就行。

首先，模组的原始语言应该是英文，通过英文的字符串生成翻译模板之后，再从英文翻译到中文或者是其他语言

当我们的 `Strings` 类创建好以后，通过科雷提供的模组工具类 `ModUtil` 中的 `RegisterForTranslation` 为我们的文本生成翻译模板：

```cs
public class Mod : KMod.UserMod2 {
    public override void OnLoad(Harmony harmony) {
        base.OnLoad(harmony);
// 这个是只在 Debug 模式下执行生成翻译模板的代码
#if DEBUG
        ModUtil.RegisterForTranslation(typeof(Strings));
#endif
    }
}
```

当我们启动模组之后我们的 `C:\Users\<用户名>\Documents\Klei\OxygenNotIncluded\mods\strings_templates` 中就会出现这个模组的文本翻译模板，我们用 Poedit 打开这个文件，进行对应语种的翻译，中文翻译文件的文件名应当是 `zh.po`

获得到这个文件之后，我们将这个翻译文件放在 `<模组文件夹>\translations` 文件夹下，顺带一提，如果想要别人翻译成其他语言，最好也把翻译模板放进去。

加载翻译文件需要用到 Plib 中的方法

```cs
public class Mod : KMod.UserMod2 {
    public override void OnLoad(Harmony harmony) {
        base.OnLoad(harmony);
        // 注册翻译文件
        new PLocalization().Register();
#if DEBUG
        ModUtil.RegisterForTranslation(typeof(Strings));
#endif
    }
}
```

如果想要建筑文本也能有多语言的话，建议在我 3.1 节[添加建筑到游戏的位置](/3/3_1_new_building.md#_3-1-2-将建筑添加到建筑栏)注册文本。