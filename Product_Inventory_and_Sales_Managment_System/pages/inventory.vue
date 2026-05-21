<script setup>

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

<div class="container">

  <h1>Inventory Management</h1>

  <div class="form">

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
        <th>Actions</th>
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

        <td>

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

</template>

<style scoped>

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
}

th, td {
  padding: 10px;
  text-align: center;
}

</style>