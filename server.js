const express = require('express')
const app = express()
const server = require('http').createServer(app)
const bodyparser = require('body-parser')
const io = require('socket.io').listen(server)

const expressValidator = require('express-validator')
const expressSession = require('express-session')

let KappModel = require('./modele/kappModel')

//
app.set('view engine', 'ejs')

const path = require('path')

//middleware
app.use(bodyparser.urlencoded({
    extended: false
}))
app.use(express.static(path.join(__dirname, 'public')))

app.use(expressValidator())

app.use(expressSession({
    secret: "adelino",
    saveUninitialized: false,
    resave: false
}))
//
app.use((req, res, next) => {
    //
    if (req.session.success === undefined) {
        req.session.success = true
    }
    //
    if (req.session.error === undefined) {
        req.session.error = undefined
    }
    //
    next()
})
//
let mKappModel = new KappModel()

//calculs les grandeurs
function calculs_mesures() {
    //
    mKappModel.process((grandeurs) => {
        io.sockets.emit("mesures", grandeurs)
    })
}

//routes
//mesures
app.get('/', (req, res) => {
    res.render('kapp', {
        titre: "Modèle de Kapp",
        kapp_datas: mKappModel.getParametres(),
        succes: req.session.success,
        error: req.session.error
    })
})
//post
app.post('/', (req, res) => {
    //check
    req.check('kapp_m', 'Problème de saisie pour m').isFloat({
        gt: 0.0
    });
    req.check('kapp_rp', 'Problème de saisie pour Rp').isFloat({
        gt: 0.0
    });
    req.check('kapp_lp', 'Problème de saisie pour Lp').isFloat({
        gt: 0.0
    });
    req.check('kapp_rs', 'Problème de saisie pour Rs').isFloat({
        gt: 0.0
    });
    req.check('kapp_xs', 'Problème de saisie pour Xs').isFloat({
        gt: 0.0
    });
    //
    let m = parseFloat(req.body.kapp_m)
    let rp = parseFloat(req.body.kapp_rp)
    let lp = parseFloat(req.body.kapp_lp)
    let rs = parseFloat(req.body.kapp_rs)
    let xs = parseFloat(req.body.kapp_xs)
    //
    mKappModel.setParametres(m, rp, lp, rs, xs)
    //
    let les_erreurs = req.validationErrors();

    if (les_erreurs) {
        req.session.error = les_erreurs
        req.session.success = false
        res.redirect('/')
    } else {
        req.session.error = undefined
        req.session.success = true
        //
        calculs_mesures();
        //
        res.redirect('/charge')
    }
})

//modele de kapp
app.get('/charge', (req, res) => {
    res.render('home', {
        titre: "Tranformateur en charge",
    })
})

//not found
app.get('*', (req, res) => {
    res.render('notfound', {
        titre: "Page not found"
    })
})

//listen port 8080
const PORT = process.env.PORT || 8080

server.listen(PORT, () => {
    console.log("Serveur actif sur port: " + PORT)
})

//socket
io.sockets.on('connection', (socket) => {
    //console.log('nouvelle connection etablie')

    //emit les reglages u1,module,phase
    socket.on('reglages', (the_datas) => {
        //
        mKappModel.setReglages(the_datas)
        //console.log(reglages)
        calculs_mesures()
    })
})

//exit
process.on('SIGINT',()=>{
    io.sockets.emit('exit')
    process.exit()
})
