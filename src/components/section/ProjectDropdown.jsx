
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

export const ProjectDropdown = ({ projects = [] }) => {
  const [selectedProject, setSelectedProject] = useState(projects[0] || "Select Project")

  const handleSelect = (project) => {
    setSelectedProject(project)
    // You might want to add project change logic here
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 font-medium hover:bg-gray-50"
        >
          <span className="truncate max-w-[120px]">{selectedProject}</span>
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
          {selectedProject}
        </DropdownMenuItem>

        {projects.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5 text-xs font-medium text-gray-500">
              AVAILABLE PROJECTS
            </div>
            {projects
              .filter(project => project !== selectedProject)
              .map((project, i) => (
                <DropdownMenuItem
                  key={i}
                  onClick={() => handleSelect(project)}
                  className="group"
                >
                  <span className="group-hover:font-medium transition-all">
                    {project}
                  </span>
                </DropdownMenuItem>
              ))
            }
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => { /* Add create project logic */ }}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}