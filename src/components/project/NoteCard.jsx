import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFetchUserRole } from '@/api/query/useProjectQuery';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import NoteApi from '@/api/note';
import DialogBox from '@/components/forms/DialogBox';
import { noteSchema } from '@/Schema';
import { useFetchNote } from '@/api/query/useNoteQuery';
import { Trash2 } from 'lucide-react';

export default function({noteId}){
    const {projectId} = useParams()
    const {data : role} = useFetchUserRole(projectId) 
    const {data : note} = useFetchNote(projectId, noteId)
    const [isEditNoteDialogOpen, setIsEditNoteDialogOpen] = useState(false)
    const handleEditNote = async ({content})=>{
        // console.log("Adding Note", {content, projectId})
        const result = await NoteApi.updateNote({content, noteId:note._id, projectId})
        if (result?.error) {
          return result
        } else {
          setIsEditNoteDialogOpen(false)
        } 
    }
    // console.log(note)
    return (
      <Card key={note?._id} className='relative'>
        <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
            e.stopPropagation();
            if(confirm("Delete this Note?")) {
                NoteApi.deleteNote({ projectId, noteId });
            }
        }}
        className='absolute top-2 right-2'
        >
        <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
        <CardHeader>
          <p>{note?.content}</p>
        </CardHeader>
        <CardContent>

          {role && role!=='member' && (<Button 
            variant="outline" 
            className="mt-2"
            onClick={()=>setIsEditNoteDialogOpen(true)}
            >
            Edit
          </Button>)}
        </CardContent>
        <DialogBox  
            isDialogOpen={isEditNoteDialogOpen} 
            setIsDialogOpen={setIsEditNoteDialogOpen} 
            title={'Edit Note'} 
            schema={noteSchema} 
            defaultValues={{
              content : note?.content
            }} 
            fields={[
              {
                name: "content",
                label: "Content",
                placeholder: "Note goes here...",
              },
            ]} 
            handleSubmit={handleEditNote} 
            buttonText={'Save Note'} 
          />
      </Card>
    )
  }