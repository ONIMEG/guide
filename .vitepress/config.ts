import { DefaultTheme, defineConfig } from "vitepress";

const navConfig: DefaultTheme.NavItem[] = [{ text: "主页", link: "/" }];

const sidebarConfig: DefaultTheme.SidebarItem[] = [
  {
    text: "快速开始",
    items: [
      { text: "注意", link: "/get-start/index.md" },
      { text: "速通", link: "/get-start/quick.md" },
    ],
  },
  {
    text: "例子",
    items: [
      { text: "模组翻译", link: "/example/translation.md" },
      { text: "建筑相关", link: "/example/buildings.md" },
    ],
  },
  {
    text: "源码注释",
    items: [{ text: "精炼机", link: "/source-code/metal-refinery-config" }],
  },
];

const socialLinks: DefaultTheme.SocialLink[] = [
  { icon: "github", link: "https://github.com/ONIMEG/guide/" },
];

export default defineConfig({
  title: "Guide",
  description: "缺氧模组制作入门指北",
  lastUpdated: true,
  head: [["link", { rel: "icon", href: "/logo.png" }]],

  themeConfig: {
    outline: { label: "目录" },
    search: {
      provider: "local",
    },
    editLink: {
      pattern: "https://github.com/ONIMEG/guide/edit/main/:path",
      text: "在 GitHub 上编辑本页",
    },
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
    lastUpdatedText: "最后更新于",
    logo: "/logo.png",
    nav: navConfig,
    sidebar: sidebarConfig,
    socialLinks: socialLinks,
  },
});
