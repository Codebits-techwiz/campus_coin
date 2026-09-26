/** Client-side auth form validators (no backend required). */

export const NAME_REGEX = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export function validateName(value) {
  const v = value.trim();
  if (!v) return 'required';
  if (!NAME_REGEX.test(v)) return 'nameInvalid';
  return null;
}

export function validateEmail(value) {
  const v = value.trim();
  if (!v) return 'required';
  if (!EMAIL_REGEX.test(v)) return 'emailInvalid';
  return null;
}

export function validatePassword(value) {
  if (!value) return 'required';
  if (!PASSWORD_REGEX.test(value)) return 'passwordWeak';
  return null;
}

/** Real-time checklist for password field UI. */
export function getPasswordChecks(password = '') {
  return {
    minLength: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
}

export function validateConfirmPassword(password, confirm) {
  if (!confirm) return 'required';
  if (password !== confirm) return 'passwordMismatch';
  return null;
}

export function validatePositiveNumber(value, { allowEmpty = false } = {}) {
  if (value === '' || value === null || value === undefined) {
    return allowEmpty ? null : 'required';
  }
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return 'numberInvalid';
  return null;
}
