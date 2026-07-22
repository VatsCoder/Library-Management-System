import api from "../../api/axios";
import DashboardLayout from "../../components/DashboardLayout";
import { useEffect, useState } from "react";

export default function MyBooks() {
    const [mybooks, setmybooks] = useState([])
    const [error, seterror] = useState('')
    const id= JSON.parse(localStorage.getItem('user')).id;
    const [loading, setloading] = useState(null)
    useEffect(() => {
        setloading(true);
        api.get(`/getissue/${id}`).then((res) => {
            setmybooks(res.data.mybooks)
            setloading(false)
        }).catch((err) => {
            seterror(err.response?.data?.message || 'Can not load retry')
        });
    }, [])
    
    return(
        <DashboardLayout role="student">
            <div className="lib-dash-title">STUDENT PORTAL</div>
            <h2>My Books</h2>
            <div className="card">
                    {loading ? (
                        <p>Loading</p>
                    ):(
                    <div className="table-wrap">
                    <table className="data-table">
                        <thead>
                            <tr><th>BOOK</th><th>CALL NO.</th><th>ISSUED ON</th><th>STATUS</th></tr>
                        </thead>
                        <tbody>
                            {mybooks.map((b)=>(
                            <tr key={b._id}>
                                <td>{b.book.title}</td>
                                <td>{b.book.callNumber}</td>
                                <td><span>{b.issueDate.split('T')[0]}</span></td>
                                <td><span>{b.status}</span></td>
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
