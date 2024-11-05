import { Outlet } from "react-router-dom";
import AppNav from "../AppNav";
import Logo from "../Logo";
import SidebarFooter from "../SidebarFooter";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav />
      <Outlet />
      <SidebarFooter />
    </div>
  );
};

export default Sidebar;
