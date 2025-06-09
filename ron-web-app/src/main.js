import './style.css';

let topZ = 1000; // Global z-index tracker

function getRandomPosition(popupWidth, popupHeight) {
  const padding = 20; // Prevents popup from touching the edge
  const maxLeft = window.innerWidth - popupWidth - padding;
  const maxTop = window.innerHeight - popupHeight - padding;
  const left = Math.floor(Math.random() * (maxLeft - padding) + padding);
  const top = Math.floor(Math.random() * (maxTop - padding) + padding);
  return { left, top };
}

export function makeDraggable(popupSelector, headerSelector) {
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

window.closePopup = closePopup;