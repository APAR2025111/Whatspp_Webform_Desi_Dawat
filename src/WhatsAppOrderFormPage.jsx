import React, { useMemo, useState } from "react";

const MENU_GROUPS = [
  {
    title: "Curries",
    titleFi: "Curry-annokset",
    items: [
      { id: "chole", name: "Chole", nameFi: "Kikhernecurry", price: 6.99, description: "Chickpeas cooked in a flavorful Indian onion-tomato gravy with aromatic spices.", descriptionFi: "Mausteisia kikherneitä haudutettuna maukkaassa intialaisessa sipuli-tomaattikastikkeessa.", image: "/images/order-menu/chole.jpg", allergenCodes: [] },
      { id: "rajma", name: "Rajma", nameFi: "Kidneypapucurry", price: 6.99, description: "Red kidney beans slow-cooked in a rich, spiced tomato-based gravy.", descriptionFi: "Punaisia kidneypapuja haudutetaan täyteläisessä, mausteisessa tomaattikastikkeessa.", image: "/images/order-menu/rajma.jpg", allergenCodes: [] },
      { id: "dal-makhani", name: "Dal Makhani", nameFi: "Täyteläinen mustalinssicurry", price: 8.99, description: "Creamy slow-cooked black lentils prepared in a rich, buttery Indian style.", descriptionFi: "Mustia linssejä haudutetaan hitaasti täyteläiseen, voita sisältävään intialaiseen tapaan.", image: "/images/order-menu/dal-makhani.jpg", allergenCodes: ["A4"] },
      { id: "butter-paneer", name: "Butter Paneer Masala", nameFi: "Paneer-juustoa tomaattisessa voikastikkeessa", price: 9.99, description: "Paneer cooked in a smooth, mildly spiced buttery tomato gravy.", descriptionFi: "Paneer-juustoa pehmeässä, miedosti maustetussa tomaatti-voikastikkeessa.", image: "/images/order-menu/butter-paneer-masala.jpg", allergenCodes: ["A4", "A5"] },
      { id: "kadhai-paneer", name: "Kadhai Paneer", nameFi: "Paneer-juustoa kadhai-mausteilla", price: 8.99, description: "Paneer cooked with peppers, onions and aromatic kadhai spices.", descriptionFi: "Paneer-juustoa paprikan, sipulin ja aromaattisten kadhai-mausteiden kanssa.", image: "/images/order-menu/kadhai-paneer.jpg", allergenCodes: ["A4", "A5"] },
      { id: "mutter-paneer", name: "Mutter Paneer", nameFi: "Paneer-juustoa ja vihreitä herneitä curryssa", price: 8.99, description: "Paneer and green peas cooked together in a flavorful Indian curry.", descriptionFi: "Paneer-juustoa ja vihreitä herneitä maukkaassa intialaisessa curryssa.", image: "/images/order-menu/mutter-paneer.jpg", allergenCodes: ["A4", "A5"] },
      { id: "paneer-tikka", name: "Paneer Tikka Masala", nameFi: "Paneer tikka -curry", price: 9.99, description: "Paneer tikka pieces served in a rich, spiced masala gravy.", descriptionFi: "Paneer tikka -paloja täyteläisessä, mausteisessa masalakastikkeessa.", image: "/images/order-menu/paneer-tikka-masala.jpg", allergenCodes: ["A5", "A4"] },
      { id: "palak-paneer", name: "Palak Paneer", nameFi: "Paneer-juustoa pinaattikastikkeessa", price: 8.99, description: "Paneer cooked in a creamy spinach-based gravy with Indian spices.", descriptionFi: "Paneer-juustoa kermaisessa pinaattikastikkeessa intialaisilla mausteilla.", image: "/images/order-menu/palak-paneer.jpg", allergenCodes: ["A4", "A5"] },
      { id: "kaju-paneer", name: "Kaju Paneer", nameFi: "Cashewpaneer", price: 9.99, description: "Paneer prepared with cashews in a rich, aromatic creamy gravy.", descriptionFi: "Paneer-juustoa cashewpähkinöiden kera täyteläisessä ja aromaattisessa kermaisessa kastikkeessa.", image: "/images/order-menu/kaju-paneer.jpg", allergenCodes: ["A4", "A5"] },
      { id: "lobio", name: "Desi Dawat Lobio-E-Khas", nameFi: "Desi Dawatin papucurry", price: 12.99, description: "A special Desi Dawat bean-based signature curry prepared with aromatic spices.", descriptionFi: "Desi Dawatin oma papupohjainen erikoiscurry, valmistettu aromaattisilla mausteilla.", image: "/images/order-menu/lobio-e-khas.jpg", allergenCodes: ["A4", "A5"] },
    ],
  },
  {
    title: "Breads & Rice",
    titleFi: "Leivät ja riisi",
    items: [
      { id: "puri", name: "Puri (5 pcs)", nameFi: "Puri (5 kpl)", price: 3.99, description: "Light, puffy deep-fried Indian flatbread traditionally served with curries.", descriptionFi: "Kevyt ja kuohkea friteerattu intialainen leipä, joka tarjoillaan perinteisesti curryn kanssa.", image: "/images/order-menu/puri-5pcs.jpg", allergenCodes: ["A1"] },
      { id: "tofu-paratha", name: "Tofu Paratha (2 pcs)", nameFi: "Tofu-paratha (2 kpl)", price: 4.99, description: "Indian stuffed flatbread prepared with a savory tofu filling.", descriptionFi: "Intialainen täytetty leipä, jossa on maukas tofu-täyte.", image: "/images/order-menu/tofu-paratha-2pcs.jpg", allergenCodes: ["A1", "A3"] },
      { id: "paneer-paratha", name: "Paneer Paratha (2 pcs)", nameFi: "Paneer-paratha (2 kpl)", price: 5.99, description: "Indian stuffed flatbread filled with seasoned paneer.", descriptionFi: "Intialainen täytetty leipä maustetulla paneer-juustotäytteellä.", image: "/images/order-menu/paneer-paratha-2pcs.jpg", allergenCodes: ["A1", "A4"] },
      { id: "jeera-rice", name: "Basmati Jeera Rice", nameFi: "Jeeralla maustettu basmatiriisi", price: 3.99, description: "Fragrant basmati rice prepared with cumin for a simple aromatic side.", descriptionFi: "Aromaattinen basmatiriisi, joka on maustettu juustokuminalla.", image: "/images/order-menu/basmati-jeera-rice.jpg", allergenCodes: [] },
    ],
  },
  {
    title: "Starters & Drinks",
    titleFi: "Alkupalat ja juomat",
    items: [
      { id: "dahi-vada", name: "Dahi Vada (6 pcs)", nameFi: "Dahi Vada (6 kpl)", price: 5.99, description: "Soft lentil dumplings topped with yogurt and flavorful Indian seasonings.", descriptionFi: "Pehmeitä linssipyöryköitä jogurtilla ja maukkailla intialaisilla mausteilla.", image: "/images/order-menu/dahi-vada-6pcs.jpg", allergenCodes: ["A1", "A4"] },
      { id: "soft-drinks", name: "Diet Soft Drinks (Coke/Pepsi/Jaffa)", nameFi: "Kevyet virvoitusjuomat (Coke/Pepsi/Jaffa)", price: 2.99, description: "330 ml diet soft drink; choose Coke, Pepsi or Jaffa below.", descriptionFi: "330 ml:n kevyt virvoitusjuoma; valitse Coke, Pepsi tai Jaffa alta.", image: "/images/order-menu/diet-soft-drinks.jpg", allergenCodes: [], choices: ["Coke", "Pepsi", "Jaffa"], choiceLabelFi: "Valitse juoma", choiceLabelEn: "Choose a drink" },
      { id: "raita", name: "Full Vegetable Raita", nameFi: "Kasvisraita", price: 4.99, description: "Yogurt with mixed vegetables.", descriptionFi: "Jogurttia ja tuoreita kasviksia.", image: "/images/order-menu/full-vegetable-raita.jpg", allergenCodes: ["A4"] },
    ],
  },
  {
    title: "Combo Meals",
    titleFi: "Yhdistelmäateriat",
    items: [
      { id: "curry-puri-rice", name: "Regular Curry + Puri (5 pcs) + Basmati Jeera Rice", nameFi: "Tavallinen curry + puri (5 kpl) + jeeralla maustettu basmatiriisi", price: 12.99, description: "Chole served with five puris and jeera rice.", descriptionFi: "Chole-kikhernecurry tarjoillaan viiden purin ja jeera-riisin kanssa.", image: "/images/order-menu/regular-curry-puri-rice.jpg", allergenCodes: ["A1"] },
      { id: "regular-meal-one", name: "Regular Curry Meal for One", nameFi: "Tavallinen curryateria yhdelle", price: 15.99, description: "Puri (5 pcs), basmati jeera rice, Dahi Vada (6 pcs), pickle and Chole or Rajma.", descriptionFi: "Puri (5 kpl), jeera-riisi, Dahi Vada (6 kpl), suolakurkku sekä Chole- tai Rajma-curry.", image: "/images/order-menu/regular-curry-meal-one.jpg", allergenCodes: ["A1", "A4"], choices: ["Chole", "Rajma"] },
      { id: "paneer-meal-one", name: "Paneer Curry Meal for One", nameFi: "Paneer-curryateria yhdelle", price: 17.99, description: "Puri (5 pcs), basmati jeera rice, Dahi Vada (6 pcs), pickle and Paneer Tikka Masala or Butter Paneer Masala.", descriptionFi: "Puri (5 kpl), jeera-riisi, Dahi Vada (6 kpl), suolakurkku ja Paneer Tikka Masala- tai Butter Paneer Masala -curry.", image: "/images/order-menu/paneer-curry-meal-one.jpg", allergenCodes: ["A1", "A4", "A5"], choices: ["Paneer Tikka Masala", "Butter Paneer Masala"] },
      { id: "signature-meal-one", name: "Signature Curry Meal for One", nameFi: "Desi Dawatin erikoiscurryateria yhdelle", price: 19.99, description: "Puri (5 pcs), basmati jeera rice, Dahi Vada (6 pcs), pickle and Desi Dawat Special Lobio-E-Khas.", descriptionFi: "Puri (5 kpl), jeera-riisi, Dahi Vada (6 kpl), suolakurkku ja Desi Dawatin erikoisannos Lobio-E-Khas.", image: "/images/order-menu/signature-curry-meal-one.jpg", allergenCodes: ["A1", "A4", "A5"] },
      { id: "paneer-meal-two", name: "Paneer Curry Meal for Two", nameFi: "Paneer-curryateria kahdelle", price: 29.99, description: "Puri (10 pcs), basmati jeera rice, Dahi Vada (6 pcs), pickle, vegetable raita and Paneer Tikka Masala or Butter Paneer Masala.", descriptionFi: "Puri (10 kpl), jeera-riisi, Dahi Vada (6 kpl), suolakurkku, kasvisraita ja Paneer Tikka Masala- tai Butter Paneer Masala -curry.", image: "/images/order-menu/paneer-curry-meal-two.jpg", allergenCodes: ["A1", "A4", "A5"], choices: ["Paneer Tikka Masala", "Butter Paneer Masala"] },
      { id: "signature-meal-two", name: "Signature Curry Meal for Two", nameFi: "Desi Dawatin erikoiscurryateria kahdelle", price: 32.99, description: "Puri (10 pcs), basmati jeera rice, Dahi Vada (6 pcs), pickle, vegetable raita, Paneer Tikka Masala or Butter Paneer Masala, and Desi Dawat Special Lobio-E-Khas.", descriptionFi: "Puri (10 kpl), jeera-riisi, Dahi Vada (6 kpl), suolakurkku, kasvisraita, Paneer Tikka Masala- tai Butter Paneer Masala -curry sekä Desi Dawatin erikoisannos Lobio-E-Khas.", image: "/images/order-menu/signature-curry-meal-two.jpg", allergenCodes: ["A1", "A4", "A5"], choices: ["Paneer Tikka Masala", "Butter Paneer Masala"] },
    ],
  },
];

