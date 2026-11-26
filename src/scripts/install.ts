// "Install the app" buttons. On Android and desktop Chrome the browser offers the install itself once the page is
// installable; the button opens that offer. On iPhone there is no offer, so the button shows how to use Share >
// Add to Home Screen. Both are hidden once the app is already installed and running as an app.

interface InstallPrompt extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const buttons = Array.from(document.querySelectorAll<HTMLElement>('[data-install]'));
const hints = Array.from(document.querySelectorAll<HTMLElement>('[data-install-hint]'));

const standalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
const iPhone = /iphone|ipad|ipod/i.test(navigator.userAgent) && !/crios|fxios|edgios/i.test(navigator.userAgent);

let offer: InstallPrompt | undefined;

const show = () => {
  if (standalone) return;
  for (const b of buttons) b.hidden = false;
};

if (!standalone) {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    offer = event as InstallPrompt;
    show();
  });
  window.addEventListener('appinstalled', () => {
    offer = undefined;
    for (const el of [...buttons, ...hints]) el.hidden = true;
  });
  // Safari on iPhone never fires the event, so the button is always there and explains the steps.
  if (iPhone) show();

  for (const b of buttons) {
    b.addEventListener('click', async () => {
      if (offer) {
        const prompt = offer;
        offer = undefined;
        await prompt.prompt();
        const { outcome } = await prompt.userChoice;
        if (outcome === 'accepted') for (const el of buttons) el.hidden = true;
      } else {
        for (const h of hints) h.hidden = false;
      }
    });
  }
}
