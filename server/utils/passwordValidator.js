/**
 * Password validation utility
 * Enforces strong password requirements
 */

const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 128,
  UPPERCASE: /[A-Z]/,
  LOWERCASE: /[a-z]/,
  NUMBER: /[0-9]/,
  SPECIAL: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
const validatePassword = (password) => {
  const errors = [];

  if (!password) {
    return {
      isValid: false,
      errors: ['Password is required'],
    };
  }

  if (password.length < PASSWORD_REQUIREMENTS.MIN_LENGTH) {
    errors.push(`Password must be at least ${PASSWORD_REQUIREMENTS.MIN_LENGTH} characters long`);
  }

  if (password.length > PASSWORD_REQUIREMENTS.MAX_LENGTH) {
    errors.push(`Password must not exceed ${PASSWORD_REQUIREMENTS.MAX_LENGTH} characters`);
  }

  if (!PASSWORD_REQUIREMENTS.UPPERCASE.test(password)) {
    errors.push('Password must contain at least one uppercase letter (A-Z)');
  }

  if (!PASSWORD_REQUIREMENTS.LOWERCASE.test(password)) {
    errors.push('Password must contain at least one lowercase letter (a-z)');
  }

  if (!PASSWORD_REQUIREMENTS.NUMBER.test(password)) {
    errors.push('Password must contain at least one number (0-9)');
  }

  if (!PASSWORD_REQUIREMENTS.SPECIAL.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*()_+-=[]{};\':"\\|,.<>/?)')
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Get password requirements as a readable string
 * @returns {string} Requirements description
 */
const getPasswordRequirements = () => {
  return `
Password Requirements:
- Minimum ${PASSWORD_REQUIREMENTS.MIN_LENGTH} characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (!@#$%^&*()_+-=[]{};':"\\|,.<>/?).trim()
  `;
};

module.exports = {
  validatePassword,
  getPasswordRequirements,
  PASSWORD_REQUIREMENTS,
};
