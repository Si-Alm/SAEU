let mongoose = require('mongoose');
let _ = require("underscore");

//variables for connecting to mongodb
const server = '<mlab database link>';
const database = '<database_name';
const user = '<username>';
const password = '<password>';

//mongodb connection
mongoose.connect(`mongodb://${user}:${password}@${server}/${database}`, {useNewUrlParser: true});

//schema for collecting and storing user responses
let SignerSchema = new mongoose.Schema({ //will collect user name, email, message, and the date they signed
    name: String, 
    email: {
        type: String, 
        require: true,
        unique: true
    },
    msg: String,
    signed: Date
});

var SignerModel = mongoose.model('Signer', SignerSchema);

exports.submit_sign = (req, res, next) => { //method to collect user information in index route
    if(!req.body) {                         //this is a post method
        return res.status(400).send('Request body is missing');
    }

  
    let model = new SignerModel(_.extend(req.body, { name: req.body.name, email: req.body.email, msg: req.body.msg, signed: new Date().toLocaleString() }));
    model.save()
        .then(doc => {
            if(!doc || doc.length===0) {
                return res.status(500).send(doc);
            }

            res.status(201).send(doc);
        })
        .catch(err => {
            res.status(500).json(err);
        });

    //unessecary console logs, used during development
    console.log(`signer name: ${req.body.name} said ${req.body.msg}`);
    console.log(`email: ${req.body.email}`);
    console.log(new Date().toLocaleString());
    res.redirect('/forum'); //when submitted, page re-routes to forum page
}


exports.get_main = (req, res) => { //necessary default get function
    res.render('index', {title: "SAEU"});
}

exports.get_signs = (req,res) => { //function to retrieve mongodb data and send it to the forum page
    //var logvalue = req.headers['log'];
    var names = []; //stores names(if it wasn't obvious)
    var messages = []; //stores messages
    //this will store strings that combine the appropriate names and messages
    var bigRay = []; 
    SignerModel.find({}, (err, foundData) => { //inner function that interacts with data
        if(err) {
            console.log(err);
            res.status(500).send();
        } else {
            if(foundData.length == 0) {
                var responseObject = undefined;
                res.status(404).send(responseObject);
            } else {
                var responseObject = foundData; //gets retrieved data from mongodb
                for(var i=0; i<foundData.length;i++) {
                    names.push(foundData[i].name);
                    messages.push(foundData[i].msg);
                 }
            } 
                //arrays reversed to have a backwards-chronological display of messages
                names.reverse();
                messages.reverse();
                for(var i=0; i<names.length; i++) { //loop to combine messages and names array into bigRay
                    if(names[i] == undefined || names[i] == null || names[i] == '' && !(messages[i] == undefined || messages[i] == null || messages[i] == ''))
                        bigRay.push(`Anonymous said '${messages[i]}`)
                    else if(names[i] == undefined || names[i] == null || names[i] == '' && (messages[i] == undefined || messages[i] == null || messages[i] == ''))
                        continue;
                    else if(messages[i] == undefined || messages[i] == null || messages[i] == '')
                        bigRay.push(`${names[i]} signed the petition!`);
                    else
                        bigRay.push(`${names[i]} said '${messages[i]}'`);
                }
            res.render('forum', {title:"SAEU", bigRay:bigRay}); //renders forum pages
                                                                //with title and bigRay
        }
    })
}  

