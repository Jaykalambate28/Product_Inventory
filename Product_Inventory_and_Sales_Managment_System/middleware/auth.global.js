export default defineNuxtRouteMiddleware((to) => {

  const { isLoggedIn, initAuth, canAccessInventory, canAccessSales } = useAuth()

  initAuth()

  // Allow access to login page always
  if (to.path === '/login') {
    if (isLoggedIn.value) {
      return navigateTo('/inventory')
    }
    return
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn.value) {
    return navigateTo('/login')
  }

  // Role-based route protection
  if (to.path === '/inventory' && !canAccessInventory.value) {
    return navigateTo('/sales')
  }

  if (to.path === '/sales' && !canAccessSales.value) {
    return navigateTo('/inventory')
  }
})
