
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
</style>