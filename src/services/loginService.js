// src/services/loginService.js

// ✅ Google 登录
export const loginWithGoogle = () => {
    return new Promise((resolve, reject) => {
        if (!window.google) return reject("Google SDK chưa sẵn sàng");

        window.google.accounts.id.initialize({
            client_id: "37454700082-8ltobpibp24sc55mf8dol6fcv7nik52i.apps.googleusercontent.com",
            callback: (res) => {
                if (res.credential) {
                    resolve({
                        provider: "google",
                        credential: res.credential, // 这是 Google 返回的 id_token
                    });
                } else {
                    reject("Không lấy được token Google"); // 登录失败提示
                }
            },
            ux_mode: "popup", // ✅ 使用弹窗模式，不跳转页面
            auto_select: false, // ✅ 禁止自动登录（防止 SDK 自动选中上次账号）
            cancel_on_tap_outside: true, // ✅ 点击弹窗外自动关闭
            context: "signin", // ✅ 登录场景，可选：signin / signup / use
            scope: "openid email profile", // ✅ 要求的用户信息范围
            state_cookie_domain: "localhost" // ✅ 本地开发建议加上防止 CSRF 问题
        });

        window.google.accounts.id.prompt();
    });
};

export const loginWithFacebook = () => {
    return new Promise((resolve, reject) => {
        const waitForFB = () => {
            if (typeof FB !== "undefined" && window.FB_READY) {
                FB.getLoginStatus((response) => {
                    if (response.status === "connected") {
                        resolve({
                            provider: "facebook",
                            credential: response.authResponse.accessToken,
                        });
                    } else {
                        FB.login(
                            (res) => {
                                if (res.authResponse) {
                                    resolve({
                                        provider: "facebook",
                                        credential: res.authResponse.accessToken,
                                    });
                                } else reject("❌ User canceled login");
                            },
                            { scope: "email,public_profile" }
                        );
                    }
                });
            } else {
                console.log("⏳ Waiting for FB SDK to init...");
                setTimeout(waitForFB, 300);
            }
        };
        waitForFB();
    });
};


// ✅ Apple 登录
export const loginWithApple = async () => {
    if (!window.AppleID) throw new Error("Apple SDK chưa sẵn sàng");

    window.AppleID.auth.init({
        clientId: "com.bluedream.web",
        scope: "name email",
        redirectURI: window.location.origin + "/auth/apple/callback",
        usePopup: true,
    });

    const res = await window.AppleID.auth.signIn();
    return {
        provider: "apple",
        credential: res.authorization.id_token,
    };
};
