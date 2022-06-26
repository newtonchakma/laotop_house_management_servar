const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xti5z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        await client.connect();
        const laptopCollection = client.db('warehouse').collection('laptop');
        const newLaptopAdd = client.db('warehouse').collection('myItem');
        const ourTeam = client.db('warehouse').collection('team');
    
        app.get('/laptop', async(req, res)=>{
            const query ={};
            const cursor = laptopCollection.find(query);
            const laptops = await cursor.toArray();
            res.send(laptops);
        });

        app.get('/laptop/:id', async(req, res) =>{
            const id  = req.params.id;
            const query = {_id: ObjectId(id)};
            const laptop = await laptopCollection.findOne(query)
            res.send(laptop)
        });
        app.post('/laptop/:id',async(req,res)=>{
            const update =req.body;
            const result = await laptopCollection.insertOne(update)
            res.send(result)
        })
        app.put('/laptop/:id', async(req,res)=>{
            const id = req.params.id;
            const data = req.body;
            const filter = {_id:ObjectId(id)};
            const options = {upset:true};
            const updateDoc = {
                $set:{
                   quantity: data.newQuantity
                }
            };
            const result = await laptopCollection.updateOne(filter,updateDoc,options);
            res.send(result)

        })
        app.delete('/laptop/:id',async(req,res)=>{
            const id =req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await laptopCollection.deleteOne(query);
            res.send(result)
        })
        app.delete('/myItem/:id',async(req,res)=>{
            const id =req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await newLaptopAdd.deleteOne(query);
            res.send(result)
        })

        app.post('/myItem', async(req, res) =>{
            const newLaptop = req.body;
            const result = await newLaptopAdd.insertOne(newLaptop);
            res.send(result);
        })

        app.get('/myItem', async(req, res)=>{
            const email =req.query.email;
            console.log('order',email);
            const query = {email:email};
            const orders = await newLaptopAdd.find(query).toArray();
            res.send(orders)

        })
      
        app.get('/team', async(req, res)=>{
            const query ={};
            const cursor = ourTeam.find(query);
            const teams = await cursor.toArray();
            res.send(teams);
        });
    }

    finally{

    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('hello world!!')
});

app.listen(port, ()=>{
   console.log('server in runing', port);
})