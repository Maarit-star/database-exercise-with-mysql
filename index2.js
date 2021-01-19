// index2.js myös testausta varten

'use strict';

const Tietovarasto = require('./kissavarasto.js');

const optiot = {
    host: 'localhost',
    port: 3306,
    user: 'pentti',
    password: 'tpLyaaZd',
    database: 'kissatietokanta'
}

const kissat = new Tietovarasto(optiot);

(async ()=>{
    const uusi={
        numero:8,
        nimi:'Rontti',
        rotu:'siamilainen',
        painoKg:'15',
        pituus:'43'
    }
    console.log(await kissat.haeKaikki());
    console.log(await kissat.lisaa(uusi));
    console.log(await kissat.haeKaikki());

})();