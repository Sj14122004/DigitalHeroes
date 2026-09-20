import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./admin/AdminRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Scores from "./pages/Scores";
import Subscription from "./pages/Subscription";
import SubscriptionStatus from "./pages/SubscriptionStatus";
import Charity from "./pages/Charity";
import Draw from "./pages/Draw";
import Winnings from "./pages/Winnings";
import AdminDashboard from "./admin/AdminDashboard";
import AdminLayout from "./admin/AdminLayout";
import Winners from "./admin/Winners";
import Payments from "./admin/Payments";
import Users from "./admin/Users";
import Charities from "./admin/Charities";
import DrawManagement from "./admin/DrawManagement";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import SubscriptionCancel from "./pages/SubscriptionCancel";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/charity" element={<Charity />} />
          <Route path="/draw" element={<Draw />} />
          <Route path="/subscription/success" element={<SubscriptionSuccess />} />
          <Route path="/subscription/cancel" element={<SubscriptionCancel />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/scores" element={<Scores />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/subscription/status" element={<SubscriptionStatus />} />
            <Route path="/winnings" element={<Winnings />} />
          </Route>
        </Route>

        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/charities" element={<Charities />} />
            <Route path="/admin/draw" element={<DrawManagement />} />
            <Route path="/admin/winners" element={<Winners />} />
            <Route path="/admin/payments" element={<Payments />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;