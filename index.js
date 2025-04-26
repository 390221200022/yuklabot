const TelegramBot = require('node-telegram-bot-api');
const { igdl, ttdl, fbdown, twitter, youtube } = require('btch-downloader');
const { IgDownloader } = require('ig-downloader');

// Bot token
const token ="8049570494:AAEYsdoC2DaR_Ywn0En2oohiBmw7n48wOw0";
const bot = new TelegramBot(token, { polling: true });

// Başlangıçta kullanıcıya gösterilecek menü
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    const options = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "📹 Instagram Downloader", callback_data: 'instagram_downloader' },
                    { text: "🎵 TikTok Downloader", callback_data: 'tiktok_downloader' }
                ],
                [
                    { text: "📺 YouTube Downloader", callback_data: 'youtube_downloader' },
                    { text: "❓ Facebook Downloader", callback_data: 'facebook_downloader' }
                ],
                [
                    { text: "🐦 Twitter (X) Downloader", callback_data: 'twitter_downloader' }
                ]
            ],
            keyboard: [
                [
                    { text: "📹 Instagram Downloader", callback_data: 'instagram_downloader' },
                    { text: "🎵 TikTok Downloader", callback_data: 'tiktok_downloader' }
                ],
                [
                    { text: "📺 YouTube Downloader", callback_data: 'youtube_downloader' },
                    { text: "❓ Facebook Downloader", callback_data: 'facebook_downloader' }
                ],
                [
                    { text: "🐦 Twitter (X) Downloader", callback_data: 'twitter_downloader' }
                ]
            ],
            resize_keyboard: true, // Klavye boyutunu ekran boyutuna göre ayarlama
            one_time_keyboard: false
        }
    };

    bot.sendMessage(chatId, 'Hello! Please select an option:', options);
});

// Kullanıcı butonlara tıkladığında yapılacak işlemler
bot.on('callback_query', async (callbackQuery) => {
   
    const userId = callbackQuery.from.id;
    const callbackData = callbackQuery.data;

    // Instagram Downloader butonuna tıklanması
    if (callbackData === 'instagram_downloader') {
        await bot.sendMessage(userId, 'Please send the Instagram video URL.');
    }
    // TikTok Downloader butonuna tıklanması
    else if (callbackData === 'tiktok_downloader') {
        await bot.sendMessage(userId, 'Please send the TikTok video URL.');
    }
    // YouTube Downloader butonuna tıklanması
    else if (callbackData === 'youtube_downloader') {
        await bot.sendMessage(userId, 'Please send the YouTube video URL.');
    }
    // Facebook Downloader butonuna tıklanması
    else if (callbackData === 'facebook_downloader') {
        await bot.sendMessage(userId, 'Please send the Facebook video URL.');
    }
    // Twitter Downloader (X) butonuna tıklanması
    else if (callbackData === 'twitter_downloader') {
        await bot.sendMessage(userId, 'Please send the Twitter video URL.');
    }
});

// Kullanıcı mesajı gönderdiğinde (URL'leri işlemek için)
bot.on('message', async (msg) => {
    const userId = msg.from.id;
    const text = msg.text;

    // Geçersiz mesaj durumunda, tekrar menüyü göster
    const urlPattern = /https?:\/\/[^\s]+/g;
    const match = text.match(urlPattern);

    if (!match) {
        await bot.sendMessage(userId, 'Please send a valid URL.', { reply_to_message_id: msg.message_id });

        return;
    }

    const url = match[0];

    // Instagram video işleme
    if (url.includes('instagram.com')) { 
        try {
            const data = await IgDownloader(url);
            await bot.sendMessage(userId, `Download link:\n\n${data.video_url}`, { reply_to_message_id: msg.message_id });
        } catch (error) {
            console.error(`Error fetching Instagram video:`, error.message);
            await bot.sendMessage(userId, 'An error occurred while processing the Instagram video.', { reply_to_message_id: msg.message_id });
        }
    }
    
    // TikTok video işleme
    else if (url.includes('tiktok.com')) {
        try {
            const data = await ttdl(url); // TikTok video işlemi
            console.log(data); // JSON çıktısını console'a yazdır
            const videoUrl = data.video[0]; // TikTok'tan gelen video linkini alıyoruz
            await bot.sendMessage(userId, `Download link: ${videoUrl}`);
            const audioUrl = data.audio[0]; // TikTok'tan gelen audio linkini alıyoruz
            await bot.sendMessage(userId, `Audio link: ${audioUrl}`);
        } catch (error) {
            console.error(`Error fetching TikTok video:`, error.message);
            await bot.sendMessage(userId, 'An error occurred while processing the TikTok video.');
        }
    }
    // Facebook video işleme
    else if (url.includes('facebook.com')) {
        try {
            const data = await fbdown(url); // Facebook video işlemi
            console.log(data); // JSON çıktısını console'a yazdır
            const videoUrl = data.HD; // Facebook'tan gelen HD video linkini alıyoruz
            await bot.sendMessage(userId, `Download link: ${videoUrl}`);
        } catch (error) {
            console.error(`Error fetching Facebook video:`, error.message);
            await bot.sendMessage(userId, 'An error occurred while processing the Facebook video.');
        }
    }
    // Twitter video işleme
    else if (url.includes('x.com')) {
        try {
            const data = await twitter(url); // Twitter video işlemi
            console.log(data); // JSON çıktısını console'a yazdır
            
            // 'url' anahtarını kontrol edip HD video linkini alıyoruz
            const videoUrl = data.url.find(video => video.hd).hd; // HD video linkini bulup alıyoruz
            await bot.sendMessage(userId, `Download link: ${videoUrl}`);
        } catch (error) {
            console.error(`Error fetching Twitter video:`, error.message);
            await bot.sendMessage(userId, 'An error occurred while processing the Twitter video.');
        }
    }
    
    // YouTube video işleme
    else if (url.includes('youtube.com')) {
        try {
            const data = await youtube(url); // YouTube video işlemi
            console.log(data); // JSON çıktısını console'a yazdır
            const videoUrl = data.mp4; // YouTube'tan gelen mp4 video linkini alıyoruz
            await bot.sendMessage(userId, `Video download link: ${videoUrl}`);
            const audioUrl = data.mp3; // YouTube'tan gelen mp3 audio linkini alıyoruz
            await bot.sendMessage(userId, `Audio download link: ${audioUrl}`);
        } catch (error) {
            console.error(`Error fetching YouTube video:`, error.message);
            await bot.sendMessage(userId, 'An error occurred while processing the YouTube video.');
        }
    }
});
