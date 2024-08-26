<template>
  <div class="form-item-group-container">
    <el-row :gutter="15">
      <template v-for="(field, index) in finallyFields">
        <template v-if="field.itemSlot">
          <slot :name="field.prop" :field="field" :index="index"></slot>
        </template>
        <template v-else>
          <el-col :key="field.prop" v-bind="getFieldColAttrs(field, index)">
            <!-- 表单 slot -->
            <template v-if="field.formItemSlot">
              <slot :name="field.prop" :field="field" :index="index"></slot>
            </template>
            <el-form-item v-else :label="field.label" :prop="field.prop">
              <!-- 组件 slot -->
              <template v-if="field.slot">
                <slot :name="field.prop" :field="field" :index="index"></slot>
              </template>
              <template v-else-if="!isDetail">
                <template v-if="field.type === 'custom-select' || field.component === 'custom-select'">
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
                  <input-number
                    v-model="finallyFormData[field.prop]"
                    v-bind="getComponentAttrs(field)"
                    :disabled="getFieldDisabled(field, index)"
                    v-on="getComponentListeners(field, index)"
                  ></input-number>
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
              </template>
              <template v-else>
                <component :is="getFieldContent(field, index)"></component>
              </template>
            </el-form-item>
          </el-col>
        </template>
      </template>
    </el-row>
  </div>
</template>

<script>
  import { isFunction } from '@/utils'
  export default {
    name: 'FormItemGroup',
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
      isDetail: {
        type: Boolean,
        default: false,
      },
      isInline: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {}
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
        return fields
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
      getFieldColAttrs(field, index) {
        // 是否响应式
        const baseAttrs = field.isRwd ? {} : { span: this.getColSpan(field, index) }

        if (field.colAttrs && Object.keys(field.colAttrs).length) {
          return { ...baseAttrs, ...field.colAttrs }
        }

        return baseAttrs
      },
      // 获取 col span
      getColSpan(field, index) {
        return !this.isInline ? 24 : field.colSpan || 6
      },
      // 下拉 option 字段
      getOptionProp(option, optionProps, defaultProp) {
        if (optionProps && optionProps[defaultProp]) {
          return option[optionProps[defaultProp]]
        }
        return option[defaultProp]
      },
      getOptions(options) {
        return isFunction(options) ? options() : options
      },
      // 获取组件属性
      getComponentAttrs(field) {
        const attrs = Object.keys(field.attrs || {}).reduce((acc, key) => {
          const value = field.attrs[key]
          acc[key] = isFunction(value) ? value() : value
          return acc
        }, {})

        return { ...attrs, style: attrs.style || 'width: 100%' }
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
      // 获取组件内容
      getFieldContent(field, index) {
        if (field.content && isFunction(field.content)) {
          const content = field.content(field, index)
          return this.createComponent(content)
        }
        const fieldProp = this.isDetail ? field.viewProp || field.prop : field.prop
        return this.createComponent(this.finallyFormData[fieldProp])
      },
      createComponent(content) {
        if (typeof content === 'string') {
          if (/<[a-z][\s\S]*>/i.test(content)) {
            // 包含 HTML 标签
            return {
              render: (h) => h('div', { domProps: { innerHTML: content } }),
            }
          } else {
            return {
              render: (h) => h('span', content),
            }
          }
        } else if (content && typeof content === 'object' && content.render) {
          // 如果已经是一个组件对象，直接返回
          return content
        } else {
          return {
            render(h) {
              return h('span', content)
            },
          }
        }

        /* content: '测试',
        content: (field, index) => ({
              render(h) {
                return h('div', [h('span', '段落'), h('button', '按钮')])
              },
            }),
        content: (field, index) => `<span>测试</span>` */
      },
      // 是否禁用
      getFieldDisabled(field, index) {
        if (!(field && field.attrs)) {
          return false
        }
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
    },
  }
</script>

<style lang="scss" scoped></style>
