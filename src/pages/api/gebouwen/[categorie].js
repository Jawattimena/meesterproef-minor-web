export function getStaticPaths() {
    return [
        { params: { categorie: "logiesfunctie" } },
        { params: { categorie: "bijeenkomstfunctie" } },
        { params: { categorie: "gezondheidszorgfunctie" } },
        { params: { categorie: "sportfunctie" } },
        { params: { categorie: "winkelfunctie" } },
        { params: { categorie: "overige gebruiksfunctie" } },
        { params: { categorie: "kantoorfunctie" } },
    ];
}

export async function GET({ params }) {
    const apiKey = import.meta.env.KEY_AMSTERDAM;
    const baseUrl = "https://api.data.amsterdam.nl/";
    const { categorie } = params;

    if (!categorie) {
        return new Response(
            JSON.stringify({ error: "categorie parameter is verplicht" }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
            },
        );
    }

    const endPoint = `v1/bag/verblijfsobjecten/?_pageSize=100&_format=geojson&gebruiksdoel.omschrijving=${encodeURIComponent(categorie)}`;

    const response = await fetch(baseUrl + endPoint, {
        headers: {
            "X-Api-Key": apiKey,
        },
    });

    if (!response.ok) {
        return new Response(
            JSON.stringify({
                error: `BAG API fout: ${response.status} ${response.statusText}`,
            }),
            {
                status: response.status,
                headers: { "Content-Type": "application/json" },
            },
        );
    }

    const geojson = await response.json();

    // Resolve adres voor elk verblijfsobject in parallel
    if (geojson && geojson.features && geojson.features.length > 0) {
        const addressPromises = geojson.features.map(async (feature) => {
            const hoofdadresId = feature.properties.heeftHoofdadresId;
            if (hoofdadresId) {
                try {
                    const res = await fetch(
                        `${baseUrl}v1/bag/nummeraanduidingen/${hoofdadresId}`,
                        {
                            headers: { "X-Api-Key": apiKey },
                        },
                    );
                    if (res.ok) {
                        const data = await res.json();
                        feature.properties.adresStraat =
                            data._links?.ligtAanOpenbareruimte?.title ?? "";
                        feature.properties.adresHuisnummer =
                            data.huisnummer ?? "";
                        feature.properties.adresHuisnummertoevoeging =
                            data.huisnummertoevoeging ?? "";
                        feature.properties.adresHuisletter =
                            data.huisletter ?? "";
                        feature.properties.adresPostcode = data.postcode ?? "";
                    }
                } catch (e) {
                    console.error(
                        `Kon adres niet ophalen voor verblijfsobject ${feature.properties.identificatie}:`,
                        e,
                    );
                }
            }
        });
        await Promise.all(addressPromises);
    }

    return new Response(JSON.stringify(geojson), {
        headers: { "Content-Type": "application/json" },
    });
}
