<template>
  <div class="home-view__title">
    <div class="title__title">
      <h4>Компьютерный клуб 228</h4>
    </div>
    <div class="title__info">
      <router-link to="/profile" class="btn-profile">
        <i class="fas fa-user"></i>
        Личный кабинет
      </router-link>
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
  z-index: 1000;
  padding: 12px 0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #3F51B5, #673AB7);
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(10px);
}

.title__title {
  margin-left: 20px;
  padding-inline: 20px;
}

.title__title h4 {
  color: white;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.title__info {
  display: flex;
  gap: 10px;
  margin-right: 20px;
}

.btn-profile {
  text-decoration: none;
  padding: 8px 16px;
  font-size: 14px;
  color: white;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  backdrop-filter: blur(10px);
}

.btn-profile:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.btn-profile i {
  font-size: 14px;
}

@media (max-width: 768px) {
  .title__title {
    margin-left: 10px;
    padding-inline: 10px;
  }

  .title__title h4 {
    font-size: 16px;
  }

  .btn-profile {
    padding: 6px 12px;
    font-size: 12px;
  }
}
</style>