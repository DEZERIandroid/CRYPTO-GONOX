import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { authWithGoogle } from "@/hooks/useGoogle";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAppDispatch } from "../hooks/reduxHooks";
import { setUser } from "../features/userSlice";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { EyeInvisibleOutlined, EyeOutlined, GoogleOutlined } from "@ant-design/icons";
import "../styles/Log_Reg/Login.css"

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isModalShow, setIsModalShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [displayedName, setDisplayedName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [watchingPass,setWatchingPass] = useState(false)

  const Login = async () => {
    if (!email || !password) {
      setError("Пожалуйста, заполните все поля");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("Данные из Firestore:", userData);
        const displayName = userData.displayName || user.email?.split('@')[0] || "Пользователь";

        dispatch(setUser({
          uid: user.uid,
          email: user.email,
          name: displayName,
          role: userData.role || "user",
        }));

        setDisplayedName(displayName);
      } else {
        console.error("Пользователь не найден в Firestore");
        setDisplayedName("Пользователь");
      }

      setEmail("");
      setPassword("");
      setIsModalShow(true);

      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (err: any) {
      let errorMessage = "Произошла ошибка при входе";
      if (err.code === "auth/invalid-email") {
        errorMessage = "Неверный формат email";
      } else if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        errorMessage = "Неверный email или пароль";
      } else if (err.code === "auth/user-disabled") {
        errorMessage = "Ваш аккаунт отключён";
      } else if (err.code === "auth/too-many-requests") {
        errorMessage = "Слишком много попыток. Попробуйте позже";
      }

      setError(errorMessage);
      console.error("Ошибка входа:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWatchPassword = () => {
    setWatchingPass(!watchingPass)
  }

  const handleGoogle = async () => {
    try {
      await authWithGoogle();
    } catch (e: any) {
      setError(e.code);
    }
  };

  return (
    <div data-aos="fade-in" data-aos-duration="150" className="Login-container">
      
      <button className="google-btn-reglog" onClick={handleGoogle}>
            <GoogleOutlined/> Вход через Google
      </button>

      <div className="inputs">
        <input
          className="input-email"
          type="email"
          placeholder="Почта"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setError(null);
          }}
        />
        <div className="password-watch">
          <input
            className="input-password"
            type={watchingPass ? "text" : "password"}
            placeholder="Пароль"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError(null);
            }}
          />
          <div className="watch" onClick={handleWatchPassword}>
            {watchingPass ? <EyeOutlined/> : <EyeInvisibleOutlined/>}
          </div>
        </div>
      </div>
      
      <button className="button-login" onClick={Login}>
        {isLoading ? "Вход..." : "Вход"}
      </button>

      <div className="form-footer">
        <Link to="/register" className="registerLink">Нет аккаунта?</Link>
      </div>

      

      {error && <div className="error-modal">
                  <div>{error}</div>
                </div>}

      {isModalShow && (
        <div className="modal">
          <div>Добро пожаловать, {displayedName}!</div>
          <button className="close-button" onClick={() => setIsModalShow(false)}>x</button>
        </div>
      )}
    </div>
  );
};

export default LoginPage;