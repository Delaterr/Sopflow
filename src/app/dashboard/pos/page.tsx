
"use client";

import Image from "next/image"
import * as React from "react"
import { PlusCircle, MinusCircle, X, Search, QrCode } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator";
import { useSettings } from "@/contexts/settings-context";
import type { Product } from "@/app/dashboard/inventory/columns";
import { QrScanner } from "@/components/qr-scanner";
import { useToast } from "@/hooks/use-toast";
import { products as placeholderProducts } from "@/lib/placeholder-data";

type CartItem = Product & { cartQuantity: number };

export default function PosPage() {
  const { settings } = useSettings();
  const { toast } = useToast();

  const [productsData, setProductsData] = React.useState(placeholderProducts);
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [scannerOpen, setScannerOpen] = React.useState(false);

  const categories = ["All", ...Array.from(new Set(productsData.map((p) => p.category)))];
  const filteredProducts = productsData.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, cartQuantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((prevCart) => {
      if (newQuantity <= 0) {
        return prevCart.filter((item) => item.id !== productId);
      }
      return prevCart.map((item) =>
        item.id === productId ? { ...item, cartQuantity: newQuantity } : item
      );
    });
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: settings?.currency || "USD",
    }).format(amount);
  };

  const findProductByCode = async (scannedCode: string) => {
    // First, try to find by the 'code' field (for external barcodes)
    let product = productsData.find(p => p.code === scannedCode);
    if (product) return product;

    // If not found, try to find by product ID (for internal QR codes)
    product = productsData.find(p => p.id === scannedCode);
    return product || null;
  }

  const handleScan = async (scannedCode: string) => {
    setScannerOpen(false);
    const product = await findProductByCode(scannedCode);
    
    if (product) {
        addToCart(product);
        toast({
            title: "Product Added",
            description: `${product.name} has been added to the cart.`,
        });
    } else {
        toast({
            variant: "destructive",
            title: "Product Not Found",
            description: "The scanned QR code or barcode does not match any product.",
        });
    }
  };
  
  const subtotal = cart.reduce((acc, item) => acc + item.salesPrice * item.cartQuantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2">
        <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search products..."
                    className="w-full rounded-lg bg-background pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Dialog open={scannerOpen} onOpenChange={setScannerOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                        <QrCode className="h-5 w-5" />
                        <span className="sr-only">Scan QR Code</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Scan Product QR Code</DialogTitle>
                        <DialogDescription>
                            Center the product's QR code or barcode within the frame to add it to the cart.
                        </DialogDescription>
                    </DialogHeader>
                    {scannerOpen && <QrScanner onScan={handleScan} onClose={() => setScannerOpen(false)} />}
                </DialogContent>
            </Dialog>
        </div>
        <Tabs defaultValue="All">
        <TabsList>
            {categories.map((category) => (
            <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
            ))}
        </TabsList>
        {categories.map((category) => (
            <TabsContent key={category} value={category}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {(searchTerm ? filteredProducts : productsData)
                    .filter(p => category === 'All' || p.category === category)
                    .map((product) => (
                <Card key={product.id} className="overflow-hidden">
                    <CardContent className="p-0">
                    <Image
                        alt={product.name}
                        className="aspect-square w-full object-cover"
                        height={300}
                        src={product.imageUrl}
                        width={300}
                        data-ai-hint={product.imageHint}
                    />
                    </CardContent>
                    <CardFooter className="flex-col items-start p-4">
                    <h3 className="font-semibold text-sm">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{formatCurrency(product.salesPrice)}</p>
                    <Button className="w-full mt-2" size="sm" onClick={() => addToCart(product)}>Add to Cart</Button>
                    </CardFooter>
                </Card>
                ))}
            </div>
            </TabsContent>
        ))}
        </Tabs>
      </div>
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Cart</CardTitle>
            <CardDescription>Review items and complete the sale.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            {cart.length === 0 ? (
                <p className="text-muted-foreground text-center">Your cart is empty.</p>
            ) : (
                cart.map(item => (
                    <div key={item.id} className="flex items-center gap-4">
                        <Image alt={item.name} className="rounded-md" height={64} src={item.imageUrl} style={{aspectRatio: "64/64", objectFit: "cover"}} width={64} />
                        <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{formatCurrency(item.salesPrice)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button size="icon" variant="outline" onClick={() => updateQuantity(item.id, item.cartQuantity - 1)}><MinusCircle className="h-4 w-4" /></Button>
                            <span>{item.cartQuantity}</span>
                            <Button size="icon" variant="outline" onClick={() => updateQuantity(item.id, item.cartQuantity + 1)}><PlusCircle className="h-4 w-4" /></Button>
                        </div>
                        <Button size="icon" variant="ghost" className="text-muted-foreground" onClick={() => updateQuantity(item.id, 0)}><X className="h-4 w-4" /></Button>
                    </div>
                ))
            )}
            <Separator />
            <div className="grid gap-2">
                <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span>Tax (8%)</span>
                    <span>{formatCurrency(tax)}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" size="lg" disabled={cart.length === 0}>
                Proceed to Payment
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
