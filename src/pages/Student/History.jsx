import api from "../../api/axios";
import DashboardLayout from "../../components/DashboardLayout";
import { useEffect, useState } from "react";

export default function History(params) {
    const id = JSON.parse(localStorage.getItem('user')).id;
    const [loading, setloading] = useState(null)
    const [History, setHistory] = useState([])
    useEffect(()=>{
        api.get(`/getissue/${id}`).then((res) => {
            setHistory(res.data.history);
        }).catch((err) => {
            
        });
    },[])
    return(
        <DashboardLayout role="student">
            <div className="lib-dash-title">STUDENT PORTAL</div>
            <h2>Borrowing History</h2>
            <div className="lib-dash-dscpt">Every book you've issued, returned, or currently hold.</div>
            <div className="card">
                    {loading ? (
                        <p>Loading</p>
                    ):(
                    <div className="table-wrap">
                    <table className="data-table">
                        <thead>
                            <tr><th>BOOK</th><th>ISSUED</th><th>DUE</th><th>RETURNED</th><th>FINE</th><th>STATUS</th></tr>
                        </thead>
                        <tbody>
                            {History.map((h)=>(
                            <tr key={h._id}>
                                <td>{h.book.title}</td>
                                <td>{h.issueDate.split('T')[0]}</td>
                                <td><span>{h.dueDate.split('T')[0]}</span></td>
                                <td><span>{h.returnDate===null?'-':h.returnDate}</span></td>
                                <td><span>{h.fine}</span></td>
                                <td><span>{h.status}</span></td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                    )}
                </div>
        </DashboardLayout>
    )    
};
