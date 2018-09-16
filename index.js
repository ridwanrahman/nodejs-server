let express = require('express');
let cors = require('cors');
const http = require('http');
const request = require('request');
app = express();

var bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
app.use(bodyParser.xml());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
        console.log(res);
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
    console.log("asldkjfklj");
    // console.log(req)
    console.log(req.body)
    res.status(200).end();
})


