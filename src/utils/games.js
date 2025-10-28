// src/utils/games.js
import game1 from "@/assets/game-placeholder.jpg";
import game2 from "@/assets/game-placeholder_2.jpg";
// ✅ 直接 import 所有图片（Vite 会在构建时自动生成正确的 hashed 文件路径）
import pack60 from "@/assets/Pack 60.png";
import pack150 from "@/assets/Pack 150.png";
import pack300 from "@/assets/Pack 300.png";
import pack1582 from "@/assets/Pack 1582.png";
import pack3226 from "@/assets/Pack 3226.png";
import pack16667 from "@/assets/Pack 16667.png";


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
    image: pack60,
  },
  {
    id: "pirate.pack.diamond.2",
    name: "Gói 150 Kim Cương",
    desc: "Gói 150 Kim Cương",
    price: 50000,
    image: pack150,
  },
  {
    id: "pirate.pack.diamond.4",
    name: "Gói 300 Kim Cương",
    desc: "Gói 300 Kim Cương",
    price: 100000,
    image: pack300,
  },
  {
    id: "pirate.pack.diamond.20",
    name: "Gói 1582 Kim Cương",
    desc: "Gói 1502 Kim Cương + Bonus 81 Kim Cương",
    price: 500000,
    sale: true,
    image: pack1582,
  },
  {
    id: "pirate.pack.diamond.50",
    name: "Gói 3226 Kim Cương",
    desc: "Gói 3003 Kim Cương + Bonus 223 Kim Cương",
    price: 1000000,
    sale: true,
    image: pack3226,
  },
  {
    id: "pirate.pack.diamond.100",
    name: "Gói 16667 Kim Cương",
    desc: "Gói 15015 Kim Cương + Bonus 1652 Kim Cương",
    price: 5000000,
    sale: true,
    image: pack16667,
  },
];


// ✅ 格式化越南币
export const formatVND = (n) => `${(n || 0).toLocaleString("vi-VN")} VND`;
