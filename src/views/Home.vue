<template>
  <div class="components-container">
    <h1>测试富文本</h1>
    <div class="test-warpper">
      <kf-editor v-model="content" :disabled="disabled" />
    </div>
    <el-button @click="handleDisabled">{{ disabledText }}</el-button>
    <div class="editor-content" v-html="content" />
    <!-- <editor
      api-key="wcpxteedfkc18ahk5flt122y14bzcj3hf7mrn5uj9r9ehxea"
      language="zh_CN"
      :plugins="[
        'advlist link image imagetools quickbars lists hr pagebreak',
        'searchreplace',
        'table paste toc'
      ]"
    /> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import editor from '@tinymce/tinymce-vue'

@Component({
  name: 'TinymceDemo',
  components: {
    editor,
    KfEditor: () => import('../components/edit.vue')
  }
})
export default class extends Vue {
  private content = `<h1 style="text-align: center;">Welcome to the TinyMCE demo!</h1><p style="text-align: center; font-size: 15px;"><img title="TinyMCE Logo" src="https://img95.699pic.com/photo/40162/0358.gif_wh300.gif!/gifto/true" alt="TinyMCE Logo" width="110" height="97" /><ul>
        <li>Our <a href="//www.tinymce.com/docs/">documentation</a> is a great resource for learning how to configure TinyMCE.</li><li>Have a specific question? Visit the <a href="https://community.tinymce.com/forum/">Community Forum</a>.</li><li>We also offer enterprise grade support as part of <a href="https://tinymce.com/pricing">TinyMCE premium subscriptions</a>.</li>
      </ul>`
  private disabled = false

  get disabledText(): string {
    return this.disabled ? '启用' : '禁用'
  }

  private handleDisabled() {
    this.disabled = !this.disabled
  }
}
</script>

<style lang="scss" scoped>
.test-wrapper {
  height: 600px;
}
</style>
