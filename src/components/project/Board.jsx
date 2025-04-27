import { Draggable, Droppable } from "@hello-pangea/dnd";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useFetchBoardDetails } from "@/api/query/useBoardQuery";
import { useParams } from "react-router-dom";
import { useState } from "react";
// import TaskCard from "./TaskCard";

export default function Board({ id, index }) {
    const [selectedBoard, setSelectedBoard] = useState(null);
    const { projectId } = useParams();
    const { data: board } = useFetchBoardDetails(id, projectId);

    if (!board) return null;

    return (
        <Draggable draggableId={id} index={index}>
            {(provided) => (
                <div 
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="w-72 flex-shrink-0"
                >
                    <Card className="h-full">
                        <CardHeader 
                            {...provided.dragHandleProps}
                            className="cursor-move bg-gray-50"
                            onClick={() => setSelectedBoard(board)}
                        >
                            <CardTitle>{board.name}</CardTitle>
                            <CardDescription>{board.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Droppable droppableId={board._id} type="TASK">
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className="space-y-2 min-h-[100px]"
                                    >
                                        {board.tasks?.map((task, taskIndex) => (
                                            <Draggable key={task._id} draggableId={task._id} index={taskIndex}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <TaskCard task={task} />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                            <Button 
                                variant="ghost" 
                                className="w-full mt-2"
                                onClick={() => setSelectedBoard(board)}
                            >
                                + Add Task
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
            
        </Draggable>
        
    );
}