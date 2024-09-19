document.addEventListener('DOMContentLoaded', () => {
  const noteList = document.getElementById('note-list');
  const addNoteBtn = document.querySelector('#add-note-btn');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const noteForm = document.querySelector('note-form');

  let notes = [];
  let editMode = false;
  let editNoteId = null;

  function renderNotes(filteredNotes) {
    noteList.innerHTML = '';

    filteredNotes.forEach((note) => {
      const noteElement = document.createElement('note-item');
      noteElement.setAttribute('title', note.title);
      noteElement.setAttribute('body', note.body);
      noteElement.setAttribute('category', note.category || 'project');
      noteElement.setAttribute('id', note.id);
      noteElement.setAttribute('archived', note.archived);

      noteElement.addEventListener('edit', (event) => {
        const noteId = event.detail;
        const note = notes.find((note) => note.id === noteId);

        // Set edit mode on note-form
        noteForm.setEditMode(true, note);

        editMode = true;
        editNoteId = noteId;

        // Ubah teks tombol menjadi "Done" saat mode edit aktif
        addNoteBtn.textContent = 'Done';
      });

      noteElement.addEventListener('delete', (event) => {
        const noteId = event.detail;
        notes = notes.filter((note) => note.id !== noteId);
        saveNotes();
        renderNotes(notes);
      });

      noteElement.addEventListener('archive', (event) => {
        handleArchive(note.id, true);
      });

      noteElement.addEventListener('unarchive', (event) => {
        handleArchive(note.id, false);
      });

      noteList.appendChild(noteElement);
    });
  }

  function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
  }

  function loadNotes() {
    notes = JSON.parse(localStorage.getItem('notes')) || [];
    renderNotes(notes);
  }

  function handleArchive(noteId, archiveStatus) {
    const note = notes.find((note) => note.id === noteId);
    if (note) {
      note.archived = archiveStatus;
      saveNotes();
      renderNotes(notes);
    }
  }

  // Event listener untuk form add-note
  noteForm.addEventListener('add-note', (event) => {
    const { title, body, category } = event.detail;

    if (editMode) {
      const noteIndex = notes.findIndex((note) => note.id === editNoteId);
      if (noteIndex !== -1) {
        notes[noteIndex] = {
          id: editNoteId,
          title,
          body,
          category,
          archived: false,
        };
      }
      editMode = false;
      editNoteId = null;

      // Debugging log
      console.log(`Selesai Mengedit, Reset Mode Edit: ${editMode}`);

      // Kembalikan teks tombol menjadi "Add New Note" setelah edit selesai
      addNoteBtn.textContent = 'Add New Note';

      // Reset form
      noteForm.setEditMode(false); // Ubah ini menjadi false untuk reset mode edit
    } else {
      const newNote = {
        id: Date.now().toString(),
        title,
        body,
        category,
        archived: false,
      };
      notes.push(newNote);
    }

    saveNotes();
    renderNotes(notes);
  });

  function showLoading() {
    const loadingElement = document.createElement('div');
    loadingElement.id = 'loading';
    loadingElement.textContent = 'Loading...';
    document.body.appendChild(loadingElement);
  }

  function hideLoading() {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
      document.body.removeChild(loadingElement);
    }
  }

  function showError(message) {
    const errorElement = document.createElement('div');
    errorElement.id = 'error-message';
    errorElement.textContent = message;
    errorElement.style.cssText = `
      position: fixed;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      padding: 10px;
      background-color: red;
      color: white;
      border-radius: 5px;
      font-family: Montserrat, sans-serif;
    `;
    document.body.appendChild(errorElement);

    setTimeout(() => {
      if (errorElement) {
        document.body.removeChild(errorElement);
      }
    }, 5000);
  }

  async function fetchNotes() {
    try {
      showLoading();
      const response = await fetch(`${API_ENDPOINT}/notes`);
      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }
      const data = await response.json();
      notes = data; // Update notes with fetched data
      renderNotes(notes);
    } catch (error) {
      showError(error.message);
    } finally {
      hideLoading();
    }
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');

      const filter = button.getAttribute('data-filter');
      let filteredNotes = notes;

      if (filter === 'archived') {
        filteredNotes = notes.filter((note) => note.archived);
      } else if (filter !== 'all') {
        filteredNotes = notes.filter((note) => note.category === filter);
      }

      renderNotes(filteredNotes);
    });
  });

  loadNotes();
});
