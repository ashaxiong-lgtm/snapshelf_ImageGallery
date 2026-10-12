// ---------- Data (swap `src` for your own images, e.g. "images/photo1.jpg") ----------
const categories = ["Nature", "City", "Portrait", "Abstract"];
const titles = [
  "Morning Fog", "Neon Crossing", "Quiet Stare", "Paper Waves", "River Bend", "Rooftop Hours",
  "Soft Light", "Glass Maze", "Pine Ridge", "Night Tram", "Window Seat", "Colour Drift",
  "Salt Flats", "Market Lane", "Laughing Out", "Ink Bloom", "Tall Grass", "Underpass",
  "Golden Hour", "Fold & Crease", "Still Lake", "Bridge Lights", "Old Hands", "Spectrum"
];
const sizes = [[800, 1000], [800, 600], [800, 800], [800, 1100]];
const photos = titles.map((title, i) => {
  const [w, h] = sizes[(i * 7) % sizes.length];
  return { title, w, h, category: categories[i % categories.length],
    src: `https://picsum.photos/seed/lumen${i + 3}/${w}/${h}` };
});

// ---------- Edit options ----------
const DEFAULTS = { blur: 0, brightness: 100, contrast: 100, saturate: 100, grayscale: 0, sepia: 0, opacity: 100 };
const SLIDERS = [
  { key: "blur", label: "Blur", min: 0, max: 12, unit: "px" },
  { key: "brightness", label: "Brightness", min: 40, max: 160, unit: "%" },
  { key: "contrast", label: "Contrast", min: 40, max: 180, unit: "%" },
  { key: "saturate", label: "Vibrance", min: 0, max: 300, unit: "%" },
  { key: "grayscale", label: "Black & white", min: 0, max: 100, unit: "%" },
  { key: "sepia", label: "Warmth (sepia)", min: 0, max: 100, unit: "%" },
  { key: "opacity", label: "Opacity", min: 15, max: 100, unit: "%" }
];
const PRESETS = {
  Original: {},
  Vibrant: { saturate: 190, contrast: 112 },
  Dreamy: { blur: 3, brightness: 112, saturate: 120 },
  Vintage: { sepia: 65, contrast: 95, brightness: 105 },
  "B&W": { grayscale: 100, contrast: 120 },
  Faded: { opacity: 60, brightness: 108, saturate: 80 }
};
const filterCSS = e =>
  `blur(${e.blur}px) brightness(${e.brightness}%) contrast(${e.contrast}%) saturate(${e.saturate}%) ` +
  `grayscale(${e.grayscale}%) sepia(${e.sepia}%) opacity(${e.opacity}%)`;

// ---------- State ----------
const $ = id => document.getElementById(id);
const grid = $("grid"), filtersEl = $("filters"), lb = $("lightbox"), lbImg = $("lbImg");
let activeCat = "All", query = "", visible = [], current = 0, lastFocus = null;
let edits = {};
try { edits = JSON.parse(localStorage.getItem("snapshelf-edits")) || {}; } catch (_) {}
const getEdit = p => ({ ...DEFAULTS, ...(edits[p.title] || {}) });
const saveEdits = () => { try { localStorage.setItem("snapshelf-edits", JSON.stringify(edits)); } catch (_) {} };

// ---------- Theme (light / dark / blue) ----------
const themeBtns = document.querySelectorAll("[data-theme-set]");
function paintTheme() {
  const t = document.documentElement.dataset.theme;
  themeBtns.forEach(b => b.setAttribute("aria-pressed", b.dataset.themeSet === t));
}
themeBtns.forEach(b => b.addEventListener("click", () => {
  document.documentElement.dataset.theme = b.dataset.themeSet;
  try { localStorage.setItem("theme", b.dataset.themeSet); } catch (_) {}
  paintTheme();
}));
paintTheme();

// ---------- Category filters + search ----------
["All", ...categories].forEach(cat => {
  const b = document.createElement("button");
  b.className = "chip"; b.textContent = cat; b.setAttribute("aria-pressed", cat === "All");
  b.addEventListener("click", () => {
    activeCat = cat;
    filtersEl.querySelectorAll(".chip").forEach(c => c.setAttribute("aria-pressed", c === b));
    render();
  });
  filtersEl.appendChild(b);
});
$("search").addEventListener("input", e => { query = e.target.value.trim().toLowerCase(); render(); });

// ---------- Grid ----------
function render() {
  visible = photos.filter(p =>
    (activeCat === "All" || p.category === activeCat) &&
    (p.title.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)));
  grid.querySelectorAll(".card").forEach(c => c.classList.add("out"));
  setTimeout(() => {
    grid.innerHTML = "";
    visible.forEach((p, i) => {
      const card = document.createElement("button");
      card.className = "card";
      card.dataset.title = p.title;
      card.innerHTML = `
        <div class="frame" style="aspect-ratio:${p.w}/${p.h}">
          <img loading="lazy" src="${p.src}" alt="${p.title}, ${p.category} photo" style="filter:${filterCSS(getEdit(p))}">
        </div>
        <div class="meta"><b>${p.title}</b><i>${p.category}</i></div>`;
      const img = card.querySelector("img");
      img.addEventListener("load", () => { img.classList.add("loaded"); img.parentElement.classList.add("done"); });
      card.addEventListener("click", () => openLightbox(i));
      grid.appendChild(card);
    });
    $("count").textContent = `${visible.length} of ${photos.length} photos`;
    $("empty").hidden = visible.length > 0;
  }, grid.children.length ? 250 : 0);
}

