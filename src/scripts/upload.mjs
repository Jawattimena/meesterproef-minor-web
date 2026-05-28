import { algoliasearch } from 'algoliasearch';
import fs from "fs";
import 'dotenv/config';


// ----------------------------------------
// Verbinding maken met Algolia en Amsterdam API
// ----------------------------------------

const client = algoliasearch(
    process.env.ALGOLIA_APP_ID,
    process.env.ALGOLIA_ADMIN_KEY
);

const amsterdamApiKey = process.env.KEY_AMSTERDAM;
const amsterdamUrl = 'https://api.data.amsterdam.nl/';

// Dit is de lijst waar alle locaties in komen
const alleLocaties = [];


// ----------------------------------------
// Hulpfunctie: data ophalen uit Amsterdam API
// ----------------------------------------

async function haalDataOp(url) {
    const antwoord = await fetch(url, {
        headers: { 'X-Api-Key': amsterdamApiKey }
    });
    const data = await antwoord.json();
    return data.features; // geeft de lijst met locaties terug
}


// ----------------------------------------
// Hoofd functie: alles ophalen en uploaden
// ----------------------------------------

async function upload() {


    // --- Cafés ---
    console.log('Cafés ophalen...');
    const cafes = await haalDataOp(
        amsterdamUrl + 'v1/horeca/v1/exploitatievergunning/?zaakCategorie=Caf%C3%A9&_pageSize=10&_format=geojson'
    );

    cafes.forEach(function(cafe) {
        const coordinaten = cafe.geometry?.coordinates;
        if (coordinaten) {
            alleLocaties.push({
                objectID: `cafe_${cafe.properties.identificatie}`,
                naam: cafe.properties.zaaknaam ?? 'Onbekende café',
                categorie: 'horeca_toerisme',
                subcategorie: 'bars',
                adres: cafe.properties.adres ?? '',
                lat: coordinaten[1],
                lng: coordinaten[0],
            });
        }
    });
    console.log(`${alleLocaties.length} cafés toegevoegd`);


    // --- Restaurants ---
    console.log('Restaurants ophalen...');
    const restaurants = await haalDataOp(
        amsterdamUrl + 'v1/horeca/v1/exploitatievergunning/?zaakCategorie=Restaurant&_pageSize=10&_format=geojson'
    );

    restaurants.forEach(function(restaurant) {
        const coordinaten = restaurant.geometry?.coordinates;
        if (coordinaten) {
            alleLocaties.push({
                objectID: `restaurant_${restaurant.properties.identificatie}`,
                naam: restaurant.properties.zaaknaam ?? 'Onbekend restaurant',
                categorie: 'horeca_toerisme',
                subcategorie: 'restaurants',
                adres: restaurant.properties.adres ?? '',
                lat: coordinaten[1],
                lng: coordinaten[0],
            });
        }
    });
    console.log(`Restaurants toegevoegd`);


    // --- Hotels ---
    console.log('Hotels ophalen...');
    const hotels = await haalDataOp(
        amsterdamUrl + 'v1/horeca/v1/exploitatievergunning/?zaakCategorie=Hotel&_pageSize=10&_format=geojson'
    );

    hotels.forEach(function(hotel) {
        const coordinaten = hotel.geometry?.coordinates;
        if (coordinaten) {
            alleLocaties.push({
                objectID: `hotel_${hotel.properties.identificatie}`,
                naam: hotel.properties.zaaknaam ?? 'Onbekend hotel',
                categorie: 'horeca_toerisme',
                subcategorie: 'hotels',
                adres: hotel.properties.adres ?? '',
                lat: coordinaten[1],
                lng: coordinaten[0],
            });
        }
    });
    console.log(`Hotels toegevoegd`);


    // --- Scholen ---
    console.log('Scholen ophalen...');
    const scholen = await haalDataOp(
        amsterdamUrl + 'v1/schoolgebouwen/v2/accommodatie/?_pageSize=10&_format=geojson'
    );

    scholen.forEach(function(school) {
        const coordinaten = school.geometry?.coordinates;
        if (coordinaten) {
            alleLocaties.push({
                objectID: `school_${school.properties.accommodatieId}`,
                naam: school.properties.juridischEigenaar ?? 'Onbekende school',
                categorie: 'openbare_diensten',
                subcategorie: 'scholen',
                adres: `${school.properties.adresStraat ?? ''} ${school.properties.adresHuisnummer ?? ''}`.trim(),
                lat: coordinaten[1],
                lng: coordinaten[0],
            });
        }
    });
    console.log(`Scholen toegevoegd`);


    // --- Ziekenhuizen en zorg ---
    console.log('Zorg ophalen...');
    const zorg = await haalDataOp(
        amsterdamUrl + 'v1/bag/verblijfsobjecten/?_pageSize=10&_format=geojson&gebruiksdoel.omschrijving=gezondheidszorgfunctie'
    );

    zorg.forEach(function(gebouw) {
        const coordinaten = gebouw.geometry?.coordinates;
        if (coordinaten) {
            alleLocaties.push({
                objectID: `zorg_${gebouw.properties.identificatie}`,
                naam: 'Zorglocatie',
                categorie: 'gezondheid_zorg',
                subcategorie: 'ziekenhuizen',
                adres: '',
                lat: coordinaten[1],
                lng: coordinaten[0],
            });
        }
    });
    console.log(`Zorg toegevoegd`);


    // --- Sport ---
    console.log('Sport ophalen...');
    const sport = await haalDataOp(
        amsterdamUrl + 'v1/bag/verblijfsobjecten/?_pageSize=10&_format=geojson&gebruiksdoel.omschrijving=sportfunctie'
    );

    sport.forEach(function(gebouw) {
        const coordinaten = gebouw.geometry?.coordinates;
        if (coordinaten) {
            alleLocaties.push({
                objectID: `sport_${gebouw.properties.identificatie}`,
                naam: 'Sportlocatie',
                categorie: 'sport_spel',
                subcategorie: 'sportaccommodaties',
                adres: '',
                lat: coordinaten[1],
                lng: coordinaten[0],
            });
        }
    });
    console.log(`Sport toegevoegd`);


    // --- Winkels ---
    console.log('Winkels ophalen...');
    const winkels = await haalDataOp(
        amsterdamUrl + 'v1/bag/verblijfsobjecten/?_pageSize=10&_format=geojson&gebruiksdoel.omschrijving=winkelfunctie'
    );

    winkels.forEach(function(gebouw) {
        const coordinaten = gebouw.geometry?.coordinates;
        if (coordinaten) {
            alleLocaties.push({
                objectID: `winkel_${gebouw.properties.identificatie}`,
                naam: 'Winkel',
                categorie: 'winkelen',
                subcategorie: 'supermarkten',
                adres: '',
                lat: coordinaten[1],
                lng: coordinaten[0],
            });
        }
    });
    console.log(`Winkels toegevoegd`);


    // --- Cultuur ---
    console.log('Cultuur ophalen...');
    const cultuur = await haalDataOp(
        amsterdamUrl + 'v1/bag/verblijfsobjecten/?_pageSize=10&_format=geojson&gebruiksdoel.omschrijving=bijeenkomstfunctie'
    );

    cultuur.forEach(function(gebouw) {
        const coordinaten = gebouw.geometry?.coordinates;
        if (coordinaten) {
            alleLocaties.push({
                objectID: `cultuur_${gebouw.properties.identificatie}`,
                naam: 'Cultuurlocatie',
                categorie: 'cultuur_kunst',
                subcategorie: 'theaters',
                adres: '',
                lat: coordinaten[1],
                lng: coordinaten[0],
            });
        }
    });
    console.log(`Cultuur toegevoegd`);


// --- Lokale JSON ---
console.log('Lokale data ophalen...');
const lokaleJson = JSON.parse(
    fs.readFileSync('./src/assets/data/CBA_dataset_16-10-2025.json', 'utf-8')
);

lokaleJson.features.forEach(function(item) {
    const coordinaten = item.geometry?.coordinates;
    const p = item.properties;

    if (coordinaten) {
        alleLocaties.push({
            objectID: `lokaal_${p.Naam_locatie}`,
            naam: p.Naam_locatie,
            adres: `${p.adres ?? ''} ${p.Huisnummer ?? ''}`.trim(),
            postcode: p.Postcode ?? '',
            categorie: p.Hoofdfilter?.trim().toLowerCase().replace(/ /g, '_') ?? 'lokaal',
            subcategorie: p.Subfilter?.trim().toLowerCase() ?? '',
            lat: coordinaten[1],
            lng: coordinaten[0],
        });
    }
});

console.log('Lokale data toegevoegd');


    // ----------------------------------------
    // Alles uploaden naar Algolia
    // ----------------------------------------

    console.log(`Totaal ${alleLocaties.length} locaties uploaden...`);

    await client.saveObjects({
        indexName: 'locations',
        objects: alleLocaties
    });

    console.log('Klaar! Alles staat nu in Algolia.');
}


// Script starten
upload();