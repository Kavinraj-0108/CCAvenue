import { State, City } from "country-state-city";
import "./PaymentForm.css";
import { useState } from "react";
import axios from "axios";

const PaymentForm = () => {

    const [loading, setLoading] = useState(false);
    const [totalAmount, setTotalAmount] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        mobileNumber: "",
        email: "",
        state: "",
        city: "",
        pinCode: "",
        country: "India",
        gstDetails: "",
        amount: "",
        terms: false,
    });

    const [errors, setErrors] = useState({});

    const states = State.getStatesOfCountry("IN");
    const cities = City.getCitiesOfState("IN", formData.state);

    // ✅ Handle Amount + GST
    const handleAmountChange = (e) => {
        const amount = Number(e.target.value);

        if (!amount) {
            setTotalAmount("");
            setFormData({ ...formData, amount: "" });
            return;
        }

        const gst = amount * 0.18;
        const total = amount + gst;

        setTotalAmount(total.toFixed(2));

        setFormData(prev => ({
            ...prev,
            amount: amount
        }));
    };

    // ✅ Validation
    const validateForm = () => {
        let errors = {};

        if (!formData.name.trim()) errors.name = true;

        if (!/^[6-9]\d{9}$/.test(formData.mobileNumber))
            errors.mobileNumber = true;

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            errors.email = true;

        if (!formData.state) errors.state = true;
        if (!formData.city) errors.city = true;
        if (!/^\d{6}$/.test(formData.pinCode))
            errors.pinCode = true;

        if (!formData.amount) errors.amount = true;
        if (!formData.terms) errors.terms = true;

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const getInputClass = (field) =>
        errors[field] ? "form-input error-border" : "form-input";

    // ✅ Correct Payment Flow
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setLoading(true);

            // 1️⃣ Create User
            const userRes = await axios.post(
                "http://localhost:5000/api/users",
                { ...formData, amount: totalAmount }
            );

            const userId = userRes.data._id;

            // 2️⃣ Initiate Payment
            const paymentRes = await axios.post(
                `http://localhost:5000/api/payment/initiate/${userId}`
            );

            const { encRequest, accessCode } = paymentRes.data;

            // 3️⃣ Submit to CCAvenue
            const form = document.createElement("form");
            form.method = "POST";
            form.action =
                "https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction";

            const encInput = document.createElement("input");
            encInput.type = "hidden";
            encInput.name = "encRequest";
            encInput.value = encRequest;

            const accessInput = document.createElement("input");
            accessInput.type = "hidden";
            accessInput.name = "access_code";
            accessInput.value = accessCode;

            form.appendChild(encInput);
            form.appendChild(accessInput);

            document.body.appendChild(form);
            form.submit();

        } catch (error) {
            console.error("Payment initiation error:", error);
            alert("Payment failed. Please check backend or credentials.");
            setLoading(false);
        }
    };

    return (
        <div className="main-container">
            <div className="left-section">
                <div className="profile-wrapper">
                    <img
                        src="https://via.placeholder.com/220"
                        alt="Profile"
                        className="profile-img"
                    />
                </div>
                <h2 className="brand-name">Finwallet</h2>
            </div>

            <div className="right-section">
                <h1>Payment Form</h1>

                <form onSubmit={handleSubmit}>

                    {/* Name */}
                    <div className="form-group">
                        <label>Name *</label>
                        <input
                            type="text"
                            className={getInputClass("name")}
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                        />
                    </div>

                    {/* Mobile */}
                    <div className="form-group">
                        <label>Mobile *</label>
                        <input
                            type="text"
                            className={getInputClass("mobileNumber")}
                            value={formData.mobileNumber}
                            onChange={(e) =>
                                setFormData({ ...formData, mobileNumber: e.target.value })
                            }
                        />
                    </div>

                    {/* Email */}
                    <div className="form-group">
                        <label>Email *</label>
                        <input
                            type="email"
                            className={getInputClass("email")}
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                            }
                        />
                    </div>

                    {/* State */}
                    <div className="form-group">
                        <label>State *</label>
                        <select
                            value={formData.state}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    state: e.target.value,
                                    city: "",
                                })
                            }
                            className={getInputClass("state")}
                        >
                            <option value="">-- Select --</option>
                            {states.map((state) => (
                                <option key={state.isoCode} value={state.isoCode}>
                                    {state.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* City */}
                    <div className="form-group">
                        <label>City *</label>
                        <select
                            value={formData.city}
                            disabled={!formData.state}
                            onChange={(e) =>
                                setFormData({ ...formData, city: e.target.value })
                            }
                            className={getInputClass("city")}
                        >
                            <option value="">-- Select --</option>
                            {cities.map((city) => (
                                <option key={city.name} value={city.name}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Pincode */}
                    <div className="form-group">
                        <label>Pincode *</label>
                        <input
                            type="text"
                            className={getInputClass("pinCode")}
                            value={formData.pinCode}
                            onChange={(e) =>
                                setFormData({ ...formData, pinCode: e.target.value })
                            }
                        />
                    </div>

                    {/* Country */}
                    <div className="form-group">
                        <label>Country</label>
                        <input type="text" value="India" readOnly />
                    </div>

                    {/* GST */}
                    <div className="form-group">
                        <label>GST Details</label>
                        <textarea
                            value={formData.gstDetails}
                            onChange={(e) =>
                                setFormData({ ...formData, gstDetails: e.target.value })
                            }
                        />
                    </div>

                    {/* Amount */}
                    <div className="form-group">
                        <label>Amount *</label>
                        <select
                            value={formData.amount}
                            onChange={handleAmountChange}
                            className={getInputClass("amount")}
                        >
                            <option value="">-- Select --</option>
                            <option value="5000">5000 + GST</option>
                            <option value="15000">15000 + GST</option>
                            <option value="25000">25000 + GST</option>
                        </select>
                    </div>

                    {/* Terms */}
                    <div className="terms">
                        <input
                            type="checkbox"
                            checked={formData.terms}
                            onChange={(e) =>
                                setFormData({ ...formData, terms: e.target.checked })
                            }
                        />
                        <span>I accept Terms & Conditions</span>
                    </div>

                    {/* Total */}
                    <div className="pay-now-container">
                        <input
                            type="text"
                            value={totalAmount}
                            readOnly
                            className="total-amt"
                        />

                        <button type="submit" disabled={loading}>
                            {loading ? "Processing..." : "Pay Now"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default PaymentForm;