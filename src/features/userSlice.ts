import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { initPresence } from "./presence";

interface UserState {
  uid: string | null;
  email: string | null;
  name: string | null;
  role: string | null;
  isAuthChecked: boolean;
  balance: number | null;
  photoURL:string | undefined,
}

const initialState: UserState = {
  uid: null,
  email: null,
  name: null,
  role: null,
  isAuthChecked: false,
  balance:0,
  photoURL:undefined,
};

export const initializeAuth = createAsyncThunk(
  "user/initializeAuth",
  async (_, { dispatch }) => {
    return new Promise<void>((resolve) => {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          let displayName = user.email?.split("@")[0] || "Пользователь";
          let role = "user";
          let photoURL

          if (userDoc.exists()) {
            const userData = userDoc.data();
            displayName = userData.displayName || displayName;
            role = userData.role || "user";
            photoURL = userData.photoURL
          }

          dispatch(
            setUser({
              uid: user.uid,
              email: user.email,
              name: displayName,
              role,
              photoURL
            })
          );
          initPresence()
        } else {
          dispatch(clearUser());
        }

        

        resolve();
        unsubscribe();
      });
    });
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.uid = action.payload.uid;
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.role = action.payload.role;
      state.photoURL = action.payload.photoURL;
      state.isAuthChecked = true;
    },
    clearUser: (state) => {
      state.uid = null;
      state.email = null;
      state.name = null;
      state.role = null;
      state.isAuthChecked = true;
    },
    updateBalance: (state, action) => {
      state.balance = action.payload;
    }
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;