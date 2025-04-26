import queryClient from '@/lib/react-query-client'
import apiCall from './axios'

class User{
    constructor(){
        this.route = 'user/'
    }
    async userProfile(){
        return await apiCall(`${this.route}me`, {}, 'POST')
    }
    async updateProfile(data){
        const result = await apiCall(`${this.route}update-profile`, data, 'POST')
        if(!result.error){
            console.log(result.user)
            queryClient.setQueryData(['userProfile'], result.user)
            queryClient.refetchQueries(['userProfile'])
        }
        return result
    }
    async forgotPassword(data){
        const result = await apiCall(`${this.route}forgot-password`, data, 'POST')
        return result
    }
    async resetPassword(data){
        const result = await apiCall(`${this.route}reset-password`, data, 'POST')
        return result
    }
    async updatePassword(data){
        const result = await apiCall(`${this.route}update-password`, data, 'POST')
        return result
    }
    async updateAvatar(data){
        const result = await apiCall(`${this.route}update-avatar`, data, 'POST')
        if(!result.error){
            console.log(result.user)
            queryClient.setQueryData(['userProfile'], result.user)
            queryClient.refetchQueries(['userProfile'])
        }
        return result
    }
    async resendVerificationLink(){
        const result = await apiCall(`${this.route}resend-email`, {}, 'POST')
        if(!result.error){
            console.log(result.user)
            queryClient.setQueryData(['userProfile'], result.user)
            queryClient.refetchQueries(['userProfile'])
        }
        return result
    }
}


const user = new User()
export default user