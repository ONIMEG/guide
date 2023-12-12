<!--.vitepress/theme/MyLayout.vue-->
<script setup>
import DefaultTheme from 'vitepress/theme'
import {useData} from 'vitepress'

const {frontmatter} = useData();
const { Layout } = DefaultTheme
const contributer = frontmatter.contributer

</script>

<template>
  <Layout>
    <template #doc-footer-before>
      本文贡献者: <template v-for="item in contributer">{{ item }}</template>
    </template>
  </Layout>
</template>