import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Outlet } from 'react-router-dom';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { useFetchAllMember, useFetchProject, useFetchUserRole } from '@/api/query/useProjectQuery';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import Board from '@/components/project/Board';
import BoardApi from '@/api/board';
import ProjectApi from '@/api/project';
import TaskApi from '@/api/task';
import DialogBox from '@/components/forms/DialogBox';
import { boardSchema, projectSchema } from '@/Schema';
import Member from '@/components/project/Member';
import { Pencil, Trash2 } from 'lucide-react';

export default function Project() {
  const [isAddBoardDialogOpen, setIsAddBoardDialogOpen] = useState(false)
  const [isEditProjectDialogOpen, setIsEditProjectDialogOpen] = useState(false)
  const { projectId } = useParams();
  const {data : role} = useFetchUserRole(projectId)
  const navigate = useNavigate();
  const { data: project, isLoading, error } = useFetchProject(projectId);
  const {data : projectMembers} = useFetchAllMember(projectId)
  console.log(projectMembers)
  const [localBoards, setLocalBoards] = useState(project?.boards ?? [])
  const [activeTab, setActiveTab] = useState('tasks');

  const contentRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.offsetHeight;
      setHeaderHeight(height);
    }
  }, [activeTab]);
  // Calculate available height for boards
  const availableHeight = `calc(100vh - ${headerHeight}px - 2rem)`; // 2rem for padding

  useEffect(()=>{
    if(project?.boards)
        setLocalBoards(project.boards)
  },[project?.boards])

