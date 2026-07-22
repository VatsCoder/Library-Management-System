import { useEffect, useState } from "react"
import api from "../api/axios";
export default function Addcard({onClose, onBookAdded, book}) {
    const [addBook, setaddBook] = useState({"title":'',"author":'',"isbn":'',"category":'',"callNumber":'',"totalCopies":''})
    const [loading, setloading] = useState(false)

    function update(field,value){
        setaddBook((s)=>({...s,[field]:value}))
    }
    useEffect(() => {
    if (book) {
      setaddBook({
        title: book.title || '',
        author: book.author || '',
        isbn: book.isbn || '',
        category: book.category || '',
        callNumber: book.callNumber || '',
        totalCopies: book.totalCopies || '',
      });
    }
  }, [book]);
    async function handleBookSubmit(e) {
        setloading(true)
        e.preventDefault();
        if(book){
            await api.put(`/books/${book._id}`,addBook);
            setloading(false)
            onBookAdded();   // tell the parent to refresh its list
            onClose();
        }
        else{
        api.post('/books',addBook)
        .then((res)=>{
            onBookAdded();   // tell the parent to refresh its list
            onClose();
        }).catch((err)=>{
            alert('Retry');
        }).finally(()=>setloading(false));}
        
    }
    return(
        <div className="addbook-card">
            <form onSubmit={handleBookSubmit} method="post">
                    <label htmlFor="title">Title</label>

                    <input type="text" value={addBook.title} onChange={(e) => update('title',e.target.value)} name="title" className="addbook-cont" placeholder="Enter title"/>
                    
                    <label htmlFor="author">Author</label>
                    
                    <input type="text" value={addBook.author} onChange={(e) => update('author',e.target.value)} name="author" className="addbook-cont" placeholder="Enter author"/>
                    
                    <label htmlFor="isbn">ISBN</label>
                    
                    <input type="text" value={addBook.isbn} onChange={(e) => update('isbn',e.target.value)} name="isbn"  className="addbook-cont" placeholder="Enter ISBN"/>
                    
                    <label htmlFor="category">Category</label>
                    
                    <input type="text" value={addBook.category} onChange={(e) => update('category',e.target.value)} name="category"  className="addbook-cont" placeholder="Enter Category"/>
                    
                    <label htmlFor="callNumber">Call Number</label>
                    
                    <input type="text" value={addBook.callNumber} onChange={(e) => update('callNumber',e.target.value)} name="callNumber"  className="addbook-cont" placeholder="Enter call number "/>

                    <label htmlFor="totalCopies">Total Copies</label>
                    
                    <input type="number" value={addBook.totalCopies} onChange={(e) => update('totalCopies',e.target.value)} name="totalCopies"  className="addbook-cont" placeholder="Enter total copies "/>

                    <button type="submit" className="addbook-cont addbook-btn" disabled={loading}>{loading ? 'Saving…' : book ? 'Save changes' : 'Add to catalog'}</button>
            </form>
        </div>
    );
};
