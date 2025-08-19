const { validationResult } = require('express-validator');

/**
 * PUBLIC_INTERFACE
 * validate
 * Wraps an array of express-validator checks and sends 400 with details on failure.
 */
function validate(validations) {
  /** This is a public function. */
  return async (req, res, next) => {
    await Promise.all(validations.map((v) => v.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    return res.status(400).json({
      status: 'validation_error',
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    });
  };
}

module.exports = {
  validate,
};
