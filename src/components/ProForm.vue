<template>
  <Form
    :model="form"
    :label-col-props="{ span: 2, offset: 0 }"
    :wrapper-col-props="{ span: 14, offset: 0 }"
    @submit="submit"
  >
    <FormItem
      :label="item.label"
      v-for="item in formItems"
      v-bind="$attrs"
      style="justify-content: center; padding: none; height: none"
    >
      <slot v-for="slot in Object.keys($slots)" :name="slot"> </slot>
      <Input
        v-model="form[item.value]"
        :placeholder="item.placeholder || '请输入' + item.label"
        :max-length="20"
        v-if="item.type == 'input'"
      />
      <Select
        v-if="item.type === 'select'"
        v-model="form[item.value]"
        :options="item.options || []"
        :field-names="item.fieldNames"
        :placeholder="'请选择' + item.label"
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
      <CheckboxGroup
        v-if="item.type === 'checkbox'"
        :options="item.options"
        v-model="form[item.value]"
      >
      </CheckboxGroup>
      <RadioGroup
        v-if="item.type === 'radio'"
        v-model="form[item.value]"
        :options="item.options"
      />
    </FormItem>
    <div style="width: 100%; text-align: right">
      <Button style="width: 70px" html-type="submit" type="primary">确定</Button>
    </div>
  </Form>
</template>
<script setup lang="ts">
import { Props } from "@/model/formConfig";

import {
  Form,
  FormItem,
  Input,
  Select,
  RangePicker,
  CheckboxGroup,
  RadioGroup,
  Button,
  ValidatedError,
} from "@arco-design/web-vue";
import { CalendarValue } from "@arco-design/web-vue/es/date-picker/interface";
import { onMounted, ref, toRefs } from "vue";
const props = defineProps<Props>();
const { formConfig, request } = toRefs(props);
const { formItems } = formConfig.value as any;
const form = ref<any>({});

const onChange = (value: (CalendarValue | undefined)[] | undefined) => {
  form.value.startTime = value![0];
  form.value.endTime = value![1];
  return;
};
onMounted(() => {
  formItems.forEach((item: any) => {
    if (item.type == "date") return;
    if (item.type == "checkbox") {
      form.value[item.value] = [];
    } else {
      form.value[item.value] = "";
    }
  });
});
const submit = async ({
  values,
  errors,
}: {
  values: Record<string, any>;
  errors: Record<string, ValidatedError> | undefined;
}) => {
  if (errors) return;
  await request.value(values);
};
</script>
<style scoped lang="scss">
.app {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
