

// PasswordUpdateForm.jsx
import MyForm from "@/components/forms/FormLayout"
import { z } from "zod"
import User from "@/api/user"
import { Card } from "@/components/ui/card"

const passwordSchema = z.object({
  oldPassword: z.string().min(8, "Old password required"),
  password: z.string().min(8, "New password must be at least 8 characters"),
})

export default function PasswordUpdateForm({formToggle}) {
  const fields = [
    { name: "oldPassword", label: "Old Password", type: "password" },
    { name: "password", label: "New Password", type: "password" },
  ]

  return (
    <Card>
      <MyForm
        schema={passwordSchema}
        fields={fields}
        buttonText="Update Password"
        afterSubmit={()=>formToggle(false)}
        defaultValues={{ 
          oldPassword: "", 
          password: ""
        }}
        onSubmit={async (data) => {
          const result = await User.updatePassword(data)
          console.log(result)
          if (result?.error) alert(result.error)
          else alert("Password updated successfully")
        }}
      />
    </Card>
  )
}