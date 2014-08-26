var express = require('express')
    , app = express()
    , bodyParser = require('body-parser')
    , path = require('path')
    , mongo = require('./config/mongo')




app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

  //aby som dostal z form text / EXPRESS
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());



app.use(express.static(path.join(__dirname,'bower_components')));




app.get('/',function(req,res){

    mongo.get(function(err, db) {
        if (err) {
            return res.render('500', {message: err.message});
        }
        db.collection("todo").find().toArray(function(err, items) {
           if (err) {
               return res.render('500', {message: err.message});
           }
            res.render('index',{
                title: 'Evidencia',
                items : items
            });
        });
    });
});


app.post('/add',function(req,res) {
    var newItem = req.body.newItem;           //pouziva body-parser
    var newDate = new Date(req.body.newDate);
    if (newDate == 'Invalid Date') {
        return res.render('500', {message: err.message});
    }
    var newTime = req.body.newTime;
    var newNote = req.body.newNote;
    var newPlace = req.body.newPlace;





    mongo.get(function(err, db) {
        if (err) {
            return res.render('500', {message: err.message});
        }

        db.collection("todo").insert({
            nazov:newItem,
            dateZ:newDate,
            timeZ:newTime,
            popis:newNote,
            place:newPlace
        }, function(err) {
            if (err) {
                return res.render('500', {message: err.message});
            }
            res.redirect('/');
        });

    });
});

mongo.init(function(err) {
    if (!err) {
        var port = process.env.PORT || 3000;
        app.listen(port, function() {
            console.log('.....port 3000');
        });
    }
});
