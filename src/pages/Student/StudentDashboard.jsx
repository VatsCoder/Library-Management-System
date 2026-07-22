import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import DashboardLayout from "../../components/DashboardLayout";
import Statscard from "../../components/Statscard";
import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function StudentDashboard() {
    const data = JSON.parse(localStorage.getItem('user'));
    const [Issue, setIssue] = useState('')
    useEffect(async() => {
        await api.get(`/getissue/${data.id}`).then((res)=>{
            setIssue(res.data)
        })
    }, [])
    return(
        <>
        <DashboardLayout role = "student">
            <div>STUDENT PORTAL</div>
            <h2>Welcome back, {data.name}</h2>
            <div>A snapshot of the collection and active loans.</div>
            <div className="admin-cards student-stats">
                <Statscard title="BOOKS ISSUED" icon="📚" value={Issue.issued}></Statscard>
                <Statscard title="OVERDUE" icon="📦" value={Issue.overdue}></Statscard>
                <Statscard title="OUTSTANDING FINE" icon="➜" value={`₹${Issue.totalFine}`}></Statscard>
                <Statscard title="TOTAL BORROWED (EVER)" icon="⏰" value={Issue.borrowed}></Statscard>
            </div>
        </DashboardLayout>
        </>
    );

};