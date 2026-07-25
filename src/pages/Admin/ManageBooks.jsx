import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";
import Addcard from "../../components/Addcard";
import Modal from "../../components/Modal";

export default function ManageBooks() {
    const [Books, setBooks] = useState([]);
    const [loading, setloading] = useState(false);
    const [search, setsearch] = useState('');
    const [error, seterror] = useState('')
    const [showAddForm, setShowAddForm] = useState(false);
    const [editBook, seteditBook] = useState(null);
    

    function loadbook() {
        setloading(true);
        api.get('/books')
        .then((res) => {
            setBooks(res.data.books);
        }).catch((err) => setError(err.response?.data?.message || 'Failed to load books'))
        .finally(()=>setloading(false));
    }
    function onEditclick(book) {
        seteditBook(book);
        setShowAddForm(true);        
    }
    useEffect(loadbook,[])
    const filtered = Books.filter((s)=>
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.isbn.toLowerCase().includes(search.toLowerCase()) ||
        s.author.toLowerCase().includes(search.toLowerCase())
    );
    async function handleDelete(id) {
        if(!confirm('Remove this record')) return;
        try {
            await api.delete(`/books/${id}`);
            loadBooks();
            } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete book');
        }       
    }
    return(
        <DashboardLayout role="admin" onSearch={setsearch} searchPlaceholder="Search title, author, ISBN…">
            <div className="page-header">
                <div>
                    <span className="lib-dash-title">Librarian Console</span>
                    <h2>Library Overview</h2>
                </div>
                <button className="addbook-btn" onClick={() => setShowAddForm(true)}>+ Add Book</button>
            </div>
             {error && <div className="alert alert-error">{error}</div>}
                <div className="mngbk card">
                    {loading ? (
                        <p>Loading</p>
                    ):(
                    <div className="table-wrap">
                    <table className="data-table">
                        <thead>
                            <tr><th>TITLE</th><th>AUTHOR</th><th>CALL NO.</th><th>CATEGORY</th><th>COPIES</th><th>AVAILABLE</th><th></th></tr>
                        </thead>
                        <tbody>
                            {filtered.map((s)=>(
                            <tr key={s._id}>
                                <td>{s.title}</td>
                                <td>{s.author}</td>
                                <td><span>{s.callNumber}</span></td>
                                <td><span>{s.category}</span></td>
                                <td><span>{s.totalCopies}</span></td>
                                <td><span>{s.availableCopies}</span></td>
                                <td>
                                    <div className="power-btn">
                                        <button onClick={()=>onEditclick(s)}>Edit</button>
                                        <button onClick={()=>handleDelete(s._id)}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                    )}
                </div>
                {showAddForm && (
                    <Modal title={editBook?'Edit Book':'Add Book'} onClose={() => setShowAddForm(false)}>
                    <Addcard
                        book={editBook}
                        onClose={() => setShowAddForm(false)}
                        onBookAdded={loadbook}
                    />
                    </Modal>
                )}
        </DashboardLayout>
    );
};