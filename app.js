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
  });
}

// --- Implementations

// Clock updater
setInterval(() => {
  document.getElementById('clock').innerText = new Date().toLocaleString();
}, 1000);

// OS Windows (no pun intended)
setWindow("welcome");
selectIcon(document.getElementById("welcomeopen"));