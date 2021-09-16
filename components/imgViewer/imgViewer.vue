<template>
  <div>
    <viewer
      v-if="images && images.length"
      ref="viewer"
      :images="images"
      :options="options"
      class="viewer"
      @inited="inited"
    >
      <img
        v-for="source in images"
        :key="source"
        :src="source"
        :data-source="source"
        class="image"
        :data-index="index"
      />
    </viewer>
  </div>
</template>

<script>
export default {
  name: 'imgViewer',
  props: {
    index: {
      type: Number,
      default: 0
    },
    images: {
      type: [Array],
      default() {
        return []
      }
    }
  },
  data() {
    return {
      options: {
        url: 'data-source'
      },
      dataIndex: 0,
      $viewer: null
    }
  },
  watch: {
    index(newIndex) {
      this.dataIndex = newIndex
    }
  },
  created() {
    this.dataIndex = this.index
  },
  methods: {
    inited(viewer) {
      this.$viewer = viewer
    },
    show() {
      if (this.images.length > 0) {
        if (this.$viewer) {
          this.$viewer.view(this.dataIndex)
        } else {
          setTimeout(() => {
            this.$viewer.view(this.dataIndex)
          }, 200)
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.image {
  display: none;
}
</style>
<style>
.viewer-loading > img {
  display: none; /* hide big images when it is loading */
}
</style>
