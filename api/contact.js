document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");

  form.addEventListener("submit", async function (event) {
      event.preventDefault();

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      try {
          const response = await fetch("/api/sendEmail", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
          });

          if (response.ok) {
              // Reindirizza alla pagina di cortesia
              window.location.href = "/grazie";

              // Dopo 15 secondi, torna alla home
              setTimeout(() => {
                  window.location.href = "/";
              }, 15000);
          } else {
              alert("Errore nell'invio del modulo. Riprova più tardi.");
          }
      } catch (error) {
          console.error("Errore:", error);
          alert("Errore di connessione con il server.");
      }
  });
});
