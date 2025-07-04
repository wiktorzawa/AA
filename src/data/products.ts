export interface Product {
  name: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  sales: number;
  status: "In Stock" | "Out of Stock";
}

export const productData: Product[] = [
  {
    name: 'Apple iMac 27"',
    category: "Computers",
    brand: "Apple",
    price: 1299,
    stock: 95,
    sales: 200,
    status: "In Stock",
  },
  {
    name: "Apple iPhone",
    category: "Mobile Phones",
    brand: "Apple",
    price: 999,
    stock: 342,
    sales: 300,
    status: "In Stock",
  },
  {
    name: "Samsung Galaxy",
    category: "Mobile Phones",
    brand: "Samsung",
    price: 899,
    stock: 127,
    sales: 150,
    status: "In Stock",
  },
  {
    name: "Dell XPS 13",
    category: "Computers",
    brand: "Dell",
    price: 1099,
    stock: 0,
    sales: 120,
    status: "Out of Stock",
  },
  {
    name: "HP Spectre x360",
    category: "Computers",
    brand: "HP",
    price: 1299,
    stock: 325,
    sales: 80,
    status: "In Stock",
  },
  {
    name: "Google Pixel 6",
    category: "Mobile Phones",
    brand: "Google",
    price: 799,
    stock: 100,
    sales: 200,
    status: "In Stock",
  },
  {
    name: "Sony WH-1000XM4",
    category: "Headphones",
    brand: "Sony",
    price: 349,
    stock: 60,
    sales: 150,
    status: "In Stock",
  },
  {
    name: "Apple AirPods Pro",
    category: "Headphones",
    brand: "Apple",
    price: 249,
    stock: 200,
    sales: 300,
    status: "In Stock",
  },
  {
    name: "Asus ROG Zephyrus",
    category: "Computers",
    brand: "Asus",
    price: 1899,
    stock: 15,
    sales: 50,
    status: "In Stock",
  },
  {
    name: "Microsoft Surface Pro 7",
    category: "Computers",
    brand: "Microsoft",
    price: 899,
    stock: 224,
    sales: 100,
    status: "In Stock",
  },
  {
    name: "Samsung QLED TV",
    category: "Televisions",
    brand: "Samsung",
    price: 1299,
    stock: 0,
    sales: 70,
    status: "Out of Stock",
  },
  {
    name: "LG OLED TV",
    category: "Televisions",
    brand: "LG",
    price: 1499,
    stock: 204,
    sales: 50,
    status: "In Stock",
  },
  {
    name: "Canon EOS R5",
    category: "Cameras",
    brand: "Canon",
    price: 3899,
    stock: 674,
    sales: 30,
    status: "In Stock",
  },
  {
    name: "Nikon Z7 II",
    category: "Cameras",
    brand: "Nikon",
    price: 3299,
    stock: 164,
    sales: 25,
    status: "In Stock",
  },
  {
    name: "Apple Watch Series 7",
    category: "Wearables",
    brand: "Apple",
    price: 399,
    stock: 150,
    sales: 500,
    status: "In Stock",
  },
  {
    name: "Fitbit Charge 5",
    category: "Wearables",
    brand: "Fitbit",
    price: 179,
    stock: 444,
    sales: 250,
    status: "In Stock",
  },
  {
    name: "Dyson V11 Vacuum",
    category: "Home Appliances",
    brand: "Dyson",
    price: 599,
    stock: 0,
    sales: 90,
    status: "Out of Stock",
  },
  {
    name: "iRobot Roomba i7+",
    category: "Home Appliances",
    brand: "iRobot",
    price: 799,
    stock: 1043,
    sales: 70,
    status: "In Stock",
  },
  {
    name: "Bose SoundLink Revolve",
    category: "Speakers",
    brand: "Bose",
    price: 199,
    stock: 935,
    sales: 200,
    status: "In Stock",
  },
  {
    name: "Sonos One",
    category: "Sonos",
    brand: "Sonos",
    price: 90,
    stock: 180,
    sales: 67,
    status: "In Stock",
  },
  {
    name: "Apple iPad Pro",
    category: "Tablets",
    brand: "Apple",
    price: 1099,
    stock: 98,
    sales: 150,
    status: "In Stock",
  },
  {
    name: "Samsung Galaxy Tab S7",
    category: "Tablets",
    brand: "Samsung",
    price: 649,
    stock: 70,
    sales: 130,
    status: "In Stock",
  },
  {
    name: "Amazon Echo Dot",
    category: "Smart Home",
    brand: "Amazon",
    price: 49,
    stock: 300,
    sales: 800,
    status: "In Stock",
  },
  {
    name: "Google Nest Hub",
    category: "Smart Home",
    brand: "Google",
    price: 89,
    stock: 150,
    sales: 400,
    status: "In Stock",
  },
  {
    name: "PlayStation 5",
    category: "Gaming Consoles",
    brand: "Sony",
    price: 499,
    stock: 10,
    sales: 500,
    status: "In Stock",
  },
  {
    name: "Xbox Series X",
    category: "Gaming Consoles",
    brand: "Microsoft",
    price: 499,
    stock: 0,
    sales: 450,
    status: "Out of Stock",
  },
  {
    name: "Nintendo Switch",
    category: "Gaming Consoles",
    brand: "Nintendo",
    price: 299,
    stock: 65,
    sales: 600,
    status: "In Stock",
  },
  {
    name: "Apple MacBook Pro",
    category: "Computers",
    brand: "Apple",
    price: 1299,
    stock: 20,
    sales: 100,
    status: "In Stock",
  },
];
