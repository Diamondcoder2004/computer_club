

<template>
  <div class="home-view">
    <home-title>

    </home-title>
    <div class="home-view__header">
      <h2>Личный кабинет</h2>
    </div>
    <user-info>

    </user-info>
  </div>
</template>

<script >


import HomeTitle from "@/components/HomeTitle.vue";
import UserInfo from "@/components/UserInfo.vue";
export default {
  name: 'ProfilePage',
  components: {UserInfo, HomeTitle}
}
</script>
<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f9f9f9;
  min-height: 100vh;
}

.home-view__header {
  margin-bottom: 20px;
  text-align: center;
}

.home-view__header h2 {
  font-size: 24px;
  color: #333;
}

</style>
