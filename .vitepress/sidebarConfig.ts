import { DefaultTheme } from "vitepress";

export const sidebar: DefaultTheme.SidebarItem[] = [
  {
    text: "第 0 章 ooo0O0o",
    collapsed: true,
    items: [
      { text: "0.1 文档目标", link: "/0/0_1_target.md" },
      { text: "0.2 缺氧模组制作守则", link: "/0/0_2_guideline.md" },
      { text: "0.3 写在前面 [ttdly]", link: "/0/0_3_preface_ttdly" },
    ],
  },
  {
    text: "第 1 章 工具介绍",
    collapsed: true,
    items: [
      { text: "1.1 Visual Studio", link: "/1/1_1_visual_studio.md" },
      { text: "1.2 C#", link: "/1/1_2_c_sharp.md" },
      { text: "1.3 Harmony2.0", link: "/1/1_3_harmony_2_0.md" },
      { text: "1.4 DotPeek", link: "/1/1_4_dot_peek.md" },
      { text: "1.5 动画相关工具", link: "/1/1_5_animation_tools.md" },
    ],
  },
  {
    text: "第 2 章 模组制作流程",
    collapsed: true,
    items: [
      {text: "2.1 游戏文件", link: "/2/2_1_rela_files.md"},
      {text: "2.2 项目创建", link: "/2/2_2_proj_create.md"},
      {text: "2.3 项目生成、测试以及上传", link: "/2/2_3_budle.md"}
    ]
  },
  {
    text: "第 3 章 简单的模组案例",
    collapsed: true,
    items: [
      {text: "3.1 新增一个建筑", link: "/3/3_1_new_building.md"},
      {text: "3.2 对现有建筑进行修改", link: "/3/3_2_modify_buildings.md"},
      {text: "3.3 修改详情菜单", link: "/3/3_3_modify_detail_menu.md"},
      {text: "3.4 模组多语言设置", link: '/3/3_4_mod_il8n.md'}
    ]
  }
];
