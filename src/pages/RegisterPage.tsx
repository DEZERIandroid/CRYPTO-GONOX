import { createUserWithEmailAndPassword } from "firebase/auth";
import { useAppDispatch } from "../hooks/reduxHooks";
import { setUser } from "../features/userSlice";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from 'firebase/auth';
import "../styles/Log_Reg/Register.css";
import { setDoc, doc, serverTimestamp, } from "firebase/firestore";
import { db,auth } from "../firebase";
import { useNavigate,Link } from "react-router-dom";

const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordDoble, setPasswordDoble] = useState("");
  const [userName, setUserName] = useState("");
  const [,setRole] = useState("user")
  const [error, setError] = useState<string | null>(null);
  const [isModalShow, setIsModalShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [displayedName, setDisplayedName] = useState<string | undefined>("");

  const Register = async () => {
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();
    const cleanPasswordDoble = passwordDoble.trim();
    const cleanName = userName.trim();
    
    if (!cleanEmail || !cleanPassword || !cleanName) {
      setError("Пожалуйста, заполните все поля");
      return;
    }
  
    if (!isValidEmail(cleanEmail)) {
      setError("Неверный формат email");
      return;
    }
    
    if (cleanName.length > 16) {
      setError("Имя слишком длинное")
      return
    }
    if (cleanPassword.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      return;
    }
    if (cleanPassword !== cleanPasswordDoble) {
      setError("Пароли не похожи");
      return;
    }
  
    setError(null);
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPassword);
      const { user } = userCredential;

      const displayName = userName.trim() || user.email?.split('@')[0];
      

      await setDoc(doc(db, "users", user.uid), {
        displayName: userName.trim() || email.split("@")[0],
        email: user.email,
        role: "user",
        balance:500,
        cryptoTotalBalance:0,
        portfolio:[],
        createdAt: serverTimestamp(),
        transactions:[]
      });

      dispatch(setUser({
        uid: user.uid,
        email: user.email,
        name: userName.trim() || email.split("@")[0],
        role: "user",
        balance:500,
        cryptoTotalBalance:0,
        portfolio:[],
        transactions:[],
      }));

      setEmail("");
      setUserName("");
      setPassword("");
      setPasswordDoble("");
      setRole("user");

      setDisplayedName(displayName);
      setIsModalShow(true);
      setTimeout(() => {
        navigate("/")
      },2000)
    } catch (err: any) {
      let errorMessage = "Не удалось зарегистрироваться";

      if (err.code === "auth/email-already-in-use") {
        errorMessage = "Этот email уже зарегистрирован";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Неверный формат email";
      } else if (err.code === "auth/weak-password") {
        errorMessage = "Пароль слишком слабый (минимум 6 символов)";
      } else if (err.code === "auth/operation-not-allowed") {
        errorMessage = "Регистрация временно отключена";
      }

      setError(errorMessage);
      console.error("Ошибка регистрации:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/profile");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    let timer:ReturnType<typeof setTimeout>;
    if (isModalShow) {
      timer = setTimeout(() => {
        setIsModalShow(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [isModalShow]);

  return (
    <div data-aos="fade-in" data-aos-duration="150" className="Register-container">
      <div className="inputs">
        <input
          className="input-name"
          type="text"
          placeholder="Имя"
          value={userName}
          onChange={(e) => {
            setUserName(e.target.value)
            setError(null);
          }}
        />
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
        <input
          className="input-password"
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            setError(null);
          }}
        />
        <input
          className="input-password"
          type="password"
          placeholder="Потверждение пароля"
          value={passwordDoble}
          onChange={(e) => {
            setPasswordDoble(e.target.value)
            setError(null);
          }}
        />
        <button
          className="button-register"
          onClick={Register}
          disabled={isLoading}
        >
          {isLoading ? "Регистрация..." : "Регистрация"}
        </button>
        
      </div>

      <div className="form-footer">
        <Link to="/login" className="registerLink">Аккаунт имеется?</Link>
      </div>


      {error && (
        <div className="error-modal">
          <div>{error}</div>
        </div>
      )}

      {isModalShow && (
        <div className="modal">
          <div>Добро пожаловать, {displayedName}!</div>
          <button className="close-button" onClick={() => setIsModalShow(false)}>x</button>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;