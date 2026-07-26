import { users as defaultUsers } from "../data/users";

const AUTH_USER_KEY = "skillforgeAuthUser";
const AUTH_TOKEN_KEY = "skillforgeToken";
const REGISTERED_USERS_KEY = "skillforgeRegisteredUsers";

const delay = (milliseconds = 500) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const normalizeEmail = (email = "") =>
  email.trim().toLowerCase();

const removePassword = (user) => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.role,
  phone: user.phone,
  profilePicture: user.profilePicture || "",
});

const getRegisteredUsers = () => {
  const storedUsers = localStorage.getItem(REGISTERED_USERS_KEY);

  if (!storedUsers) {
    return [];
  }

  try {
    const parsedUsers = JSON.parse(storedUsers);
    return Array.isArray(parsedUsers) ? parsedUsers : [];
  } catch {
    localStorage.removeItem(REGISTERED_USERS_KEY);
    return [];
  }
};

const authService = {
  async register(formData) {
    await delay();

    const registeredUsers = getRegisteredUsers();
    const allUsers = [...defaultUsers, ...registeredUsers];

    const normalizedEmail = normalizeEmail(formData.email);

    const emailAlreadyExists = allUsers.some(
      (user) => normalizeEmail(user.email) === normalizedEmail
    );

    if (emailAlreadyExists) {
      throw new Error("An account with this email already exists.");
    }

    const newUser = {
      id: Date.now(),
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: normalizedEmail,
      password: formData.password,
      role: "STUDENT",
      phone: formData.phone.trim(),
      profilePicture: "",
    };

    const updatedUsers = [...registeredUsers, newUser];

    localStorage.setItem(
      REGISTERED_USERS_KEY,
      JSON.stringify(updatedUsers)
    );

    return removePassword(newUser);
  },

  async login(email, password) {
    await delay();

    const registeredUsers = getRegisteredUsers();
    const allUsers = [...defaultUsers, ...registeredUsers];

    const user = allUsers.find(
      (item) =>
        normalizeEmail(item.email) === normalizeEmail(email) &&
        item.password === password
    );

    if (!user) {
      throw new Error("Invalid email address or password.");
    }

    const safeUser = removePassword(user);
    const dummyToken = `dummy-jwt-token-${user.id}-${Date.now()}`;

    localStorage.setItem(
      AUTH_USER_KEY,
      JSON.stringify(safeUser)
    );

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