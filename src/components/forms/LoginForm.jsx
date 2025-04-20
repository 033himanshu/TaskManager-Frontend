"use client"

import { useState } from "react"
import MyForm from "./FormLayout"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import Auth from "@/api/auth"
import { useNavigate } from "react-router-dom"


export default function LoginForm() {
  const [loginWith, setLoginWith] = useState("email")
  const navigate = useNavigate()
  
  const schema = z.object({
    [loginWith]: loginWith === "email"
      ? z.string().nonempty({ message: "Email is required" }).email({ message: "Email is invalid" })
      : z.string().nonempty({ message: "Username is required" }).min(3, { message: "Username must be at least 3 characters" }),
    password: z.string().nonempty({ message: "Password is required" }),
  })
  
  const fields = [
    {
      name: loginWith,
      label: loginWith === "email" ? "Email" : "Username",
      placeholder: loginWith === "email" ? "e.g. john@example.com" : "e.g. john_doe",
      type: loginWith === "email" ? "email" : "text",
    },
    {
      name: "password",
      label: "Password",
      placeholder: "••••••••",
      type: "password",
    },
  ]

  const handleSubmit = async (data) => {
    const payload = {
      [loginWith]: data[loginWith],
      password: data.password,
    }

    return await Auth.login(payload)
  }

  const handleGoogleLogin = () => {
    // Placeholder function for Google login integration
    alert("Google Login not implemented yet.")
  }

  const defaultValues = {
    email: '',
    username: '',
    password: '',
  }

  return (
    <div className="bg-gray-50 flex justify-center items-center">
      <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-lg flex flex-col">

        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Login</h2>

        {/* Login Option Toggle */}
        <div className="flex justify-center gap-4 mb-6">
          {["email", "username"].map((option) => (
            <button
              key={option}
              onClick={() => setLoginWith(option)}
              type="button"
              className={`text-lg transition hover:text-blue-600 ${
                loginWith === option
                  ? "font-semibold underline underline-offset-4 text-blue-600"
                  : "text-gray-600"
              }`}
            >
              {option === "email" ? "Email" : "Username"}
            </button>
          ))}
        </div>

        {/* Dynamic Form */}
        <MyForm
          key={loginWith} // important to reset form on toggle
          schema={schema}
          fields={fields}
          onSubmit={handleSubmit}
          buttonText="Login"
          afterSubmit = {()=>navigate("/")}
          defaultValues={defaultValues}
        />

        {/* Google Login Button */}
        <Button
          className="bg-red-600 text-white mt-4 justify-center hover:bg-red-500"
          onClick={handleGoogleLogin}
        >
          Continue With Google
        </Button>
      </div>
    </div>
  )
}
