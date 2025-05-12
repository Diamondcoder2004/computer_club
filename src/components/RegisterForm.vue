<template>
  <div class="registerForm">
    <h1>Регистрация</h1>
    <form @submit.prevent="handleSubmit">
      <label for="firstName">First Name</label>
      <my-input type="text" id="firstName" v-model="formData.firstName" required />

      <label for="lastName">Last Name</label>
      <my-input type="text" id="lastName" v-model="formData.lastName" required />

      <label for="username">Username</label>
      <my-input type="text" id="username" v-model="formData.username" required />

      <label for="password">Password</label>
      <my-input type="password" id="password" v-model="formData.password" required />

      <label for="phone_number">Phone number</label>
      <my-input type="tel" id="phone_number" v-model="formData.phone_number" required />

      <label for="email">Email</label>
      <my-input type="email" id="email" v-model="formData.email" required />

      <div class="butt_container">
      <my-button type="submit">Зарегистрироваться</my-button>
      </div>

    </form>
    <p>Уже есть аккаунт? <a href="/">Войдите здесь</a> </p>
  </div>

</template>

<script>
import MyInput from "@/components/UI/MyInput.vue";
import MyButton from "@/components/UI/MyButton.vue";

export default {
  components: {MyButton, MyInput},

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
        const response = await fetch('http://localhost:3001/user/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.formData),
        });

        const result = await response.json();

        if (response.ok) {
          alert(result.message || 'Registration successful!');
          this.$router.push('/'); // Перенаправление на страницу входа
        } else {
          alert(result.message || 'Registration failed. Please try again.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
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
  margin-bottom: 10px;
  color: #5b6574;
}

.butt_container{
  display: flex; /* Включаем Flexbox */
  justify-content: center; /* Выравнивание по горизонтали */


}
.registerForm input {
  margin-bottom: 10px;
  margin-left: 20px;

}
.registerForm button {
  width: 90%;
  padding: 15px;
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

</style>