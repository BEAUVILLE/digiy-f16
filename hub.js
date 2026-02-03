/* DIGIY HUB — F16 NAV (FIX) : filtre + recherche + stats + rendu modules
   - robuste (crée les zones si manquantes)
   - supporte plusieurs templates HTML
*/

(() => {
  const $ = (q, root=document) => root.querySelector(q);
  const $$ = (q, root=document) => Array.from(root.querySelectorAll(q));

  // =========================
  // 1) CONFIG URLS (branche tes liens)
  // =========================
  const LINKS = {
    bonneAffaire:     "https://beauville.github.io/digiy-market/",
    driverPro:        "https://beauville.github.io/digiy-driver-pro/",
    driverClient:     "https://beauville.github.io/digiy-driver-client/",
    caissePro:        "https://beauville.github.io/digiy-caisse-pro/",
    loc:              "https://beauville.github.io/digiy-loc-pro/",
    resto:            "https://beauville.github.io/digiy-resto/",
    pay:              "https://beauville.github.io/digiy-pay/",
    build:            "https://beauville.github.io/digiy-build-pro/",
    market:           "https://beauville.github.io/digiy-market/",
    jobs:             "https://beauville.github.io/digiy-jobs/",
    ndimbalMap:       "https://beauville.github.io/digiy-mdimbal-map/",
    resa:             "https://beauville.github.io/digiy-resa/",
    resaTable:        "https://beauville.github.io/digiy-resa-table/",
    notable:          "https://beauville.github.io/digiy-notable/",
    explore:          "https://beauville.github.io/digiy-explore/",
    inscriptionPro:   "https://beauville.github.io/inscription-digiy/",
    espacePro:        "https://beauville.github.io/digiy-espace-pro/",
    fretClientPro:    "https://beauville.github.io/fret-client-pro/pin.html",
    fretChauffeurPro: "https://beauville.github.io/fret-chauffeur-pro/pin.html",
  };

  // =========================
  // 2) DATA MODULES (si ça = vide -> stats 0)
  // type: "Public" | "PRO"
  // =========================
  const MODULES = [
    { key:"ndimbalMap", type:"Public", icon:"🗺️", name:"DIGIY NDIMBAL MAP", tag:"CARTE COMMUNAUTÉ", desc:"Annuaire géolocalisé du Sénégal : pros, quartiers, filtres.", badge:"GRATUIT" },
    { key:"bonneAffaire", type:"Public", icon:"💥", name:"DIGIY BONNE AFFAIRE", tag:"BONS PLANS • PROMOS", desc:"Promos, deals, bonnes affaires terrain.", badge:"OFFICIEL" },

    { key:"driverClient", type:"Public", icon:"🚕", name:"DIGIY DRIVER CLIENT", tag:"COMMANDER", desc:"Commande ta course VTC. Paiement direct. 0% commission.", badge:"LIVE" },

    { key:"driverPro", type:"PRO", icon:"🚗", name:"DIGIY DRIVER PRO", tag:"CHAUFFEUR PRO", desc:"Accepter courses, encaissements directs.", badge:"LIVE" },
    { key:"loc", type:"PRO", icon:"🏠", name:"DIGIY LOC", tag:"LOCATION SANS OTA", desc:"Réservations direct propriétaire. 0% commission.", badge:"LIVE" },
    { key:"resto", type:"PRO", icon:"🍽️", name:"DIGIY RESTO", tag:"VITRINE RESTAURANT", desc:"Menus, photos, résa directe.", badge:"LIVE" },
    { key:"build", type:"PRO", icon:"🏗️", name:"DIGIY BUILD", tag:"ARTISANS & BTP", desc:"Devis, galerie, contact direct.", badge:"LIVE" },

    { key:"caissePro", type:"PRO", icon:"🧾", name:"DIGIY CAISSE PRO", tag:"POS TERRAIN", desc:"Caisse pro + sync ultra-légère.", badge:"NOUVEAU" },
    { key:"pay", type:"PRO", icon:"💳", name:"DIGIY PAY", tag:"WALLET", desc:"Wave / OM / CB. Activation modules.", badge:"PRIORITÉ" },
    { key:"market", type:"PRO", icon:"🛍️", name:"DIGIY MARKET", tag:"MARKETPLACE", desc:"Acheter/vendre local. Sans commission.", badge:"PRIORITÉ" },
    { key:"jobs", type:"PRO", icon:"💼", name:"DIGIY JOBS", tag:"EMPLOI", desc:"Talents ↔ employeurs. Dossiers accompagnés.", badge:"PRIORITÉ" },
    { key:"resa", type:"PRO", icon:"📅", name:"DIGIY RESA", tag:"RÉSERVATIONS", desc:"Planning, confirmations, gestion résa.", badge:"LIVE" },
    { key:"resaTable", type:"PRO", icon:"🪑", name:"DIGIY RESA TABLE", tag:"RÉSA RESTO", desc:"Dispos temps réel, plan de salle.", badge:"LIVE" },
    { key:"notable", type:"PRO", icon:"📓", name:"DIGIY NOTABLE", tag:"NOTES", desc:"Procédures, fiches terrain, docs.", badge:"PRIORITÉ" },
    { key:"explore", type:"Public", icon:"🧭", name:"DIGIY EXPLORE", tag:"TOURISME", desc:"Découverte, spots, expériences authentiques.", badge:"LIVE" },

    { key:"inscriptionPro", type:"PRO", icon:"📝", name:"INSCRIPTION PRO", tag:"NOUVEAU COMPTE", desc:"Onboard pro + choix module + tarif.", badge:"NOUVEAU" },
    { key:"espacePro", type:"PRO", icon:"🧰", name:"ESPACE PRO", tag:"PORTAIL PRO", desc:"Accès modules (slug + PIN).", badge:"LIVE" },

    { key:"fretClientPro", type:"PRO", icon:"📦", name:"FRET CLIENT PRO", tag:"DEMANDE TRANSPORT", desc:"Créer une demande fret. Accès PIN.", badge:"NOUVEAU" },
    { key:"fretChauffeurPro", type:"PRO", icon:"🚚", name:"FRET CHAUFFEUR PRO", tag:"MISSIONS", desc:"Accepter missions fret. Accès PIN.", badge:"PRIORITÉ" },
  ];

  // =========================
  // 3) DOM auto (trouve/ crée navigation + liste)
  // =========================
  function ensureNavAndList() {
    // cherche une zone "section" existante
    const host =
      $(".section") ||
      $(".app") ||
      document.body;

    // NAV (si pas déjà dans ton HTML)
    let nav = $("#f16nav");
    if (!nav) {
      nav = document.createElement("div");
      nav.id = "f16nav";
      nav.style.cssText = "margin:14px 0 12px;padding:14px;border:1px solid rgba(148,163,184,.25);border-radius:16px;background:rgba(2,6,23,.35)";
      nav.innerHTML = `
        <div style="font-weight:900;font-size:16px;margin-bottom:10px">🧭 Navigation F16</div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:10px">
          <select id="f16filter" style="padding:10px 12px;border-radius:12px;border:1px solid rgba(148,163,184,.35);background:rgba(255,255,255,.06);color:#fff;font-weight:800">
            <option value="Tous">Tous</option>
            <option value="Public">Public</option>
            <option value="PRO">PRO</option>
          </select>
          <input id="f16search" placeholder="Chercher un module… (ex: map, loc, driver, pay)"
            style="flex:1;min-width:240px;padding:10px 12px;border-radius:12px;border:1px solid rgba(148,163,184,.35);background:rgba(255,255,255,.06);color:#fff;font-weight:800"
          />
        </div>
        <div style="display:flex;gap:12px;flex-wrap:wrap;font-weight:900">
          <div><span id="f16total">0</span><span style="opacity:.75;margin-left:6px">Total</span></div>
          <div><span id="f16public">0</span><span style="opacity:.75;margin-left:6px">Public</span></div>
          <div><span id="f16pro">0</span><span style="opacity:.75;margin-left:6px">PRO</span></div>
        </div>
        <div style="margin-top:10px;opacity:.85;font-weight:650">
          Astuce terrain : si ton numéro est mémorisé, le HUB peut l’envoyer en paramètre aux modules (quand le module le supporte). Sinon, navigation simple.
        </div>
      `;
      // insère au début de la section si possible
      host.insertBefore(nav, host.firstChild);
    }

    // LIST / GRID : on supporte plusieurs noms
    let grid =
      $(".modules-grid") ||
      $("#modulesGrid") ||
      $("#modulesList") ||
      $('[data-modules-grid]');

    if (!grid) {
      grid = document.createElement("div");
      grid.className = "modules-grid";
      grid.style.cssText = "display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;margin-top:14px";
      host.appendChild(grid);
    }

    return { nav, grid };
  }

  // =========================
  // 4) RENDER cards + filtre/recherche + stats
  // =========================
  function cardHTML(m) {
    const badge = m.badge ? `<div style="font-weight:900;font-size:12px;padding:6px 10px;border-radius:999px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.08)">${m.badge}</div>` : "";
    return `
      <div class="module" data-open="${m.key}" data-type="${m.type}"
        style="cursor:pointer;padding:14px;border-radius:18px;border:1px solid rgba(148,163,184,.25);background:rgba(2,6,23,.35)"
      >
        <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;margin-bottom:10px">
          <div style="display:flex;gap:10px;align-items:center">
            <div style="font-size:22px">${m.icon}</div>
            <div>
              <div style="font-weight:950">${m.name}</div>
              <div style="opacity:.8;font-weight:750;font-size:12px;margin-top:2px">${m.tag}</div>
            </div>
          </div>
          ${badge}
        </div>
        <div style="opacity:.9;font-weight:650;line-height:1.3">${m.desc}</div>
      </div>
    `.trim();
  }

  function updateStats() {
    $("#f16total") && ($("#f16total").textContent = String(MODULES.length));
    const pub = MODULES.filter(x => x.type === "Public").length;
    const pro = MODULES.filter(x => x.type === "PRO").length;
    $("#f16public") && ($("#f16public").textContent = String(pub));
    $("#f16pro") && ($("#f16pro").textContent = String(pro));
  }

  function matches(m, filter, q) {
    if (filter !== "Tous" && m.type !== filter) return false;
    if (!q) return true;
    const s = q.toLowerCase();
    const hay = `${m.name} ${m.tag} ${m.desc} ${m.key}`.toLowerCase();
    return hay.includes(s);
  }

  function render(grid, filter, q) {
    const list = MODULES.filter(m => matches(m, filter, q));
    grid.innerHTML = list.map(cardHTML).join("\n") || `
      <div style="padding:16px;border-radius:16px;border:1px dashed rgba(148,163,184,.35);opacity:.9;font-weight:800">
        Aucun module ne match. Essaie “loc”, “map”, “pay”, “fret”…
      </div>
    `;

    // click open
    $$(".module", grid).forEach(card => {
      card.addEventListener("click", () => {
        const key = card.getAttribute("data-open");
        const url = LINKS[key];
        if (!url) return alert("URL manquante pour : " + key);
        window.open(url, "_blank", "noopener");
      });
    });
  }

  // =========================
  // 5) BOOT
  // =========================
  function boot() {
    const { grid } = ensureNavAndList();

    // Si MODULES vide -> on le dit clairement
    if (!Array.isArray(MODULES) || MODULES.length === 0) {
      console.warn("❌ MODULES est vide : stats = 0");
      grid.innerHTML = `<div style="padding:16px;border-radius:16px;border:1px dashed rgba(148,163,184,.35);font-weight:900">
        ❌ MODULES est vide → rien à afficher. Vérifie que tu n’as pas écrasé le hub.js.
      </div>`;
      return;
    }

    updateStats();

    const filterEl = $("#f16filter");
    const searchEl = $("#f16search");

    const apply = () => {
      const filter = filterEl ? filterEl.value : "Tous";
      const q = searchEl ? searchEl.value.trim() : "";
      render(grid, filter, q);
    };

    filterEl?.addEventListener("change", apply);
    searchEl?.addEventListener("input", apply);

    apply();
  }

  // Defer-safe
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
