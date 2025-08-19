const authService = require('../services/auth');

class AuthController {
  // PUBLIC_INTERFACE
  async register(req, res, next) {
    /** Handle user registration. */
    try {
      const { email, password, name } = req.body;
      const result = await authService.register({ email, password, name });
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  }

  // PUBLIC_INTERFACE
  async login(req, res, next) {
    /** Handle user login. */
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  // PUBLIC_INTERFACE
  async me(req, res, next) {
    /** Return current user profile. */
    try {
      const user = await authService.me(req.user.id);
      res.status(200).json({ user });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new AuthController();
