
<template >
  <input :value="modelValue" @input = "updateInput" class = "input" type = "text">
</template>
<script>
export default {
  name: "my-input",
  props: {
    modelValue: [String, Number],
  },
  methods: {
    updateInput(event){
      this.$emit("update:modelValue", event.target.value);
    }
  }

}
</script>
<style>
.input {
  width: 80%;
  height: 45px;
  border: 1px solid #dee0e4;
  padding: 0 15px;
  border-radius: 5px;
  font-size: 14px;
}
.input {
  width: 90%;
  height: 45px;
  border: 1px solid #dee0e4;
  padding: 0 15px;
  border-radius: 5px;
  font-size: 14px;
  background-color: #FAFAFA;
  transition: all 0.3s ease;
  box-sizing: border-box;
  color: #424242;
}

.input:focus {
  border-color: #3F51B5;
  background-color: white;
  outline: none;
  box-shadow: 0 0 0 3px rgba(63, 81, 181, 0.1);
}

.input::placeholder {
  color: #9E9E9E;
}
</style>