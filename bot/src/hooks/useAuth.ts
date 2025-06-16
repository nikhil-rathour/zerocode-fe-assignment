export const useAuth = () => {
  const login = (token: string) => localStorage.setItem('token', token);
  const logout = () => localStorage.removeItem('token');
  const getToken = () => localStorage.getItem('token');
  const isLoggedIn = () => !!getToken();
  return { login, logout, getToken, isLoggedIn };
};
