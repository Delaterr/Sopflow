

"use client";

import Image from "next/image"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { QrCode, Search, LayoutGrid, ShoppingCart, LogOut } from 'lucide-react'

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
    CardDescription
  } from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import type { Product } from "@/app/dashboard/inventory/columns";
import type { Shop } from "@/contexts/settings-context"
import { products as placeholderProducts } from "@/lib/placeholder-data";
import { CartSheet } from "@/components/cart-sheet";
import { useToast } from "@/hooks/use-toast";
import { ProductDetailDialog } from "@/components/product-detail-dialog";
import { useAuth, useUser } from "@/firebase"
import { signOut } from "firebase/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Category = {
    id: string;
    name: string;
    imageUrl: string;
}

type CartItem = Product & { cartQuantity: number };

export default function PublicMenuPage() {
    const params = useParams();
    const { toast } = useToast();
    const shopId = params.shopId as string;
    const auth = useAuth();
    const { user, isUserLoading } = useUser();
    
    const [shop, setShop] = useState<Shop | null>({
        id: 'shop_1',
        name: 'ShopFlow Cafe',
        address: '123 Demo Street',
        currency: 'USD',
        owner: 'user_1',
        heroImageUrl: "https://images.unsplash.com/photo-1494346480775-936a9f0d0877?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxjYWZlJTIwaW50ZXJpb3J8ZW58MHx8fHwxNzYzMjc5NjIyfDA&ixlib=rb-4.1.0&q=80&w=1080"
    });
    const [products, setProducts] = useState<Product[]>(placeholderProducts);
    const initialCategories = Array.from(new Set(placeholderProducts.map(p => p.category))).map((c, i) => ({id: `cat_${i}`, name: c, imageUrl: `https://picsum.photos/seed/${c}/100/100`}));
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const defaultHeroImage = "https://images.unsplash.com/photo-1494346480775-936a9f0d0877?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxjYWZlJTIwaW50ZXJpb3J8ZW58MHx8fHwxNzYzMjc5NjIyfDA&ixlib=rb-4.1.0&q=80&w=1080";

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${typeof window !== 'undefined' ? window.location.href : ''}`;

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const filteredProducts = products.filter((product) => {
        const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const formatCurrency = (amount: number) => {
        if (!shop?.currency) return `$${amount.toFixed(2)}`;
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: shop.currency,
        }).format(amount);
    };

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
        toast({
            title: "Added to Cart",
            description: `${product.name} has been added to your cart.`,
        });
    };
    
    const updateCartQuantity = (productId: string, newQuantity: number) => {
        setCart((prevCart) => {
          if (newQuantity <= 0) {
            return prevCart.filter((item) => item.id !== productId);
          }
          return prevCart.map((item) =>
            item.id === productId ? { ...item, cartQuantity: newQuantity } : item
          );
        });
    };

    const handleSignOut = async () => {
        await signOut(auth);
        toast({
            title: "Signed Out",
            description: "You have been successfully signed out.",
        });
    }

    const cartItemCount = cart.reduce((total, item) => total + item.cartQuantity, 0);

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center">
                <h1 className="text-4xl font-bold mb-4">Error</h1>
                <p className="text-muted-foreground">{error}</p>
            </div>
        )
    }
    
    if (!shop && !loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center">
                <h1 className="text-4xl font-bold mb-4">Shop Not Found</h1>
                <p className="text-muted-foreground">The shop at this URL could not be found. Please check the address and try again.</p>
            </div>
        )
    }

    return (
        <div className="bg-background">
             <CartSheet 
                open={isCartOpen}
                onOpenChange={setIsCartOpen}
                cartItems={cart}
                onUpdateQuantity={updateCartQuantity}
                currency={shop?.currency || 'USD'}
            />

            <ProductDetailDialog 
                product={selectedProduct}
                open={!!selectedProduct}
                onOpenChange={(isOpen) => {
                    if (!isOpen) {
                        setSelectedProduct(null);
                    }
                }}
                onAddToCart={(product) => {
                    addToCart(product);
                    setSelectedProduct(null);
                }}
                currency={shop?.currency || 'USD'}
            />

             {/* Floating Cart Button */}
             <Button 
                className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-50" 
                size="icon"
                onClick={() => setIsCartOpen(true)}
            >
                <ShoppingCart className="h-8 w-8" />
                {cartItemCount > 0 && (
                    <span className="absolute top-0 right-0 block h-6 w-6 transform translate-x-1/4 -translate-y-1/4 rounded-full bg-destructive text-destructive-foreground text-xs font-bold ring-2 ring-background">
                        {cartItemCount}
                    </span>
                )}
                <span className="sr-only">Open Cart</span>
            </Button>


            <header className="relative">
                <Image 
                    src={shop?.heroImageUrl || defaultHeroImage}
                    alt="Store hero image" 
                    width={1200} 
                    height={400} 
                    className="w-full h-48 lg:h-64 object-cover" 
                    data-ai-hint="cafe interior"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <h1 className="text-4xl lg:text-6xl font-bold text-white font-headline capitalize">{shop?.name}</h1>
                </div>
            </header>
            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <aside className="md:col-span-1">
                        <div className="sticky top-8">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><LayoutGrid className="h-5 w-5"/> Categories</h3>
                            {loading ? <p>Loading categories...</p> : (
                                <ul className="space-y-2">
                                    <li>
                                        <Button 
                                            variant={selectedCategory === null ? "secondary" : "ghost"}
                                            className="w-full justify-start h-auto"
                                            onClick={() => setSelectedCategory(null)}
                                        >
                                            All Categories
                                        </Button>
                                    </li>
                                    {categories.map((category) => (
                                        <li key={category.id}>
                                            <Button 
                                                variant={selectedCategory === category.name ? "secondary" : "ghost"}
                                                className="w-full justify-start h-auto"
                                                onClick={() => setSelectedCategory(category.name)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Image src={category.imageUrl} alt={category.name} width={40} height={40} className="rounded-md object-cover aspect-square"/>
                                                    <span>{category.name}</span>
                                                </div>
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </aside>

                    <div className="md:col-span-3">
                        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
                            <div className="relative flex-1 md:grow-0">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search products..."
                                    className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-4">
                                {user && (
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'}/>
                                            <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <Button variant="ghost" size="icon" onClick={handleSignOut}>
                                            <LogOut className="h-5 w-5" />
                                            <span className="sr-only">Sign Out</span>
                                        </Button>
                                    </div>
                                )}
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline"><QrCode className="mr-2 h-4 w-4" /> Share Menu</Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto">
                                    <div className="flex flex-col items-center gap-2">
                                        <p className="text-sm font-medium">Scan to view menu</p>
                                        <Image src={qrCodeUrl} alt="QR Code for menu" width={150} height={150} />
                                    </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                <Card key={product.id} className="overflow-hidden flex flex-col cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedProduct(product)}>
                                    <CardContent className="p-0">
                                        <Image
                                            alt={product.name}
                                            className="aspect-video w-full object-cover"
                                            height={225}
                                            src={product.imageUrl}
                                            width={400}
                                            data-ai-hint={product.imageHint}
                                        />
                                    </CardContent>
                                    <CardHeader className="flex-grow">
                                        <CardTitle>{product.name}</CardTitle>
                                        <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                                    </CardHeader>
                                    <CardFooter className="flex justify-between items-center">
                                        <p className="font-semibold text-lg">{formatCurrency(product.salesPrice)}</p>
                                        <Button onClick={(e) => { e.stopPropagation(); addToCart(product); }}>Add to Cart</Button>
                                    </CardFooter>
                                </Card>
                            ))
                            ) : (
                                <div className="col-span-full text-center py-12">
                                    <h3 className="text-xl font-semibold">No Products Found</h3>
                                    <p className="text-muted-foreground">Try adjusting your search or category filter.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <footer className="text-center py-6 border-t">
                <p className="text-muted-foreground">Powered by ShopFlow</p>
            </footer>
        </div>
    )
}
