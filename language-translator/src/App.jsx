
import React, { useState, useEffect } from "react";
import {
  Languages, ArrowLeftRight, Mic, Volume2,
  Copy, Trash2, Accessibility, Sun, Moon,
  Sparkles, Check, Headphones, Keyboard
} from "lucide-react";

import { motion } from "framer-motion";
import "./App.css";

const languages = [
  { name: "English", code: "en" },
  { name: "Hindi", code: "hi" },
  { name: "Marathi", code: "mr" },
  { name: "French", code: "fr" },
  { name: "Spanish", code: "es" },
  { name: "German", code: "de" },
  { name: "Japanese", code: "ja" },
  { name: "Chinese", code: "zh-CN" },
  { name: "Arabic", code: "ar" },
  { name: "Italian", code: "it" }
];

function App() {
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("mr");

  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [accessible, setAccessible] = useState(false);
  const [copied, setCopied] = useState(false);

  const [listening, setListening] = useState(false);

  useEffect(() => {
    document.body.className = darkMode ? "dark-body" : "";
  }, [darkMode]);

  // Translate text
  const translateText = async () => {
    if (!inputText.trim()) {
      setError("Please enter some text first.");
      return;
    }

    if (sourceLang === targetLang) {
      setError("Please select two different languages.");
      return;
    }

    setLoading(true);
    setError("");
    setTranslatedText("");

    try {
      const url =
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(inputText)}&langpair=${sourceLang}|${targetLang}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok || data.responseStatus !== 200) {
        throw new Error(
          data.responseDetails || "Translation failed."
        );
      }

      setTranslatedText(data.responseData.translatedText);

    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Swap languages
  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);

    setInputText(translatedText);
    setTranslatedText(inputText);
    setError("");
  };

  // Clear all text
  const clearText = () => {
    setInputText("");
    setTranslatedText("");
    setError("");
  };

  // Copy translated text
  const copyText = async () => {
    if (!translatedText) return;

    try {
      await navigator.clipboard.writeText(translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("Clipboard access is unavailable.");
    }
  };

  // Text to speech
  const speakText = (text, language) => {
    if (!text.trim()) return;

    if (!("speechSynthesis" in window)) {
      setError("Speech output is not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = language;
    speech.rate = 0.9;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
  };

  // Speech to text
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Voice recognition is not supported. Try Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = sourceLang;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
      setError("");
    };

    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;
      setInputText((prev) => prev ? prev + " " + speechText : speechText);
    };

    recognition.onerror = () => {
      setError("Microphone error. Please check microphone permission.");
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  return (
    <div className={`app ${darkMode ? "dark" : ""} ${accessible ? "access-mode" : ""}`}>

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <div className="logo-icon">
            <Languages size={25} />
          </div>

          <span>Lingua<span className="logo-highlight">Ease</span></span>
        </div>

        <div className="nav-actions">
          <button
            className={`icon-btn ${accessible ? "active" : ""}`}
            onClick={() => setAccessible(!accessible)}
            aria-label="Toggle accessibility mode"
            title="Accessibility mode"
          >
            <Accessibility size={21} />
          </button>

          <button
            className="icon-btn"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark mode"
            title="Toggle theme"
          >
            {darkMode ? <Sun size={21} /> : <Moon size={21} />}
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main className="main-container">

        <motion.section
          className="hero"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="hero-tag">
            <Sparkles size={15} />
            COMMUNICATE WITHOUT LIMITS
          </div>

          <h1>
            Every Language.
            <br />
            <span>One Connection.</span>
          </h1>

          <p>
            Break language barriers with simple, accessible
            and intelligent translation.
          </p>
        </motion.section>

        {/* Translator */}
        <motion.section
          className="translator-card"
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >

          <div className="language-bar">

            <div className="language-select">
              <label htmlFor="source-language">Translate from</label>

              <select
                id="source-language"
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="swap-btn"
              onClick={swapLanguages}
              aria-label="Swap languages"
              title="Swap languages"
            >
              <ArrowLeftRight size={21} />
            </button>

            <div className="language-select">
              <label htmlFor="target-language">Translate to</label>

              <select
                id="target-language"
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <div className="translation-area">

            {/* Input */}
            <div className="text-panel">
              <div className="panel-heading">
                <span>Your text</span>
                <span className="character-count">
                  {inputText.length}/5000
                </span>
              </div>

              <textarea
                aria-label="Enter text to translate"
                placeholder="Type something here..."
                value={inputText}
                maxLength={5000}
                onChange={(e) => setInputText(e.target.value)}
              />

              <div className="panel-footer">
                <button
                  className={`tool-btn ${listening ? "listening" : ""}`}
                  onClick={startListening}
                  aria-label="Speak to enter text"
                  title="Voice input"
                >
                  <Mic size={19} />
                  {listening ? "Listening..." : "Speak"}
                </button>

                <button
                  className="tool-btn"
                  onClick={() => speakText(inputText, sourceLang)}
                  disabled={!inputText}
                  aria-label="Listen to original text"
                >
                  <Volume2 size={19} />
                  Listen
                </button>

                <button
                  className="tool-btn clear-btn"
                  onClick={clearText}
                  aria-label="Clear text"
                >
                  <Trash2 size={17} />
                  Clear
                </button>
              </div>
            </div>

            {/* Output */}
            <div className="text-panel output-panel">
              <div className="panel-heading">
                <span>Translation</span>
                <span className="translated-label">
                  <Sparkles size={13} />
                  Result
                </span>
              </div>

              <div
                className="translated-content"
                aria-live="polite"
                aria-atomic="true"
              >
                {loading ? (
                  <div className="loading">
                    <div className="spinner"></div>
                    Translating your text...
                  </div>
                ) : translatedText ? (
                  <p>{translatedText}</p>
                ) : (
                  <p className="placeholder">
                    Your translated text will appear here...
                  </p>
                )}
              </div>

              <div className="panel-footer">
                <button
                  className="tool-btn"
                  onClick={() => speakText(translatedText, targetLang)}
                  disabled={!translatedText}
                  aria-label="Listen to translated text"
                >
                  <Volume2 size={19} />
                  Listen
                </button>

                <button
                  className="tool-btn"
                  onClick={copyText}
                  disabled={!translatedText}
                  aria-label="Copy translated text"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

          </div>

          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          <button
            className="translate-btn"
            onClick={translateText}
            disabled={loading || !inputText.trim()}
          >
            {loading ? "Translating..." : (
              <>
                <Languages size={20} />
                Translate Now
                <Sparkles size={18} />
              </>
            )}
          </button>

        </motion.section>

        {/* Accessibility features */}
        <section className="features-section">
          <div className="section-title">
            <h2>Designed for Everyone</h2>
            <p>Communication should be accessible to all.</p>
          </div>

          <div className="feature-grid">

            <div className="feature-card">
              <div className="feature-icon purple">
                <Headphones size={24} />
              </div>
              <h3>Listen to Text</h3>
              <p>Hear written content through speech output.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon blue">
                <Mic size={24} />
              </div>
              <h3>Voice Input</h3>
              <p>Speak instead of typing using a microphone.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon orange">
                <Accessibility size={24} />
              </div>
              <h3>Easy Accessibility</h3>
              <p>Large text, high contrast and easy controls.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon green">
                <Keyboard size={24} />
              </div>
              <h3>Simple Controls</h3>
              <p>Keyboard-friendly buttons and clear navigation.</p>
            </div>

          </div>
        </section>

        <footer>
          <p>Made with ♥ for a world without language barriers.</p>
          <span>LinguaEase © 2026</span>
        </footer>

      </main>
    </div>
  );
}

export default App;
