type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
};

export const useApi = () => {
  const config = useRuntimeConfig();
  const token = useState<string | null>("token", () => process.client ? localStorage.getItem("token") : null);
  const user = useState<AuthUser | null>("user", () => process.client ? JSON.parse(localStorage.getItem("user") || "null") : null);

const request = async <T>(path: string, options: any = {}) => {


  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token.value ? { Authorization: `Bearer ${token.value}` } : {})
  };

  return await $fetch<T>(`${config.public.apiBase}${path}`, {
    ...options,
    headers
  });
};


  const login = async (email: string, password: string) => {
    const response = await request<{ accessToken: string; user: AuthUser }>("/auth/login", {
      method: "POST",
      body: { email, password }
    });
    token.value = response.accessToken;
    user.value = response.user;
    if (process.client) {
      localStorage.setItem("token", response.accessToken);
      localStorage.setItem("user", JSON.stringify(response.user));
    }
    return response;
  };

  const signup = async (payload: { name: string; email: string; password: string; role: string }) => {
    const response = await request<{ accessToken: string; user: AuthUser }>("/auth/signup", {
      method: "POST",
      body: payload
    });
    token.value = response.accessToken;
    user.value = response.user;
    if (process.client) {
      localStorage.setItem("token", response.accessToken);
      localStorage.setItem("user", JSON.stringify(response.user));
    }
    return response;
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    if (process.client) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    navigateTo("/");
  };

  return { request, login, signup, logout, token, user };
};
