var koa = require('koa');
var app = new koa();

app.use(function* (){
   this.body = 'Hello world!';
});


//create a webserver on port :: 3000
app.listen(3000, function(){
   console.log('Server running on https://localhost:3000')
});
