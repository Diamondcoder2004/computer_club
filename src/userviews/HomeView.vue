<template>
  <div class="home-view">
    <!-- Заголовок -->
    <div class="home-title-wrapper">
      <home-title></home-title>
    </div>

    <!-- Основной заголовок страницы -->
    <div class="home-view__header">
      <h2>Добро пожаловать!</h2>
    </div>

    <!-- Подзаголовок -->
    <div class="home-view__subtitle">
      <p>Лучшее место для игр и отдыха</p>
    </div>

    <!-- Блок с двумя кнопками/разделами -->
    <div class="home-view__sections">
      <!-- Бронирование -->
      <router-link to="/booking" class="section-card booking-card">
        <h3>Забронировать место</h3>
        <p>Выберите удобное время и место в зале</p>
      </router-link>

      <!-- Заказ снэков -->
      <router-link to="/snacks" class="section-card snacks-card">
        <h3>Заказать снэки</h3>
        <p>Вкусные напитки и закуски к игре</p>
      </router-link>
    </div>

    <!-- История бронирований -->
    <div class="report-section">
      <h3 style="text-align: center;">История бронирований</h3>

      <div v-if="loading" class="loading">Загрузка...</div>
      <div v-else-if="error" class="error-message">{{ error }}</div>
      <div v-else-if="reservationsLoaded && reservations.length === 0" class="no-data-message">
        Бронирований ещё не было
      </div>
      <div v-else class="table-container">
        <div class="report-table">
          <table>
            <thead>
            <tr>
              <th>Компьютер</th>
              <th>Зона</th>
              <th>Начало</th>
              <th>Конец</th>
              <th>Статус</th>
              <th>Стоимость</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="reservation in reservations" :key="reservation.id">
              <td>{{ reservation.computers?.computer_name || '-' }}</td>
              <td>Зона {{ reservation.computers?.zone_id || '-' }}</td>
              <td>{{ formatDateTime(reservation.start_time) }}</td>
              <td>{{ formatDateTime(reservation.end_time) }}</td>
              <td>{{ getStatusLabel(reservation.status) }}</td>
              <td>{{ reservation.payment_amount }} ₽</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- История покупок -->
    <!-- История покупок -->
    <div class="report-section">
      <h3 style="text-align: center;">История покупок</h3>

      <div v-if="purchaseLoading" class="loading">Загрузка...</div>
      <div v-else-if="purchaseError" class="error-message">{{ purchaseError }}</div>
      <div v-else-if="purchasesLoaded && purchases.length === 0" class="no-data-message">
        Покупок ещё не было
      </div>
      <div v-else class="table-container">
        <div class="report-table">
          <table>
            <thead>
            <tr>
              <th>Товар</th>
              <th>Категория</th>
              <th>Дата</th>
              <th>Количество</th>
              <th>Цена за ед.</th>
              <th>Сумма</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="purchase in purchases" :key="purchase.id">
              <td>{{ purchase.products?.product_name || '-' }}</td>
              <td>{{ purchase.products?.category || '-' }}</td>
              <td>{{ formatDateTime(purchase.sale_date) }}</td>
              <td>{{ purchase.quantity }}</td>
              <td>{{ purchase.products?.price }} ₽</td>
              <td>{{ purchase.sale_amount }} ₽</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apiClient from '@/services/apiClient.js';
import HomeTitle from "@/components/HomeTitle.vue";

const reservations = ref([]);
const purchases = ref([]);
const loading = ref(true);
const purchaseLoading = ref(true);
const error = ref(null);
const purchaseError = ref(null);
const reservationsLoaded = ref(false); // Успешно загружены (даже если пусто)
const purchasesLoaded = ref(false);

// История бронирований — уже была
const fetchReservationHistory = async () => {
  error.value = null; // ← КЛЮЧЕВОЙ МОМЕНТ: сбрасываем ошибку
  loading.value = true;
  try {
    const response = await apiClient.get('/api/query/reservation-history');
    // Даже если response.data — пустой массив, это НЕ ошибка
    reservations.value = Array.isArray(response.data) ? response.data : [];
    console.log('Ответ от API:', response.data);
    console.log('Тип данных:', typeof response.data, Array.isArray(response.data));
  } catch (err) {
    console.error('Ошибка загрузки бронирований:', err);
    error.value = 'Не удалось загрузить историю бронирований.';
    reservations.value = [];
  } finally {
    loading.value = false;
  }
};

const fetchPurchaseHistory = async () => {
  purchaseError.value = null; // ← сбрасываем
  purchaseLoading.value = true;
  try {
    const response = await apiClient.get('/api/query/purchase-history');
    purchases.value = Array.isArray(response.data) ? response.data : [];
  } catch (err) {
    console.error('Ошибка загрузки покупок:', err);
    purchaseError.value = 'Не удалось загрузить историю покупок.';
    purchases.value = [];
  } finally {
    purchaseLoading.value = false;
  }
};

onMounted(async () => {
  await Promise.all([
    fetchReservationHistory(),
    fetchPurchaseHistory()
  ]);
  loading.value = false;
});

// Формат даты
const formatDateTime = (datetime) => {
  const date = new Date(datetime);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

// Статус бронирования
const getStatusLabel = (status) => {
  switch (status) {
    case 'Active': return 'Активно';
    case 'Completed': return 'Завершено';
    case 'Cancelled': return 'Отменено';
    default: return status;
  }
};
</script>

<style scoped>

/* Уже были ранее */
.report-section {
  margin-top: 60px;
  padding: 0 20px;
  margin-bottom: 70px;
}

.table-container {
  max-width: 1000px;
  margin: auto;
}

.report-table {
  width: 100%;
  overflow-x: auto;
}

.report-table table {
  width: 100%;
  border-collapse: collapse;
}

.report-table th,
.report-table td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}
.no-data-message {
  text-align: center;
  font-style: italic;
  color: #777;
  padding: 20px;
}
.report-table th {
  background-color: #f5f5f5;
}

.home-title-wrapper {
  margin-bottom: 100px;
}

.home-view__header {
  margin-top: 10px;
  text-align: center;
}
.home-view__subtitle {
  margin-top: 10px;
  text-align: center;
}

.home-view__subtitle p {
  font-size: 18px;
  color: #666;
}

.home-view__sections {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 40px;
  flex-wrap: wrap;
}

.section-card {
  width: 280px;
  height: 160px;
  padding: 20px;
  border-radius: 10px;
  text-decoration: none;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-align: left;
}

.section-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.booking-card {
  background-color: #8B5E3C;
}

.snacks-card {
  background-color: #C19570;
}

.section-card h3 {
  margin: 0 0 10px;
  font-size: 20px;
}

.section-card p {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}

/* Стили для таблицы (скопированы из другой страницы) */
.report-section {
  margin-top: 40px;
  padding: 0 40px;
}

.report-table {
  margin-top: 20px;
  overflow-x: auto;
}

.report-table table {
  width: 100%;
  border-collapse: collapse;
}

.report-table th,
.report-table td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}

.report-table th {
  background-color: #f5f5f5;
}

.loading {
  font-size: 16px;
  text-align: center;
  color: #555;
}

.error-message {
  color: red;
  font-weight: bold;
}
</style>