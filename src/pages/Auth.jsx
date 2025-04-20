"use client"

import { useState } from "react"
import LoginForm from "../components/forms/LoginForm"
import RegisterForm from "../components/forms/RegisterForm"

export default function AuthPage() {
  const [mode, setMode] = useState("login") // or "register"

    return (
        <div className="bg-gray-50 flex justify-center items-center p-6">
            <div className="w-full max-w-md bg-white p-3 rounded-lg shadow-l">
                {/* Mode Toggle */}
                <div className="flex justify-center gap-4 mb-6">
                {["login", "register"].map((option) => (
                    <button
                    key={option}
                    onClick={() => setMode(option)}
                    type="button"
                    className={`text-lg transition hover:text-blue-600 ${
                        mode === option
                        ? "font-semibold underline underline-offset-4 text-blue-600"
                        : "text-gray-600"
                    }`}
                    >
                    {option === "login" ? "Login" : "Register"}
                    </button>
                ))}
                </div>

                {/* Form Content */}
                {mode === "login" ? <LoginForm /> : <RegisterForm />}
            </div>
        </div>
    )
}