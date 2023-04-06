<template>
  <div class="base-table-work">
      <BaseTable
        :name="name"
        :show-loading="showLoading"
        :data.sync="data"
        :columns="columns"
        :max-height="maxHeight"
        :is-header="isHeader"
        @selection-change="handleSelectionChange"
      >
        <!-- 自定义表格 header 默认 添加按钮及事件 -->
        <template #table-header>
          <div class="table-header">
            <slot name="table-header">
              <div class="header-left">
                <slot name="header-operate-left">
                  <el-button
                    icon="el-icon-plus"
                    type="primary"
                    @click="handleAdd"
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
// 业务表格
export default {
  name: 'BaseTableWork',
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
    // 是否显示序号
    isTableSerial: {
      type: Boolean,
      default: true,
    },
    // 是否表格选择
    isTableSelect: {
      type: Boolean,
      default: false,
    },
    // 表格最大高度
    maxHeight: {
      type: [String, Number],
      default: 500,
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
    // 是否显示 loading
    showLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
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
    handleAdd() {
      // 新增 按钮
      this.$emit('add')
    },
    handleSelectionChange(val) {
      // 表格 checkbox 多选
      this.$emit('selection-change', val)
    },
  },
}
</script>

<style lang="scss" scoped>
.base-table-work {
  .ft-red {
    color: red;
  }
  .table-header {
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
