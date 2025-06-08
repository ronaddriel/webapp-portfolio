import './style.css';

let topZ = 1000; // Global z-index tracker

function getRandomPosition(popupWidth, popupHeight) {
  const padding = 40; // Prevents popup from touching the edge
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
  });

  header.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - popup.offsetLeft;
    offsetY = e.clientY - popup.offsetTop;
    header.style.cursor = "grabbing";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    popup.style.left = `${e.clientX - offsetX}px`;
    popup.style.top = `${e.clientY - offsetY}px`;
  });

  document.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      header.style.cursor = "grab";
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