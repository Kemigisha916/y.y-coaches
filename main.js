const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector("i");

menuBtn.addEventListener("click", (e)=>{
    navLinks.classList.toggle("open");

    const isopen = navLinks.classList.contains("open");
    menuBtnIcon.setAttribute("class", isopen ? "ri-close-line" : "ri-menu-line")
});


navLinks.addEventListener("click",(e)=>{
    navLinks.classList.remove("open");
    menuBtnIcon.setAttribute("class", "ri-close-line" )
})

// Scroll to booking form
window.addEventListener("DOMContentLoaded", () => {
  const bookTripBtn = document.getElementById("book-trip-btn");
  const bookingForm = document.getElementById("bookingForm");

  if (!bookTripBtn || !bookingForm) return;

  bookTripBtn.addEventListener("click", () => {
    bookingForm.scrollIntoView({ behavior: "smooth", block: "center" });
  });
});




const scrollRevealOption = {
    origin: "bottom",
    distance: "50px",
    duration: 1000,
  };
  
  // Correct way to use ScrollReveal:
  ScrollReveal().reveal(".header__image img", {
    ...scrollRevealOption,
    origin: "right",
  });

  ScrollReveal().reveal(".header__content p", {
    ...scrollRevealOption,
    delay: 500,
  });
  
  ScrollReveal().reveal(".header__content h1", {
    ...scrollRevealOption,
    delay: 1000,
  });

  ScrollReveal().reveal(".header__btns", {
    ...scrollRevealOption,
    delay: 1500,
  });

  ScrollReveal().reveal(".destination__card", {
    ...scrollRevealOption,
    interval: 500,
  });
  
    ScrollReveal().reveal(".showcase__image img", {
    ...scrollRevealOption,
    origin: "left",
  });

  ScrollReveal().reveal(".showcase__content h4", {
    ...scrollRevealOption,
    delay: 500,
  });
  
  ScrollReveal().reveal(".showcase__content p", {
    ...scrollRevealOption,
    delay: 1000,
  });

  ScrollReveal().reveal(".showcase__btn", {
    ...scrollRevealOption,
    delay: 1500,
     });

       ScrollReveal().reveal(".banner__card", {
    ...scrollRevealOption,
    interval: 500,
  });
  
  ScrollReveal().reveal(".discover__card", {
  ...scrollRevealOption,
  interval: 500,
});


  const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

window.addEventListener("DOMContentLoaded", () => {
  const bookingForm = document.getElementById("bookingForm");
  const confirmationMessage = document.getElementById("confirmationMessage");
  const departureSelect = document.getElementById("departure");
  const destinationSelect = document.getElementById("destination");
  const departureTimeSelect = document.getElementById("departureTime");

  const routeTimeOptions = [
    "06:00 AM",
    "07:00 AM",
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
    "08:00 PM",
    "09:00 PM",
  ];

  function updateDepartureTimes() {
    if (!departureSelect || !destinationSelect || !departureTimeSelect) return;

    const departure = departureSelect.value;
    const destination = destinationSelect.value;

    departureTimeSelect.innerHTML = "<option value=''>Select Time</option>";

    if (!departure || !destination || departure === destination) {
      return;
    }

    routeTimeOptions.forEach((time) => {
      const option = document.createElement("option");
      option.value = time;
      option.textContent = time;
      departureTimeSelect.appendChild(option);
    });
  }

  if (departureSelect && destinationSelect) {
    departureSelect.addEventListener("change", updateDepartureTimes);
    destinationSelect.addEventListener("change", updateDepartureTimes);
  }

  updateDepartureTimes();

  if (bookingForm && confirmationMessage) {
    bookingForm.addEventListener("submit", (event) => {
      event.preventDefault();

      // Collect form data
      const formData = new FormData(bookingForm);

      // Submit form via AJAX to process_booking.php
      fetch("process_booking.php", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            // Show success message
            confirmationMessage.innerHTML = `
              <h3>Thank you for your booking!</h3>
              <p><strong>Booking ID:</strong> ${data.booking_id}</p>
              <p><strong>Name:</strong> ${data.full_name}</p>
              <p><strong>Route:</strong> ${data.departure} → ${data.destination}</p>
              <p><strong>Travel Date:</strong> ${data.travel_date}</p>
              <p><strong>Passengers:</strong> ${data.passengers}</p>
              <p>A confirmation email will be sent to ${data.email}</p>
            `;
            confirmationMessage.style.display = "block";
            bookingForm.reset();
            updateDepartureTimes();
            confirmationMessage.scrollIntoView({ behavior: "smooth", block: "center" });

            setTimeout(() => {
              confirmationMessage.style.display = "none";
            }, 7000);
          } else {
            // Show error message
            confirmationMessage.innerHTML = `
              <h3 style="color: red;">Booking Error</h3>
              <p>${data.message}</p>
            `;
            confirmationMessage.style.display = "block";
            confirmationMessage.scrollIntoView({ behavior: "smooth", block: "center" });

            setTimeout(() => {
              confirmationMessage.style.display = "none";
            }, 5000);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          confirmationMessage.innerHTML = `
            <h3 style="color: red;">Network Error</h3>
            <p>Failed to submit booking. Please try again.</p>
          `;
          confirmationMessage.style.display = "block";
          confirmationMessage.scrollIntoView({ behavior: "smooth", block: "center" });

          setTimeout(() => {
            confirmationMessage.style.display = "none";
          }, 5000);
        });
    });
  }
});
