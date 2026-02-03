/* DIGIY HUB F16 — final (data-driven) */

const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

const STORAGE_PHONE = "DIGIY_HUB_PHONE";
const STORAGE_FILTER = "DIGIY_HUB_FILTER";
const STORAGE_SEARCH = "DIGIY_HUB_SEARCH";

const state = {
  phone: "",
  filter: "all", // all | public | pro
  q: ""
};

/* ====== LINKS (EDIT ICI) ====== */
const LINKS = {
  // Public / vitrine
  digiylyfe:       "https://digiylyfe.com",
  tarifs:          "https://beauville.github.io/DIGIY/",
  bonneAffaire:    "https://beauville.github.io/digiy-bonne-affaire/",
  ndimbalMap:      "https://beauville.github.io/digiy-mdimbal-map/",
  driverClient:    "https://beauville.github.io/digiy-driver-client/",
  loc:             "https://beauville.github.io/digiy-loc/",
  resto:           "https://beauville.github.io/digiy-resto/",
  build:           "https://beauville.github.io/digiy-build/",
  explore:         "https://beauville.github.io/digiy-explore/",
  market:          "https://beauville.github.io/digiy-market/",
  jobs:            "https://beauville.github.io/digiy-jobs/",
  pay:             "https://beauville.github.io/digiy-pay/",
  resa:            "https://beauville.github.io/digiy-resa/",
  resaTable:       "https://beauville.github.io/digiy-resa-table/",
  notable:         "https://beauville.github.io/digiy-notable/",

  // PRO
  driverPro:       "https://beauville.github.io/digiy-driver-pro/",
  caissePro:       "https://beauville.github.io/digiy-caisse-pro/",
  locPro:          "https://beauville.github.io/digiy-loc-pro/",
  buildPro:        "https://beauville.github.io/digiy-build-pro/",
  marketPro:       "https://beauville.github.io/digiy-market-pro/",
  jobsPro:         "https://beauville.github.io/digiy-jobs-pro/",
  espacePro:       "https://beauville.github.io/inscription-digiy/",

  // FRET (PIN direct)
  fretClientProPin:     "https://beauville.github.io/fret-client-pro/pin.html",
  fretChauffeurProPin:  "https://beauville.github.io/fret-chauffeur-pro/pin.html"
};

