let deferredPrompt = null;
let hasShownIosPrompt = false;

const iosPrompt = document.getElementById('iosPrompt');

// Detect iOS (iPhone/iPad) — only these get the popup
function isIOS() {
  return /iPhone|iPad|iPod/.test(navigator.userAgent) && !window.MSStream;
}

// Detect if already running as installed app
function isStandalone() {
  return window.navigator.standalone === true || 
         window.matchMedia('(display-mode: standalone)').matches;
}

function updateInstallUI() {
  console.log("PWA Debug: Updating UI...", {
    isInstalled,
    standalone: isAlreadyInstalled(),
    deferredPrompt
  });

  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);

  // If installed → hide everything
  if (isInstalled || isAlreadyInstalled()) {
    document.querySelectorAll(".install-trigger").forEach(el => el.style.display = "none");
    return;
  }

  // ANDROID / CHROME: Only show button when beforeinstallprompt fired
  if (!isIOS && deferredPrompt) {
    installButton.style.display = "block";
    return;
  }

  // iOS: NEVER show automatically
  // Only show on user’s explicit click
  if (isIOS) {
    installButton.style.display = "block"; // small button, manual
    iosPrompt.style.display = "none"; // never show automatically
    return;
  }

  // Otherwise (desktop browsers, unsupported browsers): hide
  installButton.style.display = "none";
}


// Save the native install prompt (Chrome/Android/Edge)
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('PWA: beforeinstallprompt fired (Chrome/Android)');
  e.preventDefault();
  deferredPrompt = e;
  updateInstallUI();
});

// Main install trigger — used by ALL buttons/links
function triggerInstall() {
  console.log('PWA: Install triggered');

  // iOS: Show custom popup (only once per session)
  if (isIOS() && !isStandalone()) {
    if (!hasShownIosPrompt) {
      iosPrompt.style.display = 'flex';
      hasShownIosPrompt = true;
    }
    return;
  }

  // Chrome/Android/Edge: Native install
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choice) => {
      if (choice.outcome === 'accepted') {
        console.log('PWA: Installed!');
      }
      deferredPrompt = null;
    });
  }
}

// Close iOS popup
function hideIosPrompt() {
  iosPrompt.style.display = 'none';
}

// On page load
window.addEventListener('load', () => {
  console.log('PWA: Page loaded');
  updateInstallUI();
});

// Hide everything after actual install
window.addEventListener('appinstalled', () => {
  console.log('PWA: appinstalled event');
  document.querySelectorAll('.install-trigger').forEach(el => el.style.display = 'none');
});
