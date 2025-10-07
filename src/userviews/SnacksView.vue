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
            class="product-card section-card"
            :class="getProductCardClass(product.category)"
            @click="selectProduct(product)"
        >
          <h3>{{ product.product_name }}</h3>
          <p class="category">Категория: {{ getCategoryLabel(product.category) }}</p>
          <p class="price">Цена: {{ product.price }} ₽</p>
          <p class="stock" :class="getStockClass(product.stock_quantity)">
            В наличии: {{ product.stock_quantity }} шт.
          </p>
        </div>
      </div>
    </main>

    <!-- Шаг 2: Ввод количества -->
    <main class="quantity-input" v-else-if="step === 'quantity'">
      <div class="quantity-card">
        <h2>Сколько "{{ selectedProduct.product_name }}" вы хотите?</h2>
        <div class="input-group">
          <input
              type="number"
              v-model.number="quantity"
              min="1"
              :max="selectedProduct.stock_quantity"
              class="quantity-input-field"
          />
          <div class="input-actions">
            <button @click="decrementQuantity" class="btn-quantity" :disabled="quantity <= 1">-</button>
            <button @click="incrementQuantity" class="btn-quantity" :disabled="quantity >= selectedProduct.stock_quantity">+</button>
          </div>
        </div>
        <p class="max-quantity">Максимум: {{ selectedProduct.stock_quantity }}</p>
        <div class="price-summary">
          <p>Сумма: <strong>{{ totalPrice }} ₽</strong></p>
        </div>
        <button @click="placeOrder" class="btn-confirm">Подтвердить заказ</button>
      </div>
    </main>

    <!-- Шаг 3: Подтверждение заказа -->
    <main class="confirmation" v-else-if="step === 'confirmation'">
      <div class="confirmation-card">
        <h2>Заказ оформлен!</h2>
        <p class="order-details">
          Вы заказали <strong>{{ quantity }} x {{ selectedProduct.product_name }}</strong>
        </p>
        <p class="total-amount">Общая сумма: <strong>{{ totalPrice }} ₽</strong></p>
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

const step = ref('products');
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
  quantity.value = 1;
  step.value = 'quantity';
};

// Управление количеством
const incrementQuantity = () => {
  if (quantity.value < selectedProduct.value.stock_quantity) {
    quantity.value++;
  }
};

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
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

// Получаем класс для карточки товара в зависимости от категории
const getProductCardClass = (category) => {
  switch (category) {
    case 'Snack':
      return 'snack-card';
    case 'Drink':
      return 'drink-card';
    default:
      return 'other-card';
  }
};

// Получаем класс для отображения остатка
const getStockClass = (stock) => {
  if (stock === 0) return 'out-of-stock';
  if (stock < 5) return 'low-stock';
  return 'in-stock';
};

// Автоматически загружаем товары при монтировании
onMounted(() => {
  loadProducts();
});
</script>

<style scoped>
.snacks-view {
  padding: 40px;
  background-color: #EEEEEE;
  min-height: 100vh;
}

.snacks-header {
  text-align: center;
  margin-bottom: 40px;
}

.snacks-header h1 {
  font-size: 28px;
  color: #424242;
  margin-bottom: 10px;
  font-weight: 600;
}

.snacks-header p {
  font-size: 18px;
  color: #9E9E9E;
}

.product-list h2 {
  text-align: center;
  color: #424242;
  margin-bottom: 30px;
  font-weight: 600;
}

.product-cards {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 25px;
  margin-top: 30px;
}

.product-card {
  width: 280px;
  min-height: 180px;
  padding: 25px;
  border-radius: 16px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  cursor: pointer;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
}

.product-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.snack-card {
  background: linear-gradient(135deg, #FF6200EE, #FF3700B3);
}

.snack-card::before {
  background: linear-gradient(90deg, #FFBB86FC, #FF03DAC5);
}

.drink-card {
  background: linear-gradient(135deg, #3F51B5, #673AB7);
}

.drink-card::before {
  background: linear-gradient(90deg, #03DAC5, #018786);
}

.other-card {
  background: linear-gradient(135deg, #757575, #616161);
}

.other-card::before {
  background: linear-gradient(90deg, #9E9E9E, #757575);
}

.product-card h3 {
  margin: 0 0 12px;
  font-size: 20px;
  font-weight: 600;
  color: white;
}

.product-card p {
  margin: 4px 0;
  font-size: 14px;
  opacity: 0.9;
}

.product-card .category {
  font-weight: 500;
}

.product-card .price {
  font-size: 16px;
  font-weight: 600;
  margin: 8px 0;
}

.stock.in-stock {
  color: #4CAF50;
}

.stock.low-stock {
  color: #FF9800;
  font-weight: 600;
}

.stock.out-of-stock {
  color: #F44336;
  font-weight: 600;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}

.quantity-input {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.quantity-card {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.quantity-card h2 {
  color: #424242;
  margin-bottom: 30px;
  font-weight: 600;
}

.input-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}

.quantity-input-field {
  width: 120px;
  padding: 15px;
  font-size: 18px;
  text-align: center;
  border: 2px solid #E0E0E0;
  border-radius: 12px;
  background-color: #FAFAFA;
  font-weight: 600;
  color: #424242;
}

.quantity-input-field:focus {
  border-color: #3F51B5;
  outline: none;
  box-shadow: 0 0 0 3px rgba(63, 81, 181, 0.1);
}

.input-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.btn-quantity {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #3F51B5, #673AB7);
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-quantity:hover:not(:disabled) {
  background: linear-gradient(135deg, #303F9F, #5E35B1);
  transform: scale(1.05);
}

.btn-quantity:disabled {
  background: #B0BEC5;
  cursor: not-allowed;
  transform: none;
}

.max-quantity {
  color: #9E9E9E;
  margin-bottom: 15px;
}

.price-summary {
  margin: 20px 0;
  padding: 15px;
  background: #F5F5F5;
  border-radius: 12px;
}

.price-summary p {
  margin: 0;
  font-size: 18px;
  color: #424242;
}

.btn-confirm {
  padding: 15px 30px;
  background: linear-gradient(135deg, #4CAF50, #2E7D32);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  width: 100%;
}

.btn-confirm:hover {
  background: linear-gradient(135deg, #43A047, #1B5E20);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.3);
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
  max-width: 450px;
  width: 100%;
}

.confirmation-card h2 {
  color: #4CAF50;
  margin-bottom: 20px;
  font-weight: 600;
}

.order-details {
  font-size: 18px;
  color: #424242;
  margin-bottom: 10px;
}

.total-amount {
  font-size: 20px;
  color: #424242;
  margin-bottom: 30px;
  font-weight: 600;
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
  .snacks-view {
    padding: 20px;
  }

  .product-cards {
    gap: 20px;
  }

  .product-card {
    width: 100%;
    max-width: 300px;
  }

  .quantity-card,
  .confirmation-card {
    margin: 0 20px;
    padding: 30px 25px;
  }

  .input-group {
    flex-direction: column;
    gap: 10px;
  }

  .input-actions {
    flex-direction: row;
  }
}
</style>