import { DefaultTheme, defineConfig } from "vitepress";
import { sidebar } from "./sidebarConfig";
import { getContributors } from "./theme/util";


const socialLinks: DefaultTheme.SocialLink[] = [
  { icon: "github", link: "https://github.com/ONIMEG/" },
];

export default defineConfig({
  title: "缺氧模组制作入门指南",
  description: "缺氧模组制作入门指南",
  lastUpdated: true,
  head: [["link", { rel: "icon", href: "/logo.png" }]],
  async transformPageData(pageData, ctx) {
    pageData.frontmatter.contributer = await getContributors(pageData.relativePath)
  },
  themeConfig: {
    outline: { label: "目录" },
    search: {
      provider: "local",
    },
    editLink: {
      pattern: "https://github.com/ONIMEG/oni-mod-tools/start-doc/edit/main/:path",
      text: "在 GitHub 上编辑本页",
    },
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
    lastUpdatedText: "最后更新于",
    logo: "/logo.png",
    sidebar: sidebar,
    socialLinks: socialLinks,
  },
});
