'use strict';

const http=require('http');
const express=require('express');
const cors=require('cors');

const app=express();

const port = process.env.PORT || 4000;
const host = process.env.HOST ||'localhost';

const palvelin = http.createServer(app);

const Tietovarasto = require('./kissavarasto.js');

const optiot = {
    host:'localhost',
    port: 3306,
    user: 'pentti',
    password:'tpLyaaZd',
    database:'kissatietokanta'
};

const kissat=new Tietovarasto(optiot);

app.use(express.json());
app.use(cors());

app.get('/', (req,res)=>res.json({virhe:'resurssi puuttuu'}));

app.get('/kissat', (req,res)=>
    kissat.haeKaikki()
    .then(tulos=>res.json(tulos))
    .catch(virhe => res.json({virhe:virhe.message})));

app.route('/kissat/:numba')
.get((req,res)=>{
    const numero = req.params.numba;
    kissat.hae(numero)
        .then(tulos=>res.json(tulos))
        .catch(virhe=>res.json({virhe:virhe.message}));
})
.delete((req,res)=>{
    const numero = req.params.numba;
    kissat.poista(numero)
        .then(tulos=>res.json(tulos))
        .catch(virhe=>res.json({virhe:virhe.message}))
})
.put((req,res)=>{
    if(!req.body) {
        res.json({virhe:'ei löydy'});
    }
    else {
        const numero=req.params.numba;
        if(req.body.numero!=numero) {
            res.json({virhe:'virheellinen resurssi'});
        }
        else {
            kissat.lisaa(req.body)
            .then(tulos => res.json(tulos))
            .catch(virhe => res.json({ virhe: virhe.message }))
        }
    }
})
.post((req,res)=>{
    if(!req.body) {
        res.json({virhe:'ei löydy'});
    }
    else {
        const numero=req.params.numba;
        if(req.body.numero!=numero) {
            res.json({virhe:'virheellinen resurssi'});
        }
        else {
            kissat.paivita(req.body)
            .then(tulos=>res.json(tulos))
            .catch(virhe => res.json({virhe:virhe.message}))
        }
    }
});

app.all('*',(req,res)=>res.json({virhe:'resurssia ei löydy'}));

palvelin.listen(port,host,()=>
    console.log(`Palvelin ${host} portissa ${port}`)
);