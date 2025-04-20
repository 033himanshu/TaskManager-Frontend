import queryClient from '@/lib/react-query-client'
import apiCall from './axios'

class User{
    constructor(){
        this.route = 'user/'
    }
    async userProfile(){
        return await apiCall(`${this.route}me`, null, 'GET')
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
}


const user = new User()
export default user