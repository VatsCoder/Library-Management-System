import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import DashboardLayout from "../../components/DashboardLayout";
import Statscard from "../../components/Statscard";
import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function AdminDashboard() {
    const [books, setbooks] = useState([])
    const [issue, setissue] = useState([])
    useEffect(() => {
        Promise.all(
            [api.get('/books'),
            api.get('/getissue'),]
        ).then(([booksRes, issueRes])=>{
            setbooks(booksRes.data.books)
            setissue(issueRes.data.issuedbooks)
        })
    }, [])
    
    const totalcatalog = books.length;
    const totalcopies = books.reduce((sum,b)=>sum+b.totalCopies,0)
    const booksissued = issue.filter((i)=>i.status!='returned').length
    const totaloverdue = issue.filter((i)=> i.status='overdue').length
    return(
        <>
        <DashboardLayout role = "admin">
            <div className="lib-dash-title">Librarian Console</div>
            <h2>Library Overview</h2>
            <div className="lib-dash-dscpt">A snapshot of the collection and active loans.</div>
            <div className="admin-cards">
                <Statscard title="TITLES IN CATALOG" icon="📚" value={totalcatalog}></Statscard>
                <Statscard title="TOTAL COPIES" icon="📦" value={totalcopies}></Statscard>
                <Statscard title="BOOKS ISSUED" icon="➜" value={booksissued}></Statscard>
                <Statscard title="OVERDUE" icon="⏰" value={totaloverdue}></Statscard>
            </div>
            <div className="grid grid-2">
                <div className="card">
                    <div className="card-title-row"><h3>Recently issued</h3></div>
                    <div className="table-wrap">
                    <table className="data-table">
                        <thead>
                            <tr><th>Book</th><th>Student</th><th>Status</th></tr>
                        </thead>
                        <tbody>
                            {issue.slice(0,5).map((i)=>(
                            <tr key={i._id}>
                                <td>{i.book.title}</td>
                                <td>{i.student.name}</td>
                                <td><span>{i.status}</span></td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                </div>

                <div className="card">
                    <div className="card-title-row"><h3>Low availability</h3></div>
                    <div className="table-wrap">
                        <table className="data-table">
                            <thead>
                                <tr><th>Title</th><th>Call No.</th><th>Available</th></tr>
                            </thead>
                            <tbody>
                                {books.filter((b)=>b.availableCopies<=10).map((b)=>(
                                <tr key={b._id}>
                                    <td>{b.title}</td>
                                    <td><span className="catalog-tag">{b.callNumber}</span></td>
                                    <td>
                                    <span>
                                        {b.availableCopies}
                                    </span>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
        </>
    );

};
