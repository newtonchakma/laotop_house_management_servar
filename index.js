const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xti5z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        await client.connect();
        const laptopCollection = client.db('warehouse').collection('laptop');
    
        app.get('/laptop', async(req, res)=>{
            const query ={};
            const cursor = laptopCollection.find(query);
            const laptops = await cursor.toArray();
            res.send(laptops);
        });
        app.get('/laptop/:id', async(req, res) =>{
            const id  = req.params.id;
            const query = {_id: ObjectId(id)};
            const laptop = await laptopCollection.findOneAndDelete(query);
            res.send(laptop)
        })
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