// --- Word Banks ---
const words = {
    easy: [
        "the", "of", "to", "and", "a", "in", "is", "it", "you", "that", "he", "was", "for", "on", "are", "with", "as", "I", "his", "they", "be", "at", "one", "have", "this", "from", "or", "had", "by", "not", "word", "but", "what", "some", "we", "can", "out", "other", "were", "all", "there", "when", "up", "use", "your", "how", "said", "an", "each", "she", "which", "do", "their", "time", "if", "will", "way", "about", "many", "then", "them", "write", "would", "like", "so", "these", "her", "long", "make", "thing", "see", "him", "two", "has", "look", "more", "day", "could", "go", "come", "did", "number", "sound", "no", "most", "people", "my", "over", "know", "water", "than", "call", "first", "who", "may", "down", "side", "been", "now", "find"
    ],
    medium: [
        "account", "act", "addition", "adjustment", "advertisement", "agreement", "amount", "amusement", "animal", "answer", "apparatus", "approval", "argument", "art", "attack", "attempt", "attention", "attraction", "authority", "back", "balance", "base", "behavior", "belief", "birth", "bit", "bite", "blood", "blow", "body", "brass", "bread", "breath", "brother", "building", "burn", "burst", "business", "butter", "canvas", "care", "cause", "chalk", "chance", "change", "cloth", "coal", "color", "comfort", "committee", "company", "comparison", "competition", "condition", "connection", "control", "cook", "copper", "copy", "cork", "cotton", "cough", "country", "cover", "crack", "credit", "crime", "crush", "cry", "current", "curve", "damage", "danger", "daughter", "day", "death", "debt", "decision", "degree", "design", "desire", "destruction", "detail", "development", "digestion", "direction", "discovery", "discussion", "disease", "disgust", "distance", "distribution", "division", "doubt", "drink", "driving", "dust", "earth", "edge", "education", "effect"
    ],
    hard: [
        "aberration", "abnegation", "abstruse", "acumen", "adumbrate", "alacrity", "anachronism", "anomaly", "antediluvian", "apocryphal", "apotheosis", "ascetic", "assiduous", "blandishment", "cacophony", "calumny", "capricious", "castigate", "chicanery", "circumlocution", "cogent", "commensurate", "compendium", "concomitant", "conflagration", "conundrum", "corpulence", "cupidity", "dearth", "debacle", "deleterious", "demagogue", "denigrate", "desiccate", "diaphanous", "didactic", "dirge", "disparate", "dissemble", "ebullient", "eclectic", "edify", "effrontery", "egregious", "elegy", "elicit", "emollient", "empirical", "enervate", "ephemeral", "epistemology", "equanimity", "equivocate", "erudite", "esoteric", "evanescent", "exacerbate", "exculpate", "execrable", "exigent", "expedient", "extemporaneous", "extraneous", "facetious", "fallacious", "fastidious", "fatuous", "fawning", "felicitous", "fervent", "flout", "foment", "forestall", "fortuitous", "fractious", "fulminate", "garrulous", "grandiloquent", "gregarious", "hackneyed", "harangue", "hegemony", "heterogeneous", "hubris", "iconoclast", "idiosyncrasy", "ignominious", "impecunious", "imperious", "imperturbable", "impervious", "impetuous", "implacable", "importune", "inchoate", "incontrovertible", "indefatigable", "indigent", "inexorable"
    ]
};

// --- State Variables ---
let currentDifficulty = 'medium';
let initialTime = 60;
let timeLeft = 60;
let timer = null;
let isPlaying = false;
let isFinished = false;
let textToType = [];
let textCharacters = [];
let currentWordIndex = 0;
let currentCharIndex = 0;
let totalTypedChars = 0;
let errors = 0;
let soundEnabled = true;

// DOM Elements
const body = document.body;
const themeToggleBtn = document.getElementById('themeToggle');
const soundToggleBtn = document.getElementById('soundToggle');
const timeButtons = document.querySelectorAll('.time-options .option-btn');
const diffButtons = document.querySelectorAll('.difficulty-options .option-btn');
const textDisplay = document.getElementById('textDisplay');
const hiddenInput = document.getElementById('hiddenInput');
const typingBox = document.getElementById('typingBox');
const cursor = document.getElementById('cursor');
const startOverlay = document.getElementById('startOverlay');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const capsWarning = document.getElementById('capsWarning');

