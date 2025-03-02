document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contactForm");

  contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      message: document.getElementById("message").value,
    };

    try {
      const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert("Email inviata con successo!");
        contactForm.reset();
      } else {
        alert("Errore nell'invio dell'email. Riprova più tardi.");
      }
    } catch (error) {
      console.error("Errore nell'invio del modulo:", error);
      alert("Si è verificato un errore. Controlla la console per maggiori dettagli.");
    }
  });
});
