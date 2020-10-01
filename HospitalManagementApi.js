var express= require('express');
var server=require('./server.js');
var config=require('./config.js')
var middleware=require('./middleware.js');
var app=express();
const MongoClient=require('mongodb').MongoClient;
const url='mongodb://127.0.0.1:27017';
const dbName='hospitalInventory1';
let db
MongoClient.connect(url, (err,client)=>{
    if(err) return console.log(err);
    db=client.db(dbName);
    console.log(`Connected Database: ${url}`);
    console.log(`Database : ${dbName}`);
});
var bodyParser = require('body-parser');
const { mquery } = require('mongoose');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//getting hospital details
app.get('/hospitaldetails',(req,res)=>{
   console.log('hospitaldetails')
   var data=db.collection('Hospital').find().toArray().then(result =>res.json(result));
});
//getting ventilator details
app.get('/ventilatordetails',(req,res)=>{
   console.log('ventilatordetails')
   var data=db.collection('Ventilator').find().toArray().then(result =>res.json(result));
});
//finding ventilators by  status
app.post('/findventbystatus',(req,res)=>
{
   var status=req.body.status;
   console.log("finding vent by status");
   var ventilatordetails=db.collection('Ventilator').find({"status":status}).toArray().then(result=>res.json(result))
});
//finding ventilators by hospital id
app.post('/findventbyhospid',(req,res)=>
{
   var hospital_id=req.body.hospital_id;
   console.log("finding vent by id");
   var ventilatordetails=db.collection('Ventilator').find({"hospital_id":hospital_id}).toArray().then(result=>res.json(result))
});
//finding ventilators by hospital name
app.post('/findventbyhosp_name',(req,res)=>
{
   var hospital_name=req.body.hospital_name;
   console.log("finding vent by name");
   var ventilatordetails=db.collection('Ventilator').find({"hospital_name":hospital_name}).toArray().then(result=>res.json(result))
});
//adding ventilators
app.post('/addventilatordetails',(req,res)=>
{
   console.log('ventilator details added')
   var hospital_name=req.body.hospital_name;
   var hospital_id=req.body.hospital_id;
   var ventilator_id=req.body.ventilator_id;
   var status=req.body.status;
   var item={
      hospital_name:hospital_name,
      hospital_id:hospital_id,
      ventilator_id:ventilator_id,
      status:status
   }
   db.collection('Ventilator').insertOne(item,(err,result)=>
   {
      res.json('item added');
   });
});
   //updating ventilator details
   app.put('/update_vent_details',(req,res)=>
   {
      var ventilator_id={ ventilator_id:req.body.ventilator_id   };
      var newvals={ $set:{ status:req.body.status   }  };
      db.collection('Ventilator').updateOne(ventilator_id,newvals,function(err,result)
      {
         res.json('updated');
         if(err)throw err
      });
});
//delete vent by vent id
app.delete('/delete',(req,res)=>
{
   var query=req.query.ventilator_id
   var query1={ventilator_id:query}
   db.collection("Ventilator").deleteOne(query1,function(err,result){
      if(err)throw err;
      res.json('deleted')
   })

})

app.listen(1200);
