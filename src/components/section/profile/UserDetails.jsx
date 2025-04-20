import MyForm from '@/components/forms/FormLayout'
import { Button } from "@/components/ui/button"
import { z } from "zod"

import User from "@/api/user"

const schema = z.object({
  email: z
    .string()
    .nonempty({ message: "Email is required" })
    .email({ message: "Email is invalid" }),

  username: z
    .string()
    .nonempty({ message: "Username is required" })
    .toLowerCase({ message: "Username must be lowercase" })
    .min(3, { message: "Username must be at least 3 characters long" }),

  fullName: z
    .string()
    .nonempty({ message: "Full name is required" }),
})

export default function UserDetails({ user, editMode, setEditMode }) {

  if (editMode) {
    const fields = [
      { name: "fullName", label: "Full Name", placeholder: user.fullName },
      { name: "username", label: "Username", placeholder: user.username},
      { name: "email", label: "Email", placeholder: user.email },
    ]

    return (
      <div className="flex-1">
        <MyForm
          schema={schema}
          fields={fields}
          afterSubmit={()=>setEditMode(false)}
          defaultValues={{ fullName: user.fullName, username: user.username, email : user.email }}
          onSubmit={async (data) => await User.updateProfile(data)}
          buttonText="Update"
        />
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-2">
      <h2 className="text-xl font-bold">{user.fullName}</h2>
      <p>@{user.username}</p>
      <p>
        {user.email}{" "}
        {user.isEmailVerified && <span className="text-green-600">✔</span>}
      </p>
      <Button onClick={() => setEditMode(true)} className="mt-4">
        Edit Profile
      </Button>
    </div>
  )
}
