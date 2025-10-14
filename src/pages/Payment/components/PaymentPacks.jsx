import React, { useState } from "react";
import { Button } from "antd";
import "../styles/PaymentPacks.css";

const mockPacks = [
  {
    id: 1,
    name: "Gói Chiêu Mộ Bất Ngờ",
    desc: "Ưu đãi: Giảm 50% + nhận quà tiêu lần đầu",
    price: 5000,
    image:
      "https://stc-sot.vcdn.vn/ws-content/uploads//GTAPPTEST-ZINGPAY-1-LIVE/image/product/1429910654359678976.png",
  },
  {
    id: 2,
    name: "Gói Chiêu Mộ Thú Vị",
    desc: "Ưu đãi: Giảm 50% + nhận quà tiêu lần đầu",
    price: 10000,
    image:
      "https://stc-sot.vcdn.vn/ws-content/uploads//GTAPPTEST-ZINGPAY-1-LIVE/image/product/1429910654359678976.png",
  },
  {
    id: 3,
    name: "Gói 65 Huyền Tinh",
    desc: "Ưu đãi: +10 Áo Tinh",
    price: 25000,
    image:
      "https://stc-sot.vcdn.vn/ws-content/uploads//GTAPPTEST-ZINGPAY-1-LIVE/image/product/1429910654359678976.png",
  },
];

export default function PaymentPacks() {
  const [selected, setSelected] = useState([]);

  const addPack = (pack) => {
    setSelected((prev) => {
      const exist = prev.find((p) => p.id === pack.id);
      if (exist)
        return prev.map((p) =>
          p.id === pack.id ? { ...p, qty: p.qty + 1 } : p
        );
      return [...prev, { ...pack, qty: 1 }];
    });
  };

  const reducePack = (id) =>
    setSelected((prev) =>
      prev
        .map((p) =>
          p.id === id ? { ...p, qty: Math.max(p.qty - 1, 0) } : p
        )
        .filter((p) => p.qty > 0)
    );

  return (
    <div className="pack-section">
      <h2 className="section-title">2. Chọn gói</h2>

      <div className="hot-bar">
        <span>🔥 HOT ITEMS</span>
        <Button size="small" type="default">
          Mua nhiều Gói nạp
        </Button>
      </div>

      <div className="pack-grid">
        {mockPacks.map((pack) => (
          <div className="pack-card" key={pack.id}>
            <img src={pack.image} alt={pack.name} />
            <div className="pack-info">
              <h4>{pack.name}</h4>
              <p>{pack.desc}</p>
              <div className="pack-bottom">
                <span className="pack-price">
                  {pack.price.toLocaleString()} VND
                </span>
                <div className="qty-btns">
                  <Button size="small" onClick={() => reducePack(pack.id)}>
                    -
                  </Button>
                  <span>
                    {selected.find((p) => p.id === pack.id)?.qty || 0}
                  </span>
                  <Button size="small" onClick={() => addPack(pack)}>
                    +
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
