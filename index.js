let express = require('express');
let cors = require('cors');
const http = require('http');
const request = require('request');

const axios = require('axios');

var querystring = require('querystring');

app = express();

var bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
app.use(bodyParser.xml());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true}));

var parseString = require('xml2js').parseString;

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
    if (filter=='dubbelGraf') { this.category = "DG" }
    if (filter=='dubbeleZerken') { this.category = "DZ" }
    if (filter=='enkelGraf') { this.category = "EG" }
    if (filter=='enkeleZerken') { this.category = "EZ" }
    if (filter=='staandeGedenkstenen') { this.category = "SG" }
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
let getColors = (response) => {
    let url = ''
    request('http://www.gedenktekenoutlet.nl/configurator/phpcore/kleuren/getAll.php',{json: true}, (err, res, body) => {
        if(err) {return console.log(err) };
        res = res.body;
        // this.map = [];
        // for (let i=0;i<res.length;i++){
        //     this.map.push({
        //         name: res[i]['naam'],
        //         url:"http://www.gedenktekenoutlet.nl/configurator/kleuren/s/"+res[i]['afbeelding']
        //     })
        // }
        response.send(res);
    });
};
let getSpecificColor = (response, fileName) => {
    let url="http://www.gedenktekenoutlet.nl/configurator/kleuren/o/"+fileName;
    request({url, encoding: null}, (err, res, buffer) => {
        if (err) { return console.log(err) };
        response.set("Content-Type", "image/jpeg");
        response.send(buffer);
    })

};
let getAllLetterPlates = (response) => {
    request('http://www.gedenktekenoutlet.nl/configurator/phpcore/letterplaat/getAll.php', {json:true}, (err, res, body) => {
        if(err) { return console.log(err) };
        res = res.body;
        response.send(res);
    });
};
let getSpecificLetterPlate = (response, fileName) => {
    let url="http://www.gedenktekenoutlet.nl/configurator/letterplaten/m/"+fileName;
    request({url, encoding: null},(err, res, buffer) => {
        if (err) {return console.log(err) };
        response.set("Content-Type", "image/jpeg");
        response.send(buffer);
    });
};
let getSpecificLetterPlate3dobject = (response, fileName) => {
    let url = "http://www.gedenktekenoutlet.nl/configurator/3Dobjecten/"+fileName;
    request({url, encoding:null}, (err, res, buffer) => {
        if (err) { return console.log(err) };
        response.send(buffer);
    });
};
let getAllOrnaments = (response) => {
    request('http://www.gedenktekenoutlet.nl/configurator/phpcore/ornament/getAll.php', {json:true}, (err, res, body) => {
        if(err) { return console.log(err) };
        res = res.body;
        response.send(res);
    })
};
let getSpecificOrnament = (response, fileName) => {
    let url = "http://www.gedenktekenoutlet.nl/configurator/ornament/"+fileName;
    request({url, encoding:null}, (err, res, buffer) => {
        if(err) { return console.log(err) };
        response.setHeader('Content-Type', 'image/svg+xml');
        response.send(buffer);
    })
};
let getAccessoryCategories = (response) => {
    request('http://www.gedenktekenoutlet.nl/configurator/phpcore/accessoirescat/getAll.php', {json:true}, (err, res, body) => {
        if (err) { return console.log(err) };
        res = res.body;
        response.send(res);
    })
};
let getSpecificAccessoryCategory = (response, fileName) => {
    request('http://www.gedenktekenoutlet.nl/configurator/phpcore/accessoires/getAll.php', {json:true}, (err, res, body) => {
        if (err) { return console.log(err) };
        res = res.body
        final_res = []
        for (var i=0;i<res.length;i++){
            if (res[i]['categorie'] == fileName) {
                final_res.push(res[i])
            }
        }
        response.send(final_res)
    })
    
}
let getAccessoryImage = (response, fileName) => {
    let url = 'http://www.gedenktekenoutlet.nl/configurator/accessoires/m/' + fileName;
    request({url, encoding:null}, (err, res, buffer) => {
        if (err) { return console.log(err) };
        response.set("Content-Type", "image/jpeg");
        response.send(buffer);
    })
};
let getSpecificAccessory = (response, fileName) => {
    let url = 'http://www.gedenktekenoutlet.nl/configurator/accessoires/l/'+fileName;
    request({url, encoding:null}, (err, res, buffer) => {
        if (err) { return console.log(err) };
        response.set("Content-Type", "image/jpeg");
        response.send(buffer);
    })
}

app.listen(port, () => {
    // createMap();
    // getColors();
});

