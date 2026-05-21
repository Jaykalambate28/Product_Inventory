import { getPool } from '~/server/utils/db'

export default defineEventHandler(async () => {

  const pool = getPool()
  const [rows] = await pool.query(
    `
      SELECT s.id, s.product_id, p.model,
             s.quantity_sold, s.sold_at
      FROM sales s
      JOIN products p ON s.product_id = p.product_id
      ORDER BY s.sold_at DESC
    `
  )

  return rows
})
