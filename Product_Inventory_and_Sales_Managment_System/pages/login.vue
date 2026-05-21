<script setup>

import { useToast } from 'vue-toastification'

const toast = useToast()

const { login } = useAuth()

const username = ref('')
const password = ref('')
const errorMsg = ref('')
const loading = ref(false)

const handleLogin = async () => {

  errorMsg.value = ''
  loading.value = true

  try {

    const data = await login(
      username.value,
      password.value
    )


    // Redirect based on role
    if (data.role === 'sales') {

      navigateTo('/sales')
      toast.success('Login successful! Welcome to the Sales Dashboard.')

    } else {

      navigateTo('/inventory')
      toast.success('Login successful! Welcome to the Inventory Management.')
    }
    

  } catch (err) {

    const message =
      err?.data?.statusMessage || 'Login failed'

    errorMsg.value = message

    // Error toast
    toast.error(message)

  } finally {

    loading.value = false
  }
}

</script>

<template>

<div class="login-wrapper">

  <div class="login-card">

    <h1>Login</h1>
    <p class="subtitle">Product Inventory & Sales Management</p>

    <form @submit.prevent="handleLogin">

      <div class="field">
        <label>Username</label>
        <input
          v-model="username"
          type="text"
          placeholder="Enter username"
          required
        />
      </div>

      <div class="field">
        <label>Password</label>
        <input
          v-model="password"
          type="password"
          placeholder="Enter password"
          required
        />
      </div>

      <p v-if="errorMsg" class="error">{{ errorMsg }}</p>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>

    </form>

    <div class="credentials-info">
      <p><strong>Demo Credentials:</strong></p>
      <table>
        <tr>
          <td><strong>Admin:</strong></td>
          <td>admin / admin123</td>
        </tr>
        <tr>
          <td><strong>Manager:</strong></td>
          <td>manager / manager123</td>
        </tr>
        <tr>
          <td><strong>Sales:</strong></td>
          <td>sales / sales123</td>
        </tr>
      </table>
    </div>

  </div>

</div>

</template>

<style scoped>

.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f0f2f5;
}

.login-card {
  background: #afabab;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
}

h1 {
  margin: 0 0 5px 0;
  text-align: center;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
}

.field {
  margin-bottom: 18px;
}

.field label {
  display: block;
  margin-bottom: 6px;
  font-weight: bold;
  font-size: 14px;
}

.field input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.field input:focus {
  outline: none;
  border-color: #4a90d9;
}

button[type="submit"] {
  width: 100%;
  padding: 12px;
  background: #4a90d9;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 5px;
}

button[type="submit"]:hover {
  background: #357abd;
}

button[type="submit"]:disabled {
  background: #999;
  cursor: not-allowed;
}

.error {
  color: red;
  margin-bottom: 10px;
  font-size: 14px;
}

.credentials-info {
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  font-size: 13px;
  color: #555;
}

.credentials-info table {
  margin-top: 8px;
  width: 100%;
}

.credentials-info td {
  padding: 3px 5px;
}

</style>
