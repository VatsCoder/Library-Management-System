import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import { useState, useEffect } from "react";

export default function ReturnBooks(params) {
    const [Returned, setReturned] = useState([])
    const [search, setsearch] = useState('')

    function loadissuedbooks(params) {
        api.get('/getissue').then((res) => {
            setReturned(res.data.issuedbooks)
        }).catch((err) => {
            alert('Retry');
        });
    }

    const filtered = Returned.filter((i)=>
        i.book.title.toLowerCase().includes(search.toLowerCase()) ||
        i.student.name.toLowerCase().includes(search.toLowerCase())
    );
    async function handleReturn(issue) {
        if(!confirm('Mark return this book?')) return;
        try {
            api.put(`/return/${issue._id}`)
            loadissuedbooks();
        } catch (err) {
            alert('Retry')
        }
    }
    async function handleDelete(id) {
        if(!confirm('Are you sure want to delete?')) return;
        try {
            await api.delete(`/return/${id}`)
            loadissuedbooks();
        } catch (err) {
            alert('Retry');
        }
    }
    useEffect(loadissuedbooks, [])

    return(
        <DashboardLayout role="admin" onSearch={setsearch}>
            <div className="page-header">
                <div>
                    <span className="lib-dash-title">Librarian Console</span>
                    <h1>Return Books</h1>
                    <span>All currently issued and overdue books.</span>
                </div>
            </div>
                <div className="card">
                    <div className="table-wrap">
                        {Returned.length===0? (<div>No issue books</div>) :
                    <table className="data-table">
                        <thead>
                            <tr><th>BOOK</th><th>STUDENT</th><th>ISSUED</th><th>STATUS</th><th>FINE</th><th></th></tr>
                        </thead>
                        <tbody>
                            {filtered.map((i)=>(
                            <tr key={i._id}>
                                <td>{i.book?.title || 'Unknown'}</td>
                                <td>{i.student?.name || 'Unknown'}</td>
                                <td><span>{i.issueDate.split('T')[0]}</span></td>
                                <td><span>{i.status}</span></td>
                                <td><span>{i.fine}</span></td>
                                <td>
                                    <div className="power-btn">
                                        <button className="retun-btn" onClick={()=>handleReturn(i)} disabled={i.status==='returned'?true:false}>{i.status === 'issued' || i.status === 'overdue' ? 'Mark Returned':'Returned'}</button>
                                        <button onClick={()=>handleDelete(i._id)}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
}
                    </div>
                </div>
        </DashboardLayout>
    );
};