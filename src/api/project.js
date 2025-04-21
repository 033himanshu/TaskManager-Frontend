import queryClient from '@/lib/react-query-client'
import apiCall from './axios'

class Project{
    constructor(){
        this.route = 'project/'
    }
    async allProjects(){
        return await apiCall(`${this.route}all-projects`, {}, 'POST')
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
    async updateAvatar(data){
        const result = await apiCall(`${this.route}update-avatar`, data, 'POST')
        if(!result.error){
            console.log(result.user)
            queryClient.setQueryData(['userProfile'], result.user)
            queryClient.refetchQueries(['userProfile'])
        }
        return result
    }
}


const project = new Project()
export default project