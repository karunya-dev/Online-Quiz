type Role = "ADMIN" | "TEACHER" | "STUDENT";

export const useRoleAccess = () => {
  const { token, user } = useApi();

  const requireAuth = () => {
    if (!token.value) {
      return navigateTo("/login");
    }
  };

  const requireRole = (roles: Role[]) => {
    if (!token.value) {
      return navigateTo("/login");
    }
    if (user.value && !roles.includes(user.value.role)) {
      return navigateTo("/dashboard");
    }
  };

  const isRole = (role: Role) => user.value?.role === role;

  return { requireAuth, requireRole, isRole };
};
