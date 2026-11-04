// The price pages' words in each of the site's languages. Prices come from
// the Spanish market (Wallapop and Vinted Spain): other languages say so in
// the lead. Field names of the app are quoted as the app shows them (it has
// Spanish and English only: French, Italian and Polish users see English).
import type { Locale } from "../i18n";

export interface PricesText {
    // The search page's URL segment: /buscar/, /en/search/…
    searchSlug: string;
    badge: string;
    title: string;
    lead: string;
    mosaicAlt: string;
    seoTitle: string;
    seoDescription: (count: number) => string;
    searchPlaceholder: string;
    searchIn: (category: string) => string;
    searchLabel: string;
    catalog: string;
    categoryFilterLabel: string;
    subFilterLabel: string;
    all: string;
    products: string;
    product: string;
    reference: string;
    referenceShort: string;
    // A product's price as a sentence: what someone searching for it came to ask.
    answer: (name: string, price: string, date: string) => string;
    allIn: (category: string, count: number) => string;
    filters: string;
    priceFilter: string;
    minPrice: string;
    maxPrice: string;
    removeFilter: (name: string) => string;
    alsoIn: (category: string) => string;
    themeToggle: string;
    findModel: string;
    goToSearch: string;
    fromCatalog: string;
    previous: string;
    next: string;
    withVallax: string;
    price: string;
    updated: string;
    more: string;
    emptyTitle: string;
    emptyText: string;
    categorySeoTitle: (category: string) => string;
    categorySeoDescription: (category: string, count: number) => string;
    productSeoTitle: (name: string) => string;
    productSeoDescription: (name: string, price: string, date: string) => string;
    viewOn: (marketplace: string) => string;
    nudgeTitle: string;
    nudgeNote: string;
    forVallax: string;
    forVallaxHelp: string;
    keywords: string;
    option: (n: number) => string;
    linkOf: (marketplace: string) => string;
    copy: string;
    copied: string;
    selectIt: string;
    image: string;
    photo: string;
    coverOf: (name: string) => string;
    breadcrumbLabel: string;
    about: string;
    // Followed by the name Vallax, as a link.
    supportedBy: string;
    nonAffiliation: string;
    dateLocale: string;
    categories: Record<string, string>;
}

