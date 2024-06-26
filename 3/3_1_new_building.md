# 3.1 新增一个建筑
我们的目标是创建一个输入原油产生等量石油的建筑。

## 3.1.1 建筑设置类
首先创建一个新的项目。

向游戏中添加一个建筑，我们最基本就是需要继承一个 `IBulidingConfig` 类。

在项目中新建项 `NewBuildingConfig.cs` 并继承 `IBulidingConfig` 类

```cs
namespace MyNewMod {
    public class NewBuildingConfig : IBuildingConfig {
    
    }
}

```
这个时候我们的编辑器会出现错误警告，将鼠标移到警告的地方，点击 “显示可能的修补程序” -> “实现抽象类”。之后我们的类里面会自动补全两个必须实现的方法：
```cs
// 创建建筑的定义
// 这里用来定义建筑的宽高、动画文件、建筑材料、是否可淹没等等属性
public override BuildingDef CreateBuildingDef() {
  // 抛出未实现错误
    throw new NotImplementedException();
}
// 在建筑设置完成之后调用的方法
public override void DoPostConfigureComplete(GameObject go) {
    throw new NotImplementedException();
}
```
再在这个类里面添加设置建筑模板的方法
```cs
// 一般都在这里添加建筑需要的组件
public override void ConfigureBuildingTemplate(GameObject go, Tag prefab_tag) {
}
```
以上是一种方法，直接自己写，其实我们在反编译游戏代码之后就可以直接把反编译的代码复制过来。在 PoEdit 中搜索 “原油精炼器” 找到类似 `<link="OILREFINERY">原油精炼器</link>` 这样的文本，其中的 `OILREFINERY` 是我们找到原油精炼器的关键代码。

打开 DotPeek 使用 `Ctrl+t` 来打开全局搜索，我们会看到 `OilRefineryConfig` 这个类，一般 `XXConfig` 就是游戏内一个实体的配置文件 `XX` 则是这个实体的特有组件。

