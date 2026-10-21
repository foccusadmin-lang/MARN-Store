(() => {
  const CFG = window.STORE_CONFIG;
  const PRODUCTS = window.PRODUCTS;
  const MENU = window.MENU;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const brl = v => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const byId = id => PRODUCTS.find(p => p.id === id);
  const off = p => p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  const pix = v => v * (1 - CFG.pixDiscount);
  const waLink = text => `https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent(text)}`;

  // Armazenamento local (pode falhar em modo privado)
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem("marn:" + k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem("marn:" + k, JSON.stringify(v)); } catch {} }
  };

  const state = {
    filter: {},           // { category, theme, audience, occasion, custom, promo, best }
    title: "Todos os produtos",
    query: "",
    sort: "relevance",
    cart: store.get("cart", []),
    favs: new Set(store.get("favs", [])),
    orders: store.get("orders", []),
    profile: store.get("profile", {})
  };

  // ---------- Card de produto ----------
  const heart = `<svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.5-9.3C1.1 8.3 3.4 4.5 7 4.5c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.6 0 5.9 3.8 4.5 7.2C19.5 16.4 12 21 12 21z"/></svg>`;
  const media = p => p.image ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy">` : `<span aria-hidden="true">${p.emoji}</span>`;
  const stars = r => "★★★★★".slice(0, Math.round(r)) + "☆☆☆☆☆".slice(0, 5 - Math.round(r));

  function card(p) {
    const o = off(p);
    const needsChoice = p.custom || p.sizes || p.options;
    return `
      <article class="product" data-id="${p.id}">
        <div class="product-media" data-peek="${p.id}" role="button" tabindex="0" aria-label="Espiar ${esc(p.name)}">
          ${media(p)}
          <div class="tags">
            ${o ? `<span class="tag off">${o}% OFF</span>` : ""}
            ${p.price >= CFG.freeShippingFrom ? `<span class="tag ship">Frete grátis</span>` : ""}
          </div>
          <button class="fav-btn ${state.favs.has(p.id) ? "on" : ""}" data-fav="${p.id}" aria-label="Favoritar">${heart}</button>
        </div>
        <div class="product-body">
          <span class="product-name" data-peek="${p.id}">${esc(p.name)}</span>
          <span class="rating">${stars(p.rating)} <span>${p.rating.toFixed(1)}</span>${p.custom ? ` · <span class="custom-tag">Personalizável</span>` : ""}</span>
          <span class="price-old ${o ? "" : "none"}">${o ? brl(p.oldPrice) : ""}</span>
          <span class="price-main">${brl(p.price)}</span>
          <span class="price-pix">${brl(pix(p.price))} no Pix</span>
          <span class="installments">ou ${CFG.maxInstallments}x de ${brl(p.price / CFG.maxInstallments)}</span>
          <div class="card-actions">
            <button class="buy-btn" data-${needsChoice ? "peek" : "add"}="${p.id}">Comprar</button>
            <button class="peek-btn" data-peek="${p.id}">Espiar</button>
          </div>
        </div>
      </article>`;
  }

  // ---------- Filtros ----------
  function matches(p, f) {
    return (!f.category || p.category === f.category) &&
      (!f.theme || p.theme === f.theme) &&
      (!f.audience || (p.audience || []).includes(f.audience)) &&
      (!f.occasion || (p.occasions || []).includes(f.occasion)) &&
      (!f.custom || p.custom) &&
      (!f.promo || p.oldPrice) &&
      (!f.best || p.best);
  }

  function sortList(list, sort) {
    const l = list.slice();
    if (sort === "price-asc") l.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") l.sort((a, b) => b.price - a.price);
    if (sort === "name") l.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    if (sort === "off") l.sort((a, b) => off(b) - off(a));
    if (sort === "best") l.sort((a, b) => (b.best ? 1 : 0) - (a.best ? 1 : 0) || b.rating - a.rating);
    return l;
  }

  function filtered() {
    const q = state.query.trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    const list = PRODUCTS.filter(p => matches(p, state.filter) && (!q ||
      [p.name, p.category, p.theme, p.description, ...(p.occasions || []), ...(p.audience || [])].join(" ")
        .toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").includes(q)));
    return sortList(list, state.sort);
  }

  function titleFor(f) {
    if (f.promo) return "Promoções";
    if (f.best) return "Mais vendidos";
    const parts = [];
    if (f.category) parts.push(f.category);
    if (f.theme) parts.push(f.theme);
    if (f.occasion) parts.push(f.occasion);
    if (f.audience) parts.push(f.audience === "Cristão" ? "Linha Cristã" : f.audience);
    if (f.custom) parts.push("Personalizados");
    return parts.join(" · ") || "Todos os produtos";
  }

  // ---------- Menu ----------
  function renderMenus() {
    const fattr = f => esc(JSON.stringify(f));
    $("#mainnav").innerHTML =
      `<div class="nav-item wide-only"><a href="#" class="nav-link" data-nav="home">Início</a></div>` +
      `<div class="nav-item"><a href="#" class="nav-link" data-filter="{}">Todos os produtos</a></div>` +
      MENU.map(g => `
        <div class="nav-item">
          <button class="nav-link" aria-haspopup="true">${esc(g.title)} <span class="caret">▾</span></button>
          <div class="mega">${g.items.map(i => `<a href="#" data-filter="${fattr(i.filter)}">${esc(i.label)}</a>`).join("")}</div>
        </div>`).join("") +
      `<div class="nav-item"><a href="#" class="nav-link hot" data-filter='{"promo":true}'>Promoções</a></div>` +
      `<div class="nav-item wide-only"><a href="#" class="nav-link" data-nav="contact">Contato</a></div>` +
      `<div class="nav-item mid-hide"><a href="#" class="nav-link" data-nav="track">Rastreie seu pedido</a></div>`;

    $("#menu-body").innerHTML =
      `<a href="#" data-nav="home">Início</a><a href="#" data-filter="{}">Todos os produtos</a>` +
      MENU.map(g => `<details><summary>${esc(g.title)}</summary>${g.items.map(i =>
        `<a href="#" data-filter="${fattr(i.filter)}">${esc(i.label)}</a>`).join("")}</details>`).join("") +
      `<a href="#" class="hot" data-filter='{"promo":true}'>Promoções</a>
       <a href="#" data-nav="track">Rastreie seu pedido</a>
       <a href="#" data-nav="contact">Contato</a>
       <a href="#" data-nav="account">Minha conta</a>`;

    $("#footer-cats").innerHTML = MENU[0].items.concat(MENU[1].items.slice(0, 2))
      .map(i => `<li><a href="#" data-filter="${fattr(i.filter)}">${esc(i.label)}</a></li>`).join("");
  }

  // ---------- Carrossel ----------
  const SLIDES = [
    { script: "um lugar de design", title: "Presentes que <em>contam histórias</em>", text: "Canecas, camisetas, bíblias e kits personalizados — do mais simples ao mais elegante.", cta: "Ver todos os produtos", filter: {}, art: `<img src="brand/emblem.png" alt="">`, glow: "rgba(201,139,94,.38)" },
    { script: "linha cristã", title: "Bíblias e agendas <em>com seu nome</em>", text: "Capas exclusivas, versículos e kits de fé para presentear quem você ama.", cta: "Conhecer a linha cristã", filter: { audience: "Cristão" }, art: "📖", glow: "rgba(143,196,198,.35)" },
    { script: "personalizados", title: "Canecas com <em>nome, frase ou foto</em>", text: "Mais de 10 temas: cristã, namorados, família, amiga, divertidas, signos e profissões.", cta: "Personalizar caneca", filter: { category: "Canecas" }, art: "☕", glow: "rgba(201,139,94,.38)" },
    { script: "kits presente", title: "Do simples ao <em>mais elegante</em>", text: "Kits a partir de R$ 79,90, montados com carinho e embalagem especial.", cta: "Ver kits presente", filter: { category: "Kits Presente" }, art: "🎁", glow: "rgba(201,203,207,.30)" },
    { script: "ofertas", title: "Promoções com até <em>25% OFF</em>", text: "Aproveite: além do desconto, mais 5% no Pix.", cta: "Ver promoções", filter: { promo: true }, art: "🏷️", glow: "rgba(143,196,198,.35)" }
  ];
  let slideIdx = 0, slideTimer;
  function renderCarousel() {
    $("#slides").innerHTML = SLIDES.map(s => `
      <div class="slide" style="--glow:${s.glow}">
        <div>
          <span class="script">${s.script}</span>
          <h2>${s.title}</h2>
          <p>${s.text}</p>
          <a href="#" class="btn btn-primary" data-filter="${esc(JSON.stringify(s.filter))}">${s.cta}</a>
        </div>
        <div class="slide-art" aria-hidden="true">${s.art}</div>
      </div>`).join("");
    $("#dots").innerHTML = SLIDES.map((_, i) => `<button data-dot="${i}" aria-label="Banner ${i + 1}"></button>`).join("");
    goSlide(0);
  }
  function goSlide(i) {
    slideIdx = (i + SLIDES.length) % SLIDES.length;
    $("#slides").style.transform = `translateX(-${slideIdx * 100}%)`;
    $$("#dots button").forEach((d, j) => d.classList.toggle("active", j === slideIdx));
    clearInterval(slideTimer);
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) slideTimer = setInterval(() => goSlide(slideIdx + 1), 6000);
  }
  // Arrastar com o dedo
  let touchX = null;
  $("#carousel").addEventListener("touchstart", e => { touchX = e.touches[0].clientX; }, { passive: true });
  $("#carousel").addEventListener("touchend", e => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) goSlide(slideIdx + (dx < 0 ? 1 : -1));
    touchX = null;
  });

  // ---------- Página inicial ----------
  function rail(title, f, opts = {}) {
    const list = sortList(PRODUCTS.filter(p => matches(p, f)), opts.sort || "relevance").slice(0, 8);
    return `
      <div class="section-head"><h2>${esc(title)}</h2><a href="#" class="see-all" data-filter="${esc(JSON.stringify(f))}">Ver todos ›</a></div>
      <div class="rail">${list.map(card).join("")}</div>`;
  }
  function renderHome() {
    $("#home-sections").innerHTML =
      rail("Mais vendidos", { best: true }) +
      `<div class="promos">
        <button class="promo" data-emoji="✍️" data-filter='{"custom":true}'><small>personalizados</small><strong>Do seu jeito</strong><span>Nome, frase ou foto ›</span></button>
        <button class="promo copper" data-emoji="🏷️" data-filter='{"promo":true}'><small>ofertas</small><strong>Promoção</strong><span>Até 25% OFF ›</span></button>
        <button class="promo aqua" data-emoji="🎁" data-filter='{"category":"Kits Presente"}'><small>presentes</small><strong>Kits Presente</strong><span>A partir de R$ 79,90 ›</span></button>
      </div>` +
      rail("Linha Cristã", { audience: "Cristão" }) +
      rail("Canecas personalizadas", { category: "Canecas" }) +
      rail("Kits presente", { category: "Kits Presente" }) +
      rail("Promoções", { promo: true }, { sort: "off" });
  }

  // ---------- Catálogo ----------
  function renderCatalog() {
    const list = filtered();
    $("#cat-title").textContent = state.query ? `Busca: “${state.query}”` : state.title;
    $("#cat-crumb").textContent = state.query ? "Busca" : state.title;
    $("#cat-count").textContent = `${list.length} produto${list.length === 1 ? "" : "s"}`;
    $("#grid").innerHTML = list.map(card).join("");
    $("#empty").hidden = list.length > 0;

    // Chips: temas dentro da categoria, ou categorias
    const f = state.filter;
    let chips = "";
    if (f.category) {
      const themes = [...new Set(PRODUCTS.filter(p => p.category === f.category).map(p => p.theme))];
      if (themes.length > 1) chips = [`<button class="chip ${!f.theme ? "active" : ""}" data-filter="${esc(JSON.stringify({ ...f, theme: undefined }))}">Todos</button>`]
        .concat(themes.map(t => `<button class="chip ${f.theme === t ? "active" : ""}" data-filter="${esc(JSON.stringify({ ...f, theme: t }))}">${esc(t)}</button>`)).join("");
    } else {
      const cats = [...new Set(PRODUCTS.map(p => p.category))];
      chips = cats.map(c => `<button class="chip" data-filter="${esc(JSON.stringify({ ...f, category: c }))}">${esc(c)}</button>`).join("");
    }
    $("#cat-chips").innerHTML = chips;
    $("#aud-chips").innerHTML = [`<button class="chip ${!f.audience ? "active" : ""}" data-filter="${esc(JSON.stringify({ ...f, audience: undefined }))}">Todos os públicos</button>`]
      .concat(window.AUDIENCES.map(a => `<button class="chip ${f.audience === a ? "active" : ""}" data-filter="${esc(JSON.stringify({ ...f, audience: a }))}">${esc(a)}</button>`)).join("");
  }

  function openCatalog(f) {
    state.filter = Object.fromEntries(Object.entries(f).filter(([, v]) => v !== undefined && v !== null));
    state.title = titleFor(state.filter);
    state.query = ""; $("#search").value = "";
    navigate("catalog");
  }

  // ---------- Favoritos / carrinho ----------
  function renderFavs() {
    const list = PRODUCTS.filter(p => state.favs.has(p.id));
    $("#fav-grid").innerHTML = list.map(card).join("");
    $("#fav-empty").hidden = list.length > 0;
  }

  function totals() {
    const subtotal = state.cart.reduce((s, i) => s + byId(i.id).price * i.qty, 0);
    const shipping = subtotal === 0 || subtotal >= CFG.freeShippingFrom ? 0 : CFG.shippingFee;
    return { subtotal, shipping, total: subtotal + shipping };
  }

  function renderCart() {
    const box = $("#cart-items");
    box.innerHTML = !state.cart.length
      ? `<p class="empty">Seu carrinho está vazio.<br><span class="small">Que tal um presente especial? 🎁</span></p>`
      : state.cart.map(i => {
        const p = byId(i.id);
        return `
          <div class="cart-item">
            <div class="cart-thumb product-media">${media(p)}</div>
            <div>
              <h4>${esc(p.name)}</h4>
              <small>${[i.variant, i.custom && `“${i.custom}”`].filter(Boolean).map(esc).join(" · ") || brl(p.price)}</small>
              <div><span class="qty">
                <button data-qty="-1" data-key="${esc(i.key)}" aria-label="Diminuir">−</button>
                <span>${i.qty}</span>
                <button data-qty="1" data-key="${esc(i.key)}" aria-label="Aumentar">+</button>
              </span></div>
            </div>
            <div style="text-align:right">
              <strong>${brl(p.price * i.qty)}</strong><br>
              <button class="remove" data-remove="${esc(i.key)}">Remover</button>
            </div>
          </div>`;
      }).join("");
    const t = totals();
    const missing = CFG.freeShippingFrom - t.subtotal;
    $("#ship-meter").innerHTML = !t.subtotal ? "" : missing > 0
      ? `Faltam <strong>${brl(missing)}</strong> para ganhar <strong>frete grátis</strong><div class="bar"><i style="width:${Math.min(100, t.subtotal / CFG.freeShippingFrom * 100)}%"></i></div>`
      : `🎉 Você ganhou <strong>frete grátis</strong>!<div class="bar"><i style="width:100%"></i></div>`;
    $("#cart-subtotal").textContent = brl(t.subtotal);
    $("#cart-shipping").textContent = !t.subtotal ? "—" : t.shipping ? brl(t.shipping) : "Grátis";
    $("#cart-total").textContent = brl(t.total);
    $("#pix-total").textContent = t.subtotal ? `${brl(pix(t.total))} no Pix ou ${CFG.maxInstallments}x de ${brl(t.total / CFG.maxInstallments)}` : "";
    $("#checkout-btn").disabled = !state.cart.length;
  }

  function renderBadges() {
    const n = state.cart.reduce((s, i) => s + i.qty, 0);
    $$('[data-count="cart"]').forEach(b => { b.textContent = n; b.toggleAttribute("data-zero", !n); });
    $$('[data-count="fav"]').forEach(b => { b.textContent = state.favs.size; b.toggleAttribute("data-zero", !state.favs.size); });
  }

  function renderOrders() {
    $("#orders").innerHTML = state.orders.length
      ? state.orders.slice().reverse().map(o => `<li><strong>Pedido #${o.id}</strong> · ${new Date(o.date).toLocaleDateString("pt-BR")}<br>
          <span class="muted">${o.items} item(ns) · ${brl(o.total)} · ${esc(o.payment)}</span></li>`).join("")
      : `<li class="muted">Nenhum pedido ainda.</li>`;
  }

  function saveCart() { store.set("cart", state.cart); renderCart(); renderBadges(); }

  function addToCart(id, variant = "", custom = "") {
    const key = `${id}|${variant}|${custom}`;
    const item = state.cart.find(i => i.key === key);
    item ? item.qty++ : state.cart.push({ key, id, qty: 1, variant, custom });
    saveCart();
    toast(`${byId(id).name} foi para o carrinho`);
  }

  function toggleFav(id) {
    state.favs.has(id) ? state.favs.delete(id) : state.favs.add(id);
    store.set("favs", [...state.favs]);
    $$(`[data-fav="${id}"]`).forEach(b => b.classList.toggle("on", state.favs.has(id)));
    renderBadges();
    if ($("#view-favorites").classList.contains("active")) renderFavs();
  }

  // ---------- Espiar (detalhe) ----------
  function openDetail(id) {
    const p = byId(id);
    const o = off(p);
    const groups = [p.sizes && ["Tamanho", p.sizes], p.options && ["Opção", p.options]].filter(Boolean);
    $("#pm-body").innerHTML = `
      <div class="pd">
        <div class="pd-media product-media">${media(p)}
          <div class="tags">${o ? `<span class="tag off">${o}% OFF</span>` : ""}${p.price >= CFG.freeShippingFrom ? `<span class="tag ship">Frete grátis</span>` : ""}</div>
        </div>
        <div class="pd-info">
          <span class="crumbs">${esc(p.category)} › ${esc(p.theme || "")}</span>
          <h2 id="pm-title">${esc(p.name)}</h2>
          <span class="rating">${stars(p.rating)} <span>${p.rating.toFixed(1)} · avaliação dos clientes</span></span>
          <div class="aud">${(p.audience || []).map(a => `<span>${esc(a)}</span>`).join("")}${(p.occasions || []).map(a => `<span>${esc(a)}</span>`).join("")}</div>
          ${o ? `<span class="price-old">${brl(p.oldPrice)}</span>` : ""}
          <span class="price-main">${brl(p.price)}</span>
          <span class="price-pix">${brl(pix(p.price))} no Pix (5% de desconto)</span>
          <span class="installments">ou ${CFG.maxInstallments}x de ${brl(p.price / CFG.maxInstallments)} no cartão</span>
          <p class="muted">${esc(p.description)}</p>
          ${groups.map(([label, vals], gi) => `<div><strong class="small">${label}</strong><div class="sizes" data-group="${gi}" style="margin-top:6px">${
            vals.map((v, i) => `<button class="size ${i === 0 ? "active" : ""}" data-variant="${esc(v)}">${esc(v)}</button>`).join("")}</div></div>`).join("")}
          ${p.custom ? `<label class="custom-field" for="pm-custom">✍️ Personalização (nome, frase, versículo ou data)
            <textarea id="pm-custom" rows="2" maxlength="140" placeholder="Ex.: Para Ana, com amor ❤ — Salmos 23"></textarea></label>
            <span class="small muted">Para personalizar com foto, envie a imagem pelo WhatsApp após o pedido.</span>` : ""}
          <div class="pd-actions">
            <button class="btn btn-primary" id="pm-add">Comprar</button>
            <button class="fav-btn ${state.favs.has(p.id) ? "on" : ""}" data-fav="${p.id}" aria-label="Favoritar">${heart}</button>
          </div>
          <ul class="pd-perks">
            <li>🚚 Frete grátis acima de ${brl(CFG.freeShippingFrom)}</li>
            <li>🔄 Troca grátis em até 7 dias após o recebimento</li>
            <li>🔒 Compra 100% segura</li>
          </ul>
        </div>
      </div>`;
    $$("#pm-body .sizes").forEach(g => g.addEventListener("click", e => {
      const b = e.target.closest(".size"); if (!b) return;
      $$(".size", g).forEach(x => x.classList.remove("active")); b.classList.add("active");
    }));
    $("#pm-add").addEventListener("click", () => {
      const variant = $$("#pm-body .size.active").map(b => b.dataset.variant).join(" / ");
      const custom = ($("#pm-custom")?.value || "").trim();
      addToCart(p.id, variant, custom);
      close($("#product-modal"));
      renderCart(); open($("#cart"));
    });
    open($("#product-modal"));
  }

  // ---------- Páginas institucionais ----------
  const INFO = {
    sobre: `<h2>Sobre a MARN Store</h2><p>A MARN Store é <em>um lugar de design</em>: criamos presentes personalizados com estilo sofisticado e rústico — canecas, camisetas, bíblias, agendas e kits — do presente mais simples ao mais elegante.</p><p>Atendemos o público teen, adulto e cristão, na loja online e no nosso espaço físico, com prateleiras, bancada de personalização, mezanino e expositor.</p>`,
    trocas: `<h2>Trocas e devoluções</h2><p>Você pode solicitar a troca ou devolução em até 7 dias após o recebimento, conforme o Código de Defesa do Consumidor.</p><p>Produtos personalizados só podem ser trocados em caso de defeito de fabricação ou erro na personalização. Fale com a gente pelo WhatsApp.</p>`,
    entrega: `<h2>Prazos e entregas</h2><p>Produtos personalizados levam de 2 a 5 dias úteis para produção, mais o prazo de entrega da transportadora.</p><p>Frete grátis em compras acima de ${brl(CFG.freeShippingFrom)}. Também é possível retirar na loja física.</p>`,
    privacidade: `<h2>Política de privacidade</h2><p>Usamos seus dados apenas para processar pedidos e melhorar sua experiência. Seus dados não são vendidos nem compartilhados com terceiros, exceto quando necessário para entrega e pagamento.</p>`
  };

  // ---------- Navegação ----------
  function open(el) { el.hidden = false; document.body.classList.add("lock"); }
  function close(el) { if (!el) return; el.hidden = true; if (!$$(".sheet:not([hidden]), .drawer:not([hidden])").length) document.body.classList.remove("lock"); }

  function navigate(view) {
    $$(".view").forEach(v => v.classList.toggle("active", v.id === "view-" + view));
    $$(".bottom-nav [data-nav]").forEach(b => b.classList.toggle("active", b.dataset.nav === view));
    if (view === "catalog") renderCatalog();
    if (view === "favorites") renderFavs();
    if (view === "account") { renderOrders(); fillForm($("#profile-form"), state.profile); }
    close($("#menu"));
    window.scrollTo({ top: 0 });
  }

  function fillForm(form, data) {
    for (const [k, v] of Object.entries(data || {})) if (form.elements[k] && form.elements[k].type !== "radio") form.elements[k].value = v;
  }

  let toastTimer;
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
  }

  // Confirmação com link real para o WhatsApp (pop-ups automáticos são bloqueados em muitos celulares)
  function waConfirm(title, text, url, label) {
    $("#pm-body").innerHTML = `
      <div class="confirm">
        <img src="brand/emblem.png" alt="" width="72" height="72">
        <h2 id="pm-title">${esc(title)}</h2>
        <p class="muted">${esc(text)}</p>
        <a class="btn btn-primary btn-block" href="${esc(url)}" target="_blank" rel="noopener" data-close-after>${esc(label)}</a>
      </div>`;
    $("#pm-body [data-close-after]").addEventListener("click", () => setTimeout(() => close($("#product-modal")), 300));
    open($("#product-modal"));
  }

  // ---------- Checkout ----------
  function checkout(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    const t = totals();
    const total = data.payment === "Pix" ? pix(t.total) : t.total;
    const lines = state.cart.map(i => {
      const p = byId(i.id);
      const extra = [i.variant, i.custom && `Personalização: "${i.custom}"`].filter(Boolean).join(" | ");
      return `• ${i.qty}x ${p.name}${extra ? ` (${extra})` : ""} — ${brl(p.price * i.qty)}`;
    });
    const id = Date.now().toString().slice(-6);
    const msg = [
      `*Novo pedido #${id} — ${CFG.name}*`, "", ...lines, "",
      `Subtotal: ${brl(t.subtotal)}`, `Frete: ${t.shipping ? brl(t.shipping) : "Grátis"}`,
      `*Total (${data.payment}): ${brl(total)}*`, "",
      `Nome: ${data.name}`, `WhatsApp: ${data.phone}`, `CEP: ${data.cep}`, `Endereço: ${data.address}`
    ].join("\n");
    state.orders.push({ id, date: Date.now(), items: state.cart.reduce((s, i) => s + i.qty, 0), total, payment: data.payment });
    store.set("orders", state.orders);
    state.profile = { name: data.name, phone: data.phone, cep: data.cep, address: data.address }; store.set("profile", state.profile);
    state.cart = []; saveCart();
    close($("#checkout")); close($("#cart"));
    waConfirm(`Pedido #${id} registrado!`, "Toque no botão abaixo para enviar o pedido pelo WhatsApp. Nossa equipe confirma a personalização e o pagamento por lá.", waLink(msg), "Enviar pedido no WhatsApp");
  }

  // ---------- Eventos ----------
  document.addEventListener("click", e => {
    if (e.target.matches("[data-close]")) return close(e.target.closest(".sheet, .drawer"));
    const t = e.target.closest("button, a, [data-peek]");
    if (!t) return;
    const d = t.dataset;
    if (d.fav) { e.preventDefault(); e.stopPropagation(); return toggleFav(+d.fav); }
    if (d.add) return addToCart(+d.add);
    if (d.peek) return openDetail(+d.peek);
    if (d.filter !== undefined) { e.preventDefault(); return openCatalog(JSON.parse(d.filter || "{}")); }
    if (d.nav) { e.preventDefault(); return navigate(d.nav); }
    if (d.info) { e.preventDefault(); $("#info-body").innerHTML = INFO[d.info]; return navigate("info"); }
    if (d.open === "cart") { renderCart(); return open($("#cart")); }
    if (d.open === "menu") return open($("#menu"));
    if (d.car) return goSlide(slideIdx + +d.car);
    if (d.dot) return goSlide(+d.dot);
    if (d.close !== undefined) return close(t.closest(".sheet, .drawer"));
    if (d.qty) {
      const item = state.cart.find(i => i.key === d.key);
      item.qty += +d.qty;
      if (item.qty <= 0) state.cart = state.cart.filter(i => i !== item);
      return saveCart();
    }
    if (d.remove) { state.cart = state.cart.filter(i => i.key !== d.remove); return saveCart(); }
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") $$(".sheet:not([hidden]), .drawer:not([hidden])").forEach(close);
    if (e.key === "Enter" && e.target.matches(".product-media[data-peek]")) openDetail(+e.target.dataset.peek);
  });

  let searchTimer;
  $("#search").addEventListener("input", e => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      state.query = e.target.value;
      if (!state.query.trim()) return;
      state.filter = {}; state.title = "Todos os produtos";
      if (!$("#view-catalog").classList.contains("active")) navigate("catalog"); else renderCatalog();
    }, 200);
  });
  $("#sort").addEventListener("change", e => { state.sort = e.target.value; renderCatalog(); });
  $("#checkout-btn").addEventListener("click", () => {
    fillForm($("#checkout-form"), state.profile);
    const pay = $("#checkout-form").elements.payment.value;
    $("#checkout-total").textContent = brl(pay === "Pix" ? pix(totals().total) : totals().total);
    open($("#checkout"));
  });
  $("#checkout-form").addEventListener("change", e => {
    if (e.target.name === "payment") $("#checkout-total").textContent = brl(e.target.value === "Pix" ? pix(totals().total) : totals().total);
  });
  $("#checkout-form").addEventListener("submit", checkout);
  $("#profile-form").addEventListener("submit", e => {
    e.preventDefault();
    state.profile = Object.fromEntries(new FormData(e.target)); store.set("profile", state.profile);
    toast("Dados salvos");
  });
  $("#news-form").addEventListener("submit", e => {
    e.preventDefault();
    const list = store.get("newsletter", []); list.push($("#news-email").value); store.set("newsletter", list);
    e.target.reset(); toast("Cadastro feito! Seu cupom de 10% chega no e-mail");
  });
  $("#track-form").addEventListener("submit", e => {
    e.preventDefault();
    const code = $("#track-code").value.trim().toUpperCase();
    const box = $("#track-result"); box.hidden = false;
    if (/^[A-Z]{2}\d{9}[A-Z]{2}$/.test(code)) {
      box.innerHTML = `<p>Código dos Correios identificado.</p><a class="btn btn-dark" href="https://rastreamento.correios.com.br/app/index.php?objetos=${code}" target="_blank" rel="noopener">Rastrear nos Correios</a>`;
      return;
    }
    const order = state.orders.find(o => o.id === code.replace(/\D/g, ""));
    if (order) {
      const days = (Date.now() - order.date) / 864e5;
      const steps = [["Pedido recebido", 0], ["Pagamento confirmado", 0.1], ["Em personalização", 1], ["Enviado", 4], ["Entregue", 8]];
      box.innerHTML = `<p><strong>Pedido #${order.id}</strong> · ${brl(order.total)}</p>` +
        steps.map(([s, d]) => `<div class="track-step ${days >= d ? "done" : ""}"><div>${s}<small>${days >= d ? "Concluído" : "Aguardando"}</small></div></div>`).join("");
    } else {
      box.innerHTML = `<p class="muted">Não encontramos esse pedido neste aparelho. Fale com a gente para consultar.</p><a class="btn btn-primary" href="${waLink(`Olá! Quero rastrear meu pedido ${code}.`)}" target="_blank" rel="noopener">Consultar pelo WhatsApp</a>`;
    }
  });
  $("#contact-form").addEventListener("submit", e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    waConfirm("Mensagem pronta", "Toque no botão para enviar sua mensagem pelo WhatsApp.", waLink(`Olá, MARN Store! Sou ${d.name}.\nAssunto: ${d.subject}\n\n${d.msg}`), "Enviar no WhatsApp");
    e.target.reset();
  });

  // Cookies
  if (!store.get("cookie-ok", false)) $("#cookie").hidden = false;
  $("#cookie-ok").addEventListener("click", () => { store.set("cookie-ok", true); $("#cookie").hidden = true; });

  // Faixa de avisos
  let annIdx = 0;
  const showAnn = () => { const el = $("#announce-text"); el.textContent = CFG.announcements[annIdx++ % CFG.announcements.length]; el.style.animation = "none"; el.offsetHeight; el.style.animation = ""; };
  showAnn(); setInterval(showAnn, 4000);

  // Dados da loja
  const handle = "@" + CFG.instagram;
  $$('[data-store="whats"]').forEach(a => a.href = waLink("Olá, MARN Store! Gostaria de mais informações."));
  $$('[data-store="map"]').forEach(a => a.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CFG.address)}`);
  $$('[data-store="insta"]').forEach(a => a.href = `https://instagram.com/${CFG.instagram}`);
  $$('[data-store="insta-handle"]').forEach(el => el.textContent = handle);
  $$('[data-store="address"]').forEach(el => el.textContent = `📍 ${CFG.address} · 🕘 ${CFG.hours}`);
  $$('[data-store="address-short"]').forEach(el => el.textContent = CFG.address);
  $$('[data-store="hours"]').forEach(el => el.textContent = CFG.hours);
  $("#year").textContent = new Date().getFullYear();

  // ---------- PWA: instalação + offline ----------
  let deferredPrompt;
  window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); deferredPrompt = e; $("#install-btn").hidden = false; });
  $("#install-btn").addEventListener("click", async () => {
    if (!deferredPrompt) return toast("No Safari: Compartilhar → “Adicionar à Tela de Início”");
    deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt = null; $("#install-btn").hidden = true;
  });
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (isIOS && !(navigator.standalone || matchMedia("(display-mode: standalone)").matches)) $("#install-btn").hidden = false;
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }

  // ---------- Início ----------
  renderMenus(); renderCarousel(); renderHome(); renderBadges(); renderCart();
})();
