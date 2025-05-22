const events = [
    { id: 1, title: "Rock Concert", category: "Concert", date: "2025-05-25", location: "Arena 5", availableSeats: 100 },
    { id: 2, title: "Movie Premiere", category: "Movie", date: "2025-05-22", location: "CineMax", availableSeats: 50 },
    { id: 3, title: "Train to Goa", category: "Travel", date: "2025-05-30", location: "Station 1", availableSeats: 20 },
    { id: 4, title: "Jazz Night", category: "Concert", date: "2025-06-10", location: "Club 9", availableSeats: 80 },
    { id: 5, title: "Bus to Mumbai", category: "Travel", date: "2025-06-01", location: "Bus Depot", availableSeats: 30 },
    { id: 6, title: "Classic Movie Night", category: "Movie", date: "2025-06-15", location: "Retro Cinema", availableSeats: 60 }
];

const container = document.getElementById("eventsContainer");
const themeToggle = document.getElementById("themeToggle");
const bookingModal = new bootstrap.Modal(document.getElementById("bookingModal"));
const toast = new bootstrap.Toast(document.getElementById("bookingToast"));

let selectedEvent = null;

function renderEvents(list = events) {
    container.innerHTML = "";
    list.forEach(event => {
        const col = document.createElement("div");
        col.className = "col";
        col.innerHTML = `
      <div class="card h-100 shadow">
        <div class="card-body">
          <h5 class="card-title">${event.title}</h5>
          <p class="card-text">📍 ${event.location}</p>
          <p class="card-text">📅 ${event.date}</p>
          <p class="card-text">🎟 Available: ${event.availableSeats}</p>
          <button class="btn btn-primary w-100" ${event.availableSeats === 0 ? 'disabled' : ''} onclick="openBooking(${event.id})">${event.availableSeats === 0 ? 'Sold Out' : 'Book Now'}</button>
        </div>
      </div>
    `;
        container.appendChild(col);
    });
}

function filterEvents() {
    const category = document.getElementById("categoryFilter").value;
    const date = document.getElementById("dateFilter").value;
    const filtered = events.filter(ev =>
        (!category || ev.category === category) &&
        (!date || ev.date === date)
    );
    renderEvents(filtered);
}

function openBooking(id) {
    selectedEvent = events.find(e => e.id === id);
    document.getElementById("eventDetails").textContent = `Booking for: ${selectedEvent.title}`;
    document.getElementById("ticketStep").style.display = "block";
    document.getElementById("paymentStep").style.display = "none";
    document.getElementById("ticketCount").value = "";
    document.getElementById("userEmail").value = "";
    bookingModal.show();
}

function showPaymentStep() {
    const count = parseInt(document.getElementById("ticketCount").value);
    if (!count || count < 1 || count > selectedEvent.availableSeats) {
        alert("Enter a valid ticket count (1 - " + selectedEvent.availableSeats + ")");
        return;
    }
    document.getElementById("ticketStep").style.display = "none";
    document.getElementById("paymentStep").style.display = "block";
}

function confirmBooking() {
    const count = parseInt(document.getElementById("ticketCount").value);
    const userEmail = document.getElementById("userEmail").value;

    if (!userEmail || !userEmail.includes("@")) {
        alert("Please enter a valid email.");
        return;
    }

    selectedEvent.availableSeats -= count;
    bookingModal.hide();
    toast.show();
    renderEvents();

    sendEmailNotification({
        eventName: selectedEvent.title,
        email: userEmail,
        seats: count,
        date: new Date().toLocaleString()
    });
}

function sendEmailNotification(data) {
    emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
        to_email: data.email,
        event_name: data.eventName,
        booking_date: data.date,
        ticket_count: data.seats
    }).then(
        res => console.log("✅ Email sent", res),
        err => console.error("❌ Email failed", err)
    );
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    document.body.classList.toggle("light-mode");
});

renderEvents();
