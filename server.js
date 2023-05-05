const express = require('express')
const app = express()
const bcrypt =require('bcrypt')

app.use(express.json())

const user = []
app.get('/user',(req,res)=>{
    res.json(user)
})

app.post('/user',async (req,res)=>{
    try{
        const salt = await bcrypt.genSalt()
        const hashedpass = await bcrypt.hash(req.body.password , salt)
        console.log(salt)
        console.log(hashedpass)

    const requser = {
        name:req.body.name, 
        password:hashedpass,
    }
    user.push(requser)
    res.status(201).send()
    }catch{
        res.status(500).send()
    }

})

app.post('/user/login', async (req,res)=>{
    const chkuserr = user.find(requser => requser.name === req.body.name)
    if(chkuserr == null ){
        res.status(400).send('cannot find user')
    }
    try{
       if(await bcrypt.compare(req.body.password,chkuserr.password)){
        res.send("success")
       }else{
        res.send("invalid credintials")
       }
    }catch{
        res.status(500).send()
    }
    
})

app.listen(3000)