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
        <div class="card-icon"></div>
        <h3>Забронировать место</h3>
        <p>Выберите удобное время и место в зале</p>
      </router-link>

      <!-- Заказ снэков -->
      <router-link to="/snacks" class="section-card snacks-card">
        <div class="card-icon"></div>
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
              <td>
                <span :class="['status-badge', getStatusClass(reservation.status)]">
                  {{ getStatusLabel(reservation.status) }}
                </span>
              </td>
              <td>{{ reservation.payment_amount }} ₽</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

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
const reservationsLoaded = ref(false);
const purchasesLoaded = ref(false);

// История бронирований — уже была
const fetchReservationHistory = async () => {
  error.value = null;
  loading.value = true;
  try {
    const response = await apiClient.get('/api/query/reservation-history');
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
  purchaseError.value = null;
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

// Статус бронирования с классами для стилизации
const getStatusClass = (status) => {
  switch (status) {
    case 'Active': return 'status-active';
    case 'Completed': return 'status-completed';
    case 'Cancelled': return 'status-cancelled';
    default: return 'status-unknown';
  }
};

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
.home-view {
  background-color: #EEEEEE;
  min-height: 100vh;
  padding-bottom: 40px;
}

.home-title-wrapper {
  margin-bottom: 100px;
}

.home-view__header {
  margin-top: 10px;
  text-align: center;
}

.home-view__header h2 {
  color: #424242;
  font-size: 28px;
  margin-bottom: 10px;
  font-weight: 600;
}

.home-view__subtitle {
  margin-top: 10px;
  text-align: center;
}

.home-view__subtitle p {
  font-size: 18px;
  color: #9E9E9E;
}

.home-view__sections {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 40px;
  flex-wrap: wrap;
  padding: 0 20px;
}

.section-card {
  width: 280px;
  height: 180px;
  padding: 25px;
  border-radius: 16px;
  text-decoration: none;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.section-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.booking-card {
  background: linear-gradient(135deg, #3F51B5, #673AB7);
}

.booking-card::before {
  background: linear-gradient(90deg, #FF03DAC5, #FF6200EE);
}

.snacks-card {
  background: linear-gradient(135deg, #FF6200EE, #FF3700B3);
}

.snacks-card::before {
  background: linear-gradient(90deg, #FF03DAC5, #FFBB86FC);
}

.card-icon {
  font-size: 32px;
  margin-bottom: 15px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.section-card h3 {
  margin: 0 0 10px;
  font-size: 20px;
  color: white;
  font-weight: 600;
}

.section-card p {
  margin: 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.4;
}

.section-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}

.report-section {
  margin-top: 60px;
  padding: 0 20px;
  margin-bottom: 70px;
}

.report-section h3 {
  color: #424242;
  font-weight: 600;
  margin-bottom: 20px;
}

.table-container {
  max-width: 1000px;
  margin: auto;
}

.report-table {
  width: 100%;
  overflow-x: auto;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background: white;
}

.report-table table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.report-table th {
  background: linear-gradient(135deg, #3F51B5, #673AB7);
  color: white;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  border: none;
}

.report-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #E0E0E0;
  color: #424242;
}

.report-table tr:hover {
  background-color: #F5F5F5;
}

.no-data-message {
  text-align: center;
  font-style: italic;
  color: #9E9E9E;
  padding: 40px;
  background: white;
  border-radius: 12px;
  margin: 20px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
}

.status-active {
  background-color: #E8F5E8;
  color: #4CAF50;
}

.status-completed {
  background-color: #E3F2FD;
  color: #2196F3;
}

.status-cancelled {
  background-color: #FFEBEE;
  color: #F44336;
}

.status-unknown {
  background-color: #F5F5F5;
  color: #9E9E9E;
}

.loading {
  font-size: 16px;
  text-align: center;
  color: #9E9E9E;
  padding: 40px;
  background: white;
  border-radius: 12px;
  margin: 20px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.error-message {
  color: #FFD32F2F;
  background-color: #FFEBEE;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #FFCDD2;
  text-align: center;
  font-weight: 500;
  margin: 20px 0;
}

@media (max-width: 768px) {
  .home-view__sections {
    flex-direction: column;
    align-items: center;
  }

  .section-card {
    width: 100%;
    max-width: 320px;
  }

  .report-section {
    padding: 0 15px;
    margin-top: 40px;
    margin-bottom: 40px;
  }

  .report-table {
    font-size: 14px;
  }

  .report-table th,
  .report-table td {
    padding: 8px;
  }
}
</style>