const ALL_ITEMS = MENU_GROUPS.flatMap((group) => group.items);
const WHATSAPP_NUMBER = "358449803211";
const ALLERGEN_INFO = {
  A1: { nameFi: "Gluteenia sisältävät viljat", nameEn: "Cereals containing gluten", icon: "/images/allergen-icons/A1-gluten-cereals.png" },
  A3: { nameFi: "Soijapavut ja soijapaputuotteet", nameEn: "Soybeans and soybean products", icon: "/images/allergen-icons/A3-soybeans.png" },
  A4: { nameFi: "Maito ja maitotuotteet (laktoosi mukaan lukien)", nameEn: "Milk and milk products (including lactose)", icon: "/images/allergen-icons/A4-milk.png" },
  A5: { nameFi: "Pähkinät ja pähkinätuotteet", nameEn: "Nuts and nut products", icon: "/images/allergen-icons/A5-nuts.png" },
};

function formatEuro(value) {
  return `€${value.toFixed(2)}`;
}

function localDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getOpeningHour(date) {
  return [0, 6].includes(date.getDay()) ? 16 : 19;
}

function getDefaultOrderTime(orderDate = new Date()) {
  const now = new Date();
  const openingHour = getOpeningHour(orderDate);
  const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
  if (localDateString(orderDate) === localDateString(now) && localDateString(oneHourFromNow) === localDateString(now)) {
    const candidateMinutes = oneHourFromNow.getHours() * 60 + oneHourFromNow.getMinutes();
    if (candidateMinutes >= openingHour * 60 && candidateMinutes < 21 * 60) {
      return oneHourFromNow.toTimeString().slice(0, 5);
    }
  }
  return `${String(openingHour).padStart(2, "0")}:00`;
}

