// DOM Elements
const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const resultCard = document.getElementById("result-card");
const cityNameEl = document.getElementById("city-name");
const cityDescEl = document.getElementById("city-desc");
const alertsList = document.getElementById("alerts-list");
const cacheTag = document.getElementById("cache-tag");
const regionRateTag = document.getElementById("region-rate-tag");
const riskBadge = document.getElementById("risk-badge");
const localTipEl = document.getElementById("local-tip");
const networkStatus = document.getElementById("network-status");

const fareCitySelect = document.getElementById("fare-city-select");
const vehicleSelect = document.getElementById("vehicle-select");
const distanceInput = document.getElementById("distance-input");
const quotedInput = document.getElementById("quoted-input");
const nightChargeCheckbox = document.getElementById("night-charge");
const calcBtn = document.getElementById("calc-fare-btn");
const fareResult = document.getElementById("fare-result");
const fareRangeEl = document.getElementById("fare-range");
const fareBreakdownEl = document.getElementById("fare-breakdown");
const overchargeVerdictEl = document.getElementById("overcharge-verdict");

const copyLocBtn = document.getElementById("copy-loc-btn");
const gpsFeedback = document.getElementById("gps-feedback");

// 1. Live Online/Offline Status Monitor
function updateNetworkBadge() {
  if (navigator.onLine) {
    networkStatus.textContent = "● Online & Live";
    networkStatus.className = "status-pill online";
  } else {
    networkStatus.textContent = "● Offline Mode (Cached Data)";
    networkStatus.className = "status-pill offline";
  }
}
window.addEventListener("online", updateNetworkBadge);
window.addEventListener("offline", updateNetworkBadge);
updateNetworkBadge();

// 2. City-Specific Advisory & Auto-Tariff Sync
function getCitySafetyProfile(city) {
  const key = city.toLowerCase();

  if (key.includes("goa") || key.includes("beach") || key.includes("gokarna") || key.includes("puri")) {
    return {
      tariffRegion: "goa",
      tariffLabel: "Coastal Tourist Tariff",
      risk: "High Tourist Traffic",
      tip: "💡 Local Tip: Install 'GoaMiles' before arriving at Mopa/Dabolim airport—private taxi counters charge up to 2x.",
      scams: [
        "Airport & Station Cab Cartels: Local taxis rarely run on meters. Use GoaMiles or official prepaid counters.",
        "Beach Watersports Touts: Unregistered agents quote cheap combo packs without safety gear. Verify registered operators and life jackets.",
        "Scooter Rental Fuel Trick: Rented scooters come nearly empty, and leftover petrol isn't refunded—refuel in small amounts."
      ]
    };
  }

  if (key.includes("manali") || key.includes("shimla") || key.includes("kullu") || key.includes("rohtang") || key.includes("rishikesh") || key.includes("mussoorie") || key.includes("nainital")) {
    return {
      tariffRegion: "hills",
      tariffLabel: "Hill Terrain Tariff",
      risk: "Terrain & Permit Caution",
      tip: "💡 Local Tip: Download offline Google Maps before crossing Manali/Rishikesh town limits where 4G/5G drops.",
      scams: [
        "Roadside Snow Gear Trap: Shops en route to Solang/Rohtang quote ₹800–₹1000 for snow suits/boots. Standard union rate is ₹250–₹300.",
        "Permit Black-Marketing: Local agents overcharge for Rohtang/Atal Tunnel permits. Book directly via HP Tourism's official website.",
        "Landslide & Night Driving Risk: Avoid unpaved mountain shortcuts after dark or during heavy monsoon alerts."
      ]
    };
  }

  if (key.includes("jaipur") || key.includes("udaipur") || key.includes("jodhpur") || key.includes("rajasthan")) {
    return {
      tariffRegion: "tier2",
      tariffLabel: "Tier-2 City Tariff",
      risk: "Commission & Guide Caution",
      tip: "💡 Local Tip: Buy the Composite Monument Ticket in Jaipur to skip queues and avoid touts at individual fort gates.",
      scams: [
        "Commission Factory Shopping: Auto drivers pitch 'cheap full-day tours' that route through textile/gem shops carrying a 35–40% driver commission.",
        "Unlicensed Monument Guides: Touts outside Amer Fort or City Palace pose as official guides. Always check for an ASI / State Tourism ID badge."
      ]
    };
  }

  if (key.includes("agra") || key.includes("taj mahal")) {
    return {
      tariffRegion: "tier2",
      tariffLabel: "Tier-2 City Tariff",
      risk: "High Tout Activity",
      tip: "💡 Local Tip: The Taj Mahal remains closed every Friday—plan Agra Fort or Mehtab Bagh instead.",
      scams: [
        "Marble & Petha Duplicate Trap: Drivers steer tourists to lookalike sweet shops and marble showrooms instead of authentic outlets.",
        "Fake VIP Fast-Track Entry: Unauthorized agents outside gates sell fake 'skip-the-line' passes. Book online via ASI or official ticket counters."
      ]
    };
  }

  if (key.includes("varanasi") || key.includes("kashi") || key.includes("ghat")) {
    return {
      tariffRegion: "tier2",
      tariffLabel: "Tier-2 City Tariff",
      risk: "Ghat & Boat Caution",
      tip: "💡 Local Tip: Walk through the narrow old-city lanes rather than taking e-rickshaws near Dashashwamedh Ghat.",
      scams: [
        "Mid-River Boat Extortion: Boatmen sometimes demand extra money mid-stream during Ganga Aarti. Fix the total round-trip fare before boarding.",
        "Manikarnika Ghat Wood Donation Scam: Touts approach tourists asking for donations to buy cremation wood for poor families—avoid engaging."
      ]
    };
  }

  if (key.includes("delhi") || key.includes("mumbai") || key.includes("bangalore") || key.includes("bengaluru") || key.includes("kolkata")) {
    return {
      tariffRegion: "metro",
      tariffLabel: "Metro Meter Tariff",
      risk: "Transit Hub Caution",
      tip: "💡 Local Tip: Use Metro rail from major railway stations and airports for fixed, scam-free transit.",
      scams: [
        "Hotel Closed / Road Block Scam: Outside New Delhi or Old Delhi station, drivers claim your booked hotel is shut to divert you to commission hotels.",
        "Meter Refusal at Night: Auto drivers often refuse meters post-10 PM. Use official prepaid booths, Uber, Ola, or Rapido."
      ]
    };
  }

  return {
    tariffRegion: "tier2",
    tariffLabel: "Standard City Tariff",
    risk: "Standard Travel Caution",
    tip: "💡 Local Tip: Ask your hotel reception for the standard local auto fare to the nearest railway station or bus stand.",
    scams: [
      "Station Exit Overcharging: Walk 50 meters past the main station gate or use the official prepaid auto booth to avoid inflated tourist quotes.",
      "Unsolicited Recommendations: Cross-check Google Maps reviews before visiting restaurants or shops recommended by local drivers."
    ]
  };
}

