import React, { useState, useEffect, useRef } from "react";
import "./index.css";

// 🔹 Question Pool
const QUESTION_POOL = {
  reading: [
    "The quick brown fox jumps over the lazy dog.",
    "Every morning begins with a new opportunity.",
    "Books open doors to knowledge and imagination.",
    "Technology helps us connect with the world.",
    "The river flows quietly through the valley.",
    "Success comes to those who work with patience.",
    "Learning is a treasure that follows its owner.",
    "Happiness grows when shared with others."
  ],
  repeat: [
    "Knowledge is power.",
    "Practice brings perfection.",
    "Dream big and stay humble.",
    "Time waits for no one.",
    "Courage leads to success.",
    "Effort always pays off.",
    "Patience is a virtue.",
    "Hard work never goes wasted."
  ],
  short: [
    "What is your favorite color?",
    "Where do you live?",
    "Name one of your hobbies.",
    "What is your favorite food?",
    "When do you wake up in the morning?",
    "Which sport do you enjoy watching?",
    "Who is your favorite teacher?",
    "What do you like about weekends?"
  ],
  sentence: [
    "Make a sentence using 'determination'.",
    "Use 'innovation' in a sentence.",
    "Build a sentence using 'confidence'.",
    "Create a sentence with 'dream'.",
    "Use 'knowledge' in a meaningful way.",
    "Make a sentence about 'success'.",
    "Frame a sentence using 'honesty'.",
    "Build one with the word 'teamwork'."
  ],
  story: [
    "Tell a story about a day you learned something new.",
    "Describe a time when you helped someone.",
    "Share a funny story from your school days.",
    "Retell a memory that made you proud.",
    "Narrate a short story about kindness.",
    "Tell a story about overcoming fear.",
    "Describe a time when you achieved a goal.",
    "Share a story about a small adventure."
  ],
  open: [
    "What inspires you the most in life?",
    "How do you handle difficult situations?",
    "What changes would make the world better?",
    "Describe your dream job.",
    "What motivates you to do your best?",
    "If you could travel anywhere, where would you go?",
    "What advice would you give to your younger self?",
    "How do you define success?"
  ]
};

const RESULT_MESSAGES = [
  { text: "🌟 Excellent", range: [85, 100] },
  { text: "👍 Very Good", range: [70, 84] },
  { text: "🙂 Good", range: [55, 69] },
  { text: "😐 Average", range: [40, 54] },
  { text: "💪 Needs Improvement", range: [0, 39] }
];

// 🔹 Speak Function
const speak = (text) => {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 1;
  utter.pitch = 1;
  window.speechSynthesis.speak(utter);
};

