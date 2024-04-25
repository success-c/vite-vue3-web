<template>
  <div class="login_wrap">
    <div class="form_wrap">
      <div class="title">未来延学管理后台</div>
      <div style="padding: 24px 40px">
        <div style="margin-bottom: 20px">账户密码登录</div>
        <Form
          :model="form"
          auto-label-width
          size="large"
          @submit="handleSubmit"
          :rules="rules"
        >
          <FormItem
            field="username"
            :label-col-style="{ display: 'none' }"
            validate-trigger="blur"
          >
            <Input v-model="form.username" placeholder="请输入账号" :max-length="20" />
          </FormItem>
          <FormItem
            field="password"
            :label-col-style="{ display: 'none' }"
            validate-trigger="blur"
          >
            <Input
              v-model="form.password"
              placeholder="请输入密码"
              :max-length="20"
            ></Input>
          </FormItem>
          <FormItem :label-col-style="{ display: 'none' }">
            <Button
              style="width: 100%; color: #fff; background-color: #1890ff"
              html-type="submit"
              :loading="loading"
            >
              登录
            </Button>
          </FormItem>
        </Form>
      </div>
    </div>
    <div v-if="visible" class="mask"></div>
    <Vertify
      ref="dragVerify"
      :imgsrc="bg"
      v-model:visible="visible"
      v-model:isPassing="isPass"
      :showRefresh="true"
      :bar-img="barimg"
      :width="500"
      :height="50"
      text="请按住滑块拖动"
      successText="验证通过"
      @refresh="refreshimg"
      @passcallback="passcallback"
    >
    </Vertify>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from "vue";
import { Button, Form, FormItem, Input, ValidatedError } from "@arco-design/web-vue";
import Vertify from "../../components/Vertify.vue";
import imgSrc from "@/assets/bg.png";
import imgSrc2 from "@/assets/login.jpg";
import router from "@/router";
const barimg = ref(
  "https://cyberstone.oss-cn-beijing.aliyuncs.com/js-static-pic/icon.png"
);
const bg = ref(imgSrc);
const visible = ref(false);
const isPass = ref(false);
const form = reactive({
  username: "admin",
  password: "123456",
});
let index = 1;
const refreshimg = () => {
  const arr = [imgSrc, imgSrc2];
  bg.value = arr[index++ % 2];
};
const passcallback = async () => {
  loading.value = true;
  visible.value = false;
  const res = await login();
  if (res) {
    loading.value = false;
    router.replace("/dashboard");
  }
};
const loading = ref(false);
const rules = {
  username: { required: true, message: "请输入用户名" },
  password: { required: true, message: "请输入密码" },
};
const login = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 2000);
  });
};
const handleSubmit = async ({
  values,
  errors,
}: {
  values: Record<string, any>;
  errors: Record<string, ValidatedError> | undefined;
}) => {
  if (errors) return;

  visible.value = true;
  isPass.value = false;
};
</script>
<style scoped lang="scss">
.login_wrap {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  width: 100%;
  height: 100%;
  background: url("@/assets/login.jpg");

  .form_wrap {
    padding: 20px;
    width: 500px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px #ccc;
  }

  .title {
    font-size: 20px;
    text-align: center;
    font-weight: 700;
  }

  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgb(0 0 0 / 50%);
  }
}
</style>