// 3. Search Function with LocalStorage Offline Cache
async function searchDestination(cityQuery) {
  const userCity = cityQuery.trim();
  if (!userCity) {
    cityInput.focus();
    return;
  }

  const cacheKey = "safetrip_v2_" + userCity.toLowerCase();
  const safetyData = getCitySafetyProfile(userCity);

  // Sync Fare Estimator dropdown automatically with searched city!
  fareCitySelect.value = safetyData.tariffRegion;

  // Render UI
  resultCard.classList.remove("hidden");
  cacheTag.classList.add("hidden");
  cityNameEl.textContent = userCity;
  cityDescEl.textContent = "Fetching destination overview...";
  regionRateTag.textContent = safetyData.tariffLabel;
  riskBadge.textContent = safetyData.risk;
  localTipEl.textContent = safetyData.tip;

  alertsList.innerHTML = "";
  safetyData.scams.forEach(function (scam) {
    const li = document.createElement("li");
    li.textContent = scam;
    alertsList.appendChild(li);
  });

  try {
    const response = await fetch(
      "https://en.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(userCity)
    );
    if (!response.ok) throw new Error("Not found");
    const data = await response.json();

    if (data.extract) {
      cityNameEl.textContent = data.title;
      cityDescEl.textContent = data.extract;
      localStorage.setItem(cacheKey, JSON.stringify({
        title: data.title,
        extract: data.extract
      }));
    } else {
      cityDescEl.textContent = "Location verified. Follow the street-level safety advisories below.";
    }
  } catch (err) {
    const saved = localStorage.getItem(cacheKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      cityNameEl.textContent = parsed.title;
      cityDescEl.textContent = parsed.extract;
      cacheTag.classList.remove("hidden");
    } else {
      cityDescEl.textContent = "Offline mode active — Wikipedia preview unavailable, but local safety advisories are ready.";
    }
  }
}

searchBtn.addEventListener("click", function () {
  searchDestination(cityInput.value);
});

cityInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    searchDestination(cityInput.value);
  }
});

document.querySelectorAll(".chip").forEach(function (chip) {
  chip.addEventListener("click", function () {
    const city = chip.getAttribute("data-city");
    cityInput.value = city;
    searchDestination(city);
  });
});

