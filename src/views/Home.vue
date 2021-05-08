<template>
  <div class="components-container" v-loading="loading">
    <h1>测试富文本</h1>
    <textarea id="mytextarea">Hello, World!</textarea>
  </div>
</template>

<script lang="ts">
import { plugins } from '@/components/Tinymce/config'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'TinymceDemo'
})
export default class extends Vue {
  private loading = false

  private loadTinymce(url: string, callback: () => void) {
    this.loading = true
    try {
      if (!window.tinymce) {
        const script = document.createElement('script')
        const body = document.querySelector('body')
        script.type = 'text/javascript'
        script.onload = () => {
          callback && callback()
          this.loading = false
        }
        script.src = url
        if (body) {
          body.appendChild(script)
        }
      } else {
        callback && callback()
      }
    } catch (err) {
      console.log(err)
      this.loading = false
    }
  }

  /** 插件列表
   *  code
   *
   */
  // 初始化initEdit
  private initEdit() {
    this.$nextTick(() => {
      const w = window as any
      w.tinymce.init({
        selector: 'textarea#mytextarea',
        language: 'zh_CN',
        // width: 600,
        // height: 300,
        plugins: [
          'advlist autolink link image imagetools lists hr pagebreak',
          'searchreplace visualblocks visualchars',
          'table paste toc'
        ],
        toolbar:
          'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak  | image link',
        statusbar: false, // 隐藏状态栏
        paste_data_images: true // 粘贴图像
      })
    })
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  mounted() {
    this.loadTinymce(
      'https://cdn.tiny.cloud/1/wcpxteedfkc18ahk5flt122y14bzcj3hf7mrn5uj9r9ehxea/tinymce/5/tinymce.min.js',
      this.initEdit
    )
  }
}
</script>

<style lang="scss" scoped>
.editor-content {
  margin-top: 20px;
}
</style>
