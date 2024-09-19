const noteFormTemplate = document.createElement('template');
noteFormTemplate.innerHTML = `
  <style>
    .note-form {
      background-color: #fefae0;
      padding: 20px;
      border-radius: 10px;
      margin-top: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .note-form h2 {
      font-family: "Montserrat", sans-serif;
      font-size: 1.5rem;
      margin-bottom: 20px;
    }
    .note-form .form-group {
      margin-bottom: 15px;
    }
    .note-form .form-group input,
    .note-form .form-group textarea,
    .note-form .form-group select {
      width: 100%;
      padding: 10px;
      border: 2px solid #009080;
      border-radius: 5px;
      font-size: 1rem;
    }
    .note-form .form-group textarea {
      height: 100px;
      resize: vertical;
    }
    .note-form .primary-btn {
      width: 100%;
      padding: 15px;
      background-color: #009080;
      color: #fefae0;
      border: none;
      border-radius: 5px;
      font-size: 1.2rem;
      cursor: pointer;
      font-family: "Montserrat", sans-serif;
    }
    .note-form .primary-btn:hover {
      background-color: #1faa59;
    }
    .note-form .error-message {
      color: red;
      font-size: 0.875rem;
      display: none;
    }
  </style>
  <div class="note-form">
    <h2 id="form-title">Add New Note</h2>
    <div class="form-group">
      <input type="text" id="note-title" placeholder="Title" />
      <span id="title-error" class="error-message"></span>
    </div>
    <div class="form-group">
      <textarea id="note-body" placeholder="Content"></textarea>
      <span id="body-error" class="error-message"></span>
    </div>
    <div class="form-group">
      <select id="note-category">
        <option value="project">Project</option>
        <option value="business">Business</option>
        <option value="personal">Personal</option>
      </select>
    </div>
    <button id="add-note-btn" class="primary-btn">Add New Note</button>
  </div>
`;

class NoteForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).appendChild(
      noteFormTemplate.content.cloneNode(true),
    );

    this.noteTitleInput = this.shadowRoot.getElementById('note-title');
    this.noteBodyInput = this.shadowRoot.getElementById('note-body');
    this.noteCategorySelect = this.shadowRoot.getElementById('note-category');
    this.addNoteButton = this.shadowRoot.getElementById('add-note-btn');
    this.titleError = this.shadowRoot.getElementById('title-error');
    this.bodyError = this.shadowRoot.getElementById('body-error');
    this.formTitle = this.shadowRoot.getElementById('form-title');

    this.isEditMode = false;

    this.addNoteButton.addEventListener('click', () => this.handleAddNote());
  }

  handleAddNote() {
    if (this.validateInput()) {
      const title = this.noteTitleInput.value.trim();
      const body = this.noteBodyInput.value.trim();
      const category = this.noteCategorySelect.value;

      this.dispatchEvent(
        new CustomEvent('add-note', {
          detail: { title, body, category },
          bubbles: true,
          composed: true,
        }),
      );

      // Reset form to default state after adding or editing a note
      if (this.isEditMode) {
        this.setEditMode(false); // Set back to add mode
      } else {
        this.clearForm(); // Clear form when adding a new note
      }
    }
  }

  validateInput() {
    let isValid = true;

    if (this.noteTitleInput.value.trim() === '') {
      this.titleError.textContent = 'Title cannot be empty';
      this.titleError.style.display = 'block';
      isValid = false;
    } else {
      this.titleError.style.display = 'none';
    }

    if (this.noteBodyInput.value.trim() === '') {
      this.bodyError.textContent = 'Content cannot be empty';
      this.bodyError.style.display = 'block';
      isValid = false;
    } else {
      this.bodyError.style.display = 'none';
    }

    return isValid;
  }

  clearForm() {
    this.noteTitleInput.value = '';
    this.noteBodyInput.value = '';
    this.noteCategorySelect.value = 'project'; // Default value sesuai perubahan
    this.titleError.style.display = 'none';
    this.bodyError.style.display = 'none';
  }

  setEditMode(isEditMode, note) {
    this.isEditMode = isEditMode;

    if (isEditMode) {
      this.addNoteButton.textContent = 'Done';
      this.formTitle.textContent = 'Edit Note';
      this.noteTitleInput.value = note.title;
      this.noteBodyInput.value = note.body;
      this.noteCategorySelect.value = note.category;
    } else {
      this.addNoteButton.textContent = 'Add New Note';
      this.formTitle.textContent = 'Add New Note';
      this.clearForm(); // Clear form when switching back to add mode
    }
  }
}

customElements.define('note-form', NoteForm);
