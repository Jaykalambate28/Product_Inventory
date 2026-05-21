<script setup>

const { canEditInventory, canAccessSales, username, role, logout } = useAuth()

const model = ref('')
const count = ref(0)

const products = ref([])

const fetchProducts = async () => {

  products.value = await $fetch('/api/inventory')
}

onMounted(() => {
  fetchProducts()
})

const addProduct = async () => {

  if (!model.value || count.value <= 0) {
    alert('Invalid inputs')
    return
  }

  await $fetch('/api/inventory', {
    method: 'POST',
    body: {
      model: model.value,
      count: count.value
    }
  })

  model.value = ''
  count.value = 0

  fetchProducts()
}

const deleteProduct = async (id) => {

  await $fetch(`/api/inventory/${id}`, {
    method: 'DELETE'
  })

  fetchProducts()
}

const editProduct = async (product) => {

  const newModel =
    prompt('Enter new model', product.model)

  const newCount =
    prompt('Enter new count', product.count)

  if (!newModel || newCount < 0)
    return

  await $fetch(`/api/inventory/${product.id}`, {
    method: 'PUT',
    body: {
      model: newModel,
      count: newCount
    }
  })

  fetchProducts()
}

</script>

<template>

<div class="page">

  <nav class="navbar">
    <div class="nav-left">
      <strong>Inventory & Sales</strong>
    </div>
    <div class="nav-links">
      <NuxtLink to="/inventory" class="nav-link active-link">Inventory</NuxtLink>
      <NuxtLink v-if="canAccessSales" to="/sales" class="nav-link">Sales</NuxtLink>
    </div>
    <div class="nav-right">
      <span class="user-info">{{ username }} ({{ role }})</span>
      <button class="logout-btn" @click="logout">Logout</button>
    </div>
  </nav>

  <div class="container">

    <h1>Inventory Management</h1>

    <div v-if="canEditInventory" class="form">

      <input
        v-model="model"
        placeholder="Model Name"
      />

      <input
        v-model="count"
        type="number"
        placeholder="Count"
      />

      <button @click="addProduct">
        Add Product
      </button>

    </div>

    <table border="1">

      <thead>
        <tr>
          <th>Product ID</th>
          <th>Model</th>
          <th>Count</th>
          <th v-if="canEditInventory">Actions</th>
        </tr>
      </thead>

      <tbody>

        <tr
          v-for="product in products"
          :key="product.id"
        >

          <td>{{ product.product_id }}</td>
          <td>{{ product.model }}</td>
          <td>{{ product.count }}</td>

          <td v-if="canEditInventory">

            <button
              @click="editProduct(product)"
            >
              Edit
            </button>

            <button
              @click="deleteProduct(product.id)"
            >
              Delete
            </button>

          </td>

        </tr>

      </tbody>

    </table>

  </div>

</div>

</template>

<style scoped>

.page {
  min-height: 100vh;
  background: #f0f2f5;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 12px 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.nav-left strong {
  font-size: 18px;
}

.nav-links {
  display: flex;
  gap: 15px;
}

.nav-link {
  text-decoration: none;
  color: #555;
  padding: 6px 14px;
  border-radius: 4px;
}

.nav-link:hover {
  background: #e8e8e8;
}

.active-link {
  background: #4a90d9;
  color: #fff;
}

.active-link:hover {
  background: #357abd;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info {
  font-size: 14px;
  color: #555;
}

.logout-btn {
  padding: 6px 14px;
  background: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}

.logout-btn:hover {
  background: #c0392b;
}

.container {
  max-width: 900px;
  margin: auto;
  padding: 20px;
}

.form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

input {
  padding: 10px;
}

button {
  padding: 10px 15px;
  cursor: pointer;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
}

th, td {
  padding: 10px;
  text-align: center;
}

</style>