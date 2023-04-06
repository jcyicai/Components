<template>
  <div class="base-tab">
    <el-row :span="24" style="margin-top: 20px">
      <el-col :span="24">
        <el-tabs v-model="finallyTabName" type="border-card">
          <el-tab-pane v-for="item in data" :key="item.name" :label="item.label" :name="item.name">
            <!-- 自定义 tab 内容 -->
            <slot :name="`${item.name}-tab`"></slot>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'BaseTab',
    props: {
      // tab 配置数据 [ { name: 'detail', label: '明细'}]
      data: {
        type: Array,
        default: () => [],
        required: true
      },
      // tab 值
      value: {
        type: String,
        default: '',
        required: true
      },
    },
    data() {
      return {
        finallyTabName: this.value,
      }
    },
    watch: {
      finallyTabName: {
        handler(val) {
          this.$emit('update:value', val)
        },
        deep: true,
      },
    },
    created() {},
    mounted() {},
    methods: {},
  }
</script>

<style lang="scss" scoped></style>
