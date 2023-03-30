const lopiButton = document.getElementById("lopiButton");
const yourCountElement = document.getElementById("yourCount");
const publicCounterElement = document.getElementById("publicCounter");

let publicCounter = 0;
let clientCount = 0;
let yourCount = 0;

// Check if the "yourCount" cookie exists, and if so, retrieve its value
const yourCountCookie = document.cookie.split(";").find((c) => c.trim().startsWith("yourCount="));
if (yourCountCookie) {
  yourCount = parseInt(yourCountCookie.split("=")[1]);
}

// Update the "your count" element with the initial value of "yourCount"
yourCountElement.innerHTML = yourCount;

// Get initial value of publicCounter from server
fetch("/update.php")
    .then((res) => res.text())
    .then((data) => {
        publicCounter = parseInt(data);
        yourCountElement.innerHTML = yourCount;
        publicCounterElement.innerHTML = publicCounter;
    })
    .catch((err) => console.error(err));

// Update public counter every 5 seconds
setInterval(() => {
    fetch("/update.php")
        .then((res) => res.text())
        .then((data) => {
            publicCounter = parseInt(data);
            if (!isNaN(publicCounter)) {
                publicCounterElement.innerHTML = publicCounter;
            }
        })
        .catch((err) => console.error(err));
}, 2000);

lopiButton.addEventListener("click", () => {
    clientCount++;

    // Randomly display lopi image
    const lopiImage = new Image();
    lopiImage.src = `lopi_images/lopi${Math.floor(Math.random() * 3) + 1}.png`;
    lopiImage.classList.add("lopi-image");
    lopiImage.style.left = `${Math.floor(Math.random() * window.innerWidth)}px`;
    lopiImage.style.top = `${Math.floor(Math.random() * window.innerHeight)}px`;
    lopiImage.style.transform = `rotate(${Math.floor(Math.random() * 360)}deg)`;
    document.body.appendChild(lopiImage);
    setTimeout(() => {
        lopiImage.remove();
    }, 1000);

    // Play lopi audio
    const lopiAudio = new Audio(`lopi_audio/lopi${Math.floor(Math.random() * 3) + 1}.mp3`);
    lopiAudio.play();
});

// Send client-side counter to server
setInterval(() => {
    if (clientCount > 0) {
        fetch(`/increment.php?count=${clientCount}`)
            .then((res) => res.text())
            .then((data) => {
                publicCounter = parseInt(data);
                if (!isNaN(publicCounter)) {
                    publicCounterElement.innerHTML = publicCounter;
                    yourCount += clientCount;
                    clientCount = 0;
                    yourCountElement.innerHTML = yourCount;
                    
                    // Store the updated "your count" value in a cookie
                    document.cookie = `yourCount=${yourCount}`;
                }
            })
            .catch((err) => console.error(err));
    }
}, 250);
