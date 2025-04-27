import { useQuery } from '@tanstack/react-query'

import task from '@/api/task'

const fetchTaskDetails = async (taskId, boardId, projectId) => await task.taskDetails({taskId, boardId, projectId})
const fetchSubTaskDetails = async (subTaskId, taskId, boardId, projectId) => await task.subTaskDetails({subTaskId, taskId, boardId, projectId})

export const useFetchTaskDetails = (taskId, boardId, projectId) => {
  return useQuery({
    queryKey: ['task', { tId:taskId, bId: boardId, pId: projectId }], 
    queryFn: () => fetchTaskDetails(taskId, boardId, projectId),
    staleTime: 30 * 60 * 1000, 
    enabled: !!(taskId && boardId && projectId),
  })
}

export const useFetchSubTaskDetails = (subTaskId, taskId, boardId, projectId) => {
    return useQuery({
        queryKey: ['subtask', { stId:subTaskId, tId:taskId, bId: boardId, pId: projectId }], 
        queryFn: () => fetchSubTaskDetails(subTaskId, taskId, boardId, projectId),
        staleTime: 30 * 60 * 1000, 
        enabled: !!(subTaskId && taskId && boardId && projectId),
      })
}
