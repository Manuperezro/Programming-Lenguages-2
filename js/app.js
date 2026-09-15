/**
 * Programming Missions Lab
 * Core Controller Engine & UI Renderer (Gateway Level 2)
 */

(function () {
  const DATA = window.LAB_DATA;
  const AUDIO = window.LAB_AUDIO;

  // Application State
  const state = {
    currentMission: 1, // 1 to 8
    score: 0,
    completedMissions: new Set(),
    awardedScores: new Set(),
    
    // Mission 3 Robot State
    robotSequence: [...(DATA.mission3?.defaultSequence || [])],
    
    // Mission 6 Scratch State
    scratchSequence: [...(DATA.mission6?.scratchBlocks?.map(b => b.text) || [])]
  };

  const dom = {};

  document.addEventListener('DOMContentLoaded', () => {
    initDomCache();
    bindEvents();
    renderNavigation();
    renderCurrentMission();
    updateHeaderStats();
  });

  function initDomCache() {
    dom.scoreDisplay = document.getElementById('stat-score');
    dom.missionPill = document.getElementById('stat-mission');
    dom.progressBar = document.getElementById('progress-fill');
    dom.stepperNav = document.getElementById('stepper-nav');
    dom.muteBtn = document.getElementById('mute-btn');
    dom.resetBtn = document.getElementById('reset-btn');
    dom.resultsModal = document.getElementById('results-modal');

    dom.missions = {};
    for (let i = 1; i <= 8; i++) {
      dom.missions[i] = document.getElementById(`mission-${i}`);
    }
  }

  function bindEvents() {
    dom.muteBtn?.addEventListener('click', () => {
      const isMuted = AUDIO.toggleMute();
      dom.muteBtn.innerHTML = isMuted ? '🔇' : '🔊';
    });

    dom.resetBtn?.addEventListener('click', () => {
      if (confirm("Reset lab progress and restart from Mission 1?")) {
        restartLab();
      }
    });
  }

  function updateHeaderStats() {
    if (dom.scoreDisplay) dom.scoreDisplay.textContent = `${state.score} XP`;
    if (dom.missionPill) {
      dom.missionPill.textContent = `Mission ${state.currentMission} / 8`;
    }

    const progressPct = Math.round((state.completedMissions.size / 8) * 100);
    if (dom.progressBar) dom.progressBar.style.width = `${progressPct}%`;

    const buttons = dom.stepperNav?.querySelectorAll('.stepper-btn');
    buttons?.forEach((btn, idx) => {
      const mNum = idx + 1;
      btn.classList.toggle('is-active', mNum === state.currentMission);
      btn.classList.toggle('is-completed', state.completedMissions.has(mNum));
    });
  }

  function renderNavigation() {
    if (!dom.stepperNav) return;
    dom.stepperNav.innerHTML = '';

    for (let i = 1; i <= 8; i++) {
      const btn = document.createElement('button');
      btn.className = `stepper-btn ${i === state.currentMission ? 'is-active' : ''} ${state.completedMissions.has(i) ? 'is-completed' : ''}`;
      btn.innerHTML = `M${i}`;
      btn.addEventListener('click', () => {
        AUDIO.playClick();
        state.currentMission = i;
        renderCurrentMission();
        updateHeaderStats();
      });
      dom.stepperNav.appendChild(btn);
    }
  }

  function renderCurrentMission() {
    Object.values(dom.missions).forEach(m => m?.classList.remove('is-active'));
    const activeContainer = dom.missions[state.currentMission];
    if (activeContainer) {
      activeContainer.classList.add('is-active');
    }

    switch (state.currentMission) {
      case 1: renderMission1(); break;
      case 2: renderMission2(); break;
      case 3: renderMission3(); break;
      case 4: renderMission4(); break;
      case 5: renderMission5(); break;
      case 6: renderMission6(); break;
      case 7: renderMission7(); break;
      case 8: renderMission8(); break;
    }
  }

  function advanceMission(fromM, toM) {
    state.completedMissions.add(fromM);
    state.currentMission = toM;
    renderNavigation();
    renderCurrentMission();
    updateHeaderStats();
  }

  function addCategoryScore(category, pts, uniqueKey) {
    if (uniqueKey) {
      if (state.awardedScores.has(uniqueKey)) return;
      state.awardedScores.add(uniqueKey);
    }
    state.score += pts;
    updateHeaderStats();
  }

  // =========================================================================
  // MISSION 1: PROGRAMMING LANGUAGE DETECTIVE
  // =========================================================================
  function renderMission1() {
    const data = DATA.mission1;
    const container = dom.missions[1];
    if (!container) return;

    container.innerHTML = `
      <div class="mission-header">
        <div class="mission-title-group">
          <span style="font-size:1.6rem;">🔍</span>
          <h2 class="mission-title">${data.title}</h2>
        </div>
        <p class="mission-subtitle">${data.subtitle}</p>
      </div>

      <!-- Intro Explanation -->
      <div class="concept-banner" style="background:rgba(15,23,42,0.8); border:1px solid var(--accent-blue); padding:1.25rem; border-radius:var(--radius-md); margin-bottom:1.5rem;">
        <p style="font-size:1.05rem; font-weight:700; color:var(--text-main); margin-bottom:0.3rem;">💡 "${data.intro}"</p>
        <p style="font-size:0.95rem; color:var(--text-muted);">${data.subintro}</p>
      </div>

      <!-- Language Explorer Cards Grid -->
      <h3 style="font-size:1.1rem; font-weight:800; margin-bottom:0.75rem;">1. Language Explorer Cards</h3>
      <p style="font-size:0.88rem; color:var(--text-muted); margin-bottom:1rem;">Click any language card below to inspect its style and common uses!</p>

      <div class="lang-cards-grid">
        ${data.languages.map(l => `
          <div class="lang-explorer-card" data-id="${l.id}">
            <div class="lang-card-icon">${l.icon}</div>
            <div class="lang-card-name" style="color:${l.color};">${l.name}</div>
          </div>
        `).join('')}
      </div>

      <div id="m1-detail-panel" class="lang-detail-panel" style="display:none; margin-top:1.25rem;"></div>

      <!-- Expandable More Languages Section -->
      <div style="margin-top:1.25rem;">
        <button class="btn btn-secondary" id="m1-toggle-more-btn" style="font-size:0.85rem; padding:0.4rem 0.85rem;">
          ➕ Show More Languages (Visual Basic & Perl)
        </button>
        <div id="m1-more-languages" style="display:none; margin-top:0.75rem; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:1rem;" class="containers-grid">
          ${data.moreLanguages.map(m => `
            <div style="background:rgba(30,41,59,0.5); border:1px solid var(--border-color); padding:0.85rem; border-radius:var(--radius-md); font-size:0.9rem;">
              <strong>${m.icon} ${m.name}:</strong> ${m.note}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Same Job Different Syntax Section -->
      <div style="margin-top:2rem; border-top:1px solid var(--border-color); padding-top:1.5rem;">
        <h3 style="font-size:1.15rem; font-weight:800; color:var(--accent-yellow); margin-bottom:0.4rem;">${data.syntaxComparison.title}</h3>
        <p style="font-size:0.95rem; color:var(--text-muted); margin-bottom:0.75rem;">TASK: <strong>${data.syntaxComparison.task}</strong></p>

        <div style="background:var(--bg-editor); border:1px solid var(--border-color); padding:1.25rem; border-radius:var(--radius-md); margin-bottom:1rem;">
          <p style="font-weight:700; color:var(--accent-green); margin-bottom:0.75rem;">💡 ${data.syntaxComparison.definition}</p>
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:0.75rem;">
            ${data.syntaxComparison.examples.map(ex => `
              <div style="background:rgba(15,23,42,0.8); border:1px solid ${ex.accent}50; padding:0.85rem; border-radius:var(--radius-md);">
                <div style="font-size:0.75rem; font-weight:800; color:${ex.accent}; margin-bottom:0.25rem;">${ex.lang}</div>
                <code style="font-family:var(--font-code); font-size:0.95rem; color:var(--text-main);">${escapeHtml(ex.code)}</code>
              </div>
            `).join('')}
          </div>
          <p style="font-size:0.85rem; color:var(--text-muted); margin-top:0.75rem; font-style:italic;">Notice keywords like <code>print</code>, <code>System.out.println</code>, <code>cout</code>, <code>echo</code>, and <code>say</code> — all performing the SAME job!</p>
        </div>
      </div>

      <!-- Mini Challenge -->
      <div style="margin-top:1.5rem; border-top:1px solid var(--border-color); padding-top:1.25rem;">
        <h3 style="font-size:1.05rem; font-weight:800; margin-bottom:0.4rem;">2. Mini Challenge: Identify the Language!</h3>
        <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:1rem;">${data.miniChallenge.instruction}</p>

        <div style="display:flex; flex-direction:column; gap:1rem;" id="m1-challenge-list">
          ${data.miniChallenge.items.map((item, idx) => `
            <div style="background:rgba(30,41,59,0.5); border:1px solid var(--border-color); padding:1rem; border-radius:var(--radius-md);" class="m1-item-box" data-idx="${idx}">
              <div style="font-family:var(--font-code); font-size:1.05rem; font-weight:700; color:var(--accent-yellow); margin-bottom:0.75rem;">
                <code>${escapeHtml(item.code)}</code>
              </div>
              <div class="options-grid" style="grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap:0.5rem;">
                ${item.options.map(opt => `
                  <div class="option-card m1-opt-btn" data-opt="${opt}" style="padding:0.5rem 0.75rem; font-size:0.85rem; justify-content:center;">
                    <span>${opt}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div id="m1-feedback" style="margin-top:1.25rem;"></div>

      <div class="action-row">
        <button class="btn btn-primary" id="m1-submit-btn">Check Language Mini Challenge</button>
      </div>
    `;

    // Language explorer detail panel click
    const detailPanel = document.getElementById('m1-detail-panel');
    container.querySelectorAll('.lang-explorer-card').forEach(card => {
      card.addEventListener('click', () => {
        AUDIO.playClick();
        container.querySelectorAll('.lang-explorer-card').forEach(c => c.classList.remove('is-active'));
        card.classList.add('is-active');

        const langObj = data.languages.find(l => l.id === card.dataset.id);
        if (langObj) {
          detailPanel.style.display = 'block';
          detailPanel.innerHTML = `
            <h3 style="color:${langObj.color}; font-size:1.2rem; font-weight:800; margin-bottom:0.4rem;">
              ${langObj.icon} ${langObj.name}
            </h3>
            <p style="font-size:0.95rem; margin-bottom:0.5rem;"><strong>Syntax Style:</strong> ${langObj.syntaxStyle}</p>
            <p style="font-size:0.9rem; margin-bottom:0.5rem;"><strong>Common Uses:</strong></p>
            <ul style="padding-left:1.25rem; font-size:0.88rem; color:var(--text-muted); margin-bottom:0.75rem;">
              ${langObj.uses.map(u => `<li>${u}</li>`).join('')}
            </ul>
            <div class="code-box"><code>${escapeHtml(langObj.example)}</code></div>
          `;
        }
      });
    });

    // Toggle more languages
    const moreBtn = document.getElementById('m1-toggle-more-btn');
    const moreContainer = document.getElementById('m1-more-languages');
    moreBtn?.addEventListener('click', () => {
      AUDIO.playClick();
      const isHidden = moreContainer.style.display === 'none';
      moreContainer.style.display = isHidden ? 'grid' : 'none';
      moreBtn.textContent = isHidden ? '➖ Hide Extra Languages' : '➕ Show More Languages (Visual Basic & Perl)';
    });

    // Mini challenge answer selection
    const selections = {};
    container.querySelectorAll('.m1-item-box').forEach(box => {
      const itemIdx = box.dataset.idx;
      box.querySelectorAll('.m1-opt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          AUDIO.playClick();
          box.querySelectorAll('.m1-opt-btn').forEach(b => {
            b.classList.remove('is-selected');
            b.classList.remove('is-wrong');
          });
          btn.classList.add('is-selected');
          selections[itemIdx] = btn.dataset.opt;
        });
      });
    });

    // Validate mini challenge
    document.getElementById('m1-submit-btn')?.addEventListener('click', () => {
      if (Object.keys(selections).length < data.miniChallenge.items.length) {
        alert("Please select a language for all 5 snippets first!");
        return;
      }

      let correctCount = 0;
      data.miniChallenge.items.forEach((item, idx) => {
        if (selections[idx] === item.correct) {
          correctCount++;
        } else {
          const box = container.querySelector(`.m1-item-box[data-idx="${idx}"]`);
          const wrongBtn = box?.querySelector(`[data-opt="${selections[idx]}"]`);
          wrongBtn?.classList.add('is-wrong');
        }
      });

      const feedback = document.getElementById('m1-feedback');
      if (correctCount === data.miniChallenge.items.length) {
        AUDIO.playSuccess();
        addCategoryScore("languages", 50, "m1");

        feedback.innerHTML = `
          <div class="feedback-box is-correct">
            <span class="feedback-icon">✓</span>
            <div class="feedback-content">
              <h4>✓ Correct! All 5 Languages Identified! (+50 XP)</h4>
              <p>Great job recognizing different syntax patterns across Python, PHP, Java, C++, and Scratch!</p>
            </div>
          </div>
        `;

        document.getElementById('m1-submit-btn').style.display = 'none';
        const nextBtn = document.createElement('button');
        nextBtn.className = 'btn btn-success';
        nextBtn.innerHTML = 'Next: Mission 2 →';
        nextBtn.addEventListener('click', () => advanceMission(1, 2));
        container.querySelector('.action-row').appendChild(nextBtn);
      } else {
        AUDIO.playError();
        feedback.innerHTML = `
          <div class="feedback-box is-wrong">
            <span class="feedback-icon">✗</span>
            <div class="feedback-content">
              <h4>✗ Identified ${correctCount} / ${data.miniChallenge.items.length} correctly</h4>
              <p>Look closely at keywords (e.g. <code>echo</code> for PHP, <code>cout</code> for C++). Select another answer for misplaced snippets and try again!</p>
            </div>
          </div>
        `;
      }
    });
  }

  // =========================================================================
  // MISSION 2: REAL PROGRAM – TICKET MACHINE
  // =========================================================================
  function renderMission2() {
    const data = DATA.mission2;
    const container = dom.missions[2];
    if (!container) return;

    container.innerHTML = `
      <div class="mission-header">
        <div class="mission-title-group">
          <span style="font-size:1.6rem;">🎟️</span>
          <h2 class="mission-title">${data.title}</h2>
        </div>
        <p class="mission-subtitle">${data.subtitle}</p>
      </div>

      <div style="background:rgba(15,23,42,0.6); border:1px solid var(--border-color); padding:1rem; border-radius:var(--radius-md); margin-bottom:1.25rem;">
        <p style="font-size:0.95rem; font-weight:700; color:var(--text-main); margin-bottom:0.2rem;">🍿 Scenario: "${data.scenario}"</p>
        <p style="font-size:0.88rem; color:var(--text-muted);">Press ▶ RUN PROGRAM to see Python code execute line-by-line in logical sequence!</p>
      </div>

      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1.5rem;" class="side-by-side-grid">
        
        <!-- Ticket Machine GUI Screen (Left) -->
        <div style="background:rgba(15,23,42,0.9); border:2px solid var(--accent-blue); border-radius:var(--radius-md); padding:1.25rem; display:flex; flex-direction:column; justify-space-between; min-height:380px;">
          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid var(--border-color); padding-bottom:0.5rem; margin-bottom:1rem;">
              <span style="font-weight:800; font-size:0.9rem; color:var(--accent-blue);">🎟️ TICKET MACHINE SCREEN</span>
              <span class="brand-badge" id="m2-status-badge">READY</span>
            </div>

            <!-- Machine Display Output Window -->
            <div id="m2-machine-screen" style="background:#000; border:1px solid rgba(56,189,248,0.3); border-radius:var(--radius-sm); padding:1rem; font-family:var(--font-code); font-size:0.9rem; color:var(--accent-green); min-height:160px; white-space:pre-wrap; line-height:1.5;">
              <span style="color:var(--text-dim);">[ Screen Off - Press RUN PROGRAM to start ]</span>
            </div>

            <!-- Interactive Input Control Slot -->
            <div id="m2-input-box" style="display:none; margin-top:1rem; background:rgba(30,41,59,0.8); border:1px solid var(--accent-yellow); padding:0.85rem; border-radius:var(--radius-md);">
              <label id="m2-input-label" style="display:block; font-weight:700; font-size:0.85rem; color:var(--accent-yellow); margin-bottom:0.4rem;"></label>
              <div style="display:flex; gap:0.5rem;">
                <input type="text" id="m2-user-input" style="flex:1; background:var(--bg-editor); border:1px solid var(--border-color); color:var(--text-main); padding:0.4rem 0.75rem; border-radius:var(--radius-sm); font-family:var(--font-code);" />
                <button class="btn btn-primary" id="m2-submit-input-btn" style="padding:0.4rem 1rem; font-size:0.85rem;">Submit</button>
              </div>
            </div>
          </div>

          <!-- Ticket Printer Graphic Output -->
          <div id="m2-printed-ticket-area" style="margin-top:1rem; min-height:80px;"></div>
        </div>

        <!-- Python Code Box (Right) -->
        <div>
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.5rem;">
            <h4 style="font-size:0.85rem; color:var(--text-muted);">PYTHON CODE (vending_ticket.py):</h4>
            <button class="btn btn-success" id="m2-run-btn" style="padding:0.4rem 1.15rem; font-size:0.9rem;">▶ RUN PROGRAM</button>
          </div>

          <div class="code-box" style="padding:0.75rem; min-height:380px;">
            <div id="m2-code-list" style="display:flex; flex-direction:column; gap:0.35rem;">
              ${data.codeLines.map(cl => `
                <div class="code-line-row" data-line="${cl.lineNum}" style="padding:0.4rem 0.75rem; border-radius:var(--radius-sm); display:flex; align-items:center; gap:0.75rem; transition:var(--transition-fast);">
                  <span style="color:var(--text-dim); font-size:0.8rem; min-width:20px; user-select:none;">${cl.lineNum}</span>
                  <code>${highlightPythonSyntax(cl.code)}</code>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

      </div>

      <!-- Procedural Concept Explanation -->
      <div style="margin-top:2rem; border-top:1px solid var(--border-color); padding-top:1.5rem;">
        <h3 style="font-size:1.15rem; font-weight:800; color:var(--accent-blue); margin-bottom:0.4rem;">${data.proceduralExplanation.title}</h3>
        <p style="font-size:0.95rem; color:var(--text-main); font-weight:700; margin-bottom:0.75rem;">💡 "${data.proceduralExplanation.definition}"</p>

        <div class="flow-diagram-row">
          ${data.proceduralExplanation.flowSteps.map((step, idx) => `
            <div class="flow-step-box">${step}</div>
            ${idx < data.proceduralExplanation.flowSteps.length - 1 ? '<span class="flow-arrow">↓</span>' : ''}
          `).join('')}
        </div>
      </div>

      <div id="m2-feedback" style="margin-top:1.25rem;"></div>

      <div class="action-row">
        <button class="btn btn-primary" id="m2-next-btn">Next: Mission 3 →</button>
      </div>
    `;

    let currentLine = 0;
    let isRunning = false;
    let userName = "Alex";
    let userTicketChoice = "Student";

    const screenEl = document.getElementById('m2-machine-screen');
    const statusBadge = document.getElementById('m2-status-badge');
    const inputBox = document.getElementById('m2-input-box');
    const inputLabel = document.getElementById('m2-input-label');
    const userInput = document.getElementById('m2-user-input');
    const submitInputBtn = document.getElementById('m2-submit-input-btn');
    const ticketArea = document.getElementById('m2-printed-ticket-area');

    function highlightLine(lineNum) {
      container.querySelectorAll('.code-line-row').forEach(row => {
        const num = parseInt(row.dataset.line, 10);
        if (num === lineNum) {
          row.style.background = 'rgba(56, 189, 248, 0.25)';
          row.style.borderLeft = '4px solid var(--accent-blue)';
        } else {
          row.style.background = 'transparent';
          row.style.borderLeft = 'none';
        }
      });
    }

    function appendScreen(text) {
      if (screenEl.innerHTML.includes('[ Screen Off')) {
        screenEl.innerHTML = '';
      }
      screenEl.innerHTML += text + '\n';
      screenEl.scrollTop = screenEl.scrollHeight;
    }

    function executeNextStep() {
      if (currentLine >= data.codeLines.length) {
        isRunning = false;
        statusBadge.textContent = 'COMPLETE';
        statusBadge.style.color = 'var(--accent-green)';
        AUDIO.playSuccess();
        addCategoryScore("procedural", 50, "m2");

        // Print final ticket graphic
        ticketArea.innerHTML = `
          <div style="background:#fff; color:#000; border:2px dashed #000; border-radius:var(--radius-sm); padding:1rem; text-align:center; font-family:var(--font-code); animation:slideUp 0.4s ease-out; box-shadow:0 10px 25px rgba(0,0,0,0.5);">
            <div style="font-weight:800; font-size:1.1rem;">🎟️ BRISTOL EVENT TICKET</div>
            <div style="border-bottom:1px solid #000; margin:0.4rem 0;"></div>
            <div><strong>CUSTOMER:</strong> ${escapeHtml(userName)}</div>
            <div><strong>TICKET:</strong> ${escapeHtml(userTicketChoice)}</div>
            <div style="font-size:0.75rem; color:#555; margin-top:0.4rem;">[ Valid For Event Entry - Keep Safe ]</div>
          </div>
        `;

        document.getElementById('m2-feedback').innerHTML = `
          <div class="feedback-box is-correct">
            <span class="feedback-icon">✓</span>
            <div class="feedback-content">
              <h4>✓ Program Executed Procedurally! (+50 XP)</h4>
              <p>You saw how Python executed each statement line-by-line from 1 to 9 in strict sequence to produce the ticket!</p>
            </div>
          </div>
        `;
        return;
      }

      const cl = data.codeLines[currentLine];
      highlightLine(cl.lineNum);
      AUDIO.playClick();

      if (cl.type === 'output') {
        let text = cl.outputText;
        text = text.replace('{name}', userName).replace('{ticket}', userTicketChoice);
        appendScreen(text);
        currentLine++;
        setTimeout(executeNextStep, 900);
      } else if (cl.type === 'input') {
        inputBox.style.display = 'block';
        inputLabel.textContent = cl.promptText;
        userInput.value = cl.defaultVal;
        userInput.focus();
        statusBadge.textContent = 'WAITING FOR INPUT';
        statusBadge.style.color = 'var(--accent-yellow)';
      }
    }

    submitInputBtn?.addEventListener('click', () => {
      const val = userInput.value.trim() || 'Alex';
      inputBox.style.display = 'none';

      if (currentLine === 1) { // Line 2 name input
        userName = val;
        appendScreen(`Your name: ${userName}`);
      } else if (currentLine === 5) { // Line 6 ticket input
        userTicketChoice = val === '1' ? 'Adult (£10)' : 'Student (£7)';
        appendScreen(`Ticket choice: ${userTicketChoice}`);
      }

      statusBadge.textContent = 'RUNNING';
      statusBadge.style.color = 'var(--accent-blue)';
      currentLine++;
      setTimeout(executeNextStep, 700);
    });

    document.getElementById('m2-run-btn')?.addEventListener('click', () => {
      if (isRunning) return;
      isRunning = true;
      currentLine = 0;
      screenEl.innerHTML = '';
      ticketArea.innerHTML = '';
      document.getElementById('m2-feedback').innerHTML = '';
      statusBadge.textContent = 'RUNNING';
      statusBadge.style.color = 'var(--accent-blue)';
      executeNextStep();
    });

    document.getElementById('m2-next-btn')?.addEventListener('click', () => {
      advanceMission(2, 3);
    });
  }

  // =========================================================================
  // MISSION 3: ROBOT INSTRUCTIONS
  // =========================================================================
  function renderMission3() {
    const data = DATA.mission3;
    const container = dom.missions[3];
    if (!container) return;

    container.innerHTML = `
      <div class="mission-header">
        <div class="mission-title-group">
          <span style="font-size:1.6rem;">🤖</span>
          <h2 class="mission-title">${data.title}</h2>
        </div>
        <p class="mission-subtitle">${data.subtitle}</p>
      </div>

      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1.5rem;" class="side-by-side-grid">
        
        <!-- Top-Down 5x5 Robot Grid (Left) -->
        <div>
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.5rem;">
            <h4 style="font-size:0.85rem; color:var(--text-muted);">GRID MAP (Reach ⭐ at 2,2):</h4>
            <span class="brand-badge" id="m3-robot-status">READY</span>
          </div>

          <div id="m3-grid-board" style="display:grid; grid-template-columns: repeat(5, 1fr); gap:4px; background:rgba(15,23,42,0.9); border:2px solid var(--accent-purple); padding:8px; border-radius:var(--radius-md); min-height:300px;">
            ${Array.from({ length: 25 }).map((_, idx) => `
              <div class="grid-cell" data-cell="${idx}" style="background:rgba(30,41,59,0.6); border:1px solid var(--border-color); border-radius:var(--radius-sm); min-height:55px; display:flex; align-items:center; justify-content:center; font-size:1.6rem; user-select:none;"></div>
            `).join('')}
          </div>
        </div>

        <!-- Command Sequence Editor (Right) -->
        <div>
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.5rem;">
            <h4 style="font-size:0.85rem; color:var(--text-muted);">PYTHON SCRIPT (Instruction Order):</h4>
            <button class="btn btn-success" id="m3-run-robot-btn" style="padding:0.4rem 1.15rem; font-size:0.9rem;">▶ RUN ROBOT</button>
          </div>

          <div class="code-box" style="min-height:240px; padding:0.75rem;">
            <div id="m3-command-list" style="display:flex; flex-direction:column; gap:0.4rem;">
              ${state.robotSequence.map((cmd, idx) => `
                <div class="robot-cmd-row" data-idx="${idx}" style="background:rgba(30,41,59,0.6); border:1px solid var(--border-color); padding:0.4rem 0.75rem; border-radius:var(--radius-sm); display:flex; align-items:center; justify-content:space-between;">
                  <div style="display:flex; align-items:center; gap:0.5rem;">
                    <span style="color:var(--text-dim); font-size:0.8rem;">${idx + 1}</span>
                    <code style="color:var(--accent-yellow); font-family:var(--font-code); font-size:0.9rem;">${cmd}</code>
                  </div>
                  <div style="display:flex; gap:0.25rem;">
                    <button class="reorder-btn m3-up" data-idx="${idx}">▲</button>
                    <button class="reorder-btn m3-down" data-idx="${idx}">▼</button>
                    <button class="reorder-btn m3-del" data-idx="${idx}" style="color:var(--accent-red);">❌</button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Add Command Buttons -->
          <div style="display:flex; gap:0.5rem; margin-top:0.75rem;">
            ${data.availableCommands.map(ac => `
              <button class="btn btn-secondary m3-add-cmd-btn" data-code="${ac.code}" style="padding:0.35rem 0.65rem; font-size:0.8rem; flex:1;">
                + ${ac.label}
              </button>
            `).join('')}
          </div>
        </div>

      </div>

      <!-- Procedural Thinking Concept -->
      <div style="margin-top:2rem; border-top:1px solid var(--border-color); padding-top:1.5rem;">
        <h3 style="font-size:1.15rem; font-weight:800; color:var(--accent-purple); margin-bottom:0.4rem;">${data.proceduralConcept.title}</h3>
        <p style="font-size:0.95rem; color:var(--text-main); font-weight:700; margin-bottom:0.75rem;">💡 "${data.proceduralConcept.definition}"</p>

        <div class="flow-diagram-row">
          ${data.proceduralConcept.flow.map((step, idx) => `
            <div class="flow-step-box">${step}</div>
            ${idx < data.proceduralConcept.flow.length - 1 ? '<span class="flow-arrow">↓</span>' : ''}
          `).join('')}
        </div>
      </div>

      <div id="m3-feedback" style="margin-top:1.25rem;"></div>

      <div class="action-row">
        <button class="btn btn-primary" id="m3-next-btn">Next: Mission 4 →</button>
      </div>
    `;

    let robotPos = { ...data.robotStart };

    function renderGridBoard() {
      const cells = container.querySelectorAll('.grid-cell');
      cells.forEach((cell, idx) => {
        const r = Math.floor(idx / 5);
        const c = idx % 5;
        cell.innerHTML = '';
        cell.style.background = 'rgba(30,41,59,0.6)';

        if (r === data.starPos.r && c === data.starPos.c) {
          cell.innerHTML = '⭐';
          cell.style.background = 'rgba(250,204,21,0.15)';
        }

        if (r === robotPos.r && c === robotPos.c) {
          cell.innerHTML = '🤖';
          cell.style.background = 'rgba(192,132,252,0.25)';
        }
      });
    }

    renderGridBoard();

    // Command reorder buttons
    container.querySelectorAll('.m3-up').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        AUDIO.playClick();
        const idx = parseInt(btn.dataset.idx, 10);
        if (idx > 0) {
          [state.robotSequence[idx - 1], state.robotSequence[idx]] = [state.robotSequence[idx], state.robotSequence[idx - 1]];
          renderMission3();
        }
      });
    });

    container.querySelectorAll('.m3-down').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        AUDIO.playClick();
        const idx = parseInt(btn.dataset.idx, 10);
        if (idx < state.robotSequence.length - 1) {
          [state.robotSequence[idx], state.robotSequence[idx + 1]] = [state.robotSequence[idx + 1], state.robotSequence[idx]];
          renderMission3();
        }
      });
    });

    container.querySelectorAll('.m3-del').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        AUDIO.playClick();
        const idx = parseInt(btn.dataset.idx, 10);
        state.robotSequence.splice(idx, 1);
        renderMission3();
      });
    });

    container.querySelectorAll('.m3-add-cmd-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        AUDIO.playClick();
        state.robotSequence.push(btn.dataset.code);
        renderMission3();
      });
    });

    // Run Robot Simulation
    document.getElementById('m3-run-robot-btn')?.addEventListener('click', () => {
      if (!state.robotSequence.length) {
        alert("Add some moveForward() or turnRight() commands first!");
        return;
      }

      robotPos = { ...data.robotStart };
      renderGridBoard();

      let step = 0;
      const status = document.getElementById('m3-robot-status');
      status.textContent = 'EXECUTING';
      status.style.color = 'var(--accent-yellow)';

      function runNextCommand() {
        if (step >= state.robotSequence.length) {
          if (robotPos.r === data.starPos.r && robotPos.c === data.starPos.c) {
            AUDIO.playSuccess();
            status.textContent = 'GOAL REACHED! ⭐';
            status.style.color = 'var(--accent-green)';
            addCategoryScore("procedural", 50, "m3");

            document.getElementById('m3-feedback').innerHTML = `
              <div class="feedback-box is-correct">
                <span class="feedback-icon">✓</span>
                <div class="feedback-content">
                  <h4>✓ Robot Reached the Star! (+50 XP)</h4>
                  <p>Procedural execution in action! Notice how changing the instruction order alters where the robot moves!</p>
                </div>
              </div>
            `;
          } else {
            AUDIO.playError();
            status.textContent = 'STOPPED';
            status.style.color = 'var(--accent-red)';

            document.getElementById('m3-feedback').innerHTML = `
              <div class="feedback-box is-wrong">
                <span class="feedback-icon">✗</span>
                <div class="feedback-content">
                  <h4>✗ Robot missed the star!</h4>
                  <p>Try reordering or adding instructions (e.g. <code>moveForward()</code>, <code>turnRight()</code>) and run again!</p>
                </div>
              </div>
            `;
          }
          return;
        }

        const cmd = state.robotSequence[step];
        AUDIO.playClick();

        // Highlight code line
        container.querySelectorAll('.robot-cmd-row').forEach(row => {
          const idx = parseInt(row.dataset.idx, 10);
          row.style.background = idx === step ? 'rgba(192, 132, 252, 0.3)' : 'rgba(30,41,59,0.6)';
        });

        if (cmd === 'moveForward()') {
          if (robotPos.dir === 'EAST') robotPos.c = Math.min(4, robotPos.c + 1);
          else if (robotPos.dir === 'SOUTH') robotPos.r = Math.min(4, robotPos.r + 1);
          else if (robotPos.dir === 'WEST') robotPos.c = Math.max(0, robotPos.c - 1);
          else if (robotPos.dir === 'NORTH') robotPos.r = Math.max(0, robotPos.r - 1);
        } else if (cmd === 'turnRight()') {
          const dirs = ['NORTH', 'EAST', 'SOUTH', 'WEST'];
          robotPos.dir = dirs[(dirs.indexOf(robotPos.dir) + 1) % 4];
        } else if (cmd === 'turnLeft()') {
          const dirs = ['NORTH', 'EAST', 'SOUTH', 'WEST'];
          robotPos.dir = dirs[(dirs.indexOf(robotPos.dir) + 3) % 4];
        }

        renderGridBoard();
        step++;
        setTimeout(runNextCommand, 700);
      }

      runNextCommand();
    });

    document.getElementById('m3-next-btn')?.addEventListener('click', () => {
      advanceMission(3, 4);
    });
  }

  // =========================================================================
  // MISSION 4: EVENT-DRIVEN PROGRAMMING
  // =========================================================================
  function renderMission4() {
    const data = DATA.mission4;
    const container = dom.missions[4];
    if (!container) return;

    container.innerHTML = `
      <div class="mission-header">
        <div class="mission-title-group">
          <span style="font-size:1.6rem;">⚡</span>
          <h2 class="mission-title">${data.title}</h2>
        </div>
        <p class="mission-subtitle">${data.subtitle}</p>
      </div>

      <!-- Intro Explanation -->
      <div style="background:rgba(15,23,42,0.8); border:1px solid var(--accent-yellow); padding:1.25rem; border-radius:var(--radius-md); margin-bottom:1.5rem;">
        <p style="font-size:1.05rem; font-weight:700; color:var(--text-main); margin-bottom:0.4rem;">💡 "${data.intro}"</p>
        <div class="flow-diagram-row" style="margin-top:0.75rem;">
          ${data.flow.map((step, idx) => `
            <div class="flow-step-box" style="border-color:var(--accent-yellow); color:var(--accent-yellow);">${step}</div>
            ${idx < data.flow.length - 1 ? '<span class="flow-arrow">→</span>' : ''}
          `).join('')}
        </div>
      </div>

      <!-- Live Dark Mode Website Demo -->
      <h3 style="font-size:1.1rem; font-weight:800; margin-bottom:0.75rem;">1. Live Dark Mode Website Demo</h3>

      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1.5rem; margin-bottom:1.5rem;" class="side-by-side-grid">
        
        <!-- Website Preview (Left) -->
        <div id="m4-website-preview" style="background:#f8fafc; color:#0f172a; border:2px solid var(--border-color); border-radius:var(--radius-md); padding:1.5rem; transition:all 0.4s ease; min-height:220px; display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="font-size:0.8rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; opacity:0.6; margin-bottom:0.25rem;">MY WEBSITE</div>
            <h4 style="font-size:1.3rem; font-weight:800; margin-bottom:0.5rem;">Welcome to Web Lab!</h4>
            <p style="font-size:0.9rem; opacity:0.8;">Click the Dark Mode button below to trigger the JavaScript click event handler!</p>
          </div>

          <div style="margin-top:1rem;">
            <button class="btn" id="m4-darkmode-toggle-btn" style="background:#0f172a; color:#fff; font-size:0.9rem; padding:0.6rem 1.25rem; border-radius:var(--radius-full);">
              🌙 DARK MODE
            </button>
          </div>
        </div>

        <!-- Real JS Code Box (Right) -->
        <div>
          <h4 style="font-size:0.85rem; color:var(--text-muted); margin-bottom:0.4rem;">JAVASCRIPT EVENT HANDLER (app.js):</h4>
          <div class="code-box" style="padding:1.15rem; min-height:220px;">
            <pre><code id="m4-js-code-box">${highlightPythonSyntax(data.darkModeDemo.jsCode)}</code></pre>
            <p style="font-size:0.82rem; color:var(--accent-yellow); margin-top:0.75rem; font-weight:700;">💡 ${data.darkModeDemo.explanation}</p>
          </div>
        </div>

      </div>

      <!-- 3 Mini Interactive Examples -->
      <h3 style="font-size:1.1rem; font-weight:800; margin-bottom:0.75rem;">2. Interactive Event Triggers</h3>
      <p style="font-size:0.88rem; color:var(--text-muted); margin-bottom:1rem;">Click or press key triggers below to activate instant program responses!</p>

      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:1rem; margin-bottom:1.5rem;" class="containers-grid">
        ${data.miniExamples.map(ex => `
          <div style="background:rgba(30,41,59,0.6); border:1px solid var(--border-color); padding:1.15rem; border-radius:var(--radius-md); text-align:center;">
            <button class="btn btn-secondary m4-trigger-btn" data-action="${ex.action}" style="margin-bottom:0.75rem; width:100%; justify-content:center;">
              ${ex.label}
            </button>
            <div class="code-box" style="padding:0.5rem; font-size:0.8rem; margin-bottom:0.4rem;"><code>${escapeHtml(ex.code)}</code></div>
            <div style="font-size:0.82rem; color:var(--text-muted);">${ex.description}</div>
            <div class="m4-action-output" data-action="${ex.action}" style="margin-top:0.5rem; min-height:30px; font-weight:800; color:var(--accent-green);"></div>
          </div>
        `).join('')}
      </div>

      <!-- Concept Check Question -->
      <div style="border-top:1px solid var(--border-color); padding-top:1.5rem;">
        <h4 style="font-size:1.05rem; font-weight:700; margin-bottom:0.75rem;">${data.conceptQuestion.question}</h4>
        <div class="options-grid" id="m4-concept-options">
          ${data.conceptQuestion.options.map((opt, idx) => `
            <div class="option-card" data-idx="${idx}">
              <div class="option-badge">${String.fromCharCode(65 + idx)}</div>
              <span>${opt}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div id="m4-feedback" style="margin-top:1.25rem;"></div>

      <div class="action-row">
        <button class="btn btn-primary" id="m4-submit-btn">Check Event Concept</button>
      </div>
    `;

    // Dark Mode Toggle Demo
    const webPreview = document.getElementById('m4-website-preview');
    const darkBtn = document.getElementById('m4-darkmode-toggle-btn');
    let isDark = false;

    darkBtn?.addEventListener('click', () => {
      AUDIO.playSuccess();
      isDark = !isDark;
      if (isDark) {
        webPreview.style.background = '#090d16';
        webPreview.style.color = '#f8fafc';
        darkBtn.textContent = '☀️ LIGHT MODE';
        darkBtn.style.background = '#facc15';
        darkBtn.style.color = '#000';
      } else {
        webPreview.style.background = '#f8fafc';
        webPreview.style.color = '#0f172a';
        darkBtn.textContent = '🌙 DARK MODE';
        darkBtn.style.background = '#0f172a';
        darkBtn.style.color = '#fff';
      }
    });

    // 3 Mini Triggers
    container.querySelectorAll('.m4-trigger-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        AUDIO.playSuccess();
        const action = btn.dataset.action;
        const out = container.querySelector(`.m4-action-output[data-action="${action}"]`);
        if (action === 'jump') {
          out.innerHTML = '🦘 CHARACTER JUMPED!';
        } else if (action === 'space') {
          out.innerHTML = '🏃 MOVED RIGHT +10px!';
        } else if (action === 'message') {
          out.innerHTML = '💬 POPUP: "Hello World!"';
        }
      });
    });

    // Keypress trigger for Spacebar
    window.addEventListener('keydown', (e) => {
      if (state.currentMission === 4 && e.code === 'Space') {
        const out = container.querySelector('.m4-action-output[data-action="space"]');
        if (out) {
          AUDIO.playSuccess();
          out.innerHTML = '🏃 SPACEBAR PRESSED → MOVED RIGHT!';
        }
      }
    });

    // Concept Question
    let chosenIdx = null;
    const optionCards = container.querySelectorAll('#m4-concept-options .option-card');
    setupOptionCards(optionCards, (card) => {
      chosenIdx = parseInt(card.dataset.idx, 10);
    });

    document.getElementById('m4-submit-btn')?.addEventListener('click', () => {
      if (chosenIdx === null) {
        alert("Select your answer option!");
        return;
      }

      const feedback = document.getElementById('m4-feedback');
      if (chosenIdx === data.conceptQuestion.correct) {
        AUDIO.playSuccess();
        optionCards[chosenIdx].classList.add('is-correct');
        addCategoryScore("eventDriven", 50, "m4");

        feedback.innerHTML = `
          <div class="feedback-box is-correct">
            <span class="feedback-icon">✓</span>
            <div class="feedback-content">
              <h4>✓ Correct! EVENT-DRIVEN PROGRAMMING (+50 XP)</h4>
              <p>${data.conceptQuestion.explanation}</p>
            </div>
          </div>
        `;

        document.getElementById('m4-submit-btn').style.display = 'none';
        const nextBtn = document.createElement('button');
        nextBtn.className = 'btn btn-success';
        nextBtn.innerHTML = 'Next: Mission 5 →';
        nextBtn.addEventListener('click', () => advanceMission(4, 5));
        container.querySelector('.action-row').appendChild(nextBtn);
      } else {
        AUDIO.playError();
        optionCards[chosenIdx].classList.add('is-wrong');
        feedback.innerHTML = `
          <div class="feedback-box is-wrong">
            <span class="feedback-icon">✗</span>
            <div class="feedback-content">
              <h4>✗ Not quite.</h4>
              <p>Re-read the Dark Mode and button examples! In event-driven programming, something happens first (a click or keypress), then the program responds. Select another option and try again.</p>
            </div>
          </div>
        `;
      }
    });
  }

  // =========================================================================
  // MISSION 5: GAME OBJECTS (OBJECT-ORIENTED)
  // =========================================================================
  function renderMission5() {
    const data = DATA.mission5;
    const container = dom.missions[5];
    if (!container) return;

    container.innerHTML = `
      <div class="mission-header">
        <div class="mission-title-group">
          <span style="font-size:1.6rem;">🎮</span>
          <h2 class="mission-title">${data.title}</h2>
        </div>
        <p class="mission-subtitle">${data.subtitle}</p>
      </div>

      <!-- Intro Formula -->
      <div style="background:rgba(15,23,42,0.8); border:1px solid var(--accent-green); padding:1.25rem; border-radius:var(--radius-md); margin-bottom:1.5rem;">
        <p style="font-size:1.05rem; font-weight:700; color:var(--text-main); margin-bottom:0.4rem;">💡 "${data.intro}"</p>
        <p style="font-size:1rem; font-weight:800; color:var(--accent-green);">${data.formula}</p>
      </div>

      <!-- Visual Object Cards -->
      <h3 style="font-size:1.1rem; font-weight:800; margin-bottom:0.75rem;">1. Visual Object Examples</h3>
      
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:1.25rem; margin-bottom:1.5rem;" class="containers-grid">
        ${data.objects.map(obj => `
          <div style="background:rgba(15,23,42,0.8); border:2px solid ${obj.color}; border-radius:var(--radius-md); padding:1.25rem;">
            <h4 style="font-size:1.15rem; font-weight:800; color:${obj.color}; margin-bottom:0.75rem;">${obj.name}</h4>
            
            <div style="margin-bottom:0.85rem;">
              <span class="brand-badge" style="background:rgba(56,189,248,0.15); color:var(--accent-blue); margin-bottom:0.4rem; display:inline-block;">DATA (Information)</span>
              <ul style="padding-left:1.25rem; font-size:0.9rem; color:var(--text-main);">
                ${obj.data.map(d => `<li><strong>${d.key}:</strong> ${d.val}</li>`).join('')}
              </ul>
            </div>

            <div>
              <span class="brand-badge" style="background:rgba(52,211,153,0.15); color:var(--accent-green); margin-bottom:0.4rem; display:inline-block;">BEHAVIOUR (Actions)</span>
              <ul style="padding-left:1.25rem; font-size:0.9rem; color:var(--text-main); font-family:var(--font-code);">
                ${obj.behaviour.map(b => `<li><code>${b}</code></li>`).join('')}
              </ul>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Mini Sort Activity -->
      <div style="border-top:1px solid var(--border-color); padding-top:1.5rem;">
        <h3 style="font-size:1.05rem; font-weight:800; margin-bottom:0.4rem;">2. Quick Sort: DATA vs BEHAVIOUR</h3>
        <p style="font-size:0.88rem; color:var(--text-muted); margin-bottom:1rem;">${data.miniSort.instruction}</p>

        <div class="cards-pill-pool pool-drop-zone" id="m5-pool" data-container="POOL">
          ${data.miniSort.items.map(item => `
            <div class="data-pill-card" data-id="${item.id}">${item.text}</div>
          `).join('')}
        </div>

        <div class="containers-grid">
          <div class="drop-container-box" data-container="DATA" style="border-color:var(--accent-blue);">
            <div class="container-header" style="color:var(--accent-blue);">📊 DATA (Information)</div>
            <div class="cards-pill-pool container-items" style="flex:1; background:transparent; border:none; padding:0;"></div>
          </div>
          <div class="drop-container-box" data-container="BEHAVIOUR" style="border-color:var(--accent-green);">
            <div class="container-header" style="color:var(--accent-green);">⚙️ BEHAVIOUR (Actions)</div>
            <div class="cards-pill-pool container-items" style="flex:1; background:transparent; border:none; padding:0;"></div>
          </div>
        </div>
      </div>

      <div id="m5-feedback" style="margin-top:1.25rem;"></div>

      <div class="action-row">
        <button class="btn btn-primary" id="m5-submit-btn">Check Sort</button>
      </div>
    `;

    const placed = { DATA: [], BEHAVIOUR: [] };
    setupContainerSorting(container, (itemId, targetContainerId) => {
      const itemObj = data.miniSort.items.find(i => i.id === itemId);
      if (!itemObj) return;

      Object.keys(placed).forEach(k => {
        placed[k] = placed[k].filter(i => i.id !== itemId);
      });

      if (targetContainerId && targetContainerId !== 'POOL') {
        placed[targetContainerId].push(itemObj);
      }
    });

    document.getElementById('m5-submit-btn')?.addEventListener('click', () => {
      const totalPlaced = placed.DATA.length + placed.BEHAVIOUR.length;
      if (totalPlaced < data.miniSort.items.length) {
        alert(`Classify all ${data.miniSort.items.length} cards into DATA or BEHAVIOUR first!`);
        return;
      }

      let errors = 0;
      data.miniSort.items.forEach(item => {
        const inCont = Object.keys(placed).find(k => placed[k].some(i => i.id === item.id));
        if (inCont !== item.target) errors++;
      });

      const feedback = document.getElementById('m5-feedback');
      if (errors === 0) {
        AUDIO.playSuccess();
        addCategoryScore("oop", 40, "m5");

        feedback.innerHTML = `
          <div class="feedback-box is-correct">
            <span class="feedback-icon">✓</span>
            <div class="feedback-content">
              <h4>✓ Correct! Object-Oriented Concept Mastered! (+40 XP)</h4>
              <p>Variables holding values (health, score) are DATA, while function actions with parentheses () are BEHAVIOUR!</p>
            </div>
          </div>
        `;

        document.getElementById('m5-submit-btn').style.display = 'none';
        const nextBtn = document.createElement('button');
        nextBtn.className = 'btn btn-success';
        nextBtn.innerHTML = 'Next: Mission 6 →';
        nextBtn.addEventListener('click', () => advanceMission(5, 6));
        container.querySelector('.action-row').appendChild(nextBtn);
      } else {
        AUDIO.playError();
        feedback.innerHTML = `
          <div class="feedback-box is-wrong">
            <span class="feedback-icon">✗</span>
            <div class="feedback-content">
              <h4>✗ Not quite. ${errors} Item(s) Misplaced</h4>
              <p>Remember: Actions ending in () are BEHAVIOUR methods! Drag or tap them to adjust and try again.</p>
            </div>
          </div>
        `;
      }
    });
  }

  // =========================================================================
  // MISSION 6: GRAPHICAL PROGRAMMING
  // =========================================================================
  function renderMission6() {
    const data = DATA.mission6;
    const container = dom.missions[6];
    if (!container) return;

    container.innerHTML = `
      <div class="mission-header">
        <div class="mission-title-group">
          <span style="font-size:1.6rem;">🧩</span>
          <h2 class="mission-title">${data.title}</h2>
        </div>
        <p class="mission-subtitle">${data.subtitle}</p>
      </div>

      <!-- Intro Banner -->
      <div style="background:rgba(15,23,42,0.8); border:1px solid var(--accent-purple); padding:1.25rem; border-radius:var(--radius-md); margin-bottom:1.5rem;">
        <p style="font-size:1.05rem; font-weight:700; color:var(--text-main); margin-bottom:0.2rem;">💡 "${data.intro}"</p>
      </div>

      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1.5rem; margin-bottom:1.5rem;" class="side-by-side-grid">
        
        <!-- Scratch Block Stack Editor (Left) -->
        <div>
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.5rem;">
            <h4 style="font-size:0.85rem; color:var(--text-muted);">SCRATCH BLOCK STACK:</h4>
            <button class="btn btn-success" id="m6-run-blocks-btn" style="padding:0.4rem 1.15rem; font-size:0.9rem;">▶ RUN BLOCKS</button>
          </div>

          <div style="background:rgba(15,23,42,0.8); border:2px solid var(--accent-purple); border-radius:var(--radius-md); padding:1rem; min-height:260px;">
            <div id="m6-block-list" style="display:flex; flex-direction:column; gap:0.35rem;">
              ${state.scratchSequence.map((text, idx) => {
                const blkObj = data.scratchBlocks.find(b => b.text === text) || { color: "#a855f7" };
                return `
                  <div class="scratch-block-row" data-idx="${idx}" style="background:${blkObj.color}; padding:0.6rem 1rem; border-radius:var(--radius-sm); color:#000; font-weight:800; font-size:0.85rem; display:flex; align-items:center; justify-content:space-between; clip-path: polygon(0 0, 15px 0, 20px 4px, 35px 4px, 40px 0, 100% 0, 100% 100%, 0 100%);">
                    <span>🧩 ${text}</span>
                    <div style="display:flex; gap:0.2rem;">
                      <button class="reorder-btn m6-up" data-idx="${idx}">▲</button>
                      <button class="reorder-btn m6-down" data-idx="${idx}">▼</button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- Animated Sprite Output Stage (Right) -->
        <div>
          <h4 style="font-size:0.85rem; color:var(--text-muted); margin-bottom:0.5rem;">ANIMATED STAGE OUTPUT:</h4>
          <div id="m6-stage-screen" style="background:#090d16; border:2px solid var(--border-color); border-radius:var(--radius-md); padding:1rem; min-height:260px; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; overflow:hidden;">
            <div id="m6-sprite-cat" style="font-size:4rem; transition:transform 0.5s ease-out;">🐱</div>
            <div id="m6-speech-bubble" style="display:none; position:absolute; top:20px; background:#fff; color:#000; border-radius:var(--radius-md); padding:0.5rem 1rem; font-weight:800; font-size:0.95rem; box-shadow:0 4px 15px rgba(0,0,0,0.5);">
              HELLO!
            </div>
            <div style="margin-top:1rem; font-size:0.85rem; color:var(--text-muted);" id="m6-stage-caption">Press ▶ RUN BLOCKS to watch the sprite execute instructions!</div>
          </div>
        </div>

      </div>

      <!-- Scratch vs Python Comparison -->
      <div style="border-top:1px solid var(--border-color); padding-top:1.5rem;">
        <h3 style="font-size:1.15rem; font-weight:800; color:var(--accent-yellow); margin-bottom:0.75rem;">SCRATCH vs PYTHON</h3>
        
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem; margin-bottom:0.75rem;" class="side-by-side-grid">
          <div style="background:rgba(250,204,21,0.1); border:1px solid var(--accent-yellow); padding:1rem; border-radius:var(--radius-md); text-align:center;">
            <span class="brand-badge" style="background:rgba(250,204,21,0.2); color:var(--accent-yellow); margin-bottom:0.4rem; display:inline-block;">SCRATCH (Graphical)</span>
            <div style="font-weight:800; font-size:1.1rem; color:#fff; margin-top:0.3rem;"><code>${data.comparison.scratch}</code></div>
          </div>
          <div style="background:rgba(56,189,248,0.1); border:1px solid var(--accent-blue); padding:1rem; border-radius:var(--radius-md); text-align:center;">
            <span class="brand-badge" style="background:rgba(56,189,248,0.2); color:var(--accent-blue); margin-bottom:0.4rem; display:inline-block;">PYTHON (Text-Based)</span>
            <div style="font-weight:800; font-size:1.1rem; color:#fff; margin-top:0.3rem;"><code>${data.comparison.python}</code></div>
          </div>
        </div>

        <p style="font-size:0.95rem; font-weight:700; color:var(--accent-green);">💡 ${data.comparison.difference}</p>
      </div>

      <div id="m6-feedback" style="margin-top:1.25rem;"></div>

      <div class="action-row">
        <button class="btn btn-primary" id="m6-next-btn">Next: Mission 7 →</button>
      </div>
    `;

    // Reorder buttons for Scratch block stack
    container.querySelectorAll('.m6-up').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        AUDIO.playClick();
        const idx = parseInt(btn.dataset.idx, 10);
        if (idx > 0) {
          [state.scratchSequence[idx - 1], state.scratchSequence[idx]] = [state.scratchSequence[idx], state.scratchSequence[idx - 1]];
          renderMission6();
        }
      });
    });

    container.querySelectorAll('.m6-down').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        AUDIO.playClick();
        const idx = parseInt(btn.dataset.idx, 10);
        if (idx < state.scratchSequence.length - 1) {
          [state.scratchSequence[idx], state.scratchSequence[idx + 1]] = [state.scratchSequence[idx + 1], state.scratchSequence[idx]];
          renderMission6();
        }
      });
    });

    // Run block stack simulation
    document.getElementById('m6-run-blocks-btn')?.addEventListener('click', () => {
      const cat = document.getElementById('m6-sprite-cat');
      const bubble = document.getElementById('m6-speech-bubble');
      const caption = document.getElementById('m6-stage-caption');

      AUDIO.playSuccess();
      addCategoryScore("graphical", 40, "m6");

      cat.style.transform = 'translateX(40px)';
      caption.textContent = 'Sprite moving 10 steps...';

      setTimeout(() => {
        bubble.style.display = 'block';
        caption.textContent = 'Sprite saying "HELLO!"';
      }, 600);

      setTimeout(() => {
        bubble.style.display = 'none';
        cat.style.transform = 'translateX(0)';
        caption.textContent = 'Block execution finished!';
      }, 2600);

      document.getElementById('m6-feedback').innerHTML = `
        <div class="feedback-box is-correct">
          <span class="feedback-icon">✓</span>
          <div class="feedback-content">
            <h4>✓ Graphical Blocks Executed! (+40 XP)</h4>
            <p>You saw how snapping visual blocks eliminates typing syntax errors while executing program instructions!</p>
          </div>
        </div>
      `;
    });

    document.getElementById('m6-next-btn')?.addEventListener('click', () => {
      advanceMission(6, 7);
    });
  }

  // =========================================================================
  // MISSION 7: QUICK CHECK RECAP
  // =========================================================================
  function renderMission7() {
    const data = DATA.mission7;
    const container = dom.missions[7];
    if (!container) return;

    container.innerHTML = `
      <div class="mission-header">
        <div class="mission-title-group">
          <span style="font-size:1.6rem;">⚡</span>
          <h2 class="mission-title">${data.title}</h2>
        </div>
        <p class="mission-subtitle">${data.subtitle}</p>
      </div>

      <div style="display:flex; flex-direction:column; gap:1.5rem;" id="m7-questions-list">
        ${data.questions.map((q, qIdx) => `
          <div style="background:rgba(30,41,59,0.5); border:1px solid var(--border-color); padding:1.25rem; border-radius:var(--radius-md);" class="m7-q-box" data-qidx="${qIdx}">
            <h4 style="font-size:1.05rem; font-weight:800; color:var(--text-main); margin-bottom:0.75rem;">${q.question}</h4>
            <div class="options-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:0.75rem;">
              ${q.options.map((opt, optIdx) => `
                <div class="option-card m7-opt-card" data-optidx="${optIdx}">
                  <div class="option-badge">${String.fromCharCode(65 + optIdx)}</div>
                  <span>${opt}</span>
                </div>
              `).join('')}
            </div>
            <div class="m7-q-feedback" style="margin-top:0.75rem;"></div>
          </div>
        `).join('')}
      </div>

      <div id="m7-feedback" style="margin-top:1.5rem;"></div>

      <div class="action-row">
        <button class="btn btn-primary" id="m7-submit-btn">Validate Quick Check</button>
      </div>
    `;

    const selections = {};
    container.querySelectorAll('.m7-q-box').forEach(box => {
      const qIdx = box.dataset.qidx;
      const cards = box.querySelectorAll('.m7-opt-card');
      setupOptionCards(cards, (card) => {
        selections[qIdx] = parseInt(card.dataset.optidx, 10);
      });
    });

    document.getElementById('m7-submit-btn')?.addEventListener('click', () => {
      if (Object.keys(selections).length < data.questions.length) {
        alert(`Please answer all ${data.questions.length} questions first! (${Object.keys(selections).length}/${data.questions.length} answered)`);
        return;
      }

      let correctCount = 0;
      data.questions.forEach((q, idx) => {
        const box = container.querySelector(`.m7-q-box[data-qidx="${idx}"]`);
        const qFeedback = box?.querySelector('.m7-q-feedback');
        const cards = box?.querySelectorAll('.m7-opt-card');

        if (selections[idx] === q.correct) {
          correctCount++;
          cards[selections[idx]]?.classList.add('is-correct');
          if (qFeedback) qFeedback.innerHTML = `<span style="color:var(--accent-green); font-size:0.85rem; font-weight:700;">✓ ${q.explanation}</span>`;
        } else {
          cards[selections[idx]]?.classList.add('is-wrong');
          if (qFeedback) qFeedback.innerHTML = `<span style="color:var(--accent-red); font-size:0.85rem; font-weight:700;">✗ Try again! ${q.explanation}</span>`;
        }
      });

      const feedback = document.getElementById('m7-feedback');
      if (correctCount === data.questions.length) {
        AUDIO.playSuccess();
        addCategoryScore("practical", 60, "m7");

        feedback.innerHTML = `
          <div class="feedback-box is-correct">
            <span class="feedback-icon">✓</span>
            <div class="feedback-content">
              <h4>✓ Perfect 6/6 Knowledge Check Passed! (+60 XP)</h4>
              <p>You have mastered the core concepts of languages, syntax, procedural flow, event-driven triggers, OOP, and visual blocks!</p>
            </div>
          </div>
        `;

        document.getElementById('m7-submit-btn').style.display = 'none';
        const nextBtn = document.createElement('button');
        nextBtn.className = 'btn btn-success';
        nextBtn.innerHTML = 'Next: Mission 8 (IDE Coding) →';
        nextBtn.addEventListener('click', () => advanceMission(7, 8));
        container.querySelector('.action-row').appendChild(nextBtn);
      } else {
        AUDIO.playError();
        feedback.innerHTML = `
          <div class="feedback-box is-wrong">
            <span class="feedback-icon">✗</span>
            <div class="feedback-content">
              <h4>✗ Scored ${correctCount} / ${data.questions.length}</h4>
              <p>Review the highlighted hints above, select another answer for incorrect questions, and try again!</p>
            </div>
          </div>
        `;
      }
    });
  }

  // =========================================================================
  // MISSION 8: YOUR TURN – BUILD A VENDING MACHINE (IDE CODING)
  // =========================================================================
  function renderMission8() {
    const data = DATA.mission8;
    const container = dom.missions[8];
    if (!container) return;

    container.innerHTML = `
      <div class="mission-header">
        <div class="mission-title-group">
          <span style="font-size:1.6rem;">💻</span>
          <h2 class="mission-title">${data.title}</h2>
        </div>
        <p class="mission-subtitle">${data.subtitle}</p>
      </div>

      <div style="background:rgba(15,23,42,0.8); border:2px solid var(--accent-blue); padding:1.25rem; border-radius:var(--radius-md); margin-bottom:1.5rem;">
        <h3 style="color:var(--accent-blue); font-size:1.1rem; font-weight:800; margin-bottom:0.4rem;">🎯 YOUR CODING MISSION:</h3>
        <p style="font-size:0.95rem; color:var(--text-main);">"${data.scenario}"</p>
      </div>

      <!-- Step-by-Step IDE Guided Tutorial -->
      <h3 style="font-size:1.1rem; font-weight:800; margin-bottom:0.85rem;">Guided Tutorial Steps:</h3>

      <div style="display:flex; flex-direction:column; gap:1.25rem;" id="m8-tutorial-steps">
        ${data.tutorialSteps.map(st => `
          <div style="background:rgba(30,41,59,0.5); border:1px solid var(--border-color); padding:1.25rem; border-radius:var(--radius-md);" class="m8-step-card">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.5rem;">
              <h4 style="font-size:1rem; font-weight:800; color:var(--accent-yellow);">${st.title}</h4>
              <span class="brand-badge">Step ${st.stepNum}</span>
            </div>

            <p style="font-size:0.92rem; margin-bottom:0.75rem;">${st.instruction}</p>

            ${st.code ? `<div class="code-box" style="margin-bottom:0.75rem;"><code>${highlightPythonSyntax(st.code)}</code></div>` : ''}

            ${st.explanation ? `<p style="font-size:0.85rem; color:var(--text-muted); font-style:italic; margin-bottom:0.5rem;">💡 ${st.explanation}</p>` : ''}

            ${st.hint1 ? `
              <div style="margin-top:0.5rem;">
                <button class="btn btn-secondary m8-hint-btn" style="padding:0.35rem 0.75rem; font-size:0.8rem;">💡 Show Hint</button>
                <div class="m8-hint-box" style="display:none; margin-top:0.5rem; background:rgba(250,204,21,0.1); border:1px solid var(--accent-yellow); padding:0.75rem; border-radius:var(--radius-sm); font-size:0.88rem;">
                  <p><strong>Hint 1:</strong> ${st.hint1}</p>
                  ${st.hint2 ? `<p style="margin-top:0.3rem;"><strong>Hint 2:</strong> <code>${st.hint2}</code></p>` : ''}
                </div>
              </div>
            ` : ''}

            ${st.ideas ? `
              <div style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-top:0.5rem;">
                ${st.ideas.map(id => `<span class="brand-badge" style="background:rgba(52,211,153,0.15); color:var(--accent-green);">${id}</span>`).join('')}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>

      <!-- Extension Challenge Card -->
      <div style="margin-top:2rem; background:rgba(192,132,252,0.1); border:2px solid var(--accent-purple); padding:1.25rem; border-radius:var(--radius-md);">
        <h3 style="font-size:1.05rem; font-weight:800; color:var(--accent-purple); margin-bottom:0.5rem;">${data.extensionChallenge.title}</h3>
        <ul style="padding-left:1.25rem; font-size:0.9rem; color:var(--text-main);">
          ${data.extensionChallenge.ideas.map(i => `<li>${i}</li>`).join('')}
        </ul>
      </div>

      <!-- AC 1.1 Final Reflection Knowledge Check -->
      <div style="margin-top:2rem; border-top:1px solid var(--border-color); padding-top:1.5rem;">
        <h3 style="font-size:1.15rem; font-weight:800; color:var(--accent-green); margin-bottom:0.4rem;">${data.finalReflection.title}</h3>
        <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:1rem;">Click each reflection question below to reveal key exam concepts:</p>

        <div style="display:flex; flex-direction:column; gap:0.75rem;" id="m8-reflections-list">
          ${data.finalReflection.questions.map((rf, idx) => `
            <div style="background:rgba(30,41,59,0.6); border:1px solid var(--border-color); padding:1rem; border-radius:var(--radius-md); cursor:pointer;" class="m8-rf-card" data-idx="${idx}">
              <div style="font-weight:700; font-size:0.95rem; color:var(--text-main); display:flex; justify-content:space-between; align-items:center;">
                <span>${rf.q}</span>
                <span class="m8-rf-icon" style="color:var(--accent-blue);">+ Reveal Answer</span>
              </div>
              <div class="m8-rf-ans" style="display:none; margin-top:0.5rem; border-top:1px solid var(--border-color); padding-top:0.5rem; color:var(--accent-green); font-size:0.9rem; font-weight:600;">
                ✓ ${rf.a}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div id="m8-feedback" style="margin-top:1.5rem;"></div>

      <div class="action-row">
        <button class="btn btn-success" id="m8-finish-btn" style="padding:0.85rem 2rem; font-size:1.05rem;">FINISH PROGRAMMING LAB 🏆</button>
      </div>
    `;

    // Hint button toggles
    container.querySelectorAll('.m8-hint-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        AUDIO.playClick();
        const hintBox = btn.nextElementSibling;
        if (hintBox) {
          const isHidden = hintBox.style.display === 'none';
          hintBox.style.display = isHidden ? 'block' : 'none';
          btn.textContent = isHidden ? '💡 Hide Hint' : '💡 Show Hint';
        }
      });
    });

    // Reflection card toggles
    container.querySelectorAll('.m8-rf-card').forEach(card => {
      card.addEventListener('click', () => {
        AUDIO.playClick();
        const ans = card.querySelector('.m8-rf-ans');
        const icon = card.querySelector('.m8-rf-icon');
        if (ans) {
          const isHidden = ans.style.display === 'none';
          ans.style.display = isHidden ? 'block' : 'none';
          icon.textContent = isHidden ? '✓ Answer Shown' : '+ Reveal Answer';
        }
      });
    });

    // Finish Lab Button
    document.getElementById('m8-finish-btn')?.addEventListener('click', () => {
      AUDIO.playSuccess();
      addCategoryScore("practical", 100, "m8");
      state.completedMissions.add(8);
      updateHeaderStats();
      showFinalResultsModal();
    });
  }

  // =========================================================================
  // RESULTS & PERFORMANCE DASHBOARD
  // =========================================================================
  function showFinalResultsModal() {
    const modal = dom.resultsModal;
    if (!modal) return;

    const totalPts = state.score;
    const maxPts = 430;
    const percentage = Math.min(100, Math.round((totalPts / maxPts) * 100));

    modal.innerHTML = `
      <div class="results-card">
        <div style="font-size:4rem; margin-bottom:0.5rem; filter:drop-shadow(0 0 20px rgba(250,204,21,0.4));">🏆</div>
        <h2 style="font-size:2rem; font-weight:800; color:var(--accent-yellow); margin-bottom:0.5rem;">PROGRAMMING LAB COMPLETE</h2>
        <p style="color:var(--text-muted); font-size:1rem;">Total Lab XP Earned: ${totalPts} XP (${percentage}% Completion)</p>

        <div style="background:rgba(30,41,59,0.5); border:1px solid var(--border-color); padding:1.25rem; border-radius:var(--radius-md); text-align:left; margin:1.5rem 0;">
          <h4 style="color:var(--accent-yellow); margin-bottom:0.5rem;">WHAT YOU HAVE MASTERED:</h4>
          <ul style="padding-left:1.25rem; font-size:0.9rem; color:var(--text-main);">
            <li>✓ Languages & Syntax differences (Python, Java, C++, PHP, Scratch)</li>
            <li>✓ Procedural line-by-line step execution (Cinema Ticket Machine & Robot)</li>
            <li>✓ Event-Driven triggers (Dark Mode website click events)</li>
            <li>✓ Object-Oriented concepts (DATA properties + BEHAVIOUR methods)</li>
            <li>✓ Graphical programming visual blocks</li>
            <li>✓ Practical Python IDE coding (Vending Machine program)</li>
          </ul>
        </div>

        <button class="btn btn-primary" id="btn-restart-final" style="padding:0.85rem 2rem; font-size:1.05rem;">Replay Lab 🔄</button>
      </div>
    `;

    modal.classList.add('is-active');
    document.getElementById('btn-restart-final')?.addEventListener('click', restartLab);
  }

  function restartLab() {
    state.currentMission = 1;
    state.score = 0;
    state.completedMissions.clear();
    state.awardedScores.clear();
    state.robotSequence = [...(DATA.mission3?.defaultSequence || [])];
    state.scratchSequence = [...(DATA.mission6?.scratchBlocks?.map(b => b.text) || [])];

    dom.resultsModal?.classList.remove('is-active');
    renderNavigation();
    renderCurrentMission();
    updateHeaderStats();
  }

  // =========================================================================
  // UTILITY HELPERS
  // =========================================================================
  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function highlightPythonSyntax(code) {
    if (!code) return '';
    let escaped = escapeHtml(code);
    escaped = escaped.replace(/(".*?"|'.*?')/g, '<span style="color:var(--accent-green);">$1</span>');
    escaped = escaped.replace(/\b(input|print)\b/g, '<span style="color:var(--accent-blue); font-weight:700;">$1</span>');
    escaped = escaped.replace(/\b(\d+)\b/g, '<span style="color:var(--accent-yellow);">$1</span>');
    return escaped;
  }

  function setupOptionCards(cards, onSelect) {
    cards.forEach(card => {
      card.addEventListener('click', () => {
        AUDIO.playClick();
        cards.forEach(c => {
          c.classList.remove('is-selected');
          c.classList.remove('is-wrong');
        });
        card.classList.add('is-selected');
        if (onSelect) onSelect(card);
      });
    });
  }

  function setupContainerSorting(container, onPlaceCallback) {
    let selectedCardId = null;
    const cards = container.querySelectorAll('.data-pill-card');
    const dropZones = container.querySelectorAll('.drop-container-box, .pool-drop-zone');

    cards.forEach(card => {
      card.setAttribute('draggable', 'true');

      card.addEventListener('dragstart', (e) => {
        AUDIO.playClick();
        selectedCardId = card.dataset.id;
        card.classList.add('is-selected');
        e.dataTransfer.setData('text/plain', card.dataset.id);
      });

      card.addEventListener('dragend', () => {
        card.classList.remove('is-selected');
      });

      card.addEventListener('click', (e) => {
        e.stopPropagation();
        AUDIO.playClick();
        cards.forEach(c => c.classList.remove('is-selected'));
        card.classList.add('is-selected');
        selectedCardId = card.dataset.id;
      });
    });

    dropZones.forEach(zone => {
      zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.style.opacity = '0.8';
      });

      zone.addEventListener('dragleave', () => {
        zone.style.opacity = '1';
      });

      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.style.opacity = '1';
        const cardId = e.dataTransfer.getData('text/plain') || selectedCardId;
        if (!cardId) return;

        AUDIO.playDrag();
        const containerId = zone.dataset.container;
        const cardEl = container.querySelector(`.data-pill-card[data-id="${cardId}"]`);

        if (cardEl) {
          cardEl.classList.remove('is-selected');
          const targetPool = zone.classList.contains('drop-container-box') 
            ? zone.querySelector('.container-items') 
            : zone;
          if (targetPool) targetPool.appendChild(cardEl);
          onPlaceCallback(cardId, containerId);
        }
        selectedCardId = null;
      });

      zone.addEventListener('click', () => {
        if (!selectedCardId) return;
        AUDIO.playDrag();
        const containerId = zone.dataset.container;
        const cardEl = container.querySelector(`.data-pill-card[data-id="${selectedCardId}"]`);

        if (cardEl) {
          cardEl.classList.remove('is-selected');
          const targetPool = zone.classList.contains('drop-container-box') 
            ? zone.querySelector('.container-items') 
            : zone;
          if (targetPool) targetPool.appendChild(cardEl);
          onPlaceCallback(cardId, containerId);
        }
        selectedCardId = null;
      });
    });
  }

})();
