
"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProjectDropdown } from "./ProjectDropdown"
import logo from '../../../public/logo.png'
import { useUserProfile } from "@/api/query/useUserQuery"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User, Settings } from "lucide-react"

export default function Header() {
  const navigate = useNavigate()
  const { data: user } = useUserProfile()
  const isLoggedIn = user?.fullName ? true : false
  const projects = ['Project1', 'Project2']

  return (
    <header className="w-full px-6 py-3 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left side - Logo and Navigation */}
        <div className="flex items-center space-x-8">
          <img
            src={logo}
            alt="Logo"
            className="h-10 w-auto cursor-pointer transition-transform hover:scale-105"
            onClick={() => navigate("/")}
          />
          
          {isLoggedIn && (
            <nav className="hidden md:flex items-center space-x-6">
              <ProjectDropdown projects={projects} />
              <Button 
                variant="ghost" 
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </Button>
            </nav>
          )}
        </div>

        {/* Right side - User/Auth controls */}
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center space-x-2 cursor-pointer group">
                  <Avatar className="h-9 w-9 group-hover:ring-2 group-hover:ring-blue-500 transition-all">
                    <AvatarImage src={user?.avatar || "/default-avatar.png"} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {user?.fullName?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline text-sm font-medium text-gray-700">
                    {user?.fullName || "User"}
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-red-600 focus:text-red-600 focus:bg-red-50"
                  onClick={() => {
                    // Add your logout logic here
                    navigate("/auth")
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex space-x-3">
              <Button 
                variant="ghost" 
                className="hidden sm:inline-flex"
                onClick={() => navigate("/auth?mode=login")}
              >
                Sign In
              </Button>
              <Button 
                onClick={() => navigate("/auth?mode=register")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Get Started
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
