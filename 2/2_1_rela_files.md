# 2.1 文件系统

## 模组文件夹
一个模组最起码有以下三个文件：编译后的文件、两个模组信息文件

### 模组信息文件
`mod.yml`
```yaml
title: "模组名称"
description: "关于模组的一些描述"
staticID: "MyFirstMod" # 模组的静态 ID ，可以任意命名，需要用英文字母
```

`mod_info.yml`
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

### 模组文件夹中的可选文件夹
`assest`
一般用于存放动画文件，动画文件整个存储在 'assest/anim' 文件夹下


## 游戏数据文件夹
在你的 Steam 游戏库中，右键 `缺氧` -> `管理` -> `浏览本地文件` 接着在打开的文件资源管理器中进入`OxygenNotIncluded_Data` 文件夹，其中又有如下文件夹：
```txt
├─Managed（C# 代码编译后的程序集）
├─Plugins（扩展游戏功能的插件）
├─Resources（资源文件）
└─StreamingAssets（游戏内直接读取的文件，像元素、地图、特质一类）
```

### Managed 文件夹
我们在编写自己的模组的时候也会引用到里面的一些文件：
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

### StreamingAssets 文件夹
其结构如下：
```txt
├─codex 游戏中数据库的一些文件
├─dlc dlc 相关文件
├─elements 元素配置文件
├─fonts 游戏中的字体文件
├─strings 处理游戏内翻译的相关文件
├─worldgen 地图生成的文件
└─templates 游戏中会用到的一些地图模板同时也是我们 debug 中的模板列表
```
我们在模组中如果想要修改这些文件，只需要在我们模组文件的根目录中添加这些文件就可以

比如我想添加新的元素配置文件那么我的模组文件夹应该是这样的：  
```txt
├─elements 元素配置文件  
│ └─soild.yaml  
├─mod.dll  
├─mod_info.yaml  
└─mod.yaml
```