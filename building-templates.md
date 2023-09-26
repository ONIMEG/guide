# BuildingTemplates.cs
这个工具类主要是用于创建建筑定义模板
## `CreateBuildingDef()`
用途：创建建筑的定义  
返回类型：`BuildingDef`
| 参数 | 类型 | 描述 |
| --- | --- | --- |
| id | string | 建筑的标识符 |
| width | int | 建筑的宽度 |
| height | int | 建筑的高度 |
| anim | string | 建筑的动画名称 |
| hitpoints | int | 建筑的生命值 |
| construction_time | float | 构建建筑所需的时间 |
| construction_mass | float[] | 构建建筑所需材料的质量 |
| construction_materials | string[] | 用于构建建筑材料的 ID |
| melting_point | float | 建筑熔化的温度 |
| build_location_rule | BuildLocationRule | 构建位置规则 |
| decor | EffectorValues | 建筑的装饰效果值 |
| noise | EffectorValues | 建造时的声音 |
| temperature_modification_mass_scale | float (默认为0.2) | 导热效率 |
