const novelFire = {
  baseUrl: "https://novelfire.net",

  headers: {
    "User-Agent": "Mozilla/5.0",
  },

  // 🔍 SEARCH
  search: async function (query) {
    const res = await fetch(`${this.baseUrl}/search?keyword=${encodeURIComponent(query)}`, { headers: this.headers });
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    const items = [...doc.querySelectorAll("a[href*='/book/']")];

    return items.map(el => ({
      name: el.textContent.trim(),
      url: el.href,
    }));
  },

  // 📚 DETAILS + CHAPTERS
  detail: async function (url) {
    const res = await fetch(url, { headers: this.headers });
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    const title = doc.querySelector("h1")?.textContent.trim() || "";

    const chapters = [...doc.querySelectorAll("a[href*='chapter-']")].map(el => ({
      name: el.textContent.trim(),
      url: el.href,
    }));

    return {
      name: title,
      chapters: chapters.reverse(),
    };
  },

  // 📖 CHAPTER CONTENT
  chapter: async function (url) {
    const res = await fetch(url, { headers: this.headers });
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    // cleaner extraction
    let content = doc.body.innerText;

    // remove junk (optional cleanup)
    content = content.replace(/Table of Contents/g, "");
    content = content.replace(/Next Chapter/g, "");

    return content;
  }
};

export default novelFire;
