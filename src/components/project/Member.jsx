// import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useParams } from "react-router-dom";
import { useFetchMember, useFetchUserRole } from "@/api/query/useProjectQuery";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash } from "lucide-react";

export default function ({memberId}){
    const  {projectId} = useParams()
    const {data : member} = useFetchMember(projectId, memberId)
    const {data: role} = useFetchUserRole(projectId)
    console.log(member)
    console.log(memberId)
    return (
        <Card className="w-full max-w-sm">
          <CardHeader className="flex flex-row items-center space-x-4 p-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={member?.avatar} />
              <AvatarFallback>{member?.username.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle>{member?.username}</CardTitle>
              <CardDescription>{member?.email}</CardDescription>
              <CardDescription>Role: {member?.role}</CardDescription>
            </div>
            
            {role === 'admin' && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => {/* Edit role */}}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Role
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-500"
                    onClick={() => {
                      if(confirm("Remove this member?")) {
                        // Call API to remove member
                      }
                    }}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </CardHeader>
        </Card>
      );
    }