import { useQuery } from '@tanstack/react-query'
import project from '@/api/project'

const fetchAllProjects = async () => await project.allProjects()
const fetchProject = async (_id) => await project.projectDetails(_id)

export const useFetchAllProjects = () => {
  return useQuery({
    queryKey: ['allProjects'],
    queryFn: fetchAllProjects,
    staleTime: 60 * 60 * 1000,
  })
}

export const useFetchProject = (_id) => {
  return useQuery({
    queryKey: ['project', { id: _id }], 
    queryFn: () => fetchProject(_id),
    staleTime: 30 * 60 * 1000, 
    enabled: !!_id, 
    retry: 2,
  })
}

