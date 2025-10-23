// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  vi: {
    translation: {
      // ✅ 导航栏
      nav: {
        home: "Trang chủ",
        products: "Sản phẩm",
        news: "Tin tức",
        download: "Tải về",
        support: "Hỗ trợ",
        about: "Giới thiệu",
        search_games: "Tìm kiếm trò chơi",
      },

      // ✅ 登录模块
      login: {
        select_game: "Chọn trò chơi",
        please_select_game: "Vui lòng chọn trò chơi để tiếp tục",
        back_to_game: "Quay lại chọn game",
        username: "Tên đăng nhập hoặc Email",
        password: "Mật khẩu",
        btn_login: "Đăng nhập",
        logging_in: "Đang đăng nhập...",
        login_success: "Đăng nhập thành công!",
        login_fail: "Đăng nhập thất bại!",
        apple_fail: "Apple đăng nhập thất bại!",
        all_products: "Một tài khoản cho tất cả sản phẩm VNGGames",
      },

      // ✅ 订单 & 支付
      orders: {
        title: "Thông tin đơn hàng",
        empty: "Chưa có sản phẩm nào",
        remove: "Xóa",
        total: "Tổng thanh toán",
      },
      payments: {
        title: "Phương thức thanh toán",
        pay_now: "Thanh toán ngay",
        fail: "Thanh toán thất bại, vui lòng thử lại!",
        success: "Thanh toán thành công!",
      },
      cart: {
        total: "Tổng tiền",
        continue: "Tiếp tục",
        order_info: "Thông tin đơn hàng",
      },

      // ✅ 提示信息
      tips: {
        reach_item_limit: "Bạn đã đạt số lượng tối đa",
        choose_game_first: "Vui lòng chọn trò chơi trước khi tiếp tục!",
      },

      // ✅ 错误提示
      errors: {
        invalid_gameid: "Game ID không hợp lệ",
        no_paymethods: "Không có dữ liệu thanh toán",
        load_paymethods_fail: "Lỗi khi tải phương thức thanh toán",
        over_total_limit:
          "Đơn hàng vượt hạn mức thanh toán cho phép. Vui lòng giảm số lượng sản phẩm",
        paymethod_unavailable: "Phương thức thanh toán không khả dụng",
      },

      // ✅ 通用消息
      msg: {
        please_choose_game: "Vui lòng chọn trò chơi!",
        please_fill_account: "Vui lòng nhập tài khoản và mật khẩu!",
        connect_error: "Không thể kết nối máy chủ, vui lòng kiểm tra lại mạng.",
        server_error: "Máy chủ trả về lỗi.",
        invalid_json: "Máy chủ trả về dữ liệu không hợp lệ.",
        loading: "Đang tải...",
      },
    },
  },

  zh: {
    translation: {
      // ✅ 导航栏
      nav: {
        home: "首页",
        products: "产品",
        news: "新闻",
        download: "下载",
        support: "客服",
        about: "关于我们",
        search_games: "搜索游戏",
      },

      // ✅ 登录模块
      login: {
        select_game: "选择游戏",
        please_select_game: "请选择游戏后继续",
        back_to_game: "返回选游戏",
        username: "用户名或邮箱",
        password: "密码",
        btn_login: "登录",
        logging_in: "正在登录...",
        login_success: "登录成功！",
        login_fail: "登录失败！",
        apple_fail: "Apple 登录失败！",
        all_products: "一个账号通行所有 VNGGames 产品",
      },

      // ✅ 订单 & 支付
      orders: {
        title: "订单信息",
        empty: "暂未选择商品",
        remove: "删除",
        total: "合计",
      },
      payments: {
        title: "支付方式",
        pay_now: "立即支付",
        fail: "支付失败，请重试！",
        success: "支付成功！",
      },
      cart: {
        total: "总计",
        continue: "继续",
        order_info: "订单信息",
      },

      // ✅ 提示信息
      tips: {
        reach_item_limit: "已达该商品数量上限",
        choose_game_first: "请先选择游戏后再继续！",
      },

      // ✅ 错误提示
      errors: {
        invalid_gameid: "游戏ID无效",
        no_paymethods: "暂无可用支付方式",
        load_paymethods_fail: "加载支付方式失败",
        over_total_limit: "订单超出允许限额，请减少商品数量",
        paymethod_unavailable: "支付方式不可用",
      },

      // ✅ 通用消息
      msg: {
        please_choose_game: "请选择游戏！",
        please_fill_account: "请输入账号和密码！",
        connect_error: "无法连接服务器，请检查网络。",
        server_error: "服务器返回错误。",
        invalid_json: "服务器返回数据无效。",
        loading: "加载中...",
      },
    },
  },
};

// ✅ 初始化 i18n
i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("lang") || "vi", // 默认语言从本地存储读取
  fallbackLng: "vi",
  interpolation: {
    escapeValue: false, // React 已防止 XSS
  },
});

export default i18n;