我们将原油精炼器的建筑类中的全部成员以及方法复制到我们的 `NewBuildingConfig` 类中：
```cs
public const string ID = "OilRefinery"; // 建筑 ID，最好别重复
public const SimHashes INPUT_ELEMENT = SimHashes.CrudeOil; // 建筑输入物质
private const SimHashes OUTPUT_LIQUID_ELEMENT = SimHashes.Petroleum; // 建筑输出液体
private const SimHashes OUTPUT_GAS_ELEMENT = SimHashes.Methane; // 建筑输出气体
public const float CONSUMPTION_RATE = 10f; // 建筑输入物质量
public const float OUTPUT_LIQUID_RATE = 5f; // 建筑输出液体量
public const float OUTPUT_GAS_RATE = 0.09f; // 建筑输出气体量
public override BuildingDef CreateBuildingDef()
{
  float[] tieR3_1 = BUILDINGS.CONSTRUCTION_MASS_KG.TIER3; // 建筑建造时需要的材料质量
  string[] allMetals = MATERIALS.ALL_METALS; // 建筑建造时的材料种类
  EffectorValues tieR3_2 = NOISE_POLLUTION.NOISY.TIER3; // 建筑建造完成时的声音大小
  EffectorValues tieR1 = BUILDINGS.DECOR.PENALTY.TIER1; // 建筑的装饰度
  EffectorValues noise = tieR3_2;
  // 创建建筑定义，其参数依次表示
  // 建筑 ID, 宽, 高, 动画文件, 血条, 建造时间, 建造材料质量（数组）, 建造材料种类（数组）, 过热温度, 建筑建造规则, 装饰度, 噪音
  BuildingDef buildingDef = BuildingTemplates.CreateBuildingDef("OilRefinery", 4, 4, "oilrefinery_kanim", 30, 30f, tieR3_1, allMetals, 800f, BuildLocationRuleOnFloor, tieR1, noise);
  buildingDef.RequiresPowerInput = true; // 建筑需要电力输入
  buildingDef.PowerInputOffset = new CellOffset(1, 0); // 电力输入位置（是建筑中心点位置的偏移）
  buildingDef.EnergyConsumptionWhenActive = 480f; // 电力消耗量
  buildingDef.ExhaustKilowattsWhenActive = 2f; // 运行时释放的热量
  buildingDef.SelfHeatKilowattsWhenActive = 8f; // 运行时增加自己的热量
  buildingDef.PermittedRotations = PermittedRotations.FlipH; // 建筑是否允许旋转（这里是垂直翻转）
  buildingDef.ViewMode = OverlayModes.LiquidConduits.ID; // 选中建筑时展示的视图
  buildingDef.AudioCategory = "HollowMetal"; // 建造完成时的声音种类
  buildingDef.InputConduitType = ConduitType.Liquid; // 建筑输入端口
  buildingDef.UtilityInputOffset = new CellOffset(0, 0); // 建筑输入端口位置
  buildingDef.OutputConduitType = ConduitType.Liquid; // 建筑输出端口
  buildingDef.UtilityOutputOffset = new CellOffset(1, 1); // 建筑输出端口位置
  return buildingDef;
}

public override void ConfigureBuildingTemplate(GameObject go, Tag prefab_tag)
{
//   给建筑添加标签，这里使用 go.AddTag(RoomConstraints.ConstraintTags.IndustrialMachinery) 效果是一样的
  go.GetComponent<KPrefabID>().AddTag(RoomConstraints.ConstraintTags.IndustrialMachinery); // 添加工业建筑标签
  go.AddOrGet<BuildingComplete>().isManuallyOperated = true; // 建筑需要复制人操作
  OilRefinery oilRefinery = go.AddOrGet<OilRefinery>(); // 添加特有组件
  oilRefinery.overpressureWarningMass = 4.5f;
  oilRefinery.overpressureMass = 5f;
  ConduitConsumer conduitConsumer = go.AddOrGet<ConduitConsumer>(); // 添加输入端口消耗物质组件
  conduitConsumer.conduitType = ConduitType.Liquid; // 输入端口类型：液体
  conduitConsumer.consumptionRate = 10f; // 消耗速率 /s
  conduitConsumer.capacityTag = SimHashes.CrudeOil.CreateTag(); // 消耗物质标签
  conduitConsumer.wrongElementResult = ConduitConsumer.WrongElementResult.Dump; // 输入错误物质的处理
  conduitConsumer.capacityKG = 100f; // 建筑能够存储的输入量
  conduitConsumer.forceAlwaysSatisfied = true;
  ConduitDispenser conduitDispenser = go.AddOrGet<ConduitDispenser>(); // 添加输出端口输出物质的组件
  conduitDispenser.conduitType = ConduitType.Liquid; // 输出端口输出种类
  conduitDispenser.invertElementFilter = true; // 允许过滤物质
  conduitDispenser.elementFilter = new SimHashes[1]
  {
    SimHashes.CrudeOil
  }; // 不允许原油输出
  go.AddOrGet<Storage>().showInUI = true; // 设置存储的材料是否在界面中显示
  ElementConverter elementConverter = go.AddOrGet<ElementConverter>(); // 添加物质转换组件
  elementConverter.consumedElements = new ElementConverter.ConsumedElement[1]
  { // 消耗的物质
    new ElementConverter.ConsumedElement(SimHashes.CrudeOil.CreateTag(), 10f) 
  };
  elementConverter.outputElements = new ElementConverter.OutputElement[2]
  { // 输出的物质
    new ElementConverter.OutputElement(5f, SimHashes.Petroleum, 348.15f, storeOutput: true, outputElementOffsety: 1f),
    new ElementConverter.OutputElement(0.09f, SimHashes.Methane, 348.15f, outputElementOffsety: 3f)
  };
  Prioritizable.AddRef(go); // 建筑添加优先级
}

public override void DoPostConfigureComplete(GameObject go)
{
}
```

