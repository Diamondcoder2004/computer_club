<template>
  <div class="home-manage-view">
    <h1>Панель управления</h1>
    <p>Выберите действие:</p>

    <!-- Только для админа (role_id == 1) -->
    <div v-if="isRole(1)" class="action-buttons">
      <router-link to="/report" class="btn-action view-report">Посмотреть отчеты</router-link>
      <router-link to="/manage/create-computer" class="btn-action add-pc">Добавить компьютер</router-link>
      <router-link to="/manage/top-up-balance" class="btn-action recharge">Пополнить баланс пользователя</router-link>
    </div>

    <!-- Только для менеджера (role_id == 2) -->
    <div v-else-if="isRole(2)" class="action-buttons">
      <router-link to="/report" class="btn-action view-report">Посмотреть отчеты</router-link>
    </div>

    <!-- Кнопка "Вернуться к пользователю" -->
    <div class="switch-user-mode">
      <router-link to="/home" class="btn-switch">Перейти к режиму пользователя</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const roleId = ref(null);

onMounted(() => {
  const storedRoleId = localStorage.getItem('role_id');
  roleId.value = storedRoleId ? parseInt(storedRoleId, 10) : null;
});

const isRole = (targetRoleId) => {
  return roleId.value === targetRoleId;
};
</script>

<style scoped>
.home-manage-view {
  padding: 40px;
  max-width: 800px;
  margin: auto;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 30px;
}

.btn-action {
  display: block;
  padding: 15px 20px;
  text-align: center;
  font-size: 18px;
  border-radius: 8px;
  color: white;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.view-report {
  background-color: #673ab7; /* Фиолетовый */
}
.view-report:hover {
  background-color: #512da8;
}

.add-pc {
  background-color: #2196f3; /* Синий */
}
.add-pc:hover {
  background-color: #1976d2;
}

.recharge {
  background-color: #4caf50; /* Зеленый */
}
.recharge:hover {
  background-color: #388e3c;
}

.switch-user-mode {
  margin-top: 40px;
  text-align: center;
}

.btn-switch {
  display: inline-block;
  padding: 12px 24px;
  background-color: #9e9e9e;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
}
.btn-switch:hover {
  background-color: #757575;
}
</style>