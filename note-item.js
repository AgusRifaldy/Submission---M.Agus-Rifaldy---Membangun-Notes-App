const template = document.createElement('template');
template.innerHTML = `
  <style>
    .note-item {
      background-color: #fefae0;
      padding: 15px;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .note-item h3 {
      margin: 0;
      font-size: 1.25rem;
    }
    .note-item p {
      margin: 10px 0;
    }
    .note-item .note-actions {
      display: flex;
      gap: 10px;
      margin-top: 10px;
    }
    .note-item .note-actions button {
      background-color: #009080;
      color: #fefae0;
      border: none;
      padding: 8px 12px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 0.875rem;
    }
    .note-item .note-actions button:hover {
      background-color: #1faa59;
    }
    .note-item .note-actions .archive {
      background-color: orange;
    }
    .note-item .note-actions .archive:hover {
      background-color: darkorange;
    }
    .note-item .note-actions .unarchive {
      background-color: lightblue;
    }
    .note-item .note-actions .unarchive:hover {
      background-color: deepskyblue;
    }
  </style>
  <div class="note-item">
    <h3></h3>
    <p class="note-body"></p>
    <p class="note-category"></p>
    <div class="note-actions">
      <button class="edit">Edit</button>
      <button class="archive">Archive</button>
      <button class="unarchive">Unarchive</button>
      <button class="delete">Delete</button>
    </div>
  </div>
`;

class NoteItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).appendChild(
      template.content.cloneNode(true),
    );
  }

  connectedCallback() {
    this.shadowRoot.querySelector('h3').textContent =
      this.getAttribute('title');
    this.shadowRoot.querySelector('.note-body').textContent =
      this.getAttribute('body');
    this.shadowRoot.querySelector('.note-category').textContent =
      this.getAttribute('category');

    this.shadowRoot.querySelector('.edit').addEventListener('click', () => {
      this.dispatchEvent(
        new CustomEvent('edit', { detail: this.getAttribute('id') }),
      );
    });

    this.shadowRoot.querySelector('.delete').addEventListener('click', () => {
      this.dispatchEvent(
        new CustomEvent('delete', { detail: this.getAttribute('id') }),
      );
    });

    this.shadowRoot.querySelector('.archive').addEventListener('click', () => {
      this.dispatchEvent(
        new CustomEvent('archive', { detail: this.getAttribute('id') }),
      );
    });

    this.shadowRoot
      .querySelector('.unarchive')
      .addEventListener('click', () => {
        this.dispatchEvent(
          new CustomEvent('unarchive', { detail: this.getAttribute('id') }),
        );
      });

    if (this.getAttribute('archived') === 'true') {
      this.shadowRoot.querySelector('.archive').style.display = 'none';
      this.shadowRoot.querySelector('.unarchive').style.display =
        'inline-block';
    } else {
      this.shadowRoot.querySelector('.archive').style.display = 'inline-block';
      this.shadowRoot.querySelector('.unarchive').style.display = 'none';
    }
  }
}

customElements.define('note-item', NoteItem);
