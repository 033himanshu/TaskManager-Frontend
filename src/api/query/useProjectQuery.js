import { useMutation } from '@tanstack/react-query'
import auth from '@/api/auth'
import queryClient from '@/lib/react-query-client'

const register = async (data) => await auth.register(data)
const login = async (data) => await auth.login(data)
const logout = async () => await auth.logout(data)
const refreshAccessToken = async () => await auth.refreshAccessToken(data)

export const useAuthRegister = (data, form) => {
  return useMutation({
    mutationFn: ()=>register(data),
    onSuccess: (data) => {
      queryClient.setQueryData(['userProfile'], data.user)
      if (data?.error) {
        form.setError("root", {
          type: "manual",
          message: data.error || "Something went wrong",
        })
      } else {
        form.reset()
      }
    },
    onError: (error) => {
      form.setError("root", {
        type: "manual",
        message: error.message || "Submission failed",
      })
    }
  })
}

export const useAuthLogin = (data, form) => {
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      queryClient.setQueryData(['userProfile'], data.user)
    }
  })
}

export const useAuthLogout = () => {
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries(['userProfile'])
    }
  })
}

export const useAuthRefreshAccessToken = () => {
  return useMutation({
    mutationFn: refreshAccessToken,
    onSuccess: () => {
      queryClient.invalidateQueries(['userProfile'])
    }
  })
}


