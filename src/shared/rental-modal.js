/**
 * WEDELIA Shared Garment Detail & Rental Configurator
 * Connects all five worlds to one underlying garment and rental reality.
 */

import { getGarmentById, GARMENTS, OCCASIONS } from '../data/wardrobe.js';
import gsap from 'gsap';

// Unified Client-Side State
export const rentalState = {
  activeGarment: null,
  selectedOccasion: null,
  selectedSize: null,
  selectedDuration: 3,
  selectedPrice: 0,
  activeWorld: 'read', // read | index | chase | contemplate | navigate
  step: 'detail' // detail | confirm
};

const WORLD_VERBS = {
  read: {
    tag: '01 READ // TOKYO EDITORIAL FOLIO',
    action: 'PIN TO ORDER SLIP // 注文票へ転写',
    stamp: 'PUBLICATION DISPATCH RESERVED',
    confirmHeader: 'LOOK RESERVED ON EDITORIAL SLIP'
  },
  index: {
    tag: '02 INDEX // ARCHIVE SPECIMEN REGISTRY',
    action: 'PUNCH DISPATCH VOUCHER // FORM WDL-8891',
    stamp: 'ACCESSIONS PROTOCOL VALIDATED',
    confirmHeader: 'DISPATCH MANIFEST LOCKED'
  },
  chase: {
    tag: '03 CHASE // TOKYO NOCTURNE DROP',
    action: 'LOCK INTO NIGHT DROP // 23:47',
    stamp: 'DOOR PASS ISSUED // NCR GATEWAY',
    confirmHeader: 'NIGHT LOOK DISPATCHED'
  },
  contemplate: {
    tag: '04 CONTEMPLATE // JAPANESE EXHIBITION LOAN',
    action: 'ACQUIRE TEMPORARY CUSTODY SEAL',
    stamp: '【受託済】 TEMPORARY CUSTODY REGISTERED',
    confirmHeader: 'CUSTODY CEREMONY COMPLETE'
  },
  navigate: {
    tag: '10 NAVIGATE // SPATIAL CONVERGENCE ALLOCATION',
    action: 'CONVERGE & ALLOCATE COORDINATE',
    stamp: 'COORDINATE LOCK [X:04.27, Y:12.80, Z:+03.14]',
    confirmHeader: 'SPATIAL SPECIMEN ALLOCATED'
  }
};

let backdropEl = null;
let modalEl = null;

function ensureModalDOM() {
  if (backdropEl && modalEl) return;

  backdropEl = document.createElement('div');
  backdropEl.className = 'wd-rental-backdrop';
  backdropEl.id = 'wdRentalBackdrop';

  modalEl = document.createElement('div');
  modalEl.className = 'wd-rental-modal';
  modalEl.id = 'wdRentalModal';

  backdropEl.appendChild(modalEl);
  document.body.appendChild(backdropEl);

  // Close on backdrop click outside modal
  backdropEl.addEventListener('click', (e) => {
    if (e.target === backdropEl) {
      closeRentalModal();
    }
  });

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdropEl.classList.contains('active')) {
      closeRentalModal();
    }
  });
}

export function openRentalModal(garmentId = 'WD-001', world = 'read', defaultOccasion = null) {
  ensureModalDOM();

  const garment = getGarmentById(garmentId);
  rentalState.activeGarment = garment;
  rentalState.activeWorld = WORLD_VERBS[world] ? world : 'read';
  rentalState.selectedOccasion = defaultOccasion || garment.occasions[0] || 'FRESHERS';
  rentalState.selectedSize = garment.availableSizes[0] || 'M';
  rentalState.selectedDuration = 3;
  rentalState.step = 'detail';

  // Calculate base price
  const opt = garment.rentalOptions.find(o => o.days === 3) || garment.rentalOptions[0];
  rentalState.selectedPrice = opt ? opt.price : 2999;

  renderModalContent();

  modalEl.setAttribute('data-world', rentalState.activeWorld);
  backdropEl.classList.add('active');

  // Trigger signature world-specific opening animation
  executeSignatureEntry(rentalState.activeWorld);
}

export function closeRentalModal() {
  if (!backdropEl) return;

  gsap.to(modalEl, {
    scale: 0.96,
    opacity: 0,
    duration: 0.25,
    ease: 'power2.in',
    onComplete: () => {
      backdropEl.classList.remove('active');
      gsap.set(modalEl, { clearProps: 'all' });
      rentalState.step = 'detail';
    }
  });
}

