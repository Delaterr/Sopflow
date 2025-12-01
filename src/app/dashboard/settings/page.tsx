

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Loader2, LocateFixed, CreditCard, KeyRound } from "lucide-react";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast";
import { currencies } from "@/lib/currencies";
import { useSettings } from "@/contexts/settings-context";
import type { Shop } from "@/contexts/settings-context";
import { RoleCard } from "@/components/role-card";
import { Separator } from "@/components/ui/separator";

const allPermissions = {
    dashboard: { view: true },
    pos: { view: true, checkout: true },
    inventory: { view: true, add: true, edit: true, delete: true },
    sales: { view: true, export: true },
    team: { view: true, invite: true, edit: true },
    settings: { view: true, edit: true },
};

const roles = [
    {
        name: "Owner (Admin)",
        description: "Has full access to all features and settings.",
        permissions: allPermissions
    },
    {
        name: "Stock Manager",
        description: "Can view and manage inventory, but cannot access sales or settings.",
        permissions: {
            ...allPermissions,
            dashboard: { view: true },
            pos: { view: false, checkout: false },
            sales: { view: false, export: false },
            team: { view: false, invite: false, edit: false },
            settings: { view: false, edit: false },
        }
    },
    {
        name: "POS Seller",
        description: "Can use the Point of Sale system, but has restricted access to other areas.",
        permissions: {
            ...allPermissions,
            dashboard: { view: false },
            pos: { view: true, checkout: true },
            inventory: { view: true, add: false, edit: false, delete: false },
            sales: { view: false, export: false },
            team: { view: false, invite: false, edit: false },
            settings: { view: false, edit: false },
        }
    }
];

// Simple inline SVG for PayPal icon
const PayPalIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#0070BA]">
        <path d="M7.72 10.16a1.08 1.08 0 0 1-.6 1.8l-2.4.45a1.08 1.08 0 0 0-.6 1.8l2.4.45a1.08 1.08 0 0 1 .6 1.8l-.45 2.4a1.08 1.08 0 0 0 1.8.6l2.4-.45a1.08 1.08 0 0 1 1.8.6l.45 2.4a1.08 1.08 0 0 0 1.8-.6l.45-2.4a1.08 1.08 0 0 1 1.8-.6l2.4.45a1.08 1.08 0 0 0 1.8-.6l.45-2.4a1.08 1.08 0 0 1 .6-1.8l2.4-.45a1.08 1.08 0 0 0 .6-1.8l-2.4-.45a1.08 1.08 0 0 1-.6-1.8l.45-2.4a1.08 1.08 0 0 0-1.8-.6l-2.4.45a1.08 1.08 0 0 1-1.8-.6L13 2.16a1.08 1.08 0 0 0-1.8.6l-.45 2.4a1.08 1.08 0 0 1-1.8.6l-2.4-.45a1.08 1.08 0 0 0-1.8.6z" />
        <path d="M11.25 15.25a3.13 3.13 0 1 0 0-6.25 3.13 3.13 0 0 0 0 6.25z" />
        <path d="M14.4 7.63c.24-.7.83-1.25 1.58-1.25h.02c1.33 0 2.4 1.08 2.4 2.41 0 1.33-1.07 2.4-2.4 2.4h-1.6" />
    </svg>
);


