/**
 * UJJAIN WAYFINDING — UX CASE STUDY JAVASCRIPT
 * Interactive controls, journey switcher, lightbox, and reading progress
 */

document.addEventListener('DOMContentLoaded', () => {
  initProgressBar();
  initNavObserver();
  initMobileMenu();
  initSkimMode();
  initFieldworkTabs();
  initJourneyStepper();
  initLightbox();
  initAffinityExplorer();
});

/* ---------------------------------------------------------
   1. Reading Progress Bar
--------------------------------------------------------- */
function initProgressBar() {
  const progressBar = document.getElementById('scrollProgressBar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (window.scrollY / totalHeight) * 100;
      progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }
  }, { passive: true });
}

/* ---------------------------------------------------------
   2. Active Nav Link Intersection Observer
--------------------------------------------------------- */
function initNavObserver() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-item a');
  
  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* ---------------------------------------------------------
   3. Mobile Drawer
--------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('menuToggle');
  const drawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-item a');

  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      drawer.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    } else {
      drawer.classList.add('open');
      toggleBtn.setAttribute('aria-expanded', 'true');
    }
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------------------------------------------------------
   4. 40-Second Skim Mode
--------------------------------------------------------- */
function initSkimMode() {
  const skimToggle = document.getElementById('skimToggle');
  if (!skimToggle) return;

  skimToggle.addEventListener('click', () => {
    const isSkim = document.body.classList.toggle('skim-mode');
    skimToggle.classList.toggle('active', isSkim);
    skimToggle.innerHTML = isSkim 
      ? '<span>●</span> Full Read' 
      : '<span>○</span> 40s Skim Mode';
  });
}

/* ---------------------------------------------------------
   5. Fieldwork Day 01 vs Day 02 Tabs
--------------------------------------------------------- */
function initFieldworkTabs() {
  const tabs = document.querySelectorAll('.fieldwork-tabs .tab-btn');
  const panes = document.querySelectorAll('.fieldwork-pane');

  if (!tabs.length || !panes.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetDay = tab.getAttribute('data-tab');

      tabs.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPane = document.getElementById(`pane-${targetDay}`);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });
}

/* ---------------------------------------------------------
   6. 6-Stage User Journey Interactive Stepper
--------------------------------------------------------- */
const journeyStagesData = [
  {
    index: "01",
    phase: "Pre-Visit Planning",
    emotion: "Calm → Unsure",
    emotionClass: "confused",
    actions: "Plans temple visit; checks Google Maps or asks friends & relatives about darshan slots and timings.",
    thoughts: "“Which route should I take? Will I reach on time for Bhasma Aarti?”",
    touchpoints: "Google Maps, WhatsApp groups, Family/Friends verbal advice",
    painPoints: "No reliable official navigation info; online articles provide conflicting details on vehicle restrictions."
  },
  {
    index: "02",
    phase: "Arrival & Local Travel",
    emotion: "Confused → Anxious",
    emotionClass: "anxious",
    actions: "Arrives at Dewas Gate bus stand / Ujjain railway station; confronts aggressive auto-rickshaw drivers and chaotic intersections.",
    thoughts: "“Is this the right vehicle? Why are online cabs unavailable here? Are they overcharging me?”",
    touchpoints: "Auto drivers, E-rickshaws, Police barricades, Road traffic",
    painPoints: "Aggressive bargaining, arbitrary drop-offs far from gates due to police restrictions, sudden road closures."
  },
  {
    index: "03",
    phase: "Finding Entry & Facilities",
    emotion: "Overwhelmed",
    emotionClass: "anxious",
    actions: "Walks narrow market gullies towards temple; searches for correct entry gate (Gate 1 vs Gate 4) and shoe deposit stalls.",
    thoughts: "“Which gate should I enter? Where do I safely deposit my footwear so I don't lose it?”",
    touchpoints: "Shopkeepers, Overhead wires, Faded signboards, Guards",
    painPoints: "Shopkeepers give misleading advice to force purchases; small illegible signboards; fear of shoe loss."
  },
  {
    index: "04",
    phase: "Queue Navigation & Darshan",
    emotion: "Frustrated → Anxious",
    emotionClass: "frustrated",
    actions: "Enters queue barricades; moves through zigzag holding corridors; encounters queue merging between general and VIP lines.",
    thoughts: "“Am I in the right line? How much longer? Why is this line merging with another queue?”",
    touchpoints: "Barricades, Volunteers, Security guards, Overhead fans",
    painPoints: "Queue mixing sparks agitation; inconsistent verbal instructions from guards; zero distance/time indicators."
  },
  {
    index: "05",
    phase: "Exit & Belongings Retrieval",
    emotion: "Irritated → Tired",
    emotionClass: "frustrated",
    actions: "Exits sanctum after darshan; tries to find the original shoe counter; discovers exit opens into a completely different street.",
    thoughts: "“Where is the shoe stand from here? Why did they let us out on the opposite side of the complex?”",
    touchpoints: "Exit signboards, Security staff, Prasad counters",
    painPoints: "Entry-exit mismatch forces long barefoot walking on hot or dirty pavement; missing exit orientation signs."
  },
  {
    index: "06",
    phase: "Leaving Temple Area",
    emotion: "Exhausted → Relieved",
    emotionClass: "confused",
    actions: "Attempts to hail transport back to bus station; negotiates through congested choke points and narrow market streets.",
    thoughts: "“Where can I get an auto without walking another kilometer? How do I get back easily?”",
    touchpoints: "Auto drivers, Crowded market streets, Outer barricades",
    painPoints: "No designated pickup bays; gridlocked traffic around temple exits; physical fatigue from unguided backtracking."
  }
];

