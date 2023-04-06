<template>
  <div class="base-form">
    <!-- 是否显示 header -->
    <el-page-header v-if="isHeader" class="page-header" @back="goBack">
      <template #content>
        <div class="header-content">
          <div class="header-title">{{ headerConfig.title }}</div>
          <div class="header-btn">
            <!-- 自定义 header 右侧部分内容-->
            <slot name="header-operate-right"></slot>
          </div>
        </div>
      </template>
    </el-page-header>
    <el-form
      ref="baseForm"
      :model="finallyFormData"
      :label-width="labelWidth"
      :label-position="labelPosition"
      :inline="inline"
    >
      <el-row :gutter="15" class="form-wrapper">
        <template v-for="(item, index) in config">
          <!-- handleShow 方法处理表单item 是否显示  handleCalcColSpan 方法处理不同表单类型显示span值 -->
          <el-col
            v-if="handleShow(item, index)"
            :key="item.prop"
            :span="handleCalcColSpan(item)"
          >
            <!-- 自定义列 -->
            <template v-if="item.slot">
              <slot :name="item.prop" :index="index" :config="item" />
            </template>
            <el-form-item
              v-else
              :label="item.label"
              :prop="item.prop"
              :rules="rules && rules[item.prop] ? rules[item.prop] : null"
            >
              <template v-if="pageType !== PageTypeEnums.detail">
                <!-- 文本框 -->
                <el-input
                  v-if="item.type === 'input'"
                  v-model="finallyFormData[item.prop]"
                  :clearable="item.clearable || true"
                  :placeholder="item.placeholder || '请输入'"
                  :disabled="item.disabled"
                  @change="
                    val => {
                      typeof item.change === 'function' &&
                        item.change(val, item.prop)
                    }
                  "
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
                  @change="
                    val => {
                      typeof item.change === 'function' &&
                        item.change(val, item.prop)
                    }
                  "
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
                  @change="
                    val => {
                      typeof item.change === 'function' &&
                        item.change(val, item.prop)
                    }
                  "
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
                  :multiple="item.multiple"
                  @change="
                    val => {
                      typeof item.change === 'function' &&
                        item.change(val, item.prop)
                    }
                  "
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
              </template>
              <template v-else>
                <!-- 格式化内容 -->
                <span v-if="typeof item.format === 'function'">
                  {{ item.format(finallyFormData[item.prop]) }}
                </span>
                <span v-else>{{ finallyFormData[item.prop] }}</span>
              </template>
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
// 表单类型
const formTypes = ['textarea']

// 页面类型
const PageTypeEnums = {
  add: 1,
  edit: 2,
  detail: 3,
}

/* 直接使用 BaseFormSearch BaseFormWork组件即可，当前组件可弃用！！！ */
export default {
  name: 'BaseForm',
  props: {
    // 是否显示头部
    isHeader: {
      type: Boolean,
      default: false,
    },
    // 头部配置 { backRouterName：'list', title: '新增/编辑'}
    headerConfig: {
      type: Object,
      default: () => {},
    },
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
      required: true
    },
    // 验证规则
    rules: {
      type: Object,
      default: () => {},
    },
    // 表单配置
    config: {
      type: Array,
      default: () => [],
      required: true
    },
    // 是否需要查询
    isSearch: {
      type: Boolean,
      default: false,
    },
    // 页面类型
    pageType: {
      type: Number,
      default: 1, // 新增
    },
  },
  data() {
    return {
      PageTypeEnums,
      isExpand: false,
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
    // 计算一列长度
    handleCalcColSpan(item) {
      let span = 6
      if (item.span) {
        span = item.span
      } else if (formTypes.includes(item.type)) {
        // 指定某些类型
        span = 24
      }
      return span
    },
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
      const isShowItem = item.hidden || false
      if (!this.isSearch) {
        return true
      } else if (item.flag !== undefined && item.flag !== null) {
        // 逻辑判断
        return item.flag
      } else {
        // 判断是否设置隐藏列  (未设置 直接 true) 或者 (已设置 并且 展开为 true)
        return !isShowItem || (isShowItem && this.isExpand)
      }
    },
    // 返回上一页
    goBack() {
      this.$router.push({ name: this.headerConfig.backRouterName })
    },
  },
}
</script>

<style lang="scss" scoped>
.base-form {
  .page-header {
    width: 100%;
    display: flex;
    justify-items: center;
    align-items: center;
    :deep(.el-page-header__content) {
      flex: 1;
    }
    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
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
