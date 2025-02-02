const mainImage = document.getElementById("mainImage");
      const prevBtn = document.getElementById("prevBtn");
      const nextBtn = document.getElementById("nextBtn");
      const downloadBtn = document.getElementById("downloadBtn");
      const fullscreenBtn = document.getElementById("fullscreenBtn");
      const zoomBtn = document.getElementById("zoomBtn");
      const copyUrlBtn = document.getElementById("copyUrlBtn"); // New copy button
      const copyUrlBtnRand = document.getElementById("copyUrlBtnRand");
      const currentImageSpan = document.getElementById("currentImage");
      const thumbnailContainer = document.getElementById("thumbnailContainer");
      const fullscreenView = document.getElementById("fullscreenView");
      const fullscreenImage = fullscreenView.querySelector("img");
      const closeFullscreen = document.querySelector(".close-fullscreen");
      const loadingSpinner = document.querySelector(".loading-spinner");
      const customAlert = document.getElementById("customAlert");
  
      let totalImages = 0;
      let currentImageIndex = 1;
      let isZoomed = false;
  
      // Get base URL dynamically for the deployed environment
      const baseURL = window.location.origin;
  
      // Fetch total images dynamically
      async function fetchTotalImages() {
        try {
          const response = await fetch(`${baseURL}/health`);
          const data = await response.json();
          totalImages = data.imagesAvailable || 1;
        } catch (error) {
          console.error("Error fetching total images:", error);
          totalImages = 1;
        }
      }
  
      // Fetch image by index
      async function fetchImage(index) {
        if (index < 1 || index > totalImages) return;
  
        try {
          loadingSpinner.style.display = "block";
          currentImageIndex = index;
          const imageUrl = `${baseURL}/images/${index}.jpg`;
  
          mainImage.src = imageUrl;
          fullscreenImage.src = imageUrl;
          currentImageSpan.textContent = index;
        } catch (error) {
          console.error("Error loading image:", error);
        } finally {
          loadingSpinner.style.display = "none";
        }
      }
  
      // Show a random image
      async function showRandomImage() {
        try {
          const response = await fetch(`${baseURL}/api/random-image`);
          const data = await response.json();
          if (data.imageNumber) {
            fetchImage(data.imageNumber);
          }
        } catch (error) {
          console.error("Error fetching random image:", error);
        }
      }
  
      // Load thumbnails dynamically
      async function loadThumbnails() {
        for (let i = 1; i <= totalImages; i++) {
          const thumbnail = document.createElement("img");
          thumbnail.src = `${baseURL}/images/${i}.jpg`;
          thumbnail.alt = `Thumbnail ${i}`;
          thumbnail.classList.add("thumbnail");
          thumbnail.loading = "lazy";
          thumbnail.onclick = () => fetchImage(i);
          thumbnailContainer.appendChild(thumbnail);
        }
      }
  
      // Copy URL function
      function copyImageUrl() {
        const imageUrl = `${baseURL}/images/${currentImageIndex}.jpg`;
        navigator.clipboard
          .writeText(imageUrl)
          .then(() => {
            showAlert("✅ Copied successfully!");
          })
          .catch((err) => {
            console.error("Failed to copy URL:", err);
          });
      }
  
      function copyImageUrlRand() {
        const imageUrl = `${baseURL}/api/random-image`;
  
        navigator.clipboard
          .writeText(imageUrl)
          .then(() => {
            showAlert("✅ Copied Random Image URL successfully!");
          })
          .catch((err) => {
            console.error("Failed to copy URL:", err);
          });
      }
  
      function showAlert(message) {
        customAlert.textContent = message;
        customAlert.classList.add("show");
        setTimeout(() => {
          customAlert.classList.remove("show");
        }, 2000);
      }
  
      // Event listeners
      prevBtn.onclick = () => fetchImage(currentImageIndex - 1);
      nextBtn.onclick = () => fetchImage(currentImageIndex + 1);
      zoomBtn.onclick = () => {
        isZoomed = !isZoomed;
        mainImage.classList.toggle("zoomed", isZoomed);
        zoomBtn.textContent = isZoomed ? "🔍 Reset" : "🔍 Zoom";
      };
      fullscreenBtn.onclick = () => {
        fullscreenView.style.display =
          fullscreenView.style.display === "flex" ? "none" : "flex";
        document.body.style.overflow =
          fullscreenView.style.display === "flex" ? "hidden" : "";
      };
      closeFullscreen.onclick = fullscreenBtn.onclick;
  
      downloadBtn.onclick = () => {
        const link = document.createElement("a");
        link.href = mainImage.src;
        link.download = `image${currentImageIndex}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
  
      // Copy URL button
      copyUrlBtn.onclick = copyImageUrl;
      copyUrlBtnRand.onclick = copyImageUrlRand;
  
      document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") prevBtn.click();
        if (e.key === "ArrowRight") nextBtn.click();
        if (e.key === " ") {
          e.preventDefault();
          zoomBtn.click();
        }
        if (e.key === "f" || e.key === "F") fullscreenBtn.click();
        if (e.key === "Escape") {
          if (fullscreenView.style.display === "flex") fullscreenBtn.click();
          if (isZoomed) zoomBtn.click();
        }
      });
  
      // Initialize gallery
      (async () => {
        await fetchTotalImages();
        await showRandomImage();
        await loadThumbnails();
      })();