// Stats Elements
const timeLeftEl = document.getElementById('timeLeft');
const liveWpmEl = document.getElementById('liveWpm');
const liveCpmEl = document.getElementById('liveCpm');
const liveAccEl = document.getElementById('liveAcc');
const errorCountEl = document.getElementById('errorCount');
const progressBar = document.getElementById('progressBar');

// Modal Elements
const resultsModal = document.getElementById('resultsModal');
const resultWpm = document.getElementById('resultWpm');
const resultAcc = document.getElementById('resultAcc');
const resultCpm = document.getElementById('resultCpm');
const resultErrors = document.getElementById('resultErrors');
const resultMode = document.getElementById('resultMode');
const modalRestartBtn = document.getElementById('modalRestartBtn');

// Leaderboard Elements
const leaderboardList = document.getElementById('leaderboardList');

// Chatbot Elements
const chatbotToggleBtn = document.getElementById('chatbotToggleBtn');
const closeChatbotBtn = document.getElementById('closeChatbotBtn');
const chatbotWindow = document.getElementById('chatbotWindow');

// --- Audio Context ---
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playClickSound() {
    if (!soundEnabled) return;
    initAudio();
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    // Mechanical-ish click sound
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(150, audioCtx.currentTime); // Low freq click
    oscillator.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.03); // Quick pitch drop
    
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.03);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.03);
}

function playErrorSound() {
    if (!soundEnabled) return;
    initAudio();
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(200, audioCtx.currentTime); 
    
    gainNode.gain.setValueAtTime(0.4, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
}


// --- Initialization ---
function init() {
    loadSettings();
    updateLeaderboardDisplay();
    generateText();
    resetStats();
    
    // Event Listeners
    setupEventListeners();
}

function setupEventListeners() {
    // Theme Toggle
    themeToggleBtn.addEventListener('click', toggleTheme);
    
    // Sound Toggle
    soundToggleBtn.addEventListener('click', toggleSound);
    
    // Settings Buttons
    timeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (isPlaying) return;
            timeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            initialTime = parseInt(btn.dataset.time);
            resetTest();
        });
    });
    
    diffButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (isPlaying) return;
            diffButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentDifficulty = btn.dataset.diff;
            resetTest();
        });
    });
    
    // Typing Area Interactions
    typingBox.addEventListener('click', focusInput);
    startBtn.addEventListener('click', focusInput);
    
    // Hidden Input Handling
    hiddenInput.addEventListener('input', handleInput);
    hiddenInput.addEventListener('keydown', handleKeyDown);
    hiddenInput.addEventListener('focus', () => {
        typingBox.classList.add('focused');
        updateCursorPosition();
        if (!isPlaying && !isFinished && startOverlay.classList.contains('active') === false) {
            startTest();
        }
    });
    hiddenInput.addEventListener('blur', () => {
        typingBox.classList.remove('focused');
        typingBox.classList.remove('typing');
    });
    
    // Restarts
    restartBtn.addEventListener('click', resetTest);
    modalRestartBtn.addEventListener('click', resetTest);
    
    // Window resize (for cursor positioning)
    window.addEventListener('resize', updateCursorPosition);
    
    // Global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Tab + Enter to restart
        if (e.key === 'Tab') {
            e.preventDefault(); // Prevent default tab behavior (moving focus)
            resetTest();
        }
    });

    // Chatbot Toggle
    if (chatbotToggleBtn && chatbotWindow && closeChatbotBtn) {
        chatbotToggleBtn.addEventListener('click', () => {
            chatbotWindow.classList.toggle('active');
        });
        
        closeChatbotBtn.addEventListener('click', () => {
            chatbotWindow.classList.remove('active');
        });
    }
}

// --- Settings & UI Toggles ---
function toggleTheme() {
    body.classList.toggle('dark-theme');
    const isDark = body.classList.contains('dark-theme');
    localStorage.setItem('typing_theme', isDark ? 'dark' : 'light');
    
    const moon = themeToggleBtn.querySelector('.moon');
    const sun = themeToggleBtn.querySelector('.sun');
    
    if (isDark) {
        moon.style.display = 'block';
        sun.style.display = 'none';
    } else {
        moon.style.display = 'none';
        sun.style.display = 'block';
    }
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    soundToggleBtn.classList.toggle('active');
    localStorage.setItem('typing_sound', soundEnabled);
    
    const soundOn = soundToggleBtn.querySelector('.sound-on');
    const soundOff = soundToggleBtn.querySelector('.sound-off');
    
    if (soundEnabled) {
        soundOn.style.display = 'block';
        soundOff.style.display = 'none';
        initAudio(); // Initialize audio context on first user interaction if they turn it on
    } else {
        soundOn.style.display = 'none';
        soundOff.style.display = 'block';
    }
}

