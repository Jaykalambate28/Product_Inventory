import { getPool } from '~/server/utils/db'

export default defineEventHandler(async (event) => {

  const pool = getPool()
  const body = await readBody(event)

  const productId = body.product_id
  const quantity = parseInt(body.quantity_sold)

  if (!productId || !quantity || quantity <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid product_id or quantity_sold'
    })
  }

  // Check if product exists and has enough stock
  const [products] = await pool.query(
    'SELECT * FROM products WHERE product_id = ?',
    [productId]
  )

  if (products.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Product not found'
    })
  }

  if (products[0].count < quantity) {
    throw createError({
      statusCode: 400,
      statusMessage: `Not enough stock. Available: ${products[0].count}`
    })
  }

  // Insert the sale
  await pool.query(
    `
      INSERT INTO sales (product_id, quantity_sold)
      VALUES (?, ?)
    `,
    [productId, quantity]
  )

  // Decrease the product count
  const newCount = products[0].count - quantity

  await pool.query(
    `
      UPDATE products
      SET count = ?,
          status = CASE WHEN ? = 0 THEN 'out_of_stock' ELSE 'active' END
      WHERE product_id = ?
    `,
    [newCount, newCount, productId]
  )

  return {
    message: 'Sale recorded'
  }
})
