
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type Permissions = {
    [key: string]: { [key: string]: boolean };
};

interface RoleCardProps {
    role: {
        name: string;
        description: string;
        permissions: Permissions;
    }
}

const formatPermissionName = (name: string) => {
    return name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
}


export function RoleCard({ role }: RoleCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{role.name}</CardTitle>
        <CardDescription>{role.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(role.permissions).map(([section, perms]) => (
            <div key={section}>
                <h4 className="font-medium capitalize mb-2">{section}</h4>
                <div className="grid gap-2 pl-2">
                    {Object.entries(perms).map(([perm, value]) => (
                        <div key={`${section}-${perm}`} className="flex items-center space-x-2">
                            <Checkbox id={`${role.name}-${section}-${perm}`} checked={value} disabled />
                            <Label htmlFor={`${role.name}-${section}-${perm}`} className="text-sm font-normal text-muted-foreground">
                                {formatPermissionName(perm)}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>
        ))}
      </CardContent>
    </Card>
  );
}
