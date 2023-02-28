//Import Koa
const koa = require('koa');
//Start app
const app = new koa();
//Import Mongo-Client 
const { MongoClient, ObjectId } = require("mongodb");


const uri = "mongodb://root:123@localhost:27017/test?authSource=admin";
const client = new MongoClient(uri);
const database = client.db("test");
const myCollection = database.collection("news");


async function saveOne(doc) {
  try {
    //insert the doc
    const result = await myCollection.insertOne(doc);

    console.log(`A document was inserted with the _id: ${result.insertedId}`);

    //return the saved doc
    return result;
  } catch (e) {
    console.error(e);
  }
}


async function getAll() {
  try {
    const result = await myCollection.find();
    return result.toArray();
  } catch (e) {
    console.error(e);
  }
}


async function getById(id) {
  try {
    //get the doc
    const result = await myCollection.findOne({ _id: ObjectId(id) });
    return result;
  } catch (e) {
    console.error(e);
  }
}



async function updateOne(id,doc) {
  try {
    //update the doc
    const result = await myCollection.replaceOne({_id:ObjectId(id)},doc);
    return result.ops[0];
  } catch (e) {
    console.error(e);
  }
}


async function deleteOne(id) {
  try {
    //delete the doc
   await myCollection.deleteOne({_id:ObjectId(id)});
  } catch (e) {
    console.error(e);
  }
}


//Welcome message
app.use(function* () {
  this.body = 'Hello world!';
});



//create a webserver on port :: 3001
app.listen(3001, function () {
  console.log('Server running on https://localhost:3001')
});
