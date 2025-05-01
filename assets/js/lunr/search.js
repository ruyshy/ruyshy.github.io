(function () {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("q");

  const searchInput = document.getElementById("search");
  const resultsContainer = document.getElementById("results");

  if (!searchInput || !resultsContainer) return;
  if (typeof window.store === "undefined") return;

  function renderResults(results, query) {
    resultsContainer.innerHTML = "";

    if (results.length === 0) {
      resultsContainer.innerHTML = `<p><em>"${query}"</em>에 대한 결과가 없습니다.</p>`;
      return;
    }

    const html = results
      .map(
        (post) => `
      <div class="list__item">
        <article class="archive__item" itemscope itemtype="https://schema.org/CreativeWork">
          <h2 class="archive__item-title" itemprop="headline">
            <a href="${post.url}" rel="bookmark">${post.title}</a>
          </h2>
          <div class="archive__item-excerpt" itemprop="description">
            ${post.excerpt?.slice(0, 150) ?? ""}...
          </div>
        </article>
      </div>
    `
      )
      .join("");

    resultsContainer.innerHTML = html;
  }

  function performSearch(query) {
    const results = [];
    const lower = query.toLowerCase();

    for (const post of window.store) {
      const title = post.title?.toLowerCase() ?? "";
      const excerpt = post.excerpt?.toLowerCase() ?? "";
      const tags = post.tags?.join(" ").toLowerCase() ?? "";
      const categories = post.categories?.join(" ").toLowerCase() ?? "";

      let match = false;

      if (lower.startsWith("title:")) {
        const keyword = lower.replace("title:", "").trim();
        match = title.includes(keyword);
      } else if (lower.startsWith("tags:")) {
        const keyword = lower.replace("tags:", "").trim();
        match = tags.includes(keyword);
      } else {
        // 제목 + 본문 + 태그 + 카테고리 전체 검색
        match =
          title.includes(lower) ||
          excerpt.includes(lower) ||
          tags.includes(lower) ||
          categories.includes(lower);
      }

      if (match) {
        results.push(post);
      }
    }

    renderResults(results, query);
  }

  if (query) {
    searchInput.value = query;
    performSearch(query);
  }

  searchInput.addEventListener("input", function (e) {
    performSearch(e.target.value);
  });
})();
