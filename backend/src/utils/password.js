const bcrypt = require('bcryptjs');

function getSaltRounds() {
  const rounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
  if (Number.isNaN(rounds) || rounds < 4) return 10;
  return rounds;
}

// PUBLIC_INTERFACE
async function hashPassword(plain) {
  /**
   * Hash a plaintext password using bcrypt.
   * Params:
   *   - plain: string - plaintext password
   * Returns:
   *   - Promise<string> - hashed password
   */
  const salt = await bcrypt.genSalt(getSaltRounds());
  return bcrypt.hash(plain, salt);
}

// PUBLIC_INTERFACE
async function comparePassword(plain, hashed) {
  /**
   * Compare a plaintext password with a previously hashed password.
   * Params:
   *   - plain: string - plaintext
   *   - hashed: string - bcrypt hash
   * Returns:
   *   - Promise<boolean> - true if matches
   */
  return bcrypt.compare(plain, hashed);
}

module.exports = {
  hashPassword,
  comparePassword,
};