// 4. Regional Tariff Fare Estimator + Overcharge Detector
const TARIFF_TABLE = {
  metro: { auto: [30, 11], cab: [55, 17], bike: [15, 7] },
  tier2: { auto: [25, 12], cab: [60, 18], bike: [15, 7] },
  hills: { auto: [50, 18], cab: [100, 26], bike: [30, 12] },
  goa:   { auto: [60, 20], cab: [120, 28], bike: [35, 12] }
};

calcBtn.addEventListener("click", function () {
  const region = fareCitySelect.value;
  const vehicle = vehicleSelect.value;
  const distance = parseFloat(distanceInput.value);
  const quoted = parseFloat(quotedInput.value);
  const isNight = nightChargeCheckbox.checked;

  if (isNaN(distance) || distance <= 0) {
    distanceInput.focus();
    return;
  }

  const [baseRate, perKm] = TARIFF_TABLE[region][vehicle];
  const vehicleLabel = vehicle === "auto" ? "Auto Rickshaw" : vehicle === "cab" ? "City Cab" : "Bike Taxi";

  let estimated = baseRate + (distance * perKm);
  if (isNight) {
    estimated *= 1.25;
  }

  const minFair = Math.round(estimated * 0.95);
  const maxFair = Math.round(estimated * 1.12);

  fareRangeEl.textContent = `Fair Estimate: ₹${minFair} – ₹${maxFair}`;
  fareBreakdownEl.textContent = `${vehicleLabel} • ${distance} KM (Base ₹${baseRate} + ₹${perKm}/km${isNight ? " + 25% Night Surge" : ""})`;

  // Overcharge Detection Logic
  if (!isNaN(quoted) && quoted > 0) {
    overchargeVerdictEl.classList.remove("hidden", "verdict-fair", "verdict-high", "verdict-scam");
    if (quoted <= maxFair) {
      overchargeVerdictEl.textContent = `✅ Fair Quote: ₹${quoted} is within the standard local range.`;
      overchargeVerdictEl.classList.add("verdict-fair");
    } else if (quoted <= maxFair * 1.3) {
      const extra = quoted - maxFair;
      overchargeVerdictEl.textContent = `⚠️ Slightly High: Driver is asking ~₹${extra} above fair meter rate. Negotiate down to ₹${maxFair}.`;
      overchargeVerdictEl.classList.add("verdict-high");
    } else {
      const extra = quoted - maxFair;
      overchargeVerdictEl.textContent = `🚨 Overcharge Alert: ₹${quoted} is ₹${extra} over the fair fare! Walk away or use a prepaid booth/app.`;
      overchargeVerdictEl.classList.add("verdict-scam");
    }
  } else {
    overchargeVerdictEl.classList.add("hidden");
  }

  fareResult.classList.remove("hidden");
});

// 5. Persistent Safety Checklist
const checkBoxes = document.querySelectorAll(".safety-check");
const progressBadge = document.getElementById("checklist-progress");

function syncChecklist() {
  let checkedCount = 0;
  const state = {};
  checkBoxes.forEach(function (box) {
    const id = box.getAttribute("data-id");
    state[id] = box.checked;
    if (box.checked) checkedCount++;
  });
  progressBadge.textContent = `${checkedCount} / ${checkBoxes.length} Checked`;
  localStorage.setItem("safetrip_checklist", JSON.stringify(state));
}

// Load saved checklist state on startup
const savedChecklist = JSON.parse(localStorage.getItem("safetrip_checklist") || "{}");
checkBoxes.forEach(function (box) {
  const id = box.getAttribute("data-id");
  if (savedChecklist[id]) box.checked = true;
  box.addEventListener("change", syncChecklist);
});
syncChecklist();

// 6. Offline GPS Coordinate Copy
copyLocBtn.addEventListener("click", function () {
  if (!navigator.geolocation) {
    gpsFeedback.textContent = "Geolocation is not supported by this browser.";
    gpsFeedback.classList.remove("hidden");
    return;
  }

  copyLocBtn.textContent = "Locating...";
  navigator.geolocation.getCurrentPosition(
    function (pos) {
      const lat = pos.coords.latitude.toFixed(5);
      const lon = pos.coords.longitude.toFixed(5);
      const text = `Emergency Location: https://maps.google.com/?q=${lat},${lon} (${lat}, ${lon})`;

      if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
      }
      gpsFeedback.textContent = `Copied: ${lat}, ${lon} — Ready to paste in SMS or WhatsApp.`;
      gpsFeedback.classList.remove("hidden");
      copyLocBtn.textContent = "📍 Copy GPS Link";
    },
    function () {
      gpsFeedback.textContent = "Location permission blocked. Enable GPS in browser settings to copy coordinates.";
      gpsFeedback.classList.remove("hidden");
      copyLocBtn.textContent = "📍 Copy GPS Link";
    }
  );
});
