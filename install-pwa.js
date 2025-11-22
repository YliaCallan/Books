let deferredPrompt;
const installButton = document.getElementById('installButton');
const iosPrompt = document.getElementById('iosPrompt');

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  if (installButton) installButton.style.display = 'block';
});

function installApp() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => {
      deferredPrompt = null;
      if (installButton) installButton.style.display = 'none';
    });
  }
}

// iOS detection
function isIOS() {
  return /iPhone|iPad|iPod/.test(navigator.userAgent) && !window.MSStream;
}

if (isIOS() && !window.navigator.standalone) {
  setTimeout(() => {
    if (iosPrompt) iosPrompt.style.display = 'flex';
  }, 4000);
}

function hideIosPrompt() {
  if (iosPrompt) iosPrompt.style.display = 'none';
}

window.addEventListener('load', () => {
  if (installButton && !isIOS()) installButton.style.display = 'block';
});