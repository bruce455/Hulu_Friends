import { validation } from "./validation.js";

test("returns error if fields are empty", () => {
  expect(validation("", "")).toBe("Missing fields");
});

test("returns error for invalid email", () => {
  expect(validation("testemail.com", "testpassword"))
    .toBe("Invalid email");
});

test("returns error for short password", () => {
  expect(validation("test@test.com", "test"))
    .toBe("Password too short");
});

test("returns null for valid input", () => {
  expect(validation("test@test.com", "123456"))
    .toBe(null);
});