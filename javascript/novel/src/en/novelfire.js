const baseUrl = "https://novelfire.net";

function parseHtml(html) {
    return new DOMParser().parseFromString(html, "text/html");
}

// 🔍 SEARCH
async function search(query) {
    const res = await fetch(`${baseUrl}/search?keyword=${encodeURIComponent(query)}`);
    const text = await res.text();
    const doc = parseHtml(text);

    return [...doc.querySelectorAll("a[href*='/book/']")].map(el => ({
        name: el.innerText.trim(),
        url: el.href,
    }));
}

// 📚 DETAILS + CHAPTER LIST
async function detail(url) {
    const res = await fetch(url);
    const text = await res.text();
    const doc = parseHtml(text);

    const title = doc.querySelector("h1")?.innerText || "";

    const chapters = [...doc.querySelectorAll("a[href*='chapter-']")].map(el => ({
        name: el.innerText.trim(),
        url: el.href,
    }));

    return {
        name: title,
        chapters: chapters.reverse()
    };
}

// 📖 CHAPTER CONTENT
async function chapter(url) {
    const res = await fetch(url);
    const text = await res.text();
    const doc = parseHtml(text);

    // brute force (works even if structure messy)
    const content = doc.body.innerText;

    return content;
}
