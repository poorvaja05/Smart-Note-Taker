

let notes = JSON.parse(localStorage.getItem("notes")) || [];

// Request permission for notifications on page load
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}

// Add a new note
document.getElementById("addNoteBtn").addEventListener("click", function () {
  const text = document.getElementById("noteText").value.trim();
  const date = document.getElementById("noteDate").value;
  const color = document.getElementById("noteColor").value;

  if (!text) {
    alert("Please enter a note!");
    return;
  }

  const note = { text, date, color, notified: false };
  notes.push(note);
  localStorage.setItem("notes", JSON.stringify(notes));

  document.getElementById("noteText").value = "";
  document.getElementById("noteDate").value = "";
  document.getElementById("noteColor").value = "#fff8dc";

  displayNotes();
  scheduleReminders();
});

// Display notes
function displayNotes() {
  const notesContainer = document.getElementById("notesContainer");
  notesContainer.innerHTML = "";

  notes.forEach((note, index) => {
    const noteDiv = document.createElement("div");
    noteDiv.className = "note";
    noteDiv.style.backgroundColor = note.color || "#fff8dc";

    noteDiv.innerHTML = `
      <p>${note.text}</p>
      <small>${note.date ? `⏰ Reminder: ${new Date(note.date).toLocaleString()}` : "No reminder set"}</small>
      <div class="note-buttons">
        <button class="edit-btn" onclick="editNote(${index})">Edit</button>
        <button class="delete-btn" onclick="deleteNote(${index})">Delete</button>
      </div>
    `;

    notesContainer.appendChild(noteDiv);
  });
}

// Delete note
function deleteNote(index) {
  notes.splice(index, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  displayNotes();
  scheduleReminders();
}

// Edit note
function editNote(index) {
  const note = notes[index];
  document.getElementById("noteText").value = note.text;
  document.getElementById("noteDate").value = note.date;
  document.getElementById("noteColor").value = note.color;
  deleteNote(index);
}

// 🔔 Schedule notifications for all notes
function scheduleReminders() {
  const now = new Date().getTime();

  notes.forEach((note, i) => {
    if (note.date && !note.notified) {
      const reminderTime = new Date(note.date).getTime();
      const delay = reminderTime - now;

      if (delay > 0) {
        setTimeout(() => {
          notifyUser(note.text);
          notes[i].notified = true;
          localStorage.setItem("notes", JSON.stringify(notes));
        }, delay);
      } else {
        // If reminder time already passed, notify immediately
        notifyUser(note.text);
        notes[i].notified = true;
        localStorage.setItem("notes", JSON.stringify(notes));
      }
    }
  });
}

// Show notification
function notifyUser(message) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("🔔 Note Reminder", {
      body: message,
      icon: "https://cdn-icons-png.flaticon.com/512/1827/1827272.png"
    });
  } else {
    alert("Reminder: " + message);
  }
}

// Initialize
displayNotes();
scheduleReminders();
