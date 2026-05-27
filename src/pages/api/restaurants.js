export async function GET() {
    const apiKey = import.meta.env.KEY_AMSTERDAM;
    const baseUrl = "https://api.data.amsterdam.nl/";
    const endPoint =
        "v1/horeca/v1/exploitatievergunning/?zaakCategorie=Restaurant&_pageSize=10&_format=geojson";

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
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}