let express = require('express')
let app = express()
let bodyParser = require("body-parser")
let desktop = require('./db/models/computadora')
let usuario = require('./db/models/usuario')
let producto = require('./db/models/producto')
let ticket = require('./db/models/ticket')
let bcrypt = require('bcrypt-nodejs')
let SQLHelper = require('./db/helpers/sql-helper');

//body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.disable('etag');

//CORS Middleware
app.use(function (req, res, next) {
    //Enabling CORS 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});

//Setting up server
var server = app.listen(process.env.PORT || 7070, function () {
    var port = server.address().port;
    // SQLHelper.createConnection();
    console.log("App now running on port", port);
});

/**
 * Usuario
 */
app.post('/api/login', function(req, res){
    var user = req.body.user;
    var pass = req.body.pass;
    usuario.login(user, pass).then(function (val) {
        var password = val[0].contraseña;
        var idUsuario = val[0].idUsuario;

        bcrypt.compare(pass, password, function(err, result) {
            // res == true
            var cDate = new Date()
            if(result) {        
                usuario.createUserSession(idUsuario, cDate).then((sessionResult) => {
                    if(sessionResult) {
                        res.json(sessionResult);
                    }
                })
            } else {
                console.log(err);
            }
        });
    });
})

app.post('/api/createEmployee', function(req, res){
    var name = req.body.name
    var email = req.body.email
    var user = req.body.user;
    var password = req.body.pass;

    var hashPass = bcrypt.hashSync(password);

    usuario.createEmployeeUser(name, email, user, hashPass).then(function(response){
        res.json(response);
    });
})

app.get('/api/getUserByUsername', function(req, res) {
    var user = req.query.user

    usuario.getUserByUsername(user).then(function(response){
        res.json(response);
    });
})

app.get('/api/getUserByEmail', function(req, res) {
    var email = req.query.email

    usuario.getUserByEmail(email).then(function(response){
        res.json(response);
    });
})

app.get('/api/validateIfUserExist', function(req, res) {
    var user = req.query.user
    var email = req.query.email

    usuario.validateIfUserExist(user, email).then(function(response){
        res.json(response);
    });
})

app.get('/api/getUserInfoByUserName', function(req, res) {
    var user = req.query.user

    usuario.getUserInfoByUserName(user).then(function(response){
        res.json(response);
    });
})

/**
 * Computadora
 */
app.get('/api/getComputers', function(req, res) {
    desktop.getDesktops().then(function(response){
        res.json(response);
    });
})

app.get('/api/getDesktopsInUse', function(req, res) {
    desktop.getDesktopsInUse().then(function(response){
        res.json(response);
    });
})

/**
 * Producto
 */
app.get('/api/getProducts', function(req, res) {
    producto.getProducts().then(function(response){
        res.json(response);
    });
})


/**
 * Comprobar archivo de configuracion existente en el sistema de archivos.
 */
app.post('/api/fileExists', function (req, res) {
    try {
        var ipAddress = req.body.ipAddress;
        var pathConfigFile = req.body.pathConfigFile;
        var desktopInfo = {}

        desktop.getDesktopByName().then(result1 => {
            desktopInfo = result1[0];
            //Change desktop status
            desktop.updateDesktopOnline(desktopInfo.idComputadora, true).then(result2 => {
                res.json({ result: true, data: result2[0] });
            });
        });
    } catch (e) {
        res.json({ result: false, message: e });
    }
    
});

app.post('/api/desktopRecord', function(req, res) {
    var idComputadora = req.body.idComputadora;
    var fecha = new Date(req.body.fecha);

    desktop.updateDesktopRecord(idComputadora, fecha).then(result => {
        res.json(result);
    })
})

app.post('/api/setDesktopOnline', function (req, res) {
    try {
        var idComputadora = req.body.idComputadora;
        var enLinea = req.body.enLinea;
        //Change desktop status
        desktop.updateDesktopOnline(idComputadora, enLinea).then(result => {
            res.json({ result: true, data: result[0] });
        });
    } catch (e) {
        res.json({ result: false, message: e });
    }
});

app.get('/api/getDesktop', function(req, res) {
    var localAddress = req.query.localAddress;
    var hostname = req.query.hostname;
    desktop.getDesktop(localAddress, hostname).then(function(response){
        res.json(response);
    });
})

app.get('/api/getProductByName', function(req, res) {
    var name = req.query.name;
    producto.getProductByName(name).then(response => {
        res.json(response);
    });
});

/**
 * Ticket
 * 
 */

 app.post('/api/createTicket', function (req, res) {
    try {
        var tk = req.body;

        ticket.createTicket(tk).then(response => {
            var idTicket = response[0].idTicket;
            var detalleArray = tk.ticketsDetalle;
            var countTicketDetalle = detalleArray.length;

            // detalleArray.forEach(dt => {
            //     ticket.createTicketDetail(dt).then(dtRes => {
            //         res.json({ result: true, response: response });
            //     }).catch(error => {
        
            //     });
            // });
            res.json({ result: true, idTicket: idTicket });
        }).catch(error => {

        });

    } catch (e) {
        res.json({ result: false, message: e });
    }
 });

 app.post('/api/createTicketDetalle', function (req, res) {
    try {
        var dt = req.body;

        ticket.createTicketDetail(dt).then(response => {
            res.json({ result: true, response: response });
        }).catch(error => {

        });

    } catch (e) {
        res.json({ result: false, message: e });
    }
 });