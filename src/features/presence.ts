import { getDatabase, ref, onDisconnect, set, onValue, serverTimestamp } from "firebase/database";
import { auth } from "../firebase";

// Функция инициализации presence
export const initPresence = () => {
  const user = auth.currentUser;
  if (!user) return;

  const uid = user.uid;
  const db = getDatabase();

  const userStatusRef = ref(db, `/status/${uid}`);
  const connectedRef = ref(db, ".info/connected");

  onValue(connectedRef, (snap) => {
    if (snap.val() === false) return;

    // Когда пользователь отключится → обновить статус
    onDisconnect(userStatusRef).set({
      state: "offline",
      lastChanged: serverTimestamp(),
    });

    // Когда он онлайн → обновить статус
    set(userStatusRef, {
      state: "online",
      lastChanged: serverTimestamp(),
    });
  });
};
