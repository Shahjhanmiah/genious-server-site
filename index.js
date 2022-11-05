const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT||5000;

//  middleweare

app.use(cors())
app.use(express.json())


// mongodb daat load


// daynamick e  
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ga6ydds.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  
function verifyJWT(req,res,next){
   const authHeader = req.headers.authorization
   if(!authHeader){
    res.status(401).send({message:'unnauthrization access'})
   }
   const token= authHeader.split('')[1];
   jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,function(error,decoded){
    if(error){
         return res.status(401).send({message:'unauthrazation access'})
    }
    req.decoded = decoded
    next()
   })

}

async function run(){
    try{
       const servicesCollection=client.db('geniusCar').collection('services')
       const orderCollection = client.db('geniusCar').collection('services')

       // jwt 

       app.post('/jwt',(req,res)=>{
        const user = req.body;
        const token = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{ expiresIn: '1h' })
        res,send({token})
  

       })
    //     all data 
       app.get('/services',async(req,res)=>{
        const query = {};
        const cursor = servicesCollection.find(query);
        const services = await cursor.toArray();
        res.send(services)
     
       });
       // speace onlay one data id 
       app.get('/services/:id',async(req,res)=>{
        const id = req.params.id;
        const query = { _id:ObjectId(id) };
        const services = await servicesCollection.findOne(query);
        res.send(services)
       })

       // order api  data insert  user  query paramete data load
       app.get('/orders',verifyJWT,async(req,res)=>{
        console.log =(req.headers.authorization)
        const decoded = req.decoded
         console.log('inside orders api',decoded)
         if(decoded.email !==req.query.eamil){
            return res.status[403].send({message:'unathrazation access'})

         }
        let query = {};
        if(req.query.eamil){
            query={
                eamil:req.query.email

            }
        }
        const cursor = orderCollection.find(query);
        const orders = await cursor.toArray()
        res.send(orders)

       })
       app.post('/orders',async(req,res)=>{
        const order = req.body;
        const result = await orderCollection.insertOne(order);
        res.send(result);
       })
       // update  buttion click 
       app.patch('/orders/:id',async(req,res)=>{
        const id = req.params.id;
        const status = req.body.status
        const query = { _id: ObjectId(id) }
        const updateDoc = {
            $set:{
                status:status
            }
        }
        const result = await orderCollection.updateOne(query,updateDoc)
        res.send(result)
       })
       // delete buttion click 
       app.delete('/orders/:id',async(req,res)=>{
        const id = req.params.id
        const query = { _id:ObjectId(id) };
        const result = await orderCollection.deleteOne(query)
        res.send(result)
       })
    }
    finally{

    }

}
run().catch(error=>console.log(error))


app.get('/',(req,res)=>{
    res.send('genious car server is running')

})

app.listen(port,(req,res)=>{
    console.log(`server is running port ${port}`);

})
//  user name
// geniousdb password :pRvVOqzAF4DAlFAo
//client('geniousmongodb').collection('seriver')