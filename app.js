var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');


var todoItems = [{nazov:'Evidencia',dateZ:'25-6-1993',timeZ:'9:40',popis:'evidencia prihl.',place:'Zilina'},
                 {nazov:'TrashOut',dateZ:'23-9-1990',timeZ:'10:30',popis:'trash',place:'Bratislava'}
                ]

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(bodyParser());  //aby som dostal z form text / EXPRESS

app.use(express.static(path.join(__dirname,'bower_components')));

app.get('/',function(req,res){
   res.render('index',{
       title: 'Evidencia',
       items : todoItems
   });
});


app.post('/add',function(req,res){
    var newItem = req.body.newItem;           //pouziva body-parser
    var newDate = req.body.newDate;
    var newTime = req.body.newTime;
    var newNote = req.body.newNote;
    var newPlace = req.body.newPlace;

    todoItems.push({
        nazov:newItem,
        dateZ:newDate,
        timeZ:newTime,
        popis:newNote,
        place:newPlace
    });
    res.redirect('/');        
})


app.listen(3000,function(){
    console.log('.....port 3000');
})
