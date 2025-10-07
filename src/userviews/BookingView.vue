<template>
  <div class="booking-view">
    <!-- Шапка -->
    <header class="home-view__header">
      <h1 class="home-title-wrapper">Выберите игровую зону</h1>
      <p class="home-view__subtitle">Выберите зону и количество часов для бронирования</p>
    </header>

    <!-- Шаг 1: Выбор зоны -->
    <main class="home-view__sections" v-if="step === 'zones'">
      <div
          v-for="(zone, index) in zones"
          :key="index"
          class="section-card zone-card"
          :class="getZoneCardClass(index)"
          @click="selectZone(zone)"
      >
        <h3>{{ zone.zone_name }}</h3>
        <p class="price">Стоимость: {{ zone.hourly_rate }} ₽/час</p>
        <p class="computers">Готовые ПК: {{ zone.ready_computers_count }}</p>
        <div class="zone-description-block">
          <p><strong>Описание:</strong></p>
          <p>{{ zone.description || 'Нет описания.' }}</p>
        </div>
      </div>
    </main>

    <!-- Шаг 2: Ввод времени и количества часов -->
    <main class="time-selection" v-else-if="step === 'time'">
      <div class="time-selection-card">
        <h2>Выберите время и продолжительность</h2>

        <div class="time-input-group">
          <label for="start-time">Начало бронирования:</label>
          <input
              id="start-time"
              type="datetime-local"
              v-model="startTime"
              :min="minDateTime"
              class="time-input"
          />
        </div>

        <div class="time-input-group">
          <label for="play-hours">Продолжительность (часов):</label>
          <input
              id="play-hours"
              type="number"
              v-model.number="playHours"
              min="1"
              class="time-input"
          />
        </div>

        <div class="selection-summary">
          <p>Зона: <strong>{{ selectedZone.zone_name }}</strong></p>
          <p>Примерная стоимость: <strong>{{ selectedZone.hourly_rate * playHours }} ₽</strong></p>
        </div>

        <button @click="loadAvailablePCs" class="btn-next">Продолжить</button>
      </div>
    </main>

    <!-- Шаг 3: Список доступных ПК -->
    <main class="pc-list" v-else-if="step === 'pcs'">
      <h2>Доступные компьютеры в зоне "{{ selectedZone.zone_name }}"</h2>
      <div class="pc-cards">
        <div
            v-for="(pc, index) in pcs"
            :key="index"
            class="pc-card section-card"
            @click="confirmBooking(pc)"
        >
          <h3>{{ pc.computer_name }}</h3>
          <ul class="pc-specs">
            <li>Процессор: {{ pc.processor }}</li>
            <li>RAM: {{ pc.ram }}</li>
            <li>Видеокарта: {{ pc.gpu }}</li>
            <li>Свободен с: {{ formatTime(pc.start_time) }}</li>
            <li>На {{ pc.play_hours }} ч.</li>
            <li class="pc-price">Стоимость: {{ pc.total_price }} ₽</li>
          </ul>
        </div>
      </div>
    </main>

    <!-- Шаг 4: Подтверждение бронирования -->
    <main class="confirmation" v-else-if="step === 'confirmation'">
      <div class="confirmation-card">
        <h2>Бронирование подтверждено!</h2>
        <div class="confirmation-details">
          <p>{{ confirmationMessage }}</p>
        </div>
        <button @click="resetBooking" class="btn-back">Вернуться к выбору зон</button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import apiClient from '@/services/apiClient';

const step = ref('zones'); // 'zones', 'time', 'pcs', 'confirmation'
const zones = ref([]);
const pcs = ref([]);
const selectedZone = ref(null);
const startTime = ref(getCurrentDateTimeLocal());
const playHours = ref(1); // по умолчанию 1 час
const confirmationMessage = ref('');

// Минимальное значение для datetime-local
const minDateTime = getCurrentDateTimeLocal();

