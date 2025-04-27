import queryClient from '@/lib/react-query-client'
import apiCall from './axios'

class Project{
    constructor(){
        this.route = 'project/'
    }
    async allProjects(){
        const result = await apiCall(`${this.route}all-projects`, {}, 'POST')
        if(!result?.error){
            result?.projects?.forEach(project => {
                queryClient.setQueryData(['userRole', {pId : project._id}], project.role)
            })
        }
        return result
    }
    async createProject(data){
        const result = await apiCall(`${this.route}create-new-project`, data, 'POST')
        if(!result.error){
            console.log(result)
            queryClient.invalidateQueries(['allProjects'])
            // queryClient.refetchQueries(['allProjects'])
        }
        return result
    }
    async getAllProjectMembers({projectId}){
        console.log(projectId)
        const result = await apiCall(`${this.route}get-all-project-member`, {projectId}, 'POST')
        if(!result.error){
            console.log(result)
            queryClient.setQueryData(['projectMembers', { pid: projectId }], result)
            // queryClient.refetchQueries(['projectMembers', { pid: projectId }])
        }
        return result
    }
    async getProjectMember({projectId, memberId}){
        const result = await apiCall(`${this.route}get-project-member`, {projectId, memberId}, 'POST')
        console.log(result)
        if(!result.error){
            queryClient.setQueryData(['projectMember', { pid: projectId, mid : memberId }], result)
            // queryClient.refetchQueries(['projectMember', { pid: projectId, mid : memberId }])
        }
        return result

    }
    async updateProjectDetails({name, description, projectId}){
        const result = await apiCall(`${this.route}update-project-details`, {name, description, projectId}, 'PATCH')
        if(!result.error){
            console.log(result)
            queryClient.setQueryData(['project', { pid: projectId }], result)
            // queryClient.refetchQueries(['project', { pid: projectId }])
        }
        return result
    }
    async deleteProject({projectId}){
        const result = await apiCall(`${this.route}delete-project`, {projectId}, 'DELETE')
        if(!result.error){
            console.log(result)
            queryClient.invalidateQueries(['project', { pid: projectId }])
        }
        return result
    }
    async projectDetails({projectId}){
        console.log("api call",projectId)
        const result = await apiCall(`${this.route}project-details`, {projectId}, 'POST')
        if(!result.error){
            queryClient.setQueryData(['project', { pid: projectId }], result)
            // queryClient.refetchQueries(['project', { pid: projectId }])
        }
        return result
    }
}


const project = new Project()
export default project