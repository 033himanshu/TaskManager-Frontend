import { useQuery } from '@tanstack/react-query'
import user from '@/api/user'

const fetchUserProfile = async () => await user.userProfile()

export const useUserProfile = () => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
    staleTime: 2* 60 * 60 * 1000,
  })
}

