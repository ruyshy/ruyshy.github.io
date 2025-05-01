function SidebarSearchHandler() {
  const query = document.getElementById("search-query").value;
  const type = document.getElementById("search-type").value;

  if (!query.trim()) return false;

  let finalQuery = "";
  if (type === "title") finalQuery = `title:${query}`;
  else if (type === "tag") finalQuery = `tags:${query}`;
  else finalQuery = query;

  window.location.href = `/_search/?q=${encodeURIComponent(finalQuery)}`;
  return false;
}
