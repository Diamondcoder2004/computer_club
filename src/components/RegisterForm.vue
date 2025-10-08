<template>
  <div class="registerForm">
    <h1>Регистрация</h1>
    <form @submit.prevent="handleSubmit">
      <!-- First Name -->
      <label for="firstName">First Name</label>
      <my-input
          type="text"
          id="firstName"
          v-model="formData.firstName"
          :class="{ error: errors.firstName }"
          required
      />
      <div v-if="errors.firstName" class="error-message">{{ errors.firstName }}</div>

      <!-- Last Name -->
      <label for="lastName">Last Name</label>
      <my-input
          type="text"
          id="lastName"
          v-model="formData.lastName"
          :class="{ error: errors.lastName }"
          required
      />
      <div v-if="errors.lastName" class="error-message">{{ errors.lastName }}</div>

      <!-- Username -->
      <label for="username">Username</label>
      <my-input
          type="text"
          id="username"
          v-model="formData.username"
          :class="{ error: errors.username }"
          required
      />
      <div v-if="errors.username" class="error-message">{{ errors.username }}</div>

      <!-- Password -->
      <label for="password">Password</label>
      <my-input
          type="password"
          id="password"
          v-model="formData.password"
          :class="{ error: errors.password }"
          required
      />
      <div v-if="errors.password" class="error-message">{{ errors.password }}</div>

      <!-- Phone -->
      <label for="phone_number">Phone number</label>
      <my-input
          type="tel"
          id="phone_number"
          v-model="formData.phone_number"
          :class="{ error: errors.phone_number }"
          required
      />
      <div v-if="errors.phone_number" class="error-message">{{ errors.phone_number }}</div>

      <!-- Email -->
      <label for="email">Email</label>
      <my-input
          type="email"
          id="email"
          v-model="formData.email"
          :class="{ error: errors.email }"
          required
      />
      <div v-if="errors.email" class="error-message">{{ errors.email }}</div>

      <div class="butt_container">
        <my-button type="submit">Зарегистрироваться</my-button>
      </div>
    </form>
    <p>Уже есть аккаунт? <a href="/">Войдите здесь</a></p>
  </div>
</template>

<script>
import MyInput from "@/components/UI/MyInput.vue";
import MyButton from "@/components/UI/MyButton.vue";
import apiClient from "@/services/apiClient";

export default {
  components: { MyButton, MyInput },
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
      errors: {
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
    clearErrors() {
      Object.keys(this.errors).forEach(key => {
        this.errors[key] = '';
      });
    },

    validateFields() {
      this.clearErrors();
      let isValid = true;

      const namePattern = /^[а-яА-ЯёЁa-zA-Z\s\-.]{2,}$/;
      const usernamePattern = /^[a-zA-Z0-9_.-]{3,}$/;
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // First Name
      if (!this.formData.firstName.trim()) {
        this.errors.firstName = "Имя обязательно";
        isValid = false;
      } else if (!namePattern.test(this.formData.firstName)) {
        this.errors.firstName = "Имя может содержать только буквы, пробелы, точки и дефисы";
        isValid = false;
      }

      // Last Name
      if (!this.formData.lastName.trim()) {
        this.errors.lastName = "Фамилия обязательна";
        isValid = false;
      } else if (!namePattern.test(this.formData.lastName)) {
        this.errors.lastName = "Фамилия может содержать только буквы, пробелы, точки и дефисы";
        isValid = false;
      }

      // Username
      if (!this.formData.username.trim()) {
        this.errors.username = "Никнейм обязателен";
        isValid = false;
      } else if (!usernamePattern.test(this.formData.username)) {
        this.errors.username = "Никнейм должен быть минимум 3 символа и содержать английские буквы, цифры, _, -, .";
        isValid = false;
      }

      // Password
      if (!this.formData.password) {
        this.errors.password = "Пароль обязателен";
        isValid = false;
      }

      // Phone — базовая проверка (можно улучшить)
      const phone = this.formData.phone_number.trim();
      if (!phone) {
        this.errors.phone_number = "Телефон обязателен";
        isValid = false;
      } else {
        // Простая проверка: только цифры, +, пробелы, скобки, дефисы
        const phonePattern = /^[+]?[0-9\s\-()]{10,15}$/;
        if (!phonePattern.test(phone)) {
          this.errors.phone_number = "Неверный формат телефона";
          isValid = false;
        }
      }

      // Email
      if (!this.formData.email.trim()) {
        this.errors.email = "Email обязателен";
        isValid = false;
      } else if (!emailPattern.test(this.formData.email)) {
        this.errors.email = "Неверный формат email";
        isValid = false;
      }

      return isValid;
    },

    async handleSubmit() {
      if (!this.validateFields()) {
        return; // Остановка, если есть ошибки
      }

      try {
        const response = await apiClient.post('/user/register', this.formData);
        alert(response.data.message || 'Регистрация успешна!');
        this.$router.push('/');
      } catch (error) {
        console.error('Ошибка при регистрации:', error);

        // Обработка серверных ошибок (например, USERNAME_EXISTS)
        const errorCode = error.response?.data?.code;
        const errorMessage = error.response?.data?.error || 'Ошибка регистрации. Попробуйте позже.';

        // Сброс всех ошибок и установка конкретной
        this.clearErrors();

        if (errorCode === 'USERNAME_EXISTS') {
          this.errors.username = 'Это имя пользователя занято';
        } else if (errorCode === 'EMAIL_EXISTS') {
          this.errors.email = 'Этот email уже зарегистрирован';
        } else if (errorCode === 'PHONE_EXISTS') {
          this.errors.phone_number = 'Этот телефон уже используется';
        } else {
          alert(errorMessage);
        }
      }
    },
  },
};
</script>

<style scoped>

.registerForm{
  width: 500px;
  align-items: center;
  background-color: #ffffff;
  box-shadow: 0 0 9px 0 rgba(0, 0, 0, 0.3);
  margin: 50px auto;
  border-radius: 8px;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "segoe ui", roboto, oxygen, ubuntu, cantarell, "fira sans", "droid sans", "helvetica neue", Arial, sans-serif;
  font-size: 16px;
}
.registerForm form {
  padding: 30px ; /* Добавляем отступы слева и справа */
}

.registerForm h1 {
  text-align: center;
  color: #5b6574;
  font-size: 24px;
  padding: 20px 0;
  border-bottom: 1px solid #dee0e4;
}
.registerForm label {
  display: flex;
  align-items: center;
  margin-left: 20px;
  width: 100%;
  font-weight: bold;
  color: #5b6574;
}

.butt_container{
  display: flex; /* Включаем Flexbox */
  justify-content: center; /* Выравнивание по горизонтали */


}
.registerForm input {
  margin-bottom: 5px;
  margin-left: 20px;
}
.registerForm button {
  width: 90%;
  margin-top: 15px;
  background-color: #3274d6;
  border: none;
  cursor: pointer;
  color: #ffffff;
  transition: background-color 0.3s ease;
  border-radius: 5px;
  font-size: 16px;

}
.registerForm p {
  text-align: center;
  color: #5b6574;
  font-size: 16px;
  margin-top: 10px;
}

.error-message {
  color: #d32f2f;
  background-color: rgba(246, 161, 161, 0.3);
  padding: 8px 12px;
  margin: 5px 20px 15px;
  border-radius: 4px;
  border: 1px solid #ff0018;
  font-size: 14px;
  text-align: left;
}

/* Подсветка поля с ошибкой (если MyInput поддерживает класс) */
.my-input.error {
  border-color: #ff0018;
}
</style>