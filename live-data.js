"use strict";
/* Loads static, teacher-approved data exported from the public CSV. The private
 * Google spreadsheet and unpublished drafts are never requested by browsers. */
async function loadPublishedLibrary() {
  let data;
  try {
    const response = await fetch("./data/library.json", { cache: "no-store" });
    if (!response.ok) return; // No feed configured yet: keep clearly marked demo.
    data = await response.json();
    if (data.source !== "published-google-sheet" || !Array.isArray(data.dictionary) ||
        !Array.isArray(data.categories) || !Array.isArray(data.spelling) ||
        !Array.isArray(data.frequency) || !Array.isArray(data.study)) return;
  } catch (error) {
    // Offline / sync pending: retain explicitly labeled preview rather than crashing.
    return;
  }

  // These use the existing renderers so Categories and Dictionary share entries.
  demoWords = data.dictionary.map(item => ({
    word: item.word || "", pos: item.pos || "", meaning: item.meaning || "",
    sentence: item.sentence || "", pictureUrl: item.pictureUrl || "",
    picture: "🖼️", pictureLabel: "Picture for " + (item.word || "word"),
    categories: Array.isArray(item.categories) ? item.categories : []
  }));
  categoryLabels = [["All topics", "✨"], ...data.categories.filter(c => c.name).map(c => [c.name, c.emoji || "🗂️"])];
  // If the teacher uses a new category tag before adding it to WordCategories,
  // still let learners reach the word through Categories.
  const categoryNames = new Set(categoryLabels.map(c => c[0]));
  demoWords.forEach(w => w.categories.forEach(name => {
    if (!categoryNames.has(name)) { categoryLabels.push([name, "🗂️"]); categoryNames.add(name); }
  }));
  activeCategory = "All topics";
  renderDictionary();
  renderCategories();
  renderPublishedSpelling(data.spelling);
  renderPublishedFrequency(data.frequency);
  renderPublishedStudy(data.study);

  document.querySelectorAll(".demo-notice").forEach(note => {
    note.textContent = "📚 Teacher-approved published vocabulary. Open this page again to see updates after the next sync.";
  });
}

function renderPublishedSpelling(items) {
  const section = document.getElementById("spelling");
  const old = section.querySelector(".practice-card");
  const holder = make("div", "published-spelling");
  if (!items.length) {
    old.replaceWith(make("p", "lesson-empty", "No published Sound-Spelling Cards yet. Check back soon!"));
    return;
  }
  for (const item of items) {
    const card = make("article", "practice-card");
    const header = make("div", "practice-card-header");
    header.append(make("span", "tag", item.focus || "PHONICS"));
    const audio = make("button", "listen-button", "🔊 Hear word");
    audio.type = "button"; audio.dataset.speak = item.word; audio.setAttribute("aria-label", "Hear " + item.word);
    header.append(audio); card.append(header);
    card.append(make("h2", "spelling-example", item.word));
    if (item.pronunciation) card.append(make("p", "centered muted", item.pronunciation));
    const picture = make("div", "practice-illustration");
    if (item.pictureUrl) {
      const img = make("img", "word-picture-img"); img.src = item.pictureUrl;
      img.alt = "Picture for " + item.word; img.loading = "lazy"; img.referrerPolicy = "no-referrer";
      img.addEventListener("error", () => img.replaceWith(make("span", "", "🖼️")), {once:true});
      picture.append(img);
    } else picture.textContent = "🔤";
    card.append(picture);
    for (const [title, value] of [["Meaning", item.meaning], ["Spelling strategy", item.strategy]]) {
      const detail = make("div", "practice-detail");
      detail.append(make("strong", "", title), make("p", "", value || "Coming soon"));
      card.append(detail);
    }
    holder.append(card);
  }
  old.replaceWith(holder);
}

function renderPublishedFrequency(items) {
  const grid = document.querySelector("#frequency .sight-grid");
  grid.replaceChildren();
  for (const item of items) {
    if (!item.word) continue;
    const button = make("button");
    button.type = "button"; button.dataset.speak = item.word;
    button.append(document.createTextNode(item.word + " "), make("span", "", "🔊"));
    if (item.group) button.title = item.group;
    grid.append(button);
  }
  document.querySelector("#frequency .practice-hint").textContent =
    items.length ? "Look, read and tap to hear each published word." : "No published High-Frequency Words yet. Check back soon!";
}

const studyTopicMap = {
  "synonyms": "Synonyms", "antonyms": "Antonyms", "prefixes": "Prefixes",
  "base": "Base Words", "suffixes": "Suffixes"
};
function renderPublishedStudy(items) {
  for (const [key, type] of Object.entries(studyTopicMap)) {
    const panel = document.getElementById("panel-" + key);
    const matching = items.filter(item => item.type === type);
    const icon = {"synonyms":"🤝","antonyms":"↔️","prefixes":"🧱","base":"🌱","suffixes":"🧱"}[key];
    panel.replaceChildren(make("span", "study-emoji", icon),
      make("p", "section-kicker", type.toUpperCase()));
    if (!matching.length) {
      panel.append(make("p", "lesson-empty", "No published activities in this topic yet."));
      continue;
    }
    matching.forEach(item => {
      let expression;
      if (key === "synonyms" || key === "antonyms") expression = (item.word || "") + " ↔ " + (item.related || "");
      else if (key === "prefixes") expression = (item.affix || "") + " + " + (item.word || "") + " → " + (item.related || "");
      else if (key === "suffixes") expression = (item.word || "") + " + " + (item.affix || "") + " → " + (item.related || "");
      else expression = (item.word || "") + " → " + (item.related || "");
      panel.append(make("h2", "study-example-title", expression));
      if (item.rule) panel.append(make("p", "", item.rule));
      if (item.sentence) panel.append(make("div", "lesson-example", item.sentence));
    });
  }
  const selected = document.querySelector('.study-tabs [aria-selected="true"]');
  showStudyTab(selected ? selected.dataset.studyTab : "synonyms", false);
}

loadPublishedLibrary();
