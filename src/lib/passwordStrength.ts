export type PasswordStrength = { score: 0 | 1 | 2 | 3 | 4; label: string; color: string }

export const STRENGTH_LEVELS: PasswordStrength[] = [
  { score: 0, label: 'ضعيفة جدًا', color: '#DC2626' },
  { score: 1, label: 'ضعيفة', color: '#F97316' },
  { score: 2, label: 'متوسطة', color: '#EAB308' },
  { score: 3, label: 'قوية', color: '#22C55E' },
  { score: 4, label: 'قوية جدًا', color: '#0E3B34' },
]

const COMMON_WEAK_PASSWORDS = new Set([
  'password', 'password1', 'password123', '12345678', '123456789', '1234567890',
  'qwertyui', 'qwerty123', '11111111', '00000000', 'abcdefgh', 'iloveyou',
  'admin123', 'letmein11', '87654321', 'passw0rd', 'welcome1', 'monkey123', 'abc12345',
])

export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return STRENGTH_LEVELS[0]

  const isRepeatedChar = /^(.)\1+$/.test(password)
  const isSequential = /^(0123456789|12345678|abcdefgh|qwertyui)/i.test(password)
  if (password.length < 8 || COMMON_WEAK_PASSWORDS.has(password.toLowerCase()) || isRepeatedChar || isSequential) {
    return STRENGTH_LEVELS[0]
  }

  let score = 1
  if (password.length >= 12) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  return STRENGTH_LEVELS[Math.min(score, 4)]
}
