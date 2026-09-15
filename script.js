// DOM elements 
var searchBtn = document.getElementById("search-btn");
var cityInput = document.getElementById("city-input");
var resultCard = document.getElementById("result-card");
var cityNameEl = document.getElementById("city-name");
var cityDescEl = document.getElementById("city-desc");
var alertsList = document.getElementById("alerts-list");

var calcBtn = document.getElementById("calc-fare-btn");
var distanceInput = document.getElementById("distance-input");
var vehicleSelect = document.getElementById("vehicle-select");
var fareResult = document.getElementById("fare-result");

// 1. Search Function (Wikipedia + Specific Indian Scams)
searchBtn.addEventListener("click", async function () {
  var userCity = cityInput.value.trim();

  if (userCity === "") {
    alert("Kripya kisi Indian tourist spot ya shehar ka naam dalein!");
    return;
  }

  // Card show karna aur initial message
  resultCard.classList.remove("hidden");
  resultCard.style.display = "block";
  cityNameEl.innerText = userCity;
  cityDescEl.innerText = "Wikipedia se details load ho rahi hain...";
  alertsList.innerHTML = "";

  //  Wikipedia API se real summary lega
  try {
    var response = await fetch("https://en.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(userCity));
    var data = await response.json();

    if (data.extract) {
      cityNameEl.innerText = data.title + " (Travel Safety Radar)";
      cityDescEl.innerText = data.extract;
    } else {
      cityDescEl.innerText = "Location verified. Follow the street safety advisories below.";
    }
  } catch (err) {
    cityDescEl.innerText = "Information preview offline hai, par safety checklist active hai.";
  }

  //  City ke hisab se exact alag-alag warnings dikhana
  var searchKey = userCity.toLowerCase();
  var scams = [];

  // Goa / Beaches
  if (searchKey.includes("goa") || searchKey.includes("beach") || searchKey.includes("puri") || searchKey.includes("gokarna")) {
    scams.push("Airport & Station Cab Cartels: Local taxi wale meter nahi chalate aur double rate mangte hain. Official GoaMiles app ya prepaid booth use karein.");
    scams.push("Beach Watersports Touts: Unregistered agents saste rate ka lalach dete hain. Hamesha certified operators aur life jackets verify karein.");
    scams.push("Scooter Rental Fuel Trick: Scooters zero fuel ke sath milti hain, aur return ke waqt extra petrol ka refund nahi milta.");
  }
  // Himachal / Uttarakhand / Hills (Manali, Shimla, Rishikesh, etc.)
  else if (searchKey.includes("manali") || searchKey.includes("shimla") || searchKey.includes("kullu") || searchKey.includes("rohtang") || searchKey.includes("rishikesh") || searchKey.includes("mussoorie") || searchKey.includes("nainital") || searchKey.includes("hill")) {
    scams.push("Roadside Snow Gear Trap: Solang/Rohtang jate waqt roadside dukan wale zabardasti boots/suits rent karne ko bolte hain. Govt rate ₹250 hota hai, ₹1000 na dein.");
    scams.push("Rohtang Permit Black-Marketing: Local agents govt permit ke naam par 3 guna charge karte hain. Hamesha HP Tourism ki official website se permit book karein.");
    scams.push("Monsoon & Landslide Alert: Barish ke season mein unpaved pahadi raaston par travel karne se pehle local taxi union se road status check karein.");
  }
  // Heritage & Forts (Jaipur, Udaipur, Rajasthan, Jodhpur)
  else if (searchKey.includes("jaipur") || searchKey.includes("udaipur") || searchKey.includes("jodhpur") || searchKey.includes("rajasthan") || searchKey.includes("fort")) {
    scams.push("Commission Factory Shopping: Auto wale bolte hain 'Original Blue Pottery ya Sanganeri print factory' le jayenge, jahan 40% guide commission juda hota hai.");
    scams.push("Fake Monument Guides: Amer Fort ya City Palace ke bahar bina ID wale log guide ban jate hain. Official ASI badge dekh kar hi hire karein.");
  }
  // Agra / Taj Mahal
  else if (searchKey.includes("agra") || searchKey.includes("taj mahal")) {
    scams.push("Marble & Petha Duplicate Trap: Auto wale branded petha aur genuine marble souvenir ke naam par duplicate dukaano par le jate hain.");
    scams.push("VIP Fast Entry Scam: Monuments ke bahar unauthorized log VIP line se entry ka jhooth bolte hain. Ticket hamesha official ASI counter se lein.");
  }
  // Varanasi / Ghats
  else if (searchKey.includes("varanasi") || searchKey.includes("kashi") || searchKey.includes("ghat")) {
    scams.push("Boat Ride Extortion: Sham ki Ganga Aarti ke waqt boat wale beech nadi mein le ja kar extra paise maangte hain. Rate pehle hi clear karein.");
    scams.push("Manikarnika Ghat Donation Scam: Ghats par log bolte hain antim sanskar ki lakdi ke liye daan do. Yeh completely unauthorized extortion hota hai.");
  }
  // Delhi / Metro Transit Hubs
  else if (searchKey.includes("delhi") || searchKey.includes("mumbai") || searchKey.includes("bangalore") || searchKey.includes("kolkata")) {
    scams.push("Hotel Closed / Road Block Scam: Railway station ke bahar auto wale claim karte hain ki aapka book hotel seal ho gaya, taaki apne commission wale hotel le jayein.");
    scams.push("Refusal of Meter: Raat ke waqt auto wale meter se chalne se mana karte hain. Hamesha prepaid booth ya Ola/Uber use karein.");
  }
  // Default (Koi bhi dusra Indian town)
  else {
    scams.push("Station Transit Overcharging: Station exit ke bahar private cabs se bachein. Prepaid auto counter ya official meter prefer karein.");
    scams.push("Local Driver Recommendations: Auto/Cab drivers ke bataye kisi bhi specific hotel ya gift shop par jane se pehle Google rating check karein.");
  }

  // Alerts ko screen par jodega
  for (var i = 0; i < scams.length; i++) {
    var li = document.createElement("li");
    li.innerText = scams[i];
    alertsList.appendChild(li);
  }
});

// 2. Simple Fare Calculator
calcBtn.addEventListener("click", function () {
  var distance = parseFloat(distanceInput.value);
  var vehicle = vehicleSelect.value;

  if (isNaN(distance) || distance <= 0) {
    alert("Kripya sahi distance (KM) dalein!");
    return;
  }

  var baseRate = 0;
  var perKm = 0;

  if (vehicle === "auto") {
    baseRate = 30;
    perKm = 12;
  } else if (vehicle === "cab") {
    baseRate = 60;
    perKm = 18;
  } else if (vehicle === "bike") {
    baseRate = 15;
    perKm = 7;
  }

  var estimated = Math.round(baseRate + (distance * perKm));
  var minFair = Math.round(estimated * 0.95);
  var maxFair = Math.round(estimated * 1.15);

  fareResult.innerText = "Expected Fair Price: ₹" + minFair + " - ₹" + maxFair + " (Official booth rate)";
  fareResult.classList.remove("hidden");
  fareResult.style.display = "block";
});
