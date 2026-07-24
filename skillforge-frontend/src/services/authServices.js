import { users } from "../data/users";

const AUTH_USER_KEY = "skillforgeAuthUser";
const AUTH_TOKEN_KEY = "skillforgeToken";

const delay = (milliseconds = 500) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const authService = {
  async login(email, password) {
    await delay();

    const user = users.find(
      (item) =>
        item.email.toLowerCase() === email.trim().toLowerCase() &&
        item.password === password
    );

    if (!user) {
      throw new Error("Invalid email address or password.");
    }

    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      profilePicture: user.profilePicture,
    };

    const dummyToken = `dummy-jwt-token-${user.id}-${Date.now()}`;

    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(safeUser));
    localStorage.setItem(AUTH_TOKEN_KEY, dummyToken);

    return {
      user: safeUser,
      token: dummyToken,
    };
  },

  logout() {
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },

  getCurrentUser() {
    const storedUser = localStorage.getItem(AUTH_USER_KEY);

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch {
      this.logout();
      return null;
    }
  },

  getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  isAuthenticated() {
    return Boolean(this.getCurrentUser() && this.getToken());
  },
};

export default authService;