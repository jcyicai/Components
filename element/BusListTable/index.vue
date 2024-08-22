<template>
  <div class="vxe-table-container">
    <vxe-toolbar ref="xToolbar">
      <template #buttons>
        <slot name="toolbar-left">
          <el-button icon="el-icon-plus" type="primary" @click="handleAdd">添加</el-button>
        </slot>
      </template>
      <template #tools>
        <button
          v-if="showOptionExpandBtn"
          class="vxe-button type--button is--circle"
          type="button"
          title="显示子表"
          @click="handleExpandChildClick"
        >
          <i :class="btnExpandIconName"></i>
        </button>
        <el-popover v-model="popoverVisible" class="mg-l-12" popper-class="vxe-table-option-box" trigger="manual">
          <template #reference>
            <button
              slot="reference"
              class="vxe-button type--button is--circle"
              type="button"
              title="表格设置"
              @click="popoverVisible = !popoverVisible"
            >
              <i class="vxe-icon-custom-column"></i>
            </button>
          </template>
          <div class="table-custom-box">
            <div class="custom-title">
              <div class="title">
                表头设置
                <span class="tip">(拖拽调整顺序)</span>
              </div>
            </div>
            <el-row :gutter="5" type="flex" align="middle" class="custom-check-header">
              <el-col :span="11" type="flex" align="left">
                <span>列名</span>
              </el-col>
              <el-col :span="4" type="flex" align="left">
                <span>列宽</span>
              </el-col>
              <el-col :span="6" type="flex" align="left">
                <span>列固定</span>
              </el-col>
              <el-col :span="3" type="flex" align="left">
                <span>列色</span>
              </el-col>
            </el-row>
            <el-checkbox-group v-model="initChecks" class="custom-check-main" @change="handleTableOptionChange">
              <vab-draggable v-model="initColumns" v-bind="dragOptions" @end="handleTableOptionChange">
                <el-row
                  v-for="(item, index) in initColumns"
                  :key="index"
                  :gutter="5"
                  type="flex"
                  align="middle"
                  class="check-item"
                >
                  <el-col :span="11" type="flex" align="left">
                    <el-checkbox :key="index" :title="item.label" :label="item[tableOptionCheckProp]">
                      {{ item.label }}
                    </el-checkbox>
                  </el-col>
                  <el-col :span="4" type="flex" align="left">
                    <el-input v-model="item.width" placeholder="宽度" size="mini" @blur="handleTableOptionChange" />
                  </el-col>
                  <el-col :span="6" type="flex" align="left">
                    <el-select v-model="item.fixed" placeholder="请选择" size="mini" @change="handleTableOptionChange">
                      <el-option key="left" label="固定左侧" value="left"></el-option>
                      <el-option key="right" label="固定右侧" value="right"></el-option>
                      <el-option key="auto" label="不固定" :value="undefined"></el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="3" type="flex" align="center">
                    <el-color-picker
                      v-model="item.color"
                      style="width: 100%"
                      @change="handleTableOptionChange"
                    ></el-color-picker>
                  </el-col>
                </el-row>
              </vab-draggable>
            </el-checkbox-group>
            <el-row :gutter="5" class="custom-footer">
              <el-col :span="24" type="flex" align="right">
                <el-button
                  :loading="saveLoading"
                  icon="el-icon-check"
                  type="primary"
                  size="mini"
                  @click="handleTableOptionSave"
                >
                  保存
                </el-button>
                <el-button
                  :loading="saveLoading"
                  icon="el-icon-refresh-left"
                  type="warning"
                  size="mini"
                  @click="handleTableOptionReset"
                >
                  重置
                </el-button>
                <el-button icon="el-icon-close" type="default" size="mini" @click="popoverVisible = false">
                  取消
                </el-button>
              </el-col>
            </el-row>
          </div>
        </el-popover>
      </template>
    </vxe-toolbar>

    <vxe-table
      ref="xTable"
      border
      empty-text="暂无数据"
      :loading="loading"
      show-overflow
      auto-resize
      sync-resize
      :data="data"
      size="small"
      v-bind="$attrs"
      :cell-style="handleSetTableCellStyle"
      :column-config="{ resizable: true }"
      :show-footer="showFooter"
      :footer-method="handleFooterCalc"
      :expand-config="expandConfig"
      v-on="$listeners"
      @resizable-change="handleResizableChange"
      @checkbox-change="handleSelectionChange"
      @checkbox-all="handleSelectionChange"
    >
      <!--  :scroll-x="{ enabled: false }"
      :scroll-y="{ enabled: true }" -->
      <slot name="custom-checkbox">
        <vxe-column
          v-if="showSelect"
          type="checkbox"
          align="center"
          width="50"
          :fixed="showExpand ? undefined : 'left'"
        ></vxe-column>
      </slot>
      <slot name="seq">
        <vxe-column
          v-if="showSerial"
          type="seq"
          align="center"
          title="序号"
          width="50"
          :fixed="showExpand ? undefined : 'left'"
        ></vxe-column>
      </slot>
      <vxe-column v-if="showExpand" type="expand" width="50" align="center">
        <template #content="{ row, rowIndex }">
          <slot name="expand-content" :row="row" :rowIndex="rowIndex"></slot>
        </template>
      </vxe-column>

      <template v-for="(item, index) in finallyColumns">
        <template v-if="item.children && item.children.length > 0">
          <ChildrenColumn
            :key="`${item.prop}${index}`"
            :current-column="item"
            :columns="item.children"
          ></ChildrenColumn>
        </template>
        <template v-else>
          <!-- key不能设置 prop 否则 排序更新 column 无法生效 -->
          <vxe-column
            :key="`${item.prop}${index}`"
            :field="item.prop"
            :title="item.label"
            :width="item.width"
            min-width="100"
            :fixed="showExpand ? undefined : item.fixed"
            :type="item.type"
            :align="item.align || 'center'"
          >
            <template #header="scope">
              <template v-if="item.headerSlot">
                <slot
                  :name="`${item.prop}-header`"
                  :column="scope.column"
                  :columnIndex="scope.columnIndex"
                  :rowIndex="scope.$rowIndex"
                  :item="item"
                  :scope="scope"
                />
              </template>
              <template v-else-if="item.isRequired">
                <span>
                  <i style="color: red; font-style: normal">*</i>
                  {{ item.label }}
                </span>
              </template>
              <template v-else>
                <span>{{ item.label }}</span>
              </template>
            </template>
            <template #default="scope">
              <template v-if="item.slot">
                <slot
                  :name="item.prop"
                  :row="scope.row"
                  :column="scope.column"
                  :columnIndex="scope.columnIndex"
                  :rowIndex="scope.rowIndex"
                  :item="item"
                  :scope="scope"
                />
              </template>
              <template v-else>
                <!-- 格式化内容 -->
                <span v-if="item.format && Object.keys(item.format).length">
                  {{ formatValue(scope.row[item.prop], item.format) }}
                </span>
                <!-- 常规 -->
                <span v-else>
                  {{ scope.row[item.prop] }}
                </span>
              </template>
            </template>
          </vxe-column>
        </template>
      </template>

      <!--行操作栏-->
      <vxe-column
        v-if="showOperate"
        align="center"
        title="操作"
        field="operate"
        width="160"
        :fixed="showExpand ? undefined : 'right'"
      >
        <template #default="{ row }">
          <slot name="operate" :row="row"></slot>
        </template>
      </vxe-column>
    </vxe-table>
    <!-- 分页 -->
    <el-pagination
      v-if="showPage"
      :current-page="currentPage"
      layout="total, sizes, prev, pager, next, jumper"
      :page-size="pageSize"
      :total="total"
      background
      :page-sizes="[10, 20, 30, 40, 50, 100, 500]"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script>
  import VabDraggable from 'vuedraggable'
  import { getTableSettings, saveTableSettings } from '@/api/setting/settings'
  import ChildrenColumn from './components/ChildrenColumn.vue'

  export default {
    name: 'BusListTable',
    components: {
      TaskView,
      VabDraggable,
      ChildrenColumn,
    },
    props: {
      // 表格名字
      name: {
        type: String,
        default: '',
        required: true,
      },
      // 数据
      data: {
        type: Array,
        default: () => [],
        required: true,
      },
      // 表格 列数据
      columns: {
        type: Array,
        default: () => [],
        required: true,
      },
      // 表格 选中列
      checks: {
        type: Array,
        default: () => [],
        required: true,
      },
      // 表格 loading
      loading: {
        type: Boolean,
        default: false,
      },
      // 是否显示序号
      showSerial: {
        type: Boolean,
        default: true,
      },
      // 是否表格选择
      showSelect: {
        type: Boolean,
        default: false,
      },
      // 是否分页
      showPage: {
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
        default: 10,
      },
      // 底部栏是否显示  显示 totalColumns为必填项！
      showFooter: {
        type: Boolean,
        default: false,
      },
      // 是否显示操作列
      showOperate: {
        type: Boolean,
        default: true,
      },
      // 所有数据 总和 用于底部合计 showFooter使用
      totalData: {
        type: Object,
        default: () => {},
      },
      // 底部合计 是否显示 查询合计 即 所有数据 总合计  显示 totalData 为必填项！
      showFooterAllTotal: {
        type: Boolean,
        default: false,
      },
      // 需要合计的列
      totalColumns: {
        type: Array,
        default: () => [],
      },
      // 表格配置 checkbox 依据哪个属性  label 或 prop 等
      tableOptionCheckProp: {
        type: String,
        default: 'label',
      },
      // 表格配置 显示子表
      showOptionExpandBtn: {
        type: Boolean,
        default: false,
      },
      // 展开配置 lazy loadMethod height
      expandConfig: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        showExpand: false, // 是否显示子表
        btnExpandIconName: 'vxe-icon-arrow-right', // 显示子表 按钮图标
        saveLoading: false,
        popoverVisible: false, // 表格配置弹窗显示
        initColumns: this.columns, // 初始化 columns
        initChecks: this.checks, // 初始化 checks
        dragOptions: {
          // 表格配置 拖拽配置
          animation: 500,
          group: 'checkColumn',
        },
      }
    },
    computed: {
      finallyColumns() {
        const columns = this.initColumns.filter((item) =>
          this.initChecks.length ? this.initChecks.includes(item[this.tableOptionCheckProp]) : item.label
        )
        return columns
      },
    },
    created() {
      this.$nextTick(() => {
        // 手动将表格和工具栏进行关联
        if (this.$refs.xTable) {
          this.$refs.xTable.connect(this.$refs.xToolbar)
        }
      })
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.getTableOption() // 表格配置
      },
      // 获取表格配置 columns checks
      getTableConfig() {
        return {
          columns: this.finallyColumns,
          checks: this.initChecks,
        }
      },
      // 新增 按钮
      handleAdd() {
        this.$emit('add')
      },
      // 表格配置 变更
      handleTableOptionChange() {
        this.$nextTick(() => {
          if (this.$refs.xTable) {
            this.$refs.xTable.refreshColumn()
          }
        })
      },
      // 每页条数 change
      handleSizeChange(size) {
        this.$emit('size-change', size)
      },
      // 当前页数 change
      handleCurrentChange(page) {
        this.$emit('current-change', page)
      },
      // 表格 checkbox 多选
      handleSelectionChange() {
        const allCheckedData = this.$refs.xTable.getCheckboxRecords()
        this.$emit('selection-change', allCheckedData)
      },
      // 任务刷新
      handleTaskRefresh() {
        this.$emit('task-refresh')
      },
      // 表格 宽度调整
      handleResizableChange(params) {
        //$rowIndex, column, columnIndex, $columnIndex, $event
        this.initColumns.forEach((item) => {
          if (item.prop === params.column.property) {
            item.width = params.resizeWidth
          }
        })
      },
      // 表格单元格样式
      handleSetTableCellStyle({ column }) {
        const curColumnIndex = this.initColumns.findIndex((item) => item.prop === column.property)
        let curColumnItem = {}
        if (curColumnIndex > -1) {
          curColumnItem = this.initColumns[curColumnIndex]
        }
        if (curColumnItem.color) {
          return {
            background: curColumnItem.color,
          }
        }
      },
      // 累加值
      getSumNum(data, column) {
        let count = 0
        let flag = false
        data.forEach((item) => {
          const value = Number(item[column.property])
          if (!isNaN(value)) {
            count += item[column.property]
            flag = true
          }
        })
        return flag ? count : ''
      },
      // 所有数据累加值
      getSumAllNum(column) {
        return this.totalData[column.property]
      },
      // 底部栏计算
      handleFooterCalc(params) {
        const { columns, data } = params
        const totalRowData = []
        const allTotalRowData = []

        columns.forEach((column, columnIndex) => {
          if (columnIndex === 0) {
            totalRowData.push('合计')
            allTotalRowData.push('总和')
          } else {
            let currentMergeCell = null
            let allMergeCell = null
            if (this.totalColumns.includes(column.property)) {
              // 查找当前 column format
              const curColumnItem = this.initColumns.find((item) => item.prop === column.property)
              // 累加当前行
              const sumNum = this.getSumNum(data, column)
              currentMergeCell =
                sumNum || sumNum === 0
                  ? `${curColumnItem?.format?.prefix || ''}${this.$baseNumFormat(
                      sumNum,
                      curColumnItem?.format?.digits || 2,
                      curColumnItem?.format?.numType || 's',
                      curColumnItem?.format?.zeroFill
                    )}`
                  : ''
              // 所有数据总和
              if (this.showFooterAllTotal) {
                const sumAllNum = this.getSumAllNum(column)
                allMergeCell =
                  sumAllNum || sumAllNum === 0
                    ? `${curColumnItem?.format?.prefix || ''}${this.$baseNumFormat(
                        sumAllNum,
                        curColumnItem?.format?.digits || 2,
                        curColumnItem?.format?.numType || 's',
                        curColumnItem?.format?.zeroFill
                      )}`
                    : ''
              }
            }
            totalRowData.push(currentMergeCell)
            if (this.showFooterAllTotal) {
              allTotalRowData.push(allMergeCell)
            }
          }
        })
        return this.showFooterAllTotal ? [totalRowData, allTotalRowData] : [totalRowData]
      },
      // 格式化列内容
      formatValue(val, format) {
        // 1 日期  2 数字
        let value = null
        if (format.type === 'date') {
          // 日期
          value = this.$baseDateFormat(val)
        } else if (format.type === 'number') {
          // 数字
          value = `${
            val || val === 0
              ? `${format.prefix || ''}${this.$baseNumFormat(
                  val,
                  format.digits || 2,
                  format.numType || 's',
                  format.zeroFill
                )}${format.suffix || ''}`
              : ''
          }`
        }
        return value
      },
      // 获取表格配置数据
      async getTableOption() {
        const params = {
          tableName: this.name,
        }
        const { data } = await getTableSettings(params)
        const result = JSON.parse(data) || null
        this.initColumns = result?.columns || this.columns
        this.initChecks = result?.checks || this.checks

        this.handleTableOptionChange() // 刷新表格 columns
      },
      // 表格配置 保存
      async handleTableOptionSave() {
        this.saveLoading = true

        const params = {
          tableName: this.name,
          settings: JSON.stringify({
            columns: this.initColumns,
            checks: this.initChecks,
          }),
        }

        const res = await saveTableSettings(params).catch(() => {
          this.saveLoading = false
        })

        this.saveLoading = false
        this.popoverVisible = false
      },
      // 表格配置 重置
      handleTableOptionReset() {
        this.initColumns = this.columns
        this.initChecks = this.checks
        this.handleTableOptionSave() // 重置 调取接口 保存原始值
        this.handleTableOptionChange() // 刷新表格 columns
      },
      // 关闭弹窗
      handleClose() {
        this.popoverVisible = false
      },
      // 是否显示子表 点击
      handleExpandChildClick() {
        this.showExpand = !this.showExpand
        this.btnExpandIconName = this.showExpand ? 'vxe-icon-arrow-down' : 'vxe-icon-arrow-right'
        this.handleTableOptionChange()
        this.$emit('show-expand-change', this.showExpand) // 获取是否显示子表状态 boolean
      },
      refreshColumn() {
        this.$refs['xTable'].refreshColumn()
      },
    },
  }
