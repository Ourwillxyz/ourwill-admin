import jwt from "jsonwebtoken";
import cookie from "cookie";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body;

  if (email === "admin@ourwill.xyz" && password === "OurWill2027") {
    const token = jwt.sign({ email }, "your_secret_key", {
      expiresIn: "2h",
    });

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 2 * 60 * 60,
        path: "/",
      })
    );

    return res.status(200).json({ message: "Login successful" });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
}
