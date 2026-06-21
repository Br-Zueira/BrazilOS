// --- Definitions

// Step 1: Define a function called `dragElement` that makes an HTML element draggable.
function dragElement(element) {
  // Step 2: Set up variables to keep track of the element's position.
  let initialX = 0;
  let initialY = 0;
  let currentX = 0;
  let currentY = 0;

  // Step 3: Check if there is a special header element associated with the draggable element.
  if (document.getElementById(element.id + "header")) {
    // Step 4: If present, assign the `dragMouseDown` function to the header's `onmousedown` event.
    // This allows you to drag the window around by its header.
    document.getElementById(element.id + "header").onmousedown = startDragging;
  } else {
    // Step 5: If not present, assign the function directly to the draggable element's `onmousedown` event.
    // This allows you to drag the window by holding down anywhere on the window.
    element.onmousedown = startDragging;
  }

  // Step 6: Define the `startDragging` function to capture the initial mouse position and set up event listeners.
  function startDragging(e) {
    e = e || window.event;
    e.preventDefault();
    // Step 7: Get the mouse cursor position at startup.
    initialX = e.clientX;
    initialY = e.clientY;
    // Step 8: Set up event listeners for mouse movement (`elementDrag`) and mouse button release (`closeDragElement`).
    document.onmouseup = stopDragging;
    document.onmousemove = elementDrag;
  }

  // Step 9: Define the `elementDrag` function to calculate the new position of the element based on mouse movement.
  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // Step 10: Calculate the new cursor position.
    currentX = initialX - e.clientX;
    currentY = initialY - e.clientY;
    initialX = e.clientX;
    initialY = e.clientY;
    // Step 11: Update the element's new position by modifying its `top` and `left` CSS properties.
    element.style.top = (element.offsetTop - currentY) + "px";
    element.style.left = (element.offsetLeft - currentX) + "px";
  }

  // Step 12: Define the `stopDragging` function to stop tracking mouse movement by removing the event listeners.
  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function closeWindow(element) {
  // Makes window invisible
  element.style.display = "none"
}

function openWindow(element) {
  // Makes window visible
  element.style.display = "flex"
}

// Icon managment

let selectedIcon = undefined

function selectIcon(element) {
  element.classList.add("selected");
  selectedIcon = element;
} 

function deselectIcon(element) {
  element.classList.remove("selected");
  selectedIcon = undefined;
}

// Z position managment

let biggestIndex = 0;

function handleWindowTap(element) {
  biggestIndex++;  // Increment biggestIndex by 1
  element.style.zIndex = biggestIndex;
  document.getElementById("topbar").style.zIndex = biggestIndex + 1;
}

// Just a middleman to reduce boilerplate

function setWindow(windowname) {
  // Window object
  const window = document.getElementById(windowname);

  // Make window draggable
  dragElement(window);
  
  // Make window closable
  document.getElementById(windowname + "close").addEventListener('click', () => {
    closeWindow(window);
    deselectIcon(document.getElementById(windowname + "open"));
  });

  // Set up desktop icon
  document.getElementById(windowname + "open").addEventListener('click', () => {
    openWindow(window);
    selectIcon(document.getElementById(windowname + "open"));
    handleWindowTap(window);
  });

  // Set up 
  window.addEventListener("mousedown", () => {
    handleWindowTap(window);
  });
}

// Toggle taskbar display to hide and show it
function taskbarToggler() {
  const taskbar = document.getElementById("taskbar");
  if (taskbar.style.display == "none") {
    openWindow(taskbar); // Reusing function just because it works =)
  } else {
    closeWindow(taskbar);
  }
}

// --- Clock updater
setInterval(() => {
  document.getElementById('clock').innerText = new Date().toLocaleString();
}, 1000);

// --- Taskbar toggle manager
document.getElementById("taskbarToggle").addEventListener("click", () => {
  taskbarToggler();
});

// --- Windows
// OS Windows (no pun intended)
setWindow("welcome");
selectIcon(document.getElementById("welcomeopen")); // Preopen window

setWindow("notes");

setWindow("memequotes");

setWindow("settings");