function loadSettings() {
    const savedTheme = localStorage.getItem('typing_theme');
    if (savedTheme === 'light') {
        toggleTheme(); // Default is dark, so toggle if light
    }
    
    const savedSound = localStorage.getItem('typing_sound');
    if (savedSound === 'false') {
        toggleSound(); // Default is true
    }
}

// --- Text Generation & Rendering ---
function getRandomWords(count, difficulty) {
    const bank = words[difficulty];
    const result = [];
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * bank.length);
        result.push(bank[randomIndex]);
    }
    return result;
}

function generateText() {
    // Generate about 100 words to ensure we don't run out during the test
    textToType = getRandomWords(100, currentDifficulty);
    textCharacters = [];
    
    textDisplay.innerHTML = '';
    
    textToType.forEach((word, wordIdx) => {
        const wordEl = document.createElement('div');
        wordEl.className = 'word';
        wordEl.dataset.index = wordIdx;
        
        // Add characters
        for (let i = 0; i < word.length; i++) {
            const charEl = document.createElement('span');
            charEl.className = 'char';
            charEl.textContent = word[i];
            charEl.dataset.wordIndex = wordIdx;
            charEl.dataset.charIndex = i;
            wordEl.appendChild(charEl);
            
            textCharacters.push({
                char: word[i],
                el: charEl,
                wordIndex: wordIdx,
                charIndex: i,
                isSpace: false
            });
        }
        
        textDisplay.appendChild(wordEl);
        
        // Add space character after word (except the last one)
        if (wordIdx < textToType.length - 1) {
            const spaceChar = {
                char: ' ',
                el: null, // No specific element for space, it's just conceptual boundary
                wordIndex: wordIdx,
                charIndex: word.length, // Index right after the last char of the word
                isSpace: true
            };
            textCharacters.push(spaceChar);
        }
    });
    
    updateCursorPosition();
}

// --- Typing Logic ---
function focusInput() {
    if (isFinished) return;
    startOverlay.classList.remove('active');
    hiddenInput.focus();
    updateCursorPosition();
}

function handleKeyDown(e) {
    if (isFinished) return;
    
    // Caps Lock Detection
    if (e.getModifierState && e.getModifierState('CapsLock')) {
        capsWarning.style.display = 'block';
    } else {
        capsWarning.style.display = 'none';
    }

    typingBox.classList.add('typing');
    
    // Clear the typing class after a short delay so the cursor blinks when inactive
    clearTimeout(window.typingTimeout);
    window.typingTimeout = setTimeout(() => {
        typingBox.classList.remove('typing');
    }, 500);

    // Handle Backspace manually
    if (e.key === 'Backspace') {
        e.preventDefault();
        
        if (currentCharIndex > 0) {
            currentCharIndex--;
            const charObj = textCharacters[currentCharIndex];
            
            if (!charObj.isSpace) {
                // If it was typed incorrectly, decrement total errors (if we want to track net errors)
                // However, usually typing tests track *total* errors made. Let's just remove the classes.
                if (charObj.el.classList.contains('incorrect')) {
                    // errors--; // Optional: uncomment if backspacing an error should "forgive" it in the final count
                }
                charObj.el.classList.remove('correct', 'incorrect');
                
                // Also remove error underline from word if no longer has incorrect chars
                const wordEl = document.querySelector(`.word[data-index="${charObj.wordIndex}"]`);
                if (wordEl) {
                    const hasError = Array.from(wordEl.querySelectorAll('.char')).some(c => c.classList.contains('incorrect'));
                    if (!hasError) wordEl.classList.remove('error-word');
                }
            } else {
                // Moving back across a space
                // We don't have a visible element for space to un-style
            }
            
            // Adjust input value to match internal state
            hiddenInput.value = hiddenInput.value.slice(0, -1);
            updateCursorPosition();
            playClickSound();
        }
    }
}

