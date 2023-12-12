// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import Theme from 'vitepress/theme'
import MyLayoutVue from './MyLayout.vue'
// import './style.css'

export default {
  extends: Theme,
  Layout: MyLayoutVue
}
