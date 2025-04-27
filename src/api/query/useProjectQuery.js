import { useQuery } from '@tanstack/react-query'
import project from '@/api/project'

const fetchAllProjects = async () => await project.allProjects()
const fetchProject = async (projectId) => await project.projectDetails({projectId})
const fetchAllProjectMembers = async(projectId) => await project.getAllProjectMembers({projectId})
const fetchProjectMember = async(projectId, memberId) => await project.getProjectMember({projectId, memberId})

export const useFetchAllProjects = () => {
  return useQuery({
    queryKey: ['allProjects'],
    queryFn: fetchAllProjects,
    staleTime: 60 * 60 * 1000,
  })
}
export const useFetchUserRole = (projectId) => {
  return useQuery({
    queryKey: ['userRole', {pId : projectId}],
    queryFn: ()=>"member",
    staleTime : Infinity,
    enabled: !!projectId, 
  })
}

export const useFetchProject = (projectId) => {
  return useQuery({
    queryKey: ['project', { pid: projectId }], 
    queryFn: () => fetchProject(projectId),
    staleTime: 30 * 60 * 1000, 
    enabled: !!projectId, 
  })
}

export const useFetchMember = (projectId, memberId) => {
  console.log({projectId, memberId})
  return useQuery({
    queryKey: ['projectMember', { pid: projectId, mid : memberId }],
    queryFn: () => fetchProjectMember(projectId, memberId),
    staleTime: 30 * 60 * 1000, 
    enabled: !!(projectId && memberId), 
  })
}

export const useFetchAllMember = (projectId) => {
  return useQuery({
    queryKey: ['projectMembers', { pid: projectId }], 
    queryFn: () => fetchAllProjectMembers(projectId),
    staleTime: 30 * 60 * 1000, 
    enabled: !!projectId, 
  })
}

