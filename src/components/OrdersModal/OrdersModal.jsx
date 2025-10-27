import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Modal,
  Select,
  Pagination,
  Table,
  Space,
  Button,
  message,
  Card,
  DatePicker,
} from "antd";
import { CopyOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { callApi } from "@/utils/api";
import { mockPacks } from "@/utils/games";
import { useNavigate } from "react-router-dom";
import styles from "./OrdersModal.module.css";

const { RangePicker } = DatePicker;

// 状态颜色（只用颜色，不加粗不底色）
const STATUS_COLOR = {
  success: "#16a34a",
  failed: "#dc2626",
  pending: "#d97706",
};

// i18n key
const TYPE_META = {
  single: "orders_history.type_single",
  multi: "orders_history.type_multi",
};

// 映射商品 id -> 名称
const PACK_NAME_MAP = new Map(mockPacks.map((p) => [p.id, p.name]));

// H5 判定
function useIsMobile() {
  const [isMobile, setMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isMobile;
}

// 把后端记录规范化为前端行
function normalizeRow(item) {
  const id = item.GlobalReceiptID || "INV_SEPAY_1761560442";
  const productIDs = item.productID
    ? item.productID
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const productNames = productIDs.map((pid) => PACK_NAME_MAP.get(pid) || pid);
  const type = productIDs.length > 1 ? "multi" : "single";

  // payState: "1" 成功, "0" 失败, 其它 pending
  const status =
    item.payState === "1"
      ? "success"
      : item.payState === "0"
      ? "failed"
      : "pending";

  // method：后端没给就默认 0（SePay），方便筛选
  const methodCode = item.methodCode ?? "0";
  const methodName =
    methodCode === "1" ? "MoMoPay" : methodCode === "2" ? "ZaloPay" : "SePay";

  // 解析并展示为：HH:mm DD/MM/YY GMT+7
  const d = dayjs(item.completedAt, "MM/DD/YYYY h:mm:ss A");
  const timeObj = d.isValid() ? d : null;
  const timeText = timeObj ? `${timeObj.format("HH:mm DD/MM/YY")} GMT+7` : "-";

  return {
    key: id,
    globalId: id, // ✅ 用 GlobalReceiptID 作为唯一编号
    type,
    status,
    timeObj,
    timeText,
    productNames,
    methodCode,
    methodName,
  };
}

export default function OrdersModal({ open, onClose }) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // 筛选状态
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all"); // "all" | "0" | "1" | "2"
  const [timeRange, setTimeRange] = useState([null, null]); // [dayjs|null, dayjs|null]

  // H5 展开/收起
  const [expanded, setExpanded] = useState({});
  const toggleExpand = useCallback(
    (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] })),
    []
  );

  // 拉取
  const getOrderList = useCallback(async () => {
    const uuid = JSON.parse(localStorage.getItem("user"))?.UuId;
    if (!uuid) return;
    try {
      setLoading(true);
      const res = await callApi(`/api/APILogin/History?uuid=${uuid}`, "GET");
      const arr = Object.values(res?.data || {});
      const norm = arr.map(normalizeRow);
      // 时间倒序
      norm.sort(
        (a, b) => (b.timeObj?.valueOf() || 0) - (a.timeObj?.valueOf() || 0)
      );
      setRows(norm);
    } catch (e) {
      console.error("History fetch error:", e);
      message.error(t("msg.server_error"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (open) getOrderList();
  }, [open, getOrderList]);

  // 过滤逻辑（含时间范围）
  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (typeFilter !== "all" && r.type !== typeFilter) return false;
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (methodFilter !== "all" && r.methodCode !== methodFilter) return false;

      if (
        timeRange?.[0] &&
        r.timeObj &&
        r.timeObj.isBefore(timeRange[0].startOf("day"))
      )
        return false;
      if (
        timeRange?.[1] &&
        r.timeObj &&
        r.timeObj.isAfter(timeRange[1].endOf("day"))
      )
        return false;

      return true;
    });
  }, [rows, typeFilter, statusFilter, methodFilter, timeRange]);

  // 分页
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;
  useEffect(
    () => setPage(1),
    [typeFilter, statusFilter, methodFilter, timeRange]
  );
  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  // 复制
  const copyId = async (id) => {
    try {
      await navigator.clipboard.writeText(id);
      message.success(t("orders_history.copy_success"));
    } catch {
      message.error(t("orders_history.copy_fail"));
    }
  };

  // Web 表格列：颜色符合原型、状态不加粗
  const columns = [
    {
      title: t("orders_history.transaction_id"),
      dataIndex: "globalId",
      render: (text, record) => {
        const orderId = record.globalId || "INV_SEPAY_1761560442";
        const handleClick = () => {
          if (record.status === "success") {
            onClose?.();
            navigate(`/payment/order/success/${orderId}?from=orders`);
          } else if (record.status === "failed") {
            onClose?.();
            navigate(`/payment/order/cancel/${orderId}?from=orders`);
          }
        };

        return (
          <Space size={8}>
            <span className={styles.idLink} onClick={handleClick}>
              {orderId}
            </span>
            <Button
              size="small"
              type="text"
              icon={<CopyOutlined />}
              onClick={() => copyId(orderId)}
              className={styles.copyBtn}
            />
          </Space>
        );
      },
      width: 220,
    },

    {
      title: t("orders_history.type"),
      dataIndex: "type",
      render: (v) => (
        <span className={styles.textMuted}>{t(TYPE_META[v])}</span>
      ),
      width: 160,
    },
    {
      title: t("orders_history.status"),
      dataIndex: "status",
      render: (s) => (
        <span style={{ color: STATUS_COLOR[s] || "#374151" }}>
          {t(`orders_history.${s}`)}
        </span>
      ),
      width: 120,
    },
    {
      title: t("orders_history.time"),
      dataIndex: "timeText",
      width: 210,
      render: (txt) => <span className={styles.textMuted}>{txt}</span>,
    },
    {
      title: t("orders_history.package"),
      dataIndex: "productNames",
      render: (names = []) => {
        if (!names.length) return "-";
        const show = names.slice(0, 2);
        const more = names.length - show.length;
        return (
          <div className={styles.pkgCol}>
            {show.map((n, i) => (
              <span key={i} className={styles.pkgLine}>
                {n}
              </span>
            ))}
            {more > 0 && <span className={styles.pkgMore}>... (+{more})</span>}
          </div>
        );
      },
      ellipsis: true,
    },
    {
      title: t("orders_history.method"),
      dataIndex: "methodName",
      width: 140,
      render: (v) => <span className={styles.textMuted}>{v}</span>,
    },
  ];

  // 下拉选项（全部 i18n）
  const typeOptions = [
    { value: "all", label: t("orders_history.filter.type") },
    { value: "single", label: t("orders_history.type_single") },
    { value: "multi", label: t("orders_history.type_multi") },
  ];
  const statusOptions = [
    { value: "all", label: t("orders_history.filter.status") },
    { value: "success", label: t("orders_history.success") },
    { value: "failed", label: t("orders_history.failed") },
    { value: "pending", label: t("orders_history.pending") },
  ];
  const methodOptions = [
    { value: "all", label: t("orders_history.filter.method") },
    { value: "0", label: "SePay" },
    { value: "1", label: "MoMoPay" },
    { value: "2", label: "ZaloPay" },
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={t("orders_history.title")}
      footer={null}
      width={isMobile ? "100%" : 1060}
      className={styles.modal}
      centered
    >
      {/* 筛选栏：四个控件一行；时间为 RangePicker */}
      <div className={styles.filtersRow}>
        <Select
          value={typeFilter}
          onChange={setTypeFilter}
          options={typeOptions}
          className={`${styles.filterItem} ${styles.fiType}`}
          dropdownMatchSelectWidth={240}
        />
        <RangePicker
          value={timeRange}
          onChange={(v) => setTimeRange(v || [null, null])}
          className={`${styles.filterItem} ${styles.fiTime}`}
          allowClear
          inputReadOnly
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          options={statusOptions}
          className={`${styles.filterItem} ${styles.fiStatus}`}
          dropdownMatchSelectWidth={220}
        />
        <Select
          value={methodFilter}
          onChange={setMethodFilter}
          options={methodOptions}
          className={`${styles.filterItem} ${styles.fiMethod}`}
          dropdownMatchSelectWidth={220}
        />
      </div>

      {/* 命中结果数 */}
      <div className={styles.resultHint}>
        {t("orders_history.result_count", { count: filtered.length })}
      </div>

      {/* Web 表格 or H5 卡片 */}
      {!isMobile ? (
        <>
          <Table
            rowKey="key"
            dataSource={paged}
            columns={columns}
            pagination={false}
            loading={loading}
            className={styles.table}
          />
          <div className={styles.pagination}>
            <Pagination
              current={page}
              pageSize={PAGE_SIZE}
              total={filtered.length}
              onChange={setPage}
              showSizeChanger={false}
            />
          </div>
        </>
      ) : (
        <div className={styles.cardList}>
          {paged.map((o) => {
            return (
              <Card key={o.key} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span
                    className={styles.cardId}
                    onClick={() => {
                      const orderId = o.globalId || "INV_SEPAY_1761560442";
                      if (o.status === "success") {
                        onClose?.();
                        navigate(`/payment/order/success/${orderId}?from=orders`);
                      } else if (o.status === "failed") {
                        onClose?.();
                        navigate(`/payment/order/cancel/${orderId}?from=orders`);
                      }
                    }}
                  >
                    {o.globalId || "INV_SEPAY_1761560442"}
                  </span>
                  <Button
                    size="small"
                    icon={<CopyOutlined />}
                    className={styles.copyBtnMobile}
                    onClick={() => copyId(o.globalId || "INV_SEPAY_1761560442")}
                  />
                </div>

                <div className={styles.cardRow}>
                  <span className={styles.cardLabel}>
                    {t("orders_history.type")}:
                  </span>
                  <span className={styles.cardValue}>
                    {t(TYPE_META[o.type])}
                  </span>
                </div>

                <div className={styles.cardRow}>
                  <span className={styles.cardLabel}>
                    {t("orders_history.status")}:
                  </span>
                  <span className={`${styles.cardValue} ${styles[o.status]}`}>
                    {t(`orders_history.${o.status}`)}
                  </span>
                </div>

                <div className={styles.cardRow}>
                  <span className={styles.cardLabel}>
                    {t("orders_history.time")}:
                  </span>
                  <span className={styles.cardValue}>{o.timeText}</span>
                </div>

                <div className={styles.cardRow}>
                  <span className={styles.cardLabel}>
                    {t("orders_history.package")}:
                  </span>
                  <div className={styles.cardValue}>
                    <div className={styles.pkgList}>
                      {(o.productNames || [])
                        .slice(0, expanded[o.key] ? o.productNames.length : 4)
                        .map((n, i) => (
                          <div key={i} className={styles.pkgItem}>
                            {n}
                          </div>
                        ))}
                      {(o.productNames || []).length > 4 && (
                        <Button
                          type="link"
                          size="small"
                          onClick={() => toggleExpand(o.key)}
                          className={styles.expandBtn}
                        >
                          {expanded[o.key]
                            ? t("common.cancel")
                            : t("common.confirm")}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.cardRow}>
                  <span className={styles.cardLabel}>
                    {t("orders_history.method")}:
                  </span>
                  <span className={styles.cardValue}>{o.methodName}</span>
                </div>
              </Card>
            );
          })}
          <div className={styles.pagination}>
            <Pagination
              current={page}
              pageSize={PAGE_SIZE}
              total={filtered.length}
              onChange={setPage}
              showSizeChanger={false}
            />
          </div>
        </div>
      )}
    </Modal>
  );
}
