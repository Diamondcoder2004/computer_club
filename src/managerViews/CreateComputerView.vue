<template>
  <div class="add-computer">
    <h2>Добавить новый компьютер</h2>

    <form @submit.prevent="addComputer" class="computer-form">
      <!-- Выбор зоны -->
      <div class="form-group">
        <label for="zone">Зона:</label>
        <select id="zone" v-model="formData.input_zone_name" required>
          <option disabled value="">-- Выберите зону --</option>
          <option v-for="zone in zones" :key="zone.zone_name" :value="zone.zone_name">
            {{ zone.zone_name }}
          </option>
        </select>
      </div>

      <!-- Название ПК -->
      <div class="form-group">
        <label for="computerName">Название компьютера:</label>
        <input
            type="text"
            id="computerName"
            v-model="formData.input_computer_name"
            placeholder="Введите имя ПК (например, PC-09)"
            required
        />
      </div>

      <!-- Процессор -->
      <div class="form-group">
        <label for="processor">Процессор:</label>
        <input
            type="text"
            id="processor"
            v-model="formData.input_processor"
            placeholder="Intel i7 12700H"
            required
        />
      </div>

      <!-- RAM -->
      <div class="form-group">
        <label for="ram">Оперативная память:</label>
        <input
            type="text"
            id="ram"
            v-model="formData.input_ram"
            placeholder="16GB"
            required
        />
      </div>

      <!-- GPU -->
      <div class="form-group">
        <label for="gpu">Видеокарта:</label>
        <input
            type="text"
            id="gpu"
            v-model="formData.input_gpu"
            placeholder="RTX 5090"
            required
        />
      </div>

      <!-- Кнопка отправки -->
      <button type="submit" class="btn-submit">Добавить компьютер</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import apiClient from '@/services/apiClient';

const formData = ref({
  input_computer_name: '',
  input_processor: '',
  input_ram: '',
  input_gpu: '',
  input_zone_name: ''
});

const zones = ref([]);

// Загрузка доступных зон
const loadZones = async () => {
  try {
    const response = await apiClient.get('/api/function/available-zones');
    zones.value = response.data;
  } catch (error) {
    console.error('Не удалось загрузить список зон', error);
  }
};

loadZones();

// Отправка формы
const addComputer = async () => {
  try {
    const response = await apiClient.post('/api/proc/create-computer', formData.value);

    alert(`Компьютер ${formData.value.input_computer_name} успешно добавлен`);
    console.log('Успешный ответ:', response.data);

    // Сброс формы
    formData.value = {
      input_computer_name: '',
      input_processor: '',
      input_ram: '',
      input_gpu: '',
      input_zone_name: ''
    };
  } catch (error) {
    console.error('Ошибка при добавлении компьютера:', error);
    alert('Не удалось добавить компьютер. Проверьте данные и попробуйте снова.');
  }
};
</script>

<style scoped>
.add-computer {
  padding: 40px;
  max-width: 600px;
  margin: auto;
}

.computer-form h2 {
  text-align: center;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

input,
select {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn-submit {
  display: block;
  width: 100%;
  padding: 12px;
  background-color: #8B5E3C;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-submit:hover {
  background-color: #70482c;
}
</style>