import { algoliasearch } from 'algoliasearch';
import fs from "fs";
import 'dotenv/config';

const client = algoliasearch(
    process.env.ALGOLIA_APP_ID,
    process.env.ALGOLIA_ADMIN_KEY
);

const alleLocaties = [];


async function upload() {

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

    console.log(`Totaal: ${alleLocaties.length} locaties`);

    // Uploaden naar Algolia
    console.log('Uploaden naar Algolia...');
    await client.saveObjects({
        indexName: 'locations',
        objects: alleLocaties
    });

    console.log('Klaar! Alles staat nu in Algolia.');
}

upload();