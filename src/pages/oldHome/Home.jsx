import React, { useEffect, useState } from "react";
import { Card, Row, Col, Typography, Space, Image, Divider, Statistic } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const PayPage = () => {
  const [timeLeft, setTimeLeft] = useState(900); // 15分钟
  const [order, setOrder] = useState({
    merchant: "VNG Games",
    service: "Dịch Vụ",
    amount: 5000,
    transactionId: "251016040032397440",
    description: "Sun nạp 5,000 VND vào game Tam Quốc Huyền Tướng VNG qua VietQR tại Shop.vnggames.com",
    qrcode_url: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=test",
    bank: "Ngân hàng TMCP Việt Nam Thịnh Vượng",
    receiver: "VNG CORP",
    account: "ZLP25289141382552",
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div style={{ background: "#f5f6fa", minHeight: "100vh", padding: "40px" }}>
      <Row justify="center" gutter={32}>
        {/* 左侧 - 订单信息 */}
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Image width={80} src="https://upload.wikimedia.org/wikipedia/commons/0/09/VNG_Corporation_logo.svg" preview={false} />
              <Title level={5} style={{ margin: 0 }}>
                {order.service}
              </Title>

              <Divider style={{ margin: "12px 0" }} />

              <Space direction="vertical" size={2}>
                <Text strong>Order Amount:</Text>
                <Text>₫{order.amount.toLocaleString()}</Text>

                <Text strong>Charge Amount:</Text>
                <Text>₫{order.amount.toLocaleString()}</Text>

                <Text strong>Transaction Id:</Text>
                <Text>{order.transactionId}</Text>

                <Text strong>Description:</Text>
                <Paragraph>{order.description}</Paragraph>
              </Space>

              <Divider style={{ margin: "12px 0" }} />

              <Space align="center">
                <ClockCircleOutlined style={{ color: "#faad14" }} />
                <Text>
                  Transaction timed out in{" "}
                  <strong>
                    {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
                  </strong>
                </Text>
              </Space>
            </Space>
          </Card>
        </Col>

        {/* 右侧 - 支付二维码 */}
        <Col xs={24} md={10}>
          <Card bordered={false} style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", textAlign: "center" }}>
            <Title level={4}>Scan QR to pay</Title>
            <Image
              width={220}
              height={220}
              src={order.qrcode_url}
              alt="QR code"
              preview={false}
              style={{ border: "1px solid #eaeaea", padding: 8, borderRadius: 8 }}
            />
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">{order.bank}</Text>
              <br />
              <Text strong>{order.receiver}</Text>
              <br />
              <Text code>{order.account}</Text>
            </div>

            <Divider />

            <Text>Open the app with VietQR to pay for your order</Text>

            <div style={{ marginTop: 12 }}>
              <Space size="middle">
                <Image width={36} src="https://upload.wikimedia.org/wikipedia/commons/6/66/ZaloPay_Logo.png" preview={false} />
                <Image width={36} src="https://upload.wikimedia.org/wikipedia/commons/f/f4/MB_Bank_logo.png" preview={false} />
                <Image width={36} src="https://upload.wikimedia.org/wikipedia/commons/e/e4/BIDV_logo.png" preview={false} />
              </Space>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PayPage;
