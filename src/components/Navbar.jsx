import React, { useState } from "react";
import { Button, Dropdown, Menu, Select, Tag } from "antd";
import {
  AppstoreOutlined,
  GlobalOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import LoginModal from "./LoginModal"; // 引入登录弹窗
import "./Header.css";

const { Option } = Select;

const Header = () => {
  const [searchValue, setSearchValue] = useState("");
  const [showLogin, setShowLogin] = useState(false); // 控制登录弹窗显示

  // Ecosystem 菜单
  const ecosystemMenu = (
    <Menu
      items={[
        { key: "games", label: <a href="https://vnggames.com/games" target="_blank">Games</a> },
        { key: "account", label: <a href="https://myaccount.vnggames.com/" target="_blank">Account</a> },
        { key: "support", label: <a href="https://support.vnggames.com/" target="_blank">Support</a> },
      ]}
    />
  );

  // Language 菜单
  const langMenu = (
    <Menu
      items={[
        { key: "vn", label: "Việt Nam (VN)" },
        { key: "en", label: "English (EN)" },
        { key: "tw", label: "繁體中文 (TW)" },
        { key: "th", label: "ไทย (TH)" },
      ]}
    />
  );

  // 游戏数据
  const gameList = [
    {
      name: "Tam Quốc Huyễn Tướng VNG",
      platform: "Mobile",
      region: "VN",
      icon: "/images/candy1.png",
    },
    {
      name: "Roblox VN",
      platform: "Mobile",
      region: "VN",
      icon: "/images/candy2.png",
    },
    {
      name: "Liên Minh Huyền Thoại",
      platform: "PC",
      region: "VN",
      icon: "/images/candy3.png",
    },
    {
      name: "Play Together VNG",
      platform: "Mobile",
      region: "VN",
      icon: "/images/candy4.png",
    },
  ];

  return (
    <>
      <header className="vng-header">
        <div className="vng-header-inner">
          {/* 左侧 LOGO */}
          <div className="vng-logo">
            <img src="/images/logoshop.webp" alt="VNGGames Shop" />
          </div>

          {/* 搜索栏 */}
          <div className="vng-search">
            <Select
              showSearch
              className="vng-search-select"
              placeholder="Tìm kiếm game..."
              suffixIcon={<SearchOutlined />}
              value={searchValue}
              onChange={setSearchValue}
              filterOption={(input, option) =>
                option?.label.toLowerCase().includes(input.toLowerCase())
              }
              options={gameList.map((game) => ({
                value: game.name,
                label: (
                  <div className="search-item">
                    <img src={game.icon} alt={game.name} />
                    <div className="search-item-info">
                      <div className="name">{game.name}</div>
                      <div className="meta">
                        <Tag color={game.platform === "PC" ? "blue" : "volcano"} size="small">
                          {game.platform}
                        </Tag>
                        <span className="region">{game.region}</span>
                      </div>
                    </div>
                  </div>
                ),
              }))}
            />
          </div>

          {/* 功能区 */}
          <div className="vng-actions">
            <Dropdown overlay={ecosystemMenu} placement="bottomRight">
              <Button
                className="vng-icon-btn"
                icon={<AppstoreOutlined style={{ fontSize: 18 }} />}
              />
            </Dropdown>

            <Dropdown overlay={langMenu} placement="bottomRight">
              <Button
                className="vng-lang-btn"
                icon={<GlobalOutlined style={{ fontSize: 18 }} />}
              >
                <span className="lang-text">VN</span>
              </Button>
            </Dropdown>

            {/* 登录按钮 */}
            <Button
              type="primary"
              className="vng-login-btn"
              onClick={() => setShowLogin(!showLogin)}
            >
              Đăng nhập
            </Button>
          </div>
        </div>
      </header>

      {/* 登录弹窗组件 */}
      <LoginModal visible={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
};

export default Header;
