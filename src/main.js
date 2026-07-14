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

// ===== VIMEO IFRAME LOAD GUARD =====
document.addEventListener('DOMContentLoaded', function() {
  const pv = document.querySelector('.project-video');
  if (!pv) return;
  const iframe = pv.querySelector('iframe');
  // build a safe link to the Vimeo page from the iframe src (if present)
  let vimeoPage = 'https://vimeo.com/1209689826';
  if (iframe && iframe.src) {
    const m = iframe.src.match(/video\/(\d+)/);
    if (m) vimeoPage = `https://vimeo.com/${m[1]}`;
  }

  const overlay = document.createElement('div');
  overlay.className = 'video-overlay';
  overlay.innerHTML = `<a class="video-overlay-link" href="${vimeoPage}" target="_blank" rel="noopener noreferrer">Open video on Vimeo</a>`;
  pv.appendChild(overlay);

  let loaded = false;
  if (iframe) {
    iframe.addEventListener('load', () => {
      loaded = true;
      overlay.style.display = 'none';
    });
    // if load doesn't fire within 4s, show overlay (covers blocked/slow embeds)
    setTimeout(() => {
      if (!loaded) overlay.style.display = 'flex';
    }, 4000);
  } else {
    overlay.style.display = 'flex';
  }
});