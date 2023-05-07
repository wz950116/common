<script>
export default {
  name: 'CmbNav',
  data() {
    return {
      title: '',
      leftText: '返回',
      // 插槽内容
      rightSlot: '',
      leftSlot: '',
      titleSlot: ''
    }
  },
  computed: {
    // 是否隐藏导航栏
    hideNavBar() {
      return this.$route.meta && this.$route.meta.hideNavBar === true
    },
    // 是否隐藏返回按钮
    hideLeftArrow() {
      return this.$route.meta && this.$route.meta.hideLeftArrow === true
    }
  },
  watch: {
    '$route': {
      handler(newVal) {
        this.$data.title = newVal.meta.title || ''
        // 初始化插槽内容
        this.rightSlot = ''
        this.leftSlot = ''
        this.titleSlot = ''
      },
      immediate: true
    }
  },
  mounted() {

  },
  methods: {
    handleClickLeftArrow() {
      const { name } = this.$route
      // 判断一下是否是接入app的项目，如果是 根据自身组件 根目录再次返回的话，需要返回到原生app中
      const isApp = false
      if (isApp && name === 'home') {
        this.$toast('返回到app')
      } else if (this.$route.meta?.backUrl) {
        this.$router.replace(this.$route.meta.backUrl)
      } else {
        this.$router.go(-1)
      }
    },
    handleClickRight() {
      console.log('点击右侧')
    },
    /**
     * 设置标题，支持字符串和render方式
     * @param title
     */
    setTitle(title) {
      if (typeof title === 'string') {
        this.$data.title = title
      } else {
        if (this.$refs.navbar) {
          this.titleSlot = title
        }
      }
    },
    /**
     * 设置左边的内容，支持字符串和render方式
     * @param left
     */
    setLeft(left) {
      if (typeof left === 'string') {
        this.$data.leftText = left
      } else {
        if (this.$refs.navbar) {
          this.leftSlot = left
        }
      }
    },
    /**
     * 设置右边的内容，支持字符串和render方式
     * @param right
     */
    setRight(right) {
      if (this.$refs.navbar) {
        this.rightSlot = right
      }
    }
  },
  render() {
    return (
      <div class='cmb-nav'>
        {
          this.hideNavBar ? '' : <cmb-nav-bar
            ref='navbar'
            title={this.title}
            fixed={true}
            placeholder={true}
            border={true}
            safe-area-inset-top={true}
            left-arrow={!this.hideLeftArrow}
            {...{ props: this.$attrs }}
            {...{ on: this.$listeners }}
            on-click-left={() => this.handleClickLeftArrow()}
            on-click-right={() => this.handleClickRight()}
          >
            <template slot='left'>
              {this.leftSlot}
            </template>

            <template slot='title'>
              {this.titleSlot}
            </template>

            <template slot='right'>
              {this.rightSlot}
            </template>
          </cmb-nav-bar>
        }
      </div>
    )
  }
}
</script>

<style scoped>

</style>
