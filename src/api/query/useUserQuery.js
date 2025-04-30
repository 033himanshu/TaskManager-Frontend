import { useQuery } from '@tanstack/react-query'
import user from '@/api/user'

const fetchUserProfile = async () => await user.userProfile()
const fetchUserRole = async () => await user.getUserRoles()


export const useUserProfile = () => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
    staleTime: 2* 60 * 60 * 1000,
  })
}

export const useFetchUserRoles = () => {
  return useQuery({
    queryKey: ['userRoles'],
    queryFn: fetchUserRole,
    staleTime: 2* 60 * 60 * 1000,
  })
}

