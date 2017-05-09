var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
app.use(cookieParser());
app.set('view engine', 'ejs')
app.use(express.static('public'));
var fs = require('fs');
var _ = require('underscore');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var sha1 = require('sha1');




app.get('/', function (req, res) {
	MongoClient.connect('mongodb://localhost:27017/myblog', function(err, db) {
		console.log("Connected correctly to server");
		db.collection('posts')
		.find()
		.toArray(function(err, docs) {
		if(err){
			return console.log(err)
		}
			res.render('home.ejs', {
				articles: docs
			});
			db.close();
		});
	});
});


app.get('/posts/:id', function (req, res) {
	MongoClient.connect('mongodb://localhost:27017/myblog', function(err, db) {
		console.log("Connected correctly to server", req.params.id);
		db.collection('posts')
		.find({_id: mongo.ObjectId(req.params.id)})
		.toArray(function(err, docs) {
			if(err){
				return console.log(err)
			}
			var ourauthor = docs[0].author;
			MongoClient.connect('mongodb://localhost:27017/myblog', function(err, db) {
				db.collection('authors')
				.find({_id: mongo.ObjectId(ourauthor)})
				.toArray(function(err, docs2) {
					if(err){
						return console.log(err)
					}
					var mydate = new Date(docs[0].date);

					var time =[{
						date: 1 + mydate.getDate(),
						month: 1 + mydate.getMonth(),
						year: mydate.getFullYear()
					}]

					res.render('blogpost.ejs', {
						time: time,
						articles2: docs2,
						articles: docs
					});	
					db.close();

				});
			});
		});
	});

	console.log();
	
});

app.post('/posts/:id', function(req,res){
	MongoClient.connect('mongodb://localhost:27017/myblog', function(err, db) {
		console.log("Connected correctly to server", req.body.id);
		db.collection('posts')
		.find({_id: mongo.ObjectId(req.body.id)})
		.toArray(function(err, docs) {
			if(err){
				return console.log(err)
			}
			
			var name = req.body.name;
			var about = req.body.text;
			var obj = {};
			obj.name = name;
			obj.about = about;
			var post = docs[0];
			var bigestId = _.max(post.comments, function(elm,index){
				return elm.id;
			});
			obj.id = bigestId.id;
			obj.id++;

			
			
			db.collection('posts').updateOne({
			_id: mongo.ObjectId(req.body.id)
			},{
			$push:{"comments":obj}
			}, function(err) {
			if(err){
				return console.log(err)
			}
			console.log("success");

				db.close();
				res.json(req.body);
			});
		});
	});
});

		// db.collection('posts').updateMany({
	// 	"tags": {$elemMatch:{$eq: "adipisicing"}},
	// },{
	// 	$set:{"published":false}
	// }, function(err) {
	// if(err){
	// 	return console.log(err)
	// }
	// 	console.log("success");
	// 	db.close();
	// })

	// var name = req.body.name;
	// var about = req.body.text;

	// var obj = {};
	// obj.name = name;
	// obj.about = about;
	// var json = require('./data.json');
	// var bigestId = _.max(json, function(elm,index){
	// 	return elm.id;
	// });
	// obj.id = bigestId.id;
	// obj.id++;
	// var jsonString = JSON.stringify(json);
	// var objString = JSON.stringify(obj);
	// var a = jsonString.indexOf(']');
	// var b = jsonString.substring(0,a);
	// var newJsonStr = b+","+objString+']';
	// // var newJson = JSON.parse(newJsonStr);
	// console.log(JSON.parse(newJsonStr));
	// fs.writeFile('./data.json', newJsonStr, function(err){
	// 	if (err) {
	// 		console.log(err);
	// 	}
	// });






app.listen(3000);