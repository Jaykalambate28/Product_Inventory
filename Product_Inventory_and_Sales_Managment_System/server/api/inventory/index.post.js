import { getPool } from '~/server/utils/db'

export default defineEventHandler(async (event) => {

  const pool = getPool()
  const body = await readBody(event)

  const productId =
    'P' + Math.floor(Math.random() * 10000)

  await pool.query(
    `
      INSERT INTO products
      (product_id, model, count)
      VALUES (?, ?, ?)
    `,
    [
      productId,
      body.model,
      body.count
    ]
  )

  return {
    message: 'Product added'
  }
})