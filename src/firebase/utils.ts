import { auth } from "./config";
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signOut,
} from "@firebase/auth";

export const googleSignIn = async () => {
  const googleprovider = new GoogleAuthProvider();
  const userCred = await signInWithPopup(auth, googleprovider);
  return userCred?.user;
};

export const facebookSignIn = async () => {
  const facebookprovider = new FacebookAuthProvider();
  const userCred = await signInWithPopup(auth, facebookprovider);
  return userCred?.user;
};

export const logOut = () => {
  signOut(auth);
};
