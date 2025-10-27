// src/utils/games.js
import game1 from "@/assets/game-placeholder.jpg";
import game2 from "@/assets/game-placeholder_2.jpg";

export const allGames = [
  {
    game_id: 1,
    name_vi: "Biệt Đội Thép (War2)",
    name_zh: "War2：钢铁部队",
    platform: "Mobile",
    region: "VN",
    icon_url: game1,
  },
  {
    game_id: 2,
    name_vi: "Hải Trình Vô Tận",
    name_zh: "海盗：无尽航线",
    platform: "Mobile",
    region: "VN",
    icon_url: game2,
  },
];

export const mockPacks = [
  {
    id: "pirate.pack.diamond.1",
    name: "Gói 60 Kim Cương",
    desc: "Gói 60 Kim Cương",
    price: 20000,
    image: "/src/assets/Pack 60.png",
  },
  {
    id: "pirate.pack.diamond.2",
    name: "Gói 150 Kim Cương",
    desc: "Gói 150 Kim Cương",
    price: 50000,
    image: "/src/assets/Pack 150.png",
  },
  {
    id: "pirate.pack.diamond.4",
    name: "Gói 300 Kim Cương",
    desc: "Gói 300 Kim Cương",
    price: 100000,
    image: "/src/assets/Pack 300.png",
  },
  {
    id: "pirate.pack.diamond.20",
    name: "Gói 1582 Kim Cương",
    desc: "Gói 1502 Kim Cương + Bonus 81 Kim Cương",
    price: 500000,
    sale: true,
    image: "/src/assets/Pack 1582.png",
  },
  {
    id: "pirate.pack.diamond.50",
    name: "Gói 3226 Kim Cương",
    desc: "Gói 3003 Kim Cương + Bonus 223 Kim Cương",
    price: 1000000,
    sale: true,
    image: "/src/assets/Pack 3226.png",
  },
  {
    id: "pirate.pack.diamond.100",
    name: "Gói 16667 Kim Cương",
    desc: "Gói 15015 Kim Cương + Bonus 1652 Kim Cương",
    price: 5000000,
    sale: true,
    image: "/src/assets/Pack 16667.png",
  },
];


// ✅ 格式化越南币
export const formatVND = (n) => `${(n || 0).toLocaleString("vi-VN")} VND`;
