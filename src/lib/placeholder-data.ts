import { PlaceHolderImages } from './placeholder-images';

export type Product = {
  id: string;
  name: string;
  description: string;
  salesPrice: number;
  purchasePrice: number;
  quantity: number;
  category: string;
  imageUrl: string;
  imageHint: string;
  unit: string;
  variants: { name: string; value: string; additionalPrice: number }[];
  code?: string;
};

export type DetailedSale = {
  invoiceId: string;
  customerName: string;
  customerEmail: string;
  status: "Pending" | "Paid" | "Failed";
  date: string;
  amount: number;
}

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

export const user = {
  name: 'Admin User',
  email: 'admin@shopflow.com',
  avatar: 'https://picsum.photos/seed/300/100/100'
};

export let products: Product[] = [
  {
    id: "prod_1",
    name: "Espresso Machine",
    description: "A high-quality espresso machine for home baristas. Built with stainless steel and a powerful pump to deliver the perfect shot every time. Features a built-in grinder and steam wand for lattes and cappuccinos.",
    salesPrice: 499.99,
    purchasePrice: 250.00,
    quantity: 15,
    category: "Equipment",
    imageUrl: findImage('prod_espresso_machine'),
    imageHint: "espresso machine",
    unit: 'pcs',
    variants: [],
  },
  {
    id: "prod_2",
    name: "Artisanal Coffee Beans",
    description: "A 250g bag of single-origin, medium-roast beans from the highlands of Ethiopia. Expect notes of citrus, bergamot, and dark chocolate for a complex and satisfying cup.",
    salesPrice: 18.50,
    purchasePrice: 8.00,
    quantity: 80,
    category: "Consumables",
    imageUrl: findImage('prod_coffee_beans'),
    imageHint: "coffee beans",
    unit: 'kg',
    variants: [
      { name: "Grind", value: "Whole Bean", additionalPrice: 0 },
      { name: "Grind", value: "Espresso", additionalPrice: 0 },
      { name: "Grind", value: "Filter", additionalPrice: 0 },
    ],
  },
  {
    id: "prod_3",
    name: "Classic Black T-Shirt",
    description: "A comfortable and stylish 100% organic cotton t-shirt. Pre-shrunk and side-seamed for a perfect fit that lasts. Your new everyday essential.",
    salesPrice: 25.00,
    purchasePrice: 10.00,
    quantity: 120,
    category: "Apparel",
    imageUrl: findImage('prod_tshirt_black'),
    imageHint: "black t-shirt",
    unit: 'pcs',
    variants: [
      { name: "Size", value: "S", additionalPrice: 0 },
      { name: "Size", value: "M", additionalPrice: 0 },
      { name: "Size", value: "L", additionalPrice: 2 },
      { name: "Size", value: "XL", additionalPrice: 2 },
    ],
  },
  {
    id: "prod_4",
    name: "Blue Denim Jeans",
    description: "Stylish and durable slim-fit blue jeans made with a touch of stretch for all-day comfort. A timeless classic for any wardrobe.",
    salesPrice: 75.00,
    purchasePrice: 30.00,
    quantity: 60,
    category: "Apparel",
    imageUrl: findImage('prod_jeans_blue'),
    imageHint: "blue jeans",
    unit: 'pcs',
    variants: [
      { name: "Waist", value: "30", additionalPrice: 0 },
      { name: "Waist", value: "32", additionalPrice: 0 },
      { name: "Waist", value: "34", additionalPrice: 0 },
    ],
  },
  {
    id: "prod_5",
    name: "Fresh Croissant",
    description: "Authentic all-butter croissant, hand-rolled and baked fresh throughout the day. Impossibly flaky, light, and delicious.",
    salesPrice: 3.50,
    purchasePrice: 0.75,
    quantity: 45,
    category: "Bakery",
    imageUrl: findImage('prod_croissant'),
    imageHint: "croissant pastry",
    unit: 'pcs',
    variants: [],
  },
  {
    id: "prod_6",
    name: "Iced Latte",
    description: "A refreshing blend of our signature espresso and cold milk, served over ice. The perfect pick-me-up for a warm day.",
    salesPrice: 5.50,
    purchasePrice: 1.50,
    quantity: Infinity, // Made to order
    category: "Beverages",
    imageUrl: findImage('prod_iced_latte'),
    imageHint: "iced coffee",
    unit: 'L',
    variants: [
        { name: "Milk", value: "Whole", additionalPrice: 0 },
        { name: "Milk", value: "Oat", additionalPrice: 1 },
        { name: "Milk", value: "Almond", additionalPrice: 1 },
        { name: "Syrup", value: "None", additionalPrice: 0 },
        { name: "Syrup", value: "Vanilla", additionalPrice: 0.5 },
        { name: "Syrup", value: "Caramel", additionalPrice: 0.5 },
    ],
  },
  {
    id: "prod_7",
    name: "Gray Hoodie",
    description: "A cozy and warm gray hoodie crafted from a soft fleece-lined cotton blend. Perfect for layering on chilly days.",
    salesPrice: 60.00,
    purchasePrice: 25.00,
    quantity: 40,
    category: "Apparel",
    imageUrl: findImage('prod_hoodie_gray'),
    imageHint: "gray hoodie",
    unit: 'pcs',
    variants: [
        { name: "Size", value: "S", additionalPrice: 0 },
        { name: "Size", value: "M", additionalPrice: 0 },
        { name: "Size", value: "L", additionalPrice: 0 },
    ],
  },
  {
    id: "prod_8",
    name: "White Sneakers",
    description: "Clean and classic white leather sneakers for any occasion. Designed for comfort and style, these will be your go-to shoes.",
    salesPrice: 90.00,
    purchasePrice: 40.00,
    quantity: 30,
    category: "Footwear",
    imageUrl: findImage('prod_sneakers_white'),
    imageHint: "white sneakers",
    unit: 'pcs',
    variants: [
        { name: "Size", value: "8", additionalPrice: 0 },
        { name: "Size", value: "9", additionalPrice: 0 },
        { name: "Size", value: "10", additionalPrice: 0 },
        { name: "Size", value: "11", additionalPrice: 0 },
    ],
  },
];

