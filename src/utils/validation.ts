// src/utils/validation.ts

/**
 * Validate email format (simple but effective)
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  /**
   * Validate password strength
   * Requirements: at least 8 characters
   */
  export function isValidPassword(password: string): boolean {
    return password.length >= 8;
  }
  
  /**
   * Sanitize task title (trim whitespace, limit length)
   */
  export function sanitizeTaskTitle(title: string): string {
    return title.trim().slice(0, 200); // Max 200 chars
  }
  
  /**
   * Sanitize task description (trim whitespace, limit length)
   */
  export function sanitizeTaskDescription(description: string): string {
    return description.trim().slice(0, 1000); // Max 1000 chars
  }