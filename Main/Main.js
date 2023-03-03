//Import Mongo-Client 
const { MongoClient, ObjectId } = require("mongodb");

//Crate Mongoclient and connect to MongoDB
const uri = "mongodb://root:123@localhost:27017/test?authSource=admin";
const client = new MongoClient(uri);
const database = client.db("test");
const myCollection = database.collection("news");


async function saveOne(doc) {
  try {
    //Insert the doc
    const result = await myCollection.insertOne(doc);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
    //Return the saved doc
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
    //Get the doc
    const result = await myCollection.findOne({ _id: new ObjectId(id) });
    return result;
  } catch (e) {
    console.error(e);
  }
}


async function updateOne(id, doc) {
  try {
    //Update the doc
    const result = await myCollection.replaceOne({ _id: new ObjectId(id) }, doc);
    return result.ops[0];
  } catch (e) {
    console.error(e);
  }
}


async function deleteOne(id) {
  try {
    //Delete the doc
    await myCollection.deleteOne({ _id: new ObjectId(id) });
  } catch (e) {
    console.error(e);
  }
}


async function createNews(doc) {
  const newsToSave = Object.assign({}, doc, { createdAt: new Date() });
  return await saveOne(newsToSave)
}

//Map the getAll() method
async function getAllNews() {
  return await getAll();
}

//Map the deleteOne
async function deleteOneNews(id) {
  return await deleteOne(id);
}

//Map the getById methods
async function getNewsById(id) {
  return await getById(id);
}

//Map the update method
async function newsToUpdate(id, doc) {
  const newsToUpdate = Object.assign({}, doc, { updatedAt: new Date() });
  return await updateOne(id, newsToUpdate);
}

//Crate Router 
const Router = require("@koa/router");
const router = new Router({
  prefix: '/news'
})

//Get request
router.get('/', async function (ctx) {
  ctx.body = await getAllNews();
})

//Post request
router.post('/', async function (ctx) {
  let news = ctx.request.body;
  news = await createNews(news);
  ctx.response.status = 200;
  ctx.body = news;
})

//Get request to get a specific news 
router.get('/:id', async function (ctx) {
  const id = ctx.params.id;
  ctx.body = await getNewsById(id);
})

//Delete request
router.delete('/:id', async function (ctx) {
  const id = ctx.params.id;
  await deleteOneNews(id);
})

//Update request to update a specific news sent as the id 
router.put('/:id', async function (ctx) {
  //Get the id from the url
  const id = ctx.params.id;
  //Get the news details from the body 
  let news = ctx.request.body;
  news = await newsToUpdate(id, news);
  ctx.response.status = 200;
  ctx.body = news;
})

//Import Koa
const koa = require('koa');

//Import body-parser
const bodyParser = require('koa-bodyparser');

//Start app
const app = new koa();

//Using body parser
app.use(bodyParser());

//Registering the routes
app.use(router.routes()).use(router.allowedMethods());

//create a webserver on port :: 3001
app.listen(3001, function () {
  console.log('Server running on https://localhost:3001')
});
