const lopiButton = document.getElementById("lopiButton");
const yourCountElement = document.getElementById("yourCount");
const publicCounterElement = document.getElementById("publicCounter");

let publicCounter = 0;
let clickCount = 0;
let yourCount = 0;

// Check if the "yourCount" cookie exists, and if so, retrieve its value
const yourCountCookie = document.cookie.split(";").find((c) => c.trim().startsWith("yourCount="));
if (yourCountCookie) {
    yourCount = parseInt(yourCountCookie.split("=")[1]);
}

// Get initial value of publicCounter from server
fetch("/update.php")
    .then((res) => res.text())
    .then((data) => {
        publicCounter = parseInt(data);
        yourCountElement.innerHTML = yourCount;
        publicCounterElement.innerHTML = publicCounter;
    })
    .catch((err) => console.error(err));

// Update public counter every 2 seconds
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
    clickCount++;
    
    // Update your count and public counter
    yourCount += clickCount;
    yourCountElement.innerHTML = yourCount;
    publicCounter += clickCount;
    publicCounterElement.innerHTML = publicCounter;
    
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

// Send click count to server every 500 milliseconds
setInterval(() => {
    if (clickCount > 0) {
        fetch(`/increment.php?count=${clickCount}`)
            .then((res) => res.text())
            .then((data) => {
                publicCounter = parseInt(data);
                if (!isNaN(publicCounter)) {
                    publicCounterElement.innerHTML = publicCounter;
                }
            })
            .catch((err) => console.error(err));
        clickCount = 0;
    }
}, 500);
