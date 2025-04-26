import queryClient from '@/lib/react-query-client'
import apiCall from './axios'

class Project{
    constructor(){
        this.route = 'project/'
    }
    async allProjects(){
        return await apiCall(`${this.route}all-projects`, {}, 'POST')
    }
    async createProject(data){
        const result = await apiCall(`${this.route}create-new-project`, data, 'POST')
        if(!result.error){
            console.log(result)
            queryClient.invalidateQueries(['allProjects'])
            queryClient.refetchQueries(['allProjects'])
        }
        return result
    }
    async updateProjectDetails({name, description, projectId}){
        const result = await apiCall(`${this.route}update-project-details`, {name, description, projectId}, 'PATCH')
        if(!result.error){
            console.log(result)
            queryClient.setQueryData(['project', { id: projectId }], result)
            queryClient.refetchQueries(['project', { id: projectId }])
        }
        return result
    }
    async deleteProject({projectId}){
        const result = await apiCall(`${this.route}delete-project`, {projectId}, 'DELETE')
        if(!result.error){
            console.log(result)
            queryClient.invalidateQueries(['project', { id: projectId }])
        }
        return result
    }
    async projectDetails(_id){
        console.log("api call",_id)
        const result = await apiCall(`${this.route}project-details`, {projectId:_id}, 'POST')
        return result
    }
}


const project = new Project()
export default project