// Server banane ke liye zaroori modules import karna
const express = require('express');
const path = require('path');
const fs = require('fs'); // File System module, file ko padhne ke liye
const app = express();
const PORT = 3000; // Server is port par chalega

// --- 1. Video Data Load Karna ---
const videosFilePath = path.join(__dirname, 'video_data.json');

let videos = [];
try {
    const data = fs.readFileSync(videosFilePath, 'utf8');
    videos = JSON.parse(data);
    console.log(`Successfully loaded ${videos.length} videos from video_data.json`);
} catch (err) {
    console.error('Error loading video data:', err);
    videos = [];
}

app.use(express.static(path.join(__dirname, 'public')));

// --- 2. Main Route (Homepage) ---
app.get('/', (req, res) => {
    let videoListHTML = '';
    
    if (videos.length > 0) {
        videos.forEach(video => {
            let mediaContent = '';
            
            // YOUTUBE VIDEO KE LIYE (iframe)
            if (video.youtube_id) { 
                mediaContent = `
                    <iframe 
                        width="100%" 
                        height="400" 
                        src="https://www.youtube.com/embed/${video.youtube_id}" 
                        frameborder="0" 
                        allowfullscreen>
                    </iframe>
                `;
            } 
            // CLOUDINARY VIDEO KE LIYE (<video> tag)
            else if (video.filename) {
    mediaContent = `
        <video controls width="100%" height="auto">
            <source src="/${video.filename}" type="video/mp4"> 
            Aapka browser video ko support nahi karta.
        </video>
    `;
}

            // Agar koi media type mila
            if (mediaContent) {
                 videoListHTML += `
                    <div class="video-item">
                        <h3>${video.title}</h3>
                        ${mediaContent}
                        <p>${video.description}</p>
                        <hr>
                    </div>
                `;
            }
        });
    } else {
        videoListHTML = '<p>Abhi koi video uplod nahi hui hai.</p>';
    }

    // Poora HTML page template
    const htmlPage = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Video Streaming Site (Practice)</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; background-color: #f4f4f9; }
                .container { max-width: 800px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
                h1 { text-align: center; color: #333; }
                .video-item { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 4px; }
                video, iframe { max-width: 100%; height: auto; display: block; margin: 10px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>📺 Meri Video Practice Website</h1>
                ${videoListHTML}
            </div>
        </body>
        </html>
    `;

    // Client ko HTML page bhejna
    res.send(htmlPage);
});

// --- 3. Server Start Karna ---
app.listen(PORT, () => {
    console.log(`Server started successfully on http://localhost:${PORT}`);
    console.log('Ab is link ko browser mein kholein.');
});