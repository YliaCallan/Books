let deferredPrompt;
let isInstalled = false;

const iosPrompt = document.getElementById('iosPrompt');

// Check if already installed (PWA or iOS standalone mode)
function isAlreadyInstalled() {
  return window.navigator.standalone === true || 
         window.matchMedia('(display-mode: standalone)').matches;
}

// Hide install elements if already installed
function updateInstallUI() {
  if (isAlreadyInstalled() || isInstalled) {
    document.querySelectorAll('.install-trigger').forEach(el => {
      el.style.display = 'none';
    });
  }
}

// Android/Desktop: save the install prompt
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  updateInstallUI(); // Show triggers if installable
});

// Main install function — used by button AND text links
function triggerInstall() {
  // iOS: show custom popup
  if (/iPhone|iPad|iPod/.test(navigator.userAgent) && !window.MSStream) {
    iosPrompt.style.display = 'flex';
  } 
  // Android/Desktop: show native install dialog
  else if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choice) => {
      if (choice.outcome === 'accepted') {
        isInstalled = true;
        updateInstallUI();
      }
      deferredPrompt = null;
    });
  }
}

// Close iOS popup
function hideIosPrompt() {
  iosPrompt.style.display = 'none';
}

// Run on load
window.addEventListener('load', () => {
  updateInstallUI();
});

// Also hide everything when app is actually installed
window.addEventListener('appinstalled', () => {
  isInstalled = true;
  updateInstallUI();
});
