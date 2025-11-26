export function getUsername(): string {
  const usernamePrefix = 'user_';
  const rendomChars = Math.random().toString(36).slice(2);

  return usernamePrefix + rendomChars;
}
