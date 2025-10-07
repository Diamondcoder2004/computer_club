<template>
  <div class="loginView">
    <LoginForm >

    </LoginForm>
  </div>
</template>


<script >

import {defineComponent} from "vue";
import LoginForm from "@/components/LoginForm.vue";

export default defineComponent({
  components: {LoginForm}
})
</script>

<style scoped>
.loginView {
  display: flex; /* Используем Flexbox для центрирования */
  justify-content: center; /* Центрирование по горизонтали */
  align-items: center; /* Центрирование по вертикали */
  height: 100vh; /* Высота равна высоте окна браузера */
  background-color: #435165; /* Цвет фона */
  margin: 0; /* Убираем стандартные отступы */
}

</style>