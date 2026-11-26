// The shop registration form on looksmenu.com, in steps: shop, location, owner, business, address and plan, then a check
// page. Each step is checked before you go on, earlier steps can be revisited, and the last page shows every answer with
// an Edit button. Sending opens WhatsApp to looksmenu with one readable message that also carries the shop record in the
// same shape as data/shops.json. Nothing is stored.

const form = document.querySelector<HTMLFormElement>('[data-register-form]');

if (form) {
  const done = document.querySelector<HTMLElement>('[data-register-done]')!;
  const status = form.querySelector<HTMLElement>('[data-register-status]')!;
  const submit = form.querySelector<HTMLButtonElement>('[data-register-submit]')!;
  const submitLabel = form.querySelector<HTMLElement>('[data-submit-label]')!;
  const backButton = form.querySelector<HTMLButtonElement>('[data-back]')!;
  const sections = Array.from(form.querySelectorAll<HTMLElement>('[data-step]'));
  const dots = Array.from(form.querySelectorAll<HTMLButtonElement>('button[data-goto]'));
  const count = form.querySelector<HTMLElement>('[data-step-count]')!;
  const bar = form.querySelector<HTMLElement>('[data-progress-bar]')!;
  const review = form.querySelector<HTMLElement>('[data-review]')!;
  const subInput = form.querySelector<HTMLInputElement>('[name="subdomain"]')!;
  const subStatus = form.querySelector<HTMLElement>('[data-sub-status]')!;
  const locationStatus = form.querySelector<HTMLElement>('[data-location-status]')!;
  const d = form.dataset as Record<string, string>;
  const taken: string[] = JSON.parse(d.taken ?? '[]');
  const RESERVED = ['www', 'app', 'api', 'admin', 'staging', 'preview', 'mail', 'shop', 'shops', 'test', 'demo', 'looksmenu', 'help', 'support'];
  const PHONE = /^\+\d[\d\s-]{7,16}$/;
  const last = sections.length - 1;

  const el = (name: string) => form.elements.namedItem(name) as HTMLInputElement;
  const value = (name: string) => (el(name)?.value ?? '').trim();
  const checked = (name: string) => Array.from(form.querySelectorAll<HTMLInputElement>(`input[name="${name}"]:checked`));
  const labels = (name: string) => checked(name).map((i) => i.dataset.en ?? i.value);
  const shown = (name: string) => checked(name).map((i) => i.closest('label')?.textContent?.trim() ?? i.value);
  const number = (name: string) => value(name).replace(/\s+/g, ' ');
  const say = (message: string, isError = false) => {
    status.textContent = message;
    status.hidden = !message;
    status.dataset.error = String(isError);
  };
  const mark = (name: string, bad: boolean) => el(name)?.setAttribute('aria-invalid', String(bad));

  // ---- The address: suggested from the shop name until the owner types their own ----
  const slugify = (text: string) =>
    text
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 30);
  let typedOwn = false;
  const checkSub = (): 'ok' | 'bad' | 'taken' | 'empty' => {
    const key = subInput.value.trim();
    if (!key) {
      subStatus.textContent = '';
      return 'empty';
    }
    if (!/^[a-z0-9][a-z0-9-]{1,29}$/.test(key)) {
      subStatus.textContent = d.msgSubBad ?? '';
      subStatus.dataset.error = 'true';
      return 'bad';
    }
    if (taken.includes(key) || RESERVED.includes(key)) {
      subStatus.textContent = d.msgSubTaken ?? '';
      subStatus.dataset.error = 'true';
      return 'taken';
    }
    subStatus.textContent = (d.msgSubOk ?? '').replace('{name}', key);
    subStatus.dataset.error = 'false';
    return 'ok';
  };
  subInput.addEventListener('input', () => {
    typedOwn = true;
    subInput.value = subInput.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    mark('subdomain', false);
    checkSub();
  });
  el('shop').addEventListener('input', () => {
    if (typedOwn) return;
    subInput.value = slugify(value('shop'));
    checkSub();
  });

  // ---- Location from the phone ----
  form.querySelector<HTMLButtonElement>('[data-use-location]')?.addEventListener('click', () => {
    if (!navigator.geolocation) {
      locationStatus.textContent = d.msgLocationFailed ?? '';
      return;
    }
    locationStatus.textContent = d.msgLocating ?? '';
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        el('lat').value = pos.coords.latitude.toFixed(6);
        el('lng').value = pos.coords.longitude.toFixed(6);
        mark('lat', false);
        mark('lng', false);
        locationStatus.textContent = d.msgLocated ?? '';
      },
      () => {
        locationStatus.textContent = d.msgLocationFailed ?? '';
      },
      { enableHighAccuracy: true, timeout: 12000 },
    );
  });

  // "Start free", "Tell me when it is ready" and "Register as ..." choose the plan or the type in the form.
  const choose = (name: string, v: string | undefined) => {
    const radio = form.querySelector<HTMLInputElement>(`input[name="${name}"][value="${v}"]`);
    if (radio) radio.checked = true;
  };
  for (const link of document.querySelectorAll<HTMLElement>('[data-plan]')) link.addEventListener('click', () => choose('plan', link.dataset.plan));
  for (const link of document.querySelectorAll<HTMLElement>('[data-type]')) link.addEventListener('click', () => choose('type', link.dataset.type));

  // ---- Checking one step at a time ----
  const checkStep = (index: number): string | undefined => {
    let first: string | undefined;
    const bad = (name: string, message: string) => {
      mark(name, true);
      first ??= message;
    };
    const need = (names: string[]) => {
      for (const n of names) {
        mark(n, false);
        if (!value(n)) bad(n, d.msgNeed ?? '');
      }
    };
    if (index === 0) {
      need(['shop', 'city']);
      if (!checked('type').length) first ??= d.msgNeed;
      mark('established', false);
      const year = value('established');
      if (year && !(/^\d{4}$/.test(year) && +year >= 1900 && +year <= new Date().getFullYear())) bad('established', d.msgYear ?? '');
    }
    if (index === 1) {
      for (const n of ['lat', 'lng']) mark(n, false);
      const lat = value('lat');
      const lng = value('lng');
      if (lat || lng) {
        if (!(lat !== '' && !Number.isNaN(+lat) && +lat >= -90 && +lat <= 90)) bad('lat', d.msgLocation ?? '');
        if (!(lng !== '' && !Number.isNaN(+lng) && +lng >= -180 && +lng <= 180)) bad('lng', d.msgLocation ?? '');
      }
    }
    if (index === 2) {
      need(['owner', 'whatsapp']);
      if (value('whatsapp') && !PHONE.test(number('whatsapp'))) bad('whatsapp', d.msgNumber ?? '');
      mark('mobile', false);
      if (value('mobile') && !PHONE.test(number('mobile'))) bad('mobile', d.msgNumber ?? '');
      mark('email', false);
      if (value('email') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value('email'))) bad('email', d.msgEmail ?? '');
    }
    if (index === 4) {
      need(['subdomain']);
      if (value('subdomain')) {
        const s = checkSub();
        if (s === 'bad' || s === 'taken') bad('subdomain', subStatus.textContent ?? '');
      }
    }
    if (index === last && !el('consent').checked) first ??= d.msgNeed;
    return first;
  };

  // ---- The check page: every answer, grouped by step, with Edit ----
  type Row = { label: string; text: string };
  const rows = (): Row[][] => {
    const empty = d.msgEmpty ?? '-';
    const label = (name: string) =>
      (form.querySelector<HTMLLabelElement>(`label[for="${el(name)?.id}"]`)?.textContent ?? name).trim().replace(/\s*\(.*\)$/, '');
    const legend = (name: string) => form.querySelector(`input[name="${name}"]`)?.closest('fieldset')?.querySelector('legend')?.textContent?.trim() ?? name;
    const field = (name: string, text: string): Row => ({ label: label(name), text: text || empty });
    const choice = (name: string): Row => ({ label: legend(name), text: shown(name).join(', ') || empty });
    return [
      [field('shop', value('shop')), choice('type'), field('address', value('address')), field('area', value('area')), field('city', value('city')), field('district', value('district')), field('established', value('established'))],
      [field('lat', value('lat') && value('lng') ? `${value('lat')}, ${value('lng')}` : ''), field('mapsUrl', value('mapsUrl'))],
      [field('owner', value('owner')), field('whatsapp', number('whatsapp')), field('mobile', number('mobile')), field('email', value('email'))],
      [choice('service'), field('staff', value('staff')), field('chairs', value('chairs')), choice('language'), field('facebook', value('facebook')), field('instagram', value('instagram'))],
      [field('subdomain', value('subdomain') ? `${value('subdomain')}.looksmenu.com` : ''), choice('plan')],
    ];
  };
  const renderReview = () => {
    review.textContent = '';
    rows().forEach((group, i) => {
      const box = document.createElement('div');
      box.className = 'bg-paper-2 p-4';
      const head = document.createElement('div');
      head.className = 'flex items-center justify-between gap-3';
      const title = document.createElement('p');
      title.className = 'text-[1rem] font-semibold';
      title.textContent = sections[i]!.querySelector('h3')?.textContent ?? '';
      const edit = document.createElement('button');
      edit.type = 'button';
      edit.className = 'min-h-11 text-[0.75rem] font-bold tracking-[0.12em] uppercase underline underline-offset-4';
      edit.textContent = d.msgEdit ?? 'Edit';
      edit.addEventListener('click', () => go(i));
      head.append(title, edit);
      const list = document.createElement('dl');
      list.className = 'mt-2 space-y-1.5 text-[0.875rem]';
      for (const r of group) {
        const line = document.createElement('div');
        line.className = 'grid grid-cols-[8.5rem_1fr] gap-3';
        const dt = document.createElement('dt');
        dt.className = 'text-muted';
        dt.textContent = r.label;
        const dd = document.createElement('dd');
        dd.className = 'break-words';
        dd.textContent = r.text;
        line.append(dt, dd);
        list.append(line);
      }
      box.append(head, list);
      review.append(box);
    });
  };

  // ---- Moving between steps ----
  let current = 0;
  let reached = 0;
  const go = (index: number, focus = true) => {
    current = Math.max(0, Math.min(last, index));
    reached = Math.max(reached, current);
    sections.forEach((s, i) => (s.hidden = i !== current));
    dots.forEach((dot, i) => {
      dot.dataset.state = i === current ? 'current' : i <= reached ? 'done' : 'todo';
      dot.disabled = i > reached;
      if (i === current) dot.setAttribute('aria-current', 'step');
      else dot.removeAttribute('aria-current');
    });
    count.textContent = (d.msgProgress ?? '').replace('{n}', String(current + 1)).replace('{total}', String(last + 1));
    bar.style.width = `${((current + 1) / (last + 1)) * 100}%`;
    backButton.hidden = current === 0;
    submitLabel.textContent = (current === last ? submit.dataset.labelSend : submit.dataset.labelNext) ?? '';
    say('');
    if (current === last) renderReview();
    if (focus) {
      form.scrollIntoView({ block: 'start', behavior: 'smooth' });
      sections[current]!.focus({ preventScroll: true });
    }
  };
  backButton.addEventListener('click', () => go(current - 1));
  for (const dot of dots) dot.addEventListener('click', () => go(Number(dot.dataset.goto)));

  // ---- What is sent ----
  const compose = () => {
    const record = {
      shop: value('shop'),
      type: checked('type')[0]?.value ?? '',
      owners: [{ name: value('owner'), role: 'Owner', whatsapp: number('whatsapp'), mobile: number('mobile'), email: value('email') }],
      whatsapp: number('whatsapp'),
      mobile: number('mobile'),
      email: value('email'),
      location: {
        address: value('address'),
        area: value('area'),
        city: value('city'),
        district: value('district'),
        country: 'NP',
        lat: value('lat') ? +value('lat') : null,
        lng: value('lng') ? +value('lng') : null,
        mapsUrl: value('mapsUrl'),
      },
      established: value('established') ? +value('established') : null,
      services: checked('service').map((i) => i.value),
      staff: value('staff') ? +value('staff') : null,
      chairs: value('chairs') ? +value('chairs') : null,
      languages: checked('language').map((i) => i.dataset.en ?? i.value),
      social: { facebook: value('facebook'), instagram: value('instagram') },
      lead: { status: 'lead', source: 'registration form', consentToMarketing: el('marketing').checked },
    };
    const where = [value('address'), value('area'), value('city'), value('district')].filter(Boolean).join(', ');
    const lines = [
      d.msgTitle ?? 'looksmenu: shop registration request',
      `Shop: ${record.shop} (${labels('type')[0] ?? ''})`,
      `Address wanted: ${value('subdomain')}.looksmenu.com`,
      `Plan: ${labels('plan')[0] ?? 'Free'}`,
      `Owner: ${value('owner')}`,
      `WhatsApp: ${number('whatsapp')}`,
      value('mobile') && `Mobile: ${number('mobile')}`,
      value('email') && `Email: ${value('email')}`,
      where && `Location: ${where}`,
      record.location.lat !== null && `Pin: ${record.location.lat}, ${record.location.lng}`,
      value('mapsUrl') && `Maps: ${value('mapsUrl')}`,
      value('established') && `Started: ${value('established')}`,
      labels('service').length && `Services: ${labels('service').join(', ')}`,
      (value('staff') || value('chairs')) && `Staff: ${value('staff') || '-'}, chairs: ${value('chairs') || '-'}`,
      labels('language').length && `Languages: ${labels('language').join(', ')}`,
      (value('facebook') || value('instagram')) && `Social: ${[value('facebook'), value('instagram')].filter(Boolean).join(' | ')}`,
      `Agrees to be contacted: yes. News and offers: ${el('marketing').checked ? 'yes' : 'no'}`,
      '',
      'Record:',
      JSON.stringify({ [value('subdomain')]: record }),
    ].filter((line) => line !== false && line !== '');
    return lines.join('\n');
  };

  // Enter or the main button: check this step, then go on; on the last step, send.
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    // A hidden field only bots fill in.
    if (value('website_url')) return;
    const problem = checkStep(current);
    if (problem) {
      say(problem, true);
      form.querySelector<HTMLElement>(`[data-step="${current}"] [aria-invalid="true"]`)?.focus();
      return;
    }
    if (current < last) {
      go(current + 1);
      return;
    }
    // Everything is checked once more before sending, in case an earlier step was edited.
    for (let i = 0; i < last; i++) {
      const earlier = checkStep(i);
      if (earlier) {
        go(i);
        say(earlier, true);
        return;
      }
    }
    say(d.msgSending ?? '');
    submit.disabled = true;
    const url = `https://wa.me/${d.whatsapp}?text=${encodeURIComponent(compose())}`;
    // Opened straight from the tap, so a pop-up blocker lets it through; the thank-you page keeps the link.
    window.open(url, '_blank', 'noopener');
    form.hidden = true;
    done.hidden = false;
    done.querySelector<HTMLAnchorElement>('[data-register-wa]')!.href = url;
    done.focus();
    done.scrollIntoView({ block: 'start' });
  });

  go(0, false);
}

export {};
