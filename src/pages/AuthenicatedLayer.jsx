import { useUserProfile } from "@/api/query/useUserQuery"
import { Outlet, useNavigate } from "react-router-dom"

export default function({children}){
    const navigate = useNavigate()
    const { data: user, isLoading, isError, error } = useUserProfile()
    if(isLoading){
        return (
            <div className="flex justify-center items-center">
                <p>Loading...</p>
            </div>
        )
    }
    if(user?.error){
        return navigate('/auth')
    }
    return <>{children}</>
}