// Получаем текущее время в формате datetime-local
function getCurrentDateTimeLocal() {
  const now = new Date();
  const offsetMinutes = now.getTimezoneOffset();
  const correctedDate = new Date(now.getTime() - offsetMinutes * 60 * 1000);
  return correctedDate.toISOString().slice(0, 16);
}

// Загрузка зон
async function loadZones() {
  try {
    const response = await apiClient.get('/api/function/available-zones');
    zones.value = response.data;
  } catch (error) {
    console.error('Ошибка загрузки зон:', error);
    alert('Не удалось загрузить список зон.');
  }
}

loadZones();

// Переход к выбору времени
function selectZone(zone) {
  selectedZone.value = zone;
  step.value = 'time';
}

// Загрузка доступных ПК
async function loadAvailablePCs() {
  if (!selectedZone.value) return;

  try {
    const response = await apiClient.post('/api/function/available-pc', {
      zone_name: selectedZone.value.zone_name,
      start_time: startTime.value,
      play_hours: playHours.value,
    });

    const pcList = response.data.map(pc => ({
      ...pc,
      start_time: startTime.value,
      play_hours: playHours.value,
      total_price: pc.hourly_rate * playHours.value,
    }));

    pcs.value = pcList;
    step.value = 'pcs';
  } catch (error) {
    console.error('Ошибка загрузки ПК:', error);
    alert('Не удалось загрузить доступные компьютеры.');
  }
}

