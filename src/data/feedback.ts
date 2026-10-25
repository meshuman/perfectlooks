// Where customer feedback goes.
//
// By default the feedback form opens WhatsApp with the answers filled in, addressed to the shop's
// phone number, so it works with no account or server. To collect responses somewhere else (for
// example a Formspree or Google Apps Script URL), set PUBLIC_FEEDBACK_ENDPOINT when building and the
// form posts the answers there as JSON instead, falling back to WhatsApp if that fails.
import { defaultShop } from './shop';

export const feedbackEndpoint: string = (import.meta.env.PUBLIC_FEEDBACK_ENDPOINT as string | undefined) ?? '';

/** The shop's WhatsApp number: digits only, as wa.me expects. */
export const whatsappNumber: string = defaultShop.phone.replace(/\D/g, '');
