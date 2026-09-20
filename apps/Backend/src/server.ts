import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "./config/passport";
import authRoute from "./routes/authRoute";
import scoreRoute from "./routes/scoreRoute";
import charityRoute from "./routes/charityRoute";
import adminCharityRoute from "./routes/adminCharityRoute";
import subscriptionRoute from "./routes/subscriptionRoute";
import winnerRoute from "./routes/winnerRoute";
import adminWinnerRoute from "./routes/adminWinnerRoute";
import adminPaymentRoute from "./routes/adminPaymentRoute";
import adminUserRoute from "./routes/adminUserRoute";
import drawRoute from "./routes/drawRoute";
import { webhook } from "./controllers/subscriptionController";
import errorHandler from "./middleware/errorHandler";

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Digital Heroes API is running"
  });
});

app.post(
  "/api/subscriptions/webhook",
  express.raw({ type: "application/json" }),
  webhook
);

app.use(express.json());

app.use(passport.initialize());

app.use("/api/auth", authRoute);
app.use("/api/scores", scoreRoute);
app.use("/api/charities", charityRoute);
app.use("/api/admin/charities", adminCharityRoute);
app.use("/api/subscriptions", subscriptionRoute);
app.use("/api/winners", winnerRoute);
app.use("/api/admin/winners", adminWinnerRoute);
app.use("/api/admin/payments", adminPaymentRoute);
app.use("/api/admin/users", adminUserRoute);
app.use("/api/draws", drawRoute);

app.use(errorHandler);

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});