document.addEventListener("DOMContentLoaded", () => {
  const artistName = document.getElementById("artistName");
  const videoFrame = document.getElementById("videoFrame");
  const drawingName = document.getElementById("drawingName");
  const drawingImage = document.getElementById("drawingImage");
  const drawingFrame = document.getElementById("drawingFrame");
  const videoContaier = videoFrame.parentElement;
  const videoPlaceHolder = document.getElementById("videoPlaceHolder");
  const imagePlaceHolder = document.getElementById("imagePlaceholder");

  async function loadDesignData() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    if (!id) return alert("No ID Found in URL");

    try {
      const res = await fetch(
        `https://ths-google-sheets-negotiator.connect-thehumanspectrum.workers.dev?id=${id}`
      );
      if (!res.ok) {
        throw new Error(`Request failed due to ${res.status}`);
      }
      const data = await res.json();
      console.log(data);
      artistName.textContent = `Meet ${
        data["Artist Name"] || "Unknown Artist"
      }`;
      drawingName.textContent = `${data["Design Name"] || ""}`;

      if (data["Image Url"]) {
        let imgUrl = data["Image Url"];
        console.log(imgUrl);
        if (imgUrl.includes("drive.google.com")) {
          const idMatch =
            imgUrl.match(/\/d\/([^/]+)/) || imgUrl.match(/[?&]id=([^&]+)/);
          const fileId = idMatch ? idMatch[1] : null;

          if (fileId) {
             drawingImage.src = `https://ths-google-sheets-negotiator.connect-thehumanspectrum.workers.dev/drive-proxy?id=${fileId}`;
          } else {
            drawingImage.src = imgUrl;
          }
        } else {
          drawingImage.src = imgUrl;
        }
        console.log(imgUrl);
        drawingImage.alt = data["Design Name"] || "Design Image";
      } else {
        drawingImage.src = "../assets/600x400_placeholder.svg";
      }

      if (data["Video Link"]) {
        let videoUrl = data["Video Link"]
          .replace("watch?v=", "embed/")
          .replace("shorts/", "embed/");

        videoFrame.src = videoUrl;
        videoContaier.classList.remove("hidden");
      } else {
        videoContaier.classList.add("hidden");
      }
    } catch (err) {
      console.error(err);
      artistName.textContent = "⚠️ Failed to load design details";
    }
  }

  videoFrame.addEventListener("load", () => {
    videoPlaceHolder.classList.add(
      "opacity-70",
      "transition-opacity",
      "duration-500"
    );
    setTimeout(() => {
      videoPlaceHolder.style.display = "none";
    }, 500);
  });

  drawingImage.addEventListener("load", () => {
    // Fade in image
    drawingImage.classList.remove("opacity-0");
    drawingImage.classList.add("opacity-100");
    drawingFrame.classList.remove("opacity-0");
    drawingFrame.classList.add("opacity-100");

    // Fade out shimmer
    imagePlaceHolder.classList.add(
      "opacity-0",
      "transition-opacity",
      "duration-500"
    );
    setTimeout(() => {
      imagePlaceHolder.style.display = "none";
    }, 500);
  });

  loadDesignData();
});
