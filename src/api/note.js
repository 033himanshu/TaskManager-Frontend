import queryClient from '@/lib/react-query-client'
import apiCall from './axios'

class Note{
    constructor(){
        this.route = 'note/'
    }
    async getAllNote({projectId}){
        // console.log(projectId)
        const result = await apiCall(`${this.route}get-notes`, {projectId}, 'POST')
        // console.log(result)
        if(!result.error){
            console.log(result)
            queryClient.setQueryData(['note', { pid: projectId }], result)
            // queryClient.refetchQueries(['allProjects'])
        }
        return result
    }
    async addNote({projectId, content}){
        const result = await apiCall(`${this.route}add-note`, {projectId, content}, 'POST')
        if(!result.error){
            // console.log(result)
            queryClient.setQueryData(['note', { pid: projectId }], (oldData) => oldData?.notes?.push(result._id) || {notes : []})
            queryClient.setQueryData(['note', {pid: projectId, nId : result._id}], result)
            queryClient.refetchQueries(['note', { pid: projectId }])
        }
        return result
    }
    async getNote({projectId, noteId}){
        const result = await apiCall(`${this.route}get-note`, {projectId, noteId}, 'POST')
        if(!result?.error){
            queryClient.setQueryData(['note', {pid: projectId, nId : noteId}], result)
        }
        return result
    }
    async updateNote({projectId, noteId, content}){
        const result = await apiCall(`${this.route}update-note`, {projectId, noteId, content}, 'PATCH')
        if(!result?.error){
            queryClient.setQueryData(['note', {pid: projectId, nId : noteId}], result)
        }
        return result
    }
    async deleteNote({projectId, noteId}){
        const result = await apiCall(`${this.route}delete-note`, {projectId, noteId}, 'DELETE')
        // console.log(result)
        if(!result?.error){
            queryClient.setQueryData(['note', { pid: projectId }], (oldData) => oldData?.notes?.filter( note => note!==noteId) || {notes : []})
            queryClient.refetchQueries(['note', {pid: projectId}])
        }
        return result
    }
    
}


const note = new Note()
export default note