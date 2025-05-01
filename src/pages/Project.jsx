import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Outlet } from 'react-router-dom';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { useFetchAllMember, useFetchProject, useFetchUserRole } from '@/api/query/useProjectQuery';
import { useFetchUserRoles } from '@/api/query/useUserQuery';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import Board from '@/components/project/Board';
import BoardApi from '@/api/board';
import ProjectApi from '@/api/project';
import UserApi from '@/api/user';
import TaskApi from '@/api/task';
import DialogBox from '@/components/forms/DialogBox';
import { Dialog } from "@radix-ui/react-dialog"
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash } from "lucide-react";
import { boardSchema, projectSchema } from '@/Schema';
import Member from '@/components/project/Member';
import { Pencil, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

const debounce = (cb, time) => {
    let timeoutId = null
    clearTimeout(timeoutId)
    timeoutId = setTimeout(cb, time)
}

export default function Project() {
  const [isAddBoardDialogOpen, setIsAddBoardDialogOpen] = useState(false)
  const [isEditProjectDialogOpen, setIsEditProjectDialogOpen] = useState(false)
  const [isInviteMemberDialogOpen, setIsInviteMemberDialogOpen] = useState(false)
  const [inviteMemberInput, setInviteMemberInput] = useState('')
  const { projectId } = useParams();
  const {data : role} = useFetchUserRole(projectId)
  const navigate = useNavigate();
  const { data: project, isLoading, error } = useFetchProject(projectId);
  const {data : projectMembers} = useFetchAllMember(projectId)
  console.log(projectMembers)
  const [localBoards, setLocalBoards] = useState(project?.boards ?? [])
  const [activeTab, setActiveTab] = useState('tasks');
  const [searchMembers, setSearchMembers]  = useState([])
  const [page, setPage]  = useState(1)
  const limit = 10
  let maxPage =1
  const {data:userRoles} =  useFetchUserRoles()
  console.log(userRoles)
  const [selectedRoles, setSelectedRoles] = useState({});
  const [inviteSuccess, setInviteSuccess] = useState('')
  const [inviteError, setInviteError] = useState('')
 
  useEffect(()=>{
    if(project?.boards)
        setLocalBoards(project.boards)
  },[project?.boards])
const getSearchMembers = async ()=>{
    const result = await ProjectApi.getUserWithPrefix({projectId, query: inviteMemberInput, page, limit}) 
    console.log(result)
    maxPage = Math.ceil(result.totalCount / limit)
    if(page>maxPage)
        setPage(maxPage)
    setSearchMembers(result)
}
const fetchMembers = () => debounce(()=>getSearchMembers(), 3000)

const handleDragEnd = async (result) => {
    if (!result.destination) return;
    console.log('trying drag and drop')
    const { source, destination, draggableId, type } = result;
    if(!role || role === 'member'){ 
      alert("Not allowed to Perform this operation")
      return;
    }

    // Optimistic update
    if (type === 'BOARD') {
      const newBoards = [...localBoards];
      const [removed] = newBoards.splice(source.index, 1);
      newBoards.splice(destination.index, 0, removed);
      setLocalBoards(newBoards);
    }

    try {
      if (type === 'BOARD') {
        const result = await BoardApi.updateBoardPosition({
          projectId,
          boardId: draggableId,
          newIndex: destination.index
        });
        console.log(result)
        if(result?.error)
            throw result.error
      } else if (type === 'TASK') {
        const result = await TaskApi.updateBoardAndPosition({
          taskId: draggableId,
          boardId: source.droppableId,
          newBoardId: destination.droppableId,
          newIndex: destination.index,
          projectId,
        });
        if(result?.error)
          throw result.error
      }
    } catch (err) {
      // Revert on error
      if (type === 'BOARD') {
        setLocalBoards(project.boards);
      }
      alert(err)
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

const handleSendInvite = async (memberId) => {
  const role = selectedRoles[memberId] || userRoles[0]; // fallback to default
  try {
    console.log({ userId: memberId, role, projectId })
    const result = await ProjectApi.addMemerToProject({ userId: memberId, role, projectId });
    if (!result?.error) {
        setInviteSuccess("Invite sent!");
        setInviteError('')
        return true
      }else
      setInviteError(result.error)
      setInviteSuccess('');
      return false
  } catch (err) {
    console.error(err);
    // toast.error("Failed to send invite.");
  }
};


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
          {role && role=='admin' && (<Button onClick={() => setIsInviteMemberDialogOpen(true)}>+ Invite Member</Button>)}
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
        {/* Invite form */}
        <Dialog open={isInviteMemberDialogOpen} onOpenChange={setIsInviteMemberDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <p className='text-red-500'>{inviteError}</p>
            <p className='text-green-500'>{inviteSuccess}</p>
            <DialogHeader>
              <DialogTitle>Invite Members</DialogTitle>
            </DialogHeader>
            <Input id='invite' type="text" placeholder="search user" value={inviteMemberInput} 
            onInput={async (e)=>{
              setInviteMemberInput(e.target.value)
              setPage(1)
              fetchMembers()
            }} />
            <div className='overflow-scroll max-h-80 overflow-x-hidden'>
            {searchMembers?.users?.map(member => {
              {console.log(member)}
              return (<Card key={member._id} className="w-full">
                          <CardHeader className="flex flex-row items-center space-x-4 p-4 flex-wrap justify-center">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={member?.avatar} />
                              <AvatarFallback>{member?.username.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <CardTitle>{member?.fullName}</CardTitle>
                              <CardTitle>{member?.username}</CardTitle>
                              <CardDescription>{member?.email}</CardDescription>
                            </div>
                            <select
                                value={selectedRoles[member._id] || userRoles[0]} // default to first role
                                onChange={(e) => {
                                  setSelectedRoles((prev) => ({
                                    ...prev,
                                    [member._id]: e.target.value,
                                  }));
                                }}
                              >
                                {userRoles?.map((role, index) => (
                                  <option key={index}>{role}</option>
                                ))}
                              </select>
                            <Button onClick={()=>{
                              handleSendInvite(member._id)
                            }}>Send</Button>
                          </CardHeader>
                        </Card>)
            })}
            </div>
            <div className='flex justify-center'>
                <Button disabled={page===1} onClick={()=>{setPage(page-1); fetchMembers()}} className='bg-transparent text-black'>prev</Button>
                <span className='mx-4 mt-2'>{page}</span>
                <Button disabled={page===maxPage} onClick={()=>{setPage(page+1);fetchMembers()}} className='bg-transparent text-black'>Next</Button>
            </div>
          </DialogContent>
        </Dialog>
    </div>
  );
}