// Форматируем дату и время
function formatTime(datetime) {
  const date = new Date(datetime);
  return date.toLocaleString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Подтверждение бронирования
async function confirmBooking(pc) {
  const formattedStartTime = startTime.value.replace('T', ' '); // преобразуем из ISO формата

  try {
    const response = await apiClient.post('/api/proc/book-computer', {
      input_computer_name: pc.computer_name,
      reservation_start_time: formattedStartTime,
      play_time_hours: playHours.value
    });

    if (response.status === 200 || response.status === 201) {
      confirmationMessage.value = `
        ${pc.computer_name} в зоне «${selectedZone.value.zone_name}»
        с ${formatTime(startTime.value)} на ${playHours.value} ч.
        Итого: ${pc.total_price} ₽
      `;
      step.value = 'confirmation';
    }
  } catch (error) {
    console.error('Ошибка при бронировании:', error);
    alert('Не удалось забронировать компьютер. Попробуйте снова.');
  }
}

// Сброс к началу
function resetBooking() {
  step.value = 'zones';
  pcs.value = [];
  playHours.value = 1;
  startTime.value = getCurrentDateTimeLocal();
}

// Получаем класс для карточки зоны (чередование цветов)
const getZoneCardClass = (index) => {
  const colors = ['zone-card-primary', 'zone-card-secondary', 'zone-card-accent'];
  return colors[index % colors.length];
};
</script>

<style scoped>
.booking-view {
  padding: 40px;
  background-color: #EEEEEE;
  min-height: 100vh;
}

.home-view__header {
  text-align: center;
  margin-bottom: 40px;
}

.home-title-wrapper {
  color: #424242;
  font-size: 32px;
  margin-bottom: 15px;
  font-weight: 600;
}

.home-view__subtitle {
  font-size: 18px;
  color: #9E9E9E;
}

.home-view__sections {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 25px;
  margin-top: 40px;
  padding: 0 20px;
}

.section-card {
  width: 320px;
  min-height: 200px;
  padding: 25px;
  border-radius: 16px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  transition: all 0.3s ease;
  cursor: pointer;
  text-align: left;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
}

.section-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.zone-card-primary {
  background: linear-gradient(135deg, #3F51B5, #673AB7);
}

.zone-card-primary::before {
  background: linear-gradient(90deg, #03DAC5, #018786);
}

.zone-card-secondary {
  background: linear-gradient(135deg, #FF6200EE, #FF3700B3);
}

.zone-card-secondary::before {
  background: linear-gradient(90deg, #FFBB86FC, #FF03DAC5);
}

.zone-card-accent {
  background: linear-gradient(135deg, #4CAF50, #2E7D32);
}

.zone-card-accent::before {
  background: linear-gradient(90deg, #8BC34A, #689F38);
}

.section-card h3 {
  margin: 0 0 12px;
  font-size: 20px;
  font-weight: 600;
  color: white;
}

.section-card p {
  margin: 4px 0;
  font-size: 14px;
  opacity: 0.9;
}

.price {
  font-weight: 600;
  font-size: 16px !important;
}

.computers {
  color: #4CAF50 !important;
  font-weight: 500;
}

.section-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}

.zone-description-block {
  margin-top: 15px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  font-size: 13px;
  opacity: 0.8;
  width: 100%;
}

.time-selection {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.time-selection-card {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.time-selection-card h2 {
  color: #424242;
  margin-bottom: 30px;
  font-weight: 600;
}

.time-input-group {
  margin-bottom: 25px;
  text-align: left;
  width: 100%;
}

.time-input-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #424242;
}

.time-input {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border-radius: 12px;
  border: 2px solid #E0E0E0;
  background-color: #FAFAFA;
  transition: all 0.3s ease;
  color: #424242;
}

.time-input:focus {
  border-color: #3F51B5;
  outline: none;
  box-shadow: 0 0 0 3px rgba(63, 81, 181, 0.1);
}

.selection-summary {
  margin: 25px 0;
  padding: 20px;
  background: #F5F5F5;
  border-radius: 12px;
  text-align: left;
}

.selection-summary p {
  margin: 8px 0;
  color: #424242;
}

.btn-next {
  padding: 15px 30px;
  background: linear-gradient(135deg, #3F51B5, #673AB7);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  width: 100%;
}

.btn-next:hover {
  background: linear-gradient(135deg, #303F9F, #5E35B1);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(63, 81, 181, 0.3);
}

.pc-list > h2 {
  text-align: center;
  color: #424242;
  margin-bottom: 30px;
  font-weight: 600;
}

.pc-cards {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 25px;
  margin-top: 30px;
  padding: 0 20px;
}

.pc-card {
  width: 320px;
  min-height: 280px;
  background: linear-gradient(135deg, #424242, #616161);
  cursor: pointer;
  align-items: flex-start;
  padding: 25px;
}

.pc-card::before {
  background: linear-gradient(90deg, #3F51B5, #673AB7);
}

.pc-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}

.pc-specs {
  list-style: none;
  padding-left: 0;
  margin-top: 15px;
  width: 100%;
}

.pc-specs li {
  font-size: 14px;
  margin-bottom: 8px;
  opacity: 0.9;
  padding: 4px 0;
}

.pc-price {
  font-weight: 600;
  font-size: 16px !important;
  color: #4CAF50 !important;
  margin-top: 10px !important;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  padding-top: 10px !important;
}

.confirmation {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.confirmation-card {
  background: white;
  padding: 50px 40px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.confirmation-card h2 {
  color: #4CAF50;
  margin-bottom: 20px;
  font-weight: 600;
}

.confirmation-details {
  background: #F5F5F5;
  padding: 20px;
  border-radius: 12px;
  margin: 25px 0;
  text-align: left;
}

.confirmation-details p {
  color: #424242;
  margin: 0;
  line-height: 1.5;
  white-space: pre-line;
}

.btn-back {
  padding: 12px 24px;
  background: linear-gradient(135deg, #3F51B5, #673AB7);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-back:hover {
  background: linear-gradient(135deg, #303F9F, #5E35B1);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(63, 81, 181, 0.3);
}

@media (max-width: 768px) {
  .booking-view {
    padding: 20px;
  }

  .home-view__sections,
  .pc-cards {
    gap: 20px;
  }

  .section-card,
  .pc-card {
    width: 100%;
    max-width: 350px;
  }

  .time-selection-card,
  .confirmation-card {
    margin: 0 20px;
    padding: 30px 25px;
  }

  .home-title-wrapper {
    font-size: 28px;
  }
}
</style>