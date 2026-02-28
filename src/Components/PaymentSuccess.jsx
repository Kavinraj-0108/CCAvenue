import { useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {

    const [searchParams] = useSearchParams();

    const orderId = searchParams.get("order_id") || "N/A";
    const trackingId = searchParams.get("tracking_id") || "N/A";
    const bankRefNo = searchParams.get("bank_ref_no") || "N/A";
    const amount = searchParams.get("amount") || "N/A";
    const paymentMode = searchParams.get("payment_mode") || "N/A";

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            background: "linear-gradient(135deg, #e0f7e9, #f0fff4)",
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
                {/* Success Icon */}
                <div style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "50%",
                    background: "#22c55e",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                    fontSize: "36px",
                }}>
                    ✓
                </div>

                <h2 style={{ color: "#16a34a", fontSize: "24px", marginBottom: "8px" }}>
                    Payment Successful!
                </h2>
                <p style={{ color: "#6b7280", marginBottom: "32px", fontSize: "15px" }}>
                    Thank you! Your transaction has been completed successfully.
                </p>

                {/* Payment Details Table */}
                <div style={{
                    background: "#f9fafb",
                    borderRadius: "10px",
                    padding: "20px",
                    textAlign: "left",
                }}>
                    <DetailRow label="Order ID" value={orderId} />
                    <DetailRow label="Tracking ID" value={trackingId} />
                    <DetailRow label="Bank Ref No" value={bankRefNo} />
                    <DetailRow label="Amount Paid" value={amount ? `₹ ${amount}` : "N/A"} />
                    <DetailRow label="Payment Mode" value={paymentMode} last />
                </div>

                <button
                    onClick={() => window.location.href = "/"}
                    style={{
                        marginTop: "28px",
                        background: "#22c55e",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "12px 32px",
                        fontSize: "15px",
                        cursor: "pointer",
                        fontWeight: "600",
                    }}
                >
                    Go Back to Home
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
        borderBottom: last ? "none" : "1px solid #e5e7eb",
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

export default PaymentSuccess;