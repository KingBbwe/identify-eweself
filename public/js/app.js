javascript
// app.js - Core Application Logic

// ======================
// DOM Element References
// ======================
const forgeButton = document.getElementById('forge-identity');
const renameButton = document.getElementById('rename-character');
const telegramButton = document.getElementById('telegram-button');
const resultDiv = document.getElementById('result');
const heritageResult = document.getElementById('heritage-result');
const innerWorld = document.getElementById('inner-world');
const shakeToggle = document.getElementById('shake-toggle');
const shakeStatus = document.getElementById('shake-status');

// =================
// Global Variables
// =================
let userSession = {};
let shakeToRollEnabled = false;
let lastShake = 0;
const SHAKE_THRESHOLD = 15;

// ======================
// Core Utility Functions
// ======================
function randomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function vibrate(duration) {
    if ("vibrate" in navigator) {
        navigator.vibrate(duration);
    }
}

// ======================
// Session Management
// ======================
function getSessionData() {
    let data = localStorage.getItem('idForgeSession');
    try {
        return data ? JSON.parse(data) : null;
    } catch (e) {
        return null;
    }
}

function setSessionData(data) {
    localStorage.setItem('idForgeSession', JSON.stringify(data));
}

function resetRollSession() {
    localStorage.removeItem('idForgeSession');
}

function updateRollSession() {
    const now = Date.now();
    let sessionData = getSessionData() || { firstRollTime: now, rollCount: 0 };
    
    if (now - sessionData.firstRollTime > 86400000) { // 24 hours
        sessionData = { firstRollTime: now, rollCount: 0 };
    }
    
    sessionData.rollCount++;
    setSessionData(sessionData);
    return sessionData.rollCount;
}

// ====================
// Device Motion Handling
// ====================
function handleMotion(event) {
    if (!shakeToRollEnabled) return;
    
    const acceleration = event.accelerationIncludingGravity || event.acceleration;
    if (!acceleration) return;
    
    const { x, y, z } = acceleration;
    const accelerationMagnitude = Math.sqrt(x*x + y*y + z*z) - 9.81;

    if (accelerationMagnitude > SHAKE_THRESHOLD) {
        const now = Date.now();
        if (now - lastShake > 1000) {
            forgeIdentity();
            vibrate(200);
            lastShake = now;
        }
    }
}

// Initialize device motion listeners
function initDeviceMotion() {
    if (typeof DeviceMotionEvent !== 'undefined' && 
        typeof DeviceMotionEvent.requestPermission === 'function') {
        
        shakeToggle.addEventListener("click", async function(e) {
            if (this.checked && !shakeToRollEnabled) {
                try {
                    const permission = await DeviceMotionEvent.requestPermission();
                    if (permission === 'granted') {
                        window.addEventListener('devicemotion', handleMotion);
                        shakeToRollEnabled = true;
                        shakeStatus.innerText = "Enabled";
                        vibrate(100);
                    } else {
                        this.checked = false;
                        shakeStatus.innerText = "Permission Denied";
                    }
                } catch (error) {
                    console.error("Permission error:", error);
                    this.checked = false;
                    shakeStatus.innerText = "Enable in Settings";
                }
            } else {
                window.removeEventListener('devicemotion', handleMotion);
                shakeToRollEnabled = false;
                this.checked = false;
                shakeStatus.innerText = "Disabled";
            }
        });
    } else {
        shakeToggle.addEventListener("change", function() {
            shakeToRollEnabled = this.checked;
            shakeStatus.innerText = this.checked ? "Enabled" : "Disabled";
            if (this.checked) {
                window.addEventListener('devicemotion', handleMotion);
            } else {
                window.removeEventListener('devicemotion', handleMotion);
            }
        });
    }
}

// ====================
// Name Generation
// ====================
function generateName(hexagramOverride) {
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const hexagram = hexagramOverride || Math.floor(Math.random() * 64) + 1;
    
    if (!hexagramData[hexagram]) {
        resultDiv.textContent = "Hexagram data not found";
        return;
    }
    
    userSession.originalHexagram = hexagram;
    userSession.renames = 5;
    userSession.syllableCount = hexagram < 9 ? 2 : hexagram < 33 ? 3 : 4;
    
    const { consonants, vowels, name: hexName } = hexagramData[hexagram];
    let nameParts = [];
    
    for (let i = 0; i < userSession.syllableCount - 1; i++) {
        const con = consonants[Math.floor(Math.random() * consonants.length)];
        const vow = vowels[Math.floor(Math.random() * vowels.length)];
        nameParts.push(i === 0 ? con.toUpperCase() + vow : con + vow);
    }
    
    const suffixPool = gender === 'ewe' 
        ? ["ia", "elle", "ora", "yn", "ala"] 
        : ["on", "ath", "orn", "rak", "thos"];
    
    nameParts.push(suffixPool[Math.floor(Math.random() * suffixPool.length)]);
    const fullName = nameParts.join('');
    
    userSession.name = fullName;
    resultDiv.innerHTML = `
        <div class="name-reveal">
            <div class="hex-source">
                <span class="hex">Hexagram ${hexagram}</span>
                <span class="hex-name">${hexName}</span>
            </div>
            <div class="generated-name">${fullName}</div>
        </div>`;
}

// ====================
// Core Identity Generation
// ====================
function forgeIdentity() {
    // Session tracking
    const rollCount = updateRollSession();
    const penalty = rollCount > 2 ? rollCount - 2 : 0;
    
    // Generate components
    generateName();
    generateHeritage(penalty);
    generateInnerWorld();
    
    // Display sections
    heritageResult.style.display = "block";
    innerWorld.style.display = "block";
}

