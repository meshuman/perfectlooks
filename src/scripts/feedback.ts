// The feedback form: validates, builds one readable message, and sends it. The message is always
// written in English (from each field's data-en) so the shop reads the same labels whatever language
// the customer used. With an endpoint configured it posts there; otherwise it opens WhatsApp.

const form = document.querySelector<HTMLFormElement>('[data-feedback-form]');

if (form) {
  const done = document.querySelector<HTMLElement>('[data-feedback-done]')!;
  const status = form.querySelector<HTMLElement>('[data-feedback-status]')!;
  const submit = form.querySelector<HTMLButtonElement>('[data-feedback-submit]')!;
  const waLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-wa-link]'));
  const { endpoint = '', whatsapp = '', lang = 'en', msgSending = '', msgNeedRating = '', msgError = '' } = form.dataset;

  const label = (input: HTMLInputElement) => input.dataset.en ?? input.value;
  const checked = (name: string) => Array.from(form.querySelectorAll<HTMLInputElement>(`input[name="${name}"]:checked`)).map(label);
  const value = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | null)?.value.trim() ?? '';

  const say = (message: string, isError = false) => {
    status.textContent = message;
    status.hidden = !message;
    status.dataset.error = String(isError);
  };

  const collect = () => {
    const rating = checked('rating')[0] ?? '';
    const answers = {
      rating,
      goals: checked('goal'),
      helped: checked('helped')[0] ?? '',
      better: checked('better'),
      comment: value('comment'),
      name: value('name'),
      phone: value('phone'),
      language: lang,
    };
    const lines = [
      'KGF Unisex Saloon: customer feedback',
      `Rating: ${rating}/5`,
      answers.goals.length && `Hoping to: ${answers.goals.join(', ')}`,
      answers.helped && `Helped me decide: ${answers.helped}`,
      answers.better.length && `Could be better: ${answers.better.join(', ')}`,
      answers.comment && `Comment: ${answers.comment}`,
      (answers.name || answers.phone) && `Reply to: ${[answers.name, answers.phone].filter(Boolean).join(' · ')}`,
      `Page language: ${lang}`,
    ].filter(Boolean);
    return { answers, message: lines.join('\n') };
  };

  const whatsappUrl = (message: string) => `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;

  const finish = (viaWhatsApp: boolean, url: string) => {
    form.hidden = true;
    done.hidden = false;
    for (const link of waLinks) {
      link.href = url;
      link.hidden = !viaWhatsApp && !url;
    }
    done.querySelector<HTMLElement>('[data-done-whatsapp-note]')!.hidden = !viaWhatsApp;
    done.focus();
    done.scrollIntoView({ block: 'start' });
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!checked('rating').length) {
      say(msgNeedRating, true);
      form.querySelector<HTMLElement>('[data-rating-group]')?.scrollIntoView({ block: 'center' });
      return;
    }
    // A hidden field only bots fill in.
    if (value('website')) return;

    const { answers, message } = collect();
    const url = whatsappUrl(message);
    submit.disabled = true;
    say(msgSending);

    if (endpoint) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ ...answers, message }),
        });
        if (!response.ok) throw new Error(String(response.status));
        form.reset();
        say('');
        finish(false, '');
      } catch {
        // Offline or the service is down: don't lose the feedback, hand it to WhatsApp.
        say(msgError, true);
        for (const link of waLinks) link.href = url;
        form.querySelector<HTMLAnchorElement>('[data-wa-fallback]')!.hidden = false;
      } finally {
        submit.disabled = false;
      }
      return;
    }

    // No endpoint: open WhatsApp from this tap (a pop-up blocker allows it), and keep the link on the thank-you screen.
    const opened = window.open(url, '_blank');
    if (opened) opened.opener = null;
    else window.location.href = url;
    form.reset();
    say('');
    finish(true, url);
    submit.disabled = false;
  });
}
