# 3.2 修改现有的建筑

在我看来，新增一个建筑无非是将多个组件进行拼凑，修改一个建筑则是找到对应的组件进行修改。

但是修改建筑的话也会有很多的限制，比如私有成员变量就无法修改。这里也只是举一些简单的例子。

## 3.2.1 修改电池与存储箱子

首先我们找到电池的配置文件 `BatteryConfig.cs`，可以看到它是在 `DoPostCinfigureComplete` 方法中添加了 `Battery` 组件：

```cs
public override void DoPostConfigureComplete(GameObject go)
{
  Battery battery = go.AddOrGet<Battery>();
  battery.capacity = 10000f;
  battery.joulesLostPerSecond = 1.66666663f;
  base.DoPostConfigureComplete(go);
}
```
我们看它设置的参数，不难看出 `capacity` 是容量，`joulesLostPerSecond` 是每秒损失的焦耳

既然知道在哪里设置参数，那么我们就可以随意更改了：

```cs
[HarmonyPatch(typeof(BatteryConfig), nameof(BatteryConfig.DoPostConfigureComplete))]
public class BatteryConfig_Patch {
    public static void Postfix(GameObject go) {
        Battery battery = go.AddOrGet<Battery>();
        battery.capacity = 20000f;
        battery.joulesLostPerSecond = 0f;
    }
}
```

注意，不管是修改什么，数值都不宜调整过大。

现在可以自己尝试一下修改存储箱的容量。

::: details 修改存储箱容量
```cs
[HarmonyPatch(typeof(StorageLockerConfig), nameof(StorageLockerConfig.ConfigureBuildingTemplate))]
public class StorageLockerConfig_Patch {
    public static void Postfix(GameObject go) {
        Storage storage = go.AddOrGet<Storage>();
        storage.capacityKg = 40000f;
    }
}
```
:::

## 3.2.2 修改建筑配方

