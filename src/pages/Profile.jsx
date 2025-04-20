import { useState } from "react"
import { useUserProfile } from "@/api/query/useUserQuery"
import UserDetails from "@/components/section/profile/UserDetails"
import AvatarSection from "@/components/section/profile/Avatar"


export default function Profile() {
  const { data: user, isLoading, isError, error } = useUserProfile()
  const [editMode, setEditMode] = useState(false)

  if (isLoading) return <p>Loading...</p>
  if(isError) return <p>{error}</p>
  else{
     return (
      <div className="flex flex-col md:flex-row gap-8 p-6">
        <AvatarSection avatar={user.avatar} />
        <UserDetails user={user} editMode={editMode} setEditMode={setEditMode} />
      </div>
    )
  }
}
