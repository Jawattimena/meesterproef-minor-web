import dataset from "../../../assets/data/CBA_dataset_16-10-2025.json";

// Alle unieke subfilters uit de dataset (excl. Zakelijke diensten)
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
