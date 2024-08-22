<template>
  <div class="table-operate-container">
    <slot name="table-operate-button">
      <slot name="operate-left">
        <el-button class="pr-10" icon="el-icon-document" type="text" @click="handleToDetail">
          查看
        </el-button>
      </slot>
      <el-dropdown v-more class="more-btn" @command="(command) => handleCommand(command)">
        <el-button type="text">
          更多
          <i class="el-icon-arrow-down el-icon--left"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <slot></slot>
        </el-dropdown-menu>
      </el-dropdown>
    </slot>
  </div>
</template>

<script>
  export default {
    name: 'TableOperateColumn',
    components: {},
    props: {},
    data() {
      return {}
    },
    created() {},
    mounted() {},
    methods: {
      // 查看详情
      handleToDetail() {
        this.$emit('view')
      },
      // 更多操作
      handleCommand(command) {
        this.$emit('command', command)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .el-divider--vertical {
    vertical-align: -3px;
  }
  .pr-10 {
    padding-right: 10px;
  }
</style>
