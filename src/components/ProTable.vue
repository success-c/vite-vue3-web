<template>
  <Form :model="form" @submit="submit">
    <Row :gutter="20">
      <Col v-for="item in searchItems" :key="item.dataIndex" :span="span">
        <FormItem
          :field="item.dataIndex"
          validate-trigger="blur"
          :label="item.title"
          label-col-flex="80px"
        >
          <Select
            v-if="item.type === 'select'"
            v-model="form[item.dataIndex]"
            :options="item.options || []"
            :field-names="item.fieldNames"
            :placeholder="'请选择' + item.title"
          >
          </Select>
          <RangePicker
            :placeholder="['开始时间', '结束时间']"
            format="YYYY-MM-DD HH:mm:ss"
            :time-picker-props="{ defaultValue: ['00:00:00', '12:59:59'] }"
            v-else-if="item.type === 'date'"
            showTime
            @change="onChange"
          ></RangePicker>
          <Input
            v-else
            v-model="form[item.dataIndex!]"
            :placeholder="item.placeholder || '请输入' + item.title"
            :max-length="20"
          />
        </FormItem>
      </Col>
      <Col style="margin-left: auto" :span="span">
        <FormItem>
          <Space style="justify-content: right; width: 100%; flex-wrap: wrap">
            <Button html-type="submit" type="primary">搜索</Button>
            <Button @click="reset">重置</Button>
          </Space>
        </FormItem>
      </Col>
    </Row>
  </Form>
  <slot name="header" :selectedKeys="selectedKeys"></slot>
  <Table
    :columns="columns"
    :data="data"
    v-bind="$attrs"
    show-empty-tree
    :scroll="props.tableConfig.scroll || { x: 'max-content' }"
    :pagination="pagination"
    :row-selection="rowSelection"
    v-model:selectedKeys="selectedKeys"
  >
  </Table>
</template>
<script setup lang="ts">
import { Props } from "@/model/tableConfig";

import {
  Table,
  Form,
  Select,
  Space,
  Col,
  Button,
  FormItem,
  Input,
  Row,
  ValidatedError,
  RangePicker
} from "@arco-design/web-vue";
import { CalendarValue } from "@arco-design/web-vue/es/date-picker/interface";
import { onMounted, reactive, ref, toRefs } from "vue";

const props = defineProps<Props>();
const { tableConfig, request } = toRefs(props);
const { columns } = tableConfig.value as any;
const data = ref([]);
const form = ref<any>({});
const searchItems = ref<any>([]);
const pagination = { pageSize: 2 };
const selectedKeys = ref([]);

const rowSelection = reactive({
  type: "checkbox",
  showCheckedAll: true,
  onlyCurrent: false
}) as any;
onMounted(async () => {
  data.value = await request.value();
  // 获取所有的搜索项
  searchItems.value = columns.filter((item: any) => !item.noSearch);

  searchItems.value.forEach((item: any) => {
    if (item.type == "date") return;
    form.value[item.dataIndex] = "";
  });
});
const reset = async () => {
  searchItems.value.forEach((item: any) => {
    if (item.type == "date") return;
    form.value[item.dataIndex] = "";
  });
  data.value = await request.value(form.value);
};

const onchange = (value: (CalendarValue | undefined)[] | undefined) => {
  form.value.startTime = value![0];
  form.value.endTime = value![1];
  return;
};
const submit = async ({
  values,
  errors
}: {
  values: Record<string, any>;
  errors: Record<string, ValidatedError> | undefined;
}) => {
  if (errors) return;
  data.value = await request.value(values);
};

const span = ref(6);
const calcspan = () => {
  const width = document.body.clientWidth;
  if (width < 1400 && width > 1000) {
    span.value = 8;
  } else if (width < 1000 && width > 800) {
    span.value = 12;
  } else if (width < 800) {
    span.value = 24;
  }

 else {
    span.value = 6;
  }
};
calcSpan();
window.addEventListener("resize", () => {
  calcSpan();
});
// const expandedKeys = ref([]);
// const rowSelection = reactive({
//   type: "checkbox",
//   showCheckedAll: true,
//   checkStrictly: true
// }) as TableRowSelection;
</script>
<style scoped></style>
