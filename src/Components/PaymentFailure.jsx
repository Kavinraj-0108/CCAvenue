import { useSearchParams } from "react-router-dom";

const PaymentFailure = () => {

    // CCAvenue backend redirects here with query strings, e.g.:
    // /payment-failure?order_id=ORD_123&status=Failure&reason=Payment+declined
    const [searchParams] = useSearchParams();

    const orderId = searchParams.get("order_id") || "N/A";
    const status = searchParams.get("status") || "Failed";
    const reason = searchParams.get("reason") || "Your payment could not be processed.";

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            background: "linear-gradient(135deg, #fff0f0, #fff5f5)",
            fontFamily: "Inter, sans-serif",
            padding: "20px",
        }}>
            <div style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "48px 40px",
                maxWidth: "480px",
                width: "100%",
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                textAlign: "center",
            }}>
                {/* Failure Icon */}
                <div style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "50%",
                    background: "#ef4444",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    fontSize: "36px",
                    color: "#fff",
                    fontWeight: "bold",
                }}>
                    ✕
                </div>

                <h2 style={{ color: "#dc2626", fontSize: "24px", marginBottom: "8px" }}>
                    Payment Failed
                </h2>
                <p style={{ color: "#6b7280", marginBottom: "32px", fontSize: "15px" }}>
                    Unfortunately, your payment could not be completed.
                </p>

                {/* Failure Details */}
                <div style={{
                    background: "#fef2f2",
                    borderRadius: "10px",
                    padding: "20px",
                    textAlign: "left",
                }}>
                    <DetailRow label="Order ID" value={orderId} />
                    <DetailRow label="Status" value={status} />
                    <DetailRow label="Reason" value={decodeURIComponent(reason)} last />
                </div>

                <button
                    onClick={() => window.location.href = "/"}
                    style={{
                        marginTop: "28px",
                        background: "#ef4444",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "12px 32px",
                        fontSize: "15px",
                        cursor: "pointer",
                        fontWeight: "600",
                    }}
                >
                    Try Again
                </button>
            </div>
        </div>
    );
};

// Helper row component
const DetailRow = ({ label, value, last }) => (
    <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 0",
        borderBottom: last ? "none" : "1px solid #fecaca",
        gap: "12px",
    }}>
        <span style={{ color: "#6b7280", fontSize: "14px", fontWeight: "500", flexShrink: 0 }}>
            {label}
        </span>
        <span style={{
            color: "#111827",
            fontSize: "14px",
            fontWeight: "600",
            textAlign: "right",
            wordBreak: "break-all",
        }}>
            {value}
        </span>
    </div>
);

export default PaymentFailure;