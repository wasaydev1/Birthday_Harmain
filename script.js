document.addEventListener("DOMContentLoaded", () => {
  const giftBox = document.getElementById("giftBox");
  const confettiContainer = document.getElementById("confettiContainer");

  const colors = [
    "#FF6F61",
    "#FFD166",
    "#06D6A0",
    "#118AB2",
    "#073B4C", // Vibrant
    "#FFC0CB",
    "#ADD8E6",
    "#90EE90",
    "#FFB6C1",
    "#FFE4B5", // Pastel
    "#8A2BE2",
    "#DC143C",
    "#20B2AA",
    "#FF4500", // Stronger
  ];

  const balloonTexts = [
    "🥳",
    "🎉",
    "🎁",
    "🎈",
    "🎂",
    "✨",
    "🎊",
    "🌟",
    "💖",
    "🥳",
  ];

  let infiniteConfettiInterval;

  giftBox.addEventListener("click", () => {
    if (giftBox.classList.contains("open")) {
      return; // Prevent multiple clicks
    }

    giftBox.classList.add("open");
    giftBox.querySelector(".click-text").style.opacity = 0; // Hide click text

    // Get the gift box's position
    const giftBoxRect = giftBox.getBoundingClientRect();
    const initialSpawnX = giftBoxRect.left + giftBoxRect.width / 2;
    const initialSpawnY = giftBoxRect.top + giftBoxRect.height * 0.2; // From top part of box

    // Initial big burst from the box
    setTimeout(() => {
      createElements(50, "balloon", initialSpawnX, initialSpawnY, true); // Balloons from box, set fromBox = true
    }, 300);

    setTimeout(() => {
      createElements(400, "confetti", initialSpawnX, initialSpawnY, true); // Confetti from box
    }, 500);

    // Start infinite falling confetti/ribbons from the top of the screen
    setTimeout(() => {
      if (!infiniteConfettiInterval) {
        // Prevent multiple intervals
        infiniteConfettiInterval = setInterval(() => {
          // Spawn from random X across the entire screen width, starting above the viewport
          const spawnX = Math.random() * window.innerWidth;
          const spawnY = -50; // Start 50px above the viewport to make them fall from top

          // Add a mix of confetti and ribbons in continuous fall
          if (Math.random() < 0.7) {
            // 70% chance for confetti/ribbon
            createElements(
              Math.floor(Math.random() * 5) + 3,
              "confetti",
              spawnX,
              spawnY,
              false
            ); // 3-7 confetti
          } else {
            // 30% chance for a balloon
            createElements(1, "balloon", spawnX, spawnY, false); // 1 balloon (these will float UPWARDS)
          }
        }, 100); // Generate new elements every 100ms
      }
    }, 1500); // Start infinite fall after initial burst animation plays a bit

    // Reset gift box after initial burst animation (infinite fall continues)
    setTimeout(() => {
      giftBox.classList.remove("open");
      giftBox.querySelector(".click-text").style.opacity = 1;
    }, 5500);
  });

  function createElements(count, type, spawnX, spawnY, fromBox = false) {
    for (let i = 0; i < count; i++) {
      const element = document.createElement("div");
      element.classList.add(type);

      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      element.style.setProperty("--color", randomColor);

      // Initial position: spread around spawnX/Y or randomly at top for infinite fall
      let initialLeft, initialTop;
      if (fromBox) {
        initialLeft = spawnX + (Math.random() * 80 - 40); // +/- 40px spread around center X
        initialTop = spawnY + (Math.random() * 50 - 25); // +/- 25px spread around center Y
      } else {
        // For infinite fall, spawnX is already randomized across screen width
        initialLeft = spawnX + (Math.random() * 100 - 50); // Small horizontal spread
        initialTop = spawnY + (Math.random() * 50 - 25); // Small vertical spread
      }

      element.style.left = `${initialLeft}px`;
      element.style.top = `${initialTop}px`;

      // Calculate end positions for the animation, relative to the initial position
      let travelX, travelY;

      if (type === "balloon" && fromBox) {
        // THIS IS FOR BOX BALLOONS (UP THEN DOWN)
        // Box balloons: rise up then fall down smoothly
        // We'll use a peak Y for the highest point
        const peakY = -(
          window.innerHeight * 0.4 +
          Math.random() * window.innerHeight * 0.2
        ); // Go 40-60% up from viewport height
        const peakX =
          Math.random() * window.innerWidth * 0.6 - window.innerWidth * 0.3; // Horizontal drift at peak

        // Mid-fall Y to ensure visibility during descent
        const midFallY =
          window.innerHeight * 0.5 + Math.random() * window.innerHeight * 0.2; // Fall to 50-70% of screen height

        // Final destination at bottom
        const finalFallY = window.innerHeight + 100 + Math.random() * 200; // Go off screen bottom

        element.style.setProperty("--y-peak", `${peakY}px`);
        element.style.setProperty("--x-peak", `${peakX}px`);
        element.style.setProperty("--y-mid-fall", `${midFallY}px`); // New variable for mid-fall

        travelX =
          Math.random() * window.innerWidth * 0.8 - window.innerWidth * 0.4; // Final horizontal drift
        travelY = finalFallY; // Final vertical position

        // Apply the specific animation for box balloons
        element.style.animation = `boxBalloonFloatAndFall var(--duration, 7s) ease-in-out forwards`; // Increased duration for smoother fall
      } else if (type === "balloon" && !fromBox) {
        // Infinite balloons float up
        travelX =
          Math.random() * window.innerWidth * 0.4 - window.innerWidth * 0.2;
        travelY = -(window.innerHeight + Math.random() * 300); // Float higher up (negative Y)
        // Use default balloonFloat animation defined in CSS
      } else {
        // Confetti/ribbons (both from box and infinite) fall down
        travelX =
          Math.random() * window.innerWidth * 0.8 - window.innerWidth * 0.4;
        travelY = window.innerHeight + Math.random() * 300; // Fall off bottom (positive Y)
        // Use default fadeAndFloat animation defined in CSS
      }

      element.style.setProperty("--x-end", `${travelX}px`);
      element.style.setProperty("--y-end", `${travelY}px`);

      // Random duration for each element
      const duration = fromBox ? Math.random() * 2 + 6 : Math.random() * 3 + 7; // Box: 6-8s, Infinite: 7-10s
      element.style.setProperty("--duration", `${duration}s`);

      // Introduce Z-index for 3D depth illusion
      let zDepthStart, zDepthEnd;
      if (fromBox) {
        zDepthStart = Math.random() * -150 - 100; // More negative: Between -100 and -250 to start further behind
        zDepthEnd = Math.random() * 200 + 100; // Positive Z to come forward and go further
      } else {
        // For infinite fall, start Z near 0 or slightly negative
        zDepthStart = Math.random() * -50;
        zDepthEnd = Math.random() * 100;
      }

      element.style.setProperty("--z-start", `${zDepthStart}px`);
      element.style.setProperty("--z-end", `${zDepthEnd}px`);

      // Set element's z-index.
      element.style.zIndex = fromBox
        ? Math.floor(Math.random() * 5)
        : Math.floor(Math.random() * 20) + 1; // 1 to 20 for infinite elements

      // Initial random rotation for more dynamism
      element.style.setProperty(
        "--initial-rotate",
        `${Math.random() * 360}deg`
      );

      if (type === "balloon") {
        const randomText =
          balloonTexts[Math.floor(Math.random() * balloonTexts.length)];
        element.textContent = randomText;
        const balloonSize = Math.random() * 40 + 60; // Larger balloons: 60-100px
        element.style.setProperty("--width", `${balloonSize}px`);
        element.style.setProperty("--height", `${balloonSize * 1.3}px`);
      } else if (type === "confetti") {
        const confettiSize = Math.random() * 10 + 8; // Larger confetti: 8-18px
        element.style.setProperty("--size", `${confettiSize}px`);

        if (Math.random() > 0.5) {
          // Mix of squares and circles (ribbons)
          element.style.setProperty("--border-radius", "0"); // Square
        } else {
          element.style.setProperty("--border-radius", "50%"); // Circle
        }

        // Add a subtle blur for depth of field illusion
        element.style.setProperty("--blur", `${Math.random() * 1.5}px`);
      }

      confettiContainer.appendChild(element);

      // Trigger animation with a slight delay for burst effect
      setTimeout(() => {
        element.style.opacity = 1;
      }, Math.random() * 200);

      // Remove element after its animation is complete to prevent DOM clutter for non-infinite animations
      if (fromBox) {
        // Only remove elements that come from the box after their animation
        setTimeout(() => {
          element.remove();
        }, duration * 1000 + 500); // duration is in seconds, add a buffer
      }
    }
  }
});

let birthdayMusic = [
  {
    id: 1,
    music: "./imgs/happy-birthday-368842.mp3",
  },
];

// Declare musicPlay outside the function so its state persists across calls
let musicPlay = null;

let birthdaywishes = () => {
  // If musicPlay hasn't been initialized yet (first call)
  if (musicPlay === null) {
    let response = birthdayMusic[0].music;
    musicPlay = new Audio(response); // Initialize the Audio object once
    console.log("Music initialized:", musicPlay); // For debugging
    musicPlay.play(); // Play it
  } else if (musicPlay.paused) {
    // If it was paused (e.g., user navigated away and came back, or manually paused elsewhere), play it
    musicPlay.play();
  }
  // If it's already playing, do nothing (don't pause or restart)
};
