<template>
  <div class="base-form-search">
    <el-form
      ref="baseFormSearch"
      :model="finallyFormData"
      :label-width="labelWidth"
      :label-position="labelPosition"
      :inline="inline"
    >
      <el-row :gutter="15" class="form-wrapper">
        <template v-for="(item, index) in config">
          <!-- handleShow 方法处理表单item 是否显示 -->
          <el-col v-if="handleShow(item, index)" :key="item.prop" :span="6">
            <!-- 自定义列 -->
            <template v-if="item.slot">
              <slot :name="item.prop" :index="index" :config="item" />
            </template>
            <el-form-item v-else :label="item.label" :prop="item.prop">
              <!-- 文本框 -->
              <el-input
                v-if="item.type === 'input'"
                v-model="finallyFormData[item.prop]"
                :clearable="item.clearable || true"
                :placeholder="item.placeholder || '请输入'"
                :disabled="item.disabled"
              ></el-input>
              <!-- 数字框 -->
              <el-input-number
                v-if="item.type === 'number'"
                v-model="finallyFormData[item.prop]"
                :placeholder="item.placeholder || '请输入'"
                :controls="false"
                style="width: 100%"
                class="num-item"
                :precision="item.precision || 0"
              />
              <!-- 文本框 -->
              <el-input
                v-if="item.type === 'textarea'"
                v-model="finallyFormData[item.prop]"
                type="textarea"
                :rows="item.rows || 2"
                :clearable="item.clearable || true"
                :placeholder="item.placeholder || '请输入'"
                :disabled="item.disabled"
              ></el-input>
              <!-- 单日期框 -->
              <el-date-picker
                v-if="item.type === 'date'"
                v-model="finallyFormData[item.prop]"
                style="width: 100%"
                type="date"
                :placeholder="item.placeholder || '请选择'"
                :clearable="item.clearable || true"
                :disabled="item.disabled"
              ></el-date-picker>
              <!-- 多日期框 -->
              <el-date-picker
                v-if="item.type === 'dateRange'"
                v-model="finallyFormData[item.prop]"
                style="width: 100%"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :clearable="item.clearable || true"
                :disabled="item.disabled"
              ></el-date-picker>
              <!-- 选择框 -->
              <el-select
                v-if="item.type === 'select'"
                v-model="finallyFormData[item.prop]"
                style="width: 100%"
                :clearable="item.clearable || true"
                :placeholder="item.placeholder || '请输入'"
                :multiple="item.multiple || true"
              >
                <!-- props 可根据自身数据 指定参数值 { id: 'value', name: 'text'} -->
                <el-option
                  v-for="subItem in item.options"
                  :key="
                    item.props && Object.keys(item.props).length
                      ? subItem[item.props.id]
                      : subItem.id
                  "
                  :label="
                    item.props && Object.keys(item.props).length
                      ? subItem[item.props.name]
                      : subItem.name
                  "
                  :value="
                    item.props && Object.keys(item.props).length
                      ? subItem[item.props.id]
                      : subItem.id
                  "
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </template>
        <!-- 是否显示查询内容 -->
        <div v-if="isSearch" class="search-btn">
          <el-button
            icon="el-icon-search"
            size="mini"
            type="primary"
            @click="handleSearch"
            >查询</el-button
          >
          <el-button
            icon="el-icon-refresh-left"
            type="default"
            size="mini"
            @click="handleResetSearch"
            >重置</el-button
          >
          <el-button
            v-if="!isExpand"
            type="text"
            @click="handleToggleSearchForm"
          >
            展开
            <i class="el-icon-arrow-down el-icon--left"></i>
          </el-button>
          <el-button
            v-else-if="isExpand"
            type="text"
            @click="handleToggleSearchForm"
          >
            收起
            <i class="el-icon-arrow-up el-icon--left"></i>
          </el-button>
        </div>
      </el-row>
      <slot></slot>
    </el-form>
  </div>
</template>

<script>
// 查询表单
export default {
  name: 'BaseFormSearch',
  props: {
    // label 位置  left right top
    labelPosition: {
      type: String,
      default: 'left',
    },
    // lable 宽度
    labelWidth: {
      type: String,
      default: '100px',
    },
    // 是否行内表单模式
    inline: {
      type: Boolean,
      default: false,
    },
    // 表单 数据
    data: {
      type: Object,
      default: () => {},
      required: true,
    },
    // 表单配置
    config: {
      type: Array,
      default: () => [],
      required: true,
    },
    // 是否需要查询
    isSearch: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isExpand: false, // 是否展开
    }
  },
  computed: {
    finallyFormData() {
      return this.data
    },
  },
  created() {},
  mounted() {},
  methods: {
    // 查询
    handleSearch() {
      this.$emit('search')
    },
    // 重置
    handleResetSearch() {
      this.$emit('reset')
    },
    // 展开 收起
    handleToggleSearchForm() {
      this.isExpand = !this.isExpand
    },
    // 是否显示列
    handleShow(item, index) {
      const isShowItem = item.hidden || false // hidden根据表单配置数据
      return !isShowItem || (isShowItem && this.isExpand)
    },
  },
}
</script>

<style lang="scss" scoped>
.base-form-search {
  .form-wrapper {
    display: flex;
    flex-flow: row wrap;
    .search-btn {
      flex: 1;
      text-align: right;
    }
  }
}
</style>
