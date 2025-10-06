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
          class="section-card booking-card"
          @click="selectZone(zone)"
      >
        <h3>{{ zone.zone_name }}</h3>
        <p>Стоимость: {{ zone.hourly_rate }} ₽/час</p>
        <p>Готовые ПК: {{ zone.ready_computers_count }}</p>
        <div class="zone-description-block">
          <p><strong>Описание:</strong></p>
          <p>{{ zone.description || 'Нет описания.' }}</p>
        </div>
      </div>
    </main>

    <!-- Шаг 2: Ввод времени и количества часов -->
    <main class="time-selection" v-else-if="step === 'time'">
      <h2>Выберите время и продолжительность</h2>

      <div class="time-input-group">
        <label for="start-time">Начало бронирования:</label>
        <input
            id="start-time"
            type="datetime-local"
            v-model="startTime"
            :min="minDateTime"
        />
      </div>

      <div class="time-input-group">
        <label for="play-hours">Продолжительность (часов):</label>
        <input
            id="play-hours"
            type="number"
            v-model.number="playHours"
            min="1"
        />
      </div>

      <button @click="loadAvailablePCs" class="btn-next">Продолжить</button>
    </main>

    <!-- Шаг 3: Список доступных ПК -->
    <main class="pc-list" v-else-if="step === 'pcs'">
      <h2>Доступные компьютеры в зоне "{{ selectedZone.zone_name }}"</h2>
      <div class="pc-cards">
        <div
            v-for="(pc, index) in pcs"
            :key="index"
            class="pc-card section-card booking-card"
            @click="confirmBooking(pc)"
        >
          <h3>{{ pc.computer_name }}</h3>
          <ul>
            <li>Процессор: {{ pc.processor }}</li>
            <li>RAM: {{ pc.ram }}</li>
            <li>Видеокарта: {{ pc.gpu }}</li>
            <li>Свободен с: {{ formatTime(pc.start_time) }}</li>
            <li>На {{ pc.play_hours }} ч.</li>
            <li>Стоимость: {{ pc.total_price }} ₽</li>
          </ul>
        </div>
      </div>
    </main>

    <!-- Шаг 4: Подтверждение бронирования -->
    <main class="confirmation" v-else-if="step === 'confirmation'">
      <div class="confirmation-card section-card booking-card">
        <h2>Бронирование подтверждено!</h2>
        <p>Вы забронировали {{ confirmationMessage }}</p>
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
</script>

<style scoped>
.time-input-group {
  margin-bottom: 20px;
  text-align: left;
  width: 100%;
  max-width: 300px;
}

.time-input-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.time-input-group input[type="datetime-local"],
.time-input-group input[type="number"] {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
}
.pc-list > h2{
  text-align: center;
}
.section-card {
  width: 280px;
  min-height: 160px;
  padding: 20px;
  border-radius: 10px;
  text-decoration: none;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.section-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.booking-card {
  background-color: #8B5E3C; /* Темно-коричневый цвет */
}

.home-view__sections {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  margin-top: 40px;
  padding: 0 20px;
}

.booking-view {
  padding: 40px;
}

.home-title-wrapper {
  margin-bottom: 60px;
  text-align: center;
}

.home-view__subtitle {
  text-align: center;
  font-size: 18px;
  color: #666;
}

.time-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.btn-next {
  padding: 12px 24px;
  background-color: #5D4037;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-next:hover {
  background-color: #4e342e;
}

.pc-cards {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 30px;
  margin-top: 40px;
}

.pc-card {
  width: 300px;
  min-height: 200px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.pc-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.pc-card ul {
  list-style: none;
  padding-left: 0;
  margin-top: 10px;
}

.pc-card li {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 5px;
}

.confirmation-card {
  width: 100%;
  text-align: center;
}

.btn-back {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #795548;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.zone-description-block {
  margin-top: 12px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 13px;
  opacity: 0.7;
}
</style>