// verify.js
// 验证 SePay 签名是否正确 (Node.js)
// 用法：SEPAY_SECRET=你的测试密钥 node verify.js

const crypto = require("crypto");
const fs = require("fs");

// 固定 SePay 要签名的字段顺序
const SIGNED_KEYS = [
  "merchant",
  "operation",
  "payment_method",
  "order_amount",
  "currency",
  "order_invoice_number",
  "order_description",
  "customer_id",
  "success_url",
  "error_url",
  "cancel_url",
];

// ✅ 解析 HTML form（从后端返回的表单原文）
function extractFieldsFromForm(html) {
  const fields = {};
  const regex = /<input[^>]*name="([^"]+)"[^>]*value="([^"]*)"[^>]*>/gi;
  let m;
  while ((m = regex.exec(html))) {
    fields[m[1]] = m[2];
  }
  return fields;
}

// ✅ 构造签名字符串
function buildSignString(fields) {
  return SIGNED_KEYS.filter((key) => key in fields)
    .map((key) => `${key}=${fields[key]}`)
    .join(",");
}

// ✅ 使用 HMAC-SHA256 算法生成签名
function generateSignature(fields, secret) {
  const data = buildSignString(fields);
  const hmac = crypto.createHmac("sha256", Buffer.from(secret, "utf8"));
  hmac.update(Buffer.from(data, "utf8"));
  const signature = hmac.digest("base64");
  return { signature, data };
}

// ✅ 主函数
async function main() {
  const secret = process.env.SEPAY_SECRET;
  if (!secret) {
    console.error("❌ 缺少环境变量 SEPAY_SECRET，例如：");
    console.error("   SEPAY_SECRET=你的测试密钥 node verify.js");
    process.exit(1);
  }

  // 支持两种输入方式：1）form参数 2）HTML文件
  const arg = process.argv.find((a) => a.startsWith("form="));
  let fields;

  if (arg) {
    // 方式1：直接命令行传 form=merchant=...&signature=...
    const query = arg.slice("form=".length);
    fields = {};
    query.split("&").forEach((kv) => {
      const [k, v] = kv.split("=");
      fields[decodeURIComponent(k)] = decodeURIComponent(v || "");
    });
  } else {
    // 方式2：从 verify.html 中读取 <form> 内容
    const htmlPath = "./verify.html";
    if (!fs.existsSync(htmlPath)) {
      console.error("⚠️ 未提供 form 参数，也找不到 verify.html 文件。");
      process.exit(1);
    }
    const html = fs.readFileSync(htmlPath, "utf8");
    fields = extractFieldsFromForm(html);
  }

  const providedSig = fields.signature || "(无 signature)";
  const { signature: recalculated, data } = generateSignature(fields, secret);

  console.log("\n🧾 参与签名的字符串:");
  console.log(data, "\n");
  console.log("🔐 后端提供的 signature:", providedSig);
  console.log("🧮 本地计算的 signature :", recalculated);

  if (!fields.signature) {
    console.log("\n⚠️ 没有 signature 字段，无法验证。");
    process.exit(0);
  }

  if (recalculated === providedSig) {
    console.log("\n✅ 验签成功！后端签名与前端表单一致。\n");
  } else {
    console.log("\n❌ 验签失败！签名或字段集不匹配。\n");
    console.log("🔍 请检查：");
    console.log("  1️⃣ 是否包含 payment_method=vietqr");
    console.log("  2️⃣ 是否包含 error_url / cancel_url");
    console.log("  3️⃣ order_description 与签名前完全一致（无 #，无空格差异）");
    console.log("  4️⃣ SEPAY_SECRET 使用是否正确（测试/正式密钥）\n");
  }
}

main().catch((err) => {
  console.error("💥 程序异常:", err);
  process.exit(1);
});
