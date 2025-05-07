document.addEventListener("DOMContentLoaded", function () {
  const select = document.getElementById("sort-select");
  const list = document.getElementById("post-list");

  if (!select || !list) return;

  const savedSort = localStorage.getItem("sortOrder");
  if (savedSort) select.value = savedSort;

  function sortPosts(order) {
    const posts = Array.from(list.querySelectorAll(".post-entry"));

    console.log("[debug] sorting", posts.length, "entries by", order);

    posts.sort((a, b) => {
      const dateA = new Date(a.dataset.date);
      const dateB = new Date(b.dataset.date);

      console.log("A:", dateA, "B:", dateB);

      return order === "asc" ? dateA - dateB : dateB - dateA;
    });

    list.innerHTML = "";
    posts.forEach((post) => list.appendChild(post));
  }

  sortPosts(select.value);

  select.addEventListener("change", () => {
    const sortOrder = select.value;
    localStorage.setItem("sortOrder", sortOrder);
    sortPosts(sortOrder);
  });
});
