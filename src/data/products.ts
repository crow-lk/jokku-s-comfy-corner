import product1 from "@/assets/product-1.png";
import product2 from "@/assets/product-2.png";
import product3 from "@/assets/product-3.png";
import product4 from "@/assets/product-4.png";
import product5 from "@/assets/product-5.png";
import product7 from "@/assets/product-7.png";
import product8 from "@/assets/product-8.png";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  color: string;
  sizes: string[];
  description: string;
  rating: number;
  reviews: number;
  badge?: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Classic Blue Boxer",
    price: 1200,
    originalPrice: 1500,
    image: product1,
    category: "Boxer Shorts",
    color: "Blue",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Super comfy classic blue boxer shorts made from premium cotton. Feels like a cloud hugging your waist!",
    rating: 4.8,
    reviews: 124,
    badge: "BEST SELLER",
  },
  {
    id: "2",
    name: "Coral Trunk Pro",
    price: 1350,
    image: product2,
    category: "Trunks",
    color: "Coral",
    sizes: ["S", "M", "L", "XL"],
    description: "Sporty coral trunks with moisture-wicking fabric. Perfect for the active superhero in you!",
    rating: 4.6,
    reviews: 89,
  },
  {
    id: "3",
    name: "Sunshine Shorts",
    price: 950,
    originalPrice: 1200,
    image: product3,
    category: "Boxer Shorts",
    color: "Yellow",
    sizes: ["M", "L", "XL", "XXL"],
    description: "Bright yellow shorts that'll make every day feel like summer. Warning: may cause excessive happiness!",
    rating: 4.9,
    reviews: 203,
    badge: "HOT DEAL",
  },
  {
    id: "4",
    name: "Camo Commander",
    price: 1500,
    image: product4,
    category: "Boxer Briefs",
    color: "Green",
    sizes: ["S", "M", "L", "XL"],
    description: "Tactical comfort meets style. These camo boxer briefs are ready for any mission!",
    rating: 4.7,
    reviews: 67,
    badge: "NEW",
  },
  {
    id: "5",
    name: "Comic POW! Brief",
    price: 1100,
    image: product5,
    category: "Briefs",
    color: "Black",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Express yourself with comic-style prints. Every pair tells a story! POW! BAM! WOW!",
    rating: 4.5,
    reviews: 156,
  },
  {
    id: "6",
    name: "Navy Dot Trunk",
    price: 1250,
    originalPrice: 1600,
    image: product7,
    category: "Trunks",
    color: "Navy",
    sizes: ["M", "L", "XL"],
    description: "Classic navy with subtle polka dots. Sophisticated comfort for the modern gentleman!",
    rating: 4.4,
    reviews: 92,
    badge: "SALE",
  },
  {
    id: "7",
    name: "Checkered Champ",
    price: 1300,
    image: product8,
    category: "Boxer Shorts",
    color: "Red",
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Bold red & white checkered pattern. Race to comfort in these champion boxers!",
    rating: 4.6,
    reviews: 78,
  },
  {
    id: "8",
    name: "Coral Comfort Plus",
    price: 1400,
    image: product2,
    category: "Trunks",
    color: "Coral",
    sizes: ["S", "M", "L", "XL"],
    description: "Extra soft coral trunks with a relaxed fit. Your everyday hero underwear!",
    rating: 4.8,
    reviews: 145,
    badge: "POPULAR",
  },
];

export const categories = ["All", "Boxer Shorts", "Boxer Briefs", "Trunks", "Briefs"];
