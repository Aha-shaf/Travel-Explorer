/* 1. SETTINGS -------------------------------------------------------------- */

// WhatsApp number in international format: country code + number, digits only.
// Change this one value and every WhatsApp link on the page follows.
const WHATSAPP_NUMBER = "917397625039";

// Message that is already typed in the WhatsApp chat window.
const WHATSAPP_MESSAGE =
  "Hi Travel Explorer! I would like to know more about your travel packages.";

// Address used by the contact form and the booking "Send by email" button.
const CONTACT_EMAIL = "contact@travelexplorer.com";


/* 2. MOBILE NAVIGATION MENU ------------------------------------------------ */

const navToggle = document.getElementById("navToggle");
const navList = document.getElementById("navList");
const navLinks = document.querySelectorAll(".nav-link");

navToggle.addEventListener("click", function () {
  // classList.toggle returns true when the class was added
  const isOpen = navList.classList.toggle("open");

  navToggle.classList.toggle("open", isOpen);
  navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
});

// Close the menu after a link is tapped, otherwise it stays on top of the page
navLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    navList.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});


/* 3. ACTIVE NAVIGATION LINK WHILE SCROLLING -------------------------------- */

const sections = document.querySelectorAll("main section");

function highlightNavLink() {
  // 120px of extra room, roughly the height of the sticky header
  const scrollPosition = window.scrollY + 120;
  let currentSectionId = "home";

  // The last section that starts above the scroll position is the one we see
  sections.forEach(function (section) {
    if (section.offsetTop <= scrollPosition) {
      currentSectionId = section.id;
    }
  });

  navLinks.forEach(function (link) {
    const isCurrent = link.getAttribute("href") === "#" + currentSectionId;
    link.classList.toggle("active", isCurrent);
  });
}

window.addEventListener("scroll", highlightNavLink);
highlightNavLink(); // also run once when the page loads


/* 4. WHATSAPP LINKS -------------------------------------------------------- */

// Every link with the class "js-whatsapp" gets the same number and message.
document.querySelectorAll(".js-whatsapp").forEach(function (link) {
  link.href =
    "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(WHATSAPP_MESSAGE);
});


/* 5. DESTINATION FILTERS --------------------------------------------------- */

