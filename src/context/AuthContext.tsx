/* eslint-disable react-refresh/only-export-components */
import { createContext,useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
type AuthContextType = {
  userId: string;
  username: string;
  firstName:string;
  avatar: string;
  bio?: string;
  loading?: boolean;
  isLogin:boolean;
  refreshUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  userId: "",
  username: "",
  firstName:"",
  avatar: "",
  bio: '',
  loading:true,
  isLogin:false,
  refreshUser: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const [loading, setLoading] = useState(true);
  const [isLogin,setIsLogin]=useState(false);
  const [userId,setUserId]=useState("")
  const [username,setUsername]=useState("")
  const [firstName,setFirstName]=useState("")
  const [avatar,setAvatar]=useState("")
  const [bio,setBio]=useState("")
  const getMe = useCallback(async () => {
    try {
      const response = await axios.get(`${apiKey}/me`, {
        withCredentials: true
      })
        if (!response.data.success) {
        // Not logged in; avoid noisy toast here since it's expected on public routes
        setLoading(false)
        return
      }
        setFirstName(response.data.firstName);
        setUsername(response.data.username);
        setAvatar(response.data.avatar)
        setBio(response.data.bio || '')
        setUserId(response.data.userId)
        setIsLogin(true)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // Expected when no session; don't toast
        setLoading(false)
        return
      }
      console.error("Error fetching user data:", error);
      toast.error("Unable to fetch session. Please try again.");
      setLoading(false)
      return
    }
    setLoading(false)
    }, [apiKey]);
  useEffect(() => {
    getMe();
  }, [getMe]);

  return (
    <AuthContext.Provider value={{isLogin,userId,username,firstName,avatar,bio,loading, refreshUser: getMe,  }}>
      {children}
    </AuthContext.Provider>
  );
};


