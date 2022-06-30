<template>
  <div class="wrapper">
    <div>
      <div class="min-h-screen flex flex-col items-center justify-center">
        <div
          class="
            flex flex-col
            light:bg-white
            shadow-md
            px-4
            sm:px-6
            md:px-8
            lg:px-10
            py-8
            rounded-3xl
            w-50
            max-w-md
          "
        >
          <div
            class="
              font-medium
              self-center
              text-xl
              sm:text-3xl
              text-gray-800
              dark:text-white
            "
          >
            CRD
          </div>
          <div
            class="
              mt-4
              self-center
              text-xl
              sm:text-sm
              text-gray-800
              dark:text-white
            "
          ></div>
          <VForm
            :validation-schema="schema"
            :validation-values="initialValues"
            v-slot="{ errors, meta: formMeta }"
            @submit="handleSubmit"
          >
            <div class="flex flex-col mb-5">
              <label
                for="email"
                class="mb-1 text-xs tracking-wide dark:text-white"
                >ຊື່ຜູ້ໃຊ້ລະບົບ:</label
              >
              <div class="relative">
                <div
                  class="
                    inline-flex
                    items-center
                    justify-center
                    absolute
                    left-0
                    top-0
                    h-full
                    w-10
                    text-gray-400
                  "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>

                <VField
                  id="username"
                  type="text"
                  name="username"
                  v-model="initialValues.username"
                  class="
                    input-sm
                    text-sm
                    placeholder-gray-500
                    pl-10
                    pr-4
                    input input-bordered
                    w-full
                    focus:outline-none focus:border-blue-400
                  "
                  :class="errors.username ? 'input-error' : ''"
                  placeholder="ປ້ອນ ອີເມວ໌ ຫຼື ເບີໂທ"
                />
              </div>
            </div>
            <div class="flex flex-col mb-6">
              <label
                for="password"
                class="
                  mb-1
                  text-xs
                  sm:text-sm
                  tracking-wide
                  text-gray-600
                  dark:text-white
                "
                >ລະຫັດຜ່ານ:</label
              >
              <div class="relative">
                <div
                  class="
                    inline-flex
                    items-center
                    justify-center
                    absolute
                    left-0
                    top-0
                    h-full
                    w-10
                    text-gray-400
                  "
                >
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                      />
                    </svg>
                  </span>
                </div>

                <VField
                  id="password"
                  type="password"
                  name="password"
                  v-model="initialValues.password"
                  class="
                    text-sm
                    placeholder-gray-500
                    pl-10
                    pr-4
                    input-sm input input-bordered
                    w-full
                    focus:outline-none focus:border-blue-400
                  "
                  :class="errors.password ? 'input-error' : ''"
                  placeholder="ປ້ອນລະຫັດຜ່ານ"
                />
              </div>
            </div>
            <div
              class="alert alert-error alert-sm shadow-lg mb-3"
              v-if="errors.username || errors.password || ErrMess != ''"
            >
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="stroke-current flex-shrink-0 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span class="text-sm">{{
                  ErrMess
                    ? "ຊື່ຜູ້ໃຊ້ລະບົບ, ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ"
                    : "ກາລຸນາກວດສອບ ຊື່ຜູ້ໃຊ້ລະບົບ, ລະຫັດຜ່ານ"
                }}</span>
              </div>
            </div>
            <button
              class="btn w-full btn-sm"
              :class="{ 'is-primary': formMeta.valid }"
              :disabled="!formMeta.valid"
              type="submit"
            >
              ເຂົ້າສູ່ລະບົບ
            </button>
          </VForm>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { object, string, ref as yupRef } from "yup";
import { configure } from "vee-validate";
import { setAccessToken } from "~~/auth";
let loading = ref(false);
const ErrMess = ref("");
const debug = ref(false);

onMounted(() => {
  debug.value =
    useRouter().currentRoute.value.query.debug === "true" ? true : false;
});

const existingEmail = async (value) => {
  const result = await $fetch("/api/checkemail?email=" + value);
  return result ? true : false;
};

const handleSubmit = async (values, actions) => {
  ErrMess.value = "";
  loading = true;
  console.log("dasfasdfsad");
  // await signInUser(initialValues).then((res) => {
  //   if (res.token) {
  //     setAccessToken(res.token);
  //     loading = false;
  //     window.location.reload();
  //   } else {
  //     ErrMess.value = res.message;
  //   }
  // });
};

configure({
  validateOnBlur: true,
  validateOnChange: true,
  validateOnInput: false,
  validateOnModelUpdate: true,
});

const schema = object({
  username: string().required(),
  password: string().required().min(8).label("Your Password"),
});

const initialValues = { username: "", password: "" };
</script>