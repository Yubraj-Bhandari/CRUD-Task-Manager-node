const express= require('express');
const app= express();
const path=require("path");
const userModel=require("./models/user");
const user = require('./models/user');


app.set('view engine',"ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));



app.get("/",(req,res)=>{
    res.render("index");

})

app.get("/read",async (req,res)=>{
    let allusers= await userModel.find()
    res.render("read",{users:allusers});
})


app.get("/edit/:userid",async (req,res)=>{
let user= await userModel.findOne({_id: req.params.userid});
res.render("edit",{user});
})


app.post("/update/:userid",async (req,res)=>{
    let { image, name ,email} = req.body;
    let user= await userModel.findOneAndUpdate({_id: req.params.userid}, {image,
        name,email },{new: true});
    res.redirect("/read");
    })
    

app.get("/delete/:id",async (req,res)=>{
    let allusers= await userModel.findOneAndDelete({_id: req.params.id})
    res.redirect("/read");
})


// app.post("/create",async (req,res)=>{
//     let{name, email, image}= req.body;
//  let createdUser=  await userModel.create({
// name,
// email,
// image
//   });
  
//   res.send(createdUser);
// })

app.post("/create", async (req, res) => {
    const { name, email, image } = req.body;
    try {
        // Check if user with the same email already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).send("User with this email already exists");
        }

        // Creating a new user in the database
        const createdUser = await userModel.create({
            name,
            email,
            image
        });

        res.redirect("/read");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error creating user");
    }
});




app.listen(3000,()=>{
    console.log("The server is running at port 3000")
});