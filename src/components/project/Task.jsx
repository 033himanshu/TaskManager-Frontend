import { Draggable } from "@hello-pangea/dnd";



export default function ({task}){
    return (
        <Draggable key={task._id} draggableId={task._id} index={taskIndex}>
            {(provided) => (
            <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
            >
                {/* <TaskCard 
                task={task} 
                onClick={() => {
                    setSelectedTask(task);
                //   setIsSidePanelOpen(true);
                }}
                /> */}
            </div>
            )}
        </Draggable>
    )
}