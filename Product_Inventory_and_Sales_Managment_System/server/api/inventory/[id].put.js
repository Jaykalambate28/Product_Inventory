import { getPool } from '~/server/utils/db'

export default defineEventHandler(async (event) => {

  const pool = getPool()
  const id = event.context.params.id

  const body = await readBody(event)

  await pool.query(
    `
      UPDATE products
      SET model = ?, count = ?
      WHERE id = ?
    `,
    [
      body.model,
      body.count,
      id
    ]
  )

  return {
    message: 'Product updated'
  }
})