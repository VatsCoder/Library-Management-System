import { NavLink } from "react-router";

export default function Sidebar({ role }) {
    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }
    return(
        <div className="Side-cont">
            <aside className="Sidebar">
                <div className="sidebar-header">
                    <h2>📗 Athenaeum</h2>
                    <span>{role === 'admin'? 'LIBRARIAN CONSOLE' : 'STUDENT PORTAL'}</span>
                </div>
                <div className="side-navcont">
                    <span>Menu</span>
                    {
                        role === 'admin' ? (
                        <>
                        <ul>
                            <NavLink to="/admin/dashboard" className={({isActive})=>'nav-item'+(isActive?' active':'')} end={true}><li>⌂ Dashboard</li></NavLink>
                            <NavLink to="/managebooks" className={({isActive})=>'nav-item'+(isActive?' active':'')}><li>📚 Manage Books</li></NavLink>
                            <NavLink to="/managestudents" className={({isActive})=>'nav-item'+(isActive?' active':'')}><li>🎓 Manage Students</li></NavLink>
                            <NavLink to="/issue" className={({isActive})=>'nav-item'+(isActive?' active':'')}><li>➜ Issue Books</li></NavLink>
                            <NavLink to="/returnbook" className={({isActive})=>'nav-item'+(isActive?' active':'')}><li>↺ Return Books</li></NavLink>
                        </ul>
                        </>
                        ) : (
                            <>
                            <ul>
                                <NavLink to="/student/dashboard" className={({isActive})=>'nav-item'+(isActive?' active':'')}><li> ⌂ Dashboard</li>
                                </NavLink>
                                <NavLink to="/mybooks" className={({isActive})=>'nav-item'+(isActive?' active':'')}><li>📚 My Books</li>
                                </NavLink>
                                <NavLink to="/history" className={({isActive})=>'nav-item'+(isActive?' active':'')}><li>🎓 History</li>
                                </NavLink>
                                <NavLink to="/profile" className={({isActive})=>'nav-item'+(isActive?' active':'')}><li>➜  Profile</li>
                                </NavLink>
                        </ul>
                            </>
                        )
                    }
                    
                </div>
                <div className="bottom-btn">
                    <button onClick={logout}>
                        Sign Out
                    </button>
                </div>
            </aside>
        </div>
    );
};