在这一大段代码中，我们可以直接复制原油精炼器的建筑定义部分，只修改建筑 ID，而对于建筑添加的组件，我们可以进行适当的修改，由于我们的目标只是做一个输入之后输出的组件，那么就不需要 `OilRefinery` 这个特殊组件了，并且我们的输出物质也不需要天然气，这是修改后的代码：
```cs
namespace MyNewMod {
    public class NewBuildingConfig : IBuildingConfig {
        public const string ID = "NewOilRefinery";
        public override BuildingDef CreateBuildingDef() {
            float[] tieR3_1 = BUILDINGS.CONSTRUCTION_MASS_KG.TIER3;
            string[] allMetals = MATERIALS.ALL_METALS;
            EffectorValues tieR3_2 = NOISE_POLLUTION.NOISY.TIER3;
            EffectorValues tieR1 = BUILDINGS.DECOR.PENALTY.TIER1;
            EffectorValues noise = tieR3_2;
            BuildingDef buildingDef = BuildingTemplates.CreateBuildingDef(ID, 4, 4, "oilrefinery_kanim", 30, 30f, tieR3_1, allMetals, 800f, BuildLocationRule.OnFloor, tieR1, noise);
            buildingDef.RequiresPowerInput = true;
            buildingDef.PowerInputOffset = new CellOffset(1, 0);
            buildingDef.EnergyConsumptionWhenActive = 480f;
            buildingDef.ExhaustKilowattsWhenActive = 2f;
            buildingDef.SelfHeatKilowattsWhenActive = 8f;
            buildingDef.PermittedRotations = PermittedRotations.FlipH;
            buildingDef.ViewMode = OverlayModes.LiquidConduits.ID;
            buildingDef.AudioCategory = "HollowMetal";
            buildingDef.InputConduitType = ConduitType.Liquid;
            buildingDef.UtilityInputOffset = new CellOffset(0, 0);
            buildingDef.OutputConduitType = ConduitType.Liquid;
            buildingDef.UtilityOutputOffset = new CellOffset(1, 1);
            return buildingDef;
        }

        public override void ConfigureBuildingTemplate(GameObject go, Tag prefab_tag) {
            go.GetComponent<KPrefabID>().AddTag(RoomConstraints.ConstraintTags.IndustrialMachinery);
            // 这个建筑并不需要复制人操作，所以去掉这一行
            // go.AddOrGet<BuildingComplete>().isManuallyOperated = true;
            // 不需要这个组件，去掉
            // OilRefinery oilRefinery = go.AddOrGet<OilRefinery>();
            // oilRefinery.overpressureWarningMass = 4.5f;
            // oilRefinery.overpressureMass = 5f;
            ConduitConsumer conduitConsumer = go.AddOrGet<ConduitConsumer>();
            conduitConsumer.conduitType = ConduitType.Liquid;
            conduitConsumer.consumptionRate = 10f;
            conduitConsumer.capacityTag = SimHashes.CrudeOil.CreateTag();
            conduitConsumer.wrongElementResult = ConduitConsumer.WrongElementResult.Dump;
            conduitConsumer.capacityKG = 100f;
            conduitConsumer.forceAlwaysSatisfied = true;
            ConduitDispenser conduitDispenser = go.AddOrGet<ConduitDispenser>();
            conduitDispenser.conduitType = ConduitType.Liquid;
            conduitDispenser.invertElementFilter = true;
            conduitDispenser.elementFilter = new SimHashes[1]{
                SimHashes.CrudeOil
            };
            go.AddOrGet<Storage>().showInUI = true;
            ElementConverter elementConverter = go.AddOrGet<ElementConverter>();
            elementConverter.consumedElements = new ElementConverter.ConsumedElement[1]
            {
                new ElementConverter.ConsumedElement(SimHashes.CrudeOil.CreateTag(), 10f)
            };
            elementConverter.outputElements = new ElementConverter.OutputElement[1]
            {
                // storeOutput 是指转换后的物质会存放在建筑内的存储里面，348.15f 是物质的输出温度，最前面的数组是物质转化的量，这里改成 10f，改成与原油输入的量一致。
                new ElementConverter.OutputElement(10f, SimHashes.Petroleum, 348.15f, storeOutput: true, outputElementOffsety: 1f),
            };
            Prioritizable.AddRef(go);
        }

        public override void DoPostConfigureComplete(GameObject go) {
        }
    }
}
```
这里完成之后，我们仅仅是将这个建筑添加到了游戏里面，但是没有将建筑添加到建筑栏和科技树里。我们还需要在建筑菜单栏和科技树的代码里面添加我们的建筑。

## 3.1.2 将建筑添加到建筑栏
首先，我们需要在 `PlanScreen.cs` 中找到我们需要添加的建筑栏 ID，比如 `PlanScreen.CacheHashedString("Refining"),` 中的 `Refining` 就是我们的精炼菜单栏，代码里面的顺序跟实际游戏中的顺序一样，如果实在不清楚英文是啥意思可以参考游戏中的顺序来。然后再找到我们想要添加的科技树位置。科技树的配置文件是 Databese 命名空间下的 `Techs.cs` 文件。我们通过 `Ctrl+F` 进行文件中搜索，搜索 "OilRefinery"，也就是原油精炼器的代码，我们会看到这样一块代码：
```cs
Tech tech37 = new Tech("ImprovedCombustion", new List<string>()
{
    "MethaneGenerator",
    "OilRefinery",
    "PetroleumGenerator"
}, this);
```
这里面的 `ImprovedCombustion` 就是一个科技的 ID，我们也可以在 PoEdit 中搜索，可以找到这个 ID 对应的文本：`<link="IMPROVEDCOMBUSTION">化石燃料</link>`。

