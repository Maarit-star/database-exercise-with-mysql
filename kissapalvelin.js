'use strict';

const http = require('http');
const path = require('path');
const express = require('express');

const app = express();

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

const Tietovarasto = require('./kissavarasto.js');

const optiot = {
    host: 'localhost',
    port: 3306,
    user: 'pentti',
    password: 'tpLyaaZd',
    database: 'kissatietokanta'
}

const kissat = new Tietovarasto(optiot);

const palvelin=http.createServer(app);

const valikkopolku=path.join(__dirname,'valikko.html');

app.set('view engine','ejs');
app.set('views', path.join(__dirname,'sivumallit'));

app.use(express.static(path.join(__dirname,'resurssit')));

app.use(express.urlencoded({extended:false}));

app.get('/', (req,res)=>res.sendFile(valikkopolku));

app.get('/haekaikki', async(req,res)=>{
    try{
        const tulos = await kissat.haeKaikki();
        res.render('haeKaikki', {kissat:tulos});
    }
    catch(virhe) {
        res.render('virhesivu',{viesti:virhe.message});
    }
});

app.get('/hae', (req,res)=>res.render('haeKissa',{
    paaotsikko: 'Kissan haku',
    otsikko: 'Syötä numero',
    toiminto:'hae'
}));

app.post('/hae', async (req,res)=>{
    if(!req.body) {
        palvelinVirhe(res);
    }
    else {
        try {
            const tulos = await kissat.hae(req.body.numero);
            if(tulos.viesti) {
                res.render('tilasivu', {
                    paaotsikko:'Hakutulos',
                    otsikko: 'Tulos',
                    viesti:tulos.viesti
                });
            }
            else {
                res.render('hakutulos', {kissa:tulos});
            }
        }
        catch(virhe) {
            res.render('virhesivu', {viesti:virhe.message});
        }
    }
});

app.get('/poista', (req,res)=>res.render('haeKissa', {
    paaotsikko:'Kissan poisto',
    otsikko:'Syötä numero',
    toiminto:'/poista'
}));

app.post('/poista', async (req,res)=>{
    if(!req.body) {
        palvelinVirhe(res);
    }
    else {
        try {
            const tulos = await kissat.poista(req.body.numero);
            res.render('tilasivu', {
               paaotsikko:'Poiston tulos',
               otsikko:'Poiston tulos',
               viesti:tulos.viesti
            });
        }
        catch(virhe) {
            res.render('virhesivu',{viesti:virhe.message});
        }
    }
});

app.get('/lisaa', (req,res)=>
    res.render('lomake', {
        paaotsikko:'Kissan lisäys',
        otsikko:'Syötä tiedot',
        toiminto:'/lisaa',
        numero:{arvo:'',vainluku:''},
        nimi:{arvo:'',vainluku:''},
        rotu:{arvo:'',vainluku:''},
        painoKg:{arvo:'',vainluku:''},
        pituus:{arvo:'',vainluku:''}
    })
);

app.post('/lisaa', async (req,res) =>{
    if(!req.body) {
        palvelinVirhe(res);
    }
    else {
        try {
            if(req.body.numero && req.body.nimi) {
                const tulos = await kissat.lisaa(req.body);
                res.render('tilasivu', {
                    paaotsikko:'Lisäyksen tulos',
                    otsikko:'Viesti',
                    viesti: tulos.viesti
                });
            }
            else {
                res.redirect('/lisaa');
            }
        }
        catch(virhe) {
            res.render('virhesivu', {viesti: virhe.message });
        }
    }
});

app.get('/paivita', (req,res)=>
    res.render('lomake', {
        paaotsikko:'Kissan päivitys',
        otsikko:'Syötä tiedot',
        toiminto:'/paivita',
        numero:{arvo:'',vainluku:''},
        nimi:{arvo:'',vainluku:'readonly'},
        rotu:{arvo:'',vainluku:'readonly'},
        painoKg:{arvo:'',vainluku:'readonly'},
        pituus:{arvo:'',vainluku:'readonly'}
    })
);

app.post('/paivita', async (req,res)=>{
    if(!req.body) {
        palvelinVirhe(res);
    }
    else {
        try {
            const tulos = await kissat.hae(req.body.numero);
            if(tulos.viesti) {
                res.render('tilasivu', {
                    paaotsikko:'Hakutulos',
                    otsikko:'Viesti',
                    viesti:tulos.viesti
                });
            }
            else {
                res.render('lomake', {
                    paaotsikko:'Kissan päivitys',
                    otsikko:'Syötä tiedot',
                    toiminto: '/paivitatiedot',
                    numero:{arvo:tulos.numero, vainluku:'readonly'},
                    nimi:{arvo:tulos.nimi, vainluku:''},
                    rotu:{arvo:tulos.rotu, vainluku:''},
                    painoKg:{arvo:tulos.painoKg, vainluku:''},
                    pituus:{arvo:tulos.pituus, vainluku:''}
                });
            }
        }
        catch (virhe) {
            res.render('virhesivu', {viesti: virhe.message});
        }
    }
});

app.post('/paivitatiedot', async (req, res)=>{
    if(!req.body) {
        palvelinVirhe(res);
    }
    else {
        try {
            const tulos = await kissat.paivita(req.body);
            res.render('tilasivu', {
                paaotsikko:'Päivityksen tulos',
                otsikko:'Viesti',
                viesti:tulos.viesti
            });
        }
        catch (virhe) {
            res.render('virhesivu', {viesti: virhe.message });
        }
    }
})

palvelin.listen(port,host,
    ()=>console.log(`Palvelin ${host} palvelee portissa ${port}`));

function palvelinVirhe(res) {
    res.status(500).render('virhesivu',{viesti:'Palvelimen virhe'});
}