const handleDragEnd = async (result) => {
    if (!result.destination) return;
    
    const { source, destination, draggableId, type } = result;
    if(!role || role === 'member') return;

    // Optimistic update
    if (type === 'BOARD') {
      const newBoards = [...localBoards];
      const [removed] = newBoards.splice(source.index, 1);
      newBoards.splice(destination.index, 0, removed);
      setLocalBoards(newBoards);
    }

    try {
      if (type === 'BOARD') {
        await BoardApi.updateBoardPosition({
          projectId,
          boardId: draggableId,
          newIndex: destination.index
        });
      } else if (type === 'TASK') {
        await TaskApi.updateBoardAndPosition({
          taskId: draggableId,
          boardId: source.droppableId,
          newBoardId: destination.droppableId,
          newIndex: destination.index,
          projectId,
        });
      }
    } catch (err) {
      // Revert on error
      if (type === 'BOARD') {
        setLocalBoards(project.boards);
      }
      console.error('Failed to update position:', err);
    }
};
  const handleEditProjectDetails = async (data) => {
    console.log("Edit Project", data)
    const result = await ProjectApi.updateProjectDetails({...data, projectId})
    if (result?.error) {
      return result.error
    } else {
      setIsEditProjectDialogOpen(false)
    } 
}
  const handleAddBoard = async (data) => {
    console.log("Adding Board", data)
    const result = await BoardApi.addBoard({...data, projectId})
    if (result?.error) {
      return result
    } else {
      setIsAddBoardDialogOpen(false)
    } 
}
  const handleProjectDelete = async () => {
    if(confirm("Are You Sure to Delete Project")){
      console.log("Deleting Project", projectId)
      const result = await ProjectApi.deleteProject({projectId})
      if(!result?.error){
          navigate('/')
      }else{
        alert(result.error)
      }
    }
}


  if (isLoading) return <div>Loading project...</div>;
  if (error) return <div>Error loading project: {error.message}</div>;
  console.log(role)
  return (
    
    <div className="space-y-6">
      <div className='relative'>   
        <div className='text-center text-2xl font-semibold'>{project?.name}</div>
        <div className='text-center text-xl font-normal'>{project?.description}</div>
        {role && role==='admin' && (
        <div className='absolute top-2 right-2'>
              <Button className='text-xs '
                onClick={() => setIsEditProjectDialogOpen(true)} 
                >
                <Pencil className="h-4 w-4" /> Project
              </Button>
              <Button className='text-xs bg-red-500'
                onClick={handleProjectDelete} 
                >
                 <Trash2 className="h-4 w-4" /> Delete Project
              </Button>
          </div>
        )}
      </div>


      {/* Navigation Tabs */}
      <div className="flex space-x-2">
        <Button 
          variant={activeTab === 'tasks' ? 'default' : 'outline'}
          onClick={() => setActiveTab('tasks')}
        >
          Tasks
        </Button>
        <Button 
          variant={activeTab === 'notes' ? 'default' : 'outline'}
          onClick={() => setActiveTab('notes')}
        >
          Notes
        </Button>
        <Button 
          variant={activeTab === 'members' ? 'default' : 'outline'}
          onClick={() => setActiveTab('members')}
        >
          Members
        </Button>
      </div>

      {/* Content Area */}
      {activeTab === 'tasks' && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="overflow-x-auto">
            <Droppable droppableId={projectId} direction="horizontal" type="BOARD">
              {(provided) => (
                <div 
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex space-x-4 min-h-[500px]"
                >
                  {localBoards?.map((boardId, index) => (
                    <Draggable key={boardId} draggableId={boardId} index={index}>
                      {(provided) => (
                          <div 
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="w-72 flex-shrink-0"
                          >
                          <Board id={boardId} provided={provided}/>
                      </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {role && role!=='member' && (<Button 
                    variant="outline" 
                    className="w-72 h-[500px] flex items-center justify-center"
                    onClick={()=>setIsAddBoardDialogOpen(true)}
                  >
                    + Add Board
                  </Button>)}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
      )}

      {activeTab === 'notes' && (
        <div className="space-y-4">
          {role && role!=='member' && (<Button onClick={() => navigate('notes/new')}>+ Add Note</Button>)}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {project?.notes?.map(note => (
              <Card key={note._id}>
                <CardHeader>
                  <CardTitle>Note</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{note.content}</p>
                  {role && role!=='member' && (<Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => navigate(`notes/${note._id}/edit`)}
                  >
                    Edit
                  </Button>)}
                </CardContent>
              </Card>
            ))}
          </div>
          <Outlet context={{ notes: project.notes }} />
        </div>
      )}

      {activeTab === 'members' && (
        <div className="space-y-4">
          {role && role=='admin' && (<Button onClick={() => navigate('/members/invite')}>+ Invite Member</Button>)}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projectMembers?.members?.map(member => (
              <Member key={member._id} memberId={member._id}/>
            ))}
          </div>
          {/* <Outlet context={{ members: project.members }} /> */}
        </div>
      )}


        <DialogBox  
          isDialogOpen={isAddBoardDialogOpen} 
          setIsDialogOpen={setIsAddBoardDialogOpen} 
          title={'Create New Board'} 
          schema={boardSchema} 
          defaultValues={{
            name : "",
            description : "",
          }} 
          fields={[
            {
              name: "name",
              label: "Board Name",
              placeholder: "e.g. testing",
            },
            {
              name: "description",
              label: "Description (Optional)",
              placeholder: "Briefly describe your Board",
              type: "textarea",
            },
          ]} 
          handleSubmit={handleAddBoard} 
          buttonText={'Add Board'} 
        />
        <DialogBox  
          isDialogOpen={isEditProjectDialogOpen} 
          setIsDialogOpen={setIsEditProjectDialogOpen} 
          title={'Edit Project'} 
          schema={projectSchema} 
          defaultValues={{
            name : project?.name,
            description : project?.description,
          }} 
          fields={[
            {
              name: "name",
              label: "Project Name",
              placeholder: "e.g. Marketing",
            },
            {
              name: "description",
              label: "Description (Optional)",
              placeholder: "Briefly describe your Project",
              type: "textarea",
            },
          ]} 
          handleSubmit={handleEditProjectDetails} 
          buttonText={'Save Changes'} 
        />
    </div>
  );
}
