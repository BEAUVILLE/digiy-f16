/* DIGIY HUB — F16 FINAL
   - data-driven modules.json
   - zero bug routing
   - PRO => inscription-digiy
   - floating buttons: NDIMBAL + QR + PRO
*/

(() => {
  "use strict";

  // ✅ LINKS (tu changes ici si besoin)
  const LINKS = {
    inscription: "https://beauville.github.io/inscription-digiy/",
    ndimbal:     "https://beauville.github.io/digiy-mdimbal-map/",
    qr:          "https://beauville.github.io/digiy-qr-pro/"
  };

  const STORAGE = {
    phone: "DIGIY_HUB_PHONE"
  };

  const $ = (id) => document.getElementById(id);

  const overlay = $("overlay");
  const btnOpenOverlay = $("btnOpenOverlay");
  const btnCloseOverlay = $("btnCloseOverlay");
  const btnAlreadyAccess = $("btnAlreadyAccess");

  const btnGoPro = $("btnGoPro");
  const btnGoPublic = $("btnGoPublic");
  const btnOpenNdimbal = $("btnOpenNdimbal");
  const btnOpenQR = $("btnOpenQR");

  const floatNdimbal = $("floatNdimbal");
  const floatQR = $("floatQR");
  const floatPro = $("floatPro");

  const phoneInput = $("phoneInput");
  const btnRemember = $("btnRemember");
  const phoneHint = $("phoneHint");

  const modulesGrid = $("modulesGrid");
  const searchInput = $("searchInput");
  const btnReloadModules = $("btnReloadModules");

  let MODULES = [];

  function safeOpen(url){
    try { window.location.href = url; }
    catch(e){ console.warn("open fail", e); }
  }

  function openOverlay(){
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
  }

  function closeOverlay(){
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
  }

  function normPhone(v){
    return (v || "").trim().replace(/\s+/g, "");
  }

  function loadPhone(){
    const p = localStorage.getItem(STORAGE.phone) || "";
    if (p) {
      phoneInput.value = p;
      phoneHint.textContent = `✅ Numéro mémorisé : ${p}`;
    } else {
      phoneHint.textContent = "Astuce : ton numéro sert à retrouver ton HUB plus vite.";
    }
  }

  function savePhone(){
    const p = normPhone(phoneInput.value);
    if (!p) {
      phoneHint.textContent = "⚠️ Mets un numéro (ex: +221778765785).";
      return;
    }
    localStorage.setItem(STORAGE.phone, p);
    phoneHint.textContent = `✅ Numéro mémorisé : ${p}`;
  }

  // ✅ PRO : toujours vers inscription-digiy (comme demandé)
  function goPro(){
    // on passe le phone en query si présent (pratique)
    const p = normPhone(phoneInput.value) || localStorage.getItem(STORAGE.phone) || "";
    const url = p ? `${LINKS.inscription}?phone=${encodeURIComponent(p)}` : LINKS.inscription;
    safeOpen(url);
  }

  function goNdimbal(){
    safeOpen(LINKS.ndimbal);
  }

  function goQR(){
    safeOpen(LINKS.qr);
  }

  function escapeHtml(s){
    return String(s || "")
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }

  function matchesSearch(mod, q){
    if(!q) return true;
    const hay = `${mod.name||""} ${mod.desc||""} ${(mod.tags||[]).join(" ")} ${(mod.key||"")}`.toLowerCase();
    return hay.includes(q);
  }

  function renderModules(){
    const q = (searchInput.value || "").trim().toLowerCase();
    const list = MODULES.filter(m => matchesSearch(m, q));

    if(!list.length){
      modulesGrid.innerHTML = `
        <div class="cardMod">
          <h3 class="modName">Aucun résultat</h3>
          <p class="modDesc">Essaie un autre mot-clé (ex: loc, driver, market…).</p>
          <div class="modActions">
            <button class="aBtn primary" type="button" id="btnNoResultPro">🦅 Accès PRO</button>
            <button class="aBtn" type="button" id="btnNoResultReload">↻ Recharger</button>
          </div>
        </div>
      `;
      const a = document.getElementById("btnNoResultPro");
      const b = document.getElementById("btnNoResultReload");
      if(a) a.addEventListener("click", goPro);
      if(b) b.addEventListener("click", fetchModules);
      return;
    }

    modulesGrid.innerHTML = list.map(mod => {
      const icon = escapeHtml(mod.icon || "⚡");
      const name = escapeHtml(mod.name || "Module");
      const desc = escapeHtml(mod.desc || "");
      const access = (mod.access || "pro").toLowerCase(); // pro|public|mixed
      const isPro = access !== "public";
      const badge = access === "public"
        ? `<span class="badge public">PUBLIC</span>`
        : `<span class="badge pro">PRO</span>`;

      const openLabel = access === "public" ? "👀 Ouvrir" : "🦅 Accès PRO";

      // si public, on ouvre mod.url ; sinon -> inscription
      const primaryAction = access === "public"
        ? `data-act="open" data-url="${escapeHtml(mod.url || "#")}" `
        : `data-act="pro" `;

      const secondaryAction = `data-act="info" data-key="${escapeHtml(mod.key||"")}"`;

      const tags = Array.isArray(mod.tags) ? mod.tags.slice(0,3) : [];
      const tagBadges = tags.map(t => `<span class="badge">${escapeHtml(t)}</span>`).join("");

      return `
        <article class="cardMod">
          <div class="modTop">
            <div class="modIcon">${icon}</div>
            <div class="modText">
              <h3 class="modName">${name}</h3>
              <p class="modDesc">${desc}</p>
            </div>
          </div>

          <div class="modBadges">
            ${badge}
            ${tagBadges}
          </div>

          <div class="modActions">
            <button class="aBtn primary" type="button" ${primaryAction}>${openLabel}</button>
            <button class="aBtn" type="button" ${secondaryAction}>ℹ️ Détails</button>
          </div>
        </article>
      `;
    }).join("");

    // delegate buttons
    modulesGrid.querySelectorAll("button[data-act]").forEach(btn => {
      btn.addEventListener("click", () => {
        const act = btn.getAttribute("data-act");
        if(act === "pro") return goPro();
        if(act === "open"){
          const url = btn.getAttribute("data-url") || "#";
          if(url === "#" || !url.startsWith("http")) return goPro(); // fallback clean
          return safeOpen(url);
        }
        if(act === "info"){
          // on ouvre l’overlay et on propose PRO / NDIMBAL / QR
          openOverlay();
          return;
        }
      });
    });
  }

  async function fetchModules(){
    try{
      btnReloadModules.disabled = true;
      btnReloadModules.textContent = "…";

      const res = await fetch("./modules.json?v=" + Date.now(), { cache: "no-store" });
      if(!res.ok) throw new Error("modules.json not found");
      const data = await res.json();

      MODULES = Array.isArray(data) ? data : (Array.isArray(data.modules) ? data.modules : []);
      if(!MODULES.length) throw new Error("modules empty");

      renderModules();
    }catch(err){
      console.warn(err);
      // fallback minimal (si modules.json absent)
      MODULES = [
        { key:"ndimbal", name:"NDIMBAL MAP", icon:"🧭", desc:"Carte terrain multi-QG.", access:"public", url:LINKS.ndimbal, tags:["terrain","map"] },
        { key:"loc", name:"DIGIY LOC PRO", icon:"🏠", desc:"Locations · hébergements · planning.", access:"pro", tags:["pro","planning"] },
        { key:"driver", name:"DIGIY DRIVER PRO", icon:"🚗", desc:"Chauffeur · courses · cockpit.", access:"pro", tags:["pro","transport"] },
        { key:"build", name:"DIGIY BUILD PRO", icon:"🧱", desc:"Artisans · devis · chantiers.", access:"pro", tags:["pro","devis"] },
        { key:"market", name:"DIGIY MARKET", icon:"🛒", desc:"Marketplace · deals · terrain.", access:"pro", tags:["pro","market"] },
        { key:"jobs", name:"DIGIY JOBS", icon:"🧰", desc:"Emploi · dossiers · accompagnement.", access:"pro", tags:["pro","jobs"] },
        { key:"qr", name:"DIGIY QR PRO", icon:"📷", desc:"QR pour pros · accès rapide.", access:"public", url:LINKS.qr, tags:["qr"] }
      ];
      renderModules();
    }finally{
      btnReloadModules.disabled = false;
      btnReloadModules.textContent = "↻";
    }
  }

  function bindUI(){
    // overlay
    btnOpenOverlay.addEventListener("click", openOverlay);
    btnAlreadyAccess.addEventListener("click", goPro);
    btnCloseOverlay.addEventListener("click", closeOverlay);

    overlay.addEventListener("click", (e) => {
      if(e.target === overlay) closeOverlay();
    });

    window.addEventListener("keydown", (e) => {
      if(e.key === "Escape") closeOverlay();
    });

    btnGoPro.addEventListener("click", goPro);
    btnGoPublic.addEventListener("click", closeOverlay);
    btnOpenNdimbal.addEventListener("click", goNdimbal);
    btnOpenQR.addEventListener("click", goQR);

    // floating
    floatNdimbal.addEventListener("click", goNdimbal);
    floatQR.addEventListener("click", goQR);
    floatPro.addEventListener("click", goPro);

    // phone
    btnRemember.addEventListener("click", savePhone);
    phoneInput.addEventListener("keydown", (e) => {
      if(e.key === "Enter") savePhone();
    });

    // search
    searchInput.addEventListener("input", () => renderModules());
    btnReloadModules.addEventListener("click", fetchModules);
  }

  function boot(){
    bindUI();
    loadPhone();
    fetchModules();
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