function handleInput(e) {
    if (isFinished || !isPlaying && currentCharIndex > 0) return;
    
    // Start test on first input if not started
    if (!isPlaying && currentCharIndex === 0) {
        startTest();
    }
    
    const inputValue = hiddenInput.value;
    const typedChar = inputValue[inputValue.length - 1]; // Last char typed
    
    // We only process if there's actually a char typed and we haven't reached the end
    if (typedChar && currentCharIndex < textCharacters.length) {
        const expectedCharObj = textCharacters[currentCharIndex];
        
        totalTypedChars++;
        
        if (expectedCharObj.isSpace) {
            // Expecting a space
            if (typedChar === ' ') {
                // Correct space
                currentCharIndex++;
                playClickSound();
            } else {
                // Typed a char when space was expected - count as error but we don't display it explicitly
                // Some testers mark the whole previous word wrong. Let's just block the input.
                hiddenInput.value = hiddenInput.value.slice(0, -1);
                errors++;
                playErrorSound();
            }
        } else {
            // Expecting a character
            if (typedChar === ' ') {
                 // Typed space early - block it or move to next word. Let's block it for simplicity.
                 hiddenInput.value = hiddenInput.value.slice(0, -1);
                 errors++;
                 playErrorSound();
            } else {
                // Typed a character
                if (typedChar === expectedCharObj.char) {
                    expectedCharObj.el.classList.add('correct');
                    playClickSound();
                } else {
                    expectedCharObj.el.classList.add('incorrect');
                    errors++;
                    
                    // Mark word as having error
                    const wordEl = document.querySelector(`.word[data-index="${expectedCharObj.wordIndex}"]`);
                    if (wordEl) wordEl.classList.add('error-word');
                    
                    playErrorSound();
                }
                currentCharIndex++;
            }
        }
        
        updateStatsUI();
        updateCursorPosition();
        
        // Auto-scroll text if cursor moves down
        autoScrollText();
        
        // Check if we reached the end of generated text
        if (currentCharIndex >= textCharacters.length - 1) {
            endTest(); // Should rarely happen with 100 words in 60s
        }
    }
}

function updateCursorPosition() {
    if (!typingBox.classList.contains('focused') || isFinished || currentCharIndex >= textCharacters.length) {
        cursor.style.opacity = '0';
        return;
    }
    
    cursor.style.opacity = '1';
    const charObj = textCharacters[currentCharIndex];
    
    if (charObj && !charObj.isSpace) {
        // Position at the start of the current char
        const rect = charObj.el.getBoundingClientRect();
        const containerRect = textDisplay.getBoundingClientRect();
        
        cursor.style.left = `${rect.left - containerRect.left}px`;
        cursor.style.top = `${rect.top - containerRect.top}px`;
        cursor.style.height = `${rect.height}px`;
    } else if (charObj && charObj.isSpace) {
        // Position after the last char of the previous word
        const prevCharObj = textCharacters[currentCharIndex - 1];
        if (prevCharObj && prevCharObj.el) {
            const rect = prevCharObj.el.getBoundingClientRect();
            const containerRect = textDisplay.getBoundingClientRect();
            
            cursor.style.left = `${rect.right - containerRect.left}px`;
            cursor.style.top = `${rect.top - containerRect.top}px`;
            cursor.style.height = `${rect.height}px`;
        }
    }
}

function autoScrollText() {
    if (currentCharIndex < textCharacters.length) {
        const charObj = textCharacters[currentCharIndex];
        if (charObj && charObj.el) {
            const charRect = charObj.el.getBoundingClientRect();
            const displayRect = textDisplay.getBoundingClientRect();
            
            // If character is moving out of the visible area
            if (charRect.bottom > displayRect.bottom) {
                // Scroll up by roughly two lines
                const scrollAmount = charRect.height * 2;
                // Since textDisplay is absolute, we adjust its top margin or translate
                const currentTransform = parseFloat(textDisplay.style.transform.replace('translateY(', '').replace('px)', '') || 0);
                textDisplay.style.transform = `translateY(${currentTransform - scrollAmount}px)`;
            }
        }
    }
}

// --- Test State Management ---
function startTest() {
    isPlaying = true;
    isFinished = false;
    startOverlay.classList.remove('active');
    
    // Initialize Audio context on first interaction if not already done
    initAudio();
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    
    timer = setInterval(updateTimer, 1000);
}

function resetTest() {
    clearInterval(timer);
    isPlaying = false;
    isFinished = false;
    
    resetStats();
    generateText();
    
    hiddenInput.value = '';
    hiddenInput.blur();
    
    startOverlay.classList.add('active');
    resultsModal.classList.remove('active');
    capsWarning.style.display = 'none';
    
    textDisplay.style.transform = 'translateY(0px)';
    
    // Reset cursor position to top left
    setTimeout(() => {
        cursor.style.left = '0px';
        cursor.style.top = '0px';
        cursor.style.opacity = '0';
    }, 50);
}

