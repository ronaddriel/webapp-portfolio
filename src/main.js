// ===== HAMBURGER MENU TOGGLE =====
(function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.main-nav');
    
    if (!hamburger || !navMenu) return;
    
    function toggleMenu() {
      const expanded = navMenu.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', expanded);
    }
    
    hamburger.addEventListener('click', toggleMenu);
    
    
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
    
    document.addEventListener('click', function(event) {
      if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
})();

// ===== SCROLLING BANNER AUTO-DUPLICATOR =====
(function() {
    const container = document.querySelector('.scrolling-text');
    if (!container) return;
    const spans = Array.from(container.children);
    const duplicateUntil = () => {
      const viewportWidth = window.innerWidth;
      while (container.scrollWidth < viewportWidth * 1.5) {
        spans.forEach(span => {
          container.appendChild(span.cloneNode(true));
        });
      }
    };
    duplicateUntil();
    window.addEventListener('resize', duplicateUntil);
})();

// ===== HASH-BASED PAGE ROUTING (if using single-page setup) =====
function showPage() {
    let hash = window.location.hash.substring(1);
    const validPages = ['home', 'about', 'contact', 'resume'];
    if (!validPages.includes(hash)) {
      hash = 'home';
    }
    document.querySelectorAll('.page-section').forEach(section => {
      section.style.display = 'none';
    });
    const activeSection = document.getElementById(hash);
    if (activeSection) {
      activeSection.style.display = 'block';
    }
}
showPage();
window.addEventListener('hashchange', showPage);

// ===== CONTACT FORM HANDLER =====
const form = document.getElementById('contactForm');
const statusDiv = document.getElementById('formStatus');
if (form && statusDiv) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userEmail = document.getElementById('user_email')?.value;
    const message = document.getElementById('message')?.value;
    if (!userEmail || !message) {
      statusDiv.innerText = '❌ Both fields are required.';
      statusDiv.style.color = '#c00';
      return;
    }
    document.getElementById('replyto').value = userEmail;
    const formData = new FormData(form);
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });
      const result = await response.json();
      if (result.success) {
        statusDiv.innerText = '✓ Message sent! I’ll reply soon.';
        statusDiv.style.color = '#0a0';
        form.reset();
      } else {
        statusDiv.innerText = '❌ Error sending. Try again later.';
        statusDiv.style.color = '#c00';
      }
    } catch (err) {
      statusDiv.innerText = '❌ Network error. Please check your connection.';
      statusDiv.style.color = '#c00';
    }
  });
}

// ===== EXPANDABLE IMAGES MODAL =====
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('expandedImage');
  const closeBtn = document.querySelector('.modal-close');
  if (!modal || !modalImg || !closeBtn) return;

  const expandableImages = document.querySelectorAll('.expandable-img');
  expandableImages.forEach(img => {
    img.addEventListener('click', () => {
    
      const fullSrc = img.getAttribute('data-full') || img.src;
      modalImg.src = fullSrc;
      modal.style.display = 'block';
    });
  });

  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });
});