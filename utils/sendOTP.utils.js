import transporter from "../config/NodeMailer.config.js";

const sendOTP = async (email, otp) => {
  try {
    const info = await transporter.sendMail({
      from: `"Notes App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP to reset password is: ${otp}. And is valid for next 10 minutes.`,
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
  }
};

export default sendOTP;