const express =require('express');
const morgan =require('morgan');
const mongoose=require('mongoose');
const Blog = require('./model/blog.js')
const port = process.env.PORT || 3000;
const app = express();
//server setup
app.set('view engine','ejs');

const dbURI ='mongodb+srv://KavyaMurali:kavya2710@cluster0.owslr.mongodb.net/cms?retryWrites=true&w=majority';
mongoose.connect(dbURI,{useNewUrlParser:true,useUnifiedTopology :true})
  .then(result =>{
      console.log('database connected')
      app.listen(port);
console.log('server running at', port);
    
      
  })
  .catch(err =>{
      console.log(err)

  })
  //morgan
app.use(morgan('dev'));
//static
app.use(express.static('public'));
// url parse
app.use(express.urlencoded({extended:true}));
//home page // all blogs........
app.get('/',(req,res)=>{
  
    Blog.find().sort({createdAt:-1})
     .then(result =>{
        res.render('index',{title:'Home',blogs: result});

     })  
     .catch(err => console.log(err))
   
});
// single blog.........
app.get('/blog/:id',(req,res)=>{
   // res.render('blog',{title:'blog'});
   const id =req.params.id
   Blog.findById(id)
   .then(result =>{
       console.log(result);
          res.render('blog',{title:'Blog',blog:result});
   })
   .catch(err =>console.log(err))
});
// delete single blog.........
app.delete('/blog/:id',(req,res)=>{
    // res.render('blog',{title:'blog'});
    const id =req.params.id
    const myresponse ={
        status :'success'
    }
    Blog.findByIdAndDelete(id)
    .then(result =>{

        res.json(myresponse)
    })
    .catch(err =>console.log(err))
 });
 // edit single blog
 app.put('/edit/:id',(req,res)=>{
    // res.render('blog',{title:'blog'});
    const id =req.params.id
    const myresponse ={
        status :'success'
    }
    Blog.findByIdAndUpdate(id)
    .then(result =>{

        res.json(myresponse)
    })
    .catch(err =>console.log(err))
 });
 
 



// editor page........
app.get('/editor',(req,res)=>{



    Blog.find().sort({createdAt:-1})
    .then(result =>{
       res.render('editor',{title:'Editor',blogs: result});

    })  
    .catch(err => console.log(err))
    
   
});


//create blog......
app.get('/create',(req,res)=>{
    res.render('create',{title:'create'});
});
app.post('/create',(req,res)=>{
   console.log(req.body)
   const blog = new Blog(req.body);
   blog.save()
      .then(result =>{
          res.redirect('/editor');

      })
      .catch (err => (console.log(err)))
   
});


 //middleware
 app.use((req,res)=>{
     res.send('404 ,not found')

 });
 
