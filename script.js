const lopiButton = document.getElementById("lopiButton");
const yourCountElement = document.getElementById("yourCount");
const publicCounterElement = document.getElementById("publicCounter");

let clickCount = 0;
let loopCount = 0;
let publicCounter = 0;
let difference = 0;

let timeout;
let lopiButtonClicked;
let yourCount;


// tell the server the user is leaving
function sendUserLeavingData() {
    const formData = new FormData();
    formData.append('user_leaving', true);
    navigator.sendBeacon('/update.php', formData);
}

// Send click count to server
async function sendCounter() {
    try {
        const res = await fetch("/update.php", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `count=${clickCount}`,
            cache: 'no-cache'
        });
        const data = await res.text();

        if (clickCount - 10 < 0) {
            clickCount = 0;
        } else {
            clickCount = clickCount - 10;
        }
    } catch (err) {
        console.error(err);
    }
}

// Update public counter
async function updateCounters() {
    try {
        const res = await fetch("/update.php");
        const data = await res.text();

        if (parseInt(data) - publicCounter <= 0) {
            difference = 0;
        } else {
            difference = parseInt(data) - publicCounter;
        }

        publicCounter = difference + publicCounter;

        if (!isNaN(yourCount)) {
            yourCountElement.innerHTML = yourCount;
        }
        if (!isNaN(publicCounter)) {
            publicCounterElement.innerHTML = publicCounter;
        }
    } catch (err) {
        console.error(err);
    }
}

// Check if the "yourCount" cookie exists, and if so, retrieve its value, if not make a new one
const yourCountCookie = document.cookie.split(";").find((c) => c.trim().startsWith("yourCount="));
if (yourCountCookie) {
    yourCount = parseInt(yourCountCookie.split("=")[1]);
}
else {
    document.cookie = `yourCount=0; SameSite=None; Secure`;
    yourCount = 0;
}
updateCounters();

// lopi button listener 
lopiButton.addEventListener("click", () => {
    clickCount++;
    yourCount++;
    yourCountElement.innerHTML = yourCount;
    publicCounter++;
    publicCounterElement.innerHTML = publicCounter;

    // setcounters and update with serrver
    if (clickCount >= 10) {
        console.log("sending clicks to server");
        loopCount++;
        sendCounter();
    } else if (loopCount >= 2) {
        console.log("click count trigered update");
        updateCounters();
        loopCount = 0;
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
        if (clickCount > 0) {
            sendCounter();
        }
        updateCounters();
    }, 500);
});
lopiButton.addEventListener('mousedown', () => {
    clearTimeout(timeout);
});

window.addEventListener("beforeunload", function (event) {
    sendUserLeavingData();
});

// Get value of Counters from server if button hasent been clicked in a bit
setInterval(() => {
    if (!lopiButtonClicked) {
        console.log("click timout update");
        if (clickCount > 0) {
            sendCounter();
        }
        updateCounters();
    }
}, 2000);
