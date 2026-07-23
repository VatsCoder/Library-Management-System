const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const {protect,adminOnly} = require('./middleware/auth')
const cors = require("cors")
require('dotenv').config();

const app = express();
app.use(cors({
  origin: "https://athenaeumlibrary.vercel.app"
}));
app.use(express.json());
const port = process.env.PORT

mongoose.connect(process.env.MONGO_URL)
  .then(()=> console.log('MongoDB connected'))
  .catch((err)=> console.error('MongoDB connection failed:',err.message))

const userSchema = new mongoose.Schema({
  name: {type:String, required: true},
  email: {type:String, required: true, unique: true},
  password: {type:String, required: true, },
  role: {type:String, enum:['admin','student'],default:'student'},
  rollNo:{type:String, required: true},
  department:{type:String},
  status:{type:String, enum:['active','blocked'],default:'active'},
});

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true},
  category: { type: String },
  callNumber: { type: String },       // e.g. "CS 005.1 COR"
  totalCopies: { type: Number, required: true, default: 1 },
  availableCopies: { type: Number, required: true },
}, { timestamps: true });

const issueSchema = new mongoose.Schema({
  book: {type: mongoose.Schema.Types.ObjectId, ref:'Book', required:true},
  student: {type: mongoose.Schema.Types.ObjectId, ref:'User', required:true},
  issueDate: {type: Date, default:Date.now},
  dueDate: {type: Date, required:true},
  returnDate: {type: Date, default:null},
  status: {type: String, enum:['issued','overdue','returned'], default:'issued'},
  fine: {type: Number, default:0},
},{timestamps:true});

const User = mongoose.model('User',userSchema);
const Book = mongoose.model('Book',bookSchema);
const Issue = mongoose.model('Issue',issueSchema);

app.get('/', (req, res) => {
  res.send('Server is running')
})

app.post('/api/auth/register', async(req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.pass, 10);
    const users = await User.create({...req.body, password:hashedPassword});
    res.status(201).json({users})
  } catch (err) {
    res.status(400).json({message:err.message})
  }
});

app.post('/api/auth/login', async (req, res) => {
  const {email,pass} = req.body;
  const users = await User.findOne({email});
  if(!users){
    return res.status(401).json({
      message:'Invalid Email'
    });
  }
  const isMatch = await bcrypt.compare(pass, users.password);
  if(!isMatch){
    return res.status(401).json({
      message: 'Invalid Password'
    });
  }
  const token = jwt.sign(
    {
      id:users._id,
      role:users.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn:"7d"
    }
  )
  res.json({
    token,
    user:{
      name:users.name,
      role:users.role,
      id:users._id
    }
  })
});

app.get('/api/users', protect, adminOnly, async (req,res) => {
  try {
    const users = await User.find({role:"student"}).select('-password');
    const usersWithCounts = await Promise.all(
      users.map(async(user)=>{
        const count = await Issue.countDocuments({student:user._id, staus:{$ne: 'returned'}});
        return {...user.toObject(), booksIssued:count};
      })
    );
    res.json({users: usersWithCounts});
  } catch (err) {
    res.status(500).json({message: err.message})
  }
});
app.get('/api/users/:id', protect, async(req,res)=>{
  try {
    const user = await User.findById(req.params.id).select('-password')
    res.status(200).json({user})
  } catch (err) {
    console.log(err)
  }
})
app.put('/api/users/:id', protect , adminOnly , async (req,res) => {
  try {
    const users = await User.findByIdAndUpdate(req.params.id,req.body,{new: true}).select('-password');
    res.json({users})
  } catch (err) {
    res.status(400).json({message:err.message});
  }
});
app.delete('/api/users/:id',protect, adminOnly, async (req,res) => {
  try {
    const users = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({success:true});
  } catch (err) {
    res.status(500).json({message:err.message})
  }
})
app.post('/api/books',protect, adminOnly, async(req,res)=>{
  try {
    const book = await Book.create({
      title: req.body.title,
      author: req.body.author,
      isbn: req.body.isbn,
      category: req.body.category,
      callNumber: req.body.callNumber, 
      totalCopies: req.body.totalCopies,
      availableCopies: req.body.totalCopies,
  })
    res.status(201).json({success:true})
  } catch (err) {
    res.status(400).json({message:err.message})
  }
});

