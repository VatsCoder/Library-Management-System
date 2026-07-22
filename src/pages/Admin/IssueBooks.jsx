import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../api/axios";

export default function IssueBooks() {
    const [form, setform] = useState({ bookId: "", studentId: "", dueDate: "" })
    const [Books, setBooks] = useState([])
    const [Students, setStudents] = useState([])
    const [Success, setSuccess] = useState('')
    const [error, seterror] = useState('')
    function update(field, value) {
        setform((f) => ({ ...f, [field]: value }))
    }
    async function handleSubmit(e) {
        e.preventDefault();
        seterror('');
        setSuccess('');
        api.post('/issue', form).then((res) => {
            setSuccess("Book issued successfully");
            setform({ bookId: '', studentId: '', dueDate: '' });
        }).catch((err) => {
            seterror(err.response?.data?.message || 'Could not issue book');
        });

    }
    useEffect(() => {
        api.get('/books').then((res) => {
            setBooks(res.data.books);
        }).catch((err) => {
            alert('Retry');
        });
        api.get('/users').then((res) => {
            setStudents(res.data.users)
        }).catch((err) => {
            alert('Retry')
        });
    }, [])

    const selectedBook = Books.find((b) => b._id === form.bookId);
    const selectedStudent = Students.find((s) => s._id === form.studentId);

    return (
        <DashboardLayout role="admin" searchPlaceholder="Search title, author, ISBN…">
            <div className="lib-dash-title">Librarian Console</div>
            <h2>Issue Books</h2>
            <div className="lib-dash-dscpt">Hand a book to a student and set its due date.</div>
            <div className="issuebook-cont">
                <div className="issuebook-form">
                    <form method="post" onSubmit={handleSubmit}>
                        {Success && <div className="alert alert-success">{Success}</div>}
                        {error && <div className="alert alert-error">{error}</div>}
                        <label htmlFor="Book">Book</label>

                        <select value={form.bookId} placeholder="Select a book..." onChange={(e) => update('bookId', e.target.value)} required>
                            <option value="">Select book</option>
                            {Books.filter((b) => b.availableCopies > 0).map((b) =>
                                <option value={b._id} key={b._id}>
                                    {b.title}
                                </option>
                            )}
                        </select>

                        <label htmlFor="Student">Student</label>

                        <select value={form.studentId} placeholder="Select a student..." onChange={(e) => update('studentId', e.target.value)} required>
                            <option value="">Select student</option>
                            {Students.filter((s) => s.status === 'active').map((s) => (
                                <option value={s._id} key={s._id}>{s.name} - {s.rollNo}</option>
                            ))}
                        </select>

                        <label htmlFor="duedate">Due date</label>

                        <input type="date" onChange={(e) => update('dueDate', e.target.value)} value={form.dueDate} required />
                        <button type="submit">Issue book</button>
                    </form>
                </div>
                <div className="card">
                    <h3 className="mb-16">Preview</h3>
                    {selectedBook && selectedStudent && form.dueDate? (<div>
                        <div className="form-group">
                            <label>Book</label>
                            <p><strong>{selectedBook.title}</strong></p>
                            <span className="catalog-tag">{selectedBook.callNumber}</span>
                        </div>
                        <div className="form-group">
                            <label>Student</label>
                            <p><strong>{selectedStudent.name}</strong> — {selectedStudent.rollNo}</p>
                        </div>
                        <div className="form-group">
                            <label>Due date</label>
                            <span className="stamp ok">{form.dueDate}</span>
                        </div>
                    </div>) : (<div className="empty-state">
                        <div className="icon">➜</div>
                        Choose a book and a student to preview the issue slip.
                    </div>)}
                </div>
            </div>
        </DashboardLayout>
    );
};