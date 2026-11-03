// Launch switches. The women's section is built and linked in local development, and in a production
// build only when PUBLIC_WOMEN_LIVE=true. Otherwise the landing page shows a "Coming soon" card and no
// /women pages are built.
export const WOMEN_LIVE: boolean = import.meta.env.DEV || import.meta.env.PUBLIC_WOMEN_LIVE === 'true';

/** Who people message to hear when the women's section opens: digits with country code, for wa.me. */
export const womenNotifyNumber = '9779801033828';
