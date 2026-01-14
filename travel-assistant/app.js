// 多語言切換
const langSelect = document.getElementById('lang');

langSelect.addEventListener('change', () => {
  if (langSelect.value === 'en') {
    document.querySelector('#itinerary h2').innerText = 'Today Plan';
  } else {
    document.querySelector('#itinerary h2').innerText = '今日行程';
  }
});

// PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}
