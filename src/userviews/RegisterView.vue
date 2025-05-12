<template>
  <div class="registerView">
  <RegisterForm/>
  </div>
</template>

<script>
import RegisterForm from '@/components/RegisterForm.vue';

export default {
  components: { RegisterForm },
};
</script>

<style scoped>


.registerView {
  display: flex; /* Используем flexbox для центрирования содержимого */
  align-items: center; /* Центрируем по горизонтали */
  justify-content: center; /* Центрируем по вертикали */
  height: 100vh; /* Занимает всю высоту экрана */
  background-color: #435165; /* Фоновый цвет */
}
</style>