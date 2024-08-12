<template>
  <div class="base-form-container">
    <el-form
      ref="form"
      v-loading="loading"
      :validate-on-rule-change="false"
      :model="finallyFormData"
      :rules="mergedRules"
      :label-width="labelWidth"
    >
      <el-row :gutter="15">
        <template v-for="(field, index) in finallyFields">
          <el-col v-if="showField(index)" :key="field.prop" :span="getColSpan(field, index)">
            <!-- 表单 slot -->
            <template v-if="field.formItemSlot">
              <slot :name="field.prop" :field="field" :index="index"></slot>
            </template>
            <el-form-item v-else :label="field.label" :prop="field.prop">
              <!-- 组件 slot -->
              <template v-if="field.slot">
                <slot :name="field.prop" :field="field" :index="index"></slot>
              </template>
              <template v-else-if="field.type === 'customSelect' || field.component === 'customSelect'">
                <win-input-button
                  v-model="finallyFormData[field.prop]"
                  :type="field.attrs.type"
                  simplfy
                  v-bind="getComponentAttrs(field)"
                  :disabled="getFieldDisabled(field, index)"
                  v-on="getComponentListeners(field, index)"
                />
              </template>
              <template v-else-if="field.type === 'input-number' || field.component === 'input-number'">
                <base-input-number
                  v-model="finallyFormData[field.prop]"
                  v-bind="getComponentAttrs(field)"
                  :disabled="getFieldDisabled(field, index)"
                  v-on="getComponentListeners(field, index)"
                ></base-input-number>
              </template>
              <template v-else>
                <component
                  :is="getComponentType(field)"
                  v-model="finallyFormData[field.prop]"
                  v-bind="getComponentAttrs(field)"
                  :disabled="getFieldDisabled(field, index)"
                  v-on="getComponentListeners(field, index)"
                >
                  <template v-if="field.type === 'select'">
                    <el-option
                      v-for="option in getOptions(field.options)"
                      :key="getOptionProp(option, field.optionProps, 'id')"
                      :label="getOptionProp(option, field.optionProps, 'name')"
                      :value="getOptionProp(option, field.optionProps, 'id')"
                    />
                  </template>
                </component>
              </template>
            </el-form-item>
          </el-col>
        </template>
        <el-col v-if="isSearch" :span="getSearchColSpan()" class="form-actions-col">
          <div class="form-actions">
            <el-button icon="el-icon-search" native-type="submit" size="mini" type="primary" @click="handleQuery">
              查询
            </el-button>
            <el-button icon="el-icon-refresh-left" native-type="submit" type="default" size="mini" @click="handleReset">
              重置
            </el-button>
            <el-button v-if="fields.length > 3" type="text" @click="toggleExpand">
              {{ isExpanded ? '收起' : '展开' }}
              <i :class="isExpanded ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
            </el-button>
          </div>
        </el-col>
      </el-row>
      <slot></slot>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'BaseForm',
    props: {
      value: {
        type: Object,
        default: () => {},
        required: true,
      },
      fields: {
        type: Array,
        default: () => [],
        required: true,
      },
      isSearch: {
        type: Boolean,
        default: false,
      },
      labelWidth: {
        type: String,
        default: '100px',
      },
      rules: {
        type: Object,
        default: () => {},
      },
      loading: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        isExpanded: false,
      }
    },
    computed: {
      finallyFormData: {
        get() {
          const val = this.value
          if (!(this.value && Object.keys(this.value).length)) {
            this.$emit('update:value', val)
          }
          return val
        },
        set(val) {
          this.$emit('update:value', val)
        },
      },
      finallyFields() {
        // 查询 且 展开状态 只显示 3个 否则显示所有
        const fields = this.fields.filter((field) => !field.hidden)
        return this.isSearch && !this.isExpanded ? fields.slice(0, 3) : fields
      },
      mergedRules() {
        const formRules = {}
        this.fields.forEach((field) => {
          if (field.rules) {
            formRules[field.prop] = field.rules //this.processRules(field.rules, field)
          }
        })
        return { ...this.rules, ...formRules }
      },
    },
    mounted() {},
    methods: {
      // 表单验证
      validate() {
        return new Promise((resolve, reject) => {
          this.$refs['form'].validate((valid) => {
            if (valid) {
              resolve(true)
            } else {
              resolve(false)
            }
          })
        })
      },
      // 清除验证
      clearValidate(field) {
        this.$refs['form'].clearValidate(field)
      },
      // 重置 慎重使用 必须每个都设置 prop 属性，否则执行完方法，手动来进行重置数据
      resetFields() {
        this.$refs['form'].resetFields()
      },
      // 字段显示
      showField(index) {
        if (this.isSearch) {
          return this.isExpanded || index < 3
        }

        return true
      },
      // 获取 col span
      getColSpan(field, index) {
        if (this.isSearch && index < 3) {
          return 6 // 当是搜索模式时，前三个字段各占 1/4
        }
        return field.colSpan || 6
      },
      // 获取 查询按钮 col span
      getSearchColSpan() {
        const visibleCount =
          this.isSearch && !this.isExpanded ? Math.min(3, this.finallyFields.length) : this.finallyFields.length

        // 每行最多 24 个 span, 计算按钮的 span
        const totalSpan = 24
        const occupiedSpan = this.finallyFields.slice(0, visibleCount).reduce((total, field) => {
          return total + (field.colSpan || 6)
        }, 0)

        // 剩余的 span 分配给按钮列，确保其在右侧显示
        const remainingSpan = totalSpan - (occupiedSpan % totalSpan)

        return remainingSpan > 0 ? remainingSpan : totalSpan
      },
      // 下拉 option 字段
      getOptionProp(option, optionProps, defaultProp) {
        if (optionProps && optionProps[defaultProp]) {
          return option[optionProps[defaultProp]]
        }
        return option[defaultProp]
      },
      getOptions(options) {
        return typeof options === 'function' ? options() : options
      },
      // 获取组件属性
      getComponentAttrs(field) {
        return { ...field.attrs, style: 'width: 100%' }
      },
      // 获取组件类型
      getComponentType(field) {
        return field.component || `el-${field.type}`
      },
      // 获取组件事件
      getComponentListeners(field, index) {
        const listeners = {}
        if (field.on) {
          Object.keys(field.on).forEach((event) => {
            listeners[event] = (...args) => {
              field.on[event](...args, { index, ...field })
            }
          })
        }
        return listeners
      },
      // 是否禁用
      getFieldDisabled(field, index) {
        if (typeof field.attrs.disabled === 'function') {
          return field.attrs.disabled({ index, ...field })
        }
        return field.attrs.disabled
      },
      processRules(rules, field) {
        return rules.map((rule) => {
          return rule
        })
      },
      // 查询
      handleQuery() {
        this.$emit('query')
      },
      // 重置
      handleReset() {
        this.$emit('reset')
      },
      // 展开收起
      toggleExpand() {
        this.isExpanded = !this.isExpanded
      },
    },
  }
</script>

<style lang="scss" scoped>
  .form-actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
</style>
