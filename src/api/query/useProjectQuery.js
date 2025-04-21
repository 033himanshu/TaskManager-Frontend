import { useQuery } from '@tanstack/react-query'
import project from '@/api/project'

const fetchAllProjects = async () => await project.allProjects()

export const useFetchAllProjects = () => {
  return useQuery({
    queryKey: ['allProjects'],
    queryFn: fetchAllProjects,
    staleTime: 60 * 60 * 1000,
  })
}

