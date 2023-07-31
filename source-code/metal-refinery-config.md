# 精炼机

```cs
using System;
using System.Collections.Generic;
using TUNING;
using UnityEngine;
public class MetalRefineryConfig: IBuildingConfig {
  // 精炼机的唯一标识符
  public
  const string ID = "MetalRefinery";
  // 每次运行复杂制造所需的原材料质量
  private
  const float INPUT_KG = 100 f;
  // 液态冷却热量的比例
  private
  const float LIQUID_COOLED_HEAT_PORTION = 0.8 f;
  // 冷却液体标签，用于传递冷却能量
  private static readonly Tag COOLANT_TAG = GameTags.Liquid;
  // 冷却液体的最小质量
  private
  const float COOLANT_MASS = 400 f;
  // 配方中储藏物品的默认存储设置
  private static readonly List < Storage.StoredItemModifier >
    RefineryStoredItemModifiers = new List < Storage.StoredItemModifier >
    () {
      Storage.StoredItemModifier.Hide,
      Storage.StoredItemModifier.Preserve,
      Storage.StoredItemModifier.Insulate,
      Storage.StoredItemModifier.Seal
    };
  // 创建建筑定义，包括建筑名称、大小、外观动画、建造门槛、建筑材料、建筑装饰、建筑噪音、建筑热功率等参数
  public override BuildingDef CreateBuildingDef() {
      float[] tieR5 = TUNING.BUILDINGS.CONSTRUCTION_MASS_KG.TIER5; // 建筑所需的材料质量数组
      string[] allMinerals = TUNING.MATERIALS.ALL_MINERALS; // 建筑使用的全部矿物质
      EffectorValues tieR6 = NOISE_POLLUTION.NOISY.TIER6; // 建筑噪音水平
      EffectorValues tieR2 = TUNING.BUILDINGS.DECOR.PENALTY.TIER2; // 建筑装饰水平
      EffectorValues noise = tieR6; // 噪音水平
      // 创建建筑定义
      BuildingDef buildingDef = BuildingTemplates.CreateBuildingDef(
        "MetalRefinery", // 建筑名称
        3, // 建筑宽度
        4, // 建筑高度
        "metalrefinery_kanim", // 建筑外观动画名称
        30, // 建筑建造时需要的工程点数
        60 f, // 建筑建造时需要的工人工作时间
        tieR5, // 建筑所需的材料质量数组
        allMinerals, // 建筑使用的全部矿物质
        2400 f, // 建筑的最大耐久值
        BuildLocationRule.OnFloor, // 建筑的放置规则
        tieR2, // 建筑装饰的质量水平
        noise // 噪音水平
      );
      buildingDef.RequiresPowerInput = true; // 建筑需要电力输入
      buildingDef.EnergyConsumptionWhenActive = 1200 f; // 建筑活动时的能源消耗
      buildingDef.SelfHeatKilowattsWhenActive = 16 f; // 建筑活动时的自身热功率
      buildingDef.InputConduitType = ConduitType.Liquid; // 建筑输入管道类型为液体
      buildingDef.UtilityInputOffset = new CellOffset(-1, 1); // 建筑输入管道位置
      buildingDef.OutputConduitType = ConduitType.Liquid; // 建筑输出管道类型为液体
      buildingDef.UtilityOutputOffset = new CellOffset(1, 0); // 建筑输出管道位置
      buildingDef.ViewMode = OverlayModes.Power.ID; // 在电力视图中显示建筑
      buildingDef.AudioCategory = "HollowMetal"; // 建筑音效类别
      buildingDef.AudioSize = "large"; // 建筑音效大小
      return buildingDef;
    }
    // 该方法用于配置建筑模板，传入一个GameObject和标签
  public override void ConfigureBuildingTemplate(GameObject go, Tag prefab_tag) {
      // 添加可以丢弃全部工作物品的DropAllWorkable组件
      go.AddOrGet < DropAllWorkable > ();
      // 添加BuildingComplete组件，并设置为手动操作模式
      go.AddOrGet < BuildingComplete > ().isManuallyOperated = true;
      // 添加LiquidCooledRefinery组件
      LiquidCooledRefinery fabricator = go.AddOrGet <
        LiquidCooledRefinery > ();
      // 设置该组件由工程师操作
      fabricator.duplicantOperated = true;
      // 设置该组件的侧屏幕样式
      fabricator.sideScreenStyle = ComplexFabricatorSideScreen.StyleSetting
        .ListQueueHybrid;
      // 当产物超过容量限制时，是否保持过剩液体，默认为true
      fabricator.keepExcessLiquids = true;
      // 添加FabricatorIngredientStatusManager组件
      go.AddOrGet < FabricatorIngredientStatusManager > ();
      // 添加CopyBuildingSettings组件
      go.AddOrGet < CopyBuildingSettings > ();
      // 添加ComplexFabricatorWorkable组件
      ComplexFabricatorWorkable fabricatorWorkable = go.AddOrGet <
        ComplexFabricatorWorkable > ();
      // 创建一个复杂制造厂储存模板，该模板包括输入/输出端口和产物储存
      BuildingTemplates.CreateComplexFabricatorStorage(go, (
        ComplexFabricator) fabricator);
      // 冷却剂标签
      fabricator.coolantTag = MetalRefineryConfig.COOLANT_TAG;
      // 最小冷却液体质量，小于该值时会停止操作
      fabricator.minCoolantMass = 400 f;
      // 设置该组件的产物储存容量
      fabricator.outStorage.capacityKg = 2000 f;
      // 热传导率（0-1），用于计算从输入到输出产物之间传递的热量
      fabricator.thermalFudge = 0.8 f;
      // 设置输入/输出/产物储存的默认存储项目修饰符
      fabricator.inStorage.SetDefaultStoredItemModifiers(
        MetalRefineryConfig.RefineryStoredItemModifiers);
      fabricator.buildStorage.SetDefaultStoredItemModifiers(
        MetalRefineryConfig.RefineryStoredItemModifiers);
      fabricator.outStorage.SetDefaultStoredItemModifiers(
        MetalRefineryConfig.RefineryStoredItemModifiers);
      // 设置该组件产物放置的偏移量
      fabricator.outputOffset = new Vector3(1 f, 0.5 f);
      // 设置工作动画
      KAnimFile[] kanimFileArray = new KAnimFile[1] {
        Assets.GetAnim((HashedString)
          "anim_interacts_metalrefinery_kanim")
      };
      fabricatorWorkable.overrideAnims = kanimFileArray;
      // 添加RequireOutputs组件，并设置是否忽略管道存满的情况
      go.AddOrGet < RequireOutputs > ().ignoreFullPipe = true;
      // 添加ConduitConsumer组件，设置该组件消耗的介质类型、容量和储存器
      ConduitConsumer conduitConsumer = go.AddOrGet <
        ConduitConsumer > ();
      conduitConsumer.capacityTag = GameTags.Liquid;
      conduitConsumer.capacityKG = 800 f;
      conduitConsumer.storage = fabricator.inStorage;
      conduitConsumer.alwaysConsume = true;
      conduitConsumer.forceAlwaysSatisfied = true;
      // 添加ConduitDispenser组件，并设置该组件储存的产物、输送介质类型和元素过滤器
      ConduitDispenser conduitDispenser = go.AddOrGet <
        ConduitDispenser > ();
      conduitDispenser.storage = fabricator.outStorage;
      conduitDispenser.conduitType = ConduitType.Liquid;
      conduitDispenser.elementFilter = (SimHashes[]) null;
      conduitDispenser.alwaysDispense = true;
      // 遍历所有固态金属元素，用于合成
      foreach(Element element in ElementLoader.elements.FindAll(
          (Predicate < Element > )(e => e.IsSolid && e.HasTag(
            GameTags.Metal)))) {
          // 如果是不可压碎的金属，则不进行操作
          if(!element.HasTag(GameTags.Noncrushable)) {
            // 获取该金属的高温转化元素
            Element lowTempTransition = element.highTempTransition.lowTempTransition;
            // 如果该元素存在且与当前元素不同
            if(lowTempTransition != element) {
              // 设置所需配方元素
              ComplexRecipe.RecipeElement[] recipeElementArray1 =
                new ComplexRecipe.RecipeElement[1] {
                  new ComplexRecipe.RecipeElement(element.tag, 100 f)
                };
              ComplexRecipe.RecipeElement[] recipeElementArray2 =
                new ComplexRecipe.RecipeElement[1] {
                  new ComplexRecipe.RecipeElement(lowTempTransition
                    .tag, 100 f, ComplexRecipe.RecipeElement.TemperatureOperation
                    .AverageTemperature)
                };
              // 获得该配方的ID
              string obsolete_id = ComplexRecipeManager.MakeObsoleteRecipeID(
                "MetalRefinery", element.tag);
              string str = ComplexRecipeManager.MakeRecipeID(
                "MetalRefinery", (IList < ComplexRecipe.RecipeElement > ) recipeElementArray1, (
                  IList < ComplexRecipe.RecipeElement > ) recipeElementArray2
              );
              // 创建一个复杂配方，传入所需元素、所需时间、所需配方描述和配方名称，并添加到配方管理器中
              ComplexRecipe complexRecipe = new ComplexRecipe(str,
                recipeElementArray1, recipeElementArray2) {
                time = 40 f,
                  description = string.Format(
                    (string) STRINGS.BUILDINGS.PREFABS.METALREFINERY
                    .RECIPE_DESCRIPTION, (object) lowTempTransition
                    .name, (object) element.name),
                  nameDisplay = ComplexRecipe.RecipeNameDisplay.IngredientToResult,
                  fabricators = new List < Tag > () {
                    TagManager.Create("MetalRefinery")
                  }
              };
              ComplexRecipeManager.Get().AddObsoleteIDMapping(
                obsolete_id, str);
            }
          }
        }
        // 设置钢铁配方
      Element elementByHash = ElementLoader.FindElementByHash(
        SimHashes.Steel);
      ComplexRecipe.RecipeElement[] recipeElementArray3 = new ComplexRecipe
        .RecipeElement[3] {
          new ComplexRecipe.RecipeElement(ElementLoader.FindElementByHash(
              SimHashes.Iron).tag, 70 f),
            new ComplexRecipe.RecipeElement(ElementLoader.FindElementByHash(
              SimHashes.RefinedCarbon).tag, 20 f),
            new ComplexRecipe.RecipeElement(ElementLoader.FindElementByHash(
              SimHashes.Lime).tag, 10 f)
        };
      ComplexRecipe.RecipeElement[] recipeElementArray4 = new ComplexRecipe
        .RecipeElement[1] {
          new ComplexRecipe.RecipeElement(ElementLoader.FindElementByHash(
              SimHashes.Steel).tag, 100 f, ComplexRecipe.RecipeElement
            .TemperatureOperation.AverageTemperature)
        };
      // 获得该配方的ID
      string obsolete_id1 = ComplexRecipeManager.MakeObsoleteRecipeID(
        "MetalRefinery", elementByHash.tag);
      string str1 = ComplexRecipeManager.MakeRecipeID(
        "MetalRefinery", (IList < ComplexRecipe.RecipeElement > ) recipeElementArray3, (
          IList < ComplexRecipe.RecipeElement > ) recipeElementArray4
      );
      // 创建一个复杂配方，传入所需元素、所需时间、所需配方描述和配方名称，并添加到配方管理器中
      ComplexRecipe complexRecipe1 = new ComplexRecipe(str1,
        recipeElementArray3, recipeElementArray4) {
        time = 40 f,
          nameDisplay = ComplexRecipe.RecipeNameDisplay.IngredientToResult,
          description = string.Format(
            (string) STRINGS.BUILDINGS.PREFABS.METALREFINERY.RECIPE_DESCRIPTION, (
              object) ElementLoader.FindElementByHash(SimHashes.Steel)
            .name, (object) ElementLoader.FindElementByHash(
              SimHashes.Iron).name),
          fabricators = new List < Tag > () {
            TagManager.Create("MetalRefinery")
          }
      };
      ComplexRecipeManager.Get().AddObsoleteIDMapping(obsolete_id1,
        str1);
      // 添加可设置优先级的组件
      Prioritizable.AddRef(go);
    }
    // 该方法用于完成建筑配置后的处理，传入一个GameObject
  public override void DoPostConfigureComplete(GameObject go) {
    // 添加SymbolOverrideControllerUtil组件
    SymbolOverrideControllerUtil.AddToPrefab(go);
    // 添加PoweredActiveStoppableController.Def定义并获取
    go.AddOrGetDef < PoweredActiveStoppableController.Def > ();
    // 添加prefabSpawnFn事件，设置制造厂可操作的状态、属性转换器和技能经验值
    go.GetComponent < KPrefabID > ().prefabSpawnFn += (KPrefabID.PrefabFn)
      (game_object => {
        // 获取ComplexFabricatorWorkable组件
        ComplexFabricatorWorkable component = game_object.GetComponent <
          ComplexFabricatorWorkable > ();
        // 设置工作状态
        component.WorkerStatusItem = Db.Get().DuplicantStatusItems
          .Processing;
        // 设置属性转换器
        component.AttributeConverter = Db.Get().AttributeConverters
          .MachinerySpeed;
        // 设置属性经验倍率
        component.AttributeExperienceMultiplier =
          DUPLICANTSTATS.ATTRIBUTE_LEVELING.PART_DAY_EXPERIENCE;
        // 设置技能组并设置技能经验倍率
        component.SkillExperienceSkillGroup = Db.Get().SkillGroups
          .Technicals.Id;
        component.SkillExperienceMultiplier = SKILLS.PART_DAY_EXPERIENCE;
      });
  }
}
```
