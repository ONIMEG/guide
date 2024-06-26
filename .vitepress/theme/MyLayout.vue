<!--.vitepress/theme/MyLayout.vue-->
<script setup>
import DefaultTheme from 'vitepress/theme'
import {useData} from 'vitepress'
import {computed} from 'vue'

const { Layout } = DefaultTheme
const {frontmatter} = useData();
const pageInfo = computed(() => {
  const result = {
  };
  for (const key in frontmatter.value) {
    result[key] = frontmatter.value[key];
  }
  
  return result;
});
</script>

<template>
  <Layout>
    <template #doc-footer-before>
      <div class="contributer">
        页面贡献者: <span v-for="item in pageInfo.contributer" class="item">{{ item.name }}</span>
      </div> 
    </template>
  </Layout>
</template>

<style scoped>
.contributer{
  line-height: 24px;
    font-size: 14px;
    font-weight: 500;
    color: var(--vp-c-text-2);
}
.item+.item::before{
  content: '、';
}
</style>