function generateHeritage(penalty = 0) {
    const lineage = randomElement(lineages);
    const tribe = randomElement(tribes);
    const effectiveSurplus = lineage.surplus - penalty;

    // Build heritage HTML
    const heritageHTML = `
        <h2>${lineage.name} <span class="badge ${lineage.type.toLowerCase().replace(' ', '-')}">${lineage.type}</span></h2>
        <div class="lineage-description">${lineage.description}</div>
        <h3>Native Skills</h3>
        <ul class="lineage-skills">
            ${lineage.traits.map(t => `<li class="trait-pill">${t}</li>`).join('')}
        </ul>
        <p><strong>Role:</strong> ${lineage.role}</p>
        <h3>Base Attributes</h3>
        <ul class="base-attributes">
            ${Object.entries(lineage.baseAttributes).map(([attr, val]) => `
                <li><strong>${attr}:</strong> ${val}</li>
            `).join('')}
        </ul>
        <p><strong>Surplus:</strong> ${effectiveSurplus}</p>
        <div class="bloodline-divider">Tribal Affiliation</div>
        <div class="tribe-section">
            <h4><i class="fa fa-users"></i> ${tribe.name}</h4>
            <p><i class="fa fa-language"></i> <strong>Tongue:</strong> ${tribe.tongue}</p>
            <p><i class="fa fa-balance-scale"></i> <strong>Resonance:</strong> ${tribe.resonance}</p>
            <p><i class="fa fa-magic"></i> <strong>Effect:</strong> ${tribe.effect}</p>
            <p><i class="fa fa-scroll"></i> <strong>Ethos:</strong> ${tribe.ethos}</p>
            <p><i class="fa fa-coins"></i> <strong>Power Cost:</strong> ${tribe.powerCost}</p>
            <p><i class="fa fa-bolt"></i> <strong>Critical Effect:</strong> ${tribe.criticalEffect}</p>
            <p><i class="fa fa-fire"></i> <strong>Burn:</strong> ${tribe.burn}</p>
        </div>`;
    
    heritageResult.innerHTML = heritageHTML;
}

function generateInnerWorld() {
    const soulPattern = randomElement(soulPatterns);
    const [consciousTrait, unconsciousTrait] = shuffle([...coreTraits]).slice(0, 2);
    const trajectory = randomElement(trajectories);

    // Soul Pattern
    document.getElementById("soul-pattern").innerHTML = `
        <div class="soul-info">
            <div class="soul-pattern-heading">${soulPattern.pattern}</div>
            <p class="personality-profile">${soulPattern.profile}</p>
        </div>`;

    // Core Traits
    document.querySelector(".core-traits .conscious").innerHTML = `
        <h4>Conscious</h4>
        <p><strong>${consciousTrait.trait}:</strong> ${consciousTrait.description} (Hexagram ${consciousTrait.hexagram})</p>`;
    
    document.querySelector(".core-traits .unconscious").innerHTML = `
        <h4>Unconscious</h4>
        <p><strong>${unconsciousTrait.trait}:</strong> ${unconsciousTrait.description} (Hexagram ${unconsciousTrait.hexagram})</p>`;

    // Trajectory
    let trajectoryHTML = `<h3>Character Journey</h3><p class="age-band">Age Band: ${trajectory.ageBand}</p>`;
    
    if (trajectory.ageBand === "0-50") {
        trajectoryHTML += `
            <div class="journey-path">
                <span class="from">${trajectory.fromName}</span>
                <span class="arrow">--></span>
                <span class="to">${trajectory.toName}</span>
            </div>
            <p class="process">${trajectory.process}</p>
            <blockquote class="perspective">"${trajectory.perspective}"</blockquote>`;
    } else {
        trajectoryHTML += `
            <div class="journey-path">
                <span class="from">${trajectory.currentName}</span>
                <span class="arrow">--></span>
                <span class="to">${trajectory.reflectingName}</span>
            </div>
            <blockquote class="perspective">"${trajectory.perspective}"</blockquote>
            ${trajectory.reflection ? `<div class="reflection"><p>${trajectory.reflection}</p></div>` : ''}`;
    }
    
    document.getElementById("trajectory").innerHTML = trajectoryHTML;

    // Hexagram Matrix
    const trajectoryAHex = trajectory.ageBand === "0-50" ? trajectory.fromHex : trajectory.currentHex;
    const trajectoryBHex = trajectory.ageBand === "0-50" ? trajectory.toHex : trajectory.reflectingHex;
    
    document.querySelectorAll("#intellectual-dc, #prime-dc").forEach(el => 
        el.textContent = consciousTrait.hexagram);
    document.querySelectorAll("#physical-dc, #second-dc").forEach(el => 
        el.textContent = unconsciousTrait.hexagram);
    document.querySelectorAll("#emotional-dc, #third-dc").forEach(el => 
        el.textContent = trajectoryAHex);
    document.querySelectorAll("#spiritual-dc, #fourth-dc").forEach(el => 
        el.textContent = trajectoryBHex);
}

// ====================
// Event Listeners
// ====================
document.addEventListener("DOMContentLoaded", () => {
    initDeviceMotion();
    forgeButton.addEventListener("click", forgeIdentity);
    renameButton.addEventListener("click", () => {
        if (userSession.originalHexagram) {
            generateName(userSession.originalHexagram);
        }
    });
});

// ====================
// Utility Functions
// ====================
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
