import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";

export default function Profile() {
    const id = JSON.parse(localStorage.getItem('user')).id;
    const [Success, setSuccess] = useState('')
    const [error, seterror] = useState('')
    const [form, setform] = useState({name:'',rollNo:'',email:'',department:'',status:''})
    useEffect(() => {
      api.get(`/users/${id}`).then((res) => {   
        setform({
            name:res.data.user.name,
            email:res.data.user.email,
            department:res.data.user.department,
            rollNo:res.data.user.rollNo,
            status:res.data.user.status
        })
      }).catch((err) => {
        seterror(err.response?.data?.message || 'Refresh Webpage')
      });
    }, [])

    return(
        <DashboardLayout role="student">
            <div className="lib-dash-title">STUDENT PORTAL</div>
            <h2>My Profile</h2>
             <div className="issuebook-cont">
                <div className="issuebook-form">
                    <h3>Account Details</h3>
                    <form method="post">
                        {Success && <div className="alert alert-success">{Success}</div>}
                        {error && <div className="alert alert-error">{error}</div>}
                        <label htmlFor="name">Full name</label>
                        <input type="text" name="name" value={form.name} readOnly/>
                        <label htmlFor="mail">Email</label>
                        <input type="email" name="mail" value={form.email} readOnly />
                        <label htmlFor="department">Department</label>
                        <input type="text" name="department" value={form.department} readOnly/>
                        <button type="submit" disabled>Save</button>
                    </form>
                </div>
                <div className="card">
                    <h3 className="mb-16">Library Card</h3>
                    {form? (<div>
                        <div className="form-group">
                            <label>Roll Number</label>
                            <p className="rollNo">{form.rollNo}</p>
                        </div>
                        <div className="form-group">
                            <label>Student</label>
                            <p>{form.status.toUpperCase()}</p>
                        </div>
                        <div>Contact the library desk if your account is blocked or details are incorrect.</div>
                    </div>) : (<div className="empty-state">
                        <div className="icon">⟳</div>
                        Can't fetch retry...
                    </div>)}
                </div>
            </div>
        </DashboardLayout>
    );
};
