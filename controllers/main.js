let mongoose = require('mongoose');
let _ = require("underscore");
const server = 'ds335275.mlab.com:35275';
const database = 'saeu';
const user = 'Si-Alm';
const password = 'LastDetail.123';


exports.get_main = (req, res) => {
    res.render('index', {title: "SAEU"});
}

mongoose.connect(`mongodb://${user}:${password}@${server}/${database}`, {useNewUrlParser: true});

let SignerSchema = new mongoose.Schema({
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

exports.submit_sign = (req, res, next) => {
    if(!req.body) {
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


    console.log(`signer name: ${req.body.name} said ${req.body.msg}`);
    console.log(`email: ${req.body.email}`);
    console.log(new Date().toLocaleString());
    res.redirect('/');
}

