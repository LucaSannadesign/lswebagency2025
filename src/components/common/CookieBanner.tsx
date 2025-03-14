import { useState, useEffect } from "preact/hooks";

const CookieBanner = () => {
  const [isAccepted, setIsAccepted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAccepted(localStorage.getItem("cookiesAccepted") === "true");
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setIsAccepted(true);
  };

  if (isAccepted) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg flex justify-between items-center">
      <p className="text-sm">Usiamo i cookie per migliorare la tua esperienza.</p>
      <button className="bg-blue-500 px-4 py-2 rounded text-sm" onClick={acceptCookies}>
        Accetto
      </button>
    </div>
  );
};

export default CookieBanner;
