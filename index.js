let express = require('express');
let cors = require('cors');
const http = require('http');
const request = require('request');
app = express();
port = process.env.PORT || 3000;
let path = require('path');
let public = path.join(__dirname, 'public');
let map = {};
app.use(cors());

let createMap = () => {
    request('http://www.gedenktekenoutlet.nl/configurator/phpcore/letterplaat/getAll.php', { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        res = res.body;
        let len = res.length;
        this.map = {};
        for(let i = 0 ; i < len ; i++ ){
            if(res[i]['afbeelding']){
                this.map[ res[i]['afbeelding']]=res[i]['3Dobject'];
            }
        }
    });
}
let getAllProducts = (response, filter) => {
    console.log(filter)
    if (filter=='dubbelGraf') { this.category = "DG" }
    request('http://www.gedenktekenoutlet.nl/configurator/phpcore/product/getAll.php', {json: true}, (err, res, body) => {
        if(err) { return console.log(err); }
        res = res.body;
        res.shift()
        this.map = [];
        let len = res.length;
        for (let i=0;i<len;i++){
            if(res[i]['afbeelding'].slice(0,2) == this.category) {
                this.map.push(res[i])
            }
        };
        response.send(this.map);
    });
};
let getjpg = (response, fileName) => {
    let url = 'http://www.gedenktekenoutlet.nl/configurator/producten/m/'+fileName;
    request({url, encoding: null}, (err,res,buffer)=>{
        if(err) { return console.log(err) };
        response.set("Content-Type", "image/jpeg");
        response.send(buffer)
    });
};
let get3dObject = (response, fileName) => {
    let url = 'http://www.gedenktekenoutlet.nl/configurator/3Dobjecten/'+fileName
    request({url, encoding: null},(err, res, buffer) => {
        if (err) {return console.log(err) };
        response.send(buffer);
    })
};

app.listen(port, () => {
    // createMap();

});

app.get('/get-all-products/:filter', (req, res) => {
    getAllProducts(res, req.params['filter']);
});
app.get('/get-jpg/:fileName', cors(), (req, res) => {
    getjpg(res,req.params['fileName']);
});
app.get('/get-3dobject/:fileName', cors(), (req, res) => {
    get3dObject(res, req.params['fileName']);
})
