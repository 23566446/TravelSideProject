let itineraryData = JSON.parse(localStorage.getItem('itineraryData')) || {
  "Day 1": []
};

let currentDay = Object.keys(itineraryData)[0];
let selectedPlace = null;

// DOM Elements
const input = document.getElementById('placeInput');
const addBtn = document.getElementById('addPlace');
const itineraryCard = document.getElementById('itineraryList');
const dayTabs = document.getElementById('dayTabs');

// Initialize
function init() {
  renderTabs();
  renderItinerary();
  setupAutocomplete();
}

function setupAutocomplete() {
  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.addListener('place_changed', () => {
    selectedPlace = autocomplete.getPlace();
  });
}

function renderTabs() {
  dayTabs.innerHTML = '';
  Object.keys(itineraryData).forEach(day => {
    const btn = document.createElement('button');
    btn.textContent = day;
    btn.className = day === currentDay ? 'active' : '';
    btn.onclick = () => {
      currentDay = day;
      renderTabs();
      renderItinerary();
    };
    dayTabs.appendChild(btn);
  });

  // Add Day Button
  const addDayBtn = document.createElement('button');
  addDayBtn.textContent = '+';
  addDayBtn.className = 'btn-outline';
  addDayBtn.style.minWidth = '40px';
  addDayBtn.onclick = () => {
    const newDayNum = Object.keys(itineraryData).length + 1;
    const newDayName = `Day ${newDayNum}`;
    itineraryData[newDayName] = [];
    currentDay = newDayName;
    saveAndRefresh();
  };
  dayTabs.appendChild(addDayBtn);
}

addBtn.addEventListener('click', () => {
  const name = selectedPlace ? selectedPlace.name : input.value.trim();
  if (!name) return;

  const newItem = {
    name: name,
    note: "",
    lat: selectedPlace?.geometry?.location.lat() || null,
    lng: selectedPlace?.geometry?.location.lng() || null
  };

  itineraryData[currentDay].push(newItem);
  input.value = '';
  selectedPlace = null;
  saveAndRefresh();
});

function renderItinerary() {
  itineraryCard.innerHTML = '';
  const list = itineraryData[currentDay] || [];

  list.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'itinerary-item';
    div.draggable = true;
    // Inside renderItinerary() ...
    div.innerHTML = `
    <div class="item-main">
        <span class="drag-handle">☰</span>
        <!-- Added title="${item.name}" so users can see the full name on hover -->
        <span class="place-name" title="${item.name}" onclick="openMap(${item.lat}, ${item.lng})">
        ${item.name}
        </span>
        <button class="delete-btn" onclick="deleteItem(${index})">×</button>
    </div>
    <input class="note-input" placeholder="添加筆記..." value="${item.note || ''}" onchange="updateNote(${index}, this.value)">
    `;
    // Drag and Drop Logic
    div.ondragstart = () => (draggedIdx = index);
    div.ondragover = (e) => e.preventDefault();
    div.ondrop = () => handleDrop(index);

    itineraryCard.appendChild(div);
  });
  
}

let draggedIdx = null;
function handleDrop(targetIdx) {
  const list = itineraryData[currentDay];
  const movedItem = list.splice(draggedIdx, 1)[0];
  list.splice(targetIdx, 0, movedItem);
  saveAndRefresh();
}

window.deleteItem = (index) => {
  itineraryData[currentDay].splice(index, 1);
  saveAndRefresh();
};

window.updateNote = (index, val) => {
  itineraryData[currentDay][index].note = val;
  localStorage.setItem('itineraryData', JSON.stringify(itineraryData));
};

window.openMap = (lat, lng) => {
  if (lat && lng) {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  }
};

function saveAndRefresh() {
  localStorage.setItem('itineraryData', JSON.stringify(itineraryData));
  renderTabs();
  renderItinerary();
}

// Currency Logic
window.convertCurrency = () => {
  const amt = document.getElementById('amount').value;
  const rate = 4.6; // Example: TWD to JPY
  document.getElementById('res').innerText = `≈ ${(amt * rate).toFixed(0)} JPY`;
};

// Backup Logic
window.exportData = () => {
  const dataStr = JSON.stringify(itineraryData);
  navigator.clipboard.writeText(dataStr);
  alert("行程已複製到剪貼簿！您可以將此貼上給好友。");
};

init();