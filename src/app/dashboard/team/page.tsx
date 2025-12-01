import { PlusCircle } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { teamMembers } from "@/lib/placeholder-data"
import { Badge } from "@/components/ui/badge"

export default function TeamPage() {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('')
  }
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Team Management</CardTitle>
            <CardDescription>
                Invite and manage your team members and their roles.
            </CardDescription>
        </div>
        <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Invite Member
            </span>
          </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
            {teamMembers.map((member) => (
                <div key={member.email} className="flex items-center justify-between space-x-4">
                    <div className="flex items-center space-x-4">
                        <Image
                            alt={`${member.name}'s avatar`}
                            src={member.avatar}
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                        <div>
                            <p className="text-sm font-medium leading-none">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                    </div>
                    <Badge variant={member.role === 'Owner (Admin)' ? 'default' : 'secondary'}>{member.role}</Badge>
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}
