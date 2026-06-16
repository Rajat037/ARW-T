export const isValidGmail = (value) =>
  /^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(value);

export const normalizePhone = (value = "") => value.replace(/[\s()-]/g, "");

export const isValidIndianMobile = (value) =>
  /^(?:\+91|91)?[6-9]\d{9}$/.test(normalizePhone(value));
