export function validation(email, password) {
  if (!email || !password) {
    return "Missing fields";
  }

  if (!email.includes("@")) {
    return "Invalid email";
  }

  if (password.length < 6) {
    return "Password too short";
  }

  return null; // valid
}