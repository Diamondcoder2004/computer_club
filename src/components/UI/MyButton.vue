<template >
  <button class="btn" :class="variant">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "my-button",
  props: {
    variant: {
      type: String,
      default: "primary"
    }
  }
}
</script>

<style scoped>
.btn {
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn.primary {
  background: linear-gradient(135deg, #3F51B5, #673AB7);
  color: white;
}

.btn.primary:hover {
  background: linear-gradient(135deg, #303F9F, #5E35B1);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(63, 81, 181, 0.3);
}

.btn.secondary {
  background-color: #B0BEC5;
  color: white;
}

.btn.secondary:hover {
  background-color: #90A4AE;
  transform: translateY(-2px);
}

.btn:disabled {
  background-color: #E0E0E0;
  color: #9E9E9E;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
</style>