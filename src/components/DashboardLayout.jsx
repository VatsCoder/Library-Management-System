import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({children ,role, onSearch}) {
    return(
        <div className="app-shell">
            <Sidebar role = {role} />
            <div className="main-page">
                <Topbar onSearch={onSearch} />
                <main className="page-content">{children}</main>
            </div>
        </div>
    );
};
