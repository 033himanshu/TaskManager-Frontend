// Profile.jsx
import { useState } from "react"
import { useUserProfile } from "@/api/query/useUserQuery"
import UserDetails from "@/components/section/profile/UserDetails"
import AvatarSection from "@/components/section/profile/Avatar"
import { Button } from "@/components/ui/button"
import Auth from "@/api/auth"
import PasswordUpdateForm from "@/components/section/profile/PasswordUpdateForm"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useNavigate } from "react-router-dom"

export default function Profile() {
  const { data: user, isLoading, isError, error } = useUserProfile()
  const [editMode, setEditMode] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const navigate = useNavigate()
  const handleResendVerification = async () => {
    await Auth.resendVerificationEmail()
    alert("Verification email sent!")
  }

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>{error?.message || "Something went wrong"}</p>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader className="border-b">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Manage your account information and security</CardDescription>
            </div>
            <Button 
              variant="destructive" 
              onClick={async () => {
                
                await Auth.logout()
                navigate("/")
              }}
            >
              Logout
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center gap-4">
              <AvatarSection avatar={user.avatar} />
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowPasswordForm(prev => !prev)}
              >
                {showPasswordForm ? "Cancel" : "Change Password"}
              </Button>
            </div>

            <div className="flex-1 space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-medium">Personal Information</h3>
                <p className="text-sm text-muted-foreground">
                  Update your personal details
                </p>
              </div>
              <Separator />

              <UserDetails user={user} editMode={editMode} setEditMode={setEditMode} />

              {!user.isEmailVerified && (
                <div className="p-4 bg-yellow-50 rounded-md border border-yellow-200">
                  <p className="text-yellow-800 text-sm flex items-center gap-2">
                    <span>Your email is not verified.</span>
                    <Button
                      variant="link"
                      onClick={handleResendVerification}
                      className="p-0 h-auto text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Resend verification email
                    </Button>
                  </p>
                </div>
              )}

              {showPasswordForm && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium">Password Update</h3>
                    <p className="text-sm text-muted-foreground">
                      Ensure your new password is strong and secure
                    </p>
                  </div>
                  <Separator />
                  <PasswordUpdateForm formToggle={setShowPasswordForm}/>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}