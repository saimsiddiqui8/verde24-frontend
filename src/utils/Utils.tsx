import toast from "react-hot-toast";
import { PhoneNumberUtil } from "google-libphonenumber";

export const notifySuccess = (msg: string) => toast.success(msg);
export const notifyFailure = (msg: string) => toast.error(msg);

export const areAllValuesTruthy = (obj: any) => {
  return Object.values(obj).every((value) => Boolean(value));
};

export const convertToDisplayName = (input: string) => {
  const words = input.split("_");
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );
  const result = capitalizedWords.join(" ");
  return result;
};

export const isValidPassword = (password: string) => {
  if (password.length <= 8) {
    const msg = "Password length should be greater than 8 characters!";
    return { status: false, msg };
  }

  if (!/[A-Z]/.test(password)) {
    const msg = "There should be atleast 1 uppercase letter in your password!";
    return { status: false, msg };
  }

  if (!/[a-z]/.test(password)) {
    const msg = "There should be atleast 1 lowercase letter in your password!";
    return { status: false, msg };
  }

  if (!/\d/.test(password)) {
    const msg = "There should be atleast 1 numeric character in your password!";
    return { status: false, msg };
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    const msg = "There should be atleast 1 special character in your password!";
    return { status: false, msg };
  }

  if (isPalindrome(password)) {
    const msg = "Password cannot be a palindrome!";
    return { status: false, msg };
  }

  return { status: true, msg: "Success" };
};

export const isPalindrome = (str: string) => {
  const cleanedStr = str.replace(/[^A-Za-z0-9]/g, "").toLowerCase();
  return cleanedStr === cleanedStr.split("").reverse().join("");
};

export type PasswordCheckType = {
  status: boolean;
  msg: string;
};

const phoneUtil = PhoneNumberUtil.getInstance();

export const isPhoneValid = (phone: string) => {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (error) {
    return false;
  }
};
