const counterBtn = document.getElementById("counter-btn");
const publicCounterEl = document.getElementById("public-counter");
const yourCounterEl = document.getElementById("your-counter");
const lopiImages = ["lopi_images/1.jpg", "lopi_images/2.jpg", "lopi_images/3.jpg"];
const lopiAudios = ["lopi_audio/1.mp3", "lopi_audio/2.mp3", "lopi_audio/3.mp3"];

let publicCounter = 0;
let yourCounter = 0;

fetch("counter.txt")
  .then(response => response.text())
  .then(data => {
    const counters = data.split(",");
    publicCounter = Number(counters[0]) || 0;
    yourCounter = Number(counters[1]) || 0;
    publicCounterEl.textContent = publicCounter;
    yourCounterEl.textContent = yourCounter;
  })
  .catch(error => console.error(error));

counterBtn.addEventListener("click", () => {
  yourCounter++;
  yourCounterEl.textContent = yourCounter;

  publicCounter++;
  publicCounterEl.textContent = publicCounter;

  const countersStr = `${publicCounter},${yourCounter}`;

  fetch("counter.txt", {
    method: "PUT",
    body: countersStr
  })
    .catch(error => console.error(error));

  const randomImg = lopiImages[Math.floor(Math.random() * lopiImages.length)];
  const randomAudio = lopiAudios[Math.floor(Math.random() * lopiAudios.length)];
  const img = document.createElement("img");
  img.src = randomImg;
  img.style.position = "absolute";
  img.style.top = Math.floor(Math.random() * (window.innerHeight - 100)) + "px";
  img.style.left = Math.floor(Math.random() * (window.innerWidth - 100)) + "px";
  img.style.transform = `rotate(${Math.floor(Math.random() * 360)}deg)`;
  document.body.appendChild(img);

  const audio = new Audio(randomAudio);
  audio.play();

  setTimeout(() => {
    img.remove();
  }, 1000);
});
