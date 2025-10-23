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

// ✅ 格式化越南币
export const formatVND = (n) => `${(n || 0).toLocaleString("vi-VN")} VND`;