// -- Notes
let notes = [{
  title: 'Braiti',
  date: '20/06/2026',
  content: `
    Yesterday, Brazil played against Haiti. 
    3x0 was good, but could be better if players didn't come half asleep from the interval.
    Now I hope Ancelotti will let Endrick cook in the next match.
`}];

function setNotesContent(index) {
  const notesContent = document.getElementById("notesContent");
  const notesTitle = document.getElementById("notesTitle");
  const notesDate = document.getElementById("notesDate");
  notesContent.innerHTML = "<p contenteditable='true'>" + notes[index].content + "</p>";
  notesTitle.innerHTML = "<p contenteditable='true'>" + notes[index].title + "</p>";
  notesDate.innerHTML = "<p contenteditable='true'>" + notes[index].date + "</p>";
}

function addToNoteBar(index) {
  const noteBar = document.getElementById("noteBar");
  const note = notes[index];
  let newBtn = document.createElement("button");
  newBtn.className = "topBarBtn";
  newBtn.id = `note${index}`;
  newBtn.innerText = note.title;
  newBtn.addEventListener("click", () => {
    setNotesContent(index);
  });
  noteBar.appendChild(newBtn);
}

setNotesContent(0);

for (const index of notes.keys()) {
  addToNoteBar(index);
}

// --- Weather
function getEmoji(code, isDay = 1) {
  // World Weather Standard Codes
  // TODO: Add actual emojis
  if (code === 0) {
    return isDay ? "\u{1F200}" : "\u{1F319}"; // ☀️ (Customized clear sun) / 🌙
  } else if (code < 4) {
    return isDay ? "\u{1F324}" : "\u{2601}";  // 🌤️ / ☁️
  } else if (code < 49) {
    return "\u{1F32B}";                      // 🌫️
  } else if (code < 56) {
    return "\u{1F326}";                      // 🌦️
  } else if (code < 66) {
    return "\u{1F327}";                      // 🌧️
  } else if (code < 76) {
    return "\u{1F328}";                      // 🌨️
  } else if (code < 99) {
    return "\u{26C5}";                      // ⛈️
  } else {
    return "?";
  }
}

async function getWeather() {
  // Coordinates (Belo Horizonte as Default)
  const lat = localStorage.getItem("latPref") ?? -19.9208;
  const lon = localStorage.getItem("lonPref") ?? -43.9378;

  // Measure units
  const tempunit = localStorage.getItem("tempPref") ?? "celsius";
  const windunit = localStorage.getItem("windPref") ?? "kmh";

  // Crude Info
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=${tempunit}&wind_speed_unit=${windunit}`);
  const data = await response.json();

  // Simplification
  const weather = data.current_weather;
  const units = data.current_weather_units;

  // Actual Display
  let text = getEmoji(weather.weathercode, weather.is_day); // Like Sun or Cloud
  text += ` ${weather.temperature}${units.temperature}`; // Like 25°C or 90°F
  text += ` || 💨 ${weather.windspeed}${units.windspeed}`; // Like 10km/h
  text += ` ${weather.winddirection}${units.winddirection}`;
  document.getElementById("weather").innerText = text;
}

getWeather();

// -- Settings
const settingForm = document.getElementById("settingForm");
settingForm.addEventListener("submit", function(event) {
  // Prevent reloading
  event.preventDefault();

  // Get values
  const selectedTemp = document.querySelector('input[name="temp"]:checked')?.value;
  const selectedWind = document.querySelector('input[name="wind"]:checked')?.value;
  const selectedRage = document.querySelector('input[name="rage"]:checked')?.value;
  const lat = document.querySelector('input[name="lat"]')?.value;
  const lon = document.querySelector('input[name="lon"]')?.value;

  // Save settings in local storage
  if (selectedTemp) localStorage.setItem('tempPref', selectedTemp);
  if (selectedWind) localStorage.setItem('windPref', selectedWind);
  if (selectedRage) localStorage.setItem('ragePref', selectedRage);
  if (lat!=="") localStorage.setItem('latPref', parseFloat(lat));
  if (lon!=="") localStorage.setItem('lonPref', parseFloat(lon));

  alert("Jazzghost Settings saved.\nYou're not dumb like Jazzghost;\nYou re smart like Iberê Thenório.\n(Reload page to notice changes)")
});