/* ====== MODULES (DATA) ====== */
const MODULES = [
  // PUBLIC
  {
    key: "bonneAffaire",
    name: "DIGIY BONNE AFFAIRE",
    icon: "💥",
    tag: "BONS PLANS • PROMOS",
    desc: "Les meilleures opportunités locales : promos, deals, bonnes affaires terrain.",
    kind: "public",
    status: "live",
    phoneParam: false
  },
  {
    key: "ndimbalMap",
    name: "DIGIY NDIMBAL MAP",
    icon: "🗺️",
    tag: "CARTE COMMUNAUTÉ",
    desc: "Annuaire géolocalisé : pros, quartiers, filtres. Sénégal terrain.",
    kind: "public",
    status: "live",
    phoneParam: false
  },
  {
    key: "driverClient",
    name: "DIGIY DRIVER CLIENT",
    icon: "🚕",
    tag: "COMMANDER UNE COURSE",
    desc: "Commande ta course. Paiement direct. 0% commission.",
    kind: "public",
    status: "live",
    phoneParam: true
  },
  {
    key: "loc",
    name: "DIGIY LOC",
    icon: "🏠",
    tag: "LOCATION SANS OTA",
    desc: "Alternative Booking/Airbnb, direct propriétaire, sans commission.",
    kind: "public",
    status: "live",
    phoneParam: true
  },
  {
    key: "resto",
    name: "DIGIY RESTO",
    icon: "🍽️",
    tag: "VITRINE RESTAURANT",
    desc: "Menus, photos, horaires, localisation. Réservation directe.",
    kind: "public",
    status: "live",
    phoneParam: true
  },
  {
    key: "build",
    name: "DIGIY BUILD",
    icon: "🏗️",
    tag: "ARTISANS & BTP",
    desc: "Devis, galerie, contact. Humain. Direct. Sans commission.",
    kind: "public",
    status: "live",
    phoneParam: true
  },
  {
    key: "explore",
    name: "DIGIY EXPLORE",
    icon: "🧭",
    tag: "TOURISME & DÉCOUVERTE",
    desc: "Découvrir l’Afrique : guides, visibilité, expériences authentiques.",
    kind: "public",
    status: "live",
    phoneParam: false
  },
  {
    key: "market",
    name: "DIGIY MARKET",
    icon: "🛍️",
    tag: "MARKETPLACE LOCALE",
    desc: "Acheter/vendre local. Annonces propres. Sans commission.",
    kind: "public",
    status: "beta",
    phoneParam: true
  },
  {
    key: "jobs",
    name: "DIGIY JOBS",
    icon: "💼",
    tag: "EMPLOI & TALENTS",
    desc: "Offres, candidatures, profils. Pont talents–employeurs.",
    kind: "public",
    status: "beta",
    phoneParam: true
  },
  {
    key: "pay",
    name: "DIGIY PAY",
    icon: "💳",
    tag: "WALLET UNIFIÉ",
    desc: "Wave / OM / CB. Historique, suivi, activation modules.",
    kind: "public",
    status: "soon",
    phoneParam: true
  },
  {
    key: "resa",
    name: "DIGIY RESA",
    icon: "📅",
    tag: "RÉSERVATIONS",
    desc: "Planning, confirmations, gestion des réservations. Direct, sans commission.",
    kind: "public",
    status: "beta",
    phoneParam: true
  },
  {
    key: "resaTable",
    name: "DIGIY RESA TABLE",
    icon: "🪑",
    tag: "RÉSA RESTAURANT",
    desc: "Réservation tables, plan de salle, disponibilités.",
    kind: "public",
    status: "beta",
    phoneParam: true
  },
  {
    key: "notable",
    name: "DIGIY NOTABLE",
    icon: "📓",
    tag: "NOTES & DOCS",
    desc: "Notes terrain, procédures, fiches. Organise ton savoir pro.",
    kind: "public",
    status: "soon",
    phoneParam: false
  },

  // PRO
  {
    key: "driverPro",
    name: "DIGIY DRIVER PRO",
    icon: "🚗",
    tag: "CHAUFFEUR PROFESSIONNEL",
    desc: "Accepter courses, cockpit, encaissements directs.",
    kind: "pro",
    status: "live",
    phoneParam: true
  },
  {
    key: "caissePro",
    name: "DIGIY CAISSE PRO",
    icon: "🧾",
    tag: "POS + SYNC BATCH",
    desc: "Caisse pro + sync ultra-légère. Encaissement terrain.",
    kind: "pro",
    status: "beta",
    phoneParam: true
  },
  {
    key: "locPro",
    name: "DIGIY LOC PRO",
    icon: "🏡",
    tag: "PROPRIÉTAIRES • PLANNING",
    desc: "Planning, réservations, cockpit propriétaire.",
    kind: "pro",
    status: "live",
    phoneParam: true
  },
  {
    key: "buildPro",
    name: "DIGIY BUILD PRO",
    icon: "🧱",
    tag: "ARTISANS • DEVIS",
    desc: "Devis, chantiers, pipeline, visibilité.",
    kind: "pro",
    status: "beta",
    phoneParam: true
  },
  {
    key: "marketPro",
    name: "DIGIY MARKET PRO",
    icon: "📦",
    tag: "BOUTIQUE • CATALOGUE",
    desc: "Gérer produits, commandes, stock. Terrain ready.",
    kind: "pro",
    status: "soon",
    phoneParam: true
  },
  {
    key: "jobsPro",
    name: "DIGIY JOBS PRO",
    icon: "🧑🏾‍💼",
    tag: "EMPLOYEURS • DOSSIERS",
    desc: "Gestion des offres, dossiers, suivi accompagnement.",
    kind: "pro",
    status: "soon",
    phoneParam: true
  },
  {
    key: "fretClientProPin",
    name: "FRET CLIENT PRO",
    icon: "📦",
    tag: "ACCÈS PIN (CLIENT)",
    desc: "Portail FRET client — accès direct via PIN.",
    kind: "pro",
    status: "live",
    phoneParam: false,
    directUrl: LINKS.fretClientProPin
  },
  {
    key: "fretChauffeurProPin",
    name: "FRET CHAUFFEUR PRO",
    icon: "🚚",
    tag: "ACCÈS PIN (CHAUFFEUR)",
    desc: "Portail FRET chauffeur — accès direct via PIN.",
    kind: "pro",
    status: "live",
    phoneParam: false,
    directUrl: LINKS.fretChauffeurProPin
  }
];

/* ====== helpers ====== */
function normPhone(p){
  if(!p) return "";
  let s = String(p).trim();
  // laisse + et chiffres
  s = s.replace(/[^\d+]/g,"");
  if(s && !s.startsWith("+")) {
    // si le gars tape 221..., on met + devant
    if(s.startsWith("221")) s = "+" + s;
  }
  return s;
}

