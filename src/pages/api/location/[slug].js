export const prerender = false;

import dataset from "../../../assets/data/CBA_dataset_16-10-2025.json";
import { slugify } from "../../../lib/utils.js";

export async function GET({ params }) {
    const { slug } = params;

    const feature = dataset.features.find(
        (f) => slugify(f.properties.Naam_locatie) === slug
    );

    if (!feature) {
        return new Response(JSON.stringify({ error: "Location not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
        });
    }

    const coords = feature.geometry.coordinates;
    const lng = coords[0];
    const lat = coords[1];
    const naam = feature.properties.Naam_locatie;
    const subcategorie = feature.properties.Subfilter;

    return new Response(
        JSON.stringify({
            lat,
            lng,
            naam,
            subcategorie,
        }),
        {
            status: 200,
            headers: { "Content-Type": "application/json" },
        }
    );
}
