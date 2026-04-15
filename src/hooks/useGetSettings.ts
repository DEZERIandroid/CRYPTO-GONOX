import { useEffect, useState } from "react"
import { useAppSelector } from "./reduxHooks"
import { db } from "@/firebase"
import { doc, onSnapshot, setDoc } from "firebase/firestore"
import type { User } from "@/app/api/UsersApi"



export const useGetSettings = () => {
    const [theme,setTheme] = useState("gonox")
    const [isPrivate,setIsPrivate] = useState(false)
    const [isPush,setIsPush] = useState(true)
    const [Language,setLanguage] = useState("Русский")
    const [isAutoUpdate,setIsAutoUpdate] = useState(true)
    const [isAnimation,setIsAnimation] = useState(true)

    const user = useAppSelector(state => state.user)
    useEffect(() => {
        if (!user.uid) return

        const userDocRef = doc(db,"users",user.uid)

        const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
            if(snapshot.exists()) {
                const data = snapshot.data() as User
                const s = data.settings?.[0]

                if (s) {
                          setTheme(s.theme || "Тёмная");
                          setLanguage(s.language || "Русский");
                          setIsPrivate(!!s.privates);
                          setIsPush(!!s.push);
                          setIsAutoUpdate(!!s.updatenow);
                          setIsAnimation(!!s.animation);
                        }
                  } else {
                    setDoc(userDocRef, {
                      settings: [{
                        push: true,
                        theme: "Тёмная",
                        language: "Русский",
                        updatenow: true,
                        animation: true,
                      }]
                    });
            }
            
        })

        return () => unsubscribe()
        
    },[])

    return {theme,isPrivate,isPush,Language,isAutoUpdate,isAnimation,
            setTheme,setIsPrivate,setIsPush,setLanguage,setIsAutoUpdate,setIsAnimation     
    }
}