import { useState, useEffect } from "preact/hooks";

const CookieBanner = () => {
  const [cookiesAccepted, setCookiesAccepted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPreference = localStorage.getItem("cookiesAccepted") === "true";
      setCookiesAccepted(storedPreference);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setCookiesAccepted(true);
  };

  return (
    !cookiesAccepted && (
      <div class="fixed bottom-4 left-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-md flex justify-between items-center">
        <p>Utilizziamo i cookie per migliorare la tua esperienza.</p>
        <button onClick={acceptCookies} class="bg-blue-500 px-4 py-2 rounded text-white">
          Accetta
        </button>
      </div>
    )
  );
};

export default CookieBanner;
