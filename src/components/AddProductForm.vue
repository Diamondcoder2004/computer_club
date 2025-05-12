<template>
  <div class="add-product-form">
    <h3>Добавить продукт</h3>

    <form @submit.prevent="submitProduct">
      <div class="form-group">
        <label>Название</label>
        <input v-model="form.product_name" type="text" required />
      </div>

      <div class="form-group">
        <label>Категория</label>
        <select v-model="form.category" required>
          <option value="">Выберите категорию</option>
          <option value="Drink">Напиток</option>
          <option value="Snack">Снэк</option>
          <option value="Other">Другое</option>
        </select>
      </div>

      <div class="form-group">
        <label>Цена (₽)</label>
        <input v-model.number="form.price" type="number" step="0.01" required />
      </div>

      <div class="form-group">
        <label>Объем/вес (мл/г)</label>
        <input v-model.number="form.volume" type="number" />
      </div>

      <div class="form-group">
        <label>Количество на складе</label>
        <input v-model.number="form.stock_quantity" type="number" />
      </div>

      <div class="form-group">
        <label>Минимальный остаток для поплнения</label>
        <input v-model.number="form.min_stock" type="number" />
      </div>

      <button type="submit" class="btn-submit">Добавить</button>
    </form>

    <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import apiClient from '@/services/apiClient.js';

const form = ref({
  product_name: '',
  category: '',
  price: null,
  volume: null,
  stock_quantity: 0,
  min_stock: 5
});

const successMessage = ref('');
const errorMessage = ref('');

const submitProduct = async () => {
  try {
    const response = await apiClient.post('/api/query/add-product', form.value);
    successMessage.value = 'Продукт успешно добавлен!';
    console.log('Добавлен продукт:', response.data);
    // Сброс формы
    form.value = {
      product_name: '',
      category: '',
      price: null,
      volume: null,
      stock_quantity: 0,
      min_stock: 5
    };
  } catch (err) {
    console.error(err);
    errorMessage.value = 'Ошибка при добавлении продукта.';
  }
};
</script>

<style scoped>
.add-product-form {
  max-width: 500px;
  margin: auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input,
select {
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn-submit {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.btn-submit:hover {
  background-color: #45a049;
}

.success-message {
  color: green;
  margin-top: 10px;
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>