// -----------------------------------------------------------------------------
// MARK: Bestand uploaden naar Algolia zodat we het kunnen gebruiken in onze app
// -----------------------------------------------------------------------------

import { algoliasearch } from 'algoliasearch';
// fs = file system, hiermee kan je bestanden lezen van je computer
import fs from "fs";

// dotenv laadt de .env bestand in zodat process.env werkt
import 'dotenv/config';

const client = algoliasearch(
    process.env.ALGOLIA_APP_ID,
    process.env.ALGOLIA_ADMIN_KEY
);

// lege lijst waar alle locaties in gaan komen.
const alleLocaties = [];


async function upload() {

    // --- Lokale JSON ---
    console.log('Lokale data ophalen...');

    // Lees het JSON bestand van de computer met fs.readFileSync
    // 'utf-8' = lees het als tekst (niet als binaire code)
    // JSON.parse = zet de tekst om naar JavaScript data
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
                categorie: p.Hoofdfilter?.trim().toLowerCase().replace(/ /g, '_') ?? 'lokaal', // .replace(/ /g, '_') → spaties vervangen door _
                subcategorie: p.Subfilter?.trim().toLowerCase() ?? '',
                lat: coordinaten[1],
                lng: coordinaten[0],
            });
        }
    });

    console.log(`Totaal: ${alleLocaties.length} locaties`);

    // Uploaden naar Algolia

    // indexName = de naam van ons index in Algolia
    // objects = de lijst met locaties
    console.log('Uploaden naar Algolia...');
    await client.saveObjects({
        indexName: 'locations',
        objects: alleLocaties
    });

    console.log('Klaar! Alles staat nu in Algolia.');
}

upload();