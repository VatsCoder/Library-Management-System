import { useState } from "react";

export default function Topbar({onSearch}) {
    const data = JSON.parse(localStorage.getItem('user'));
    return(
    <header className="topbar">
        {onSearch ? (
            <div className="search-box">
                <input placeholder="🔎 Search book, student, or roll no..." onChange={(e)=> onSearch(e.target.value)}/>
            </div>
        ) : (
            <div />
        )}
        <div className="role-cont">
            <div className="role-info">
                <div className="role-name">{data.name}</div> 
                <div className="topbar-role">{data.role==='student'?'Student':'Administrator'}</div>
            </div>
            <div className="role-logo">{data.name.split('')[0]}</div>
        </div>
    </header>
    );
};
