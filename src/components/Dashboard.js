import { Routes, Route } from "react-router-dom";
import Summary from "./Summary";
import Orders from "./Orders";
import Holdings from "./Holdings";
import Funds from "./Funds";
import Settings from "./Setting";
import WatchListComponent from "./WatchListComponent";
import AuthLayout from "./AuthLayout";
import { useAuth } from "../Auth";
const DashBoard = () => {
  const { user } = useAuth();
  return (
    <div className="container-fluid dashboard">
      <div className="row dashboard-row">
        <div className="col-4" style={{ margin: "0", padding: "0" }}>
          <WatchListComponent />
        </div>
        <div className="col-8" style={{ padding: 0, margin: 0 }}>
          <div className="content">
            <Routes>
              <Route exact path="/" element={<Summary />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/holdings" element={<Holdings />} />
              <Route path="/funds" element={<Funds />} />
              <Route path="/settings" element={<Settings />} />
              {!user && <Route path="/login" element={<AuthLayout />} />}
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
