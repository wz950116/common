<script>
export default {
  name: 'list-group',
  props: {
    config: {
      type: Object,
      default() {
        return {
          render: (item) => this.renderItem2(item)
        }
      }
    }
  },
  computed: {
    getList() {
      return this.config.getList
    },
    renderItem() {
      console.log(this.config, 222)
      return this.config.render
    }
  },
  mounted() {
    console.log(this.$route.params, 11111)
  },
  methods: {
    onLoad() {
      const page = this.page
      this.loading = true
      this.error = false
      this.finishedText = '没有更多了'
      this.noData = false
      this.getList({
        page: this.refreshing ? 1 : page + 1
      })
        .then((res) => {
          this.disabled = false
          if (this.refreshing) {
            this.list = []
            this.refreshing = false
            this.page = 1
          } else {
            this.page = page + 1
          }
          const { list, total } = res

          this.list.push(...list)

          const length = this.list.length
          this.finished = length >= total
          this.noData = length === 0

          if (this.noData) {
            this.finishedText = ''
          }
        })
        .catch((err) => {
          console.error(err)

          this.error = true
          this.refreshing = false
          this.noData = false
          if (this.list.length === 0) {
            this.disabled = true
          }

          this.page = page
        })
        .finally(() => {
          this.loading = false
        })
    },
    onRefresh() {
      this.finished = false
      this.refreshing = true
      this.onLoad()
    },
    searchRefresh() {
      this.finished = false
      this.list = []
      this.page = 0
      this.onLoad()
    },
    tabOnload() {
      if (this.list.length === 0 && !this.noData) {
        this.onLoad()
      }
    },
    renderItem2() {
      return (
        <div>List-item</div>
      )
    }
  },
  render() {
    console.log(2222)
    const { noData, list, renderItem } = this
    return (
      <div>
        {noData ? <span class="label">空</span> : list.map((item) => renderItem(item))}
      </div>
    )
  },
  data() {
    return {
      list: [{}, {}],
      disabled: false,
      loading: false,
      finished: false,
      refreshing: false,
      error: false,
      noData: false,
      finishedText: '没有更多了',
      page: 0
    }
  }
}
</script>

<style lang="scss" scoped>
.c-list-group {
  min-height: 100%;
}
</style>
