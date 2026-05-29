// ── Thai fake profiles ──
const thaiProfiles = [
  { name: "ภูมิ",   age: 26 },
  { name: "ธนา",   age: 28 },
  { name: "ก้อง",  age: 27 },
  { name: "ต้น",   age: 29 },
  { name: "โอ๊ต",  age: 25 },
  { name: "นัท",   age: 30 },
  { name: "ฟิล์ม", age: 27 },
  { name: "บอส",   age: 28 },
  { name: "แม็ค",  age: 26 },
  { name: "เจมส์", age: 31 },
  { name: "ป้อม",  age: 28 },
  { name: "ออฟ",   age: 27 },
];

const statusMessages = [
  "Analyzing personality matrix…",
  "Computing emotional wavelength…",
  "Filtering 99.1% of profiles…",
  "Cross-checking Love Language…",
  "Mapping core values…",
  "Down to the final 3 candidates…",
  "Running deep compatibility scan…",
  "Signal locked — verifying…",
];

// ── Screen navigation ──
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Tag helpers ──
function toggleTag(el) {
  el.classList.toggle('selected');
}

function solo(el, groupId) {
  document.querySelectorAll('#' + groupId + ' .tag').forEach(t => t.classList.remove('selected'));
  el.classList.add('selected');
}

// ── Screen 1 → 2 ──
function goTo2() {
  const name = document.getElementById('user-name').value.trim();
  if (!name) {
    alert('Please enter your name first 😊');
    return;
  }
  showScreen('screen-2');
}

// ── Build a single fake paper card ──
function makeFakeCard(profile) {
  const div = document.createElement('div');
  div.className = 'fp';

  // start off-screen above, will animate in
  div.style.cssText = `
    transform: translateX(-50%) translateY(-60px) rotate(0deg);
    opacity: 0;
    transition: none;
  `;

  div.innerHTML = `
    <div class="fp-name">${profile.name}</div>
    <div class="fp-age">${profile.age} years old</div>
    <div class="fp-line long"></div>
    <div class="fp-line med"></div>
    <div class="fp-line short"></div>
    <div class="fp-line long" style="margin-top:0.6rem"></div>
    <div class="fp-line med"></div>
  `;
  return div;
}

// ── Shuffle ──
let shuffleTimer = null;

function startShuffle() {
  showScreen('screen-shuffle');

  const stage = document.getElementById('shuffle-stage');
  stage.innerHTML = '';

  let count = 0;
  let profileIndex = 0;
  let statusIndex = 0;
  let speed = 480;
  const totalCards = 16;

  function nextCard() {
    const existingCards = stage.querySelectorAll('.fp');

    // Fly the top card sideways if there are already 3 stacked
    if (existingCards.length >= 3) {
      const top = existingCards[existingCards.length - 1];
      const dir = Math.random() > 0.5 ? 1 : -1;
      top.style.transition = 'transform 0.35s ease, opacity 0.3s';
      top.style.transform = `translateX(calc(-50% + ${dir * 380}px)) rotate(${dir * 22}deg) translateY(-40px)`;
      top.style.opacity = '0';
      setTimeout(() => top.remove(), 380);
    }

    // Add a new card
    const profile = thaiProfiles[profileIndex % thaiProfiles.length];
    const rot    = (Math.random() - 0.5) * 9;
    const xShift = (Math.random() - 0.5) * 18;
    const card   = makeFakeCard(profile);
    stage.appendChild(card);

    // Animate it in on next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        card.style.transition = 'transform 0.38s cubic-bezier(0.34,1.56,0.64,1), opacity 0.28s';
        card.style.transform  = `translateX(calc(-50% + ${xShift}px)) rotate(${rot}deg) translateY(0px)`;
        card.style.opacity    = '1';
      });
    });

    profileIndex++;
    count++;

    // Update status text
    if (statusIndex < statusMessages.length) {
      document.getElementById('shuffle-status').textContent = statusMessages[statusIndex++];
    }

    if (count >= totalCards) {
      clearTimeout(shuffleTimer);
      setTimeout(revealMatch, 1000);
      return;
    }

    // Speed curve: ramp up, then slow near the end for drama
    if (count < 7)       speed = Math.max(260, speed - 35);
    else if (count > 12) speed = Math.min(750, speed + 110);

    shuffleTimer = setTimeout(nextCard, speed);
  }

  nextCard();
}

// ── Reveal ──
function revealMatch() {
  const userName = document.getElementById('user-name').value.trim();
  const wantBio  = document.getElementById('want-bio').value.trim();

  const excerpt = wantBio
    ? `"${wantBio.slice(0, 70)}${wantBio.length > 70 ? '…' : '"'}`
    : '"someone special and genuine"';

  const reasons = [
    `${userName} described wanting ${excerpt} — Peem matched every single metric with a score we haven't seen in 3 years of data.`,
    `We scanned 5.1 million profiles and found exactly one person whose emotional signature aligns with ${userName}'s. His interest is perfectly match you.`,
    `${userName}'s compatibility with Peem scored 10000% — the highest recorded match this year. Some things are just written in the stars 🌹`,
  ];

  document.getElementById('algo-reason').textContent =
    reasons[Math.floor(Math.random() * reasons.length)];

  showScreen('screen-match');

  setTimeout(() => {
    document.getElementById('compat-fill').style.width = '100%';
  }, 500);

  setTimeout(spawnHearts, 900);
}

// ── Accept → go to date/countdown screen ──
function acceptMatch() {
  spawnHearts();
  setTimeout(() => {
    showScreen('screen-date');
    startCountdown();
  }, 1200);
}

// ── Countdown to August 10, 2026 ──
function startCountdown() {
  const target = new Date('2026-08-10T00:00:00+07:00'); // Thailand time

  function tick() {
    const now  = new Date();
    const diff = target - now;

    if (diff <= 0) {
      document.getElementById('cd-days').textContent  = '0';
      document.getElementById('cd-hours').textContent = '0';
      document.getElementById('cd-mins').textContent  = '0';
      document.getElementById('cd-secs').textContent  = '0';
      return;
    }

    const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs  = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('cd-days').textContent  = days;
    document.getElementById('cd-hours').textContent = String(hours).padStart(2,'0');
    document.getElementById('cd-mins').textContent  = String(mins).padStart(2,'0');
    document.getElementById('cd-secs').textContent  = String(secs).padStart(2,'0');
  }

  tick();
  setInterval(tick, 1000);
}

// ── Floating hearts ──
function spawnHearts() {
  const wrap   = document.getElementById('hearts');
  const emojis = ['❤️', '🌹', '💕', '💖', '🌸', '✨', '💝', '🌷'];

  for (let i = 0; i < 24; i++) {
    setTimeout(() => {
      const h = document.createElement('div');
      h.className   = 'heart';
      h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      h.style.left      = Math.random() * 100 + 'vw';
      h.style.fontSize  = (1.2 + Math.random() * 1.8) + 'rem';
      const dur         = 3.5 + Math.random() * 3;
      h.style.animation = `float-heart ${dur}s linear forwards`;
      wrap.appendChild(h);
      setTimeout(() => h.remove(), dur * 1000);
    }, i * 120);
  }
}
