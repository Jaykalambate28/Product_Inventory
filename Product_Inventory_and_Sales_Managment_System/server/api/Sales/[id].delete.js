import { getPool } from '~/server/utils/db'

export default defineEventHandler(async (event) => {

  const pool = getPool()
  const id = event.context.params.id

  await pool.query(
    `
      DELETE FROM sales
      WHERE id = ?
    `,
    [id]
  )

  return {
    message: 'Sale deleted'
  }
})
