import { useState } from "react";
import Sidepart from "../components/Sidepart";
import { Link } from "react-router";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import api from "../api/axios";

export default function Register() {
    const [form, setform] = useState({name:'',email:'',pass:'',rollNo:'',department:'',role:'student'});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function update(field,value){
        setform((f)=>({...f,[field]:value}));
    }
    function handleSubmit(e){
        e.preventDefault();
        setLoading(true);
        api.post('/auth/register', form).then((response) => {
                navigate('/student/dashboard')
            })
            .catch((error) => {
                alert('Retry');
            })
            .finally(() => {
                setLoading(false);   
            });
        }
    return(
        <div className="login-cont">
            <Sidepart Heading="Get you library card in a minute." Para="One account,full access to the catalog and your borrowing record."></Sidepart>
            <section className="tile-2">
                <div>
                    <h4>Create Account</h4>
                    <h2>Join the library</h2>
                </div>
                <form onSubmit={handleSubmit} method="post">
                    <label htmlFor="name">Full name</label>

                    <input type="text" value={form.name} onChange={(e) => update('name',e.target.value)} name="name" className="log-cont" placeholder="Enter Name"/>
                    
                    <label htmlFor="Email">Email</label>
                    
                    <input type="email" value={form.email} onChange={(e) => update('email',e.target.value)} name="email" className="log-cont" placeholder="you@gmail.com"/>
                    
                    <label htmlFor="pass">Password</label>
                    
                    <input type="password" value={form.pass} onChange={(e) => update('pass',e.target.value)} name="pass"  className="log-cont" placeholder="••••••••"/>
                    
                    <label htmlFor="RollNo">Roll number</label>
                    
                    <input type="text" value={form.rollNo} onChange={(e) => update('rollNo',e.target.value)} name="rollno"  className="log-cont" placeholder="Enter Roll number"/>
                    
                    <label htmlFor="Branch">Department</label>
                    
                    <input type="text" value={form.department} onChange={(e) => update('department',e.target.value)} name="Branch"  className="log-cont" placeholder="CSE"/>

                    <button type="submit" className="log-cont log-btn" disabled={loading}>Create Account</button>
                </form>
                <div>
                    Already registered? <Link to="/login" className="register">Sign in</Link>
                </div>
            </section>
        </div>
    );
};
