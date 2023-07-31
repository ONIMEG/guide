import { DefaultTheme, defineConfig } from "vitepress";

const navConfig: DefaultTheme.NavItem[] = [{ text: "Home", link: "/" }];

const sidebarConfig: DefaultTheme.SidebarItem[] = [
  {
    text: "源码注释",
    items: [{ text: "精炼机", link: "/source-code/metal-refinery-config" }],
  },
];

const socialLinks: DefaultTheme.SocialLink[] = [
  { icon: "github", link: "https://github.com/vuejs/vitepress" },
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
