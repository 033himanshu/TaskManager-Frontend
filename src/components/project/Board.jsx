import { Draggable, Droppable } from "@hello-pangea/dnd";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useFetchBoardDetails } from "@/api/query/useBoardQuery";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { boardSchema, taskSchema } from "@/Schema";
import BoardApi from "@/api/board";
import TaskApi from "@/api/task";
import DialogBox from "../forms/DialogBox";
import { useFetchUserRole } from "@/api/query/useProjectQuery";
import TaskCard from "./TaskCard";
import { Pencil, Trash2 } from "lucide-react";

export default function Board({ id , provided}) {
    // console.log(id)
    // const [selectedBoard, setSelectedBoard] = useState(null);
    const { projectId } = useParams();
    const { data: board } = useFetchBoardDetails(id, projectId);
    const {data : role} = useFetchUserRole(projectId)
    const [isEditBoardDialogOpen, setIsEditBoardDialogOpen] = useState(false)
    const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false)
    if (!board) return null;

    const handleEditBoardDetails = async (data) => {
        console.log("Edit Board", data)
        const result = await BoardApi.updateBoardDetails({...data, projectId, boardId: id})
        if (result?.error) {
          return result.error
        } else {
            setIsEditBoardDialogOpen(false)
        } 
    }
    const handleAddTask = async (data) => {
        console.log("Add Board", data)
        const result = await TaskApi.addTask({...data, projectId, boardId: id})
        if (result?.error) {
          return result.error
        } else {
            setIsAddTaskDialogOpen(false)
        } 
    }
    return (
          <>
            <Card className="h-full border shadow-sm">
              <CardHeader 
                {...provided.dragHandleProps}
                className="cursor-move bg-gray-50 p-4"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{board.name}</CardTitle>
                    <CardDescription>{board.description}</CardDescription>
                  </div>
                  {role && role !== 'member' && (
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setIsEditBoardDialogOpen(true)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if(confirm("Delete this board?")) {
                            BoardApi.deleteBoard({ projectId, boardId: id });
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                  <Droppable droppableId={board._id} type="TASK">
                      {(provided) => (
                          <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className="space-y-2 min-h-[100px] mt-2"
                          >
                              {board.tasks?.map((taskId, taskIndex) => (
                                  <Draggable key={taskId} draggableId={taskId} index={taskIndex}>
                                      {(provided) => (
                                          <div
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              {...provided.dragHandleProps}
                                          >
                                              <TaskCard id={taskId} provided={provided} boardId={id} />
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
                      onClick={() => setIsAddTaskDialogOpen(true)}
                  >
                      + Add Task
                  </Button>)}
              </CardContent>
          </Card>
          <DialogBox  
            isDialogOpen={isEditBoardDialogOpen} 
            setIsDialogOpen={setIsEditBoardDialogOpen} 
            title={'Edit Board'} 
            schema={boardSchema} 
            defaultValues={{
              name : board?.name,
              description : board?.description,
            }} 
            fields={[
              {
                name: "name",
                label: "Board Name",
                placeholder: "e.g. Testing",
              },
              {
                name: "description",
                label: "Description (Optional)",
                placeholder: "Briefly describe your Board",
                type: "textarea",
              },
            ]} 
            handleSubmit={handleEditBoardDetails} 
            buttonText={'Save Changes'} 
          />
          <DialogBox  
            isDialogOpen={isAddTaskDialogOpen} 
            setIsDialogOpen={setIsAddTaskDialogOpen} 
            title={'Add Task'} 
            schema={taskSchema} 
            defaultValues={{
              title : '',
              description : '',
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
            handleSubmit={handleAddTask} 
            buttonText={'Add Task'} 
          />
      </>
        
    );
}