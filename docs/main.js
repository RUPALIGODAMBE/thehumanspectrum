document.addEventListener("DOMContentLoaded", () => {
  const playBtn = document.getElementById("playBtn");
  const pipPlayer = document.getElementById("pipPlayer");
  const youtubeFrame = document.getElementById("youtubeFrame");
  const closeBtn = document.getElementById("closeBtn");

  const videoUrl = "https://www.youtube.com/embed/ODxwrovSvl4?autoplay=1";

  playBtn.addEventListener("click", () => {
    youtubeFrame.src = videoUrl;
    pipPlayer.classList.remove("hidden");
    pipPlayer.classList.add("flex");
  });

  closeBtn.addEventListener("click", () => {
    youtubeFrame.src = "";
    pipPlayer.classList.add("hidden");
    pipPlayer.classList.remove("flex");
  });

  document.querySelectorAll(".accordion-header").forEach((header) => {
    header.addEventListener("click", () => {
      const body = header.nextElementSibling;
      const icon = header.querySelector("i");

      // Close all other accordion bodies
      document.querySelectorAll(".accordion-body").forEach((b) => {
        if (b !== body) {
          b.style.maxHeight = null;
          b.previousElementSibling
            .querySelector("i")
            .classList.remove("rotate-90");
        }
      });

      // Toggle the clicked one
      if (body.style.maxHeight) {
        body.style.maxHeight = null;
        icon.classList.remove("rotate-90");
      } else {
        body.style.maxHeight = body.scrollHeight + "px";
        icon.classList.add("rotate-90");
      }
    });
  });

  function setupTicker() {
    const track = document.getElementById("logo-track");
    const content = track.querySelector(".logo-track-content");

    // Remove old clone if exists
    const oldClone = track.querySelector(".logo-track-content.clone");
    if (oldClone) oldClone.remove();

    // Clone content for seamless loop
    const clone = content.cloneNode(true);
    clone.classList.add("clone");
    track.appendChild(clone);

    // Measure real width
    const width = content.offsetWidth;

    // Set CSS vars on the track
    track.style.setProperty("--logo-track-width", `${width}px`);

    // Speed control: larger width = longer duration
    const speed = 100; // px per second
    const duration = width / speed;
    track.style.setProperty("--logo-track-duration", `${duration}s`);
  }

  // Run once and on resize
  window.addEventListener("load", setupTicker);
  window.addEventListener("resize", setupTicker);

  function setupTextTicker() {
    const ticker = document.getElementById("ticker");
    const content = ticker.querySelector(".ticker-content");

    const oldClone = ticker.querySelector(".ticker-content.clone");
    if (oldClone) oldClone.remove();

    const clone = content.cloneNode(true);
    clone.classList.add("clone");
    ticker.appendChild(clone);

    const width = content.offsetWidth;

    ticker.style.setProperty("--ticker-width", `${width}px`);

    const speed = 80;
    const duration = width / speed;
    ticker.style.setProperty("--ticker-duration", `${duration}s`);
  }

  window.addEventListener("resize", setupTextTicker);
  window.addEventListener("load", setupTextTicker);

  // const form = document.getElementById("contactForm");
  // const successMsg = document.getElementById("successMsg");

  // form.addEventListener("submit", function (e) {
  //   e.preventDefault(); // remove this if you want actual server submission

  //   // 👉 This only works on the form element
  //   form.reset();

  //   // Show feedback
  //   successMsg.classList.remove("hidden");
  //   setTimeout(() => successMsg.classList.add("hidden"), 3000);
  // });

  document
    .getElementById("contactForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const token = document.querySelector(
        "[name='g-recaptcha-response']"
      ).value;

      if (!token) {
        alert("Please complete the reCAPTCHA before submitting.");
        return;
      }

      fetch(
        "https://ths-google-script-proxy.braveheartask.workers.dev",
        /*"https://ths-google-sheets-negotiator.connect-thehumanspectrum.workers.dev",*/
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // headers: {"content-type":"application/json"},
          body: JSON.stringify({
            type: "Contact",
            token: token,
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            city: document.getElementById("city").value,
            message: document.getElementById("message").value,
          }),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.message) {
            alert(data.message);
            if (data.status === "success") {
              document.getElementById("contactForm").reset();
              grecaptcha.reset();
            }
          } else {
            alert("Network error: " + data.error);
          }
        })
        .catch((err) => alert("Network error: " + err.error));
    });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.remove("opacity-0", "translate-y-10");
        entry.target.classList.add("opacity-100", "translate-y-0");
        observer.unobserve(entry.target);
      }
    });
  });
  document
    .querySelectorAll("[data-reveal]")
    .forEach((el) => observer.observe(el));
});
