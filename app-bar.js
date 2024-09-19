const appBarTemplate = document.createElement("template");
appBarTemplate.innerHTML = `
  <style>
    .app-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      background-color: #009080;
      color: #fefae0;
    }
    .app-bar h1 {
      margin: 0;
      font-size: 2rem;
    }
    .app-bar .logo {
      width: 50px;
    }
  </style>
  <div class="app-bar">
    <h1>Yuzuhiko's Notes App</h1>
    <img src="logo.png" alt="Logo" class="logo" />
  </div>
`;

class AppBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).appendChild(
      appBarTemplate.content.cloneNode(true)
    );
  }
}

customElements.define("app-bar", AppBar);