function resetStats() {
    timeLeft = initialTime;
    currentCharIndex = 0;
    totalTypedChars = 0;
    errors = 0;
    
    timeLeftEl.textContent = timeLeft;
    liveWpmEl.textContent = '0';
    liveCpmEl.textContent = '0';
    liveAccEl.textContent = '100%';
    errorCountEl.textContent = '0';
    progressBar.style.width = '100%';
}

function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timeLeftEl.textContent = timeLeft;
        
        const progressPercentage = (timeLeft / initialTime) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        
        updateStatsUI();
    } else {
        endTest();
    }
}

function updateStatsUI() {
    if (currentCharIndex === 0) return;
    
    const timeElapsed = initialTime - timeLeft;
    const timeElapsedMinutes = timeElapsed / 60;
    
    // Calculate Correct Characters
    let correctChars = 0;
    for (let i = 0; i < currentCharIndex; i++) {
        const charObj = textCharacters[i];
        if (!charObj.isSpace && charObj.el && charObj.el.classList.contains('correct')) {
            correctChars++;
        } else if (charObj.isSpace) {
            correctChars++; // Count space as correct character typed
        }
    }
    
    // WPM = (Correct Characters / 5) / Time in minutes
    // Standard defines a word as 5 characters
    const wpm = timeElapsedMinutes > 0 ? Math.round((correctChars / 5) / timeElapsedMinutes) : 0;
    
    // CPM = Correct Characters / Time in minutes
    const cpm = timeElapsedMinutes > 0 ? Math.round(correctChars / timeElapsedMinutes) : 0;
    
    // Accuracy
    const accuracy = totalTypedChars > 0 ? Math.round(((totalTypedChars - errors) / totalTypedChars) * 100) : 100;
    
    liveWpmEl.textContent = isNaN(wpm) || wpm < 0 ? 0 : wpm;
    liveCpmEl.textContent = isNaN(cpm) || cpm < 0 ? 0 : cpm;
    liveAccEl.textContent = `${Math.max(0, accuracy)}%`;
    errorCountEl.textContent = errors;
}

function endTest() {
    clearInterval(timer);
    isPlaying = false;
    isFinished = true;
    hiddenInput.blur();
    cursor.style.opacity = '0';
    
    const finalWpm = parseInt(liveWpmEl.textContent);
    const finalAcc = parseInt(liveAccEl.textContent);
    const finalCpm = parseInt(liveCpmEl.textContent);
    
    // Populate Modal
    resultWpm.textContent = finalWpm;
    resultAcc.textContent = `${finalAcc}%`;
    resultCpm.textContent = finalCpm;
    resultErrors.textContent = errors;
    
    const diffText = currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1);
    resultMode.textContent = `${initialTime}s • ${diffText}`;
    
    // Show Modal
    resultsModal.classList.add('active');
    
    // Save Score
    if (finalWpm > 0) {
        saveScore(finalWpm, finalAcc, initialTime, currentDifficulty);
    }
}

// --- Leaderboard ---
function saveScore(wpm, acc, time, diff) {
    const score = {
        wpm,
        acc,
        time,
        diff,
        date: new Date().toISOString()
    };
    
    let leaderboard = JSON.parse(localStorage.getItem('typing_leaderboard')) || [];
    leaderboard.push(score);
    
    // Sort by WPM descending
    leaderboard.sort((a, b) => b.wpm - a.wpm);
    
    // Keep top 5
    leaderboard = leaderboard.slice(0, 5);
    
    localStorage.setItem('typing_leaderboard', JSON.stringify(leaderboard));
    updateLeaderboardDisplay();
}

function updateLeaderboardDisplay() {
    const leaderboard = JSON.parse(localStorage.getItem('typing_leaderboard')) || [];
    
    if (leaderboard.length === 0) {
        leaderboardList.innerHTML = '<li class="empty-msg">No scores yet. Complete a test!</li>';
        return;
    }
    
    leaderboardList.innerHTML = '';
    leaderboard.forEach((score, index) => {
        const dateObj = new Date(score.date);
        const dateStr = `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
        
        const li = document.createElement('li');
        li.innerHTML = `
            <span>
                <span style="color: var(--text-secondary); margin-right: 10px;">#${index + 1}</span>
                <span class="lb-score">${score.wpm} WPM</span> 
                <span style="margin: 0 5px;">•</span> 
                <span class="lb-acc">${score.acc}% acc</span>
            </span>
            <span class="lb-time">${score.time}s | ${dateStr}</span>
        `;
        leaderboardList.appendChild(li);
    });
}

// Start application
window.onload = init;
