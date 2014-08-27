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

app.get('/search',function(req,res){

    var date_start = new Date(req.query.dfrom); //querry funguje pre express metoda GET
    var date_end = new Date(req.query.dto);
    var milis;



    mongo.get(function(err, db) {
        if (err) {
            return res.render('500', {message: err.message});
        }
        db.collection("todo").find({
            $or:[{dateZ:{$gte:date_start,$lte:date_end}},{dateEnd:{$gte:date_start,$lte:date_end}},
                {dateZ:{$lte:date_start,$lte:date_end},dateEnd:{$gte:date_start,$gte:date_end}}]}).toArray(function(err, items) {
            if (err) {
                return res.render('500', {message: err.message});
            }
            res.render('index',{
                title: 'Evidencia',
                items : items
            });
            console.log((items[0].dateEnd.getTime()-items[0].dateZ.getTime())/3600000);
        });
    });


});

app.post('/records',function(req,res) {
    var newItem = req.body.newItem;           //pouziva body-parser
    var newDate = new Date(req.body.newDate);
    if (newDate == 'Invalid Date') {
        return res.render('500', {message: err.message});
    }
    var newTime = req.body.newTime;
    var newDateEnd = new Date(req.body.newDateEnd);
    if (newDateEnd == 'Invalid Date') {
        return res.render('500', {message: err.message});
    }
    var newTimeEnd = req.body.newTimeEnd;
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
            dateEnd:newDateEnd,
            timeEnd:newTimeEnd,
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
