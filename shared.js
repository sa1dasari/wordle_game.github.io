// ── shared.js — loaded by all WordForge pages ─────────────────────────────────
// Handles: hamburger menu, How to Play modal
// Each page includes: <script src="shared.js"></script>

(function () {
    'use strict';

    // ── How to Play modal ─────────────────────────────────────────────────────
    function initModal() {
        const overlay  = document.getElementById('modalOverlay');
        const helpBtn  = document.getElementById('helpBtn');
        const helpBtnM = document.getElementById('helpBtnMobile');
        const closeBtn = document.getElementById('modalClose');
        if (!overlay) return;

        const openModal  = () => overlay.classList.add('open');
        const closeModal = () => overlay.classList.remove('open');

        if (helpBtn)  helpBtn.addEventListener('click',  openModal);
        if (helpBtnM) helpBtnM.addEventListener('click', openModal);
        if (closeBtn) closeBtn.addEventListener('click', closeModal);

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });

        // Auto-open on first visit (only on pages that opt in via data attribute)
        const modal = overlay.querySelector('.modal');
        if (modal && modal.dataset.autoOpen === 'true') {
            const key = 'wordforge_rules_seen';
            if (!localStorage.getItem(key)) {
                openModal();
                localStorage.setItem(key, '1');
            }
        }
    }

    // ── Hamburger menu ────────────────────────────────────────────────────────
    function initHamburger() {
        const btn      = document.getElementById('hamburgerBtn');
        const dropdown = document.getElementById('navDropdown');
        if (!btn || !dropdown) return;

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = !dropdown.classList.contains('open');
            dropdown.classList.toggle('open', isOpen);
            btn.classList.toggle('open', isOpen);
        });

        dropdown.addEventListener('click', () => {
            dropdown.classList.remove('open');
            btn.classList.remove('open');
        });

        document.addEventListener('click', (e) => {
            if (!btn.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.remove('open');
                btn.classList.remove('open');
            }
        });
    }

    // ── Init on DOM ready ─────────────────────────────────────────────────────
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initModal();
            initHamburger();
        });
    } else {
        initModal();
        initHamburger();
    }
})();