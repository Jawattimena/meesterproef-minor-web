# Astro Starter Kit: Basics

```sh
npm create astro@latest -- --template basics
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── Welcome.astro
│   ├── layouts
│   │   └── Layout.astro
│   └── pages
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

# Bron
**pdok**
 https://api.pdok.nl/

 **amsterdam api**
 https://api.data.amsterdam.nl/v1/docs/datasets/bag.html

# AI Bronnen
Ik werk aan een Astro/Leaflet kaart met data uit de Amsterdam API. Sommige schoolgebouwen hebben geen bruikbare GeoJSON Point-coördinaten. Ik wil daarom met de PDOK Locatieserver zoeken op adres, huisnummer en postcode. De PDOK response geeft een veld `centroide_ll` terug als tekst in de vorm `POINT(lon lat)`. Hoe kan ik deze string met JavaScript omzetten naar een GeoJSON Point object met numerieke coordinates? Leg vooral uit waarom `.replace('POINT(', '').replace(')', '').split(' ')` wordt gebruikt.