找到这些之后，就可以开始添加了。将建筑添加到建筑栏以及科技栏的代码如下：
```cs
ModUtil.AddBuildingToPlanScreen("Refining", NewBuildingConfig.ID); // 添加到建筑栏
Db.Get().Techs.Get("ImprovedCombustion").unlockedItemIDs.Add(SaltBoxNewBuildingConfigConfig.ID); // 添加到菜单栏
// 这行代码不知道有啥作用，我之前在查看运行日志的时候，总能看到一些啥啥啥没添加到啥的警告，然后添加这个之后就没警告了
TUNING.BUILDINGS.PLANSUBCATEGORYSORTING.Add(NewBuildingConfig.ID, "New Building");

// 如果建筑太多的话就将这几行代码提取成一个方法：
public static void AddNewBuilding(string building_id, string plan_screen_cat_id, string tech_id, string string_key) {
    ModUtil.AddBuildingToPlanScreen(plan_screen_cat_id, building_id);
    Db.Get().Techs.Get(tech_id).unlockedItemIDs.Add(building_id); 
    TUNING.BUILDINGS.PLANSUBCATEGORYSORTING.Add(building_id, string_key);
}

// 或者说这样
Array NewBuildings = (new Array[] {
    new string[]{ NewBuildingConfig.ID, "Refining", "ImprovedCombustion", "Keyyy"},
});

foreach (string[] building in NewBuildings) {
    ModUtil.AddBuildingToPlanScreen(building[1], building[0]);
    Db.Get().Techs.Get(building[2]).unlockedItemIDs.Add(building[0]); 
    TUNING.BUILDINGS.PLANSUBCATEGORYSORTING.Add(building[0], building[3]);
}
```
添加建筑的代码是有了，那么我们在哪里执行这几行代码？我比较常用的位置是在 `GeneratedBuildings` 的 `LoadGeneratedBuildings` 的方法之前。

在这之前，在项目中添加 Mod 类，并继承 KMod.UserMod2:
```cs
namespace MyNewMod {
    public sealed class Mod : KMod.UserMod2 {
        public override void OnLoad(Harmony harmony) {
            base.OnLoad(harmony);
            // 初始化 PUtil 的文件
            PUtil.InitLibrary();
            // 检查模组版本是否更新
            new PVersionCheck().Register(this, new SteamVersionChecker());
        }
    }
}
```

在创建按之后，再添加这个补丁类：
```cs
[HarmonyPatch(typeof(GeneratedBuildings), "LoadGeneratedBuildings")]
public class GeneratedBuildings_LoadGeneratedBuildings_Patch {
    public static void Prefix() {
        Array NewBuildings = (new Array[] {
            new string[]{ NewBuildingConfig.ID, "Refining", "AdvancedResearch", "Keyyy"},
        });

        foreach (string[] building in NewBuildings) {
            AddNewBuilding(building[0], building[1], building[2], building[3]);
        }
    }
}
```

到此，我们就可以对模组进行编译测试了。当我们在游戏中启用模组找到新增的建筑，发现建筑没有名称和描述，而是 "MISSING.xxxxx.NAME" 和 "MISSING.xxxxx.DESC"，是因为我们需要为这个建筑在游戏里面注册类似的字符串的 Key，游戏内会通过这个 Key 来找到我们的文本。

别着急退出，我们给建筑接上电源并输入原油，发现原油并没有被转换成石油输出。这也是一个问题。

