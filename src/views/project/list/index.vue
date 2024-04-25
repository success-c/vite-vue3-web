<template>
  <div>
    <ProTable :tableConfig="tableConfig" :request="request">
      <template #header="selectedKeys">
        <div style="display: flex; margin-bottom: 20px">
          <Space>
            <Button type="primary">导出</Button>
            <Button type="primary" @click="batchRomove(selectedKeys)">批量下架</Button>
            <Button type="primary" @click="batchDelete(selectedKeys)">批量删除</Button>
          </Space>
          <Button
            style="margin-left: auto"
            type="primary"
            @click="router.push('/project/addOrEdit')"
            >新增课程</Button
          >
        </div>
      </template>
    </ProTable>
  </div>
</template>
<script setup lang="tsx">
import ProTable from "@/components/ProTable.vue";
import { TableConfig } from "@/model/tableConfig";
import router from "@/router";
import { Button, Space } from "@arco-design/web-vue";

const batchRomove = (selectedKeys) => {
  console.log("批量下架", selectedKeys);
};
const batchDelete = (selectedKeys) => {
  console.log("批量删除", selectedKeys);
};
const tableConfig: TableConfig = {
  columns: [
    {
      title: "课程编号",
      dataIndex: "name",
      fixed: "left",
    },
    {
      title: "课程主图",
      dataIndex: "salary",
      noSearch: true,
    },
    {
      title: "课程名称",
      dataIndex: "address",
    },
    {
      title: "课次名称",
      dataIndex: "email",
      noSearch: true,
    },
    {
      title: "课程类目",
      dataIndex: "type",
      type: "select",
      fieldNames: { value: "type", label: "text" },
      options: [
        { text: "类型1", type: "1" },
        { text: "类型2", type: "2" },
      ],
    },
    {
      title: "总课时",
      dataIndex: "ema3il",
      noSearch: true,
    },
    {
      title: "售价",
      dataIndex: "4",
      noSearch: true,
    },
    {
      title: "优惠价",
      dataIndex: "5",
      noSearch: true,
    },
    {
      title: "课程积分",
      dataIndex: "6",
      noSearch: true,
    },
    {
      title: "适合群体",
      dataIndex: "6",
      type: "select",
    },
    {
      title: "是否推荐",
      dataIndex: "is",
      type: "select",
    },
    {
      title: "已售",
      dataIndex: "6",
      noSearch: true,
    },
    {
      title: "当前库存",
      dataIndex: "6",
      noSearch: true,
    },
    {
      title: "创建时间",
      dataIndex: "sjh",
      type: "date",
    },
    {
      title: "课次状态",
      dataIndex: "skdljf",
      type: "select",
    },
    {
      title: "操作",
      dataIndex: "6",
      noSearch: true,
      fixed: "right",
      width: 180,
      render: ({ record }) => {
        return (
          <div>
            <Button size="mini" type="text">
              删除
            </Button>
            <Button size="mini" type="text">
              编辑
            </Button>
            <Button size="mini" type="text">
              上架
            </Button>
          </div>
        );
      },
    },
  ],
};
const data = [
  {
    key: "1",
    name: "Jane Doe",
    salary: 23000,
    address: "32 Park Road, London",
    email: "jane.doe@example.com",
    children: [
      {
        key: "2",
        name: "Alisa Ross",
        salary: 25000,
        address: "35 Park Road, London",
        email: "alisa.ross@example.com",
        children: [
          {
            key: "3",
            name: "Ed Hellen",
            salary: 17000,
            address: "42 Park Road, London",
            email: "ed.hellen@example.com",
          },
          {
            key: "4",
            name: "William Smith",
            salary: 27000,
            address: "62 Park Road, London",
            email: "william.smith@example.com",
          },
        ],
      },
      {
        key: "5",
        name: "Alisa Ross",
        salary: 25000,
        address: "35 Park Road, London",
        email: "alisa.ross@example.com",
      },
    ],
  },
  {
    key: "6",
    name: "Alisa Ross",
    salary: 25000,
    address: "35 Park Road, London",
    email: "alisa.ross@example.com",
  },
  {
    key: "7",
    name: "Kevin Sandra",
    salary: 22000,
    address: "31 Park Road, London",
    email: "kevin.sandra@example.com",
  },
  {
    key: "8",
    name: "Ed Hellen",
    salary: 17000,
    address: "42 Park Road, London",
    email: "ed.hellen@example.com",
  },
  {
    key: "9",
    name: "William Smith",
    salary: 27000,
    address: "62 Park Road, London",
    email: "william.smith@example.com",
    children: [],
  },
];
const request = (props: any) => {
  console.log("props", props);

  return new Promise((resolve) => {
    resolve(data);
  });
};
</script>
