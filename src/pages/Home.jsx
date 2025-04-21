import { useState } from "react"
import { useFetchAllProjects } from "@/api/query/useProjectQuery"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { Plus, Users, Clock, ChevronRight } from "lucide-react"
import MyForm from "@/components/forms/FormLayout"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Form validation schema
const projectSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters"),
  description: z.string().optional(),
})

export default function Home() {
  const { data, isLoading, refetch } = useFetchAllProjects()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const handleCreateProject = async (formData) => {
    try {
      // Add your API call to create project here
      // await createProjectAPI(formData)
      console.log("Creating project:", formData)
      setIsCreateDialogOpen(false)
      refetch() // Refresh the project list
    } catch (error) {
      console.error("Error creating project:", error)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your Projects</h1>
          <p className="text-muted-foreground">
            Manage and organize your team's work
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
          <Plus size={16} />
          New Project
        </Button>
      </div>

      {/* Projects List */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading projects...</p>
        </div>
      ) : data?.projects?.length === 0 ? (
        <Card className="text-center p-8">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">No projects yet</h3>
            <p className="text-muted-foreground">
              Get started by creating your first project
            </p>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)} 
              className="mt-4"
            >
              Create Project
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-2">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b">
            <div className="col-span-5">Project</div>
            <div className="col-span-4">Description</div>
            <div className="col-span-1 flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Members</span>
            </div>
            <div className="col-span-1">Role</div>
            <div className="col-span-1 flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Created</span>
            </div>
          </div>

          {/* Projects */}
          {data?.projects?.map((project) => (
            <Card 
              key={project.id} 
              className="hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => console.log("Navigate to project", project.id)}
            >
              <CardContent className="grid grid-cols-12 gap-4 p-4 items-center">
                <div className="col-span-5 font-medium flex items-center">
                  <span className="group-hover:text-primary transition-colors">
                    {project.name}
                  </span>
                  <ChevronRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="col-span-4 text-sm text-muted-foreground truncate">
                  {project.description || "No description"}
                </div>
                <div className="col-span-1 text-sm">
                  {project.members || 0}
                </div>
                <div className="col-span-1 text-sm capitalize">
                  {project.role || "-"}
                </div>
                <div className="col-span-1 text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Project Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <MyForm
            schema={projectSchema}
            fields={[
              {
                name: "name",
                label: "Project Name",
                placeholder: "e.g. Marketing Campaign",
              },
              {
                name: "description",
                label: "Description (Optional)",
                placeholder: "Briefly describe your project",
                type: "textarea",
              },
            ]}
            onSubmit={handleCreateProject}
            buttonText="Create Project"
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
