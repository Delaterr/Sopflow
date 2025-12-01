"use client";

import { useState } from "react";
import { user as placeholderUser } from "@/lib/placeholder-data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { toast } = useToast();
  const [user, setUser] = useState(placeholderUser);
  const [name, setName] = useState(user.name);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(user.avatar);
  const [isSaving, setIsSaving] = useState(false);

  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    // In a real app, you would upload the imageFile if it exists
    // and then update the user's profile information in your database.
    console.log("Saving changes:", { name, imageFile });

    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Update local state for demonstration
    setUser(prev => ({...prev, name: name, avatar: imagePreview || prev.avatar}));

    toast({
      title: "Profile Updated (Simulated)",
      description: "Your profile has been successfully updated.",
    });
    setIsSaving(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
        <CardDescription>
          Manage your personal information and profile settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
                <AvatarImage src={imagePreview || ''} alt={`@${name}`} />
                <AvatarFallback className="text-2xl">{getInitials(name)}</AvatarFallback>
            </Avatar>
            <div className="grid gap-1.5">
                <Label htmlFor="picture">Profile Picture</Label>
                <Input id="picture" type="file" onChange={handleImageChange} accept="image/*" />
                <p className="text-sm text-muted-foreground">Upload a new photo for your profile.</p>
            </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" value={user.email} disabled />
           <p className="text-sm text-muted-foreground">
              Your email address cannot be changed.
            </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveChanges} disabled={isSaving}>
          {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
}
