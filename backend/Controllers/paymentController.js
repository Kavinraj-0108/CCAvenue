const qs = require("querystring");
const { encrypt, decrypt } = require("../Utils/ccavutils");
const User = require("../Models/User");
const Payment = require("../Models/Payment");

const merchantId = process.env.CCAVENUE_MERCHANT_ID;
const accessCode = process.env.CCAVENUE_ACCESS_CODE;
const workingKey = process.env.CCAVENUE_WORKING_KEY;

const BACKEND_URL = process.env.BACKEND_URL;
const FRONTEND_URL = process.env.FRONTEND_URL;

const checkCredentials = () => {
  if (!merchantId || !accessCode || !workingKey) {
    throw new Error("Missing CCAvenue credentials in .env");
  }
};

exports.initiatePayment = async (req, res) => {
  try {
    checkCredentials();

    const user = await User.findById(req.params.id);
    if (!user || user.amount <= 0) {
      return res.status(400).json({ message: "Invalid user or amount" });
    }

    const orderId = "ORD_" + Date.now();
    user.orderId = orderId;
    await user.save();

    const paymentParams = {
      merchant_id: merchantId,
      order_id: orderId,
      currency: "INR",
      amount: parseFloat(user.amount).toFixed(2),
      redirect_url: `${BACKEND_URL}/api/payment/response`,
      cancel_url: `${BACKEND_URL}/api/payment/response`,
    };

    const plainData = qs.stringify(paymentParams);
    const encRequest = encrypt(plainData, workingKey);

    return res.json({ encRequest, accessCode });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.paymentResponse = async (req, res) => {
  try {
    checkCredentials();

    const encResp = req.body.encResp;
    if (!encResp) return res.status(400).send("Missing response");

    const decrypted = decrypt(encResp, workingKey);
    const responseData = qs.parse(decrypted);

    if (responseData.merchant_id !== merchantId) {
      throw new Error("Merchant mismatch");
    }

    const user = await User.findOne({ orderId: responseData.order_id });
    if (!user) {
      return res.redirect(`${FRONTEND_URL}/payment-failure`);
    }

    await Payment.create({
      userId: user._id,
      orderId: responseData.order_id,
      amount: responseData.amount,
      status: responseData.order_status,
      trackingId: responseData.tracking_id,
      bankRefNo: responseData.bank_ref_no,
      rawResponse: responseData,
    });

    if (responseData.order_status === "Success") {
      user.status = "approved";
      user.trackingId = responseData.tracking_id;
      user.bankRefNo = responseData.bank_ref_no;
      await user.save();

      return res.redirect(`${FRONTEND_URL}/payment-success`);
    } else {
      user.status = "rejected";
      await user.save();

      return res.redirect(`${FRONTEND_URL}/payment-failure`);
    }

  } catch (error) {
    return res.redirect(`${FRONTEND_URL}/payment-failure`);
  }
};