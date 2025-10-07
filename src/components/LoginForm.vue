<template>
  <div class="login-form">
    <div class="login-header">
      <h1>Вход в систему</h1>
    </div>
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

      <div class="button-container">
        <button class="login-button" type="submit">Войти</button>
      </div>
    </form>

    <div class="register-link">
      <p>Еще нет аккаунта? <a href="/register">Зарегистрироваться</a></p>
    </div>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import MyInput from "@/components/UI/MyInput.vue";
import loginService from "@/services/loginService";

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
      this.errorMessage = "";
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
      localStorage.setItem("role_id", data.user.role_id);

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

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
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin: 100px auto;
  padding: 0;
  border-radius: 20px;
  overflow: hidden;
}

.login-header {
  background: linear-gradient(135deg, #3F51B5, #673AB7);
  padding: 30px 20px;
  text-align: center;
}

.login-header h1 {
  color: white;
  font-size: 24px;
  margin: 0;
  font-weight: 600;
}

.login-form form {
  padding: 30px;
}

.input-group {
  position: relative;
  margin-bottom: 25px;
}

.input-group i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #673AB7;
  font-size: 18px;
  z-index: 2;
  width: 20px;
  text-align: center;
}

/* Исправление: текст начинается через 15px после иконки */
.input-group input {
  width: 100%;
  height: 50px;
  border: 2px solid #EEEEEE;
  padding: 0 15px 0 50px; /* 15px слева + 20px иконка + 15px отступ = 50px */
  font-size: 16px;
  box-sizing: border-box;
  border-radius: 12px;
  background-color: #FAFAFA;
  transition: all 0.3s ease;
  font-family: inherit;
  /* Сдвигаем текст вправо, чтобы начинался через 15px после иконки */
  text-indent: 0;
}

/* Альтернативный вариант с margin-left для иконки */
.input-group::after {
  content: '';
  position: absolute;
  left: 50px; /* 15px (отступ слева) + 20px (ширина иконки) + 15px (желаемый отступ) */
  top: 0;
  height: 100%;
  width: 1px;
}

.input-group input:focus {
  border-color: #3F51B5;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(63, 81, 181, 0.1);
  outline: none;
}

.input-group input::placeholder {
  color: #9E9E9E;
  opacity: 1;
}

/* Убедимся, что placeholder тоже начинается с правильного отступа */
.input-group input::-webkit-input-placeholder {
  padding-left: 0;
}

.input-group input::-moz-placeholder {
  padding-left: 0;
}

.input-group input:-ms-input-placeholder {
  padding-left: 0;
}

.input-group input::-ms-input-placeholder {
  padding-left: 0;
}

.login-button {
  width: 100%;
  padding: 15px;
  margin-top: 10px;
  background: linear-gradient(135deg, #3F51B5, #673AB7);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  color: #ffffff;
  font-size: 16px;
  transition: all 0.3s ease;
  font-family: inherit;
}

.login-button:hover {
  background: linear-gradient(135deg, #303F9F, #5E35B1);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(63, 81, 181, 0.3);
}

.login-button:active {
  transform: translateY(0);
}

.button-container {
  text-align: center;
}

.register-link {
  margin-top: 20px;
  text-align: center;
  padding: 20px;
  background-color: #F5F5F5;
  border-top: 1px solid #E0E0E0;
}

.register-link p {
  margin: 0;
  color: #424242;
}

.register-link a {
  text-decoration: none;
  color: #3F51B5;
  font-weight: 600;
}

.register-link a:hover {
  text-decoration: underline;
  color: #303F9F;
}

.error-message {
  color: #FFD32F2F;
  background-color: #FFEBEE;
  padding: 12px;
  margin: 0 30px 30px;
  border-radius: 8px;
  border: 1px solid #FFCDD2;
  text-align: center;
  font-weight: 500;
}

/* Адаптивность для мобильных устройств */
@media (max-width: 480px) {
  .login-form {
    width: 90%;
    margin: 50px auto;
  }

  .login-form form {
    padding: 20px;
  }

  .input-group input {
    height: 48px;
    font-size: 16px;
  }
}
</style>