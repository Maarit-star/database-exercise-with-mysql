// index.js testausta varten

'use strict';

const Tietovarasto = require('./kissavarasto.js');

const optiot = {
    host: 'localhost',
    port: 3306,
    user: 'pentti',
    password:'tpLyaaZd',
    database:'kissatietokanta'
}

const kissat=new Tietovarasto(optiot);

async function haeKaikkiKissat() {
    try{
        const tulos = await kissat.haeKaikki();
        for(let kissa of tulos) {
            console.log(`${kissa.nimi}: ${kissa.rotu}`);
        }
    }
    catch(virhe) {
        console.log(virhe.message);
    }
}

async function haeKissa(numero) {
    try{
        const tulos=await kissat.hae(numero);
        console.log(tulos);
    }
    catch(virhe) {
        console.log(virhe.message);
    }
}
haeKaikkiKissat();