</script>

<style lang="scss" scoped>
  .table-custom-box {
    width: 450px;
    .custom-title {
      margin-bottom: 4px;
      .title {
        font-size: $base-font-size-default;
        font-weight: bold;
      }
      .tip {
        font-size: $base-font-size-small;
        color: $base-color-yellow;
      }
    }
    .custom-check-main {
      max-height: 254px;
      overflow-y: auto;
      margin: 8px 0 14px 0;
      .check-item {
        margin-top: 4px;
        &:first-child {
          margin-top: 0;
        }
      }
      :deep(.el-checkbox__label) {
        width: 176px;
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        vertical-align: -5px;
      }
    }
    .custom-footer {
      padding: 0 14px;
      font-size: $base-font-size-small;
    }
  }

  :deep(.vxe-footer--column) {
    background-color: #f5f7fa !important;
    background-repeat: no-repeat;
    background-size: 1px 100%, 100% 1px;
    background-position: 100% 0, 100% 100%;
  }
  :deep(.vxe-header--column) {
    background-color: #f5f7fa !important;
    background-repeat: no-repeat;
    background-size: 1px 100%, 100% 1px;
    background-position: 100% 0, 100% 100%;
  }

  .mg-l-12 {
    margin-left: 12px;
  }

  // 添加 checkbox 禁用时 背景色 原 无背景色
  :deep(.vxe-cell--checkbox.is--disabled > .vxe-checkbox--icon) {
    background: #eee;
    border-radius: 3px;
  }

  // 数值靠右 导致无法居中
  :deep(.vxe-header--column .vxe-cell) {
    text-align: center !important;
  }
</style>
