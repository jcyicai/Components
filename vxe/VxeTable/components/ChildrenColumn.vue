<template>
  <div class="children-column-container">
    <vxe-colgroup
      :field="currentColumn.prop"
      :title="currentColumn.label"
      :width="currentColumn.width"
      min-width="100"
      :fixed="currentColumn.fixed"
      :align="currentColumn.align || 'center'"
    >
      <template v-for="(item, index) in columns">
        <template v-if="item.children && item.children.length > 0">
          <ChildrenColumn
            :key="`${item.prop}${index}`"
            :current-column="item"
            :columns="item.children"
          ></ChildrenColumn>
        </template>
        <template v-else>
          <vxe-column
            :key="`${item.prop}${index}`"
            :field="item.prop"
            :title="item.label"
            :width="item.width"
            min-width="100"
            :fixed="item.fixed"
            :type="item.type"
            :align="item.align || 'center'"
          >
            <template #default="{ row, column, $rowIndex }">
              <template v-if="item.slot">
                <slot :name="item.prop" :row="row" :column="column" :rowIndex="$rowIndex" :item="item" />
              </template>
              <template v-else>
                <!-- 格式化内容 -->
                <span v-if="item.format && Object.keys(item.format).length">
                  {{ formatValue(row[item.prop], item.format) }}
                </span>
                <!-- 常规 -->
                <span v-else>
                  {{ row[item.prop] }}
                </span>
              </template>
            </template>
          </vxe-column>
        </template>
      </template>
    </vxe-colgroup>
  </div>
</template>

<script>
  export default {
    name: 'ChildrenColumn',
    props: {
      columns: {
        type: Array,
        default: () => [],
        required: true,
      },
      currentColumn: {
        type: Object,
        default: () => {},
        required: true,
      },
    },
    data() {
      return {
        initColumns: this.columns,
      }
    },
    computed: {
      finallyColumns() {
        return this.initColumns.reverse()
      },
    },
    created() {},
    mounted() {},
    methods: {
      // 格式化列内容
      formatValue(val, foramt) {
        // 1 日期  2 数字
        let value = null
        if (foramt.type === 'date') {
          // 日期
          value = this.$baseDateFormat(val)
        } else if (foramt.type === 'number') {
          // 数字
          value = this.$baseNumFormat(val, foramt.digits || 2, 's')
        }
        return value
      },
    },
  }
</script>

<style lang="scss" scoped></style>