function withPhone(url, phone, param="phone"){
  if(!url) return "";
  if(!phone) return url;
  try{
    const u = new URL(url);
    u.searchParams.set(param, phone);
    return u.toString();
  }catch(_){
    // fallback si url relative
    const sep = url.includes("?") ? "&" : "?";
    return url + sep + encodeURIComponent(param) + "=" + encodeURIComponent(phone);
  }
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, (m)=>({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
}

/* ====== modal ====== */
const modal = {
  root: null,
  titleEl: null,
  textEl: null,
  okBtn: null,
  cancelBtn: null,
  _onOk: null,
  _onCancel: null,

  init(){
    this.root = $("#modal");
    this.titleEl = $("#modalTitle");
    this.textEl  = $("#modalText");
    this.okBtn   = $("#modalOk");
    this.cancelBtn = $("#modalCancel");
    if(!this.root) return;

    this.okBtn.addEventListener("click", ()=>{
      this.hide();
      if(typeof this._onOk === "function") this._onOk();
    });
    this.cancelBtn.addEventListener("click", ()=>{
      this.hide();
      if(typeof this._onCancel === "function") this._onCancel();
    });

    this.root.addEventListener("click", (e)=>{
      if(e.target === this.root) this.hide();
    });

    window.addEventListener("keydown", (e)=>{
      if(e.key === "Escape" && !this.root.classList.contains("hidden")) this.hide();
    });
  },

  show({title, text, okText="OK", cancelText="Annuler", onOk=null, onCancel=null, hideCancel=false}){
    if(!this.root) return;
    this.titleEl.textContent = title || "Info";
    this.textEl.innerHTML = text || "";
    this.okBtn.textContent = okText;
    this.cancelBtn.textContent = cancelText;
    this._onOk = onOk;
    this._onCancel = onCancel;
    this.cancelBtn.style.display = hideCancel ? "none" : "";
    this.root.classList.remove("hidden");
    this.root.setAttribute("aria-hidden","false");
  },

  info({title, text, okText="OK"}){
    this.show({title, text, okText, hideCancel:true});
  },

  hide(){
    if(!this.root) return;
    this.root.classList.add("hidden");
    this.root.setAttribute("aria-hidden","true");
    this._onOk = null;
    this._onCancel = null;
  }
};

/* ====== hub overlay ====== */
const hub = {
  overlay: null,
  frame: null,
  backBtn: null,
  closeBtn: null,

  init(){
    this.overlay = $("#hubOverlay");
    this.frame = $("#hubFrame");
    this.backBtn = $("#hubBackBtn");
    this.closeBtn = $("#hubCloseBtn");
    if(!this.overlay || !this.frame) return;

    const close = ()=> this.close();
    this.closeBtn?.addEventListener("click", close);
    this.backBtn?.addEventListener("click", close);

    this.overlay.addEventListener("click", (e)=>{
      if(e.target === this.overlay) close();
    });

    window.addEventListener("keydown", (e)=>{
      if(e.key === "Escape" && !this.overlay.classList.contains("hidden")) close();
    });
  },

  open(url){
    if(!url) return;
    this.frame.src = url;
    this.overlay.classList.remove("hidden");
    this.overlay.setAttribute("aria-hidden","false");
    document.body.style.overflow = "hidden";
  },

  close(){
    if(!this.overlay) return;
    this.overlay.classList.add("hidden");
    this.overlay.setAttribute("aria-hidden","true");
    this.frame.src = "about:blank";
    document.body.style.overflow = "";
  }
};

/* ====== UI refs ====== */
let modulesGridEl, phoneTextEl, searchInputEl;
let statTotalEl, statPublicEl, statProEl;

/* ====== filters ====== */
function setFilter(f){
  state.filter = f;
  localStorage.setItem(STORAGE_FILTER, f);
  $$(".tab").forEach(btn => btn.classList.toggle("active", btn.dataset.filter === f));
  render();
}

function setSearch(q){
  state.q = q;
  localStorage.setItem(STORAGE_SEARCH, q);
  render();
}

function getFilteredModules(){
  const q = (state.q || "").trim().toLowerCase();

  return MODULES.filter(m=>{
    if(state.filter === "public" && m.kind !== "public") return false;
    if(state.filter === "pro" && m.kind !== "pro") return false;

    if(!q) return true;

    const hay = [
      m.key, m.name, m.tag, m.desc, m.kind, m.status
    ].join(" ").toLowerCase();

    return hay.includes(q);
  });
}

function updateStats(filtered){
  const total = filtered.length;
  const pub = filtered.filter(m=>m.kind==="public").length;
  const pro = filtered.filter(m=>m.kind==="pro").length;

  statTotalEl.textContent = String(total);
  statPublicEl.textContent = String(pub);
  statProEl.textContent = String(pro);
}

/* ====== card html ====== */
function badgeHTML(kind, status){
  const kindBadge = `<span class="badge kind-${kind}">${kind === "pro" ? "PRO" : "PUBLIC"}</span>`;
  const st = status || "soon";
  const stBadge = `<span class="badge ${st}">${st.toUpperCase()}</span>`;
  return kindBadge + stBadge;
}

function getModuleUrl(m){
  // direct url priority
  let base = m.directUrl || LINKS[m.key] || "";
  if(!base) return "";

  // add phone param if supported
  if(m.phoneParam && state.phone){
    base = withPhone(base, state.phone, "phone");
  }
  return base;
}

function cardHTML(m){
  const url = getModuleUrl(m);
  const disabled = !url;

  return `
    <div class="card" tabindex="0" role="button" aria-label="${escapeHtml(m.name)}" data-key="${escapeHtml(m.key)}">
      <div class="cardTop">
        <div class="icon">${escapeHtml(m.icon || "∞")}</div>
        <div style="flex:1;min-width:0">
          <div class="cardTitle">${escapeHtml(m.name)}</div>
          <div class="cardDesc">${escapeHtml(m.desc || "")}</div>

          <div class="badges">
            ${badgeHTML(m.kind, m.status)}
            ${m.tag ? `<span class="badge">${escapeHtml(m.tag)}</span>` : ""}
          </div>

          ${url ? `<div class="smallLink">${escapeHtml(url)}</div>` : ""}
        </div>
      </div>

      <div class="cardActions">
        <button class="btn ${disabled ? "disabled" : "primary"}" data-action="open" ${disabled ? "disabled" : ""} type="button">
          Ouvrir →
        </button>
        <button class="btn ${disabled ? "disabled" : ""}" data-action="copy" ${disabled ? "disabled" : ""} type="button">
          Copier lien
        </button>
      </div>
    </div>
  `;
}

/* ====== render ====== */
function renderGrid(){
  const grid = modulesGridEl;
  if(!grid) return;

  const filtered = getFilteredModules();
  grid.innerHTML = filtered.length
    ? filtered.map(cardHTML).join("")
    : `<div class="empty">Aucun module ne correspond à ta recherche.</div>`;

  // ✅ handlers (NO BUG "grid is not defined")
  $$(".card", grid).forEach(card=>{
    card.addEventListener("click", (e)=>{
      const btn = e.target?.closest?.("button");
      const key = card.getAttribute("data-key");
      const m = MODULES.find(x=>x.key===key);
      if(!m) return;

      if(btn && btn.dataset.action === "copy"){
        e.preventDefault(); e.stopPropagation();
        const link = getModuleUrl(m);
        if(!link) return;
        navigator.clipboard?.writeText(link).catch(()=>{});
        modal.info({ title:"Copié ✅", text:`Lien copié.<br><small>${escapeHtml(link)}</small>` });
        return;
      }

      openModule(key);
    });

    card.addEventListener("keydown", (e)=>{
      if(e.key === "Enter" || e.key === " "){
        e.preventDefault();
        openModule(card.getAttribute("data-key"));
      }
    });
  });

  updateStats(filtered);
}

function renderPhone(){
  const p = state.phone ? state.phone : "non mémorisé";
  phoneTextEl.textContent = p;
}

function render(){
  renderPhone();
  renderGrid();
}

/* ====== actions ====== */
function openModule(key){
  const m = MODULES.find(x=>x.key===key);
  if(!m) return;

  const url = getModuleUrl(m);
  if(!url){
    modal.info({
      title:"Module non disponible",
      text:"Lien non défini pour ce module. Mets l’URL dans LINKS."
    });
    return;
  }

  hub.open(url);
}

function askPhone(){
  modal.show({
    title:"Numéro (optionnel)",
    text:`Entre ton numéro (ex: <b>+221771234567</b>)<br><small>Le HUB peut l’envoyer à certains modules.</small>
          <div style="margin-top:10px">
            <input id="phonePrompt" style="width:100%;padding:12px;border-radius:14px;border:1px solid rgba(148,163,184,.25);background:rgba(2,6,23,.18);color:#fff;outline:none" placeholder="+221..." value="${escapeHtml(state.phone)}"/>
          </div>`,
    okText:"Enregistrer",
    cancelText:"Annuler",
    onOk: ()=>{
      const inp = $("#phonePrompt");
      const val = normPhone(inp?.value || "");
      state.phone = val;
      localStorage.setItem(STORAGE_PHONE, val);
      render();
    }
  });

  // focus input
  setTimeout(()=> $("#phonePrompt")?.focus(), 50);
}

/* ====== floating vitrine buttons ====== */
function initFloating(){
  const nd = $("#digiy-ndimbal");
  const ndClose = $("#digiyCloseBtn");
  const qrModal = $("#qrModal");
  const qrClose = $("#qrClose");

  const showNdimbal = ()=>{
    nd.classList.remove("hidden");
    nd.setAttribute("aria-hidden","false");
  };
  const hideNdimbal = ()=>{
    nd.classList.add("hidden");
    nd.setAttribute("aria-hidden","true");
  };
  const showQr = ()=>{
    qrModal.classList.remove("hidden");
    qrModal.setAttribute("aria-hidden","false");
  };
  const hideQr = ()=>{
    qrModal.classList.add("hidden");
    qrModal.setAttribute("aria-hidden","true");
  };

  $("#digiy-help-btn")?.addEventListener("click", showNdimbal);
  ndClose?.addEventListener("click", hideNdimbal);
  nd?.addEventListener("click", (e)=>{ if(e.target === nd) hideNdimbal(); });

  $("#tarif-bubble-btn")?.addEventListener("click", ()=>{
    // ouvre tarifs en overlay (vitrine)
    hub.open(LINKS.tarifs);
  });

  $("#espace-pro-btn")?.addEventListener("click", ()=>{
    // espace pro / inscription
    hub.open(LINKS.espacePro);
  });

  qrClose?.addEventListener("click", hideQr);
  qrModal?.addEventListener("click", (e)=>{ if(e.target === qrModal) hideQr(); });

  // actions NDIMBAL
  $$(".ndimbalActions .btn").forEach(b=>{
    b.addEventListener("click", ()=>{
      const act = b.dataset.action;
      hideNdimbal();

      if(act === "qr"){ showQr(); return; }
      if(act === "job"){ hub.open(LINKS.jobs); return; }
      if(act === "sell"){ hub.open(LINKS.ndimbalMap); return; }
    });
  });
}

/* ====== init ====== */
function boot(){
  modulesGridEl = $("#modulesGrid");
  phoneTextEl = $("#phoneText");
  searchInputEl = $("#searchInput");
  statTotalEl = $("#statTotal");
  statPublicEl = $("#statPublic");
  statProEl = $("#statPro");

  modal.init();
  hub.init();
  initFloating();

  // load state
  state.phone = normPhone(localStorage.getItem(STORAGE_PHONE) || "");
  state.filter = localStorage.getItem(STORAGE_FILTER) || "all";
  state.q = localStorage.getItem(STORAGE_SEARCH) || "";

  // phone UI
  $("#btnEditPhone")?.addEventListener("click", askPhone);
  $("#btnClearPhone")?.addEventListener("click", ()=>{
    state.phone = "";
    localStorage.removeItem(STORAGE_PHONE);
    render();
  });

  // hero CTAs
  $("#btnEnterHubPro")?.addEventListener("click", ()=> hub.open(LINKS.espacePro));
  $("#btnAlreadyAccess")?.addEventListener("click", ()=> modal.info({
    title:"Accès PRO",
    text:"Si tu as déjà ton accès : ouvre le module PRO voulu, puis utilise ton PIN/slug (selon le module)."
  }));
  $("#btnActivate")?.addEventListener("click", ()=> hub.open(LINKS.pay || LINKS.espacePro));

  // tabs
  $$(".tab").forEach(btn=>{
    btn.addEventListener("click", ()=> setFilter(btn.dataset.filter));
  });

  // search
  if(searchInputEl){
    searchInputEl.value = state.q || "";
    searchInputEl.addEventListener("input", ()=> setSearch(searchInputEl.value));
  }
  $("#btnReset")?.addEventListener("click", ()=>{
    state.q = "";
    localStorage.removeItem(STORAGE_SEARCH);
    if(searchInputEl) searchInputEl.value = "";
    setFilter("all");
  });

  // brand click scroll top
  $("#homeBrand")?.addEventListener("click", (e)=>{
    e.preventDefault();
    window.scrollTo({top:0, behavior:"smooth"});
  });

  // apply filter active
  $$(".tab").forEach(btn => btn.classList.toggle("active", btn.dataset.filter === state.filter));

  // pioneers left (petit random stable)
  const base = 87;
  const jitter = Math.floor((Date.now()/600000) % 11); // change toutes ~10 min
  const val = Math.max(12, base - jitter);
  const pion = $("#pioneersLeft");
  if(pion) pion.textContent = String(val);

  render();
}

document.addEventListener("DOMContentLoaded", boot);
