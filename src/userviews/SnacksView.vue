<template>
  <div class="snacks-view">
    <header class="snacks-header">
      <h1>Выберите снэк или напиток</h1>
      <p>Оформите заказ, выбрав нужное количество</p>
    </header>

    <!-- Шаг 1: Список всех товаров -->
    <main class="product-list" v-if="step === 'products'">
      <h2>Все доступные товары</h2>
      <div class="product-cards">
        <div
            v-for="(product, index) in products"
            :key="index"
            class="product-card section-card snacks-card"
            @click="selectProduct(product)"
        >
          <h3>{{ product.product_name }}</h3>
          <p>Категория: {{ getCategoryLabel(product.category) }}</p>
          <p>Цена: {{ product.price }} ₽</p>
          <p>В наличии: {{ product.stock_quantity }} шт.</p>
        </div>
      </div>
    </main>

    <!-- Шаг 2: Ввод количества -->
    <main class="quantity-input" v-else-if="step === 'quantity'">
      <h2>Сколько "{{ selectedProduct.product_name }}" вы хотите?</h2>
      <input
          type="number"
          v-model.number="quantity"
          min="1"
          :max="selectedProduct.stock_quantity"
      />
      <p>Максимум: {{ selectedProduct.stock_quantity }}</p>
      <button @click="placeOrder" class="btn-confirm">Подтвердить заказ</button>
    </main>

    <!-- Шаг 3: Подтверждение заказа -->
    <main class="confirmation" v-else-if="step === 'confirmation'">
      <div class="confirmation-card section-card snacks-card">
        <h2>Заказ оформлен!</h2>
        <p>
          Вы заказали {{ quantity }} x {{ selectedProduct.product_name }}<br/>
          Общая сумма: {{ totalPrice }} ₽
        </p>
        <button @click="backToCategories" class="btn-back">Вернуться к списку товаров</button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apiClient from "@/services/apiClient";

import { computed } from 'vue';

const totalPrice = computed(() => {
  return selectedProduct.value && quantity.value > 0
      ? selectedProduct.value.price * quantity.value
      : 0;
});
const step = ref('products'); // Теперь всегда начинаем с продуктов
const products = ref([]);
const selectedProduct = ref(null);
const quantity = ref(1);

// Загрузка всех продуктов
const loadProducts = async () => {
  try {
    const response = await apiClient.get('/api/query/products');
    products.value = response.data;
  } catch (error) {
    console.error('Ошибка загрузки продуктов:', error);
    alert('Не удалось загрузить список товаров.');
  }
};

// Выбор товара
const selectProduct = (product) => {
  selectedProduct.value = product;
  step.value = 'quantity';
};

// Оформление заказа
const placeOrder = async () => {
  if (!selectedProduct.value || quantity.value <= 0) return;

  try {
    const response = await apiClient.post('/api/proc/purchase-product', {
      input_product_name: selectedProduct.value.product_name,
      input_quantity: quantity.value
    });

    console.log('Заказ успешно оформлен:', response.data);
    step.value = 'confirmation';
  } catch (error) {
    console.error('Ошибка при оформлении заказа:', error);

    // Проверяем текст ошибки от сервера
    if (error.response?.data?.error?.includes('Insufficient balance')) {
      alert('Недостаточно средств для покупки. Пополните баланс.');
    } else {
      alert(`Не удалось оформить заказ: ${error.message}`);
    }
  }
};

// Возврат к списку товаров
const backToCategories = () => {
  step.value = 'products';
  selectedProduct.value = null;
  quantity.value = 1;
};

// Получаем понятное название категории
const getCategoryLabel = (category) => {
  switch (category) {
    case 'Snack':
      return 'Снэк';
    case 'Drink':
      return 'Напиток';
    default:
      return 'Другое';
  }
};

// Автоматически загружаем товары при монтировании
onMounted(() => {
  loadProducts();
});
</script>

<style scoped>
.snacks-view {
  padding: 40px;
}

.snacks-header {
  text-align: center;
  margin-bottom: 40px;
}

.snacks-header h1 {
  font-size: 28px;
  color: #333;
}



.product-cards {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 30px;
  margin-top: 40px;
}

.product-card {
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

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.snacks-card {
  background-color: #C19570;
}

.quantity-input {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
}

.quantity-input input {
  padding: 10px;
  font-size: 18px;
  width: 100px;
  text-align: center;
}

.btn-confirm {
  padding: 12px 24px;
  background-color: #5D4037;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-confirm:hover {
  background-color: #4e342e;
}

.confirmation-card {
  width: 100%;
  text-align: center;
  padding: 40px 20px;
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
</style>