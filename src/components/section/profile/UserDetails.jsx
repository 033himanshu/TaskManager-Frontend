

// UserDetails.jsx
import MyForm from '@/components/forms/FormLayout'
import { Button } from "@/components/ui/button"
import { z } from "zod"
import User from "@/api/user"
import Auth from "@/api/auth"
import { useNavigate } from 'react-router-dom'
import { Card } from "@/components/ui/card"

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
  const navigate = useNavigate()
  
  if (editMode) {
    const fields = [
      { name: "fullName", label: "Full Name", placeholder: user.fullName },
      { name: "username", label: "Username", placeholder: user.username},
      { name: "email", label: "Email", placeholder: user.email },
    ]

    return (
      <Card className="p-6">
        <MyForm
          schema={schema}
          fields={fields}
          afterSubmit={()=>setEditMode(false)}
          defaultValues={{ 
            fullName: user.fullName, 
            username: user.username, 
            email: user.email 
          }}
          onSubmit={async (data) => await User.updateProfile(data)}
          buttonText="Save Changes"
        />
        <Button 
          variant="outline" 
          className="mt-4 w-full"
          onClick={() => setEditMode(false)}
        >
          Cancel
        </Button>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold">{user.fullName}</h3>
          <p className="text-gray-600">@{user.username}</p>
          <p className="flex items-center gap-1">
            <span>{user.email}</span>
            {user.isEmailVerified && (
              <span className="text-green-600">✔</span>
            )}
          </p>
        </div>
        
        <Button 
          onClick={() => setEditMode(true)} 
          className="w-full"
        >
          Edit Profile
        </Button>
      </div>
    </Card>
  )
}
