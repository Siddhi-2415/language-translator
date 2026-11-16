
import React, { useState } from "react";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "mr", name: "Marathi", flag: "🇮🇳" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
];

function Translator() {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("fr");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [autoDetect, setAutoDetect] = useState(false);

  const source = languages.find(l => l.code === sourceLang);
  const target = languages.find(l => l.code === targetLang);

  const translateText = async () => {
    if (!inputText.trim()) {
      setError("Please enter text to translate.");
      return;
    }

    if (sourceLang === targetLang) {
      setError("Please select different languages.");
      return;
    }

    setLoading(true);
    setError("");
    setTranslatedText("");

    try {
      const params = new URLSearchParams({
        q: inputText,
        langpair: `${sourceLang}|${targetLang}`,
      });

      const response = await fetch(
        `https://api.mymemory.translated.net/get?${params}`
      );

      if (!response.ok) {
        throw new Error("Translation service is unavailable.");
      }

      const data = await response.json();

      if (data.responseStatus !== 200) {
        throw new Error(data.responseDetails || "Translation failed.");
      }

      setTranslatedText(data.responseData.translatedText);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const swapLanguages = () => {
    if (loading) return;

    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(translatedText);
    setTranslatedText(inputText);
    setError("");
  };

  const speak = (text, lang) => {
    if (!text.trim() || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = lang;
    window.speechSynthesis.speak(speech);
  };

  const copyText = async () => {
    if (!translatedText) return;

    try {
      await navigator.clipboard.writeText(translatedText);
      setError("");
      alert("Translation copied!");
    } catch {
      setError("Unable to copy text.");
    }
  };

  const clearAll = () => {
    setInputText("");
    setTranslatedText("");
    setError("");
  };

  return (
    <div className="translator-page">

      {/* Decorative background */}
      <div className="bg-glow glow-one"></div>
      <div className="bg-glow glow-two"></div>

      {/* Header */}
      <header className="header">
        <div className="logo">
          <span className="logo-icon">🌐</span>
          <span>Lingua<span>Connect</span></span>
        </div>

        <span className="header-label">
          ✨ Your language companion
        </span>
      </header>

      {/* Main content */}
      <main className="main-content">

        <div className="hero">
          <div className="hero-tag">
            ✦ BREAK LANGUAGE BARRIERS
          </div>

          <h1>
            Every word has a
            <span> world of meaning.</span>
          </h1>

          <p>
            Translate, understand and connect with the world.
          </p>
        </div>

        {/* Auto detect */}
        <div className="auto-detect">
          <span>✨ Auto Detect</span>

          <button
            className={`toggle ${autoDetect ? "active" : ""}`}
            onClick={() => {
              setAutoDetect(!autoDetect);
              setError(
                !autoDetect
                  ? "Automatic detection is not connected yet. Please select your source language manually."
                  : ""
              );
            }}
            aria-label="Toggle auto detect"
            aria-pressed={autoDetect}
          >
            <span></span>
          </button>
        </div>

        {/* Translator cards */}
        <section className="translator-wrapper">

          <div className="language-card">

            <div className="card-top">
              <div className="language-select">
                <span className="language-code">{source?.code.toUpperCase()}</span>

                <select
                  value={sourceLang}
                  onChange={e => {
                    setSourceLang(e.target.value);
                    setError("");
                    setAutoDetect(false);
                  }}
                  disabled={loading}
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="speaker"
                onClick={() => speak(inputText, sourceLang)}
                title="Listen to input"
              >
                🔊
              </button>
            </div>

            <textarea
              value={inputText}
              onChange={e => {
                setInputText(e.target.value);
                setError("");
              }}
              placeholder="Enter your text here..."
              maxLength={5000}
            />

            <div className="card-bottom">
              <span>{inputText.length}/5000</span>

              <button
                onClick={() => setInputText("")}
                disabled={!inputText}
              >
                Clear
              </button>
            </div>

          </div>

          {/* Swap */}
          <button
            className="swap-button"
            onClick={swapLanguages}
            disabled={loading}
            title="Swap languages"
          >
            ⇄
          </button>

          <div className="language-card output-card">

            <div className="card-top">
              <div className="language-select">
                <span className="language-code">{target?.code.toUpperCase()}</span>

                <select
                  value={targetLang}
                  onChange={e => {
                    setTargetLang(e.target.value);
                    setError("");
                  }}
                  disabled={loading}
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="speaker"
                onClick={() => speak(translatedText, targetLang)}
                title="Listen to translation"
              >
                🔊
              </button>
            </div>

            <textarea
              value={translatedText}
              readOnly
              placeholder="Your translation will appear here..."
            />

            <div className="card-bottom">
              <span>{translatedText.length} characters</span>

              <button
                onClick={copyText}
                disabled={!translatedText}
              >
                📋 Copy
              </button>
            </div>

          </div>

        </section>

        {/* Translate button */}
        <div className="translate-area">
          <button
            className="translate-button"
            onClick={translateText}
            disabled={loading || !inputText.trim()}
          >
            <span>✦</span>
            {loading ? "Translating..." : "Translate"}
            <span>➜</span>
          </button>

          <button className="clear-all" onClick={clearAll}>
            Clear all
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Floating language decorations */}
        <div className="float-icon float-left">Aa</div>
        <div className="float-icon float-right">É</div>
        <div className="float-icon globe-left">🌍</div>
        <div className="float-icon chat-right">•••</div>

      </main>

      <footer>
        Made with 💜 | LinguaConnect © 2026
      </footer>

    </div>
  );
}

export default Translator;
