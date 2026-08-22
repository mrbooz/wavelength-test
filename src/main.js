import { PRODUCT_NAME, PITCH } from "./config.js";

const app = document.querySelector("#app");

app.innerHTML = `
  <section class="hello">
    <p class="kicker">Today's spin</p>
    <h1>${PRODUCT_NAME}</h1>
    <p class="pitch">${PITCH}</p>
  </section>
`;
