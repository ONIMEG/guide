<!--.vitepress/theme/MyLayout.vue-->
<script setup>
import DefaultTheme from 'vitepress/theme'
import {useData} from 'vitepress'

const {frontmatter} = useData();
const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #doc-footer-before>
      本文贡献者: <template v-for="item in frontmatter.contributer">{{ item }}</template>
    </template>
  </Layout>
</template>