# 1.3 Harmony 2
这里不是指华为的鸿蒙系统

先给出它的官方[网址](https://harmony.pardeike.net/)

## 1.3.1 介绍
照我的理解来看 Harmony 2 就是一个工具箱，在制作模组时，可以很轻松得利用它来将我们的代码加到游戏原来的代码里去。

## 1.3.2 注解定位
这里的定位指的是将我们的补丁方法定位到我们想要修改的目标方法上去。我只知道两种方法的定位方式，一种是普通的公有方法，一种是类的构造方法。譬如，我们要打补丁的目标方法是这个 MyMath 类中的 sum 方法：
```csharp
class MyMath
{
  public int x;
  public int y;
  MyMath(int a, int b)
  {
    this.x = a;
    this.y = b
  }
  public int sum(int a, int b)
  {
    return a+b;
  }
}
```
那么我们就可以这样定位：
```csharp
public class MyPatch
{
  // 第一个是 type 类的参数，第二个则是 string 类参数
  // 一个是我们需要打补丁的目标类，一个是目标方法，目标方法也可以通过 nameof() 方法转换
  [HarmonyPatch(typeof(MyMath), "sum")]
  public class MyMath_sum_Patch
  {
  }
}
```
而对于构造函数，我们得这样：
```csharp

public class MyPatch
{
  // 第一个是 type 类的参数，第二个则是 string 类
  // 第二个就是我们目标方法的类型了，MethodType.Constructor 指的就是构造方法
  // 后面就需要按顺序输入构造方法参数列表所有参数的类型
  [HarmonyPatch(typeof(MyMath), MethodType.Constructor, typeof(int), typeof(int))]
  public class MyMath_sum_Patch
  {
  }
}
```

## 1.3.3 补丁方法
Harmony 2 里面有三种补丁方法，这里值介绍前置补丁方法和后置补丁方法，下面用一张图来展示前置和后置补丁方法会在源方法的哪个位置执行：
![生效位置](/harmony-path-method.png)
前置补丁方法的名称为 `Prefix` 后置补丁方法的名称是 `Postfix`，需要注意的点是，我们在写补丁方法的时候，必须将补丁方法声明为静态，就像这样：
```csharp
class Pathes{
  public static void Postfix(){}
}
```
方法是否有返回值，是公有的还是私有的都无所谓。

## 1.3.4 补丁方法中的形参
这里的 `形参` 的意思就是方法的参数列表，这里也仅仅介绍我知道的一些用法。

### 特殊形参
1. `__instance`
如果我们目标方法并不是静态方法，那么我们可以通过这个参数获得对象的实例，相当于在定义类的成员方法时使用的 `this` 参数。但是我们只能在外部访问到公有成员，私有成员是一点都访问不到。
```csharp
public class MyPatch
{
  [HarmonyPatch(typeof(MyMath), "sum")]
  public class MyMath_Patch
  {
    public static void Prefix(MyMath __instance)
    {
      // 打印实例中的 x
      Console.WriteLine(__instance.x);
    }
  }
}
```
2. `__result`
在写这个形参的时候，`__result` 的类型一定需要和打补丁的方法返回类型一致，我们可以通过这个参数修改目标方法的返回值。
```csharp
public class MyPatch
{
  [HarmonyPatch(typeof(MyMath), "sum")]
  public class MyMath_sum_Patch
  {
    public static void Postfix(int __result)
    {
      // 返回值固定为 100
      __result = 100;
    }
  }
}
```
还有一些特殊的正在研究

### 普通形参
如果我们想要用到方法的输入值，我们可以在定义形参的时候使用目标方法一样的新参，比如我这里用到 sum 中的 a：
```csharp
public class MyPatch
{
  [HarmonyPatch(typeof(MyMath), "sum")]
  public class MyMath_Patch
  {
    public static void Postfix(int __result, int a)
    {
      // 返回值固定为 a 的 100 倍
      __result = 100 * a;
    }
  }
}
```
但是我们可能不想修改目标方法的逻辑，只是对输入值稍作修改，可以用 `ref` 关键字来实现：
```csharp
public class MyPatch
{
  [HarmonyPatch(typeof(MyMath), "sum")]
  public class MyMath_Patch
  {
    public static void Prefix(ref int a)
    {
      a = 1000;
    }
  }
}
```
:::tip
方法在执行的时候一般都会把输入的实参复制一份到自己手里，我们在方法内对这个参数怎么该都不会影响到外面的实参，`ref` 指的是引用的意思，就是说，方法不会去复制这个参数，而是直接使用输入时的实参。
:::