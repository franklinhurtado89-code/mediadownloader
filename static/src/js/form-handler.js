// Explícame paso a paso que hace el siguiente código:

document.addEventListener('DOMContentLoaded', () => {
  const mediaForm = document.getElementById('media-form');
  const urlInput = document.getElementById('url-input');
  const infoCard = document.getElementById('info-card-container');
  const submitButton = mediaForm.querySelector('button[type="submit"]');
  const originalButtonContent = submitButton.innerHTML;

  // Elementos de la tarjeta de información
  const infoThumbnail = document.getElementById('info-thumbnail');
  const infoTitle = document.getElementById('info-title');
  const infoUploader = document.getElementById('info-uploader');
  const infoDuration = document.getElementById('info-duration');
  const downloadVideo = document.getElementById('download-video');
  const downloadAudio = document.getElementById('download-audio');

  const formatDuration = (seconds) => {
    if (isNaN(seconds) || seconds < 0) {
      return 'N/A';
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')} min`;
  };

  const isYouTubeUrl = (url) => {
    const pattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.be)\/.+$/;
    return pattern.test(url);
  };

  mediaForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const url = urlInput.value.trim();

    if (!url) {
      alert('Por favor, ingresa una URL.');
      return;
    }

    if (!isYouTubeUrl(url)) {
      alert('Solo se permiten enlaces de YouTube.');
      return;
    }

    // Deshabilitar botón y mostrar spinner
    submitButton.disabled = true;
    submitButton.innerHTML = `
      <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    `;
    infoCard.style.display = 'none';

    const csrfToken = mediaForm.querySelector(
      'input[name="csrfmiddlewaretoken"]'
    ).value;

    fetch('/api/get-media-info/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      body: JSON.stringify({ url: url }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(err.error || 'Error del servidor');
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        const videoInfo = data.video_info;

        // Actualizar la tarjeta de información
        infoThumbnail.src = videoInfo.thumbnail;
        infoTitle.textContent = videoInfo.title;
        infoUploader.textContent = videoInfo.uploader;
        infoDuration.textContent = formatDuration(videoInfo.duration);

        infoCard.style.display = 'flex'; // Mostrar la tarjeta
      })
      .catch((error) => {
        console.error('Error:', error);
        alert(`Hubo un problema: ${error.message}`);
      })
      .finally(() => {
        // Restaurar el botón
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonContent;
      });
  });
});
