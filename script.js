let notes = JSON.parse(localStorage.getItem("notes")) || [];

// Ask permission for notifications
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}

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
});

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

function deleteNote(index) {
  notes.splice(index, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  displayNotes();
}

function editNote(index) {
  const note = notes[index];
  document.getElementById("noteText").value = note.text;
  document.getElementById("noteDate").value = note.date;
  document.getElementById("noteColor").value = note.color;
  deleteNote(index);
}

// 🔔 Check for reminders every 10 seconds
setInterval(() => {
  const now = new Date().getTime();
  notes.forEach((note, i) => {
    if (note.date && !note.notified) {
      const reminderTime = new Date(note.date).getTime();
      if (reminderTime <= now) {
        notifyUser(note.text);
        notes[i].notified = true;
        localStorage.setItem("notes", JSON.stringify(notes));
      }
    }
  });
}, 10000);

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

displayNotes();