const filterButtons = document.querySelectorAll(".filter-btn");
const destinationCards = document.querySelectorAll(".destination-card");

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const filter = button.getAttribute("data-filter");

    // Mark the clicked button as the active one
    filterButtons.forEach(function (otherButton) {
      const isActive = otherButton === button;
      otherButton.classList.toggle("active", isActive);
      otherButton.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    // Show every card for "all", otherwise only the matching category
    destinationCards.forEach(function (card) {
      const category = card.getAttribute("data-category");
      const shouldShow = filter === "all" || category === filter;
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});


/* 6. BOOKING MODAL --------------------------------------------------------- */

const bookingModal = document.getElementById("bookingModal");
const bookingForm = document.getElementById("bookingForm");
const confirmationPanel = document.getElementById("confirmationPanel");
const destinationSelect = document.getElementById("destination");
const nameInput = document.getElementById("customerName");
const travelDateInput = document.getElementById("travelDate");
const modalCard = document.querySelector(".modal-card");

function openBookingModal(destination) {
  // Always start on the form, not on a confirmation from last time
  confirmationPanel.hidden = true;
  bookingForm.hidden = false;

  // Show the destination the visitor clicked on the destination card
  if (destination) {
    destinationSelect.value = destination;
  }

  bookingModal.classList.add("open");
  document.body.classList.add("no-scroll");
  nameInput.focus();
}

function closeBookingModal() {
  bookingModal.classList.remove("open");
  document.body.classList.remove("no-scroll");
}

// "Book Now" buttons carry their destination in a data attribute
document.querySelectorAll(".js-book").forEach(function (button) {
  button.addEventListener("click", function () {
    openBookingModal(button.getAttribute("data-destination"));
  });
});

// Buttons that open an empty booking form
document.querySelectorAll(".js-open-booking").forEach(function (button) {
  button.addEventListener("click", function () {
    openBookingModal();
  });
});

// The X button and the "Close" button in the confirmation message
document.querySelectorAll(".js-close-booking").forEach(function (button) {
  button.addEventListener("click", closeBookingModal);
});

// Clicking the dark area around the white card also closes the modal
bookingModal.addEventListener("click", function (event) {
  if (event.target.classList.contains("modal-backdrop")) {
    closeBookingModal();
  }
});


/* 7. BOOKING FORM VALIDATION ----------------------------------------------- */

// A simple email check: text, "@", text, ".", text and no spaces.
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone numbers may contain digits, spaces, "+" and "-"
const phonePattern = /^[0-9\s+-]{7,20}$/;

// Returns today's date as "YYYY-MM-DD" using the visitor's own time zone
function getTodayString() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return today.getFullYear() + "-" + month + "-" + day;
}

function showError(field, message) {
  const errorBox = document.getElementById(field.id + "Error");
  errorBox.textContent = message;
  field.classList.add("invalid");
}

function clearError(field) {
  const errorBox = document.getElementById(field.id + "Error");
  errorBox.textContent = "";
  field.classList.remove("invalid");
}

// Do not allow a travel date in the past
travelDateInput.min = getTodayString();

function validateBookingForm() {
  let isValid = true;

  // Name: at least two characters
  if (nameInput.value.trim().length < 2) {
    showError(nameInput, "Please enter your full name.");
    isValid = false;
  } else {
    clearError(nameInput);
  }

  // Email
  const emailInput = document.getElementById("email");
  if (!emailPattern.test(emailInput.value.trim())) {
    showError(emailInput, "Please enter a valid email address.");
    isValid = false;
  } else {
    clearError(emailInput);
  }

  // Phone
  const phoneInput = document.getElementById("phone");
  if (!phonePattern.test(phoneInput.value.trim())) {
    showError(phoneInput, "Please enter a valid phone number.");
    isValid = false;
  } else {
    clearError(phoneInput);
  }

  // Destination
  if (destinationSelect.value === "") {
    showError(destinationSelect, "Please choose a destination.");
    isValid = false;
  } else {
    clearError(destinationSelect);
  }

  // Number of travellers: whole numbers from 1 to 20
  const travellersInput = document.getElementById("travellers");
  const travellers = Number(travellersInput.value);
  if (travellers < 1 || travellers > 20) {
    showError(travellersInput, "Enter a number between 1 and 20.");
    isValid = false;
  } else {
    clearError(travellersInput);
  }

  // Travel date: required and not in the past
  if (travelDateInput.value === "") {
    showError(travelDateInput, "Please choose a travel date.");
    isValid = false;
  } else if (travelDateInput.value < getTodayString()) {
    showError(travelDateInput, "Please choose today or a later date.");
    isValid = false;
  } else {
    clearError(travelDateInput);
  }

  return isValid;
}

// Remove an error message as soon as the visitor starts correcting the field
bookingForm.querySelectorAll("input, select, textarea").forEach(function (field) {
  field.addEventListener("input", function () {
    clearError(field);
  });
});

bookingForm.addEventListener("submit", function (event) {
  // There is no back end here: the form is checked, then shown as a summary
  event.preventDefault();

  if (!validateBookingForm()) {
    // Jump to the first field that needs attention
    const firstInvalidField = bookingForm.querySelector(".invalid");
    if (firstInvalidField) {
      firstInvalidField.focus();
    }
    return;
  }

  showConfirmation();
});


/* 8. BOOKING CONFIRMATION AND SEND BUTTONS --------------------------------- */

// Turns "2026-12-05" into "5 December 2026"
function formatDate(dateString) {
  const date = new Date(dateString + "T00:00:00");

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Builds the plain text summary that is sent on WhatsApp or by email
function buildRequestMessage() {
  const destinationText =
    destinationSelect.options[destinationSelect.selectedIndex].text;
  const notes = document.getElementById("notes").value.trim();

  return [
    "Travel booking request",
    "----------------------",
    "Name: " + nameInput.value.trim(),
    "Destination: " + destinationText,
    "Travel date: " + formatDate(travelDateInput.value),
    "Travellers: " + document.getElementById("travellers").value,
    "Email: " + document.getElementById("email").value.trim(),
    "Phone: " + document.getElementById("phone").value.trim(),
    "Requirements: " + (notes === "" ? "None" : notes),
  ].join("\n");
}

function showConfirmation() {
  const destinationText =
    destinationSelect.options[destinationSelect.selectedIndex].text;
  const notes = document.getElementById("notes").value.trim();

  document.getElementById("confirmName").textContent = nameInput.value.trim();
  document.getElementById("confirmDestination").textContent = destinationText;
  document.getElementById("confirmDate").textContent = formatDate(
    travelDateInput.value
  );
  document.getElementById("confirmTravellers").textContent =
    document.getElementById("travellers").value;
  document.getElementById("confirmEmail").textContent =
    document.getElementById("email").value.trim();
  document.getElementById("confirmPhone").textContent =
    document.getElementById("phone").value.trim();
  document.getElementById("confirmNotes").textContent =
    notes === "" ? "None" : notes;

  // The two send buttons are ordinary links built from the summary
  const message = buildRequestMessage();

  document.getElementById("sendRequestWhatsApp").href =
    "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);

  document.getElementById("sendRequestEmail").href =
    "mailto:" +
    CONTACT_EMAIL +
    "?subject=" +
    encodeURIComponent("Travel request: " + destinationText) +
    "&body=" +
    encodeURIComponent(message);

  // Swap the form for the confirmation message
  bookingForm.hidden = true;
  confirmationPanel.hidden = false;
  modalCard.scrollTop = 0;
}

// "Edit request" brings the filled-in form back
document.getElementById("newRequestBtn").addEventListener("click", function () {
  confirmationPanel.hidden = true;
  bookingForm.hidden = false;
  modalCard.scrollTop = 0;
  nameInput.focus();
});


/* 9. CONTACT FORM ---------------------------------------------------------- */

const contactForm = document.getElementById("contactForm");
const contactStatus = document.getElementById("contactStatus");

contactForm.querySelectorAll("input, textarea").forEach(function (field) {
  field.addEventListener("input", function () {
    clearError(field);
    contactStatus.textContent = "";
  });
});

contactForm.addEventListener("submit", function (event) {
  event.preventDefault();
  let isValid = true;

  const contactName = document.getElementById("contactName");
  const contactEmail = document.getElementById("contactEmail");
  const contactMessage = document.getElementById("contactMessage");

  if (contactName.value.trim().length < 2) {
    showError(contactName, "Please enter your name.");
    isValid = false;
  } else {
    clearError(contactName);
  }

  if (!emailPattern.test(contactEmail.value.trim())) {
    showError(contactEmail, "Please enter a valid email address.");
    isValid = false;
  } else {
    clearError(contactEmail);
  }

  if (contactMessage.value.trim().length < 10) {
    showError(contactMessage, "Please tell us a little more about your trip.");
    isValid = false;
  } else {
    clearError(contactMessage);
  }

  if (!isValid) {
    const firstInvalidField = contactForm.querySelector(".invalid");
    if (firstInvalidField) {
      firstInvalidField.focus();
    }
    return;
  }

  // A mailto link opens the visitor's own email app with everything filled in
  const body =
    "Name: " + contactName.value.trim() + "\n\n" + contactMessage.value.trim();

  window.location.href =
    "mailto:" +
    CONTACT_EMAIL +
    "?subject=" +
    encodeURIComponent("Website enquiry from " + contactName.value.trim()) +
    "&body=" +
    encodeURIComponent(body);

  contactStatus.textContent =
    "Your email app should now open with your message ready to send. If it does not, write to " +
    CONTACT_EMAIL +
    ".";
});


/* 10. GALLERY LIGHTBOX ----------------------------------------------------- */

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");

document.querySelectorAll(".photo").forEach(function (photoButton) {
  photoButton.addEventListener("click", function () {
    const image = photoButton.querySelector("img");
    const caption = photoButton.querySelector(".photo-caption");

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = caption ? caption.textContent : image.alt;

    lightbox.classList.add("open");
    document.body.classList.add("no-scroll");
  });
});

function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.classList.remove("no-scroll");
}

document.getElementById("lightboxClose").addEventListener("click", closeLightbox);

// Clicking the dark background closes the lightbox
lightbox.addEventListener("click", function (event) {
  if (event.target === lightbox) {
    closeLightbox();
  }
});


/* 11. SMALL EXTRAS --------------------------------------------------------- */

// The footer year updates by itself
document.getElementById("year").textContent = new Date().getFullYear();

// Escape closes whatever overlay is open
document.addEventListener("keydown", function (event) {
  if (event.key !== "Escape") {
    return;
  }

  if (bookingModal.classList.contains("open")) {
    closeBookingModal();
  }

  if (lightbox.classList.contains("open")) {
    closeLightbox();
  }
});
