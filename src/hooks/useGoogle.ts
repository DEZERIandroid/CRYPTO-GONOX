import {
  signInWithRedirect,
  GoogleAuthProvider,
  getAdditionalUserInfo,
  linkWithPopup,
  getRedirectResult
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

export const linkGoogleProvider = async () => {
  if (!auth.currentUser) throw new Error("User not logged in");

  const provider = new GoogleAuthProvider();

  await linkWithPopup(auth.currentUser, provider);
};

export const authWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  await signInWithRedirect(auth, provider);

  const res = await getRedirectResult(auth);
  if (!res) return null;

  const isNewUser = getAdditionalUserInfo(res)?.isNewUser;

  if (isNewUser) {
    await setDoc(doc(db, "users", res.user.uid), {
      email: res.user.email,
      displayName: res.user.displayName,
      photoURL: res.user.photoURL,
      role: "user",
      createdAt: serverTimestamp()
    });
  }

  return res.user;
};