## 3.1.3 建筑文本设置
首先对于文本信息，我们可以新建一个类，`Strings`，按照上面的 MISSING 之后的类添加新的类，类似这样：
```cs
public class Strings {
    public class BUILDINGS {
        public class PREFABS {
            public class NEWOILREINERY {
                public static LocString NAME = "新建筑";
                public static LocString DESC = "新建筑描述";
                public static LocString EFFECT = "新建筑效果";
            }
        }
    }
}
```
## 3.1.4 建筑运行组件编写
接着解决第二个问题，由于游戏并没有给出文档，所以我们只能找别的建筑参考，在游戏中，电解器和净水器是不需要复制人操作就能够自动生产的，我们去看看它的代码有什么不同，我们可以看到，在他们的建筑配置类中，`DoPostConfigureComplete` 方法中都有这两行代码：
```cs
// 逻辑电路控制建筑是否启用
go.AddOrGet<LogicOperationalController>();
// 电力激活控制定义
go.AddOrGetDef<PoweredActiveController.Def>();
```
由于我们并没有在这个建筑添加自动化接口，所以就只需要将第二行代码添加到对应的方法里，到这里我们再次编译测试的话，发现建筑还是不会运行，这个时候，就要查看它们的特殊组件了，经过比对，我们发现就净水器的特殊组件比较简单，我们把它的代码复制过来 (WaterPurifier.cs 直接复制到项目里面就行) 我们将这个文件重命名为 'NewBuilding.cs' 并且在弹出的对话框中点击确认更新引用。
```cs
using KSerialization;
using System;


[SerializationConfig(MemberSerialization.OptIn)]
public class NewBuilding : StateMachineComponent<NewBuilding.StatesInstance>
{
  [MyCmpGet]
  private Operational operational;
  // 我们没有需要复制人运送的材料，所以这里可以去掉
  // private ManualDeliveryKG[] deliveryComponents;
  // 这里是控制复制人运送材料组件的方法
  // private static readonly EventSystem.IntraObjectHandler<NewBuilding> OnConduitConnectionChangedDelegate = new EventSystem.IntraObjectHandler<NewBuilding>((Action<NewBuilding, object>) ((component, data) => component.OnConduitConnectionChanged(data)));

  protected override void OnSpawn()
  {
    base.OnSpawn();
    // 控制复制人运送材料的组件
    // this.deliveryComponents = this.GetComponents<ManualDeliveryKG>();
    // this.OnConduitConnectionChanged((object) this.GetComponent<ConduitConsumer>().IsConnected);
    // 订阅触发事件
    // this.Subscribe<NewBuilding>(-2094018600, NewBuilding.OnConduitConnectionChangedDelegate);
    // 启动状态机
    this.smi.StartSM();
  }

  // private void OnConduitConnectionChanged(object data)
  // {
  //   bool pause = (bool) data;
  //   foreach (ManualDeliveryKG deliveryComponent in this.deliveryComponents)
  //   {
  //     Element element = ElementLoader.GetElement(deliveryComponent.RequestedItemTag);
  //     if (element != null && element.IsLiquid)
  //       deliveryComponent.Pause(pause, "pipe connected");
  //   }
  // }

  public class StatesInstance : 
    GameStateMachine<NewBuilding.States, NewBuilding.StatesInstance, NewBuilding, object>.GameInstance
  {
    public StatesInstance(NewBuilding smi)
      : base(smi)
    {
    }
  }

// 下面一大堆都是状态机的代码，由于 DotPeek 反编译格式化的问题，我们可以在 VS 里面把这些没用的转换都替换掉
  public class States : 
    GameStateMachine<NewBuilding.States, NewBuilding.StatesInstance, NewBuilding>
  {
    public GameStateMachine<NewBuilding.States, NewBuilding.StatesInstance, NewBuilding, object>.State off;
    public NewBuilding.States.OnStates on;

    public override void InitializeStates(out StateMachine.BaseState default_state)
    {
      default_state = (StateMachine.BaseState) this.off;
      this.off.PlayAnim("off").EventTransition(GameHashes.OperationalChanged, (GameStateMachine<NewBuilding.States, NewBuilding.StatesInstance, NewBuilding, object>.State) this.on, (StateMachine<NewBuilding.States, NewBuilding.StatesInstance, NewBuilding, object>.Transition.ConditionCallback) (smi => smi.master.operational.IsOperational));
      this.on.PlayAnim("on").EventTransition(GameHashes.OperationalChanged, this.off, (StateMachine<NewBuilding.States, NewBuilding.StatesInstance, NewBuilding, object>.Transition.ConditionCallback) (smi => !smi.master.operational.IsOperational)).DefaultState(this.on.waiting);
      this.on.waiting.EventTransition(GameHashes.OnStorageChange, this.on.working_pre, (StateMachine<NewBuilding.States, NewBuilding.StatesInstance, NewBuilding, object>.Transition.ConditionCallback) (smi => smi.master.GetComponent<ElementConverter>().HasEnoughMassToStartConverting()));
      this.on.working_pre.PlayAnim("working_pre").OnAnimQueueComplete(this.on.working);
      this.on.working.Enter((StateMachine<NewBuilding.States, NewBuilding.StatesInstance, NewBuilding, object>.State.Callback) (smi => smi.master.operational.SetActive(true))).QueueAnim("working_loop", true).EventTransition(GameHashes.OnStorageChange, this.on.working_pst, (StateMachine<NewBuilding.States, NewBuilding.StatesInstance, NewBuilding, object>.Transition.ConditionCallback) (smi => !smi.master.GetComponent<ElementConverter>().CanConvertAtAll())).Exit((StateMachine<NewBuilding.States, NewBuilding.StatesInstance, NewBuilding, object>.State.Callback) (smi => smi.master.operational.SetActive(false)));
      this.on.working_pst.PlayAnim("working_pst").OnAnimQueueComplete(this.on.waiting);
    }

    public class OnStates : 
      GameStateMachine<NewBuilding.States, NewBuilding.StatesInstance, NewBuilding, object>.State
    {
      public GameStateMachine<NewBuilding.States, NewBuilding.StatesInstance, NewBuilding, object>.State waiting;
      public GameStateMachine<NewBuilding.States, NewBuilding.StatesInstance, NewBuilding, object>.State working_pre;
      public GameStateMachine<NewBuilding.States, NewBuilding.StatesInstance, NewBuilding, object>.State working;
      public GameStateMachine<NewBuilding.States, NewBuilding.StatesInstance, NewBuilding, object>.State working_pst;
    }
  }
}
```
由于 DotPeek 反编译出来的冗余代码确实多，我们可以在 VS 中输入 `WaterPurifier`，然后按住 `Ctrl` 点击这个文字就会跳转到它的源码，将上面对应的 States 类复制下来 (这里只是为了展示方便，实际并不需要对这里进行修改)：

