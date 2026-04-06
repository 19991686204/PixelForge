import validator from 'validator';

/**
 * 验证用户名格式
 */
export const validateUsername = (username: string): { valid: boolean; message?: string } => {
  if (!username || username.length < 3 || username.length > 20) {
    return { valid: false, message: 'Username must be 3-20 characters' };
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { valid: false, message: 'Username can only contain letters, numbers, and underscores' };
  }

  return { valid: true };
};

/**
 * 验证邮箱格式
 */
export const validateEmail = (email: string): { valid: boolean; message?: string } => {
  if (!email || !validator.isEmail(email)) {
    return { valid: false, message: 'Invalid email format' };
  }

  return { valid: true };
};

/**
 * 验证密码强度
 */
export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (!password || password.length < 8 || password.length > 32) {
    return { valid: false, message: 'Password must be 8-32 characters' };
  }

  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return { valid: false, message: 'Password must contain uppercase, lowercase, and number' };
  }

  return { valid: true };
};

/**
 * 清理和验证标签
 */
export const sanitizeTags = (tags: string[]): string[] => {
  return tags
    .map(tag => tag.trim().toLowerCase())
    .filter(tag => tag.length > 0 && tag.length <= 20)
    .slice(0, 10); // 最多10个标签
};
