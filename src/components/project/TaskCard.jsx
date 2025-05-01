import { Draggable, Droppable } from "@hello-pangea/dnd";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { taskSchema } from "@/Schema";
import TaskApi from "@/api/task";
import DialogBox from "../forms/DialogBox";
import { useFetchAllMember, useFetchMember, useFetchProject, useFetchUserRole } from "@/api/query/useProjectQuery";
import { useFetchTaskDetails } from "@/api/query/useTaskQuery";
import { Dialog } from "@radix-ui/react-dialog"
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog"
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Trash2, Paperclip, UserRoundPen, UserRoundPlus, Minus, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Task({ id , boardId}) {
    const { projectId } = useParams();
    const { data: task } = useFetchTaskDetails(id, boardId, projectId);
    const {data : projectDetails} = useFetchProject(projectId)
    const currentUserMemberId = projectDetails?.memberId
    const {data : role} = useFetchUserRole(projectId)
    const [isEditTaskDialogOpen, setIsEditTaskDialogOpen] = useState(false)
    const [isAssignMemberDialogOpen, setIsAssignMemberDialogOpen] = useState(false)
    const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false)
    const {data : projectMembers} = useFetchAllMember(projectId)
    console.log(task?.assignedTo, currentUserMemberId)

    const handleEditTaskDetails = async (data) => {
        console.log("Edit Task", data)
        const result = await TaskApi.updateTaskDetails({...data, projectId, boardId, taskId : id})
        
        if (result?.error) {
          return result.error
        } else {
            setIsEditTaskDialogOpen(false)
        } 
    }

    const handleAssignMember = async (memberId, assignedTo) => {
        console.log("Assign Member", memberId)
        if(memberId === assignedTo)
            memberId = undefined
        const result = await TaskApi.updateTaskAssignedMember({projectId, boardId, taskId: id, memberId})
        
        if (result?.error) {
          alert(result.error)
        } else {
            setIsAssignMemberDialogOpen(false)
        } 
    }

    if (!task) return null;
    return (
        <>
            <Card className={`h-full hover:shadow-md transition-shadow ${(currentUserMemberId===task?.assignedTo) && 'border-blue-400'}`}>
                <CardHeader className="p-4 space-y-2 my-[-10px]">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                    {role && role !== 'member' && (
                    <div className="flex space-x-[-10px]">
                        <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsAssignMemberDialogOpen(true);
                        }}
                        >
                            {/* {console.log(task?.title, task?.assignedTo)} */}
                            {task?.assignedTo ? <UserRoundPen className="h-4 w-4" /> : <UserRoundPlus className="h-4 w-4" />}
                        </Button>
                        <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsEditTaskDialogOpen(true);
                        }}
                        >
                        <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            if(confirm("Delete this task?")) {
                            TaskApi.deleteTask({ projectId, boardId, taskId: id });
                            }
                        }}
                        >
                        <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                    </div>
                    )}
                </div>
                <CardDescription>{task.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="p-1 pt-0 text-center">
                <Button 
                    variant="outline" 
                    className="w-3/4 mt-1 text-xs"
                    onClick={() => setIsTaskDetailsOpen(true)}
                >
                    View Details
                </Button>
                </CardContent>
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

            {/* Assign Member */}
                    <Dialog open={isAssignMemberDialogOpen} onOpenChange={setIsAssignMemberDialogOpen}>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>{task?.assignedTo ? 'update assigned': 'Assign'} member to {task.name} </DialogTitle>
                        </DialogHeader>
                        <div className='overflow-scroll max-h-80 overflow-x-hidden flex flex-col gap-2'>
                        {projectMembers?.members?.map(member => {
                          {console.log(member)}
                          return <MemberCard key={member._id} memberId={member._id} assignedTo={task?.assignedTo} onClick={()=>handleAssignMember(member._id, task?.assignedTo)}/>
                        })}
                        </div>
                      </DialogContent>
                    </Dialog>
        </>        
    );
}



function MemberCard({memberId, onClick, assignedTo}){
    const {projectId} = useParams()
    const {data : member} = useFetchMember(projectId, memberId)
    return (<Card key={member?._id} className="w-full" onClick={onClick}>
        <CardHeader className="flex flex-row items-center space-x-4 p-4 flex-wrap relative">
          <Avatar className="h-12 w-12">
            <AvatarImage src={member?.avatar} />
            <AvatarFallback>{member?.username.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <CardTitle>{member?.fullName}</CardTitle>
            <CardTitle>{member?.username}</CardTitle>
            <CardDescription>{member?.email}</CardDescription>
            {console.log(assignedTo, member?._id)}
            <span className="absolute top-2 right-2">{assignedTo===member?._id ? <Minus className="text-red-600"/> : <Plus className="text-green-600"/> }</span>
          </div>
        </CardHeader>
      </Card>)
}