```cs
public class States : GameStateMachine<States, StatesInstance, WaterPurifier> {
    // 在开启时的状态类，由四个状态组成
    public class OnStates : State {
        // 等待原材料输入状态
        public State waiting;
        // 准备开始工作状态
        public State working_pre;
        // 持续工作状态
        public State working;
        // 工作结束状态
        public State working_pst;
    }
    // 建筑关闭状态
    public State off;
    // 建筑开启状态
    public OnStates on;

    public override void InitializeStates(out BaseState default_state) {
        // 默认状态为关闭
        default_state = off;
        // 在关闭状态的时候播放关闭状态的动画，如果建筑的操作属性发生变化并为启用状态则进入开启状态
        off.PlayAnim("off").EventTransition(GameHashes.OperationalChanged, on, (StatesInstance smi) => smi.master.operational.IsOperational);
        // 在开启状态的时候播放开启状态动画，如果建筑操作属性发生变化并为禁用状态则进入关闭状态 开启状态的默认状态是等待材料输入状态
        on.PlayAnim("on").EventTransition(GameHashes.OperationalChanged, off, (StatesInstance smi) => !smi.master.operational.IsOperational).DefaultState(on.waiting);
        // OnStorageChange 当建筑内部 Storage 组件状态发生变化并且 ElementConverter 组件拥有足够的物质转换就进入工作准备状态
        on.waiting.EventTransition(GameHashes.OnStorageChange, on.working_pre, (StatesInstance smi) => smi.master.GetComponent<ElementConverter>().HasEnoughMassToStartConverting());
        // 工作准备状态只播放工作准备的动画，播放结束后进入工作状态
        on.working_pre.PlayAnim("working_pre").OnAnimQueueComplete(on.working);
        // 进入工作状态的时候将建筑设置为开启状态，如果说 ElementConverter 组件没有足够的物质转化就进入工作停止状态
        on.working.Enter(delegate (StatesInstance smi) {
            smi.master.operational.SetActive(value: true);
        }).QueueAnim("working_loop", loop: true).EventTransition(GameHashes.OnStorageChange, on.working_pst, (StatesInstance smi) => !smi.master.GetComponent<ElementConverter>().CanConvertAtAll())
            .Exit(delegate (StatesInstance smi) {
                smi.master.operational.SetActive(value: false);
            });
        // 工作停止状态播放工作停止的动画后进入等待材料状态
        on.working_pst.PlayAnim("working_pst").OnAnimQueueComplete(on.waiting);
    }
}
```

由于建筑的动画命名基本都是一致的，所以净水器的动画播放基本适用于精炼器的动画，我们需要在建筑设置类中的 `ConfigureBuildingTemplate` 方法中添加 `go.AddOrGet<NewBuilding>();` 这一行代码。完成之后，再进行编译测试。

经过测试，建筑可以正常运行并且文本也能正常显示。恭喜你，成功在游戏里添加了新的建筑。

以下是最终状态的代码：

