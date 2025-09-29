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
  import { defineComponent } from "vue";
  import MyInput from "@/components/UI/MyInput.vue";
  import loginService from "@/services/loginService"; // ✅ Импортируем сервис

  export default defineComponent({
  components: { MyInput },
  data() {
  return {
  credentials: {
  username: "",
  password: "",
},
  errorMessage: "",
};
},
  methods: {
    async handleLogin() {
      this.errorMessage = ""; // Сброс ошибки перед запросом

      const result = await loginService.login(this.credentials);

      if (!result.success) {
        this.errorMessage = result.message;
        return;
      }

      const data = result.data;

      if (!data.user) {
        this.errorMessage = "Сервер не вернул данные пользователя";
        return;
      }

      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("username", data.user.username);
      localStorage.setItem("firstName", data.user.firstName);
      localStorage.setItem("lastName", data.user.lastName);
      localStorage.setItem("role_id", data.user.role_id); // Сохраняем роль

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Определяем, куда перейти
      if (data.user.role_id == 3) {
        this.$router.push({ name: "Home" });
      } else {
        this.$router.push({ name: "ManagePage" });
      }
    },
  },
  });

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
