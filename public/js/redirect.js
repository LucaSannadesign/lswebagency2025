document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    if (window && window.location) {
      window.location.replace("/"); // 🔹 Più sicuro di `window.location.href`
    }
  }, 5000);
});
