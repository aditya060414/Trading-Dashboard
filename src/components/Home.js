import { useAuth } from "../Auth";
import TopBar from "./TopBar";
import DashBoard from "./Dashboard";

export default function Home() {
  const { theme, toggleTheme } = useAuth();
  const dark = theme === "dark";

  return (
    <>
      <div className="home-container">
        <TopBar dark={dark} handleTheme={toggleTheme} />
        <DashBoard />
      </div>
    </>
  );
}
