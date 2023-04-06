<template>
  <div class="base-table">
    <div class="table-wrapper">
      <!-- 自定义 header 内容 -->
      <div v-if="isHeader" class="table-header-wrapper">
        <slot name="table-header"></slot>
      </div>
      <el-table
        ref="table"
        v-loading="showLoading"
        :data="data"
        :border="border"
        :size="size"
        :max-height="maxHeight"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <!-- 自定义表格内容 -->
        <slot name="table-body"></slot>
      </el-table>
    </div>
    <!-- 是否分页 -->
    <div v-if="isPage" class="table-page">
      <el-pagination
        :layout="layout"
        :total="total"
        :background="background"
        :small="small"
        :page-sizes="pageSizes"
        :current-page="currentPage"
        :page-size="pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
// 基础表格 带分页
export default {
  name: 'BaseTable',
  props: {
    // 表格名字
    name: {
      type: String,
      default: 'table',
    },
    // 是否显示表格头部
    isHeader: {
      type: Boolean,
      default: false,
    },
    // 是否需要表格边框
    border: {
      type: Boolean,
      default: true,
    },
    // 表格最大高度
    maxHeight: {
      type: [String, Number],
      default: 500,
    },
    // 表格大小
    size: {
      type: String,
      default: 'mini',
    },
    // 表格数据
    data: {
      type: Array,
      default: () => [],
      required: true
    },
    // 表格列
    columns: {
      type: Array,
      default: () => [],
      required: true
    },
    showLoading: {
      type: Boolean,
      default: false,
    },
    // 是否分页
    isPage: {
      type: Boolean,
      default: false,
    },
    // 分页总数
    total: {
      type: Number,
      default: 0,
    },
    // 分页布局
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper',
    },
    // 是否给分页按钮添加背景色
    background: {
      type: Boolean,
      default: true,
    },
    // 是否使用小型分页
    small: {
      type: Boolean,
      default: false,
    },
    // 每页显示个数
    pageSizes: {
      type: Array,
      default: () => [10, 20, 30, 40, 50, 100],
    },
    // 当前页
    currentPage: {
      type: Number,
      default: 1,
    },
    // 每页条数
    pageSize: {
      type: Number,
      default: 10,
    },
  },
  data() {
    return {
      finallyData: this.data,
      finallyColumns: this.columns,
    }
  },
  watch: {
    finallyData: {
      handler(val) {
        this.$emit('update:data', val)
      },
      deep: true,
    },
  },
  created() {},
  mounted() {},
  methods: {
    // 每页条数 change
    handleSizeChange(size) {
      this.$emit('size-change', size)
    },
    // 当前页数 change
    handleCurrentChange(page) {
      this.$emit('current-change', page)
    },
    // 表格 checkbox 多选
    handleSelectionChange(val) {
      this.$emit('selection-change', val)
    },
  },
}
</script>

<style lang="scss" scoped>
.base-table {
  .ft-red {
    color: red;
  }
  .table-page {
    text-align: center;
  }
  .table-header {
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .table-setting {
      .action-panel {
        margin-bottom: 0;
      }
    }
  }
}
</style>