export const pricesText: Record<Locale, PricesText> = {
    es: {
        searchSlug: "buscar",
        badge: "Tasador de segunda mano",
        title: "Lo que vale lo usado, tasado con datos",
        lead: "Precios de referencia de consolas, videojuegos y componentes, medidos en anuncios de segunda mano. Cada precio lleva su fecha.",
        mosaicAlt: "Mosaico de teselas: una consola portátil gigante sobre el horizonte al atardecer.",
        seoTitle: "Tasador de segunda mano: videojuegos, consolas y componentes | Baremo",
        seoDescription: (n) =>
            `Consulta por cuánto se venden de segunda mano ${n} productos: videojuegos, consolas, tarjetas gráficas, procesadores y más. Precios de Wallapop y Vinted con su fecha.`,
        searchPlaceholder: "Busca un producto: RTX 3060, Zelda, i5 12400…",
        searchIn: (c) => `Busca en ${c.toLowerCase()}…`,
        searchLabel: "Buscar precio",
        catalog: "Catálogo",
        categoryFilterLabel: "Categoría",
        subFilterLabel: "Filtrar más",
        all: "Todo",
        products: "fichas",
        product: "Artículo",
        reference: "Precio de referencia",
        referenceShort: "ref.",
        answer: (name, price, date) =>
            `${name} se vende de segunda mano por unos ${price}. Precio basado en anuncios de Wallapop y Vinted, actualizado el ${date}.`,
        allIn: (c, n) => `Todas las fichas de ${c.toLowerCase()} (${n})`,
        filters: "Filtros",
        priceFilter: "Precio de referencia",
        minPrice: "Precio mínimo",
        maxPrice: "Precio máximo",
        removeFilter: (n) => `Quitar filtro ${n}`,
        alsoIn: (c) => `También en ${c}`,
        themeToggle: "Cambiar entre tema claro y oscuro",
        findModel: "Tasar un modelo",
        goToSearch: "Buscar y filtrar",
        fromCatalog: "Del catálogo",
        previous: "Anteriores",
        next: "Siguientes",
        withVallax: "Con el apoyo de Vallax",
        price: "Precio",
        updated: "Actualizado",
        more: "Ver más",
        emptyTitle: "Aún no tenemos ficha de eso.",
        emptyText: "Prueba con menos palabras o mira otra categoría.",
        categorySeoTitle: (c) => `Precios de ${c.toLowerCase()} de segunda mano | Baremo`,
        categorySeoDescription: (c, n) =>
            `Por cuánto se venden de segunda mano ${n} ${c.toLowerCase()}: precios de Wallapop y Vinted, con su fecha.`,
        productSeoTitle: (name) => `${name} de segunda mano: precio | Baremo`,
        productSeoDescription: (name, price, date) =>
            `${name} se vende de segunda mano por unos ${price} (${date}). Precio de Wallapop y Vinted.`,
        viewOn: (m) => `Ver en ${m}`,
        nudgeTitle: "¿Lo quieres más barato?",
        nudgeNote:
            "Vallax te avisa en el móvil en cuanto se publica uno que encaje. Es la app que apoya Baremo.",
        forVallax: "Para tu búsqueda en Vallax",
        forVallaxHelp:
            "Las palabras clave van en «¿Qué buscas?». Los enlaces se pegan en los filtros de cada plataforma y traen su categoría y sus filtros.",
        keywords: "Palabras clave",
        option: (n) => `opción ${n}`,
        linkOf: (m) => `Enlace de ${m}`,
        copy: "Copiar",
        copied: "Copiado",
        selectIt: "Selecciónalo",
        image: "Imagen",
        photo: "Foto",
        coverOf: (name) => `Portada de ${name}`,
        breadcrumbLabel: "Ruta",
        about: "Precios de segunda mano de Wallapop y Vinted.",
        supportedBy: "Proyecto independiente con el apoyo de",
        nonAffiliation:
            "Baremo no está afiliado ni respaldado por Wallapop, Vinted, Milanuncios ni Todocolección. Son marcas registradas de sus respectivos titulares.",
        dateLocale: "es-ES",
        categories: {
            game: "Videojuegos",
            console: "Consolas",
            pc_part: "Componentes de PC",
            cpu: "Procesadores",
            gpu: "Tarjetas gráficas",
            motherboard: "Placas base",
            ram: "Memoria RAM",
            psu: "Fuentes de alimentación",
            pc_case: "Cajas de PC",
            storage: "Almacenamiento",
            cpu_cooler: "Refrigeración de CPU",
            pc_combo: "Placa base + procesador",
        },
    },
    en: {
        searchSlug: "search",
        badge: "Second-hand price guide · Spain",
        title: "What used things are worth, priced with data",
        lead: "Reference prices for consoles, video games and PC parts, measured on second-hand listings in Spain. Every price carries its date.",
        mosaicAlt: "Tile mosaic: a giant handheld console over the horizon at sunset.",
        seoTitle: "Second-hand price guide: video games, consoles and PC parts | Baremo",
        seoDescription: (n) =>
            `What ${n} products sell for second-hand in Spain: video games, consoles, graphics cards, processors and more. Wallapop and Vinted prices, with their date.`,
        searchPlaceholder: "Search a product: RTX 3060, Zelda, i5 12400…",
        searchIn: (c) => `Search ${c.toLowerCase()}…`,
        searchLabel: "Search a price",
        catalog: "Catalogue",
        categoryFilterLabel: "Category",
        subFilterLabel: "Narrow down",
        all: "All",
        products: "entries",
        product: "Item",
        reference: "Reference price",
        referenceShort: "ref.",
        answer: (name, price, date) =>
            `${name} sells second-hand for around ${price} in Spain. Based on Wallapop and Vinted listings, updated ${date}.`,
        allIn: (c, n) => `All ${c.toLowerCase()} (${n})`,
        filters: "Filters",
        priceFilter: "Reference price",
        minPrice: "Minimum price",
        maxPrice: "Maximum price",
        removeFilter: (n) => `Remove filter ${n}`,
        alsoIn: (c) => `Also in ${c}`,
        themeToggle: "Switch between light and dark theme",
        findModel: "Price a model",
        goToSearch: "Search and filter",
        fromCatalog: "From the catalogue",
        previous: "Previous",
        next: "Next",
        withVallax: "Supported by Vallax",
        price: "Price",
        updated: "Updated",
        more: "Show more",
        emptyTitle: "We don't have a listing for that yet.",
        emptyText: "Try fewer words or another category.",
        categorySeoTitle: (c) => `Second-hand ${c.toLowerCase()} prices | Baremo`,
        categorySeoDescription: (c, n) =>
            `What ${n} ${c.toLowerCase()} sell for second-hand in Spain: Wallapop and Vinted prices, with their date.`,
        productSeoTitle: (name) => `${name} second-hand price | Baremo`,
        productSeoDescription: (name, price, date) =>
            `${name} sells second-hand for around ${price} in Spain (${date}). Wallapop and Vinted price.`,
        viewOn: (m) => `View on ${m}`,
        nudgeTitle: "Want it for less?",
        nudgeNote:
            "Vallax alerts you on your phone as soon as a matching one is listed. It's the app that supports Baremo.",
        forVallax: "For your Vallax search",
        forVallaxHelp:
            "Keywords go in “What are you looking for?”. The links go in each platform's filters and bring its category and filters.",
        keywords: "Keywords",
        option: (n) => `option ${n}`,
        linkOf: (m) => `${m} link`,
        copy: "Copy",
        copied: "Copied",
        selectIt: "Select it",
        image: "Image",
        photo: "Photo",
        coverOf: (name) => `${name} cover`,
        breadcrumbLabel: "Breadcrumb",
        about: "Second-hand prices from Wallapop and Vinted.",
        supportedBy: "Independent project supported by",
        nonAffiliation:
            "Baremo is not affiliated with or endorsed by Wallapop, Vinted, Milanuncios or Todocolección. They are trademarks of their respective owners.",
        dateLocale: "en-GB",
        categories: {
            game: "Video games",
            console: "Consoles",
            pc_part: "PC parts",
            cpu: "Processors",
            gpu: "Graphics cards",
            motherboard: "Motherboards",
            ram: "RAM",
            psu: "Power supplies",
            pc_case: "PC cases",
            storage: "Storage",
            cpu_cooler: "CPU coolers",
            pc_combo: "Motherboard + CPU",
        },
    },
    fr: {
        searchSlug: "recherche",
        badge: "Argus de l'occasion · Espagne",
        title: "Ce que vaut l'occasion, estimé avec des données",
        lead: "Prix de référence des consoles, jeux vidéo et composants, mesurés sur des annonces d'occasion en Espagne. Chaque prix porte sa date.",
        mosaicAlt: "Mosaïque de tesselles : une console portable géante sur l'horizon au coucher du soleil.",
        seoTitle: "Argus de l'occasion : jeux vidéo, consoles et composants PC | Baremo",
        seoDescription: (n) =>
            `Le prix d'occasion de ${n} produits en Espagne : jeux vidéo, consoles, cartes graphiques, processeurs et plus. Prix Wallapop et Vinted, avec leur date.`,
        searchPlaceholder: "Cherchez un produit : RTX 3060, Zelda, i5 12400…",
        searchIn: (c) => `Chercher dans ${c.toLowerCase()}…`,
        searchLabel: "Chercher un prix",
        catalog: "Catalogue",
        categoryFilterLabel: "Catégorie",
        subFilterLabel: "Affiner",
        all: "Tout",
        products: "fiches",
        product: "Article",
        reference: "Prix de référence",
        referenceShort: "réf.",
        answer: (name, price, date) =>
            `${name} se vend d'occasion autour de ${price} en Espagne. Prix basé sur les annonces Wallapop et Vinted, mis à jour le ${date}.`,
        allIn: (c, n) => `Toutes les fiches : ${c.toLowerCase()} (${n})`,
        filters: "Filtres",
        priceFilter: "Prix de référence",
        minPrice: "Prix minimum",
        maxPrice: "Prix maximum",
        removeFilter: (n) => `Retirer le filtre ${n}`,
        alsoIn: (c) => `Aussi dans ${c}`,
        themeToggle: "Basculer entre thème clair et sombre",
        findModel: "Estimer un modèle",
        goToSearch: "Chercher et filtrer",
        fromCatalog: "Du catalogue",
        previous: "Précédents",
        next: "Suivants",
        withVallax: "Avec le soutien de Vallax",
        price: "Prix",
        updated: "Mis à jour",
        more: "Voir plus",
        emptyTitle: "Nous n'avons pas encore de fiche pour ça.",
        emptyText: "Essayez avec moins de mots ou une autre catégorie.",
        categorySeoTitle: (c) => `Prix des ${c.toLowerCase()} d'occasion | Baremo`,
        categorySeoDescription: (c, n) =>
            `Le prix d'occasion de ${n} ${c.toLowerCase()} en Espagne : prix Wallapop et Vinted, avec leur date.`,
        productSeoTitle: (name) => `${name} d'occasion : prix | Baremo`,
        productSeoDescription: (name, price, date) =>
            `${name} se vend d'occasion autour de ${price} en Espagne (${date}). Prix Wallapop et Vinted.`,
        viewOn: (m) => `Voir sur ${m}`,
        nudgeTitle: "Vous le voulez moins cher ?",
        nudgeNote:
            "Vallax vous prévient sur votre mobile dès qu'une annonce correspond. C'est l'application qui soutient Baremo.",
        forVallax: "Pour votre recherche Vallax",
        forVallaxHelp:
            "Les mots-clés vont dans « What are you looking for? ». Les liens se collent dans les filtres de chaque plateforme et apportent sa catégorie et ses filtres.",
        keywords: "Mots-clés",
        option: (n) => `option ${n}`,
        linkOf: (m) => `Lien ${m}`,
        copy: "Copier",
        copied: "Copié",
        selectIt: "Sélectionnez-le",
        image: "Image",
        photo: "Photo",
        coverOf: (name) => `Jaquette de ${name}`,
        breadcrumbLabel: "Fil d'Ariane",
        about: "Prix d'occasion issus de Wallapop et Vinted.",
        supportedBy: "Projet indépendant soutenu par",
        nonAffiliation:
            "Baremo n'est ni affilié ni approuvé par Wallapop, Vinted, Milanuncios ou Todocolección. Ces marques appartiennent à leurs propriétaires respectifs.",
        dateLocale: "fr-FR",
        categories: {
            game: "Jeux vidéo",
            console: "Consoles",
            pc_part: "Composants PC",
            cpu: "Processeurs",
            gpu: "Cartes graphiques",
            motherboard: "Cartes mères",
            ram: "Mémoire RAM",
            psu: "Alimentations",
            pc_case: "Boîtiers PC",
            storage: "Stockage",
            cpu_cooler: "Refroidissement CPU",
            pc_combo: "Carte mère + processeur",
        },
    },
    it: {
        searchSlug: "cerca",
        badge: "Quotazioni dell'usato · Spagna",
        title: "Quanto vale l'usato, stimato con i dati",
        lead: "Prezzi di riferimento di console, videogiochi e componenti, misurati sugli annunci dell'usato in Spagna. Ogni prezzo ha la sua data.",
        mosaicAlt: "Mosaico di tessere: una console portatile gigante sull'orizzonte al tramonto.",
        seoTitle: "Quotazioni dell'usato: videogiochi, console e componenti PC | Baremo",
        seoDescription: (n) =>
            `Quanto si vendono usati ${n} prodotti in Spagna: videogiochi, console, schede video, processori e altro. Prezzi di Wallapop e Vinted, con la data.`,
        searchPlaceholder: "Cerca un prodotto: RTX 3060, Zelda, i5 12400…",
        searchIn: (c) => `Cerca in ${c.toLowerCase()}…`,
        searchLabel: "Cerca un prezzo",
        catalog: "Catalogo",
        categoryFilterLabel: "Categoria",
        subFilterLabel: "Restringi",
        all: "Tutto",
        products: "schede",
        product: "Articolo",
        reference: "Prezzo di riferimento",
        referenceShort: "rif.",
        answer: (name, price, date) =>
            `${name} si vende usato a circa ${price} in Spagna. Prezzo basato sugli annunci di Wallapop e Vinted, aggiornato il ${date}.`,
        allIn: (c, n) => `Tutte le schede: ${c.toLowerCase()} (${n})`,
        filters: "Filtri",
        priceFilter: "Prezzo di riferimento",
        minPrice: "Prezzo minimo",
        maxPrice: "Prezzo massimo",
        removeFilter: (n) => `Rimuovi filtro ${n}`,
        alsoIn: (c) => `Anche in ${c}`,
        themeToggle: "Passa dal tema chiaro a quello scuro",
        findModel: "Valuta un modello",
        goToSearch: "Cerca e filtra",
        fromCatalog: "Dal catalogo",
        previous: "Precedenti",
        next: "Successivi",
        withVallax: "Con il sostegno di Vallax",
        price: "Prezzo",
        updated: "Aggiornato",
        more: "Mostra altri",
        emptyTitle: "Non abbiamo ancora una scheda per questo.",
        emptyText: "Prova con meno parole o un'altra categoria.",
        categorySeoTitle: (c) => `Prezzi di ${c.toLowerCase()} usati | Baremo`,
        categorySeoDescription: (c, n) =>
            `Quanto si vendono usati ${n} ${c.toLowerCase()} in Spagna: prezzi di Wallapop e Vinted, con la data.`,
        productSeoTitle: (name) => `${name} usato: prezzo | Baremo`,
        productSeoDescription: (name, price, date) =>
            `${name} si vende usato a circa ${price} in Spagna (${date}). Prezzo di Wallapop e Vinted.`,
        viewOn: (m) => `Vedi su ${m}`,
        nudgeTitle: "Lo vuoi a meno?",
        nudgeNote:
            "Vallax ti avvisa sul telefono appena ne viene pubblicato uno adatto. È l'app che sostiene Baremo.",
        forVallax: "Per la tua ricerca su Vallax",
        forVallaxHelp:
            "Le parole chiave vanno in «What are you looking for?». I link si incollano nei filtri di ogni piattaforma e ne portano categoria e filtri.",
        keywords: "Parole chiave",
        option: (n) => `opzione ${n}`,
        linkOf: (m) => `Link di ${m}`,
        copy: "Copia",
        copied: "Copiato",
        selectIt: "Selezionalo",
        image: "Immagine",
        photo: "Foto",
        coverOf: (name) => `Copertina di ${name}`,
        breadcrumbLabel: "Percorso",
        about: "Prezzi dell'usato da Wallapop e Vinted.",
        supportedBy: "Progetto indipendente sostenuto da",
        nonAffiliation:
            "Baremo non è affiliato né approvato da Wallapop, Vinted, Milanuncios o Todocolección. I marchi appartengono ai rispettivi titolari.",
        dateLocale: "it-IT",
        categories: {
            game: "Videogiochi",
            console: "Console",
            pc_part: "Componenti PC",
            cpu: "Processori",
            gpu: "Schede video",
            motherboard: "Schede madri",
            ram: "Memoria RAM",
            psu: "Alimentatori",
            pc_case: "Case PC",
            storage: "Archiviazione",
            cpu_cooler: "Dissipatori CPU",
            pc_combo: "Scheda madre + processore",
        },
    },
    pl: {
        searchSlug: "szukaj",
        badge: "Wycena rzeczy używanych · Hiszpania",
        title: "Ile warte są rzeczy używane, wycenione na podstawie danych",
        lead: "Ceny referencyjne konsol, gier i podzespołów, mierzone na ogłoszeniach z drugiej ręki w Hiszpanii. Każda cena ma swoją datę.",
        mosaicAlt: "Mozaika z kafelków: ogromna konsola przenośna nad horyzontem o zachodzie słońca.",
        seoTitle: "Wycena rzeczy używanych: gry, konsole i podzespoły PC | Baremo",
        seoDescription: (n) =>
            `Za ile sprzedaje się z drugiej ręki ${n} produktów w Hiszpanii: gry, konsole, karty graficzne, procesory i więcej. Ceny z Wallapop i Vinted z datą.`,
        searchPlaceholder: "Szukaj produktu: RTX 3060, Zelda, i5 12400…",
        searchIn: (c) => `Szukaj: ${c.toLowerCase()}…`,
        searchLabel: "Szukaj ceny",
        catalog: "Katalog",
        categoryFilterLabel: "Kategoria",
        subFilterLabel: "Zawęź",
        all: "Wszystko",
        products: "kart",
        product: "Artykuł",
        reference: "Cena referencyjna",
        referenceShort: "ref.",
        answer: (name, price, date) =>
            `${name} sprzedaje się z drugiej ręki za około ${price} w Hiszpanii. Cena na podstawie ogłoszeń z Wallapop i Vinted, aktualizacja: ${date}.`,
        allIn: (c, n) => `Wszystkie karty: ${c.toLowerCase()} (${n})`,
        filters: "Filtry",
        priceFilter: "Cena referencyjna",
        minPrice: "Cena minimalna",
        maxPrice: "Cena maksymalna",
        removeFilter: (n) => `Usuń filtr ${n}`,
        alsoIn: (c) => `Także w: ${c}`,
        themeToggle: "Przełącz między jasnym a ciemnym motywem",
        findModel: "Wyceń model",
        goToSearch: "Szukaj i filtruj",
        fromCatalog: "Z katalogu",
        previous: "Poprzednie",
        next: "Następne",
        withVallax: "Przy wsparciu Vallax",
        price: "Cena",
        updated: "Aktualizacja",
        more: "Pokaż więcej",
        emptyTitle: "Nie mamy jeszcze takiej karty.",
        emptyText: "Spróbuj wpisać mniej słów lub wybierz inną kategorię.",
        categorySeoTitle: (c) => `${c} z drugiej ręki: ceny | Baremo`,
        categorySeoDescription: (c, n) =>
            `Za ile sprzedaje się z drugiej ręki ${n} produktów (${c.toLowerCase()}) w Hiszpanii: ceny z Wallapop i Vinted z datą.`,
        productSeoTitle: (name) => `${name} z drugiej ręki: cena | Baremo`,
        productSeoDescription: (name, price, date) =>
            `${name} sprzedaje się z drugiej ręki za około ${price} w Hiszpanii (${date}). Cena z Wallapop i Vinted.`,
        viewOn: (m) => `Zobacz na ${m}`,
        nudgeTitle: "Chcesz taniej?",
        nudgeNote:
            "Vallax powiadomi cię na telefonie, gdy tylko pojawi się pasująca oferta. To aplikacja, która wspiera Baremo.",
        forVallax: "Do wyszukiwania w Vallax",
        forVallaxHelp:
            "Słowa kluczowe wpisz w „What are you looking for?”. Linki wklej w filtrach każdej platformy: przenoszą jej kategorię i filtry.",
        keywords: "Słowa kluczowe",
        option: (n) => `opcja ${n}`,
        linkOf: (m) => `Link ${m}`,
        copy: "Kopiuj",
        copied: "Skopiowano",
        selectIt: "Zaznacz",
        image: "Obraz",
        photo: "Zdjęcie",
        coverOf: (name) => `Okładka ${name}`,
        breadcrumbLabel: "Ścieżka",
        about: "Ceny z drugiej ręki z Wallapop i Vinted.",
        supportedBy: "Niezależny projekt wspierany przez",
        nonAffiliation:
            "Baremo nie jest powiązane ani wspierane przez Wallapop, Vinted, Milanuncios lub Todocolección. Znaki należą do ich właścicieli.",
        dateLocale: "pl-PL",
        categories: {
            game: "Gry wideo",
            console: "Konsole",
            pc_part: "Podzespoły PC",
            cpu: "Procesory",
            gpu: "Karty graficzne",
            motherboard: "Płyty główne",
            ram: "Pamięć RAM",
            psu: "Zasilacze",
            pc_case: "Obudowy PC",
            storage: "Dyski",
            cpu_cooler: "Chłodzenie CPU",
            pc_combo: "Płyta główna + procesor",
        },
    },
};
