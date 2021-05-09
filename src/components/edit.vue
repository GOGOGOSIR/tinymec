<template>
  <div
    id="kf-tinymce-container"
    :style="{ height: height + 'px' }"
    v-loading="loading"
  >
    <textarea id="tinymce-textarea"></textarea>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop, Model } from 'vue-property-decorator'

const COMPONENT_NAME = 'KfTinymceEdit'
const DEFAULT_OPTIONS = {
  selector: 'textarea#tinymce-textarea',
  language: 'zh_CN',
  plugins: [
    'advlist link image imagetools lists hr pagebreak',
    'searchreplace',
    'table paste toc'
  ],
  toolbar:
    'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak  | image link',
  statusbar: false, // 隐藏状态栏
  paste_data_images: true, // 粘贴图像
  toolbar_mode: 'sliding',
  file_picker_types: 'image'
}
const UPDATE_EVENT = 'update:modelValue'

@Component({
  name: COMPONENT_NAME
})
export default class extends Vue {
  @Model(UPDATE_EVENT, { type: String, default: '' }) value!: string

  @Prop({ type: Boolean, default: false }) disabled!: boolean
  @Prop({
    type: String,
    default: 'wcpxteedfkc18ahk5flt122y14bzcj3hf7mrn5uj9r9ehxea'
  })
  appId!: string
  @Prop({
    type: Object,
    default: function () {
      return {}
    }
  })
  options!: Record<string, any>
  @Prop({ type: Number, default: 0 }) width!: number
  @Prop({ type: Number, default: 500 }) height!: number

  private loading = false
  private vueEditor: Record<string, any> | null = null
  private tinymceOptions: Record<string, any> = {}
  private modelValue = this.value

  @Watch('disabled')
  private watchDisabled(newValue: boolean) {
    if (this.vueEditor) {
      this.vueEditor.setMode(newValue ? 'readonly' : 'design')
    }
  }
  @Watch('value')
  private watchValue(newValue: string) {
    this.modelValue = newValue
  }
  @Watch('modelValue')
  private watchModelValue(newValue: string) {
    this.$emit(UPDATE_EVENT, newValue)
  }

  // 获取富文本配置项
  private getTinymceOptions() {
    const {
      file_picker_callback,
      init_instance_callback,
      setup,
      ...others
    } = this.options
    const height = this.height
    const width = this.width
    const disabled = this.disabled
    const result: Record<string, any> = {
      ...DEFAULT_OPTIONS,
      ...others,
      file_picker_callback: (
        callback: (url: string, options: Record<string, any>) => void
      ) => {
        this.uploadLocalImage(callback)
        if (
          file_picker_callback &&
          typeof file_picker_callback === 'function'
        ) {
          file_picker_callback(callback)
        }
      },
      init_instance_callback: (editor: any) => {
        this.initInstanceCallback(editor)
        if (
          init_instance_callback &&
          typeof init_instance_callback === 'function'
        ) {
          init_instance_callback(editor)
        }
      },
      setup: (editor: any) => {
        this.tinymceSetUp(editor)
        if (setup && typeof setup === 'function') {
          setup(editor)
        }
      }
    }
    height && (result.height = height)
    width && (result.width = width)
    result.readonly = disabled
    return result
  }

  // 上传本地图片
  private uploadLocalImage(
    callback: (url: string, options: Record<string, any>) => void
  ) {
    const input = document.createElement('input') as HTMLInputElement
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.onchange = () => {
      const file = (input.files && input.files[0]) as File
      var reader = new FileReader()
      reader.onload = function () {
        var id = 'blobid' + new Date().getTime()
        var blobCache = window.tinymce.activeEditor.editorUpload.blobCache
        var base64 = reader.result && (reader.result as string).split(',')[1]
        var blobInfo = blobCache.create(id, file, base64)
        blobCache.add(blobInfo)
        callback(blobInfo.blobUri(), { title: file.name })
      }
      reader.readAsDataURL(file)
    }
    input.click()
  }

  // 富文本实例初始化完毕
  private initInstanceCallback(editor: any) {
    console.log('TinyMCE实例化完毕')
    editor.setContent(this.modelValue, { format: 'html' })
    this.loading = false
    this.vueEditor = editor
  }

  // TinyMCE编辑器实例呈现之前将执行的回调
  private tinymceSetUp(editor: any) {
    console.log('TinyMCE初始化')
    editor.on('change input undo redo', () => {
      const format = this.tinymceOptions.outputFormat
      this.modelValue = editor.getContent({ format })
    })
  }

  // 加载Tinymce脚本
  private loadTinymceScript(url: string, callback: () => void) {
    this.loading = true
    try {
      if (!window.tinymce) {
        const script = document.createElement('script')
        const body = document.querySelector('body')
        script.type = 'text/javascript'
        script.onload = () => {
          callback && callback()
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

  // 初始化initEdit
  private initEdit() {
    this.$nextTick(() => {
      this.tinymceOptions = this.getTinymceOptions()
      window.tinymce.init(this.tinymceOptions)
    })
  }

  // 获取脚本地址
  private getScriptUrl() {
    return `https://cdn.tiny.cloud/1/${
      this.appId || 'no-api-key'
    }/tinymce/5/tinymce.min.js`
  }

  mounted(): void {
    this.loadTinymceScript(this.getScriptUrl(), this.initEdit)
  }

  beforedestroy(): void {
    this.vueEditor && this.vueEditor.destroy()
    this.vueEditor = null
  }
}
</script>

<style lang="scss" scoped>
#kf-tinymce-container {
  width: 100%;
}
#tinymce-textarea {
  display: none;
}
</style>
