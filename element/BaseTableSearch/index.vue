<template>
  <div class="base-table-search">
    <BaseTable
      :name="name"
      :show-loading="showLoading"
      :data.sync="data"
      :columns="columns"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      :max-height="maxHeight"
      :is-page="isPage"
      :is-header="isHeader"
      @selection-change="handleSelectionChange"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
      <!-- 自定义表格 header 默认 添加按钮及事件 -->
      <template #table-header>
        <div class="table-header">
          <slot name="table-header">
            <div class="header-left">
              <slot name="header-operate-left">
                <el-button icon="el-icon-plus" type="primary" @click="handleAdd"
                  >添加</el-button
                >
              </slot>
            </div>
            <div class="header-right">
              <slot name="header-operate-right"></slot>
            </div>
          </slot>
        </div>
      </template>
      <!-- 自定义表格内容 -->
      <template #table-body>
        <el-table-column
          v-if="isTableSelect"
          type="selection"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column
          v-if="isTableSerial"
          type="index"
          label="序号"
          width="50"
          align="center"
        />
        <el-table-column
          v-for="(item, index) in columns"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :align="item.align || 'center'"
          :fixed="item.fixed"
          show-overflow-tooltip
        >
          <template #header="{ row, column, $index }">
            <!-- 自定义表头 -->
            <template v-if="item.slotHeader">
              <slot
                :name="`${item.prop}-tb-header`"
                :row="row"
                :column="column"
                :index="$index"
                :config="item"
              />
            </template>
            <!-- 是否表头带星 -->
            <template v-else>
              <span v-if="item.required" class="ft-red">*</span>
              {{ item.label }}
            </template>
          </template>
          <template #default="{ row, column, $index }">
            <!-- 自定义单元格内容 -->
            <template v-if="item.slot">
              <slot
                :name="item.prop"
                :row="row"
                :column="column"
                :index="$index"
                :config="item"
              />
            </template>
            <template v-else>
              <!-- 格式化 值 -->
              <span v-if="item.format && typeof item.format === 'function'">
                {{ item.format(row[item.prop]) }}
              </span>
              <!-- 常规 -->
              <span v-else>
                {{ row[item.prop] }}
              </span>
            </template>
          </template>
        </el-table-column>
      </template>
    </BaseTable>
  </div>
</template>

<script>
// 查询表格
export default {
  name: 'BaseTableSearch',
  components: {
    TaskView,
  },
  props: {
    // 表格名字
    name: {
      type: String,
      default: '',
    },
    // 是否显示 header
    isHeader: {
      type: Boolean,
      default: true,
    },
    // 是否显示序号
    isTableSerial: {
      type: Boolean,
      default: true,
    },
    // 是否显示表格选择列
    isTableSelect: {
      type: Boolean,
      default: false,
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
    // 表格列 配置数据
    columns: {
      type: Array,
      default: () => [],
      required: true
    },
    // 是否显示 loading
    showLoading: {
      type: Boolean,
      default: false,
    },
    // 是否分页
    isPage: {
      type: Boolean,
      default: true,
    },
    // 分页总数
    total: {
      type: Number,
      default: 0,
    },
    // 当前页
    currentPage: {
      type: Number,
      default: 1,
    },
    // 每页条数
    pageSize: {
      type: Number,
      default: 30,
    },
  },
  data() {
    return {
      maxTableHeight: this.maxHeight,
      finallyData: this.data,
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
    // 表格 checkbox 多选 change
    handleSelectionChange(val) {
      this.$emit('selection-change', val)
    },
    // 新增 按钮
    handleAdd() {
      this.$emit('add')
    },
  },
}
</script>

<style lang="scss" scoped>
.table-setting {
  .action-panel {
    margin-bottom: 0;
  }
}
</style>
