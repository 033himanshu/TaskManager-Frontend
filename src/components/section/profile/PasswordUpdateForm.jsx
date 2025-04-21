

// PasswordUpdateForm.jsx
import MyForm from "@/components/forms/FormLayout"
import { z } from "zod"
import Auth from "@/api/auth"
import { Card } from "@/components/ui/card"

const passwordSchema = z.object({
  oldPassword: z.string().min(6, "Old password required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
})

export default function PasswordUpdateForm() {
  const fields = [
    { name: "oldPassword", label: "Old Password", type: "password" },
    { name: "newPassword", label: "New Password", type: "password" },
  ]

  return (
    <Card>
      <MyForm
        schema={passwordSchema}
        fields={fields}
        buttonText="Update Password"
        onSubmit={async (data) => {
          const result = await Auth.updatePassword(data)
          if (result?.error) alert(result.error)
          else alert("Password updated successfully")
        }}
      />
    </Card>
  )
}