// 🔹 Random question picker
const pickRandom = (arr, count) => {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// 🔹 Generate a random test
const generateSections = () => [
  { id: "reading", title: "Reading", timer: 15, questions: pickRandom(QUESTION_POOL.reading, 4) },
  { id: "repeat", title: "Repeats", timer: 15, questions: pickRandom(QUESTION_POOL.repeat, 4) },
  { id: "short", title: "Short Answer", timer: 30, questions: pickRandom(QUESTION_POOL.short, 5) },
  { id: "sentence", title: "Sentence Builds", timer: 30, questions: pickRandom(QUESTION_POOL.sentence, 5) },
  { id: "story", title: "Story Retelling", timer: 45, questions: pickRandom(QUESTION_POOL.story, 4) },
  { id: "open", title: "Open Questions", timer: 45, questions: pickRandom(QUESTION_POOL.open, 4) }
];

export default function App() {
  const [sections, setSections] = useState(generateSections());
  const [sectionIndex, setSectionIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [recordings, setRecordings] = useState({});
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(sections[0].timer);
  const [finalResult, setFinalResult] = useState(null);
  const [scoreData, setScoreData] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  const currentSection = sections[sectionIndex];
  const currentQuestion = currentSection.questions[questionIndex];
  const key = `${currentSection.id}-${questionIndex}`;

  // ⏱ Timer
  useEffect(() => {
    if (finalResult) return;
    if (timer === 0) {
      handleNext();
      return;
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, finalResult]);

  useEffect(() => {
    setTimer(currentSection.timer);
  }, [sectionIndex, questionIndex]);

  // 🎧 Auto-play question for non-reading sections
  useEffect(() => {
    if (currentSection.id !== "reading") {
      setTimeout(() => speak(currentQuestion), 800);
    }
  }, [sectionIndex, questionIndex]);

  // 🎙 Recording logic
  const handleRecord = async () => {
    if (isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunks.current = [];
      mediaRecorder.ondataavailable = (e) => audioChunks.current.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setRecordings((r) => ({ ...r, [key]: url }));
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      alert("Microphone access required!");
    }
  };

  // 🧭 Navigation
  const handleNext = () => {
    if (questionIndex < currentSection.questions.length - 1) setQuestionIndex((q) => q + 1);
    else if (sectionIndex < sections.length - 1) {
      setSectionIndex((s) => s + 1);
      setQuestionIndex(0);
    } else {
      generateResult();
    }
  };

  const handlePrev = () => {
    if (questionIndex > 0) setQuestionIndex((q) => q - 1);
    else if (sectionIndex > 0) {
      setSectionIndex((s) => s - 1);
      setQuestionIndex(sections[sectionIndex - 1].questions.length - 1);
    }
  };

  const handleReplay = () => speak(currentQuestion);

  const handleRestart = () => {
    setSections(generateSections());
    setSectionIndex(0);
    setQuestionIndex(0);
    setRecordings({});
    setFinalResult(null);
    setScoreData(null);
    setTimer(sections[0].timer);
  };

  // 🧮 Generate result with per-section breakdown
  const generateResult = () => {
    const breakdown = sections.map((section) => {
      const totalQ = section.questions.length;
      const answered = Object.keys(recordings).filter((k) =>
        k.startsWith(section.id)
      ).length;
      const percent =
        answered === 0 ? 0 : Math.round((answered / totalQ) * (60 + Math.random() * 40));
      return { title: section.title, score: percent };
    });

    const overall =
      Math.round(breakdown.reduce((a, s) => a + s.score, 0) / breakdown.length);
    const feedback = RESULT_MESSAGES.find(
      (r) => overall >= r.range[0] && overall <= r.range[1]
    ).text;

    setScoreData(breakdown);
    setFinalResult({ overall, feedback });
  };

  const totalQuestions = sections.reduce((a, s) => a + s.questions.length, 0);
  const progress =
    ((sections.slice(0, sectionIndex).reduce((a, s) => a + s.questions.length, 0) +
      questionIndex) /
      totalQuestions) *
    100;

  // 🏁 Result screen
  if (finalResult)
    return (
      <div className="container">
        <div className="card result">
          <h1>🎯 Test Summary</h1>
          <table className="score-table">
            <thead>
              <tr>
                <th>Section</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {scoreData.map((s) => (
                <tr key={s.title}>
                  <td>{s.title}</td>
                  <td>{s.score}/100</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="final-score">{finalResult.overall}/100</div>
          <h2>{finalResult.feedback}</h2>
          <button onClick={handleRestart}>🔁 Restart with New Questions</button>
        </div>
      </div>
    );

  // 🧩 Test screen
  return (
    <div className="container">
      <div className="card">
        <h1>Verant Test Mock</h1>
        <h3>
          {currentSection.title} ({sectionIndex + 1}/{sections.length})
        </h3>

        {currentSection.id === "reading" ? (
          <p className="question">
            Q{questionIndex + 1}. {currentQuestion}
          </p>
        ) : (
          <div className="hidden-question">
            <p>🎧 Listen carefully to the question...</p>
            <button className="btn secondary" onClick={handleReplay}>
              🔁 Replay Question
            </button>
          </div>
        )}

        <div className="record-section">
          <button
            className={`record-btn ${isRecording ? "recording" : ""}`}
            onClick={handleRecord}
          >
            {isRecording ? "⏹ Stop Recording" : "🎙 Start Recording"}
          </button>
          {recordings[key] && <audio controls src={recordings[key]} />}
        </div>

        <div className="controls">
          <button onClick={handlePrev} disabled={sectionIndex === 0 && questionIndex === 0}>
            ← Prev
          </button>
          <button onClick={handleNext}>
            {sectionIndex === sections.length - 1 &&
            questionIndex === currentSection.questions.length - 1
              ? "Finish Test"
              : "Next →"}
          </button>
        </div>

        <div className="progress">
          <div className="bar" style={{ width: `${progress}%` }} />
        </div>

        <div className="timer">⏱ Time left: {timer}s</div>
      </div>
    </div>
  );
}
