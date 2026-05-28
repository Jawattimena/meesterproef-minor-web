export async function GET() {
    const apiKey = import.meta.env.KEY_AMSTERDAM;
    const baseUrl = "https://api.data.amsterdam.nl/";
    const endPoint =
        "v1/schoolgebouwen/v2/accommodatie/?_pageSize=100&_format=geojson";

    const response = await fetch(baseUrl + endPoint, {
        headers: {
            "X-Api-Key": apiKey,
        },
    });

    if (!response.ok) {
        return new Response(
            JSON.stringify({
                error: `Amsterdam API fout: ${response.status} ${response.statusText}`,
            }),
            {
                status: response.status,
                headers: { "Content-Type": "application/json" },
            },
        );
    }

    const schoolGeojson = await response.json();

    // Geocode scholen zonder geometrie via PDOK (parallel)
    if (schoolGeojson && schoolGeojson.features) {
        const geocodePromises = schoolGeojson.features.map(async (feature) => {
            if (
                !feature.geometry &&
                feature.properties.adresStraat &&
                feature.properties.adresHuisnummer
            ) {
                try {
                    const query = `${feature.properties.adresStraat} ${feature.properties.adresHuisnummer} ${feature.properties.adresPostcode || ""}`;
                    const res = await fetch(
                        `https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${encodeURIComponent(query)}&fl=centroide_ll`,
                    );
                    const data = await res.json();
                    if (
                        data.response &&
                        data.response.docs &&
                        data.response.docs.length > 0
                    ) {
                        const pt = data.response.docs[0].centroide_ll
                            .replace("POINT(", "")
                            .replace(")", "")
                            .split(" ");
                        feature.geometry = {
                            type: "Point",
                            coordinates: [
                                parseFloat(pt[0]),
                                parseFloat(pt[1]),
                            ],
                        };
                    }
                } catch (e) {
                    console.error("Kon locatie niet ophalen via PDOK:", e);
                }
            }
        });
        await Promise.all(geocodePromises);
    }

    return new Response(JSON.stringify(schoolGeojson), {
        headers: { "Content-Type": "application/json" },
    });
}
