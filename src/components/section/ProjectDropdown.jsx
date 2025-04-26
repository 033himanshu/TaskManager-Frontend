
"use client"

import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown, Plus } from "lucide-react"
import { useFetchProject } from "@/api/query/useProjectQuery"
import { useNavigate } from "react-router-dom"

export const ProjectDropdown = ({ projects = [] }) => {
  const [selectedProject, setSelectedProject] = useState("Select Project")
  const navigate = useNavigate()
  const handleSelect = (project) => {
    setSelectedProject(project)
    // You might want to add project change logic here
    if(project?._id){
      navigate(`project/${project._id}`)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 font-medium hover:bg-gray-50"
        >
          <span className="truncate max-w-[120px]">{selectedProject==="Select Project" ? "Select Project" : selectedProject.name}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-56">
        <div className="px-2 py-1.5 text-xs font-medium text-gray-500">
          CURRENT PROJECT
        </div>
        <DropdownMenuItem 
          className="font-semibold"
          onClick={() => {}}
        >
        {selectedProject==="Select Project" ? "" : selectedProject.name}
        </DropdownMenuItem>

        {projects.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5 text-xs font-medium text-gray-500">
              AVAILABLE PROJECTS
            </div>
            {projects
              .filter(project => project !== selectedProject)
              .map((project) => (
                <DropdownMenuItem
                  key={project._id}
                  onClick={() => handleSelect(project)}
                  className="group"
                >
                  <span className="group-hover:font-medium transition-all">
                    {project.name}
                  </span>
                </DropdownMenuItem>
              ))
            }
          </>
        )}

        
      </DropdownMenuContent>
    </DropdownMenu>
  )
}