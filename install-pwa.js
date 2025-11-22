let deferredPrompt;
let isInstalled = false;

// Elements
const installButton = document.getElementById('installButton');
const iosPrompt = document.getElementById('iosPrompt');

// Check if already installed (standalone/PWA mode)
function isAlreadyInstalled() {
  return window.navigator.standalone === true || 
         window.matchMedia('(display-mode: standalone)').matches;
}

// Hide all install triggers if already installed
function updateInstallUI() {
  console.log('PWA Debug: Checking install status...', { isInstalled, isStandalone: isAlreadyInstalled() });
  if (isAlreadyInstalled() || isInstalled) {
    document.querySelectorAll('.install-trigger').forEach(el => {
      el.style.display = 'none';
    });
    console.log('PWA Debug: Hiding install UI (already installed)');
  } else {
    // Show triggers if installable
    document.querySelectorAll('.install-trigger').forEach(el => {
      el.style.display = el.tagName === 'BUTTON' ? 'block' : 'inline-block';
    });
    console.log('PWA Debug: Showing install UI');
  }
}

// Listen for Android/Chrome/Edge install prompt (non-iOS only)
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('PWA Debug: beforeinstallprompt fired!');
  e.preventDefault();
  deferredPrompt = e;
  updateInstallUI();
});

// Listen for install completion (hide UI)
window.addEventListener('appinstalled', () => {
  console.log('PWA Debug: appinstalled fired!');
  isInstalled = true;
  updateInstallUI();
});

// Main trigger function (for buttons/links)
function triggerInstall() {
  console.log('PWA Debug: Install triggered');
  
  // iOS: Show custom popup
  if (/iPhone|iPad|iPod/.test(navigator.userAgent) && !window.MSStream) {
    console.log('PWA Debug: iOS detected — showing popup');
    iosPrompt.style.display = 'flex';
    return;
  }
  
  // Firefox: Show instructions (no beforeinstallprompt support)
  if (/Firefox/.test(navigator.userAgent)) {
    console.log('PWA Debug: Firefox detected — showing manual instructions');
    alert('Firefox PWA Install:\n1. Tap the menu (three dots).\n2. Select "Install" or "Add to Home Screen".\n3. Your app will appear on your home screen!');
    return;
  }
  
  // Chrome/Edge: Native prompt
  if (deferredPrompt) {
    console.log('PWA Debug: Showing native prompt');
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choice) => {
      console.log('PWA Debug: User choice:', choice.outcome);
      if (choice.outcome === 'accepted') {
        isInstalled = true;
        updateInstallUI();
      }
      deferredPrompt = null;
    });
  } else {
    // Fallback if event didn't fire (criteria not met)
    console.log('PWA Debug: No prompt available — check Lighthouse PWA score');
    alert('Install Ready!\nYour browser detected this as installable. Look for the + icon in the address bar or menu to add to home screen.');
  }
}

// Close iOS popup
function hideIosPrompt() {
  console.log('PWA Debug: Closing iOS popup');
  iosPrompt.style.display = 'none';
}

// On load: Check status and update UI
window.addEventListener('load', () => {
  console.log('PWA Debug: Page loaded — checking PWA status');
  updateInstallUI();
});
