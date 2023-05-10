const express = require('express')
const app = express()
const bcrypt =require('bcrypt')
const cors =  require("cors")
const mongoose = require('mongoose')
const url = "mongodb://127.0.0.1:27017"
const User = require('./model.js')
//db connection
mongoose.connect(url)
const con = mongoose.connection
con.on('open',function(err){
    if(err){
        console.log(err)
    }else{
        console.log("established connection ")
    }
})
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cors())

//db working post model
//get the details of the worker
app.get('/user', async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
//db working post model
//post the details of the worker
    app.post('/user',async (req,res)=>{
        try{
            const salt = await bcrypt.genSalt()
            const hashedpass = await bcrypt.hash(req.body.password , salt)
            console.log(salt)
            console.log(hashedpass)
            const requser = new User({
            name:req.body.name, 
            password:hashedpass,
        });

        //main to add into the database
        await requser.save();
        res.status(201).send()
       // res.json(requser)
        console.log("succesfully posted")
        }
        catch(error) {
            console.log(error);
            
            res.status(500).send()
            console.log("Not pushed")
        }
    

    })

//practice get and post method
app.post('/practice',async (req,res)=>{
    try{
        const practice = new User({
            email:req.body.email,
            birth:req.body.birth,
            fathername:req.body.fathername,
        });
        await practice.save()
        res.json(practice)
        console.log("success")
    }   
    catch(err){
        console.log(err)
    }

})

app.get('/practice', async(req,res)=>{

    try{
        const data = await User.find({ email: { $exists: true } })
        res.json(data)
    }catch(err){
        res.status(500).send()
    }
})

//check whether the details are correct or not
app.post('/user/login', async (req,res)=>{
    const chkuserr = await User.findOne({name:req.body.name})
    if(chkuserr == null ){
        res.status(400).send('cannot find user')
    }
    try{
        const isMatch = await bcrypt.compare(req.body.password,chkuserr.password);
       if(isMatch){
        res.send("success")
       }else{
        res.send("invalid credintials")
       }
    }catch(err){
        console.error(err);
        res.status(500).send('Server error');
    }
});


//check for the integrations
app.post('/login',async(req,res)=>{
    //res.set('Access-Control-Allow-Origin', 'http://localhost:3001');
    const{email,password} = req.body
    try{
        const check = await User.findOne({email:email})
        //const pass = await User.findOne({password:password})
        if(check){
            res.json("exist")
        }else{
            res.json("notexist")
        }
    }catch(e){
        res.json("notexist")
        console.log(res.json)
    }

})
app.post('/signup',async(req,res)=>{
    const{email,password} = req.body
        const data = {
            email: email,
            password : password
        }
    try{
        const check = await User.findOne({email:email})
        if(check){
            res.json("exist")
        }
        else
        {
            res.json("notexist")
            await User.insertMany([data])
        }
    }catch(e){
        res.json("notexist")
    }
})

app.get('/home',async (req,res)=>{
    const Loga = await User.find()
    try{
        res.json(Loga);

    }catch(e){
        console.log(e);
    }
    
})

app.delete('/:id',async(req,res)=>{
    try{
        const del = await User.findById(req.params.id)
        del.name = req.body.name
        const deldata = await del.remove()
        res.json(deldata)
    }catch(e){
        res.send(e)
    }
})

app.get('/:id', async(req,res)=>{
    try{
        const del = await User.findById(req.params.id)
        res.json(del)
    }catch(e){
        res.send(e)
    }

})

app.listen(3000,()=>{
    console.log("App is listening in the port 3000")
})