import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';










const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: 8,
  UPPERCASE: /[A-Z]/,
  LOWERCASE: /[a-z]/,
  NUMBER: /[0-9]/,
  SPECIAL: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
};

interface PasswordStrength {
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
  minLength: boolean;
}

const validatePasswordStrength = (password: string): PasswordStrength => ({
  uppercase: PASSWORD_REQUIREMENTS.UPPERCASE.test(password),
  lowercase: PASSWORD_REQUIREMENTS.LOWERCASE.test(password),
  number: PASSWORD_REQUIREMENTS.NUMBER.test(password),
  special: PASSWORD_REQUIREMENTS.SPECIAL.test(password),
  minLength: password.length >= PASSWORD_REQUIREMENTS.MIN_LENGTH,
});

const isPasswordValid = (strength: PasswordStrength): boolean =>
  strength.uppercase && strength.lowercase && strength.number && strength.special && strength.minLength;

export const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    minLength: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(validatePasswordStrength(newPassword));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!isPasswordValid(passwordStrength)) {
      setError('Password does not meet all requirements');
      return;
    }

    try {
      await registerUser({ email, password });
      alert('Registration successful! Please log in.');
      navigate('/login');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    }
  };

  const requirementsMet = Object.values(passwordStrength).filter(Boolean).length;
  const totalRequirements = Object.keys(passwordStrength).length;

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form card">
        <h2>Register</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-input-wrapper">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter a strong password"
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>

          {/* Password Requirements Checklist */}
          <div className="password-requirements">
            <div className="requirements-header">
              Password Strength: {requirementsMet}/{totalRequirements}
            </div>
            <ul className="requirements-list">
              <li className={passwordStrength.minLength ? 'met' : 'unmet'}>
                {passwordStrength.minLength ? '✓' : '✗'} At least 8 characters
              </li>
              <li className={passwordStrength.uppercase ? 'met' : 'unmet'}>
                {passwordStrength.uppercase ? '✓' : '✗'} One uppercase letter (A-Z)
              </li>
              <li className={passwordStrength.lowercase ? 'met' : 'unmet'}>
                {passwordStrength.lowercase ? '✓' : '✗'} One lowercase letter (a-z)
              </li>
              <li className={passwordStrength.number ? 'met' : 'unmet'}>
                {passwordStrength.number ? '✓' : '✗'} One number (0-9)
              </li>
              <li className={passwordStrength.special ? 'met' : 'unmet'}>
                {passwordStrength.special ? '✓' : '✗'} One special character (!@#$%^&*)
              </li>
            </ul>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            required
          />
          {confirmPassword && password !== confirmPassword && (
            <p className="error-message" style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Passwords do not match
            </p>
          )}
        </div>

        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={!isPasswordValid(passwordStrength) || password !== confirmPassword}>
          Register
        </button>
        <p>Already have an account? <Link to="/login">Login here</Link></p>
      </form>
    </div>
  );
};