app.get('/get-all-products/:filter', (req, res) => {
    getAllProducts(res, req.params['filter']);
});
app.get('/get-jpg/:fileName', cors(), (req, res) => {
    getjpg(res,req.params['fileName']);
});
app.get('/get-3dobject/:fileName', cors(), (req, res) => {
    get3dObject(res, req.params['fileName']);
});
app.get('/get-colors', (req, res) => {
    getColors(res);
});
app.get('/get-specific-color/:fileName', cors(),(req, res) => {
    getSpecificColor(res, req.params['fileName']);
});
app.get('/get-all-letter-plates', (req, res) => {
    getAllLetterPlates(res);
});
app.get('/get-specific-letter-plate/:fileName', cors(), (req,res)=>{
    getSpecificLetterPlate(res, req.params['fileName']);
});
app.get('/get-specific-letter-plate-3dobject/:fileName', cors(), (req,res) => {
    getSpecificLetterPlate3dobject(res, req.params['fileName']);
});
app.get('/get-all-ornaments', (req, res) => {
    getAllOrnaments(res)
});
app.get('/get-specific-ornament/:fileName', cors(), (req, res) => {
    getSpecificOrnament(res, req.params['fileName']);
});
app.get('/get-accessory-categories', (req, res) => {
    getAccessoryCategories(res);
});
app.get('/get-specific-accessory-category/:fileName', (req, res) => {
    getSpecificAccessoryCategory(res, req.params['fileName']);
});
app.get('/get-accesory-image/:fileName', cors(), (req, res) => {
    getAccessoryImage(res, req.params['fileName']);
});
app.get('/get-specific-accessory/:fileName', cors(), (req,res) => {
    getSpecificAccessory(res, req.params['fileName'])
})

app.post('/print-xml', (req, res, body) => {
    console.log("sending data to client server");
    // console.log(req.body);    
    // axios({
    //     method: 'POST',
    //     headers: { 'content-type': 'application/x-www-form-urlencoded; charset=utf-8' },
    //     url: 'http://www.gedenktekenoutlet.nl/configurator/phpcore/xml.php?actie=save',
    //     data: req.body,
    
    // })
    // .then(function (response) {
    //     console.log("response")
    //     console.log(response)
    //   })
    //   .catch(function(error){
    //     console.log("error")
    //     console.log(error)
    //   })

    axios.post('http://www.gedenktekenoutlet.nl/configurator/phpcore/xml.php?actie=save',
        querystring.stringify({
                postcode: req.body['postcode'], //gave the values directly for testing
                naam: req.body['naam'],
                plaats: req.body['plaats'],
                telefoonnummer: req.body['telefoonnummer'],
                email: req.body['email'],
                // xml: "<userdata><plint>Ja</plint><textures><banden>African Red</banden><tussenstrook>African Red</tussenstrook><letterplaat>African Red</letterplaat><plinten>African Red</plinten><dekplaat>African Red</dekplaat></textures><plintkorting>350</plintkorting><tekstkleur>Goud</tekstkleur><letterplaat>LP01</letterplaat><schrift>null</schrift><grafprijs>2600</grafprijs><letterplaatid>3</letterplaatid><ornament/><graf>18</graf><teksten/><accessoires/><grafnaam>DG-01</grafnaam><tekens>null</tekens><lettertype>null</lettertype></userdata>"
                xml: "<userdata><plint>Ja</plint><grafnaam>"+req.body['grafnaam']+"</grafnaam><graf>"+req.body['graf']+"</graf><grafprijs>"+req.body['grafprijs']+"</grafprijs><textures>"+req.body['textures']+"</textures><letterplaat>"+req.body['letterplaat']+"</letterplaat><letterplaatid>"+req.body['letterplaatid']+"</letterplaatid><schrift>null</schrift><tekens>"+req.body['inscriptions']+"</tekens><lettertype>null</lettertype><accessoires>"+req.body['accessoires']+"</accessoires></userdata>"
                
        }), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }).then(function(response) {            
            var xml = response['data']
            var key;
            parseString(xml, function (err, result) {                                
                key = result['result']['key'][0]
            });            
            res.json({ message: 'Request received!,', 'key': key })
        });
})

app.post('/send-screenshot', (req, res, body) => {        
    axios.post('http://www.gedenktekenoutlet.nl/configurator/phpcore/images.php',
    querystring.stringify({
            img: req.body['img'],
            key: req.body['key'],
            nr: req.body['nr']
    }), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }).then(function(response) {        
        res.json({ message: 'Request received!' })
    });        
})