app.get('/api/books',protect, adminOnly, async(req,res)=>{
  try {
    const books = await Book.find()
    res.status(200).json({books})
  } catch (err) {
    res.status(400).json({message:err.message})
  }
})

app.delete('/api/books/:id', protect, adminOnly, async (req,res) => {
  try {
    const books = await Book.findByIdAndDelete(req.params.id)
    res.status(200).json({success:true})
  } catch (err) {
    res.status(500).json({message:err.message})
  }  
})
app.put('/api/books/:id', protect , adminOnly , async (req,res) => {
  try {
    const books = await Book.findByIdAndUpdate(req.params.id,req.body,{new: true})
    res.json({books})
  } catch (err) {
    res.status(400).json({message:err.message});
  }
})
app.post('/api/issue', protect, adminOnly, async (req,res) => {
  try {
    const {bookId, studentId, dueDate} = req.body;
    const book = await Book.findById(bookId);
    if(book.availableCopies<=0){
      res.status(400).json({message:"No copies available"});
    }
    const issue = await Issue.create({
      book:bookId,
      student:studentId,
      dueDate
    });
    book.availableCopies -= 1;
    book.save();
    const populatedIssue = await issue.populate(['book', 'student']);
    res.status(201).json({issue:populatedIssue})
  } catch (err) {
      res.status(400).json({message: err.message})
  }
});
app.get('/api/getissue', protect, adminOnly, async (req,res) => {
  try {
    const issuedbooks = await Issue.find().populate('book').populate('student')
    const today = new Date();
    for (const issue of issuedbooks) {
      if (issue.status === 'issued' && today > issue.dueDate) {
        issue.status = 'overdue';
        await issue.save();
      }
    }
    res.status(200).json({issuedbooks})
  } catch (err) {
    res.status(500).json({message:err.message})
  }
})
app.get('/api/getissue/:id', protect, async(req,res)=>{
  try {
    const mybooks = await Issue.find({student:req.params.id,status:'issued'}).populate('book').populate('student');
    const history = await Issue.find({student:req.params.id}).populate('book').populate('student');
    const issued = await Issue.countDocuments({student:(req.params.id), status:{$ne:'returned'}})
    const overdue = await Issue.countDocuments({student:(req.params.id), status:{$eq:'overdue'}})
    const borrowed = await Issue.countDocuments({student:(req.params.id)})
    const studentIssues = await Issue.find({student: req.params.id});
    const totalFine = studentIssues.reduce((sum, issue) => sum + issue.fine, 0);
    res.json({mybooks,history,issued,overdue,borrowed,totalFine})
  } catch (err) {
    res.status(500).json({message:err.message})
  }
})
app.put('/api/return/:id', protect, adminOnly, async (req,res)=>{
  try {
    const issue = await Issue.findById(req.params.id);
    const today = new Date();
    issue.returnDate = today;
    const isLate = today > issue.dueDate;
    const daysLate = isLate ? Maths.ceil((today-issue.dueDate)/(1000 * 60 * 60 * 24)) : 0;
    const lateFee = 5 * daysLate;
    issue.status= 'returned';
    issue.fine = lateFee;
    issue.save();
    const book = await Book.findById(issue.book);
    book.availableCopies +=1
    book.save();
    res.status(204).json({message:'success'});
  } catch (err) {
    res.status(500).json({message:err.res})
  }
});
app.delete('/api/return/:id', protect, adminOnly, async(req,res)=>{
  try {
    const issue = await Issue.findByIdAndDelete(req.params.id)
    res.status(200).json({message:"success"})
  } catch (error) {
    res.status(500).json({message:err.res})
  }
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})