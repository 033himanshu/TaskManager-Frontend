import { useMutation, useQuery } from '@tanstack/react-query'
import queryClient from '@/lib/react-query-client'
import user from '@/api/user'

const fetchUserProfile = async () => await user.userProfile()
const updateUserProfile = async (data) => await user.updateProfile(data)

export const useUserProfile = () => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
    staleTime: 2* 60 * 60 * 1000,
  })
}

export const useUpdateUserProfile = (data) => {
  return useMutation({
    mutationFn: () => updateUserProfile(data),
    onSuccess: (data) => {
      queryClient.setQueryData(['userProfile'], data.user)
      queryClient.refetchQueries(['userProfile'])
    }
  })
}
