import { useQuery } from '@tanstack/react-query'
import note from '@/api/note'

const fetchNote = async (projectId, noteId) => await note.getNote({projectId, noteId})
const fetchAllNotes = async (projectId) => await note.getAllNote({projectId})

export const useFetchAllNotes = (projectId) => {
    return useQuery({
        queryKey : ['note', {pid: projectId}],
        queryFn : ()=> fetchAllNotes(projectId),
        stateTime : 30*60*1000,
        enabled : !!(projectId)
      })
}
export const useFetchNote = (projectId, noteId) => {
    return useQuery({
      queryKey : ['note', {pid: projectId, nId : noteId}],
      queryFn : ()=> fetchNote(projectId, noteId),
      stateTime : 30*60*1000,
      enabled : !!(projectId && noteId)
    })
  }