import { useState } from "react"
import { useParams } from "react-router-dom"

export default function({subTaskId, taskId, boardId, editable=false}){
    const {projectId} = useParams()
    const {data : subTask} = useFetchSubTaskDetails(subTaskId, taskId, boardId, projectId)
    const [subtask, setSubTask] = useState(subTask?.title ?? '')
    const [checked, setChecked] = useState(subTask?.isCompleted ?? false)
    return (
        <div className='flex' onClick={()=>setChecked(!checked)}>
            <input type="radio" checked={checked} onInput={(e)=>setSubTask(e.target.value)}/>
            {editable ? 
                <input type='text' value={subtask}/> : 
                <span>{value}</span>}
        </div>
    )
}