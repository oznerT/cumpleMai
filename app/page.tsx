"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Play, RotateCcw, Check, X, ArrowRight } from "lucide-react"

const riddles = [
  {
    id: 1,
    question: "Nuestra última salida, donde nos pusimos coquetos antes de que me fuera a España, en dónde fue?",
    answers: ["la barraca", "barraca", "La barraca", "Barraca", "La Barraca"],
    phrase: "Esa noche no fue solo una despedida. Fue una promesa disfrazada de cita.",
    images: ["F0.jpg", "F1.jpg", "F2.jpg"],
  },
  {
    id: 2,
    question: "Parque de la foto con la famosa frase: 'Un robo'?",
    answers: ["san martin", "san martín", "parque san martin", "parque san martín"],
    phrase: "Y sigo robandooooo ",
    images: ["F3.jpg", "F03.jpg"],
  },
  {
    id: 3,
    question: "¡Tu comida favorita!",
    answers: ["sushi", "Sushi", "El sushi", "el sushi"],
    phrase: "Era perfectoo, muy sabrozo y te enamoraba, el sushi estaba rico también.",
    images: ["F4.jpg", "F42.jpg", "F43.jpg", "F44.jpg", "F45.jpg", "F41.jpg"],
  },
  {
    id: 4,
    question: "¡Nuestro primer concierto de rock!!",
    answers: ["babasonicos", "babasónicos", "Babasónicos", "Babasonicos"],
    phrase: "Desde esa noche, jamás voy a poder escuchar Babasónicos sin pensar en vos.",
    images: ["F6.jpg", "F7.jpg"],
  },
  {
    id: 5,
    question: "¿Qué cosa rica, exquisita, deliciosa comimos en la salida por nuestro primer mes?",
    answers: ["chambuchito", "chambuchito de jamon y queso", "chambuchito de jamón y queso", "chambuchito de jamón y Queso", "Chambuchitos"],
    phrase: "Primera de muuuuuchas.",
    images: ["F8.jpg", "F81.jpg"],
  },
  {
    id: 6,
    question: "Jo jo joooo, regalitoos y ferneeeet",
    answers: ["navidad", "nochebuena", "Navidad", "Nochebuena", "La Navidad", "la navidad"],
    phrase: "Se pasó el viejito navideño y me dio la muñequita más linda del planeta.",
    images: ["F9.jpg", "F10.jpg", "F11.jpg", "F12.jpg"],
  },
  {
    id: 7,
    question: "Amigos, comidas, arenitaa y muuuuuuuuuchas deudas",
    answers: ["chile"],
    phrase: "Próxima => Japón (WE)",
    images: ["F20.jpg", "F21.jpg", "F201.jpg", "F211.jpg", "FF20.jpg"],
  },
  {
    id: 8,
    question: "Quién es la única mujer que tiene permitido dormir en mi cama conmigo?",
    answers: ["rebeca", "Rebeca"],
    phrase: "ASAAAA te asustaste?",
    images: ["F22.jpg", "F221.jpg"],
  },
  {
    id: 9,
    question:
      "Sirve para limpiarse las manitos y la boquita cuando estamos comiendo, muy útil… ah, y me olvidaba un detalle importante: usé una de estas para hacerte una cartita en España que te la di el 18/11/24. ¿Qué es?",
    answers: ["servilleta", "una servilleta", "Servilleta", "servilletas", "Una servilleta"],
    phrase: "Me dijiste que sii y te dormiste escuchando acústicos de Las Pastillas 🥺",
    images: ["F25.jpg", "F251.jpg", "F252.jpg"],
  },
  {
    id: 10,
    question:
      "Hola! Soy una personita que todo lo que se propone lo puede, que es un ser de luz hermoso para toda la gente que la rodea, inteligente, artística, inspiradora, soñadora, buena persona e igual de hermosa por dentro que por fuera, ¿quién soy?",
    answers: ["maira", "Maira"],
    phrase: "Obvio que sos vos, GANASTEEEEEEE!!!!!!",
    images: ["F26.jpg", "F23.jpg", "F18.jpg", "F19.jpg", "F16.jpg", "F15.jpg"],
  },
]

const introTexts = [
  "Esta no es una carta cualquiera, es algo mucho mas cursi, como te gusta a vos 😏",
  "Un recorrido por nosotros con cada recuerdo",
  "Se desbloquea si adivinás la respuesta correcta podes ver las respuesta siempre que quieras (No lo hagas o perdes)",
  "Sabrás todo? veamos........",
]

