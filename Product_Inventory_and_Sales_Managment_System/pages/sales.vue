<script setup>

const selectedProductId = ref('')
const quantitySold = ref(1)
const errorMsg = ref('')

const sales = ref([])
const products = ref([])

const fetchSales = async () => {
  sales.value = await $fetch('/api/Sales')
}

const fetchProducts = async () => {
  products.value = await $fetch('/api/inventory')
}

onMounted(() => {
  fetchSales()
  fetchProducts()
})

const recordSale = async () => {

  errorMsg.value = ''

  if (!selectedProductId.value || quantitySold.value <= 0) {
    errorMsg.value = 'Please select a product and enter a valid quantity.'
    return
  }

  try {
    await $fetch('/api/Sales', {
      method: 'POST',
      body: {
        product_id: selectedProductId.value,
        quantity_sold: quantitySold.value
      }
    })

    selectedProductId.value = ''
    quantitySold.value = 1
    errorMsg.value = ''

    fetchSales()
    fetchProducts()
  } catch (err) {
    errorMsg.value = err?.data?.statusMessage || 'Failed to record sale'
  }
}

const deleteSale = async (id) => {

  if (!confirm('Are you sure you want to delete this sale record?'))
    return

  await $fetch(`/api/Sales/${id}`, {
    method: 'DELETE'
  })

  fetchSales()
}

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleString()
}

</script>

<template>

<div class="container">

  <h1>Sales Management</h1>

  <div class="form">

    <select v-model="selectedProductId">
      <option value="" disabled>Select Product</option>
      <option
        v-for="product in products"
        :key="product.product_id"
        :value="product.product_id"
        :disabled="product.count <= 0"
      >
        {{ product.model }} ({{ product.product_id }}) — Stock: {{ product.count }}
      </option>
    </select>

    <input
      v-model="quantitySold"
      type="number"
      min="1"
      placeholder="Quantity"
    />

    <button @click="recordSale">
      Record Sale
    </button>

  </div>

  <p v-if="errorMsg" class="error">{{ errorMsg }}</p>

  <table border="1">

    <thead>
      <tr>
        <th>Sale ID</th>
        <th>Product ID</th>
        <th>Model</th>
        <th>Qty Sold</th>
        <th>Sold At</th>
        <th>Actions</th>
      </tr>
    </thead>

    <tbody>

      <tr
        v-for="sale in sales"
        :key="sale.id"
      >

        <td>{{ sale.id }}</td>
        <td>{{ sale.product_id }}</td>
        <td>{{ sale.model }}</td>
        <td>{{ sale.quantity_sold }}</td>
        <td>{{ formatDate(sale.sold_at) }}</td>

        <td>
          <button
            @click="deleteSale(sale.id)"
          >
            Delete
          </button>
        </td>

      </tr>

      <tr v-if="sales.length === 0">
        <td colspan="6">No sales recorded yet.</td>
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

select, input {
  padding: 10px;
}

select {
  min-width: 250px;
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

.error {
  color: red;
  margin-bottom: 15px;
}

</style>