export default function WhatsAppOrderFormPage() {
  const [quantities, setQuantities] = useState({});
  const [choices, setChoices] = useState({});
  const [fulfilment, setFulfilment] = useState("pickup");
  const [error, setError] = useState("");
  const [openInfoPanel, setOpenInfoPanel] = useState(null);
  const [selectedAllergenCode, setSelectedAllergenCode] = useState(null);
  const [orderTime, setOrderTime] = useState(() => getDefaultOrderTime());
  const [openCategory, setOpenCategory] = useState(null);

  const selectedItems = useMemo(
    () => ALL_ITEMS.filter((item) => Number(quantities[item.id]) > 0),
    [quantities],
  );
  const subtotal = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.price * Number(quantities[item.id]), 0),
    [selectedItems, quantities],
  );

  function setQuantity(id, value) {
    const quantity = Math.max(0, Math.min(99, Number(value) || 0));
    setQuantities((current) => ({ ...current, [id]: quantity }));
  }

  function submitToWhatsApp(event) {
    event.preventDefault();
    setError("");
    const form = event.currentTarget;
    if (!selectedItems.length) {
      setError("Lisää tilaukseesi vähintään yksi annos. / Please add at least one menu item to your order.");
      return;
    }

    const values = new FormData(form);
    const phone = String(values.get("customer_phone") || "").trim();
    const date = localDateString();
    const time = String(values.get("order_time") || "");
    const requestedAt = new Date(`${date}T${time}`);
    if (!time || Number.isNaN(requestedAt.getTime())) {
      setError("Valitse toivomasi aika. / Please choose your preferred time.");
      return;
    }
    const openingHour = getOpeningHour(requestedAt);
    const requestedMinutes = requestedAt.getHours() * 60 + requestedAt.getMinutes();
    if (requestedMinutes < openingHour * 60 || requestedMinutes >= 21 * 60) {
      setError(`Aika ei ole aukioloaikojen sisällä. Tänä päivänä olemme avoinna ${openingHour}:00–21:00. / That time is outside opening hours. We are open ${openingHour}:00–21:00 today.`);
      return;
    }
    if (!phone) {
      setError("Anna WhatsApp-numerosi. / Please enter your WhatsApp number.");
      return;
    }
    if (fulfilment === "delivery" && !String(values.get("delivery_address") || "").trim()) {
      setError("Anna toimitusosoite. / Please enter the delivery address.");
      return;
    }
    const missingChoice = selectedItems.find((item) => item.choices && !choices[item.id]);
    if (missingChoice) {
      const isDrinkChoice = missingChoice.id === "soft-drinks";
      const finnishPrompt = isDrinkChoice ? "Valitse juoma" : "Valitse curry";
      const englishPrompt = isDrinkChoice ? "Please choose a drink" : "Please choose a curry";
      setError(`${finnishPrompt} tuotteelle ${missingChoice.nameFi} / ${englishPrompt} for ${missingChoice.name}.`);
      document.getElementById(`combo-choice-${missingChoice.id}`)?.focus();
      return;
    }

    const address = String(values.get("delivery_address") || "").trim();
    const allergies = String(values.get("allergies") || "").trim();
    const dateOptions = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
    const finnishDate = requestedAt.toLocaleDateString("fi-FI", dateOptions);
    const englishDate = requestedAt.toLocaleDateString("en-FI", dateOptions);
    const orderLines = selectedItems.flatMap((item, index) => [
      `${index + 1}. ${item.nameFi} / ${item.name}`,
      `   Määrä / Quantity: ${quantities[item.id]}`,
      ...(choices[item.id] ? [`   Valinta / Choice: ${choices[item.id]}`] : []),
      `   Rivisummaa / Line total: ${formatEuro(item.price * Number(quantities[item.id]))}`,
    ]);
    const message = [
      "*DESI DAWAT — TILAUS / ORDER REQUEST*",
      "",
      "*ASIAKAS / CUSTOMER*",
      `WhatsApp-numero / WhatsApp number: ${phone}`,
      "",
      "*TILAUSTAPA / FULFILMENT*",
      fulfilment === "pickup" ? "Nouto / Pickup" : "Kotiinkuljetus / Home delivery",
      ...(fulfilment === "delivery" && address ? [`Osoite / Address: ${address}`] : []),
      `Päivä / Date: ${finnishDate} / ${englishDate}`,
      `Toivottu aika / Preferred time: ${time}`,
      "",
      "*TUOTTEET / ORDER ITEMS*",
      ...orderLines,
      "",
      "*HINTAYHTEENVETO / PRICE SUMMARY*",
      `Valitut tuotteet / Selected items: ${selectedItems.reduce((sum, item) => sum + Number(quantities[item.id]), 0)}`,
      `Yhteensä / Total: ${formatEuro(subtotal)}`,
      ...(fulfilment === "delivery" ? ["Toimitusmaksu vahvistetaan WhatsAppissa / Delivery fee will be confirmed on WhatsApp"] : []),
      ...(allergies ? ["", "*RUOKA-ALLERGIAT / FOOD ALLERGIES*", allergies] : []),
      "",
      "Vahvistathan tilauksen. / Please confirm the order.",
    ].join("\n");

    window.location.assign(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`);
  }

  return (
    <section className="whatsapp-order-page" aria-labelledby="whatsapp-order-title">
      <div className="whatsapp-order-hero">
        <div className="whatsapp-order-hero-copy">
          <p className="eyebrow">DESI DAWAT · OULU</p>
          <h1 id="whatsapp-order-title"><span lang="fi">Tilaa ruokalistalta</span><span lang="en">Order from our menu</span></h1>
          <p className="whatsapp-order-hero-fi" lang="fi">Valitse annokset ja määrät. Lähetä tilaus meille WhatsAppissa.</p>
          <p className="whatsapp-order-hero-en" lang="en">Choose your dishes and quantities, then send your order to us on WhatsApp.</p>
        </div>
        <img className="whatsapp-order-hero-logo" src="./images/LOGO.jpeg" alt="Desi Dawat" />
      </div>

      <div className="whatsapp-order-info">
        <div className="whatsapp-info-tabs" role="group" aria-label="Order information">
          <button id="whatsapp-info-button-delivery" className={`whatsapp-info-tab${openInfoPanel === "delivery" ? " is-active" : ""}`} type="button" aria-expanded={openInfoPanel === "delivery"} aria-controls="whatsapp-info-panel-delivery" onClick={() => setOpenInfoPanel((current) => current === "delivery" ? null : "delivery")}>
            <span className="whatsapp-info-tab-label"><span lang="fi">Toimitusmaksut</span><span lang="en">Delivery charges</span></span><span className="whatsapp-info-tab-icon" aria-hidden="true">{openInfoPanel === "delivery" ? "⌃" : "⌄"}</span>
          </button>
        </div>

        <section id="whatsapp-info-panel-delivery" className="whatsapp-info-expanded" role="region" aria-labelledby="whatsapp-info-button-delivery" hidden={openInfoPanel !== "delivery"}>
          <div className="whatsapp-delivery-guide">
            <div className="whatsapp-info-panel-heading">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h11v10H3zM14 10h4l3 4v3h-7z"/><circle cx="7" cy="18" r="1.8"/><circle cx="18" cy="18" r="1.8"/></svg>
              <div><span lang="fi">Toimitusmaksut</span><span lang="en">Delivery charges</span></div>
            </div>
            <p className="whatsapp-delivery-reference">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.3"/></svg>
              <span>Lähtöpaikka: Lidl Pateniemen myymälä / Distance reference: Lidl Store, Pateniemi</span>
            </p>
            <div className="whatsapp-delivery-rates">
              <div><strong>Enintään 3 km / Up to 3 km</strong><span>2 € alle 15 € tilauksille, muuten maksuton / €2 under €15, otherwise free</span></div>
              <div><strong>Yli 3–7 km / Over 3–7 km</strong><span>3,50 € / €3.50 toimitusmaksu / delivery fee</span></div>
              <div><strong>Yli 7–15 km / Over 7–15 km</strong><span>6 € toimitusmaksu / €6 delivery fee</span></div>
              <div><strong>Yli 75 € tilaukset / Orders over €75</strong><span>Maksuton toimitus / Free delivery</span></div>
            </div>
            <p className="whatsapp-delivery-confirmation">Vahvistamme toimitusmaksun WhatsAppissa. / We will confirm the delivery fee on WhatsApp.</p>
          </div>
        </section>

      </div>

      <div className="whatsapp-order-layout">
        <div className="whatsapp-menu-groups">
          {MENU_GROUPS.map((group) => (
            <section className="whatsapp-menu-group" key={group.title} aria-labelledby={`whatsapp-group-${group.title}`}>
              <button
                className="whatsapp-menu-group-heading"
                type="button"
                aria-expanded={openCategory === group.title}
                aria-controls={`whatsapp-menu-${group.title}`}
                onClick={() => setOpenCategory((current) => current === group.title ? null : group.title)}
              >
                <span className="whatsapp-menu-group-title">
                  <span className="whatsapp-menu-group-title-fi" id={`whatsapp-group-${group.title}`} lang="fi">{group.titleFi}</span>
                  <span lang="en">{group.title}</span>
                </span>
                <span className="whatsapp-menu-group-count">{group.items.length} tuotetta / items</span>
                <span className="whatsapp-category-toggle" aria-hidden="true">{openCategory === group.title ? "−" : "+"}</span>
              </button>
              <div id={`whatsapp-menu-${group.title}`} className="whatsapp-menu-grid" hidden={openCategory !== group.title}>
                {group.items.map((item) => (
                  <article className={`whatsapp-menu-item${quantities[item.id] ? " is-selected" : ""}`} key={item.id}>
                    {item.image ? (
                      <img className="whatsapp-menu-item-image" src={item.image} alt={item.name} loading="lazy" />
                    ) : (
                      <span className="whatsapp-menu-item-placeholder" aria-hidden="true">{item.name.slice(0, 1)}</span>
                    )}
                    <div className="whatsapp-menu-item-content">
                      <div className="whatsapp-menu-item-meta-row">
                        <span className={`whatsapp-allergen-badges${item.allergenCodes?.length ? "" : " is-empty"}`} aria-label={item.allergenCodes?.length ? `Allergens: ${item.allergenCodes.join(", ")}` : undefined}>
                          {item.allergenCodes?.map((code) => <button key={code} type="button" className="dish-allergen-code-link" title="View allergen information" aria-label={`Show allergen details for ${code}`} onClick={() => setSelectedAllergenCode(code)}>{code}</button>)}
                        </span>
                        <strong className="whatsapp-menu-item-price">{formatEuro(item.price)}</strong>
                      </div>
                      <div className="whatsapp-menu-item-name">
                        <div className="whatsapp-menu-item-names">
                          <h3 lang="fi">{item.nameFi}</h3>
                          <span className="whatsapp-menu-item-english" lang="en">{item.name}</span>
                        </div>
                      </div>
                      <div className="whatsapp-menu-item-descriptions">
                        <p lang="fi">{item.descriptionFi}</p>
                        <p lang="en">{item.description}</p>
                      </div>
                      {item.choices && Number(quantities[item.id]) > 0 && (
                        <label className="whatsapp-combo-choice" htmlFor={`combo-choice-${item.id}`}>
                          <span lang="fi">{item.choiceLabelFi || "Valitse curry"}</span><span lang="en">{item.choiceLabelEn || "Choose a curry"}</span>
                          <select
                            id={`combo-choice-${item.id}`}
                            value={choices[item.id] || ""}
                            onChange={(event) => setChoices((current) => ({ ...current, [item.id]: event.target.value }))}
                          >
                            <option value="">{item.choiceLabelFi || "Valitse"} / {item.choiceLabelEn || "Choose"}</option>
                            {item.choices.map((choice) => <option key={choice} value={choice}>{choice}</option>)}
                          </select>
                        </label>
                      )}
                    </div>
                    <div className="whatsapp-quantity-control" aria-label={`Quantity for ${item.name}`}>
                      <button type="button" aria-label={`Remove one ${item.name}`} onClick={() => setQuantity(item.id, Number(quantities[item.id] || 0) - 1)} disabled={!quantities[item.id]}>−</button>
                      <input
                        aria-label={`${item.name} quantity`}
                        type="number"
                        min="0"
                        max="99"
                        inputMode="numeric"
                        value={quantities[item.id] || 0}
                        onChange={(event) => setQuantity(item.id, event.target.value)}
                      />
                      <button type="button" aria-label={`Add one ${item.name}`} onClick={() => setQuantity(item.id, Number(quantities[item.id] || 0) + 1)}>+</button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        <form className="whatsapp-order-checkout" onSubmit={submitToWhatsApp}>
          <div className="whatsapp-cart-summary">
            <div className="whatsapp-cart-heading">
              <div><p className="eyebrow">TILAUS / YOUR ORDER</p><h2><span lang="fi">Tilausyhteenveto</span><span lang="en">Order summary</span></h2></div>
              <span>{selectedItems.reduce((sum, item) => sum + Number(quantities[item.id]), 0)} tuotetta / items</span>
            </div>
            {selectedItems.length ? (
              <ul className="whatsapp-cart-list">
                {selectedItems.map((item) => (
                  <li key={item.id}>
                    <span>{quantities[item.id]} × {item.nameFi} / {item.name}{choices[item.id] ? ` (${choices[item.id]})` : ""}</span>
                    <strong>{formatEuro(item.price * Number(quantities[item.id]))}</strong>
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="whatsapp-cart-total"><span>Yhteensä / Total</span><strong>{formatEuro(subtotal)}</strong></div>
          </div>

          <div className="whatsapp-checkout-fields">
            <h2><span lang="fi">Yhteystietosi</span><span lang="en">Your details</span></h2>
            <label className="whatsapp-phone-field">
              <span className="whatsapp-label-fi">WhatsApp-numero <i aria-hidden="true">*</i></span><span className="whatsapp-label-en">WhatsApp number</span>
              <input name="customer_phone" type="tel" autoComplete="tel" maxLength="30" required />
            </label>

            <fieldset className="whatsapp-fulfilment">
              <legend><span lang="fi">Nouto vai kotiinkuljetus</span> / <span lang="en">Pickup or delivery</span> <span aria-hidden="true">*</span></legend>
              <label><input type="radio" name="fulfilment" checked={fulfilment === "pickup"} onChange={() => setFulfilment("pickup")} /><span>Nouto / Pickup</span></label>
              <label><input type="radio" name="fulfilment" checked={fulfilment === "delivery"} onChange={() => setFulfilment("delivery")} /><span>Kotiinkuljetus / Home delivery</span></label>
            </fieldset>

            {fulfilment === "delivery" && (
              <label>
                <span className="whatsapp-label-fi">Toimitusosoite <i aria-hidden="true">*</i></span><span className="whatsapp-label-en">Delivery address</span>
                <textarea name="delivery_address" autoComplete="street-address" rows="2" maxLength="300" required />
                <small>Toimitus enintään 15 km:n päähän Lidl Pateniemen myymälästä. Vahvistamme maksun. / Delivery is available within 15 km of Lidl Store, Pateniemi. We will confirm the fee.</small>
              </label>
            )}

            <label className="whatsapp-time-field">
              <span className="whatsapp-label-fi">Toivottu aika <i aria-hidden="true">*</i></span><span className="whatsapp-label-en">Preferred time</span>
              <input name="order_time" type="time" min={getOpeningHour(new Date()) === 16 ? "16:00" : "19:00"} max="20:59" value={orderTime} onChange={(event) => setOrderTime(event.target.value)} required />
            </label>

            <label>
              <span className="whatsapp-label-fi">Ruoka-allergiat <i className="whatsapp-optional">(vapaaehtoinen)</i></span><span className="whatsapp-label-en">Food allergies <i className="whatsapp-optional">(optional)</i></span>
              <input name="allergies" type="text" maxLength="200" />
            </label>
          </div>

          {error && <p className="whatsapp-order-error" role="alert">{error}</p>}
          <button className="button whatsapp-submit-button" type="submit" disabled={!selectedItems.length}>
            <svg className="whatsapp-submit-icon" viewBox="0 0 32 32" aria-hidden="true">
              <path d="M16 3.1a12.7 12.7 0 0 0-10.9 19.2L3.4 29l6.9-1.8A12.7 12.7 0 1 0 16 3.1Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <path d="M11.2 9.9c-.3-.7-.7-.7-1-.7h-.8c-.3 0-.8.1-1.2.6-.4.4-1.5 1.5-1.5 3.6s1.5 4.1 1.7 4.4c.2.3 2.9 4.6 7.1 6.2 3.5 1.4 4.2 1.1 5 .9.8-.1 2.5-1 2.9-2.1.4-1 .4-1.9.3-2.1-.1-.2-.4-.3-.9-.6-.5-.2-2.5-1.2-2.9-1.3-.4-.2-.7-.2-.9.2-.3.5-1.1 1.3-1.4 1.6-.3.3-.5.3-1 .1-.5-.2-1.9-.7-3.7-2.3-1.4-1.2-2.3-2.7-2.6-3.2-.3-.5 0-.7.2-.9.2-.2.5-.6.7-.8.2-.3.3-.5.5-.8.2-.3.1-.6 0-.8-.1-.2-.9-2.2-1.2-3Z" fill="currentColor" transform="translate(3 0) scale(.78)" />
            </svg>
            <span className="whatsapp-submit-label"><span lang="fi">Jatka WhatsAppiin</span><span lang="en">Place order on WhatsApp</span></span>
          </button>
        </form>
      </div>

      {selectedAllergenCode && ALLERGEN_INFO[selectedAllergenCode] && (
        <div className="allergen-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedAllergenCode(null); }}>
          <section className="allergen-dialog" role="dialog" aria-modal="true" aria-labelledby="whatsapp-allergen-dialog-title" onKeyDown={(event) => { if (event.key === "Escape") setSelectedAllergenCode(null); }}>
            <button type="button" className="allergen-dialog-close" aria-label="Close allergen information" autoFocus onClick={() => setSelectedAllergenCode(null)}>×</button>
            <span className="allergen-dialog-eyebrow">DESI DAWAT · FOOD INFORMATION</span>
            <h2 id="whatsapp-allergen-dialog-title">Allergen guide / Allergeeniopas</h2>
            <p className="allergen-dialog-intro">This dish contains the allergen shown below. / Tämä annos sisältää alla mainitun allergeenin.</p>
            <div className="allergen-dialog-list is-detail">
              <article className="allergen-dialog-item">
                <img src={ALLERGEN_INFO[selectedAllergenCode].icon} alt="" aria-hidden="true" />
                <div>
                  <strong>{selectedAllergenCode}</strong>
                  <p><span lang="fi">{ALLERGEN_INFO[selectedAllergenCode].nameFi}</span><span className="allergen-dialog-english" lang="en">{ALLERGEN_INFO[selectedAllergenCode].nameEn}</span></p>
                </div>
              </article>
            </div>
            <p className="allergen-dialog-note">Ilmoitathan ruoka-allergiasta ennen tilaamista. / Please contact us before ordering if you have a food allergy.</p>
          </section>
        </div>
      )}
    </section>
  );
}
