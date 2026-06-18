// Simple in-memory storage for users to test registration and login flow.
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

// Global variable to persist users in hot-reload/dev environments
const globalForUsers = global as unknown as {
  mockUsers?: User[];
};

if (!globalForUsers.mockUsers) {
  globalForUsers.mockUsers = [
    // Pre-populate with a default test user
    {
      id: "usr_1",
      name: "Default User",
      email: "default@example.com",
      passwordHash: "string", // mock hash of "string"
    },
  ];
}

export const mockDb = {
  getUsers: () => globalForUsers.mockUsers || [],
  addUser: (user: User) => {
    if (!globalForUsers.mockUsers) {
      globalForUsers.mockUsers = [];
    }
    globalForUsers.mockUsers.push(user);
  },
  findUserByEmail: (email: string) => {
    return (globalForUsers.mockUsers || []).find((u) => u.email.toLowerCase() === email.toLowerCase());
  },
};