function executeSignatureEntry(world) {
  const tl = gsap.timeline();

  if (world === 'read') {
    // 01 READ: Physical paper folio unfold
    gsap.fromTo(modalEl, 
      { rotateY: -10, scale: 0.96, opacity: 0, transformOrigin: 'left center' },
      { rotateY: 0, scale: 1, opacity: 1, duration: 0.45, ease: 'power3.out' }
    );
  } else if (world === 'index') {
    // 02 INDEX: Stepped mechanical shutter slide
    gsap.fromTo(modalEl,
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.35, ease: 'steps(6)' }
    );
  } else if (world === 'chase') {
    // 03 CHASE: Razor-wipe impact
    gsap.fromTo(modalEl,
      { x: 40, scale: 0.98, opacity: 0 },
      { x: 0, scale: 1, opacity: 1, duration: 0.3, ease: 'power4.out' }
    );
  } else if (world === 'contemplate') {
    // 04 CONTEMPLATE: Slow scroll unroll
    gsap.fromTo(modalEl,
      { scaleY: 0.92, opacity: 0, transformOrigin: 'top center' },
      { scaleY: 1, opacity: 1, duration: 0.55, ease: 'power2.out' }
    );
  } else if (world === 'navigate') {
    // 10 NAVIGATE: Spatial 3D convergence
    gsap.fromTo(modalEl,
      { scale: 0.88, z: -120, opacity: 0 },
      { scale: 1, z: 0, opacity: 1, duration: 0.45, ease: 'back.out(1.4)' }
    );
  }
}