::: details NewBuildingConfig.cs
```cs
using TUNING;
using UnityEngine;

namespace MyNewMod {
    public class NewBuildingConfig : IBuildingConfig {
        public const string ID = "NewOilRefinery";
        public override BuildingDef CreateBuildingDef() {
            float[] tieR3_1 = BUILDINGS.CONSTRUCTION_MASS_KG.TIER3;
            string[] allMetals = MATERIALS.ALL_METALS;
            EffectorValues tieR3_2 = NOISE_POLLUTION.NOISY.TIER3;
            EffectorValues tieR1 = BUILDINGS.DECOR.PENALTY.TIER1;
            EffectorValues noise = tieR3_2;
            BuildingDef buildingDef = BuildingTemplates.CreateBuildingDef("NewOilRefinery", 4, 4, "oilrefinery_kanim", 30, 30f, tieR3_1, allMetals, 800f, BuildLocationRule.OnFloor, tieR1, noise);
            buildingDef.RequiresPowerInput = true;
            buildingDef.PowerInputOffset = new CellOffset(1, 0);
            buildingDef.EnergyConsumptionWhenActive = 480f;
            buildingDef.ExhaustKilowattsWhenActive = 2f;
            buildingDef.SelfHeatKilowattsWhenActive = 8f;
            buildingDef.PermittedRotations = PermittedRotations.FlipH;
            buildingDef.ViewMode = OverlayModes.LiquidConduits.ID;
            buildingDef.AudioCategory = "HollowMetal";
            buildingDef.InputConduitType = ConduitType.Liquid;
            buildingDef.UtilityInputOffset = new CellOffset(0, 0);
            buildingDef.OutputConduitType = ConduitType.Liquid;
            buildingDef.UtilityOutputOffset = new CellOffset(1, 1);
            return buildingDef;
        }

        public override void ConfigureBuildingTemplate(GameObject go, Tag prefab_tag) {
            go.GetComponent<KPrefabID>().AddTag(RoomConstraints.ConstraintTags.IndustrialMachinery);
            ConduitConsumer conduitConsumer = go.AddOrGet<ConduitConsumer>();
            conduitConsumer.conduitType = ConduitType.Liquid;
            conduitConsumer.consumptionRate = 10f;
            conduitConsumer.capacityTag = SimHashes.CrudeOil.CreateTag();
            conduitConsumer.wrongElementResult = ConduitConsumer.WrongElementResult.Dump;
            conduitConsumer.capacityKG = 100f;
            conduitConsumer.forceAlwaysSatisfied = true;
            ConduitDispenser conduitDispenser = go.AddOrGet<ConduitDispenser>();
            conduitDispenser.conduitType = ConduitType.Liquid;
            conduitDispenser.invertElementFilter = true;
            conduitDispenser.elementFilter = new SimHashes[1]{
                SimHashes.CrudeOil
            };
            go.AddOrGet<Storage>().showInUI = true;
            ElementConverter elementConverter = go.AddOrGet<ElementConverter>();
            elementConverter.consumedElements = new ElementConverter.ConsumedElement[1]
            {
                new ElementConverter.ConsumedElement(SimHashes.CrudeOil.CreateTag(), 10f)
            };
            elementConverter.outputElements = new ElementConverter.OutputElement[1]
            {
                new ElementConverter.OutputElement(10f, SimHashes.Petroleum, 348.15f, storeOutput: true, outputElementOffsety: 1f),
            };
            go.AddOrGet<NewBuilding>();
            Prioritizable.AddRef(go);
        }

        public override void DoPostConfigureComplete(GameObject go) {
            go.AddOrGetDef<PoweredActiveController.Def>();
        }
    }
}

```
:::
::: details NewBuilding.cs

