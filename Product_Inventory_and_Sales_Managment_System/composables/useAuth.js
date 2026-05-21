export const useAuth = () => {

  const user = useState('auth_user', () => null)

  // Read from cookie on init
  const initAuth = () => {
    const cookie = useCookie('auth_user')
    if (cookie.value) {
      try {
        user.value = typeof cookie.value === 'string'
          ? JSON.parse(cookie.value)
          : cookie.value
      } catch {
        user.value = null
      }
    }
  }

  const login = async (username, password) => {
    const data = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { username, password }
    })
    user.value = data
    return data
  }

  const logout = () => {
    user.value = null
    const cookie = useCookie('auth_user')
    cookie.value = null
    navigateTo('/login')
  }

  const isLoggedIn = computed(() => !!user.value)
  const role = computed(() => user.value?.role || '')
  const username = computed(() => user.value?.username || '')

  // Permission helpers
  const canAccessInventory = computed(() =>
    ['admin', 'manager'].includes(role.value)
  )

  const canAccessSales = computed(() =>
    ['admin', 'sales'].includes(role.value)
  )

  const canEditInventory = computed(() =>
    ['admin', 'manager'].includes(role.value)
  )

  const canEditSales = computed(() =>
    ['admin', 'sales'].includes(role.value)
  )

  return {
    user,
    initAuth,
    login,
    logout,
    isLoggedIn,
    role,
    username,
    canAccessInventory,
    canAccessSales,
    canEditInventory,
    canEditSales
  }
}
