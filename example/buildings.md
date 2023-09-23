# 建筑相关

## 修改

有时候我们不喜欢某个建筑的数据，就可以通过模组来对其进行修改，这里以修改电解器为例。
首先我们要用 Poedit 打开 `C:\Program Files (x86)\Steam\steamapps\common\OxygenNotIncluded\OxygenNotIncluded_Data\StreamingAssets\strings\strings_preinstalled_zh_klei.po`，然后 `Ctrl+F` 搜索
`电解器`就可以看到

```txt
<link="ELECTROLYZER">电解器</link>
```

这样一个值，`link` 右边的 `ELECTROLYZER` 就是电解器的大写 ID，如果使用的是 `DotPeek`，使用快捷键 `Ctrl+T` 输入建筑大写 ID，其中 `*Config.cs` 就是这个建筑的配置文件，简答的修改可以在这里进行，如果你进行了源码的深入阅读，发现有些修改还要在其他的地方修改。

好了，这里电解器的配置代码在 `ElectrolyzerConfig.cs` 文件中，如果我们想要修改输入的物质则需要在 `ConfigureBuildingTemplete` 方法中对 `ElementConverter` 进行修改。
原来的元素输入设置是这样的：

```cs
elementConverter.consumedElements = new ElementConverter.ConsumedElement[1]{
    new ElementConverter.ConsumedElement(new Tag("Water"), 1f)
};
```

现在我们将他修改，直接对这个属性重新赋值就好：

```cs
[HarmonyPatch(typeof(ElectrolyzerConfig), nameof(ElectrolyzerConfig.ConfigureBuildingTemplete))]
public class ElectrolyzerConfig_ConfigureBuildingTemplete_Patch{
    ElementConverter elementConverter = go.AddOrGet<ElementConverter>();
    // 这里将水的 tag 换为污染水的 tag
    elementConverter.consumedElements = new ElementConverter.ConsumedElement[1]{
      new ElementConverter.ConsumedElement(new Tag("DirtyWater"), 1f)
    };
}
```

对建筑的修改一般都是对其中附加的组件或者是建筑本身的一些 def 进行修改，只要找到位置，进行覆写就行。游戏里面的额组件很多，需要自己慢慢摸索。

## 增加

想要新增建筑就需要准备建筑会用到的动画，可以直接使用游戏内的动画，也可以对部分贴图进行改色使用。

首先，新增一个建筑类，一般为 `xxxConfig`，这里以 `MyNewBuildingConfig` 为例；

右键资源列表中的项目右键， `添加` -> `新建项` 输入 `MyNewBuildingConfig.cs`,然后打开：


```cs
// MyNewBuildingConfig.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyNewMod {
    internal class MyNewBuildingConfig {
    }
}

```
这是创建好后默认的代码模板，最前面的 `using xxx` 都可以删除，后面大概率用不到几个，然后需要继承 `IBuildingConfig` 类，这个时候我们会看到编辑器中有错误警告，将鼠标移上去，点击 `显示修补程序`->`实现抽象类` 编辑器会自动帮我们插入代码，但是会少一条我们会常用的方法，添加上：

```cs
// MyNewBuildingConfig.cs
using System;
using UnityEngine;

namespace MyNewMod {
    public class MyNewBuildingConfig : IBuildingConfig {
        public override BuildingDef CreateBuildingDef() {
            throw new NotImplementedException();
        }

        public override void ConfigureBuildingTemplate(GameObject go, Tag prefab_tag) {
            base.ConfigureBuildingTemplate(go, prefab_tag);
        }

        public override void DoPostConfigureComplete(GameObject go) {
            throw new NotImplementedException();
        }
    }
}
```
然后就是在这些方法里面填写内容了。

注意：这只是个简单的引导，并没有代码细节解释。