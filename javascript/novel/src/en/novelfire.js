export default {
  name: "NovelFire",
  baseUrl: "https://novelfire.net",
  lang: "en",

  headers: {
    "User-Agent": "Mozilla/5.0",
  },

  // 🔍 SEARCH
  async search(query) {
    const res = await fetch(`${this.baseUrl}/search?keyword=${encodeURIComponent(query)}`, {
      headers: this.headers,
    });

    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    return [...doc.querySelectorAll("a[href*='/book/']")]
      .map(el => ({
        name: el.textContent.trim(),
        url: el.href,
      }))
      .filter(x => x.name);
  },

  // 📚 DETAILS + CHAPTER LIST
  async detail(url) {
    const res = await fetch(url, { headers: this.headers });
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    const title = doc.querySelector("h1")?.textContent.trim() || "No Title";

    const chapters = [...doc.querySelectorAll("a[href*='chapter-']")]
      .map(el => ({
        name: el.textContent.trim(),
        url: el.href,
      }))
      .filter(ch => ch.name);

    return {
      name: title,
      chapters: chapters.reverse(),
    };
  },

  // 📖 CHAPTER CONTENT
  async chapter(url) {
    const res = await fetch(url, { headers: this.headers });
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    // Try proper selectors first
    let content =
      doc.querySelector("#chapter-content") ||
      doc.querySelector(".chapter-content") ||
      doc.querySelector("article");

    // fallback
    if (!content) content = doc.body;

    let text = content.innerText;

    // clean junk
    text = text
      .replace(/Table of Contents/gi, "")
      .replace(/Next Chapter/gi, "")
      .replace(/Previous Chapter/gi, "")
      .replace(/\n\s*\n/g, "\n\n");

    return text.trim();
  },
};
