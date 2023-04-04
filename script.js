const lopiButton = document.getElementById("lopiButton");
const yourCountElement = document.getElementById("yourCount");
const publicCounterElement = document.getElementById("publicCounter");

let publicCounter = 0;
let clickCount = 0;
let yourCount = 0;

// Check if the "yourCount" cookie exists, and if so, retrieve its value, if not make a new one
const yourCountCookie = document.cookie.split(";").find((c) => c.trim().startsWith("yourCount="));
if (yourCountCookie) {
    yourCount = parseInt(yourCountCookie.split("=")[1]);
}
else {
    document.cookie = `yourCount=0; SameSite=None; Secure`;
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

lopiButton.addEventListener("click", () => {
    clickCount++;
    yourCount++;
    yourCountElement.innerHTML = yourCount;
    publicCounter++;
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

// server calls 

let count = 0;

function updateLoop() {
    console.log(`Server calls ${count}`);
    count++;
    // Send click count to server
    if (count < 5) {
        if (clickCount > 0) {
            fetch(`/update.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `count=${clickCount}`,
                cache: 'no-cache'
            })
                .then(() => {
                    clickCount = 0;
                    if (yourCountCookie) {
                        document.cookie = `yourCount=${yourCount}; SameSite=None; Secure`;
                    }
                })
                .catch((err) => console.error(err));
        }
        setTimeout(updateLoop, 1000); // sleep
    } else {
        // Update public counter
        fetch("/update.php")
            .then((res) => res.text())
            .then((data) => {
                publicCounter = parseInt(data);
                if (!isNaN(publicCounter)) {
                    publicCounterElement.innerHTML = publicCounter;
                }
            })
            .catch((err) => console.error(err));
        count = 0;
        setTimeout(updateLoop, 1000);
    }
}

updateLoop();