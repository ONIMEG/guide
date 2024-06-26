# 3.3 修改详情菜单

有时候我们需要为我们的功能添加一些触发动作，比如按钮啥的。这一节就展示几个添加详情菜单的组件案例。

## 3.3.1 添加按钮
添加按钮的话，我们需要创建一个最基础的组件，比如说我创建一个 MyButtonComponent 类，用来给某个建筑添加菜单栏的按钮。

首先要创建一个事件委托变量，并且在组件初始化的时候订阅菜单刷新的事件，代码如下：

```cs
public class MyButtonComponent: KMonoBehaviour {
    private static readonly EventSystem.IntraObjectHandler<MyButtonComponent> OnRefreshUserMenuDelegate = new EventSystem.IntraObjectHandler<MyButtonComponent>((component, data) => component.OnRefreshUserMenu(data));

    protected override void OnPrefabInit() {
        base.OnPrefabInit();
        Subscribe((int)GameHashes.RefreshUserMenu, OnRefreshUserMenuDelegate);
    }
}
```
注意尖括号里面的类需要跟你写方法的这个类一样，然后我们要在组件里面实现添加按钮的代码，可以看到我们在定义 `OnRefreshUserMenuDelegate` 的时候，最后调用的是组件的 `OnRefreshUserMenu` 这个方法，所以我们要在组件里面实现这个方法：

```cs
Game.Instance.userMenu.AddButton(gameObject, new KIconButtonMenu.ButtonInfo("action_follow_cam", "按钮显示的文字", new System.Action(OnClickButton), tooltipText:"按钮显示的提示"));
// "action_follow_cam" 是内置的几个图标之一，怎么添加新的这种图标我还不太清楚，
// new System.Action(OnClickButton) 就是定义按下按钮后会执行那个方法，
```
`OnClickButton` 方法我们也没有实现，由于只是简单演示，我就直接写一个摧毁游戏对象的方法，接下来在组件里面实现一下：

```cs
private void OnClickButton() {
    DestroyImmediate(gameObject);
}

```

最终我们的类是这样的：
::: details MyButtonComponent.cs
```cs
public class MyButtonComponent: KMonoBehaviour {
    private static readonly EventSystem.IntraObjectHandler<MyButtonComponent> OnRefreshUserMenuDelegate = new EventSystem.IntraObjectHandler<MyButtonComponent>((component, data) => component.OnRefreshUserMenu(data));

    protected override void OnPrefabInit() {
        base.OnPrefabInit();
        Subscribe((int)GameHashes.RefreshUserMenu, OnRefreshUserMenuDelegate);
    }

    public void OnRefreshUserMenu(object _) {
        Game.Instance.userMenu.AddButton(gameObject, new KIconButtonMenu.ButtonInfo("action_follow_cam", "按钮显示的文字", new System.Action(OnClickButton), tooltipText: "按钮显示的提示"));
    }

    private void OnClickButton() {
        DestroyImmediate(gameObject);
    }
}
```
:::

## 3.3.2 新增按钮窗口
有时候我们又需要像检查菜单、间歇泉研究菜单那样的按钮，那么我们可以通过继承 `ISidescreenButtonControl` 类来实现，继承之后通过 VS 的提示来补全需要继承的类：

```cs
public class MySideScreenButtonComponent : ISidescreenButtonControl {
    // 返回按钮显示的文字
    public string SidescreenButtonText => throw new NotImplementedException();
    // 返回按钮的提示文字
    public string SidescreenButtonTooltip => throw new NotImplementedException();
    // 这里不知道怎么写，应该是排序相关的，我一般写 20
    public int ButtonSideScreenSortOrder() {
        throw new NotImplementedException();
    }
    // 这里返回 -1 就行
    public int HorizontalGroupID() {
        throw new NotImplementedException();
    }
    // 按钮按下的事件
    public void OnSidescreenButtonPressed() {
        throw new NotImplementedException();
    }
    // 这个我不知道怎么整，但是官方代码里面也是抛出未继承错误
    public void SetButtonTextOverride(ButtonMenuTextOverride textOverride) {
        throw new NotImplementedException();
    }
    // 按钮是否可以交互
    public bool SidescreenButtonInteractable() {
        throw new NotImplementedException();
    }
    // 侧边栏是否显示
    public bool SidescreenEnabled() {
        throw new NotImplementedException();
    }
}

```
不想重复写代码，我就直接把位移信标的代码搬过来用作演示： 

```cs
public class Manual : Surveyable, ISidescreenButtonControl {
    [Serialize]
    // 是否标记为测绘
    private bool isMarkForSurvey;

    string ISidescreenButtonControl.SidescreenButtonText => ButtonText();

    string ISidescreenButtonControl.SidescreenButtonTooltip => ButtonToolTip();
    // 返回按钮显示的文字
    private string ButtonText() {
        if (isMarkForSurvey) {
            return PackAnythingString.UI.SURVEY.NAME_OFF;
        } else {
            return PackAnythingString.UI.SURVEY.NAME;
        }
    }
    // 返回按钮的提示文字
    private string ButtonToolTip() {
        if (isMarkForSurvey) {
            return PackAnythingString.UI.SURVEY.TOOLTIP_OFF;
        } else {
            return PackAnythingString.UI.SURVEY.TOOLTIP;
        }
    }

    int ISidescreenButtonControl.ButtonSideScreenSortOrder() => 20;

    int ISidescreenButtonControl.HorizontalGroupID() => -1;
    // 按钮按下的事件
    void ISidescreenButtonControl.OnSidescreenButtonPressed() {
        Toggle();
    }

    void ISidescreenButtonControl.SetButtonTextOverride(ButtonMenuTextOverride textOverride) {
        throw new System.NotImplementedException();
    }
    // 如果测绘过，则按钮不能再按下 isSurveyed 的定义在另一个类中
    bool ISidescreenButtonControl.SidescreenButtonInteractable() => !isSurveyed;
    // 由于建筑菜单里面不只是这一个按钮，所以需要一直显示
    bool ISidescreenButtonControl.SidescreenEnabled() => true;

    private void Toggle() {
        isMarkForSurvey = !isMarkForSurvey;
        Refresh();
    }

    private void Refresh() {
        if (isLoadingScene)
            return;
        if (isMarkForSurvey) {
            isSurveyed = true;
            PackAnythingStaticVars.SurveableCmps.Add(this);
        }
    }

}
```