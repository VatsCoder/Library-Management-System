import DashboardLayout from "../../components/DashboardLayout";
import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function ManageStudents(params) {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    function loadstudents() {
        setLoading(true);
        api.get('/users')
        .then((res)=>setStudents(res.data.users))
        .catch((err) => setError(err.response?.data?.message || 'Failed to load students'))
        .finally(()=>setLoading(false));
    }
    useEffect(loadstudents, []);
    const filtered = students.filter((s)=>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(search.toLowerCase())
    );
    async function toggleStatus(student) {
        const newStatus = student.status === 'active'?'blocked':'active';
        api.put(`/users/${student._id}`, {status:newStatus});
        loadstudents();
    }
    async function handleDelete(id) {
        if(!confirm('Remove this record')) return;
        await api.delete(`/users/${id}`);
        loadstudents();
    }
    return(
        <DashboardLayout role="admin" onSearch={setSearch}>
            <div className="page-header">
                <div>
                    <span className="lib-dash-title">Librarian Console</span>
                    <h1>Manage Students</h1>
                </div>
                <button className="addbook-btn">+ Add Student</button>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
                <div className="card">
                     {loading ? (
                        <p>Loading…</p>
                        ) : (
                    <div className="table-wrap">
                        {students.length===0?(<div>No student found.</div>):(
                        <table className="data-table">
                            <thead>
                                <tr><th>NAME</th><th>ROLL NO.</th><th>DEPARTMENT</th><th>BOOK ISSUED</th><th>STATUS</th><th></th></tr>
                            </thead>
                            <tbody>
                            {filtered.map((s)=>(
                                <tr key={s._id}>
                                    <td>{s.name}</td>
                                    <td>{s.rollNo}</td>
                                    <td><span>{s.department}</span></td>
                                    <td><span>{s.booksIssued}</span></td>
                                    <td><span>{s.status}</span></td>
                                    <td>
                                        <div className="power-btn">
                                            <button onClick={()=>toggleStatus(s)}>{s.status === 'active' ? 'Block' : 'Unblock'}</button>
                                            <button onClick={()=>handleDelete(s._id)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                        )}
                    </div>
                    )}
                </div>
        </DashboardLayout>
    );
};