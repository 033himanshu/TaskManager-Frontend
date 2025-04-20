"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProjectDropdown } from "./ProjectDropdown"
// import { useAuth } from "@/hooks/useAuth" // imaginary auth hook
import logo from '../../../public/logo.png'
import { useUserProfile } from "@/api/query/useUserQuery"
export default function Header() {
    const navigate = useNavigate()
    //   const { user, isLoggedIn } = useAuth() // Your auth logic here
    const { data:user } = useUserProfile()
    console.log(user)
    const isLoggedIn = user?.fullName ? true : false
    const projects = ['Project1', 'Project2']
  return (
    <header className="w-full px-4 py-3 bg-white shadow-md flex items-center justify-between">
      
      <div className="flex items-center space-x-4">
      <img
          src={logo}
          alt="Logo"
          className="h-10 w-32 cursor-pointer"
          onClick={() => navigate("/")}
        />
        
        {isLoggedIn && <ProjectDropdown projects={projects}/>}
      </div>

      {/* Right side: Profile or Auth Button */}
      <div>
        {isLoggedIn ? (
          <Avatar
            onClick={() => navigate("/profile")}
            className="cursor-pointer hover:ring-2 hover:ring-blue-500"
          >
            <AvatarImage src={user?.avatar || "/defaults-avatar.png"} />
            <AvatarFallback>{user?.fullName?.[0] || "U"}</AvatarFallback>
          </Avatar>
        ) : (
          <Button variant="outline" onClick={() => navigate("/auth")}>
            Login / Register
          </Button>
        )}
      </div>
    </header>
  )
}
