import { URL } from "./Urls";
import axios from "./axios";
export const HandleRazorpayPyment = async (PaymentData) => {
  
  try {
    let key = await axios.get("/getKey");
    key = key.data.key;
   

    const { data } = await axios.post("/Checkout", PaymentData);
    const txnId = data.id;

    const options = {
      key, // Enter the Key ID generated from the Dashboard
      amount: data.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: "AIFER EDUCATION PVT LTD",
      description: PaymentData.featured_title,
      image:
        "https://play-lh.googleusercontent.com/LO6D3ZFg2LFK6zmef0T-kvmNhrlo4RiTviRMXkRjB4JZO6Bwg4VnjMTsUNz0-bHSgw",
      order_id: txnId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      callback_url: `${URL}/api/emo/paymentVerification/${PaymentData.mobile}`,
      prefill: {
        name: PaymentData.name,
        email: PaymentData.email,
        contact: PaymentData.mobile,
      },
      method: {
        upi: true,     // Enable UPI
        card: true,    // Enable Card
        netbanking: false,
        wallet: false,
        emi: false,
        paylater: false
      },
      theme: {
        color: "#244c9c",
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  } catch (err) {
    console.log(err); 
  }
};
