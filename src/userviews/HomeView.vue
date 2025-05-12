<template>
  <div class="home-view">
    <!-- Заголовок -->
    <div class="home-title-wrapper ">
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
  </div>
</template>
<script setup>
import HomeTitle from "@/components/HomeTitle.vue";
</script>
<style scoped>

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
  flex-wrap: wrap; /* Для мобильных устройств */
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

</style>