```cs
// Decompiled with JetBrains decompiler
// Type: WaterPurifier
// Assembly: Assembly-CSharp, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: E519DD73-DA90-48A8-894A-B7F073F3EAD7
// Assembly location: C:\Program Files (x86)\Steam\steamapps\common\OxygenNotIncluded\OxygenNotIncluded_Data\Managed\Assembly-CSharp.dll

using KSerialization;


[SerializationConfig(MemberSerialization.OptIn)]
public class NewBuilding : StateMachineComponent<NewBuilding.StatesInstance> {
    [MyCmpGet]
    private Operational operational;
    //private ManualDeliveryKG[] deliveryComponents;
    //private static readonly EventSystem.IntraObjectHandler<NewBuilding> OnConduitConnectionChangedDelegate = new EventSystem.IntraObjectHandler<NewBuilding>((Action<NewBuilding, object>) ((component, data) => component.OnConduitConnectionChanged(data)));

    protected override void OnSpawn() {
        base.OnSpawn();
        //this.deliveryComponents = this.GetComponents<ManualDeliveryKG>();
        //this.OnConduitConnectionChanged((object) this.GetComponent<ConduitConsumer>().IsConnected);
        //this.Subscribe<NewBuilding>(-2094018600, NewBuilding.OnConduitConnectionChangedDelegate);
        this.smi.StartSM();
    }

    //private void OnConduitConnectionChanged(object data)
    //{
    //  bool pause = (bool) data;
    //  foreach (ManualDeliveryKG deliveryComponent in this.deliveryComponents)
    //  {
    //    Element element = ElementLoader.GetElement(deliveryComponent.RequestedItemTag);
    //    if (element != null && element.IsLiquid)
    //      deliveryComponent.Pause(pause, "pipe connected");

    //  }
    //}

    public class StatesInstance :
      GameStateMachine<NewBuilding.States, NewBuilding.StatesInstance, NewBuilding, object>.GameInstance {
        public StatesInstance(NewBuilding smi)
          : base(smi) {
        }
    }

    public class States :
      GameStateMachine<NewBuilding.States, NewBuilding.StatesInstance, NewBuilding> {
        public GameStateMachine<NewBuilding.States, NewBuilding.StatesInstance, NewBuilding, object>.State off;
        public NewBuilding.States.OnStates on;

        public override void InitializeStates(out StateMachine.BaseState default_state) {
            default_state = (StateMachine.BaseState)this.off;
            this.off.PlayAnim("off").EventTransition(GameHashes.OperationalChanged, (GameStateMachine<NewBuilding.States, NewBuilding.StatesInstance, NewBuilding, object>.State)this.on, (StateMachine<NewBuilding.States, NewBuilding.StatesInstance, NewBuilding, object>.Transition.ConditionCallback)(smi => smi.master.operational.IsOperational));
            this.on.PlayAnim("on").EventTransition(GameHashes.OperationalChanged, this.off, (StateMachine<NewBuilding.States, NewBuilding.StatesInstance, NewBuilding, object>.Transition.ConditionCallback)(smi => !smi.master.operational.IsOperational)).DefaultState(this.on.waiting);
            this.on.waiting.EventTransition(GameHashes.OnStorageChange, this.on.working_pre, (StateMachine<NewBuilding.States, NewBuilding.StatesInstance, NewBuilding, object>.Transition.ConditionCallback)(smi => smi.master.GetComponent<ElementConverter>().HasEnoughMassToStartConverting()));
            this.on.working_pre.PlayAnim("working_pre").OnAnimQueueComplete(this.on.working);
            this.on.working.Enter((StateMachine<NewBuilding.States, NewBuilding.StatesInstance, NewBuilding, object>.State.Callback)(smi => smi.master.operational.SetActive(true))).QueueAnim("working_loop", true).EventTransition(GameHashes.OnStorageChange, this.on.working_pst, (StateMachine<NewBuilding.States, NewBuilding.StatesInstance, NewBuilding, object>.Transition.ConditionCallback)(smi => !smi.master.GetComponent<ElementConverter>().CanConvertAtAll())).Exit((StateMachine<NewBuilding.States, NewBuilding.StatesInstance, NewBuilding, object>.State.Callback)(smi => smi.master.operational.SetActive(false)));
            this.on.working_pst.PlayAnim("working_pst").OnAnimQueueComplete(this.on.waiting);
        }

        public class OnStates :
          GameStateMachine<NewBuilding.States, NewBuilding.StatesInstance, NewBuilding, object>.State {
            public GameStateMachine<NewBuilding.States, NewBuilding.StatesInstance, NewBuilding, object>.State waiting;
            public GameStateMachine<NewBuilding.States, NewBuilding.StatesInstance, NewBuilding, object>.State working_pre;
            public GameStateMachine<NewBuilding.States, NewBuilding.StatesInstance, NewBuilding, object>.State working;
            public GameStateMachine<NewBuilding.States, NewBuilding.StatesInstance, NewBuilding, object>.State working_pst;
        }
    }
}

```
:::

::: details Mod.cs
```cs
using HarmonyLib;
using Klei.AI;
using PeterHan.PLib.AVC;
using PeterHan.PLib.Core;
using STRINGS;
using System;
using System.Collections.Generic;

namespace MyNewMod {
    public sealed class Mod : KMod.UserMod2 {
        public override void OnLoad(Harmony harmony) {
            base.OnLoad(harmony);
            // 初始化 PUtil 的文件
            PUtil.InitLibrary();
            // 检查模组版本是否更新
            new PVersionCheck().Register(this, new SteamVersionChecker());
        }
    }


    public class Strings {
        public class BUILDINGS {
            public class PREFABS {
                public class NEWOILREFINERY {
                    public static LocString NAME = "新建筑";
                    public static LocString DESC = "新建筑描述";
                    public static LocString EFFECT = "新建筑效果";
                }
            }
        }
    }

    public static class Paches {
        [HarmonyPatch(typeof(GeneratedBuildings), "LoadGeneratedBuildings")]
        public class GeneratedBuildings_LoadGeneratedBuildings_Patch {
            public static void Prefix() {
                LocString.CreateLocStringKeys(typeof(Strings.BUILDINGS));
                Array NewBuildings = (new Array[] {
                    new string[]{ NewBuildingConfig.ID, "Refine", "AdvancedResearch", "Keyyy"},
                });

                foreach (string[] building in NewBuildings) {
                    AddNewBuilding(building[0], building[1], building[2], building[3]);
                }
            }
        }

        public static void AddNewBuilding(string building_id, string plan_screen_cat_id, string tech_id, string string_key) {
            ModUtil.AddBuildingToPlanScreen(plan_screen_cat_id, building_id); // 添加到建筑栏
            Db.Get().Techs.Get(tech_id).unlockedItemIDs.Add(building_id); 
            TUNING.BUILDINGS.PLANSUBCATEGORYSORTING.Add(building_id, string_key);
        }

    }
}
```
:::
