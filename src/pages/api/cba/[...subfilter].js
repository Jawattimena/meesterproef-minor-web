import dataset from "../../../assets/data/CBA_dataset_16-10-2025.json";

// Alle unieke subfilters uit de dataset (excl. Zakelijke diensten)
// Gebruikt Set voor unieke waarden: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
// en Spread-syntaxis (...) om de Set om te zetten naar een array: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
const allSubfilters = [
    ...new Set(
        dataset.features
            .filter((f) => f.properties.Hoofdfilter.trim() !== "Zakelijke diensten")
            .map((f) => f.properties.Subfilter.trim()),
    ),
];

export function getStaticPaths() {
    return allSubfilters.map((sub) => ({
        params: { subfilter: sub },
    }));
}

export async function GET({ params }) {
    const { subfilter } = params;

    const features = dataset.features.filter(
        (f) =>
            f.properties.Subfilter.trim() === subfilter &&
            f.properties.Hoofdfilter.trim() !== "Zakelijke diensten",
    );

    return new Response(
        JSON.stringify({
            type: "FeatureCollection",
            features,
        }),
        {
            headers: { "Content-Type": "application/json" },
        },
    );
}
