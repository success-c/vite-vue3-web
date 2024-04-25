<template>
  <div class="name">
    <div class="add" style="font-size: 20px; font-weight: 700">课程信息</div>
    <ProForm :formConfig="formConfig" :request="request"> </ProForm>
    <ProTable :table-config="tableConfig" :request="request"></ProTable>
  </div>
</template>
<script setup lang="ts">
import ProForm from "@/components/ProForm.vue";
import ProTable from "@/components/ProTable.vue";
const tableConfig = {
  columns: [
    {
      title: "顺序",
      dataIndex: "index",
    },
    {
      title: "名称",
      dataIndex: "courseIntroduce",
    },
    {
      title: "操作",
      dataIndex: "action",
      width: 200,
    },
  ],
};
const formConfig = {
  scroll: { x: 2000 },
  formItems: [
    {
      type: "input",
      label: "课程名称",
      value: "courseName",
    },
    {
      type: "input",
      label: "课程介绍",
      value: "courseIntroduce",
    },
    {
      type: "input",
      label: "课程类目",
      value: "courseType",
    },
    {
      type: "select",
      label: "所属单位",
      value: "belongUnit",
    },
    {
      type: "input",
      label: "总课时",
      value: "courseTotalTime",
    },
    {
      type: "input",
      label: "售价",
      value: "coursePrice",
    },
    {
      type: "input",
      label: "课程积分",
      value: "coursePoints",
    },
    {
      type: "select",
      label: "带班老师",
      value: "tutor",
    },
    {
      type: "checkbox",
      label: "适用群体",
      value: "fitCrowd",
      options: [
        { label: "是", value: "1" },
        { label: "否", value: "0" },
      ],
    },
    {
      type: "radio",
      label: "是否推荐",
      value: "recommender",
      options: [
        { label: "是", value: "1" },
        { label: "否", value: "0" },
      ],
    },
  ],
};
const request = (params: any) => {
  return new Promise(() => {
    console.log("params", params);
  });
};
</script>
<style scoped lang="scss">
.add {
  margin-bottom: 10px;
  width: 0;
  height: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
