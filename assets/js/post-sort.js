document.addEventListener("DOMContentLoaded", function () {
    const select = document.getElementById("sort-select");
    const list = document.getElementById("post-list");
  
    if (!select || !list) return;
  
    select.addEventListener("change", () => {
      const posts = Array.from(list.querySelectorAll(".post-entry"));
      const sortOrder = select.value;
  
      posts.sort((a, b) => {
        const dateA = new Date(a.dataset.date);
        const dateB = new Date(b.dataset.date);
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
  
      list.innerHTML = "";
      posts.forEach(post => list.appendChild(post));
    });
  });
  