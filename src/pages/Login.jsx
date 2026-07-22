import { Link } from "react-router";
import Sidepart from "../components/Sidepart";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import api from "../api/axios";

export default function Login() {
    const navigate = useNavigate();
    const [form, setform] = useState({'email':'','pass':''})
    const [loading, setloading] = useState(false)
    function update(field,value){
        setform((f)=>({...f,[field]:value}));
    }

    function handleSubmit(e) {
        e.preventDefault();
        setloading(true);
        api.post('/auth/login',form).then((res)=>{
            localStorage.setItem(
                "token",
                res.data.token
            );
            localStorage.setItem(
                "user",
                JSON.stringify(res.data.user)
            );
            if(res.data.user.role === "admin"){
                navigate("/admin/dashboard");
            }
            else{
                navigate("/student/dashboard");
            }
        })
        .catch((err)=>{
            alert('Invalid Credentials');
        })
        .finally(()=>{
            setloading(false);
        });
    }
    return(
        <div className="login-cont">
            <Sidepart Heading="Welcome back to the stacks." Para="Sign in to see whats's due,browse the catalog,or manage the desk."></Sidepart>
            <section className="tile-2">
                <div>
                    <h4>Sign in</h4>
                    <h2>Access your account</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="Email">Email</label>
                    <input type="email" value={form.email} onChange={(e)=>update('email',e.target.value)} name="email" className="log-cont" placeholder="you@gmail.com"/>
                    <label htmlFor="pass">Password</label>
                    <input type="password" value={form.pass} onChange={(e)=>update('pass',e.target.value)} name="pass"  className="log-cont" placeholder="••••••••"/>
                    {/* <label htmlFor="role">Sign in as</label> */}
                    {/* <select id="cars" value={form.role} onChange={(e)=>update('role',e.target.value)} name="role" className="log-cont">
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                    </select> */}
                    <button type="submit" className="log-cont log-btn" disabled={loading}>Sign in</button>
                </form>
                <div>
                    Don't have an account? <Link to="/register" className="register">Create one</Link>
                </div>
            </section>
        </div>
    );

};
