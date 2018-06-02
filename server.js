let express = require('express')
let app = express()
let bodyParser = require("body-parser")
let desktop = require('./db/models/computadora')
let usuario = require('./db/models/usuario')
let producto = require('./db/models/producto')
let ticket = require('./db/models/ticket')
let bcrypt = require('bcrypt-nodejs')
let SQLHelper = require('./db/helpers/sql-helper');
const Enumerable = require('linq');

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

app.get('/api', function (req, res) {
    res.send('Express is working on IISNode!');
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

app.post('/api/logout', function(req, res){
    const idSesion = +req.body.idSesion

    usuario.logout(idSesion).then(function(response) {
        res.json({ result: true, data: response });
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
    var minutos = +req.body.minutos;
    var fecha = new Date(req.body.fecha);

    desktop.updateDesktopRecord(idComputadora, fecha, minutos).then(result => {
        res.json(result);
    });
})

app.post('/api/setDesktopOnline', function (req, res) {
    try {
        var idComputadora = req.body.idComputadora;
        var enLinea = req.body.enLinea === 'true' ? 1 : 0;
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

app.get('/api/getLatestDesktopRecord', function (req, res) {
    try {
        var idComputadora = +req.query.idComputadora;
        //Change desktop status
        desktop.getLatestDesktopRecord(idComputadora).then(response => {
            res.json({ result: true, data: response[0] });
        });
    } catch (e) {
        res.json({ result: false, message: e });
    }
});

/**
 * Ticket
 * 
 */

 app.post('/api/createTicket', function (req, res) {
    try {
        var tk = req.body;

        ticket.createTicket(tk).then(result => {
            console.log(result);
            res.json({ result: true, ticket: result[0] });
        }).catch(err => {

        });

    } catch (e) {
        res.json({ result: false, message: e });
    }
 });

 app.post('/api/createTicketDetalle', function (req, res) {
    try {
        var dt = req.body;

        ticket.createTicketDetail(dt.strInsert).then(response => {
            res.json({ result: true });
        }).catch(error => {

        });

    } catch (e) {
        res.json({ result: false, message: e });
    }
 });

 app.post('/api/updateTicketDetalle', function (req, res) {
    try {
        var idTicketDetalle = +req.body.idTicketDetalle;
        var cantidad = +req.body.cantidad;

        ticket.updateTicketDetail(idTicketDetalle, cantidad).then(response => {
            res.json({ result: true });
        }).catch(error => {

        });

    } catch (e) {
        res.json({ result: false, message: e });
    }
 });

 app.post('/api/deleteTicketDetalle', function (req, res) {
    try {
        var idTicketDetalle = req.body.idTicketDetalle;

        ticket.deleteTicketDetail(idTicketDetalle).then(response => {
            res.json({ result: true });
        }).catch(error => {

        });

    } catch (e) {
        res.json({ result: false, message: e });
    }
 });

 app.post('/api/deleteTicket', function (req, res) {
    try {
        var idTicket = +req.body.idTicket;

        ticket.deleteTicket(idTicket).then(response => {
            res.json({ result: true });
        }).catch(error => {

        });

    } catch (e) {
        res.json({ result: false, message: e });
    }
 });

 app.post('/api/payTicket', function (req, res) {
    try {
        var t = req.body;

        ticket.payTicket(t).then(response => {
            res.json({ result: true });
        }).catch(error => {

        });

    } catch (e) {
        res.json({ result: false, message: e });
    }
 });

 app.post('/api/getTicket', function (req, res) {
    try {
        const idTicket = +req.body.idTicket;

        ticket.getTicketByID(idTicket).then(response => {
            res.json({ result: true, data: response });
        }).catch(error => {

        });

    } catch (e) {
        res.json({ result: false, message: e });
    }
 });

 app.get('/api/getTicketsPending', function (req, res) {
    try {
        
        ticket.getTicketsPending().then(response => {
            let t = [];
            let ti = [];
            let det = [];
            t = response;
            if (t.length > 0) {
                t.forEach(elemento => {
                    // tabla ticket
                    if (elemento['idTicketDetalle'] === undefined) {
                        ti.push(elemento);
                    } else { // tabla ticket detalle
                        det.push(elemento);
                    }
                });

                // obtener el detalle de cada ticket
                ti.forEach(ele => {
                    ele.ticketsDetalle = Enumerable.from(det).where(w => w.idTicket === ele.idTicket).toArray();
                });

               res.json({ result: true, data: ti });
            }
            
        }).catch(error => {
            
        });

    } catch (e) {
        res.json({ result: false, message: e });
    }
 });

 app.get('/api/getRecordsNoPay', function (req, res) {
    try {

        ticket.getRecordsNoPay().then(response => {
            res.json({ result: true, data: response });
        }).catch(error => {

        });

    } catch (e) {
        res.json({ result: false, message: e });
    }
 });
