export type ContactFields = {
  name: string;
  email: string;
  type: string;
  message: string;
};
export type ContactErrors = Partial<Record<keyof ContactFields, string>>;
export function validateContact(values: ContactFields): ContactErrors {
  const errors: ContactErrors = {};
  if (values.name.trim().length < 2)
    errors.name = "Please enter your name (at least 2 characters).";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = "Please enter a valid email address.";
  if (!["brand", "sponsorship", "consulting"].includes(values.type))
    errors.type = "Please select an inquiry type.";
  if (values.message.trim().length < 10)
    errors.message = "Please add a little detail (at least 10 characters).";
  return errors;
}
