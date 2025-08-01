
let topZ = 1000; // Global z-index tracker

function openFullImage(imageSrc) {
  const viewer = document.getElementById('fullImageViewer');
  const fullImage = document.getElementById('fullImage');
  fullImage.src = imageSrc;
  viewer.classList.remove('hidden');
}
window.openFullImage = openFullImage;

function getRandomPosition(popupWidth, popupHeight) {
  const padding = 20; // Prevents popup from touching the edge
  const maxLeft = window.innerWidth - popupWidth - padding;
  const maxTop = window.innerHeight - popupHeight - padding;
  const left = Math.floor(Math.random() * (maxLeft - padding) + padding);
  const top = Math.floor(Math.random() * (maxTop - padding) + padding);
  return { left, top };
}

function makeDraggable(popupSelector, headerSelector) {
  const popup = document.querySelector(popupSelector);
  const header = document.querySelector(headerSelector);

  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;

  if (!popup || !header) {
    console.warn(`Draggable setup failed: ${popupSelector} or ${headerSelector} not found.`);
    return;
  }

  header.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - popup.offsetLeft;
    offsetY = e.clientY - popup.offsetTop;
    header.style.cursor = "grabbing";
    topZ += 1;
    popup.style.zIndex = topZ;
    document.body.style.userSelect = "none";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    let newLeft = e.clientX - offsetX;
    let newTop = e.clientY - offsetY;

    // Clamp so header stays fully visible in the viewport (top and bottom)
    const headerHeight = header.offsetHeight;
    const minLeft = 0;
    const maxLeft = window.innerWidth - popup.offsetWidth;
    const minTop = 0;
    const maxTop = window.innerHeight - headerHeight;

    newLeft = Math.min(Math.max(newLeft, minLeft), maxLeft);
    newTop = Math.min(Math.max(newTop, minTop), maxTop);

    popup.style.left = `${newLeft}px`;
    popup.style.top = `${newTop}px`;
  });

  document.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      header.style.cursor = "grab";
      document.body.style.userSelect = "";
    }
  });

  popup.addEventListener("mousedown", () => {
    topZ += 1;
    popup.style.zIndex = topZ;
  });
}


function openPopup(popupSelector, headerSelector) {
  const popup = document.querySelector(popupSelector);
  if (!popup) return;

  popup.classList.remove('hidden');
  popup.classList.add('retroPopup-fadein');
  popup.style.zIndex = 9999;

  topZ += 1;
  popup.style.zIndex = topZ;

  const popupWidth = popup.offsetWidth;
  const popupHeight = popup.offsetHeight;
  const { left, top } = getRandomPosition(popupWidth, popupHeight);
  popup.style.left = `${left}px`;
  popup.style.top = `${top}px`;



  popup.addEventListener('animationend', function handler() {
    popup.classList.remove('retroPopup-fadein');
    popup.removeEventListener('animationend', handler);
  });
}

function closePopup(popupSelector) {
  const popup = document.querySelector(popupSelector);
  if (!popup) return;

  popup.classList.add('retroPopup-close');
  popup.addEventListener('animationend', function handler() {
    popup.classList.remove('retroPopup-close');
    popup.classList.add('hidden');
    popup.removeEventListener('animationend', handler);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  makeDraggable('#aboutPopup', '#aboutHeader');
  makeDraggable('#galleryPopup', '#galleryHeader');
  makeDraggable('#contactPopup', '#contactHeader');

  // About
  const aboutBtn = document.getElementById('openAboutBtn');
  if (aboutBtn) {
    aboutBtn.addEventListener('click', () => {
      openPopup('#aboutPopup', '#aboutHeader');
    });
  }

  // Gallery
  const galleryBtn = document.getElementById('openGalleryBtn');
  if (galleryBtn) {
    galleryBtn.addEventListener('click', () => {
      openPopup('#galleryPopup', '#galleryHeader');
    });
  }


  // Contact
  const contactBtn = document.getElementById('openContactBtn');
  if (contactBtn) {
    contactBtn.addEventListener('click', () => {
      openPopup('#contactPopup', '#contactHeader');
    });
  }
});
// Contact Formspree AJAX handler
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('form-success');
const resendBtn = document.getElementById('resend-btn');

if (contactForm) {
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const response = await fetch(form.action, {
      method: form.method,
      body: data,
      headers: { 'Accept': 'application/json' }
    });
    if (response.ok) {
      form.style.display = 'none';
      if (formSuccess) formSuccess.style.display = 'block';
    }
  });
}

if (resendBtn) {
  resendBtn.addEventListener('click', function () {
    if (contactForm) {
      contactForm.reset();
      contactForm.style.display = '';
    }
    if (formSuccess) formSuccess.style.display = 'none';
  });
}
// Sparkle animation for tool buttons
document.querySelectorAll('.tools-section-grid .tool-retro-button').forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    btn.classList.remove('sparkle');
    void btn.offsetWidth;
    btn.classList.add('sparkle');
  });
});


window.closePopup = closePopup;