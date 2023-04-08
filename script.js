const lopiButton = document.getElementById("lopiButton");
const yourCountElement = document.getElementById("yourCount");
const publicCounterElement = document.getElementById("publicCounter");

let lopiButtonClicked = false;

let publicCounter = 0;
let clickCount = 0;
let yourCount = 0;
let loopCount = 0;

let timeout;

function updateCounters() {
    if (clickCount >= 0) {
        fetch(`/update.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `count=${clickCount}`,
            cache: 'no-cache'
        })
            .then(() => {
                if (clickCount - 10 < 0) {
                    clickCount = 0;
                } else {
                    clickCount = clickCount - 10;
                }
            })
    }

    fetch("/update.php")
        .then((data) => {
            publicCounter = parseInt(data);
            if (!isNaN(yourCount)) {
                yourCountElement.innerHTML = yourCount;
            }
            if (!isNaN(publicCounter)) {
                publicCounterElement.innerHTML = publicCounter;
            }
        })
        .catch((err) => console.error(err));
}

// Check if the "yourCount" cookie exists, and if so, retrieve its value, if not make a new one
const yourCountCookie = document.cookie.split(";").find((c) => c.trim().startsWith("yourCount="));
if (yourCountCookie) {
    yourCount = parseInt(yourCountCookie.split("=")[1]);
}
else {
    document.cookie = `yourCount=0; SameSite=None; Secure`;
}

updateCounters();

// lopi button listener 
lopiButton.addEventListener("click", () => {
    lopiButtonClicked = true;
    clickCount++;
    yourCount++;
    yourCountElement.innerHTML = yourCount;
    publicCounter++;
    publicCounterElement.innerHTML = publicCounter;

    // setcounters and update with serrver
    if (clickCount >= 5) {
        // Send click count to server
        console.log("sending clicks to server");
        loopCount++;
        fetch(`/update.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `count=${clickCount}`,
            cache: 'no-cache'
        })
            .then(() => {
                if (clickCount - 10 < 0) {
                    clickCount = 0;
                } else {
                    clickCount = clickCount - 10;
                }
            })
            .catch((err) => console.error(err));
    } else {
        // Update public counter
        if (loopCount > 5) {
            console.log("click count trigered update");
            updateCounters();
            loopCount = 0;
        }
    }
    // update the cookie
    if (yourCountCookie) {
        document.cookie = `yourCount=${yourCount}; SameSite=None; Secure`;
    }

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

// check if the button has been pressed
lopiButton.addEventListener('mouseup', () => {
    timeout = setTimeout(() => {
        console.log('Button unpressed timeout');
        lopiButtonClicked = false;
    }, 500); // Delay in milliseconds
});
lopiButton.addEventListener('mousedown', () => {
    clearTimeout(timeout);
    updateCounters();
});

// Get value of Counters from server if button hasent been clicked in a bit
setInterval(() => {
    if (!lopiButtonClicked) {
        console.log("click timout update");
        updateCounters();
    }
}, 2000);