document.addEventListener("DOMContentLoaded", () => {
  const artistForm = document.getElementById("artistForm");
  const spinner = document.getElementById("loading-overlay");
  const qrModal = document.getElementById("qrModal");
  const closeModal = document.getElementById("closeModal");
  const qrContainer = document.getElementById("qrContainer");
  const qrLink = document.getElementById("qrLink");
  const downloadPNG = document.getElementById("downloadPNG");
  const downloadSVG = document.getElementById("downloadSVG");
  const generateQrForm = document.getElementById("generateQrForm");
  const logoutBtn = document.getElementById("logoutBtn");

  const size = Math.min(window.innerWidth * 0.8, 1024);

  let currentQrCode = null;
  let currentArtistName = "";

  artistForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;

    const file = form.drawingImage.files[0];

    const mimeType = file.type || "image/png";

    const reader = new FileReader();

    reader.onload = async function () {
      const base64Data = reader.result.split(",")[1];
      const payload = {
        type: "Design",
        artistName: form.name.value,
        designName: form.drawingName.value,
        videoLink: form.videoLink.value,
        imageName: file.name,
        imageData: base64Data,
        mimeType: mimeType,
      };

      try {
        spinner.classList.remove("hidden");
        const res = await fetch(
          "https://ths-google-sheets-negotiator.connect-thehumanspectrum.workers.dev",
          {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        const data = await res.json();
        spinner.classList.add("hidden");
        artistForm.reset();
        const { designPageUrl, artistName } = data;
        showQRModal(designPageUrl, artistName);
      } catch (err) {
        alert(err.message);
      } finally {
        spinner.classList.add("hidden");
        artistForm.reset();
      }
    };

    reader.readAsDataURL(file);
  });

  generateQrForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const qrForm = e.target;
    const url = new URL(qrForm.pageUrl.value);
    const id = url.searchParams.get("id");
    if (!id) return alert("No ID Found in URL");
    let aName;
    try {
      const res = await fetch(
        `https://ths-google-sheets-negotiator.connect-thehumanspectrum.workers.dev?id=${id}`
      );
      if (!res.ok) {
        throw new Error(`Request failed due to ${res.status}`);
      }
      const data = await res.json();
      aName = data["Artist Name"];
    } catch (error) {
      alert("Artist Details not found");
    }
    showQRModal(qrForm.pageUrl.value, aName);
  });

  const modal = document.getElementById("qrModal");
  const closeBtn = document.getElementById("closeModal");

  function hideModal() {
    modal.classList.add("hidden");
  }

  closeBtn.addEventListener("click", hideModal);

  function showQRModal(designPageUrl, artistName) {
    qrContainer.innerHTML = "";
    console.log(artistName);
    currentQrCode = new QRCodeStyling({
      type: "svg",
      width: 512,
      height: 512,
      data: designPageUrl,
      image: "assets/mannmade_logo.svg",
      dotsOptions: { color: "#000", type: "rounded" },
      backgroundOptions: { color: "#fff" },
      imageOptions: { crossOrigin: "anonymous", margin: 10 },
      qrOptions: { errorCorrectionLevel: "H" },
    });
    currentArtistName = artistName;
    currentQrCode.append(qrContainer);
    qrLink.textContent = designPageUrl;
    qrLink.href = designPageUrl;

    qrModal.classList.remove("hidden");
    qrModal.classList.add("flex");
    qrModal.children[0].classList.remove("scale-95");
    qrModal.children[0].classList.add("scale-100");

    downloadPNG.addEventListener("click", () => {
      if (currentQrCode) {
        console.log(currentArtistName);
        currentQrCode.download({ extension: "png", name: currentArtistName });
      }
    });

    downloadSVG.addEventListener("click", () => {
      if (currentQrCode) {
        currentQrCode.download({ extension: "svg", name: currentArtistName });
      }
    });
  }

  closeModal.addEventListener("click", () => {
    qrModal.classList.add("hidden");
    qrModal.classList.remove("flex");
  });

  logoutBtn.addEventListener("click", () => {
    window.location.href =
      "https://thehumanspectrum.cloudflareaccess.com/cdn-cgi/access/logout";
  });
});