function initJourneyStepper() {
  const stepButtons = document.querySelectorAll('.step-nav-btn');
  const stageDisplay = document.getElementById('journeyStageDisplay');

  if (!stepButtons.length || !stageDisplay) return;

  stepButtons.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      stepButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderJourneyStage(idx);
    });
  });

  // Render initial stage
  renderJourneyStage(0);
}

function renderJourneyStage(index) {
  const data = journeyStagesData[index];
  const container = document.getElementById('journeyStageDisplay');
  if (!container || !data) return;

  container.innerHTML = `
    <div class="stage-top-meta">
      <div class="stage-name-block">
        <span class="section-eyebrow">Phase ${data.index} of 06</span>
        <h3>${data.phase}</h3>
      </div>
      <div class="stage-emotion-badge ${data.emotionClass}">
        <span>Emotional Curve:</span>
        <strong>${data.emotion}</strong>
      </div>
    </div>

    <div class="stage-matrix-grid">
      <div class="stage-col">
        <h4>User Actions</h4>
        <p>${data.actions}</p>
      </div>

      <div class="stage-col">
        <h4>Internal Dialogue</h4>
        <p style="font-style: italic; color: var(--text-primary); font-weight: 500;">
          ${data.thoughts}
        </p>
      </div>

      <div class="stage-col">
        <h4>System Touchpoints</h4>
        <p>${data.touchpoints}</p>
      </div>

      <div class="stage-col">
        <h4>Acute Pain Points</h4>
        <div class="pain-point-box">
          <p>${data.painPoints}</p>
        </div>
      </div>
    </div>
  `;
}

/* ---------------------------------------------------------
   7. Image Lightbox Modal
--------------------------------------------------------- */
function initLightbox() {
  const modal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('lightboxImg');
  const modalCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  const zoomables = document.querySelectorAll('[data-zoomable]');

  if (!modal || !modalImg || !closeBtn) return;

  zoomables.forEach(item => {
    item.addEventListener('click', () => {
      const src = item.getAttribute('src') || item.getAttribute('data-src');
      const caption = item.getAttribute('data-caption') || item.getAttribute('alt') || '';
      
      modalImg.src = src;
      modalCaption.textContent = caption;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('lightbox-content-wrap')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ---------------------------------------------------------
   8. Affinity Cluster Explorer
--------------------------------------------------------- */
function initAffinityExplorer() {
  const pills = document.querySelectorAll('.cluster-pill');
  const detailBox = document.getElementById('clusterDetailBox');

  const clusterData = {
    c1: "Cluster 1: Navigation Confusion & Signage Gaps — Devotees get lost because gates lack prominent markers; signs use mixed languages or are blocked by overhead power cables.",
    c2: "Cluster 2: Transportation & Mobility Constraints — Unregulated auto-rickshaw drop-offs, missing parking zones, and frequent unannounced road diversions.",
    c3: "Cluster 3: Temple Entry, Exit & Queue Flow — VIP and general lines merge abruptly, causing disputes; disconnected exit leads to lost footwear.",
    c4: "Cluster 4: Infrastructure & Environmental Conditions — Narrow winding streets, lack of shaded resting areas, and potholes hinder pedestrian flow.",
    c5: "Cluster 5: Suggestions & Improvement Ideas — Devotees explicitly requested color-coded paths, bilingual signs, and printed pocket guides.",
    c6: "Cluster 6: Communication & Language Barriers — Non-Hindi speakers struggle to decipher regional signboards; staff and guards lack standardized guidance phrases.",
    c7: "Cluster 7: Visitor Experience & Emotional Journey — Anxiety spikes before reaching temple; time stress for Bhasma Aarti creates emotional exhaustion.",
    c8: "Cluster 8: Security & Volunteer Challenges — Guards experience severe fatigue from continuously repeating verbal directions instead of relying on signage.",
    c9: "Cluster 9: Technology & Digital Wayfinding — Inaccurate GPS in dense alleys and zero mobile network inside stone temple structures.",
    c10: "Cluster 10: Accessibility & Inclusivity — Elderly devotees face unexpected long walking distances with no ramp indicators or distance markers."
  };

  if (!pills.length || !detailBox) return;

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('highlight'));
      pill.classList.add('highlight');
      const clusterKey = pill.getAttribute('data-cluster');
      if (clusterData[clusterKey]) {
        detailBox.textContent = clusterData[clusterKey];
        detailBox.style.display = 'block';
      }
    });
  });
}