// ---------- Edit panel ----------
const slidersEl = $("sliders"), presetsEl = $("presets");
SLIDERS.forEach(s => {
  const row = document.createElement("label");
  row.innerHTML = `<span>${s.label}</span><output id="o-${s.key}"></output>
    <input type="range" id="r-${s.key}" min="${s.min}" max="${s.max}" aria-label="${s.label}">`;
  // label layout: name + value on top, slider below
  row.style.flexWrap = "wrap";
  slidersEl.appendChild(row);
  row.querySelector("input").addEventListener("input", e => {
    const p = visible[current];
    edits[p.title] = { ...getEdit(p), [s.key]: +e.target.value };
    applyEdit(p);
  });
});
Object.keys(PRESETS).forEach(name => {
  const b = document.createElement("button");
  b.textContent = name;
  b.addEventListener("click", () => {
    const p = visible[current];
    edits[p.title] = { ...DEFAULTS, ...PRESETS[name] };
    applyEdit(p);
  });
  presetsEl.appendChild(b);
});
$("resetBtn").addEventListener("click", () => {
  const p = visible[current];
  delete edits[p.title];
  applyEdit(p);
});

function applyEdit(p) {
  const e = getEdit(p);
  lbImg.style.filter = filterCSS(e);
  SLIDERS.forEach(s => {
    $("r-" + s.key).value = e[s.key];
    $("o-" + s.key).textContent = e[s.key] + s.unit;
  });
  presetsEl.querySelectorAll("button").forEach(b => {
    const target = { ...DEFAULTS, ...PRESETS[b.textContent] };
    b.classList.toggle("on", SLIDERS.every(s => target[s.key] === e[s.key]));
  });
  const thumb = grid.querySelector(`.card[data-title="${p.title}"] img`);
  if (thumb) thumb.style.filter = filterCSS(e);
  saveEdits();
}

// Download the edited photo as a PNG using a canvas
$("saveBtn").addEventListener("click", () => {
  const note = $("note"); note.textContent = "";
  try {
    const c = document.createElement("canvas");
    c.width = lbImg.naturalWidth; c.height = lbImg.naturalHeight;
    const ctx = c.getContext("2d");
    ctx.filter = filterCSS(getEdit(visible[current]));
    ctx.drawImage(lbImg, 0, 0);
    c.toBlob(blob => {
      if (!blob) { note.textContent = "Could not save this image."; return; }
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = visible[current].title.replace(/\W+/g, "-").toLowerCase() + "-edited.png";
      a.click(); URL.revokeObjectURL(a.href);
    });
  } catch (_) {
    note.textContent = "Saving needs images that allow downloads (use local files via a local server).";
  }
});

// ---------- Lightbox ----------
function show(i) {
  current = (i + visible.length) % visible.length;
  const p = visible[current];
  lbImg.classList.add("swap");
  setTimeout(() => {
    lbImg.onload = () => lbImg.classList.remove("swap");
    lbImg.src = p.src.replace(/\/\d+\/\d+$/, `/${p.w * 1.5 | 0}/${p.h * 1.5 | 0}`);
    lbImg.alt = p.title;
    $("lbTitle").textContent = p.title;
    $("lbMeta").textContent = `${p.category} · ${current + 1} / ${visible.length}`;
    $("note").textContent = "";
    applyEdit(p);
  }, 150);
}
function openLightbox(i) {
  lastFocus = document.activeElement;
  lb.hidden = false; document.body.style.overflow = "hidden";
  show(i); $("lbClose").focus();
}
function closeLightbox() {
  lb.hidden = true; document.body.style.overflow = "";
  lastFocus && lastFocus.focus();
}
$("lbClose").addEventListener("click", closeLightbox);
$("lbBg").addEventListener("click", closeLightbox);
$("lbPrev").addEventListener("click", () => show(current - 1));
$("lbNext").addEventListener("click", () => show(current + 1));

document.addEventListener("keydown", e => {
  if (lb.hidden) return;
  if (e.key === "Escape") closeLightbox();
  if (e.target.type === "range") return; // arrows belong to the slider
  if (e.key === "ArrowLeft") show(current - 1);
  if (e.key === "ArrowRight") show(current + 1);
});

// Swipe on the photo area (touch screens)
let startX = 0;
const stage = $("stage");
stage.addEventListener("touchstart", e => startX = e.touches[0].clientX, { passive: true });
stage.addEventListener("touchend", e => {
  const dx = e.changedTouches[0].clientX - startX;
  if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
});

render();