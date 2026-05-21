export default defineEventHandler(async (event) => {

  const body = await readBody(event)

  const { username, password } = body

  // Hardcoded users with roles
  const users = [
    { username: 'admin',    password: 'admin123',    role: 'admin' },
    { username: 'manager',  password: 'manager123',  role: 'manager' },
    { username: 'sales',    password: 'sales123',    role: 'sales' }
  ]

  const user = users.find(
    u => u.username === username && u.password === password
  )

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid username or password'
    })
  }

  // Set a cookie with user info
  setCookie(event, 'auth_user', JSON.stringify({
    username: user.username,
    role: user.role
  }), {
    httpOnly: false,
    path: '/',
    maxAge: 60 * 60 * 24 // 1 day
  })

  return {
    username: user.username,
    role: user.role
  }
})
