document.addEventListener('DOMContentLoaded', () => {
    const artistName = document.getElementById("artistName");
    const videoFrame = document.getElementById("videoFrame");
    const drawingName = document.getElementById("drawingName");
    const drawingImage = document.getElementById("drawingImage");

    async function loadDesignData() {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get("id");
        if(!id) return alert("No ID Found in URL");

        const res = await fetch(`https://ths-google-script-proxy.braveheartask.workers.dev?id=${id}`);
        
        const data = await res.json();

        console.log(data);
        
    }

    loadDesignData();
})