export function validateOrganizationName(name: string): boolean {
  return name.length >= 3 && name.length <= 50;
}

export function validateOrganizationUsername(username: string): boolean {
  return /^[a-zA-Z0-9_-]{3,20}$/.test(username);
}