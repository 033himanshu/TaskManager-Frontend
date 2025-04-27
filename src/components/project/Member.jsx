import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useParams } from "react-router-dom";
import { useFetchMember, useFetchUserRole } from "@/api/query/useProjectQuery";

export default function ({memberId}){
    const  {projectId} = useParams()
    const {data : member} = useFetchMember(projectId, memberId)
    const {data: role} = useFetchUserRole(projectId)
    console.log(member)
    console.log(memberId)
    return (
        <Card className='w-fit'>
            <CardHeader className="flex flex-row items-center space-x-4 h-40 mb-2 ">
                <Avatar>
                    <AvatarImage src={member?.avatar} className="h-40" />
                    <AvatarFallback>{member?.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle>{member?.username}</CardTitle>
                    <CardDescription>{member?.email}</CardDescription>
                    <CardDescription>Role: {member?.role}</CardDescription>
                </div>
            </CardHeader>
            {role && role=='admin' &&(<CardContent>
                <Button 
                    variant="outline" 
                    // onClick={() => navigate(`/members/${member._id}/edit`)}
                >
                    Edit Role
                </Button>
            </CardContent>)}
        </Card>
    )
}