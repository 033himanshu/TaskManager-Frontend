import { useState } from "react"
import { useParams } from "react-router-dom"
import { Checkbox } from "@/components/ui/checkbox";
import { GripVertical, Pencil, Trash2 } from "lucide-react";


export default function({subTaskId, taskId, boardId, editable=false}){
    const {projectId} = useParams()
    const {data : subTask} = useFetchSubTaskDetails(subTaskId, taskId, boardId, projectId)
    const [subtask, setSubTask] = useState(subTask?.title ?? '')
    const [checked, setChecked] = useState(subTask?.isCompleted ?? false)
    return (
        <div className="flex items-center gap-3 p-2 border rounded-lg hover:bg-gray-50">
          <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
          
          <Checkbox 
            checked={checked} 
            onCheckedChange={() => setChecked(!checked)}
            className="mr-2"
          />
          
          {editable ? (
            <Input 
              value={subtask}
              onChange={(e) => setSubTask(e.target.value)}
              className="flex-1"
            />
          ) : (
            <span className={`flex-1 ${checked ? 'line-through text-gray-500' : ''}`}>
              {subTask?.title}
            </span>
          )}
          
          {editable && (
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          )}
        </div>
    );
}
    