<template>
  <div class="login-form">
    <h1>Вход в систему</h1>
    <form @submit.prevent="handleLogin">
      <div class="input-group">
        <i class="fas fa-user"></i>
        <my-input
            type="text"
            name="username"
            placeholder="Логин"
            id="username"
            v-model="credentials.username"
        required
        />
      </div>

      <!-- Поле для пароля -->
      <div class="input-group">
        <i class="fas fa-lock"></i>
        <my-input
            type="password"
            name="password"
            placeholder="Пароль"
            id="password"
            v-model="credentials.password"
        required
        />
      </div>

      <!-- Кнопка отправки -->
      <div class="button-container">
        <button class="login-button" type="submit">Войти</button>
      </div>
    </form>

    <!-- Ссылка на регистрацию -->
    <div class="register-link">
      <p>Еще нет аккаунта? <a href="/register">Зарегистрироваться</a></p>
    </div>

    <!-- Сообщение об ошибке -->
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>



<script>
import MyInput from "@/components/UI/MyInput.vue";
import apiClient from "@/services/apiClient"; // ✅ Импорт apiClient

export default {
  components: {  MyInput },
  data() {
    return {
      formData: {
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        phone_number: '',
        email: '',
      },
    };
  },
  methods: {
    async handleSubmit() {
      try {
        const response = await apiClient.post('/user/register', this.formData);

        alert(response.data.message || 'Регистрация успешна!');
        this.$router.push('/'); // Перенаправление на страницу входа
      } catch (error) {
        console.error('Ошибка при регистрации:', error);

        const errorMessage = error.response?.data?.message
            || 'Ошибка регистрации. Попробуйте позже.';
        alert(errorMessage);
      }
    },
  },
};
</script>


<style>
.login-form {
  width: 400px;
  background-color: #ffffff;
  box-shadow: 0 0 9px 0 rgba(0, 0, 0, 0.3);
  margin: 100px auto;
  padding: 20px;
  border-radius: 10px;
}

.login-form h1 {
  text-align: center;
  color: #5b6574;
  font-size: 24px;
  padding: 20px 0;
  border-bottom: 1px solid #dee0e4;
}

.input-group {

  position: relative;
  margin-bottom: 20px;

}

.input-group i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #3274d6;
  font-size: 18px;
  pointer-events: none; /* Чтобы иконка не мешала взаимодействию */
}

.input-group input {
  width: 100%;
  height: 50px;
  border: 1px solid #dee0e4;
  padding-left: 50px; /* Отступ слева для текста */
  font-size: 16px;
  box-sizing: border-box; /* Учитываем padding при вычислении ширины */
}

.login-button {
  width: 100%;

  padding: 15px;
  margin-top: 20px;
  background-color: #3274d6;
  border: 0;
  cursor: pointer;
  font-weight: bold;
  color: #ffffff;
  transition: background-color 0.2s;
}

.login-button:hover {

  background-color: #2868c7;

}

.button-container {
  text-align: center;
}

.register-link {
  margin-top: 20px;
  text-align: center;
  padding: 10px;
  background-color: #f0f0f0;
  border: 1px solid #dee0e4;
  border-radius: 4px;
}

.register-link a {
  text-decoration: none;
  color: #3274d6;
  font-weight: bold;
}

.register-link a:hover {
  text-decoration: underline;
  color: #2868c7;
}
.error-message {
  color: red;
  text-align: center;
  margin-top: 10px;
}

</style>
