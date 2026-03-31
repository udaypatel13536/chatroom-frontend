import axios from "axios";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Backend_URL } from "../../config";

interface AuthCtx {
    username : string |null;
    token : string |null;
    Loading : boolean;
    signin : (username :string , password :string )=> Promise<void>
    login : (username :string , password :string )=> Promise<void>
    logout : ()=>void
}
const AuthContext = createContext<AuthCtx>(null!)

export function AuthProvider({children} :{children : ReactNode}){
    const [username , setUsername ] = useState<string| null>(null)
    const [token ,setToken] = useState<string |null >(null)
    const [Loading,setLoading] = useState<boolean>(true)

    useEffect(()=>{
        const token = localStorage.getItem('token')
        if(token){
            const authToken = token 
            axios.get(`${Backend_URL}/api/auth/me`,
               { headers :{
                    'Authorization' :authToken
                }})
                .then((response: any ) =>{
                    setUsername(response.data.username)
                     setToken(token)})
                .catch(()=>localStorage.removeItem('token'))
                .finally(()=> setLoading(false))
        }else{
            setLoading(false)
        }
    },[])

    const login = async (username: string, password: string) => {
    const res :any = await axios.post(`${Backend_URL}/api/auth/login`,{
        username ,password
    })
    localStorage.setItem('token',res.token)
    setToken(res.data.token)
    setUsername(res.data.data.username)
    }
    
    const signin = async (username : string , password : string)=>{
        const res  :any = await axios.post(`${Backend_URL}/api/auth/register`,{
            username , password
        })
        localStorage.setItem('token', res.data.token)
        setToken(res.data.token)
        setUsername(res.data.data[0].username)
    }
    const logout = ()=>{
        localStorage.removeItem('token')
        setToken(null)
        setUsername(null)
    }

    return(
        <AuthContext.Provider value={{username,token,Loading,login,signin,logout}}>
            {children}
        </AuthContext.Provider>
        
    )
}

export const useAuth  = ()=>useContext(AuthContext)