<template>
  <div class="manage-view">
    <h1>Панель управления</h1>
    <p>Выберите нужный отчет:</p>

    <!-- Блок: Ежемесячный отчет -->
    <section class="report-section">
      <h2>Ежемесячный отчет</h2>
      <button @click="fetchMonthlyReport" class="btn-report">Показать</button>
      <div v-if="monthlyReport.length" class="report-table">
        <table>
          <thead>
          <tr>
            <th>Зона</th>
            <th>Брони</th>
            <th>Доход, ₽</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(row, index) in monthlyReport" :key="index">
            <td>{{ row.zone_name }}</td>
            <td>{{ row.active_reservations_count }}</td>
            <td>{{ row.total_revenue }} ₽</td>
          </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Блок: Утренний / Дневной / Вечерний отчеты -->
    <section class="report-section">
      <h2>Утренний / Дневной / Вечерний отчеты</h2>
      <div class="report-buttons">
        <button @click="fetchMorningReport" class="btn-report">Утро</button>
        <button @click="fetchAfternoonReport" class="btn-report">День</button>
        <button @click="fetchNightReport" class="btn-report">Ночь</button>
      </div>

      <div v-if="timeReport.length" class="report-table">
        <table>
          <thead>
          <tr>
            <th>ID зоны</th>
            <th>Брони</th>
            <th>Часов</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(row, index) in timeReport" :key="index">
            <td>{{ row.zone_id }}</td>
            <td>{{ row.total_reservations }}</td>
            <td>{{ row.total_hours }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Блок: Отчет по продажам -->
    <section class="report-section sales-report">
      <h2>Отчет по продажам за период</h2>
      <div class="date-form">
        <label for="start_date">Начало периода:</label>
        <input type="datetime-local" id="start_date" v-model="salesReportParams.start_date" />

        <label for="end_date">Конец периода:</label>
        <input type="datetime-local" id="end_date" v-model="salesReportParams.end_date" />

        <button @click="fetchSalesReport" class="btn-report">Сформировать</button>
      </div>

      <div v-if="salesReport.length" class="report-table">
        <table>
          <thead>
          <tr>
            <th>Товар</th>
            <th>Продано шт.</th>
            <th>Выручка, ₽</th>
            <th>Общая выручка, ₽</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(row, index) in salesReport" :key="index">
            <td>{{ row.product_name }}</td>
            <td>{{ row.total_quantity }}</td>
            <td>{{ row.total_sales_amount }} ₽</td>
            <td>{{ row.overall_sales_amount }} ₽</td>
          </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import apiClient from '@/services/apiClient';

// === Состояние отчетов ===
const monthlyReport = ref([]);
const timeReport = ref([]);
const salesReport = ref([]);

// === Параметры для отчета по продажам ===
const salesReportParams = ref({
  start_date: '',
  end_date: ''
});

// === Методы загрузки отчетов ===
const fetchMonthlyReport = async () => {
  try {
    const response = await apiClient.get('/api/view/monthly-report');
    monthlyReport.value = response.data;
  } catch (error) {
    alert('Не удалось загрузить ежемесячный отчет');
    console.error(error);
  }
};

const fetchMorningReport = async () => {
  try {
    const response = await apiClient.get('/api/view/morning-report');
    timeReport.value = response.data;
  } catch (error) {
    alert('Не удалось загрузить утренний отчет');
    console.error(error);
  }
};

const fetchAfternoonReport = async () => {
  try {
    const response = await apiClient.get('/api/view/afternoon-report');
    timeReport.value = response.data;
  } catch (error) {
    alert('Не удалось загрузить дневной отчет');
    console.error(error);
  }
};

const fetchNightReport = async () => {
  try {
    const response = await apiClient.get('/api/view/night-report');
    timeReport.value = response.data;
  } catch (error) {
    alert('Не удалось загрузить ночной отчет');
    console.error(error);
  }
};

const fetchSalesReport = async () => {
  if (!salesReportParams.value.start_date || !salesReportParams.value.end_date) {
    alert('Введите начало и конец периода');
    return;
  }

  try {
    const response = await apiClient.post('/api/function/sales-report', salesReportParams.value);
    salesReport.value = response.data;
  } catch (error) {
    alert('Не удалось загрузить отчет по продажам');
    console.error(error);
  }
};
</script>

<style scoped>
.manage-view {
  padding: 40px;
  max-width: 1000px;
  margin: auto;
}

.report-section {
  margin-bottom: 40px;
}

.btn-report {
  padding: 10px 20px;
  background-color: #5D4037;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
  margin-top: 10px;
}

.btn-report:hover {
  background-color: #4e342e;
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

.date-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}

.date-form label {
  font-weight: bold;
}
</style>