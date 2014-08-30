var express = require('express')
    , app = express()
    , bodyParser = require('body-parser')
    , path = require('path')
    , mongo = require('./config/mongo')
    , sum = 0.0



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
        db.collection("todo").find().sort({dateEnd:-1}).toArray(function(err, items) {
           if (err) {
               return res.render('500', {message: err.message});
           }
            sum=0.0;
            for(var i=0;i<items.length;i++){
                sum+=(items[i].dateEnd.getTime()-items[i].dateZ.getTime())/3600000;
            }

            res.render('index',{
                title: 'Evidencia',
                items : items,
                label_text : sum.toFixed(2)
            });
        });
    });
});

app.get('/search',function(req,res){

    var date_start = new Date(req.query.dfrom); //querry funguje pre express metoda GET
    var date_end = new Date(req.query.dto);
    date_end.setHours(23,59,59,59);



    mongo.get(function(err, db) {
        if (err) {
            return res.render('500', {message: err.message});
        }
        db.collection("todo").find({
            $or:[{dateZ:{$gte:date_start,$lte:date_end}},{dateEnd:{$gte:date_start,$lte:date_end}},
                {dateZ:{$lte:date_start,$lte:date_end},dateEnd:{$gte:date_start,$gte:date_end}}]}).sort({dateEnd:-1}).toArray(function(err, items) {
            if (err) {
                return res.render('500', {message: err.message});
            }
            sum=0.0;
            for(var i=0;i<items.length;i++){
                if(items[i].dateEnd>=date_end){
                    sum+=(date_end.getTime() - items[i].dateZ.getTime())/3600000;}
                else if (items[i].dateZ<=date_start){
                    sum+=(items[i].dateEnd.getTime() - date_start.getTime())/3600000;}
                else if (items[i].dateZ<=date_start && items[i].dateEnd>=date_end){
                    sum+=(items[i].dateEnd.getTime() - items[i].dateZ.getTime())/3600000;}
            }
            res.render('index',{
                title: 'Evidencia',
                items : items,
                label_text : sum.toFixed(2)        //na zaokruhlenie toFixed
            });
            console.log(sum);


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