const finalLetter = `Ahora siiiiii, el final. Un recorrido por nosotros, por nuestras escenas, por lo que siento. Porque sos muy importante para mí, gracias por quedarte, por elegirme, por quererme tanto, y por ser siempre vos, desde esa tarde en el quincho hasta este momento que estás leyendo esto.

Te amooooo memeeeeeeee, espero que no te haya costado adivinar todo (Eran fáciles hdp) y perdón por no hacerte algo más como una cartita. Es imposible para mí que unas palabras en un papel alcancen a reflejar lo que siento, así que lo adapté un poco más a mí je.

Te amo meme, gracias de nuevo por estar conmigo, vamos a lograr todo lo que nos propongamos, sé que lo sabes y sabes que lo sé. Nos queda todo por delante. Bueno, adiós, soy malísimo escribiendo dios jajajaja, te amooooooo, aguante la lepra we.`

export default function BirthdayLanding() {
  const [currentScreen, setCurrentScreen] = useState("initial") // initial, welcome, intro, riddles, hint, final
  const [currentRiddle, setCurrentRiddle] = useState(0)
  const [savedRiddle, setSavedRiddle] = useState(0) // Para guardar en qué adivinanza estaba cuando usó la pista
  const [userAnswer, setUserAnswer] = useState("")
  const [showError, setShowError] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showContinueButton, setShowContinueButton] = useState(false)
  const [typingText, setTypingText] = useState("")
  const [showWelcomeButton, setShowWelcomeButton] = useState(false)
  const [musicStarted, setMusicStarted] = useState(false)
  // Estados para el botón troll
  const [trollButtonPosition, setTrollButtonPosition] = useState({ x: 20, y: 20 })
  const [showTrollButton, setShowTrollButton] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)

  // Typing animation for welcome text
  useEffect(() => {
    if (currentScreen === "welcome") {
      const text = "Feeeeeliz cumpleeee memeeee"
      let index = 0
      setTypingText("")
      setShowWelcomeButton(false)

      const timer = setInterval(() => {
        if (index <= text.length) {
          setTypingText(text.slice(0, index))
          index++
        } else {
          clearInterval(timer)
          setTimeout(() => setShowWelcomeButton(true), 500)
        }
      }, 100)

      return () => clearInterval(timer)
    }
  }, [currentScreen])

  // Mostrar textos intro progresivamente
  useEffect(() => {
    if (currentScreen === "intro") {
      setShowTrollButton(true) // Mostrar botón troll desde la intro
    }
  }, [currentScreen])

  // Ocultar botón troll en pantallas específicas
  useEffect(() => {
    if (currentScreen === "initial" || currentScreen === "welcome" || currentScreen === "final") {
      setShowTrollButton(false)
    } else if (currentScreen === "intro" || currentScreen === "riddles") {
      setShowTrollButton(true)
    }
  }, [currentScreen])

  const startMusic = () => {
    setMusicStarted(true)
    setCurrentScreen("welcome")
    // Start music
    if (audioRef.current) {
      audioRef.current.play().catch(console.error)
    }
  }

  const startIntro = () => {
    setCurrentScreen("intro")
  }

  const startRiddles = () => {
    setCurrentScreen("riddles")
  }

  const checkAnswer = () => {
    const currentRiddleData = riddles[currentRiddle]
    const normalizedAnswer = userAnswer.toLowerCase().trim()

    if (currentRiddleData.answers.includes(normalizedAnswer)) {
      setShowSuccess(true)
      setUserAnswer("")
      setShowError(false)

      setTimeout(() => {
        setShowContinueButton(true)
      }, 2000)
    } else {
      setShowError(true)
      setTimeout(() => setShowError(false), 2000)
    }
  }

  const continueToNext = () => {
    setShowSuccess(false)
    setShowContinueButton(false)

    if (currentRiddle === riddles.length - 1) {
      setCurrentScreen("final")
    } else {
      setCurrentRiddle(currentRiddle + 1)
    }
  }

  const goToHint = () => {
    setSavedRiddle(currentRiddle)
    setCurrentScreen("hint")
    // Posición inicial aleatoria para el botón travieso
    setTrollButtonPosition({
      x: Math.random() * 200 + 50,
      y: Math.random() * 200 + 50,
    })
  }
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const moveTrollButton = () => {
    // Mover el botón a una nueva posición aleatoria
    setTrollButtonPosition({
      x: Math.random() * 300 + 50,
      y: Math.random() * 300 + 50,
    })
  }

  const showHintAnswer = () => {
    // Mostrar la respuesta de la adivinanza guardada
    alert(`La respuesta es: ${riddles[savedRiddle].answers[0]}`)
  }

  const backToRiddle = () => {
    setCurrentRiddle(savedRiddle)
    setCurrentScreen("riddles")
  }

  const restartExperience = () => {
    setCurrentScreen("initial")
    setCurrentRiddle(0)
    setSavedRiddle(0)
    setUserAnswer("")
    setShowError(false)
    setShowSuccess(false)
    setShowContinueButton(false)
    setTypingText("")
    setShowWelcomeButton(false)
    setMusicStarted(false)
    setShowTrollButton(false)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !showSuccess) {
      checkAnswer()
    }
  }

  return (
    <div className="min-h-screen bg-[#007a3d] text-white overflow-x-hidden relative">
      <button
        onClick={() => {
          if (audioRef.current) {
            if (isMusicPlaying) {
              audioRef.current.pause();
            } else {
              audioRef.current.play();
            }
            setIsMusicPlaying(!isMusicPlaying);
          }
        }}
        className="fixed top-4 right-4 bg-[#ed6e93] hover:bg-[#d85d82] text-white text-xs md:text-sm font-bold py-2 px-3 rounded-full shadow-lg z-50 transition-all duration-300 transform hover:scale-105"
        style={{ fontFamily: "Impact, Arial Black, sans-serif" }}
      >
        {isMusicPlaying ? "🔇 Pausar" : "🔊 Sonar"}
      </button>


      {/* Audio - Usuario debe agregar el archivo manualmente */}
      <audio ref={audioRef} loop preload="auto" className="hidden">
        <source src="/music/StopCryingYourHeartOut.mp3" type="audio/mpeg" />
      </audio>

      {/* Botón troll flotante */}
      {showTrollButton && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={goToHint}
          className="fixed bottom-4 right-4 bg-[#ed6e93] hover:bg-[#d85d82] text-white text-xs md:text-sm font-bold py-2 px-3 rounded-full shadow-lg z-50 max-w-48 text-center transition-all duration-300 transform hover:scale-105"
          style={{ fontFamily: "Impact, Arial Black, sans-serif" }}
        >
          Si no sabés qué soy, tocame. (Si me tocás, perdés)
        </motion.button>
      )}

      <AnimatePresence mode="wait">
        {/* Pantalla inicial con Hello Kitty */}
        {currentScreen === "initial" && (
          <motion.div
            key="initial"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="min-h-screen flex flex-col items-center justify-center px-4"
          >
            {/* Hello Kitty saludando */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-8"
            >
              {/* Aquí va imagen de Hello Kitty saludando */}
              <img
                src="/images/Hello-Kitty.gif"
                alt="Hello Kitty saludando"

                className="w-48 h-48 md:w-64 md:h-64 object-contain mx-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = "none"
                  const parent = target.parentElement
                  if (parent) {
                    parent.innerHTML = `<div class="w-48 h-48 md:w-64 md:h-64 bg-white/10 rounded-2xl flex items-center justify-center border-2 border-dashed border-white/30 mx-auto">
                      <div class="text-center text-white/60 p-4">
                        <p class="text-sm">Hello Kitty saludando</p>
                        <p class="text-xs mt-2">hello-kitty-saludando.png</p>
                      </div>
                    </div>`
                  }
                }}
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black text-center mb-12 leading-tight text-[#fcfdfe]"
              style={{ fontFamily: "Impact, Arial Black, sans-serif" }}
            >
              HOLAAA! Tas lista?
            </motion.h1>

            {/* ✅ BLOQUE DE DOS BOTONES */}
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">

              {/* Botón troll */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.1 }}
                onClick={() => {
                  alert("Respuesta incorrecta 🫵😆");
                  window.location.reload();
                }}
                className="bg-[#ed6e93] hover:bg-[#d85d82] text-white font-bold py-6 px-12 rounded-full text-2xl md:text-3xl transition-all duration-300 transform hover:scale-105 shadow-xl"
                style={{ fontFamily: "Impact, Arial Black, sans-serif" }}
              >
                wtf no que es esto
              </motion.button>
              {/* Botón correcto */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                onClick={startMusic}
                className="bg-[#ed6e93] hover:bg-[#d85d82] text-white font-bold py-6 px-12 rounded-full text-2xl md:text-3xl transition-all duration-300 transform hover:scale-105 shadow-xl"
                style={{ fontFamily: "Impact, Arial Black, sans-serif" }}
              >
                Sí! q emozion
              </motion.button>
            </div>
          </motion.div>

        )}

        {/* Pantalla de bienvenida */}
        {currentScreen === "welcome" && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="min-h-screen flex flex-col items-center justify-center px-4"
          >
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-black text-center mb-8 leading-tight text-[#fcfdfe]"
              style={{ fontFamily: "Impact, Arial Black, sans-serif" }}
            >
              {typingText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
                className="inline-block w-1 h-12 md:h-16 lg:h-20 bg-white ml-2"
              />
            </motion.h1>

            {showWelcomeButton && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                onClick={startIntro}
                className="bg-[#ed6e93] hover:bg-[#d85d82] text-white font-bold py-4 px-8 rounded-full text-lg md:text-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Play className="inline-block mr-2 h-5 w-5" />
                Clickkkkkkk para empezar
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Pantalla de introducción */}
        {currentScreen === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="min-h-screen"
          >
            {/* Primera frase */}
            <section className="min-h-screen flex items-center justify-center px-4">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "-100px" }}
                className="text-2xl md:text-4xl lg:text-5xl font-black text-[#ed6e93] leading-tight text-center"
                style={{ fontFamily: "Impact, Arial Black, sans-serif" }}
              >
                {introTexts[0]}
              </motion.h2>
            </section>

            {/* Segunda frase */}
            <section className="min-h-screen flex items-center justify-center px-4">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "-100px" }}
                className="text-2xl md:text-4xl lg:text-5xl font-black text-[#ed6e93] leading-tight text-center"
                style={{ fontFamily: "Impact, Arial Black, sans-serif" }}
              >
                {introTexts[1]}
              </motion.h2>
            </section>

            {/* Tercera frase */}
            <section className="min-h-screen flex items-center justify-center px-4">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "-100px" }}
                className="text-2xl md:text-4xl lg:text-5xl font-black text-[#ed6e93] leading-tight text-center"
                style={{ fontFamily: "Impact, Arial Black, sans-serif" }}
              >
                {introTexts[2]}
              </motion.h2>
            </section>

            {/* Cuarta frase + botón */}
            <section className="min-h-screen flex flex-col items-center justify-center px-4 space-y-8">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "-100px" }}
                className="text-2xl md:text-4xl lg:text-5xl font-black text-[#ed6e93] leading-tight text-center"
                style={{ fontFamily: "Impact, Arial Black, sans-serif" }}
              >
                {introTexts[3]}
              </motion.h2>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true, margin: "-100px" }}
                onClick={startRiddles}
                className="bg-[#fcfdfe] text-[#007a3d] hover:bg-gray-100 font-bold py-4 px-8 rounded-full text-lg md:text-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <ArrowRight className="inline-block mr-2 h-5 w-5" />
                Empezar
              </motion.button>
            </section>

            {/* Indicador de scroll */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
              >
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="w-1 h-3 bg-white/50 rounded-full mt-2"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* Pantalla de adivinanzas */}
        {currentScreen === "riddles" && (
          <motion.div
            key="riddles"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
          >
            <div className="max-w-2xl mx-auto text-center space-y-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
                <span className="bg-[#ed6e93] text-white px-4 py-2 rounded-full text-sm font-bold">
                  {currentRiddle + 1} de {riddles.length}
                </span>
              </motion.div>

              <motion.h2
                key={currentRiddle}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-2xl md:text-3xl font-bold text-[#ed6e93] leading-tight mb-8"
                style={{ fontFamily: "Impact, Arial Black, sans-serif" }}
              >
                {riddles[currentRiddle].question}
              </motion.h2>

              {!showSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="space-y-4"
                >
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Escribí tu respuesta..."
                    className="w-full px-6 py-4 bg-[#fcfdfe] text-[#007a3d] rounded-full text-center text-lg font-semibold focus:outline-none focus:ring-4 focus:ring-[#ed6e93]/50 placeholder-[#007a3d]/60"
                  />

                  <button
                    onClick={checkAnswer}
                    disabled={!userAnswer.trim()}
                    className="bg-[#ed6e93] hover:bg-[#d85d82] disabled:bg-gray-500 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg"
                  >
                    Responder
                  </button>
                </motion.div>
              )}

              <AnimatePresence>
                {showError && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center justify-center space-x-2 text-red-400"
                  >
                    <X className="h-5 w-5" />
                    <span className="font-semibold">¡Mmm, no es esa! Intentá de nuevo</span>
                  </motion.div>
                )}

                {showSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-center space-x-2 text-green-400">
                      <Check className="h-5 w-5" />
                      <span className="font-semibold">¡Correcto!</span>
                    </div>

                    {/* Imágenes desbloqueadas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {riddles[currentRiddle].images.map((imagePath, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.2 }}
                          className="aspect-square bg-white/10 rounded-2xl overflow-hidden border-2 border-dashed border-white/30"
                        >
                          {/* Aquí va imagen */}
                          <img
                            src={`/images/${imagePath}`}
                            alt={`Recuerdo ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = "none"
                              const parent = target.parentElement
                              if (parent) {
                                parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-white/60 text-center p-4">
                                  <div>
                                    <p class="text-sm">Imagen:</p>
                                    <p class="font-semibold">${imagePath}</p>
                                    <p class="text-xs mt-2">Reemplazar con tu foto</p>
                                  </div>
                                </div>`
                              }
                            }}
                          />
                        </motion.div>
                      ))}
                    </div>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-xl md:text-2xl font-bold text-[#ed6e93] italic"
                      style={{ fontFamily: "Impact, Arial Black, sans-serif" }}
                    >
                      "{riddles[currentRiddle].phrase}"
                    </motion.p>

                    {showContinueButton && (
                      <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        onClick={continueToNext}
                        className="bg-[#fcfdfe] text-[#007a3d] hover:bg-gray-100 font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                        <ArrowRight className="inline-block mr-2 h-5 w-5" />
                        Seguir
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Página de pista */}
        {currentScreen === "hint" && (
          <motion.div
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative"
          >
            <div className="max-w-2xl mx-auto text-center space-y-8">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-6xl font-black text-[#ed6e93] mb-8"
                style={{ fontFamily: "Impact, Arial Black, sans-serif" }}
              >
                ¿Estás segura???
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-xl md:text-2xl text-[#fcfdfe] mb-8"
              >
                Mira que es fácil…
              </motion.p>

              {/* Botón travieso que se mueve */}
              <motion.div
                className="relative w-full h-96"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <motion.button
                  animate={{
                    x: trollButtonPosition.x,
                    y: trollButtonPosition.y,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  onMouseEnter={moveTrollButton}
                  onClick={showHintAnswer}
                  className="absolute bg-[#ed6e93] hover:bg-[#d85d82] text-white font-bold py-3 px-6 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                  style={{ fontFamily: "Impact, Arial Black, sans-serif" }}
                >
                  ¿Estas segura???
                </motion.button>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                onClick={backToRiddle}
                className="bg-[#fcfdfe] text-[#007a3d] hover:bg-gray-100 font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Volver a la pregunta
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Pantalla final */}
        {currentScreen === "final" && (
          <motion.div
            key="final"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
          >
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <motion.h1
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, type: "spring", bounce: 0.4 }}
                className="text-4xl md:text-6xl font-black text-[#ed6e93] mb-8"
                style={{ fontFamily: "Impact, Arial Black, sans-serif" }}
              >
                ¡Completaste todo!
              </motion.h1>

              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="mb-8"
              >
                <Heart className="h-16 w-16 md:h-20 md:w-20 text-[#ed6e93] fill-current mx-auto" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="bg-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm border border-[#ed6e93]/30"
              >
                <div className="text-left space-y-4 text-[#fcfdfe] leading-relaxed">
                  {finalLetter.split("\n\n").map((paragraph, index) => (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.3 }}
                      className="text-sm md:text-base"
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </div>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 2 }}
                onClick={restartExperience}
                className="bg-[#ed6e93] text-white hover:bg-[#d85d82] font-bold py-4 px-8 rounded-full text-lg md:text-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <RotateCcw className="inline-block mr-2 h-5 w-5" />
                Volver a empezar
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
