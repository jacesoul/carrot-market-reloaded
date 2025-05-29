export const PASSWORD_MIN_LENGTH = 4;
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/;
export const PASSWORD_VALIDATION_MESSAGE =
  "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
