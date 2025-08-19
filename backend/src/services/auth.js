const usersRepo = require('../repositories/users');
const { hashPassword, comparePassword } = require('../utils/password');
const { signToken } = require('../utils/jwt');

// PUBLIC_INTERFACE
async function register({ email, password, name }) {
  /** Register a new user. */
  const existing = await usersRepo.getByEmail(email);
  if (existing) {
    const err = new Error('Email already registered');
    err.status = 409;
    throw err;
  }
  const passwordHash = await hashPassword(password);
  const user = await usersRepo.createUser({ email, passwordHash, name });
  const token = signToken({ id: user.id, email: user.email, name: user.name });
  return { user, token };
}

// PUBLIC_INTERFACE
async function login({ email, password }) {
  /** Authenticate a user and return JWT. */
  const user = await usersRepo.getByEmail(email);
  if (!user) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }
  const ok = await comparePassword(password, user.password_hash);
  if (!ok) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }
  const safeUser = { id: user.id, email: user.email, name: user.name };
  const token = signToken(safeUser);
  return { user: safeUser, token };
}

// PUBLIC_INTERFACE
async function me(userId) {
  /** Fetch current user profile. */
  const user = await usersRepo.getById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  return user;
}

module.exports = {
  register,
  login,
  me,
};