export default function SettingsPage() {
    const { toast } = useToast();
    const { settings: shopData, loading: shopLoading } = useSettings();

    const [shopName, setShopName] = useState("");
    const [address, setAddress] = useState("");
    const [currency, setCurrency] = useState("USD");
    const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
    const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null);
    const [isLocating, setIsLocating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // State for payment settings
    const [paypalClientId, setPaypalClientId] = useState("");
    const [mobileMoneyApiKey, setMobileMoneyApiKey] = useState("");

    useEffect(() => {
        if (shopData) {
            setShopName(shopData.name || "My Shop");
            setAddress(shopData.address || "123 Main Street");
            setCurrency(shopData.currency || "USD");
            setHeroImagePreview(shopData.heroImageUrl || null);
        }
    }, [shopData]);

    const handleLocateMe = () => {
        if (!navigator.geolocation) {
            toast({
                variant: "destructive",
                title: "Geolocation Not Supported",
                description: "Your browser does not support geolocation.",
            });
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await response.json();
                    if (data && data.display_name) {
                        setAddress(data.display_name);
                        toast({
                            title: "Location Found",
                            description: "Address has been updated with your current location.",
                        });
                    } else {
                        throw new Error("Could not find address.");
                    }
                } catch (error) {
                    toast({
                        variant: "destructive",
                        title: "Could Not Fetch Address",
                        description: "Unable to retrieve address from your location. Please enter it manually.",
                    });
                } finally {
                    setIsLocating(false);
                }
            },
            (error) => {
                let description = "An unknown error occurred.";
                if (error.code === error.PERMISSION_DENIED) {
                    description = "Please allow location access to use this feature.";
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    description = "Location information is unavailable.";
                }
                toast({
                    variant: "destructive",
                    title: "Geolocation Error",
                    description,
                });
                setIsLocating(false);
            }
        );
    };

    const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setHeroImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setHeroImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        // Placeholder for saving changes. In a real app, this would be an API call.
        console.log("Saving changes:", { shopName, address, currency, heroImageFile, paypalClientId, mobileMoneyApiKey });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        toast({
            title: "Changes Saved (Simulated)",
            description: "Your shop settings have been updated.",
        });
        setIsSaving(false);
    };

  return (
    <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Shop Profile</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
            <Card>
            <CardHeader>
                <CardTitle>Shop Profile</CardTitle>
                <CardDescription>
                Update your shop's name, address, and default currency.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {shopLoading ? <p>Loading shop details...</p> : (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="name">Shop Name</Label>
                            <Input 
                                id="name" 
                                value={shopName}
                                onChange={(e) => setShopName(e.target.value)} 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <div className="flex gap-2">
                                <Input 
                                    id="address" 
                                    value={address} 
                                    onChange={(e) => setAddress(e.target.value)} 
                                />
                                <Button variant="outline" size="icon" onClick={handleLocateMe} disabled={isLocating}>
                                    {isLocating ? <Loader2 className="animate-spin" /> : <LocateFixed />}
                                    <span className="sr-only">Use My Location</span>
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="currency">Default Currency</Label>
                            <Select value={currency} onValueChange={setCurrency}>
                                <SelectTrigger id="currency">
                                    <SelectValue placeholder="Select a currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    {currencies.map(c => (
                                        <SelectItem key={c.value} value={c.value}>
                                            {c.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label>Shop Banner</Label>
                             {heroImagePreview && (
                                <Image 
                                    src={heroImagePreview} 
                                    alt="Shop banner preview" 
                                    width={400} 
                                    height={150} 
                                    className="w-full h-auto object-cover rounded-md border"
                                />
                            )}
                            <Input 
                                type="file" 
                                onChange={handleHeroImageChange}
                                accept="image/*"
                            />
                            <p className="text-sm text-muted-foreground">
                                Recommended size: 1200x400 pixels.
                            </p>
                        </div>
                    </>
                )}
            </CardContent>
            <CardFooter>
                <Button onClick={handleSaveChanges} disabled={shopLoading || isSaving}>
                    {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
                </Button>
            </CardFooter>
            </Card>
        </TabsContent>
        <TabsContent value="payments">
             <Card>
                <CardHeader>
                    <CardTitle>Payment Integrations</CardTitle>
                    <CardDescription>
                        Connect your shop to payment providers to start accepting payments.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    {/* PayPal Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <PayPalIcon />
                            <h3 className="text-lg font-semibold">PayPal</h3>
                        </div>
                        <div className="space-y-2 pl-10">
                            <Label htmlFor="paypal-client-id">PayPal Client ID</Label>
                            <div className="flex gap-2">
                                <KeyRound className="h-5 w-5 text-muted-foreground mt-2.5" />
                                <Input 
                                    id="paypal-client-id" 
                                    placeholder="Enter your PayPal Client ID"
                                    value={paypalClientId}
                                    onChange={(e) => setPaypalClientId(e.target.value)} 
                                />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Find this in your PayPal Developer dashboard.
                            </p>
                        </div>
                    </div>

                    <Separator />

                    {/* Mobile Money Section */}
                     <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <CreditCard />
                            <h3 className="text-lg font-semibold">Mobile Money</h3>
                        </div>
                        <div className="space-y-2 pl-10">
                            <Label htmlFor="mobile-money-api-key">Mobile Money API Key</Label>
                             <div className="flex gap-2">
                                <KeyRound className="h-5 w-5 text-muted-foreground mt-2.5" />
                                <Input 
                                    id="mobile-money-api-key" 
                                    placeholder="Enter your Mobile Money API Key"
                                    value={mobileMoneyApiKey}
                                    onChange={(e) => setMobileMoneyApiKey(e.target.value)}
                                />
                            </div>
                             <p className="text-sm text-muted-foreground">
                                Provided by your Mobile Money service provider.
                            </p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSaveChanges} disabled={isSaving}>
                         {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Payment Settings"}
                    </Button>
                </CardFooter>
            </Card>
        </TabsContent>
        <TabsContent value="roles">
            <Card>
                <CardHeader>
                    <CardTitle>Roles &amp; Permissions</CardTitle>
                    <CardDescription>
                        Define what each role can access and do in your store. For now, these are not editable.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {roles.map(role => (
                           <RoleCard key={role.name} role={role} />
                       ))}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button disabled>Save Changes</Button>
                </CardFooter>
            </Card>
        </TabsContent>
    </Tabs>
  )
}
