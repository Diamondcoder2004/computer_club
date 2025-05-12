<template>
  <!-- Информация о пользователе -->
  <div class="user-info">

    <div class="user-info__item">
      <span class="label">Имя:</span>
      <span class="value">{{ user.firstName }}</span>
    </div>

    <div class="user-info__item">
      <span class="label">Фамилия:</span>
      <span class="value">{{ user.lastName }}</span>
    </div>
    <div class="user-info__item">
      <span class="label">Логин:</span>
      <span class="value">{{ user.username }}</span>
    </div>
    <div class="user-info__item">
      <span class="label">Баланс на карте:</span>
      <span class="value">{{ user.balance }} ₽</span>
    </div>
    <div class="user-info__item" v-if="user.lastOperationDate">
      <span class="label">Последняя операция:</span>
      <span class="value">{{ formatDate(user.lastOperationDate) }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Cookies from 'js-cookie';
import apiClient from '@/services/apiClient'; // Убедитесь, что путь правильный
const user = ref({
  id: localStorage.getItem("userId") || '',
  username: localStorage.getItem("username") || '',
  firstName: localStorage.getItem("firstName") || '',
  lastName: localStorage.getItem("lastName") || '',
  role_id: localStorage.getItem("role_id") || '',
  balance: '0.00',
  lastOperationDate: null
});

const loadUserData = async () => {
  try {
    // Загрузка данных из localStorage
    user.value = {
      id: localStorage.getItem("userId") || '',
      username: localStorage.getItem("username") || '',
      firstName: localStorage.getItem("firstName") || '',
      lastName: localStorage.getItem("lastName") || '',
      role_id: localStorage.getItem("role_id") || '',
      balance: user.value.balance,
      lastOperationDate: user.value.lastOperationDate
    };

    // Проверяем наличие username перед запросом баланса
    if (user.value.username) {
      const response = await apiClient.get('/api/function/get-balance');

      console.log("Статус ответа:", response.status);

      if (response.status !== 200) {
        throw new Error('Ошибка при загрузке баланса');
      }

      const balanceData = response.data;

      if (balanceData.length > 0) {
        user.value.balance = balanceData[0].balance;
        user.value.lastOperationDate = balanceData[0].last_operation_date;
      }
    }

    // Дополнительно проверяем куки
    const cookieFirstName = Cookies.get("firstName");
    const cookieLastName = Cookies.get("lastName");

    if (cookieFirstName) user.value.firstName = cookieFirstName;
    if (cookieLastName) user.value.lastName = cookieLastName;

  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    user.value.balance = 'Ошибка загрузки';
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('ru-RU');
};

onMounted(() => {
  loadUserData();
});
</script>

<style scoped>
.user-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 500px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.user-info__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.user-info__item:last-child {
  border-bottom: none;
}

.label {
  font-weight: bold;
  color: #555;
  margin-right: 15px;
}

.value {
  color: #333;
  text-align: right;
}
</style>