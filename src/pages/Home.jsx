import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <nav className="home-nav">
        <div className="brand">📗 Athenaeum</div>
        <div className="link-cont">
          <Link to="/login" className="btn btn-outline">Sign in</Link>
          <Link to="/register" className="btn btn-primary">Get a library card</Link>
        </div>
      </nav>
      <section className='lib-head'>
        <h4>
          COLLEGE LIBRARY SYSTEM
        </h4>
        <h1>Every book, every borrower, one shelf-accurate record.</h1>
        <p>
          Athenaeum replaces the register and the spreadsheet with a single system -students track what they've borrowed, and the library desk issues, returns, and manages the catalog without the paperwork.
        </p>
        <div className="link-cont">
          <Link to="/register" className="btn btn-primary">Create your account</Link>
          <Link to="/login" className="btn btn-outline">I already have one</Link>
        </div>
      </section>
      <section className='cards'>
        <div className="card-1">
          <span className='title'>For students</span>
          <div className='subtitle'>Track your shelf</div>
          <p>See what's issued to you, when it's due, and your full borrowing history in one place.</p>
        </div>
        <div className="card-2">
          <span className='title'>Issue & return in seconds</span>
          <div className='subtitle'>Track your shelf</div>
          <p>Search a book or a student, issue with a due date, and retums update availability instantly</p>
        </div>
        <div className="card-3">
          <span className='title'>For everyone</span>
          <div className='subtitle'>Always up to date</div>
          <p>Copies available, overdue fines, and student status stay accurate no manual reconciliation.</p>
        </div>
      </section>
    </div>
  );
}
