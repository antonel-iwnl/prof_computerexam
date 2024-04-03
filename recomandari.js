const express = require('express') // pentru express web framework | Aplicatia este un server web.
var fs = require('fs') // pentru a putea accesa fisiere
const Database = require('better-sqlite3') // pentru a folosi baze de date sqlite
var cndv = require('./cndv.js') // pentru a folosi functia noastra, care pregateste tabelul

const app = express() // obiectul aplicatie
const port = 3006 // portul la care asculta aplicatia

const db = new Database('./utilizatori.db', { verbose: console.log }) // | optiunea prezinta interogarile 

var start = fs.readFileSync('./start.html') // Citim fisierul, care va fi inceputul stringului raspuns.
var end = `</body>` // Sfarsitul stringului raspuns.

// Ca sa preia ce s-a trimis cu post din formular. Daca nu punem optiunea, primim mesaj "deprecated".
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname)) // Ca sa transmita fisierul css.
app.use(express.json()); // Parse JSON bodies (as sent by API clients)

app.get('/', function (req, res) {
    res.sendFile('recomandari.html', { root: __dirname })
})

app.get('/inregistrare', (req, res) => {
    console.log("inregistrare")
    res.sendFile('inregistrare.html', { root: __dirname })
})

app.get('/openpins', function (req, res) {
    res.sendFile('openpins_async.html', { root: __dirname })
})

app.get('/savepins', function (req, res) {
    var q = db.prepare(`
        INSERT INTO coordonate
        VALUES(? ,?)
    `);
    q.run(req.query.lat, req.query.lng);
    res.send('ok'); // Doar ca sa nu primim mesaj ca nu s-a dat raspuns la fetch.
})

// Aduce in memorie informatiile despre locurile de cazare.
app.get('/getcoords', function (req, res) {
    var q = db.prepare(`
        SELECT *
        FROM cazari
    `);
    var preturi = q.all()
    console.log(preturi);
    res.send(preturi);
})

app.get('/sortarePret', function (req, res) {
    var q = db.prepare(`
        SELECT id_cazare
        FROM cazari 
        ORDER BY pret
    `);
    var preturi = q.all()
    console.log(preturi);
    res.send(preturi);
})

app.get('/sortareRating', function (req, res) {
    var q = db.prepare(`
        SELECT id_cazare
        FROM cazari 
        ORDER BY rating DESC
    `);
    var ratings = q.all()
    console.log(ratings);
    res.send(ratings);
})

app.get('/sortareRaportCP', function (req, res) {
    var q = db.prepare(`
        SELECT id_cazare
        FROM cazari 
        ORDER BY rating / pret DESC
    `);
    var cp = q.all()
    console.log(cp);
    res.send(cp);
})

app.post('/inregistrare', (req, res) => {
    console.log("body: ", req.body)
    var nume = req.body.nume // variabile care retin ceea ce am primit din formular
    var prenume = req.body.prenume
    var CNP = req.body.CNP
    var nr_telefon = req.body.nr_telefon
    var parola = req.body.parola
    var stmt = db.prepare(`
        INSERT INTO utilizatori
        VALUES (?, ?, ?, ?, ?)
    `) // Pregatim instructiunea.
    stmt.run(nume, prenume, CNP, nr_telefon, parola); // Se executa instructiunea, folosind parametri.

    //TODO Este suficient sa fie dat un mesaj ca inserarea s-a facut.
    stmt = db.prepare(`
        SELECT *
        FROM utilizatori
    `) // Pregatim instructiunea.
    var utilizatori = stmt.all() // Se executa instructiunea.
    var u = cndv.tabel(utilizatori) // Rezultatul returnat este un vector de linii. Obtinem codul HTML al tabelului.
    u = u + `<p>${__dirname}<\p>`

    res.send(start + u + end) // Concatenam si transmitem browserului.
    res.end()
    return
})

app.get('/autentificare', (req, res) => {
    console.log("autentificare")
    res.sendFile('autentificare.html', { root: __dirname })
})

app.get('/hartaclienti', (req, res) => {
    console.log("autentificare")
    res.sendFile('hartaclienti.html', { root: __dirname })
})

app.post('/verificare_date', (req, res) => {
    var CNP = req.body.dcnp
    var parola = req.body.dparola
    var stmt = db.prepare(`
        SELECT COUNT(*) AS u
        FROM utilizatori
        WHERE (CNP = ?) AND (parola = ?)
    `)
    var c = stmt.all(CNP, parola);
    res.send(c)
})

app.listen(port, () => {
    var d = new Date()
    h = d.getHours()
    m = d.getMinutes()
    s = d.getSeconds()
    console.log(`${h}:${m}:${s}`)
    console.log(`Aplicatia asteapta la http://localhost:${port}`)
})
