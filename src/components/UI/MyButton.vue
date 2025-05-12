<template >
  <button class = "btn">
    <slot>

    </slot>
  </button>
</template>
<script>
export default {
  name: "my-button"
}
</script>
<style scoped>
.btn {
  border: 2px solid teal;
  background: none;
  color: teal;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 5px;
}
</style>