"use client";
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";
import { ShopFlowLogo } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleEmailSignup = async () => {
    // Placeholder signup logic
    if (name && email && password) {
      toast({
        title: "Sign-up Successful",
        description: "Welcome to ShopFlow!",
      });
      router.push("/dashboard");
    } else {
        toast({
            variant: "destructive",
            title: "Sign-up Failed",
            description: "Please fill in all fields.",
        });
    }
  };

  const handleGoogleLogin = async () => {
    // Placeholder for Google signup
    toast({
        title: "Sign-up Successful (Simulated)",
        description: "Welcome to ShopFlow!",
      });
    router.push("/dashboard");
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold font-headline">Create an account</h1>
            <p className="text-balance text-muted-foreground">
              Enter your information to create an account
            </p>
          </div>
           <Card>
            <CardHeader>
                <CardTitle className="text-2xl">Sign Up</CardTitle>
                <CardDescription>
                Join ShopFlow to manage your business with ease.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="full-name">Full Name</Label>
                    <Input id="full-name" placeholder="John Doe" required onChange={(e) => setName(e.target.value)} value={name} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required onChange={(e) => setPassword(e.target.value)} value={password}/>
                </div>
                <Button type="submit" className="w-full" onClick={handleEmailSignup}>
                    Create an account
                </Button>
                <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
                    Sign up with Google
                </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline">
                    Log in
                </Link>
                </div>
            </CardContent>
            </Card>
        </div>
      </div>
       <div className="hidden bg-muted lg:flex items-center justify-center flex-col p-8">
        <ShopFlowLogo className="h-24 w-24 text-primary" />
        <h2 className="mt-6 text-4xl font-bold font-headline text-center">ShopFlow</h2>
        <p className="mt-2 text-lg text-muted-foreground text-center">
          The All-in-One POS and Inventory Solution.
        </p>
      </div>
    </div>
  )
}
