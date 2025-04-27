import { Draggable, Droppable } from "@hello-pangea/dnd";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { taskSchema } from "@/Schema";
import BoardApi from "@/api/board";
import TaskApi from "@/api/task";
import DialogBox from "../forms/DialogBox";
import { useFetchUserRole } from "@/api/query/useProjectQuery";
import { useFetchTaskDetails } from "@/api/query/useTaskQuery";
import { Dialog } from "@radix-ui/react-dialog"
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog"

export default function Task({ id , provided, boardId}) {
    const { projectId } = useParams();
    const { data: task } = useFetchTaskDetails(id, boardId, projectId);
    const {data : role} = useFetchUserRole(projectId)
    const [isEditTaskDialogOpen, setIsEditTaskDialogOpen] = useState(false)
    const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false)

    const handleEditTaskDetails = async (data) => {
        console.log("Edit Task", data)
        const result = await TaskApi.updateTaskDetails({...data, projectId, boardId, taskId : id})
        
        if (result?.error) {
          return result.error
        } else {
            setIsEditTaskDialogOpen(false)
        } 
    }
    if (!task) return null;
    return (
        <>
            <Card className="h-full">
                <CardHeader 
                    {...provided.dragHandleProps}
                    className="cursor-move bg-gray-50"
                    // onClick={() => setSelectedBoard(board)}
                >
                    <CardTitle>{task.title}</CardTitle>
                    <CardDescription>{task.description}</CardDescription>
                    <CardDescription>{task._id}</CardDescription>
                    <Button onClick={()=>setIsTaskDetailsOpen(true)}>Details</Button>
                    {role && role!=='member' && (<Button onClick={()=>setIsEditTaskDialogOpen(true)}>Edit</Button>)}
                </CardHeader>
                {/* Card Content Removed */}
            </Card>
            <DialogBox  
                isDialogOpen={isEditTaskDialogOpen} 
                setIsDialogOpen={setIsEditTaskDialogOpen} 
                title={'Edit Task'} 
                schema={taskSchema} 
                defaultValues={{
                title : task?.title,
                description : task?.description,
                }} 
                fields={[
                    {
                      name: "title",
                      label: "Task Title",
                      placeholder: "e.g. Add Todo Functionality",
                    },
                    {
                      name: "description",
                      label: "Description (Optional)",
                      placeholder: "Briefly describe your Task",
                      type: "textarea",
                    },
                  ]} 
                handleSubmit={handleEditTaskDetails} 
                buttonText={'Save Changes'} 
            />
            <Dialog open={isTaskDetailsOpen} onOpenChange={setIsTaskDetailsOpen}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>{task?.title}</DialogTitle>
                        <DialogDescription>{task?.description}</DialogDescription>
                    </DialogHeader>
                    <Droppable droppableId={task._id} type="SUBTASK">
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="space-y-2 min-h-[100px]"
                            >
                                {task.subTasks?.map((subTaskId, subTaskIndex) => (
                                    <Draggable key={subTaskId} draggableId={subTaskId} index={subTaskIndex}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                            <SubTaskCard subTaskId={subTaskId} /> 
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                    {role && role!='member' && (<Button 
                        variant="ghost" 
                        className="w-full mt-2"
                        onClick={() => setSelectedBoard(board)}
                    >
                        + Add SubTask
                    </Button>)}


                </DialogContent>
            </Dialog>
        </>        
    );
}

