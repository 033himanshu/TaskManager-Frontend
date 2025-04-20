"use client"

import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export const ProjectDropdown = ({ projects = [] }) => {
  const [selectedProject, setSelectedProject] = useState("Select Project")

  const handleSelect = (project) => {
    setSelectedProject(project)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="text-gray-700 font-medium capitalize"
        >
          {selectedProject}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-48">
        {projects.length > 0 ? (
          projects.map((project, i) => (
            <DropdownMenuItem
              key={i}
              onClick={() => handleSelect(project)}
              className={project === selectedProject ? "font-semibold" : ""}
            >
              {project}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>No Projects</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
