import queryClient from '@/lib/react-query-client'
import apiCall from './axios'

class Auth{
    constructor(){
        this.route = 'auth/'
    }
    async register(data){
        const result =  await apiCall(`${this.route}register`, data, 'POST')
        if(!result.error){
            console.log("Calling fuction")
            queryClient.setQueryData(['userProfile'], result.user)
            queryClient.refetchQueries(['userProfile'])
        }
        return result
    }
    async login(data){
        const result =  await apiCall(`${this.route}login`, data, 'POST')
        if(!result.error){
            console.log("Calling fuction")
            queryClient.setQueryData(['userProfile'], result.user)
            queryClient.refetchQueries(['userProfile'])
        }
        return result
    }
    async logout(){
        const result =  await apiCall(`${this.route}logout`, null, 'POST')
        if(!result.error){
            console.log("Calling fuction")
            queryClient.invalidateQueries(['userProfile'])
        }
        return result
    }
    async refreshAccessToken(){
        const result =  await apiCall(`${this.route}refresh-access-token`, null, 'POST')
        if(!result.error){
            console.log("Calling fuction")
            queryClient.invalidateQueries(['userProfile'])
        }
        return result
    }
}


const auth = new Auth()
export default auth