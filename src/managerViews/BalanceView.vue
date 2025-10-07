<template>
  <div class="recharge-balance">
    <h2>Пополнить баланс пользователя</h2>

    <div class="form-group">
      <label for="username">Логин пользователя:</label>
      <input type="text" id="username" v-model="username" placeholder="Введите логин" required />
    </div>

    <div class="form-group">
      <label for="amount">Сумма пополнения:</label>
      <input type="number" id="amount" v-model.number="amount" min="0.01" step="0.01" required />
    </div>

    <button @click="rechargeBalance" class="btn-recharge">Пополнить</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import apiClient from '@/services/apiClient';

const username = ref('');
const amount = ref(0);

const rechargeBalance = async () => {
  // Валидация полей
  if (!username.value.trim()) {
    alert('Пожалуйста, введите логин пользователя.');
    return;
  }

  if (amount.value <= 0 || !amount.value) {
    alert('Сумма пополнения должна быть больше 0.');
    return;
  }

  try {
    const response = await apiClient.post('/api/proc/top-up-admin', {
      target_username: username.value.trim(),
      amount: amount.value
    });

    alert(`Баланс пользователя "${username.value}" пополнен на ${amount.value} ₽`);
    console.log("Ответ запроса: topUp: ", response.data);

    // Опционально: сброс полей после успешного пополнения
    username.value = '';
    amount.value = 0;
  } catch (err) {
    alert('Не удалось пополнить баланс');
    console.error(err);
  }
};
</script>

<style scoped>
.recharge-balance {
  padding: 40px;
  max-width: 500px;
  margin: auto;
}
.form-group {
  margin-bottom: 20px;
}
label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}
input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.btn-recharge {
  padding: 12px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  font-size: 16px;
}
.btn-recharge:hover {
  background-color: #388e3c;
}
</style>