export const sales = [
  {
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    avatar: findImage('user_olivia_martin'),
    amount: 1999.00,
  },
  {
    name: "Jackson Lee",
    email: "jackson.lee@email.com",
    avatar: findImage('user_jackson_lee'),
    amount: 39.00,
  },
  {
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    avatar: findImage('user_isabella_nguyen'),
    amount: 299.00,
  },
  {
    name: "William Kim",
    email: "will@email.com",
    avatar: findImage('user_william_kim'),
    amount: 99.00,
  },
  {
    name: "Sofia Davis",
    email: "sofia.davis@email.com",
    avatar: findImage('user_sofia_davis'),
    amount: 39.00,
  },
];

export const detailedSales: DetailedSale[] = [
    {
        invoiceId: "INV001",
        customerName: "Liam Johnson",
        customerEmail: "liam@example.com",
        status: "Paid",
        date: "2023-11-23",
        amount: 250,
    },
    {
        invoiceId: "INV002",
        customerName: "Olivia Smith",
        customerEmail: "olivia@example.com",
        status: "Pending",
        date: "2023-11-20",
        amount: 150,
    },
    {
        invoiceId: "INV003",
        customerName: "Noah Williams",
        customerEmail: "noah@example.com",
        status: "Paid",
        date: "2023-11-18",
        amount: 350,
    },
    {
        invoiceId: "INV004",
        customerName: "Emma Brown",
        customerEmail: "emma@example.com",
        status: "Paid",
        date: "2023-11-15",
        amount: 450,
    },
    {
        invoiceId: "INV005",
        customerName: "Oliver Jones",
        customerEmail: "oliver@example.com",
        status: "Failed",
        date: "2023-11-12",
        amount: 550,
    },
     {
        invoiceId: "INV006",
        customerName: "Ava Garcia",
        customerEmail: "ava@example.com",
        status: "Paid",
        date: "2023-11-10",
        amount: 200,
    },
    {
        invoiceId: "INV007",
        customerName: "Elijah Martinez",
        customerEmail: "elijah@example.com",
        status: "Pending",
        date: "2023-11-08",
        amount: 300,
    },
];

export const teamMembers = [
  {
    name: 'Admin User',
    email: 'admin@shopflow.com',
    role: 'Owner (Admin)',
    avatar: user.avatar,
  },
  {
    name: 'Jane Doe',
    email: 'jane.d@shopflow.com',
    role: 'Stock Manager',
    avatar: 'https://picsum.photos/seed/210/100/100',
  },
  {
    name: 'John Smith',
    email: 'john.s@shopflow.com',
    role: 'Vendeur (POS)',
    avatar: 'https://picsum.photos/seed/211/100/100',
  },
];
