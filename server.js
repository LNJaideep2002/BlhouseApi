var express = require("express");
var xl = require("xlsx");
var cors = require('cors');
var crypto = require('crypto');
var Razorpay = require('razorpay');
require('dotenv').config();
var app = express();
var wb = xl.readFile("Database.xlsx");
var ws1 = wb.Sheets["Blouse"];
var Blousedata = xl.utils.sheet_to_json(ws1);
var ws2 = wb.Sheets["lace"];
var Lacedata = xl.utils.sheet_to_json(ws2);
var ws3 = wb.Sheets["latkan"];
var Latkandata = xl.utils.sheet_to_json(ws3);
var ws4 = wb.Sheets["patches"];
var Patchesdata = xl.utils.sheet_to_json(ws4);
var ws5 = wb.Sheets["user"];
var Userdata = xl.utils.sheet_to_json(ws5);
var ws6 = wb.Sheets["sleeves"];
var Sleevesdata = xl.utils.sheet_to_json(ws6);
var ws7 = wb.Sheets["orders"];
var Ordersdata = xl.utils.sheet_to_json(ws7);
const port = 3000;
app.listen(process.env.PORT || port, function () {
    console.log("server stated");
});
// app.use(function (req, res, next) {
//     res.header('Access-Control-Allow-Origin', "*");
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//     next();
// });
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
var bodya = require("body-parser");
app.use(cors());
app.use(bodya.urlencoded({ extended: true }));
app.use(bodya.json());
app.use(express.static('public'));
const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET
});
const Updatedatabase = () => {
    var nwb1 = xl.utils.book_new();
    var nws1 = xl.utils.json_to_sheet(Blousedata);
    var nws2 = xl.utils.json_to_sheet(Lacedata);
    var nws3 = xl.utils.json_to_sheet(Latkandata);
    var nws4 = xl.utils.json_to_sheet(Patchesdata);
    var nws5 = xl.utils.json_to_sheet(Userdata);
    var nws6 = xl.utils.json_to_sheet(Sleevesdata);
    var nws7 = xl.utils.json_to_sheet(Ordersdata);
    xl.utils.book_append_sheet(nwb1, nws1, "Blouse");
    xl.utils.book_append_sheet(nwb1, nws2, "lace");
    xl.utils.book_append_sheet(nwb1, nws3, "latkan");
    xl.utils.book_append_sheet(nwb1, nws4, "patches");
    xl.utils.book_append_sheet(nwb1, nws5, "user");
    xl.utils.book_append_sheet(nwb1, nws6, "sleeves");
    xl.utils.book_append_sheet(nwb1, nws7, "orders");
    xl.writeFile(nwb1, "Database.xlsx");
}
app.get("/home", function (req, res) {
    var a = Math.floor(Math.random() * Blousedata.length);
    var Blousearray = [];
    for (i = 0; i < 4; i++) {
        if (a > Blousedata.length - 1)
            a = 0;
        Blousearray[i] = Blousedata[a];
        a++;
    }
    var a = Math.floor(Math.random() * Lacedata.length);
    var Lacearray = [];
    for (i = 0; i < 4; i++) {
        if (a > Lacedata.length - 1)
            a = 0;
        Lacearray[i] = Lacedata[a];
        a++;
    }
    var a = Math.floor(Math.random() * Latkandata.length);
    var Latkanarray = [];
    for (i = 0; i < 4; i++) {
        if (a > Latkandata.length - 1)
            a = 0;
        Latkanarray[i] = Latkandata[a];
        a++;
    }
    var a = Math.floor(Math.random() * Patchesdata.length);
    var Patchesarray = [];
    for (i = 0; i < 4; i++) {
        if (a > Patchesdata.length - 1)
            a = 0;
        Patchesarray[i] = Patchesdata[a];
        a++;
    }
    res.send({ Blouse: Blousearray, Lace: Lacearray, Latkan: Latkanarray, Patch: Patchesarray });
    res.end();
});
app.post("/signup", function (req, res) {
    req.body["ID"] = Userdata.length + 1;
    req.body["wishlist"] = "#undefined";
    req.body["bag"] = "undefined";
    req.body["address"] = "0#undefined";
    req.body["orders"] = "undefined";
    for (var i = 0; i < Userdata.length; i++) {
        if (req.body.phone == Userdata[i].phone || req.body.email == Userdata[i].email) {
            res.send({ st: 400 });
            res.end();
        }
    }
    Userdata.push(req.body);
    Updatedatabase();
    res.send({ st: 200, data: req.body });
    res.end();
});
app.post("/login", function (req, res) {
    console.log(req.body);
    if (req.body.face == true) {
        for (var i = 0; i < Userdata.length; i++) {
            if (req.body.email == Userdata[i].email);
            {
                var data = {};
                for (j in Userdata[i]) {
                    if (j != "password") {
                        data[j] = Userdata[i][j]
                    }
                }
                console.log(data);
                res.send({ st: 200, data });
                res.end();
            }
        }
        req.body["phone"] = "null";
        req.body["password"] = "null";
        req.body["ID"] = Userdata.length + 1;
        req.body["wishlist"] = "#undefined";
        req.body["bag"] = "undefined";
        req.body["address"] = "0#undefined";
        req.body["orders"] = "undefined";
        Userdata.push(req.body);
        Updatedatabase();
        res.send({ st: 200, data: req.body });
        res.end();
    }
    if (req.body.face == false) {
        for (var i = 0; i < Userdata.length; i++) {
            if (req.body.email == Userdata[i].email) {
                if (req.body.password == Userdata[i].password) {
                    var data = {};
                    for (j in Userdata[i]) {
                        if (j != "password") {
                            data[j] = Userdata[i][j]
                        }
                    }
                    console.log(data);
                    res.send({ st: 200, data });
                    res.end();
                }
            }
        }
        res.send({ st: 400 });
        res.end();
    }
});
app.post("/edit", function (req, res) {
    for (var i = 0; i < Userdata.length; i++) {
        if (Userdata[i].ID == req.body.ID) {
            Userdata[i].name = req.body.name;
            Userdata[i].email = req.body.email;
            Userdata[i].phone = req.body.phone;
        }
    }
    Updatedatabase();
    res.send({ st: 200 });
    res.end();
});
app.post("/editaddress", function (req, res) {
    var filteraddress = [];
    for (i = 0; i < Userdata.length; i++) {
        if (req.body.phone == Userdata[i].phone) {
            var address = Userdata[i].address.split("$").map((val) => {
                return {
                    ID: Number(val.split("#")[0]),
                    address: val.split("#")[1]
                }
            });
            for (j = 0; j < address.length; j++) {
                if (req.body.ID != address[j].ID) {
                    filteraddress.push(address[j]);
                }
            }
            var finaladdress = "";
            for (j = 0; j < filteraddress.length; j++) {
                finaladdress += '' + filteraddress[j].ID + "#" + filteraddress[j].address;
                if (j != filteraddress.length - 1) {
                    finaladdress += "$";
                }
            }
            if (finaladdress.length == 0)
                Userdata[i].address = "0#undefined";
            else
                Userdata[i].address = finaladdress;
            Updatedatabase();
        }
    }
    res.send({ st: 200, address: filteraddress });
    res.end();
});
app.post("/wishlist", function (req, res) {
    console.log(req.body);
    var reqarray = req.body;
    var responseData = [];
    for (var i = 0; i < reqarray.length; i++) {
        if (req.body[i] != null) {
            if (req.body[i].type == "lace") {
                for (j = 0; j < Lacedata.length; j++) {
                    if (Number(req.body[i].ID) == Lacedata[j].ID) {
                        responseData.push({ ...Lacedata[j], type: 'Lace', value: 'lace' });
                    }
                }
            }
            if (req.body[i].type == "latkan") {
                for (j = 0; j < Latkandata.length; j++) {
                    if (Number(req.body[i].ID) == Latkandata[j].ID) {
                        responseData.push({ ...Latkandata[j], type: 'Latkan', value: 'latkan' });
                    }
                }
            }
            if (req.body[i].type == "patches") {
                for (j = 0; j < Patchesdata.length; j++) {
                    if (Number(req.body[i].ID) == Patchesdata[j].ID) {
                        responseData.push({ ...Patchesdata[j], type: 'Patches', value: 'patches' });
                    }
                }
            }
            if (req.body[i].type == "blouse") {
                for (j = 0; j < Blousedata.length; j++) {
                    if (Number(req.body[i].ID) == Blousedata[j].ID) {
                        responseData.push({ ...Blousedata[j], type: 'NeckDesigns', value: 'blouse' });
                    }
                }
            }

        }
    }
    res.send({ st: 200, responseData });
    res.end();
});
app.post("/editwishlist", function (req, res) {
    console.log(req.body);
    var response = [];
    if (req.body.status == 1) {
        for (i = 0; i < Userdata.length; i++) {
            if (Userdata[i].ID == req.body.userID) {
                Userdata[i].wishlist += "," + req.body.type + "#" + req.body.ID
            }
        }
        Updatedatabase();
    }
    if (req.body.status == 0) {
        for (j = 0; j < Userdata.length; j++) {
            if (Userdata[j].ID == req.body.userID) {
                var wishlist = Userdata[j].wishlist.split(",").map((val) => {
                    if (val.split("#")[0] != "undefined")
                        return {
                            type: val.split("#")[0],
                            ID: val.split("#")[1],
                        }
                });
                var finalwishlistarray = wishlist.map((val) => {
                    if (val.type != req.body.type || val.ID != req.body.ID)
                        return {
                            type: val.type,
                            ID: val.ID
                        }
                })
                var finalwishlist = ""
                for (i = 0; i < finalwishlistarray.length; i++) {
                    if (finalwishlistarray[i] != undefined) {
                        finalwishlist += finalwishlistarray[i].type + "#" + finalwishlistarray[i].ID + ","
                    }
                }
                finalwishlistarray = finalwishlist.split(",")
                finalwishlist = [];
                for (i = 0; i < finalwishlistarray.length - 1; i++) {
                    finalwishlist.push(finalwishlistarray[i])
                }
                if (finalwishlist.join(",") == 0)
                    Userdata[j].wishlist = "undefined";
                else
                    Userdata[j].wishlist = finalwishlist.join(",");
            }
        }
        Updatedatabase();
    }
    for (var i = 0; i < Userdata.length; i++) {
        if (Userdata[i].ID == req.body.userID) {
            var arr = Userdata[i].wishlist.split(",");
            for (var j = 0; j < arr.length; j++) {
                if (arr[j].split("#")[0] != "undefined")
                    response.push({ type: arr[j].split("#")[0], ID: arr[j].split("#")[1] });
            }
        }
    }
    console.log(response);
    res.send({ st: 200, response });
    res.end();
})
app.post("/getdata", function (req, res) {

    // console.log(req.body.type);
    if (req.body.type == "blouse") {
        res.send({ st: 200, Data: Blousedata });
        res.end();
    }
    if (req.body.type == "lace") {
        res.send({ st: 200, Data: Lacedata });
        res.end();
    }
    if (req.body.type == "latkan") {
        res.send({ st: 200, Data: Latkandata });
        res.end();
    }
    if (req.body.type == "patches") {
        res.send({ st: 200, Data: Patchesdata });
        res.end();
    }
});
app.post("/cart", function (req, res) {
    console.log(req.body);
    var products = req.body.products;
    var resproducts = []
    for (i = 0; i < products.length; i++) {
        if (products[i].type == "lace") {
            for (j = 0; j < Lacedata.length; j++) {
                if (Lacedata[j].ID == products[i].ID)
                    resproducts.push({ ...Lacedata[j], type: "lace", value: "Lace" });
            }
        }
        if (products[i].type == "latkan") {
            for (j = 0; j < Latkandata.length; j++) {
                if (Latkandata[j].ID == products[i].ID)
                    resproducts.push({ ...Latkandata[j], type: "latkan", value: "Latkan" });
            }
        }
        if (products[i].type == "blouse") {
            for (j = 0; j < Blousedata.length; j++) {
                if (Blousedata[j].ID == products[i].ID)
                    resproducts.push({ ...Blousedata[j], type: "blouse", value: "NeckDesigns" });
            }
        }
        if (products[i].type == "patches") {
            for (j = 0; j < Patchesdata.length; j++) {
                if (Patchesdata[j].ID == products[i].ID)
                    resproducts.push({ ...Patchesdata[j], type: "patches", value: "Patches" });
            }
        }
    }
    res.send({ st: 200, products: resproducts });
    res.end();
});
app.post("/delcart", function (req, res) {
    console.log("delete bag");
    var finalbag = "";
    for (i = 0; i < Userdata.length; i++) {
        if (Userdata[i].ID == req.body.ID) {
            var bag = Userdata[i].bag.split("$");
            for (j = 0; j < bag.length; j++) {
                if (bag[j].split("@")[0] != req.body.name) {
                    finalbag += bag[j] + "$";
                }
            }
            var bagarray = finalbag.split("$");
            var bagarray1 = [];
            for (k = 0; k < bagarray.length - 1; k++) {
                bagarray1.push(bagarray[k]);
            }
            console.log(bagarray1);
            if (bagarray1.length == 0) {
                Userdata[i].bag = "undefined";
                finalbag = "undefined";
            }
            else {
                finalbag = bagarray1.join("$");
                Userdata[i].bag = finalbag;
            }
        }
    }
    Updatedatabase();
    res.send({ st: 200, Data: finalbag });
    res.end();
});
app.post("/editcart", function (req, res) {
    console.log(req.body);
    var reqproducts = [];
    var resfinalbag = "";
    for (i = 0; i < Userdata.length; i++) {
        if (Userdata[i].ID == req.body.userID) {
            var bagarray = Userdata[i].bag.split("$");
            var bag = bagarray.map((val) => {
                if (val.length > 5) {
                    const name = val.split("@")[0];
                    const date = val.split("@")[1];
                    const price = val.split("@")[2]
                    const product = val.split("@")[3].split(",").map((val1) => {
                        return {
                            type: val1.split("#")[0],
                            ID: val1.split("#")[1]
                        }
                    });
                    return {
                        price,
                        date,
                        name,
                        products: product
                    }
                }
            });
            console.log(bag[0].products);
            for (j = 0; j < bag.length; j++) {
                if (bag[j].name == req.body.name) {
                    var products = [];
                    for (k = 0; k < bag[j].products.length; k++) {
                        if (bag[j].products[k].type != req.body.type || bag[j].products[k].ID != req.body.ID) {
                            products.push(bag[j].products[k]);
                            reqproducts.push(bag[j].products[k]);
                        }
                    }
                    bag[j].products = products;
                }
            }
            console.log(bag[0].products);
            var finalbag = "";
            for (j = 0; j < bag.length; j++) {
                finalbag += bag[j].name + "@" + bag[j].date + "@" + bag[j].price + "@";
                var finalproducts = "";
                for (k = 0; k < bag[j].products.length; k++) {
                    finalproducts += bag[j].products[k].type + "#" + bag[j].products[k].ID;
                    if (k < bag[j].products.length - 1)
                        finalproducts += ",";
                }
                finalbag += finalproducts;
                if (j < bag.length - 1)
                    finalbag += "$";
            }
            Userdata[i].bag = finalbag;
            resfinalbag = finalbag;
        }
        Updatedatabase();
    }
    var resproducts = [];
    var products = reqproducts;
    for (i = 0; i < products.length; i++) {
        if (products[i].type == "lace") {
            for (j = 0; j < Lacedata.length; j++) {
                if (Lacedata[j].ID == products[i].ID)
                    resproducts.push({ ...Lacedata[j], type: "lace", value: "Lace" });
            }
        }
        if (products[i].type == "latkan") {
            for (j = 0; j < Latkandata.length; j++) {
                if (Latkandata[j].ID == products[i].ID)
                    resproducts.push({ ...Latkandata[j], type: "latkan", value: "Latkan" });
            }
        }
        if (products[i].type == "blouse") {
            for (j = 0; j < Blousedata.length; j++) {
                if (Blousedata[j].ID == products[i].ID)
                    resproducts.push({ ...Blousedata[j], type: "blouse", value: "NeckDesigns" });
            }
        }
        if (products[i].type == "patches") {
            for (j = 0; j < Patchesdata.length; j++) {
                if (Patchesdata[j].ID == products[i].ID)
                    resproducts.push({ ...Patchesdata[j], type: "patches", value: "Patches" });
            }
        }
    }
    res.send({ st: 200, Data: resfinalbag, resproducts });
    res.end();
})
app.post("/product", function (req, res) {
    console.log(req.body);
    var resproducts = [];
    var similar = [];
    if (req.body.type == "lace") {
        for (j = 0; j < Lacedata.length; j++) {
            if (Lacedata[j].ID == req.body.ID) {
                var m = req.body.ID;
                for (n = 0; n < 4; n++) {
                    if (m == Lacedata.length - 1)
                        m = 0;
                    similar.push(Lacedata[m]);
                    m++;
                }
                resproducts.push({ ...Lacedata[j], type: "lace", value: "Lace" });
            }
        }
    }
    if (req.body.type == "latkan") {
        for (j = 0; j < Latkandata.length; j++) {
            if (Latkandata[j].ID == req.body.ID) {
                var m = req.body.ID;
                for (n = 0; n < 4; n++) {
                    if (m == Latkandata.length - 1)
                        m = 0;
                    similar.push(Latkandata[m]);
                    m++;
                }
                resproducts.push({ ...Latkandata[j], type: "latkan", value: "Latkan" });
            }
        }
    }
    if (req.body.type == "blouse") {
        for (j = 0; j < Blousedata.length; j++) {
            if (Blousedata[j].ID == req.body.ID) {
                var m = req.body.ID;
                for (n = 0; n < 4; n++) {
                    if (m == Blousedata.length - 1)
                        m = 0;
                    similar.push(Blousedata[m]);
                    m++;
                }
                resproducts.push({ ...Blousedata[j], type: "blouse", value: "NeckDesigns" });
            }
        }
    }
    if (req.body.type == "patches") {
        for (j = 0; j < Patchesdata.length; j++) {
            if (Patchesdata[j].ID == req.body.ID) {
                var m = req.body.ID;
                for (n = 0; n < 4; n++) {
                    if (m == Patchesdata.length - 1)
                        m = 0;
                    similar.push(Patchesdata[m]);
                    m++;
                }
                resproducts.push({ ...Patchesdata[j], type: "patches", value: "Patches" });
            }
        }
    }
    var imagearray = resproducts[0].image.toString().split("#");
    var images = [];
    for (i = 0; i < 3; i++) {
        if (imagearray[i] != undefined)
            images.push('https://blhouse.herokuapp.com/images/' + resproducts[0].value + '/' + imagearray[i] + '.png');
    }
    console.log(similar);
    res.send({ st: 100, product: { ...resproducts[0], images }, similar });
    res.end();
})
app.post("/addwishlist", function (req, res) {
    console.log(req.body);
    var response = [];
    for (j = 0; j < Userdata.length; j++) {
        if (Userdata[j].ID == req.body.userID) {
            var wishlist = Userdata[j].wishlist.split(",").map((val) => {
                if (val.split("#")[1] != "undefined")
                    return {
                        type: val.split("#")[0],
                        ID: val.split("#")[1],
                    }
                else return
            });
            var t = 0;
            response = wishlist
            for (i = 0; i < wishlist.length; i++) {
                if (wishlist[i] != undefined)
                    if (wishlist[i].type == req.body.type && wishlist[i].ID == req.body.ID)
                        t = 1;
            }
            if (t == 0) {
                response.push({ type: req.body.type, ID: req.body.ID.toString() });
                Userdata[j].wishlist += "," + req.body.type + "#" + req.body.ID;
            }
        }
    }
    Updatedatabase();
    res.send({ st: 200, data: response });
    res.end();
});
app.post("/newbag", function (req, res) {
    console.log(req.body);
    var finalbag = "";
    for (i = 0; i < Userdata.length; i++) {
        if (req.body.ID == Userdata[i].ID) {
            if (Userdata[i].bag == "undefined") {
                var today = new Date();
                var dd = String(today.getDate()).padStart(2, '0');
                var mm = String(today.getMonth() + 1).padStart(2, '0');
                var yyyy = today.getFullYear();
                today = mm + '-' + dd + '-' + yyyy;
                finalbag += req.body.name + "@" + today + "@" + 1000 + "@";
                Userdata[i].bag = finalbag;
            } else {
                var bag = Userdata[i].bag.split("$");
                var bagarray = bag.map((val) => ({ name: val.split("@")[0], date: val.split("@")[1], price: val.split("@")[2], product: val.split("@")[3] }));
                var t = 0;
                console.log(bagarray);
                for (j = 0; j < bagarray.length; j++) {
                    if (bagarray[j].name == req.body.name)
                        t = 1;
                }
                if (t == 1) {
                    res.send({ st: 100 });
                }
                else {
                    var today = new Date();
                    var dd = String(today.getDate()).padStart(2, '0');
                    var mm = String(today.getMonth() + 1).padStart(2, '0');
                    var yyyy = today.getFullYear();
                    today = mm + '-' + dd + '-' + yyyy;
                    finalbag += Userdata[i].bag + "$" + req.body.name + "@" + today + "@" + 1000 + "@";
                    Userdata[i].bag = finalbag;
                }
            }
        }
    }
    Updatedatabase();
    res.send({ st: 200, Data: finalbag });
    res.end();
});
app.post("/editbagitem", function (req, res) {
    console.log(req.body);
    var finalbag = ""
    for (i = 0; i < Userdata.length; i++) {
        if (Userdata[i].ID == req.body.userID) {
            var bag = Userdata[i].bag.split("$");
            for (j = 0; j < bag.length; j++) {
                if (req.body.name == bag[j].split("@")[0]) {
                    if (bag[j].split("@")[3] == 0) {
                        bag[j] += req.body.type + "#" + req.body.ID;
                    }
                    else {
                        bag[j] += "," + req.body.type + "#" + req.body.ID;
                    }
                }
            }
            finalbag = bag.join("$");
            Userdata[i].bag = bag.join("$");
        }
    }
    Updatedatabase();
    res.send({ st: 100, Data: finalbag });
});
app.get("/sleeves", function (req, res) {
    res.send({ st: 100, Data: Sleevesdata, type: "Sleeve" });
    res.end();
});
app.post("/addadress", function (req, res) {
    console.log(req.body);
    var response = "";
    for (i = 0; i < Userdata.length; i++) {
        if (Userdata[i].ID == req.body.userID) {
            if (Userdata[i].address.split("#")[0] == 0)
                Userdata[i].address = "1#" + req.body.doorno + "," + req.body.streetname + "," + req.body.location + "," + req.body.city + "-" + req.body.pincode;
            else
                Userdata[i].address += "$" + (Userdata[i].address.split("$").length + 1) + "#" + req.body.doorno + "," + req.body.streetname + "," + req.body.location + "," + req.body.city + "-" + req.body.pincode;
            response = Userdata[i].address;
            console.log(Userdata[i].address);
        }
    }
    Updatedatabase();
    res.send({ st: 200, Data: response });
    res.end();
});
app.post("/order", async (req, res) => {
    try {
        const options = {
            amount: 50000, // amount in smallest currency unit
            currency: "INR",
            receipt: "receipt_order_7495",
        };

        const order = await instance.orders.create(options);
        if (!order) return res.status(500).send("Some error occured");
        res.json(order);
    } catch (error) {
        res.status(500).send(error);
    }
});
app.post("/verify", async (req, res) => {
    try {
        console.log(req.body);
        const {
            orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
            amount, currency
        } = req.body;
        const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);

        shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

        const digest = shasum.digest("hex");
        if (digest !== razorpaySignature) return res.status(400).json({ msg: "Transaction not legit!" });
        return res.json({
            msg: "success",
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
        });
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
})
app.post("/paymentsuccess", (req, res) => {
    var body = req.body;
    console.log(req.body);
    var body = req.body;
    var content = "";
    var order = ""
    var curaddress = ""
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = mm + '-' + dd + '-' + yyyy;
    order = "" + body.orderID + "," + body.currentbag.ID + "&" + body.name + "@" + today + "@" + body.price + "@";
    console.log(order);
    for (i = 0; i < Userdata.length; i++) {
        if (Userdata[i].ID == req.body.UserID) {
            if (Userdata[i].orders == "undefined") {
                for (j = 0; j < Userdata[i].bag.split("$").length; j++) {
                    if (Userdata[i].bag.split("@")[0] == body.currentbag.name) {

                        content = Userdata[i].bag.split("@")[3];
                    }
                    var address = Userdata[i].address.split("$").map((val) => {
                        return {
                            ID: val.split("#")[0],
                            address: val.split("#")[1]
                        }
                    });
                    for (k = 0; k < address.length; k++) {
                        if (address[k].ID == body.currentbag.addID)
                            curaddress = address[k].address;
                    }
                }
                Userdata[i].orders = order + content;
                console.log(order + content);
            }
            else {
                for (j = 0; j < Userdata[i].bag.split("$").length; j++) {
                    if (Userdata[i].bag.split("@")[0] == body.currentbag.name) {

                        content = Userdata[i].bag.split("@")[3];
                    }
                }
                console.log(order + content);
                var address = Userdata[i].address.split("$").map((val) => {
                    return {
                        ID: val.split("#")[0],
                        address: val.split("#")[1]
                    }
                });
                for (k = 0; k < address.length; k++) {
                    if (address[k].ID == body.currentbag.addID)
                        curaddress = address[k].address;
                }
                Userdata[i].orders += "$" + order + content;
            }
            console.log(Userdata[i].orders);
        }
    }
    var data = {};
    data["userID"] = body.UserID;
    data["orderID"] = body.orderID;
    data["bagname"] = body.currentbag.name;
    data["price"] = body.price;
    data["contents"] = content;
    data["sleeve"] = body.currentbag.ID;
    data["address"] = curaddress;
    Ordersdata.push(data);
    Updatedatabase();
    // console.log(Ordersdata);
    res.send({ st: 100 });
    res.end();
})
app.post("/companyOrder", (req, res) => {
    // console.log(req.body);
    // console.log(Ordersdata);
    for (var n = 0; n < Ordersdata.length; n++) {
        if (req.body.Order == Ordersdata[n].orderID) {
            {
                var resproducts = [];
                var products = [];
                var product = Ordersdata[n].contents.split(",");
                for (j = 0; j < product.length; j++) {
                    products.push({ type: product[j].split("#")[0], ID: product[j].split("#")[1] });
                }
                for (i = 0; i < products.length; i++) {
                    if (products[i].type == "lace") {
                        for (j = 0; j < Lacedata.length; j++) {
                            if (Lacedata[j].ID == products[i].ID)
                                resproducts.push({ ...Lacedata[j], type: "lace", value: "Lace" });
                        }
                    }
                    if (products[i].type == "latkan") {
                        for (j = 0; j < Latkandata.length; j++) {
                            if (Latkandata[j].ID == products[i].ID)
                                resproducts.push({ ...Latkandata[j], type: "latkan", value: "Latkan" });
                        }
                    }
                    if (products[i].type == "blouse") {
                        for (j = 0; j < Blousedata.length; j++) {
                            if (Blousedata[j].ID == products[i].ID)
                                resproducts.push({ ...Blousedata[j], type: "blouse", value: "NeckDesigns" });
                        }
                    }
                    if (products[i].type == "patches") {
                        for (j = 0; j < Patchesdata.length; j++) {
                            if (Patchesdata[j].ID == products[i].ID)
                                resproducts.push({ ...Patchesdata[j], type: "patches", value: "Patches" });
                        }
                    }
                }
                console.log(Ordersdata[n]);
                res.send({ st: 200, Data: { ...Ordersdata[n], Product: resproducts } });
                res.end();
            }
        }
    }
    res.send({ st: 100 });
    res.end();
});
app.get("/check", function (req, res) {
    res.send("ok");
    res.end();
})