function renderModalContent() {
  const g = rentalState.activeGarment;
  const worldData = WORLD_VERBS[rentalState.activeWorld] || WORLD_VERBS.read;

  if (rentalState.step === 'confirm') {
    modalEl.innerHTML = `
      <div class="wd-modal-inner">
        <header class="wd-modal-header">
          <div class="wd-modal-world-tag">
            <span>⟐ ${worldData.tag}</span>
          </div>
          <button class="wd-modal-close-btn" id="wdCloseBtn">✕ CLOSE</button>
        </header>

        <div class="wd-confirmation-view active">
          <div class="wd-confirm-stamp">${worldData.stamp}</div>
          <h2 class="wd-confirm-title">${worldData.confirmHeader}</h2>
          <div class="wd-confirm-specimen-id">${g.id} // ${g.specimenCode}</div>

          <div class="wd-confirm-details-card">
            <div style="font-weight: 700; margin-bottom: 0.5rem; text-transform: uppercase;">
              RESERVATION SPECIFICATION LEDGER
            </div>
            <div><strong>GARMENT:</strong> ${g.name}</div>
            <div><strong>ATELIER:</strong> ${g.designer}</div>
            <div><strong>OCCASION:</strong> ${rentalState.selectedOccasion}</div>
            <div><strong>SIZE ALLOCATION:</strong> ${rentalState.selectedSize} (Dual-Fit Sizing Accommodated)</div>
            <div><strong>LEASE DURATION:</strong> ${rentalState.selectedDuration} NIGHTS</div>
            <div><strong>ESTIMATED TARIFF:</strong> ₹${rentalState.selectedPrice.toLocaleString()} [₹0 Damage Shield]</div>
            <div style="margin-top: 0.5rem; font-size: 0.65rem; color: #888;">
              COURIER GATEWAY: 24-HOUR PRIOR CAMPUS RESIDENTIAL GATE DISPATCH
            </div>
          </div>

          <p class="wd-confirm-disclaimer">
            * This is an interactive visual prototype of the WEDELIA leased luxury experience. No real monetary transactions or deliveries will occur.
          </p>

          <div class="wd-action-btn-row">
            <button class="wd-primary-rent-btn" id="wdBackToWorldBtn" style="justify-content: center;">
              <span>RETURN TO WORLD</span>
            </button>
            <a href="wardrobe.html" class="wd-primary-rent-btn" style="justify-content: center; text-decoration: none;">
              <span>EXPLORE WARDROBE ⟶</span>
            </a>
          </div>
        </div>
      </div>
    `;

    document.getElementById('wdCloseBtn')?.addEventListener('click', closeRentalModal);
    document.getElementById('wdBackToWorldBtn')?.addEventListener('click', closeRentalModal);
    return;
  }

  // Detail & Selection Configurator View
  modalEl.innerHTML = `
    <div class="wd-modal-inner">
      <header class="wd-modal-header">
        <div class="wd-modal-world-tag">
          <span>⟐ ${worldData.tag}</span>
        </div>
        <button class="wd-modal-close-btn" id="wdCloseBtn">✕ CLOSE</button>
      </header>

      <div class="wd-modal-body-split">
        <!-- Left Column: Primary Garment Specimen -->
        <div class="wd-garment-showcase-col">
          <div class="wd-garment-img-frame">
            <img src="${g.image}" alt="${g.name}">
          </div>
          <div class="wd-garment-specimen-bar">
            <span>SPECIMEN // ${g.id}</span>
            <span>ACCESSION ${g.accessionDate}</span>
          </div>
        </div>

        <!-- Right Column: Editorial Details & Configurator -->
        <div class="wd-garment-config-col">
          <div class="wd-garment-title-wrap">
            <h2>${g.name}</h2>
            <div class="wd-garment-designer">${g.designer}</div>
            <p class="wd-garment-desc">${g.description}</p>
          </div>

          <!-- Step 1: Occasion -->
          <div class="wd-selection-step">
            <span class="wd-step-label">1. SELECT OCCASION // DRESS THE MOMENT</span>
            <div class="wd-options-pills" id="wdOccasionPills">
              ${g.occasions.map(occ => `
                <button class="wd-option-pill ${occ === rentalState.selectedOccasion ? 'active' : ''}" data-occasion="${occ}">
                  ${occ}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Step 2: Size -->
          <div class="wd-selection-step">
            <span class="wd-step-label">2. SELECT SIZE // DUAL-FIT SISTERS</span>
            <div class="wd-options-pills" id="wdSizePills">
              ${g.availableSizes.map(sz => `
                <button class="wd-option-pill ${sz === rentalState.selectedSize ? 'active' : ''}" data-size="${sz}">
                  SIZE ${sz}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Step 3: Duration -->
          <div class="wd-selection-step">
            <span class="wd-step-label">3. LEASE DURATION // CAMPUS DISPATCH</span>
            <div class="wd-options-pills" id="wdDurationPills">
              ${g.rentalOptions.map(opt => `
                <button class="wd-option-pill ${opt.days === rentalState.selectedDuration ? 'active' : ''}" data-days="${opt.days}" data-price="${opt.price}">
                  ${opt.days} NIGHTS — ₹${opt.price.toLocaleString()}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Live Rental Summary Ledger -->
          <div class="wd-rental-ledger-box">
            <div class="wd-ledger-row">
              <span>SELECTED SPECIMEN:</span>
              <strong id="ledgerGarmentName">${g.name}</strong>
            </div>
            <div class="wd-ledger-row">
              <span>DESIGNATED OCCASION:</span>
              <strong id="ledgerOccasion">${rentalState.selectedOccasion}</strong>
            </div>
            <div class="wd-ledger-row">
              <span>REQUESTED SIZE:</span>
              <strong id="ledgerSize">${rentalState.selectedSize}</strong>
            </div>
            <div class="wd-ledger-row">
              <span>LEASE DURATION:</span>
              <strong id="ledgerDuration">${rentalState.selectedDuration} NIGHTS</strong>
            </div>
            <div class="wd-ledger-row total-row">
              <span>TOTAL ESTIMATE:</span>
              <span id="ledgerPrice">₹${rentalState.selectedPrice.toLocaleString()}</span>
            </div>
          </div>

          <div class="wd-action-btn-row">
            <button class="wd-primary-rent-btn" id="wdConfirmRentBtn">
              <span>${worldData.action}</span>
              <span>⟶</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach Event Listeners
  document.getElementById('wdCloseBtn')?.addEventListener('click', closeRentalModal);

  // Occasion Pill Clicks
  document.querySelectorAll('#wdOccasionPills .wd-option-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#wdOccasionPills .wd-option-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      rentalState.selectedOccasion = btn.dataset.occasion;
      const el = document.getElementById('ledgerOccasion');
      if (el) el.textContent = rentalState.selectedOccasion;
    });
  });

  // Size Pill Clicks
  document.querySelectorAll('#wdSizePills .wd-option-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#wdSizePills .wd-option-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      rentalState.selectedSize = btn.dataset.size;
      const el = document.getElementById('ledgerSize');
      if (el) el.textContent = rentalState.selectedSize;
    });
  });

  // Duration Pill Clicks
  document.querySelectorAll('#wdDurationPills .wd-option-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#wdDurationPills .wd-option-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      rentalState.selectedDuration = parseInt(btn.dataset.days, 10);
      rentalState.selectedPrice = parseInt(btn.dataset.price, 10);

      const durEl = document.getElementById('ledgerDuration');
      const prcEl = document.getElementById('ledgerPrice');
      if (durEl) durEl.textContent = `${rentalState.selectedDuration} NIGHTS`;
      if (prcEl) prcEl.textContent = `₹${rentalState.selectedPrice.toLocaleString()}`;
    });
  });

  // Confirm Button Action
  document.getElementById('wdConfirmRentBtn')?.addEventListener('click', () => {
    rentalState.step = 'confirm';
    renderModalContent();
  });
}

// Global Auto-Initialization
export function initSharedRentalListeners() {
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-rent-garment], .open-rental-btn');
    if (!trigger) return;

    e.preventDefault();
    const garmentId = trigger.dataset.rentGarment || 'WD-001';
    const world = trigger.dataset.rentWorld || document.body.dataset.world || 'read';
    const occasion = trigger.dataset.rentOccasion || null;

    openRentalModal(garmentId, world, occasion);
  });

  // Check URL parameters for direct link sharing
  const params = new URLSearchParams(window.location.search);
  const paramGarment = params.get('garment') || params.get('rent');
  const paramWorld = params.get('world');
  const paramOccasion = params.get('occasion');

  if (paramGarment) {
    setTimeout(() => {
      openRentalModal(paramGarment, paramWorld || document.body.dataset.world || 'read', paramOccasion);
    }, 400);
  }
}

// Expose on window for easy interoperability
if (typeof window !== 'undefined') {
  window.openWedeliaRentalModal = openRentalModal;
  window.closeWedeliaRentalModal = closeRentalModal;
  window.rentalState = rentalState;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSharedRentalListeners);
  } else {
    initSharedRentalListeners();
  }
}
