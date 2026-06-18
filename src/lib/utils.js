import { ACCESSIBILITY_GROUPS } from './constants.js';
import { accessibilityJaSvg, accessibilityNoSvg } from './icons.js';

export function getVisualHoofdfilter(hoofdfilter, subfilter) {
    const h = (hoofdfilter || "").trim();
    const s = (subfilter || "").trim();

    if (s === "Sportaccommodaties" || s === "Zwembaden") { // Voor zwembaden is geen hoofdfilter dus we maken die aan
        return "Sport en Spel";
    }
    if (s === "Stations" || s === "Parkeergarages") {
        return "Vervoer";
    }
    if (s === "Educatieve tuinen") {
        return "Cultuur en attracties";
    }
    return h;
}

export function normalizeAccessibilityValue(value) {
    const normalized = String(value ?? "").trim();
    return normalized || "Onbekend";
}

export function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

export function getAccessibilityBadgeLabel(value) {
    const normalized = normalizeAccessibilityValue(value);
    return normalized;
}

export function getWebsiteHref(value) {
    const website = String(value ?? "").trim();
    if (!website) return "";
    return /^https?:\/\//i.test(website)
        ? website
        : `https://${website}`;
}

export function getTelephoneHref(value) {
    return `tel:${String(value ?? "").replace(/[^\d+]/g, "")}`;
}

export function getTooltipHtml(properties, selectedCategories) {
    const name = properties.Naam_locatie || "Onbekende locatie";

    // Als er geen categorieën zijn geselecteerd, tonen we alleen de naam (geen bolletjes)
    if (!selectedCategories || selectedCategories.length === 0) {
        return `
            <div class="am-tooltip-container">
                <div class="am-tooltip-name">${name}</div>
            </div>
        `;
    }

    let yes = 0;
    let no = 0;
    let unknown = 0;

    // Verzamel alle kolommen die we moeten tellen in een simpele array
    const fieldsToCount = [];
    for (let index = 0; index < selectedCategories.length; index++) {
        const cat = selectedCategories[index];
        const fields = ACCESSIBILITY_GROUPS[cat];
        if (fields) {
            for (let j = 0; j < fields.length; j++) {
                const f = fields[j];
                // Alleen toevoegen als het er nog niet in zit, om dubbel tellen te voorkomen
                if (!fieldsToCount.includes(f)) {
                    fieldsToCount.push(f);
                }
            }
        }
    }

    // Doorloop de verzamelde kolommen en bepaal het aantal Ja's, Nee's en Onbekenden
    for (let i = 0; i < fieldsToCount.length; i++) {
        const field = fieldsToCount[i];
        let value = properties[field];
        // Zorg ervoor dat we geen foutmeldingen krijgen als de waarde leeg of undefined is
        if (value === undefined || value === null) {
            value = "";
        }
        const val = String(value).trim().toLowerCase();

        if (val === "ja") {
            yes = yes + 1;
        } else if (val === "nee") {
            no = no + 1;
        } else {
            unknown = unknown + 1;
        }
    }

    // Geef de HTML terug inclusief de groene, rode en grijze tellertjes
    return `
        <div class="am-tooltip-container">
            <div class="am-tooltip-name">${name}</div>
            <div class="am-tooltip-badges">
                <span class="am-tooltip-badge am-tooltip-badge--yes">${accessibilityJaSvg} <span>${yes}</span></span>
                <span class="am-tooltip-badge am-tooltip-badge--no">${accessibilityNoSvg} <span>${no}</span></span>
            </div>
        </div>
    `;
}

// Zet een locatienaam om in een schone, veilige URL-slug (bijv. "Ons' Lieve Heer" -> "ons-lieve-heer")
export function slugify(text) {
    if (!text) return "";
    return text
        .toString()
        .toLowerCase()                  // 1. Alles omzetten naar kleine letters
        .trim()                         // 2. Spaties aan het begin en einde weghalen
        .normalize("NFD")               // 3. Accenten loskoppelen van letters (bijv. de '´' losmaken van 'é')
        .replace(/[\u0300-\u036f]/g, "") // 4. De losgekoppelde accent-tekens volledig verwijderen
        .replace(/\s+/g, "-")           // 5. Alle spaties vervangen door een liggend streepje (-)
        .replace(/[^\w\-]+/g, "")       // 6. Speciale tekens (zoals leestekens, quotes) verwijderen
        .replace(/\-\-+/g, "-")         // 7. Dubbele streepjes (bijv. --) inkorten naar een enkel streepje (-)
        .replace(/^-+/, "")             // 8. Eventuele streepjes aan het begin van de tekst verwijderen
        .replace(/-+$/, "");            // 9. Eventuele streepjes aan het einde van de tekst verwijderen
}
