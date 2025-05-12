<template>
  <div class="home-view__title">
    <div class="title__title">
      <h4>
        Компьютерный клуб 228
      </h4>
    </div>
    <div class="title__info">

      <router-link to="/profile" class="btn-profile">Личный кабинет</router-link>
    </div>
  </div>
</template>

<script setup>

</script>


<style scoped>
.home-view__title {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  padding: 10px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background: #C19570;
  display: flex;
  justify-content: space-between; /* Распределение элементов по краям */
  align-items: center;
}

.title__title {
  margin-left: 10px;
  padding-inline: 100px;
  color: #EBEBDF;
}

.title__info {
  display: flex;
  gap: 10px;
  margin-right: 20px;
}

.btn-profile {
  text-decoration: none;
  padding: 6px 12px;
  font-size: 14px;
  color: #fff;
  background-color: #8B5E3C;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.btn-profile:hover {
  background-color: #A67B5B;
}
</style>




