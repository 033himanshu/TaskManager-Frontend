import { useQuery } from '@tanstack/react-query'

import board from '@/api/board'

const fetchBoardDetails = async (boardId, projectId) => await board.boardDetails({boardId, projectId})

export const useFetchBoardDetails = (boardId, projectId) => {
  return useQuery({
    queryKey: ['board', { bId: boardId, pId: projectId }], 
    queryFn: () => fetchBoardDetails(boardId, projectId),
    staleTime: 30 * 60 * 1000, 
    enabled: !!(boardId && projectId), 
    retry: 2,
  })
}

