import queryClient from "@/lib/react-query-client"
import apiCall from "./axios"

class Task{
    constructor(){
        this.route = 'task/'
    }
    async addTask({title, description, projectId, boardId}){
        const result =  await apiCall(`${this.route}create-task`, {title, description, projectId, boardId}, 'POST')
        if(!result.error){
            console.log(result)
            queryClient.setQueryData(['board', { bId: boardId, pId: projectId }], result)
            queryClient.refetchQueries(['board', { bId: boardId, pId: projectId }])
        }
        return result
    }
    async addSubTask({title, taskId, projectId, boardId}){
        const result =  await apiCall(`${this.route}create-subtask`, {title, taskId, projectId, boardId}, 'POST')
        if(!result.error){
            console.log(result)
            queryClient.setQueryData(['task', { tId:taskId, bId: boardId, pId: projectId }], result)
            queryClient.refetchQueries(['task', { tId:taskId, bId: boardId, pId: projectId }])
        }
        return result
    }
    async updateBoardAndPosition({taskId, boardId, newBoardId, newIndex, projectId}){
        // console.log({boardId, newIndex, projectId})
        const result = await apiCall(`${this.route}change-board-and-position`, {taskId, boardId, newBoardId, newIndex, projectId}, 'PATCH')
        console.log(result)
        if(!result.error){
            queryClient.setQueryData(['board', { bId: result[0]._id, pId: projectId }], result[0])
            queryClient.setQueryData(['board', { bId: result[1]._id, pId: projectId }], result[1])
            queryClient.refetchQueries(['board', { bId: result[0]._id, pId: projectId }])
            queryClient.refetchQueries(['board', { bId: result[1]._id, pId: projectId }])
        }
        return result
    }
    async updateTaskDetails({title, description, projectId, boardId, taskId}){
        console.log({title, description, projectId, boardId})
        const result = await apiCall(`${this.route}update-task`, {title, taskId, description, projectId, boardId}, 'PATCH')
        console.log(result)
        if(!result.error){
            queryClient.setQueryData(['task', { tId:taskId, bId: boardId, pId: projectId }], result)
            // queryClient.refetchQueries(['project', { id: projectId }])
        }
        return result
    }
    async taskDetails({taskId, boardId, projectId}){
        console.log("api call", boardId)
        const result = await apiCall(`${this.route}task-details`, {taskId, boardId, projectId}, 'POST')
        if(!result.error){
            console.log(result)
            queryClient.setQueryData(['task', { tId:taskId, bId: boardId, pId: projectId }], result)
            // queryClient.refetchQueries(['board', { bId: boardId, pId: projectId }])
        }
        return result
    }
    async subTaskDetails({subTaskId, taskId, boardId, projectId}){
        // console.log("api call", boardId)
        const result = await apiCall(`${this.route}subtask-details`, {subTaskId, taskId, boardId, projectId}, 'POST')
        if(!result.error){
            console.log(result)
            queryClient.setQueryData(['subtask', { stId:subTaskId, tId:taskId, bId: boardId, pId: projectId }], result)
            // queryClient.refetchQueries(['board', { bId: boardId, pId: projectId }])
        }
        return result
    }
}

export default new Task()