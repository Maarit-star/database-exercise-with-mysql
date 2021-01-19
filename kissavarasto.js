'use strict';

const Tietokanta = require('./tietokanta.js');

const ohjelmavirhe = virhe => new Error('Ohjelmavirhe'+(virhe?': '+virhe:''));

// Sql lauseet
const haeKaikkiSql='select numero,nimi,rotu,painoKg,pituus from kissa';
const haeSql='select numero,nimi,rotu,painoKg,pituus from kissa where numero=?';
const lisaaSql='insert into kissa (nimi,rotu,painoKg,pituus,numero) values(?,?,?,?,?)';
const paivitaSql='update kissa set nimi=?, rotu=?, painoKg=?, pituus=? where numero=?';
const poistaSql='delete from kissa where numero=?';

//käytetään sekä lisäyksessä että päivityksessä
//      insert into kissa (nimi,        rotu,           painoKg,     pituus,        numero)
//       update kissa set nimi=?,    rotu=?,           painoKg=?,   pituus=?   where numero=?
const tiedot = kissa => [kissa.nimi, kissa.rotu, kissa.painoKg, kissa.pituus, +kissa.numero ];

//Kissatietokanta-luokka
module.exports = class Kissatietokanta {
    constructor(optiot) {
        this.varasto= new Tietokanta(optiot);
    }

    haeKaikki() {
        return new Promise( async (resolve,reject) => {
            try{
                const tulos= 
                    await this.varasto.suoritaKysely(haeKaikkiSql);
                if(tulos.tulosjoukko) {
                    resolve(tulos.kyselynTulos);
                }
                else {
                    reject(ohjelmavirhe());
                }
            }
            catch(virhe) {
                reject(ohjelmavirhe(virhe.message));
            }
        })
    } // haeKaikki loppu

    hae(id) {
        return new Promise(async (resolve,reject)=>{
            try{
                const tulos=await this.varasto.suoritaKysely(haeSql, [+id]);
                if(tulos.tulosjoukko) {
                    if(tulos.kyselynTulos.length>0){
                        resolve(tulos.kyselynTulos[0]);
                    }
                    else {
                        resolve({viesti:`Numerolla ${id} ei löytynyt tietoa`});
                    }
                }
                else {
                    reject(ohjelmavirhe('ei tulosjoukkoa'));
                }
            }
            catch(virhe) {
                reject(ohjelmavirhe(virhe.message));
            }
        });
         // hae loppu
    } 
    
    lisaa(uusiKissa) {
        return new Promise(async (resolve,reject)=>{
            try{
                const hakutulos= await this.hae(uusiKissa.numero);
                if(hakutulos.viesti) {
                    const tulos= 
                        await this.varasto.suoritaKysely(lisaaSql, tiedot(uusiKissa));
                    if(tulos.kyselynTulos.muutetutRivitLkm===1) {
                        resolve({viesti: 'kissa lisättiin'});
                    }
                    else {
                        resolve({viesti: 'kissaa ei lisätty'});
                    }
                }
                else {
                    resolve({viesti:`numero ${uusiKissa.numero} oli jo käytössä`});
                }
            }
            catch(virhe) {
                reject(ohjelmavirhe(virhe.message));
            }
        });
    }//lisaa loppu

    poista(id) {
        return new Promise(async (resolve, reject)=>{
            try{
                const tulos= await this.varasto.suoritaKysely(poistaSql,[+id]);
                if(tulos.kyselynTulos.muutetutRivitLkm===0){
                    resolve(
                        {viesti:'Numerolla ei löytynyt kissaa. Mitään ei poistettu'}
                    );
                }
                else {
                    resolve({viesti:`Kissa numerolla ${id} poistettiin`});
                }
            }
            catch(virhe){
                reject(ohjelmavirhe(virhe.message));
            }
        });
    } //poista loppu
 
    paivita(kissa) {
        return new Promise(async (resolve, reject)=>{
            try{
                const tulos=await this.varasto.suoritaKysely(paivitaSql, tiedot(kissa));
                if(tulos.kyselynTulos.muutetutRivitLkm===0) {
                    resolve({viesti:'Tietoja ei päivitetty'});
                }
                else {
                    resolve({viesti:`Kissan ${kissa.numero} tiedot päivitettiin`});
                }
            }
            catch(virhe) {
                reject(ohjelmavirhe(virhe.message));
            }
        });
    } //paivitys loppu


} //luokan loppu