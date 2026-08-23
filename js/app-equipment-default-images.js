(() => {
  'use strict';

  if (!window.App) return;

  const EQUIPMENT_ART = {
    'cooler-gs15-neon': ['GS 1.5 Neon', 'cooler-mini'],
    'cooler-countertop': ['Countertop', 'cooler-mini'],
    'cooler-single-small': ['Single Door Small', 'cooler-single'],
    'cooler-single-medium': ['Single Door Medium', 'cooler-single'],
    'cooler-single-large': ['Single Door Large', 'cooler-single'],
    'cooler-double-small': ['Double Door Small', 'cooler-double'],
    'cooler-double-medium': ['Double Door Medium', 'cooler-double'],
    'cooler-double-large': ['Double Door Large', 'cooler-double'],
    'cooler-g10-monster': ['G-10 Monster', 'monster'],
    'cooler-fg-ret240': ['FG-RET240 Retro', 'retro'],
    'postmix-counter-6': ['Counter Electric 6v', 'postmix-6'],
    'postmix-counter-8': ['Counter Electric 8v', 'postmix-8'],
    'postmix-dropin-6': ['Drop-In 6v', 'dropin-6'],
    'postmix-dropin-8': ['Drop-In 8v', 'dropin-8'],
    'postmix-icebev-6': ['IceBev Combo 6v', 'icebev-6'],
    'postmix-icebev-8': ['IceBev Combo 8v', 'icebev-8'],
    'vending-stack-72': ['Stack 72', 'vending'],
    'vending-stack-79': ['Stack 79', 'vending'],
    'vending-glassfront-small': ['GFV Slim', 'vending-glass'],
    'vending-glassfront-large': ['GFV Large', 'vending-glass'],
    'vending-dn5800': ['DN-5800', 'vending'],
    'freestyle-7100': ['Freestyle 7100', 'freestyle'],
    'freestyle-8100': ['Freestyle 8100', 'freestyle'],
    'freestyle-9100': ['Freestyle 9100', 'freestyle'],
  };

  const esc = value => String(value || '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

  function coolerDrawing(kind) {
    if (kind === 'cooler-double') return `
      <rect x="105" y="80" width="430" height="430" rx="22" fill="#171a1d"/>
      <rect x="124" y="98" width="392" height="70" rx="10" fill="#e71920"/>
      <rect x="130" y="190" width="177" height="250" rx="7" fill="#eaf5f8"/>
      <rect x="333" y="190" width="177" height="250" rx="7" fill="#eaf5f8"/>
      ${[240,300,360,420].map(y => `<line x1="143" y1="${y}" x2="294" y2="${y}" stroke="#9eabb3" stroke-width="7"/><line x1="346" y1="${y}" x2="497" y2="${y}" stroke="#9eabb3" stroke-width="7"/>`).join('')}`;

    const mini = kind === 'cooler-mini';
    const x = mini ? 190 : 145;
    const y = mini ? 145 : 70;
    const w = mini ? 260 : 350;
    const h = mini ? 330 : 455;
    const header = kind === 'monster' ? '#111315' : '#e71920';
    return `
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="22" fill="#171a1d"/>
      <rect x="${x+18}" y="${y+18}" width="${w-36}" height="68" rx="9" fill="${header}"/>
      <rect x="${x+25}" y="${y+110}" width="${w-50}" height="${h-175}" rx="7" fill="#eaf5f8"/>
      ${[0,1,2,3].map(i => `<line x1="${x+38}" y1="${y+165+i*65}" x2="${x+w-38}" y2="${y+165+i*65}" stroke="#9eabb3" stroke-width="7"/>`).join('')}
      ${kind === 'monster' ? '<path d="M250 132 l25 -35 22 28 28 -37 25 44" fill="none" stroke="#52c34a" stroke-width="13" stroke-linecap="round"/>' : ''}
      ${kind === 'retro' ? '<path d="M180 175 Q320 105 460 175" fill="none" stroke="#fff" stroke-width="14" opacity=".9"/>' : ''}`;
  }

  function postmixDrawing(kind) {
    const valves = kind.endsWith('-8') ? 8 : 6;
    const dropin = kind.startsWith('dropin');
    const icebev = kind.startsWith('icebev');
    const start = 110;
    const width = 420;
    const spacing = (width - 70) / (valves - 1);
    return `
      ${icebev ? '<rect x="155" y="115" width="330" height="72" rx="15" fill="#15181b"/>' : ''}
      <rect x="90" y="180" width="460" height="270" rx="20" fill="#b8c0c6"/>
      <rect x="90" y="180" width="460" height="72" rx="20" fill="#e71920"/>
      <rect x="110" y="255" width="420" height="150" fill="#eef1f3"/>
      ${Array.from({length:valves}, (_,i) => { const cx = start + i*spacing; return `<rect x="${cx-16}" y="275" width="32" height="50" rx="5" fill="${i%2 ? '#16191c' : '#e71920'}"/><line x1="${cx}" y1="325" x2="${cx}" y2="378" stroke="#16191c" stroke-width="8"/>`; }).join('')}
      ${dropin ? '<rect x="68" y="445" width="504" height="42" rx="10" fill="#858f96"/>' : ''}`;
  }

  function vendingDrawing(glass) {
    return `
      <rect x="165" y="58" width="310" height="500" rx="22" fill="#e71920"/>
      <rect x="195" y="125" width="200" height="325" rx="9" fill="#172027"/>
      <rect x="210" y="145" width="170" height="280" rx="5" fill="#dcecf2" ${glass ? 'stroke="#6f9daa" stroke-width="7"' : ''}/>
      ${[195,255,315,375].map(y => `<line x1="222" y1="${y}" x2="368" y2="${y}" stroke="#95a4ad" stroke-width="7"/>`).join('')}
      <rect x="410" y="170" width="35" height="145" rx="8" fill="#16191c"/>
      <rect x="207" y="475" width="226" height="55" rx="10" fill="#16191c"/>`;
  }

  function freestyleDrawing() {
    return `
      <rect x="195" y="52" width="250" height="520" rx="45" fill="#e71920"/>
      <rect x="238" y="120" width="164" height="132" rx="18" fill="#f5f6f7" stroke="#171a1d" stroke-width="8"/>
      <circle cx="320" cy="365" r="76" fill="#d6dadd" stroke="#171a1d" stroke-width="10"/>
      <rect x="287" y="335" width="66" height="52" rx="12" fill="#171a1d"/>
      <path d="M300 445 Q320 470 340 445" fill="none" stroke="#fff" stroke-width="10"/>`;
  }

  function buildSvg(label, kind) {
    let drawing = '';
    if (kind.startsWith('cooler') || kind === 'monster' || kind === 'retro') drawing = coolerDrawing(kind);
    else if (kind.startsWith('postmix') || kind.startsWith('dropin') || kind.startsWith('icebev')) drawing = postmixDrawing(kind);
    else if (kind.startsWith('vending')) drawing = vendingDrawing(kind === 'vending-glass');
    else if (kind === 'freestyle') drawing = freestyleDrawing();

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" role="img" aria-label="${esc(label)}">
      <rect width="640" height="640" rx="45" fill="#fafafa"/>
      ${drawing}
      <rect x="65" y="563" width="510" height="48" rx="16" fill="#fff" stroke="#e0e5e9"/>
      <text x="320" y="594" text-anchor="middle" font-family="Arial,sans-serif" font-size="23" font-weight="700" fill="#202428">${esc(label)}</text>
      <text x="320" y="626" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" fill="#6e767d">Ilustração local · confirme pela fotografia ou placa real</text>
    </svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  const baseManualImageHtml = window.App.equipmentManualImageHtml;

  Object.assign(window.App, {
    equipmentDefaultImage(itemOrId) {
      const id = typeof itemOrId === 'string' ? itemOrId : itemOrId?.id;
      const entry = EQUIPMENT_ART[id];
      return entry ? buildSvg(entry[0], entry[1]) : '';
    },

    equipmentManualImageHtml(item, context = 'card') {
      const manual = this.equipmentManualImage(item);
      if (manual?.dataUrl) return baseManualImageHtml.call(this, item, context);

      const src = this.equipmentDefaultImage(item);
      if (!src) return baseManualImageHtml.call(this, item, context);

      return `<div class="equipment-manual-image-wrap equipment-default-image-wrap ${context === 'inspector' ? 'is-inspector' : 'is-card'}" data-default-image="true">
        <img class="equipment-manual-image equipment-default-image" src="${this.escapeAttr(src)}" alt="Ilustração de ${this.escapeAttr(item.name)}" loading="lazy" />
        <span class="equipment-manual-badge">Ilustração local</span>
      </div>`;
    },
  });
})();