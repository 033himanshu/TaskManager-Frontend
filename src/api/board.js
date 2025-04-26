import queryClient from "@/lib/react-query-client"
import apiCall from "./axios"

class Board{
    constructor(){
        this.route = 'board/'
    }
    async addBoard({name, description, projectId}){
        const result =  await apiCall(`${this.route}add-board`, {name, description, projectId}, 'POST')
        if(!result.error){
            console.log(result)
            queryClient.setQueryData(['project', { id: projectId }], result)
            queryClient.refetchQueries(['project', { id: projectId }])
        }
        return result
    }
    async updateBoardPosition({boardId, newIndex, projectId}){
        console.log({boardId, newIndex, projectId})
        const result = await apiCall(`${this.route}update-board-position`, {boardId, newIndex, projectId}, 'PATCH')
        console.log(result)
        if(!result.error){
            queryClient.setQueryData(['project', { id: projectId }], result)
            queryClient.refetchQueries(['project', { id: projectId }])
        }
        return result
    }
    async boardDetails({projectId, boardId}){
        console.log("api call",boardId)
        const result = await apiCall(`${this.route}get-board`, {projectId, boardId}, 'POST')
        if(!result.error){
            console.log(result)
            queryClient.setQueryData(['board', { bId: boardId, pId: projectId }], result)
            // queryClient.refetchQueries(['board', { bId: boardId, pId: projectId }])
        }
        return result
    }
}

export default new Board()