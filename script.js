document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const promptInput = document.getElementById('prompt-input');
    const negativePromptInput = document.getElementById('negative-prompt');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const seedInput = document.getElementById('seed');
    const hdCheckbox = document.getElementById('hd');
    const enhanceCheckbox = document.getElementById('enhance');
    const nsfwCheckbox = document.getElementById('nsfw');
    const modelSelect = document.getElementById('model');
    const styleSelect = document.getElementById('style');
    const aspectRatioSelect = document.getElementById('aspect-ratio');
    const stepsInput = document.getElementById('steps');
    const stepsValue = document.getElementById('steps-value');
    const lightingSelect = document.getElementById('lighting');
    const colorPaletteSelect = document.getElementById('color-palette');
    const compositionSelect = document.getElementById('composition');
    const generateBtn = document.getElementById('generate-btn');
    const imageContainer = document.getElementById('image-container');
    const imageGrid = document.getElementById('image-grid');
    const loadingIndicator = document.getElementById('loading');
    const outputControls = document.getElementById('output-controls');
    const downloadBtn = document.getElementById('download-btn');
    const saveBtn = document.getElementById('save-btn');
    const enhancePromptBtn = document.getElementById('enhance-prompt');
    const randomPromptBtn = document.getElementById('random-prompt');
    const randomSeedBtn = document.getElementById('random-seed');
    const clearHistoryBtn = document.getElementById('clear-history');
    const historyList = document.getElementById('history-list');
    const themeToggle = document.getElementById('theme-toggle');
    const langEnBtn = document.getElementById('lang-en');
    const langIdBtn = document.getElementById('lang-id');
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    // Aspect ratio presets
    const aspectRatios = {
        '1:1': { width: 1024, height: 1024 },
        '4:3': { width: 1280, height: 960 },
        '16:9': { width: 1280, height: 720 },
        '9:16': { width: 720, height: 1280 },
        '3:2': { width: 1200, height: 800 },
        '2:3': { width: 800, height: 1200 }
    };
    
    // Sample random prompts
    const randomPrompts = [
        "A cyberpunk cityscape at night with neon lights and flying cars",
        "A majestic dragon perched on a mountain peak under a full moon",
        "An underwater city with glass domes and colorful marine life",
        "A futuristic spaceship landing on an alien planet with strange vegetation",
        "A portrait of a robot with human-like emotions, highly detailed",
        "A magical forest with glowing plants and fairies, fantasy style",
        "A steampunk airship flying through clouds with intricate brass details",
        "A surreal landscape with floating islands and waterfalls in the sky",
        "A samurai warrior standing in the rain at night, cinematic lighting",
        "A cute anime character with pink hair in a futuristic school uniform"
    ];
    
    // Language translations
    const translations = {
        en: {
            promptPlaceholder: "Describe the image you want to generate...",
            negativePromptPlaceholder: "What you don't want in the image...",
            generateBtn: "Generate Image",
            loadingText: "DEVAKA AI LOADING",
            imagePlaceholder: "Your generated image will appear here",
            errorMessage: "Error generating image. Please try again.",
            downloadBtn: "Download",
            saveBtn: "Save",
            enhancePrompt: "Enhance",
            randomPrompt: "Random",
            clearHistory: "Clear",
            historyTitle: "Prompt History",
            copyright: "Copyright © 2025 DEVAKA AI GENERATOR",
            poweredBy: "Powered by Pollinations API | Developed by Dery Lau",
            thanksTo: "Thanks to Github & Cloudflare & DeepSeek"
        },
        id: {
            promptPlaceholder: "Deskripsikan gambar yang ingin Anda hasilkan...",
            negativePromptPlaceholder: "Apa yang tidak Anda inginkan dalam gambar...",
            generateBtn: "Hasilkan Gambar",
            loadingText: "DEVAKA AI MEMUAT",
            imagePlaceholder: "Gambar yang dihasilkan akan muncul di sini",
            errorMessage: "Gagal menghasilkan gambar. Silakan coba lagi.",
            downloadBtn: "Unduh",
            saveBtn: "Simpan",
            enhancePrompt: "Tingkatkan",
            randomPrompt: "Acak",
            clearHistory: "Hapus",
            historyTitle: "Riwayat Prompt",
            copyright: "Hak Cipta © 2025 DEVAKA AI GENERATOR",
            poweredBy: "Didukung oleh Pollinations API | Dikembangkan oleh Dery Lau",
            thanksTo: "Terima kasih kepada Github & Cloudflare & DeepSeek"
        }
    };
    
    let currentLanguage = 'en';
    let generatedImages = JSON.parse(localStorage.getItem('generatedImages')) || [];
    let promptHistory = JSON.parse(localStorage.getItem('promptHistory')) || [];
    
    // Initialize the app
    function init() {
        updateUI();
        renderHistory();
        renderImageGrid();
        
        // Set initial aspect ratio
        updateDimensionsFromAspectRatio();
        
        // Set steps value display
        stepsValue.textContent = stepsInput.value;
        
        // Initialize dark mode
        initDarkMode();
    }
    
    // Initialize dark mode
    function initDarkMode() {
        if (localStorage.getItem('darkMode') === 'true') {
            document.documentElement.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else if (localStorage.getItem('darkMode') === 'false') {
            document.documentElement.classList.remove('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // Fallback to system preference if no localStorage setting
            document.documentElement.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('darkMode', true);
        }
    }
    
    // Update UI based on current language
    function updateUI() {
        const lang = translations[currentLanguage];
        
        promptInput.placeholder = lang.promptPlaceholder;
        negativePromptInput.placeholder = lang.negativePromptPlaceholder;
        generateBtn.innerHTML = `<i class="fas fa-bolt"></i> ${lang.generateBtn}`;
        document.querySelector('.loading-text').textContent = lang.loadingText;
        document.querySelector('.image-placeholder p').textContent = lang.imagePlaceholder;
        downloadBtn.innerHTML = `<i class="fas fa-download"></i> ${lang.downloadBtn}`;
        saveBtn.innerHTML = `<i class="fas fa-save"></i> ${lang.saveBtn}`;
        enhancePromptBtn.innerHTML = `<i class="fas fa-magic"></i> ${lang.enhancePrompt}`;
        randomPromptBtn.innerHTML = `<i class="fas fa-random"></i> ${lang.randomPrompt}`;
        document.querySelector('.history-header h3').textContent = lang.historyTitle;
        clearHistoryBtn.innerHTML = `<i class="fas fa-trash"></i> ${lang.clearHistory}`;
        
        // Update footer
        const footerParagraphs = document.querySelectorAll('.footer p');
        footerParagraphs[0].textContent = lang.copyright;
        footerParagraphs[1].textContent = lang.poweredBy;
        footerParagraphs[2].textContent = lang.thanksTo;
    }
    
    // Toggle accordion sections
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            header.classList.toggle('active');
            const content = header.nextElementSibling;
            content.classList.toggle('open');
        });
    });
    
    // Aspect ratio change handler
    aspectRatioSelect.addEventListener('change', function() {
        if (this.value !== 'custom') {
            updateDimensionsFromAspectRatio();
        }
    });
    
    // Update dimensions based on selected aspect ratio
    function updateDimensionsFromAspectRatio() {
        const ratio = aspectRatioSelect.value;
        if (ratio !== 'custom' && aspectRatios[ratio]) {
            widthInput.value = aspectRatios[ratio].width;
            heightInput.value = aspectRatios[ratio].height;
        }
    }
    
    // Steps input handler
    stepsInput.addEventListener('input', function() {
        stepsValue.textContent = this.value;
    });
    
    // Generate random seed
    randomSeedBtn.addEventListener('click', function() {
        seedInput.value = Math.floor(Math.random() * 1000000);
    });
    
    // Generate random prompt
    randomPromptBtn.addEventListener('click', function() {
        const randomIndex = Math.floor(Math.random() * randomPrompts.length);
        promptInput.value = randomPrompts[randomIndex];
    });
    
    // Enhance prompt
    enhancePromptBtn.addEventListener('click', function() {
        if (!promptInput.value.trim()) {
            alert(translations[currentLanguage].errorMessage);
            return;
        }
        
        // In a real app, you might call an API to enhance the prompt
        // For demo purposes, we'll just add some common enhancements
        const enhancedPrompt = `${promptInput.value}, highly detailed, 4k, 8k, ultra HD, cinematic lighting, professional photography`;
        promptInput.value = enhancedPrompt;
    });
    
    // Theme toggle
    themeToggle.addEventListener('click', function() {
        document.documentElement.classList.toggle('dark-mode');
        const isDark = document.documentElement.classList.contains('dark-mode');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('darkMode', isDark);
        
        // Force redraw to prevent transition glitches
        document.body.style.display = 'none';
        document.body.offsetHeight; // Trigger reflow
        document.body.style.display = '';
    });
    
    // Language switch
    langEnBtn.addEventListener('click', function() {
        if (currentLanguage !== 'en') {
            currentLanguage = 'en';
            langEnBtn.classList.add('active');
            langIdBtn.classList.remove('active');
            updateUI();
            localStorage.setItem('language', 'en');
        }
    });
    
    langIdBtn.addEventListener('click', function() {
        if (currentLanguage !== 'id') {
            currentLanguage = 'id';
            langIdBtn.classList.add('active');
            langEnBtn.classList.remove('active');
            updateUI();
            localStorage.setItem('language', 'id');
        }
    });
    
    // Check for saved language preference
    if (localStorage.getItem('language') === 'id') {
        currentLanguage = 'id';
        langIdBtn.classList.add('active');
        langEnBtn.classList.remove('active');
        updateUI();
    }
    
    // Generate image
    generateBtn.addEventListener('click', generateImage);
    
    function generateImage() {
        const prompt = promptInput.value.trim();
        if (!prompt) {
            alert(translations[currentLanguage].errorMessage);
            return;
        }
        
        // Show loading indicator
        loadingIndicator.style.display = 'flex';
        imageContainer.innerHTML = `<p>${translations[currentLanguage].imagePlaceholder}</p>`;
        outputControls.style.display = 'none';
        
        // Get all parameters
        const width = widthInput.value;
        const height = heightInput.value;
        const seed = seedInput.value;
        const steps = stepsInput.value;
        const model = modelSelect.value;
        const style = styleSelect.value;
        const quality = hdCheckbox.checked ? 'hd' : 'standard';
        const enhance = enhanceCheckbox.checked;
        const nsfw = nsfwCheckbox.checked;
        const negativePrompt = negativePromptInput.value.trim();
        const lighting = lightingSelect.value;
        const colorPalette = colorPaletteSelect.value;
        const composition = compositionSelect.value;
        
        // Add to prompt history if not already there
        if (!promptHistory.includes(prompt)) {
            promptHistory.unshift(prompt);
            if (promptHistory.length > 10) {
                promptHistory.pop();
            }
            localStorage.setItem('promptHistory', JSON.stringify(promptHistory));
            renderHistory();
        }
        
        // Encode the prompt for URL
        const encodedPrompt = encodeURIComponent(prompt);
        const encodedNegativePrompt = negativePrompt ? encodeURIComponent(negativePrompt) : '';
        
        // Build the API URL with all parameters
        let apiUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}`;
        apiUrl += `?width=${width}&height=${height}&seed=${seed}`;
        apiUrl += `&model=${model}&quality=${quality}&enhance=${enhance}`;
        apiUrl += `&steps=${steps}&style=${style}&safe=${nsfw}`;
        
        if (encodedNegativePrompt) {
            apiUrl += `&negative_prompt=${encodedNegativePrompt}`;
        }
        
        if (lighting !== 'default') {
            apiUrl += `&lighting=${lighting}`;
        }
        
        if (colorPalette !== 'default') {
            apiUrl += `&color_palette=${colorPalette}`;
        }
        
        if (composition !== 'default') {
            apiUrl += `&composition=${composition}`;
        }
        
        apiUrl += '&nologo=true&private=false';
        
        // Create image element
        const img = new Image();
        img.onload = function() {
            // Hide loading indicator
            loadingIndicator.style.display = 'none';
            
            // Clear container and show image
            imageContainer.innerHTML = '';
            imageContainer.appendChild(img);
            outputControls.style.display = 'flex';
            
            // Add to generated images
            const imageData = {
                url: apiUrl,
                prompt: prompt,
                timestamp: new Date().toISOString()
            };
            
            generatedImages.unshift(imageData);
            if (generatedImages.length > 20) {
                generatedImages.pop();
            }
            localStorage.setItem('generatedImages', JSON.stringify(generatedImages));
            renderImageGrid();
        };
        
        img.onerror = function() {
            loadingIndicator.style.display = 'none';
            imageContainer.innerHTML = `<p>${translations[currentLanguage].errorMessage}</p>`;
        };
        
        img.src = apiUrl;
    }
    
    // Download image
    downloadBtn.addEventListener('click', function() {
        const img = imageContainer.querySelector('img');
        if (img) {
            const link = document.createElement('a');
            link.href = img.src;
            link.download = `devaka-ai-${Date.now()}.jpg`;
            link.click();
        }
    });
    
    // Save image to local storage
    saveBtn.addEventListener('click', function() {
        const img = imageContainer.querySelector('img');
        if (img) {
            const imageData = {
                url: img.src,
                prompt: promptInput.value.trim(),
                timestamp: new Date().toISOString()
            };
            
            generatedImages.unshift(imageData);
            if (generatedImages.length > 20) {
                generatedImages.pop();
            }
            localStorage.setItem('generatedImages', JSON.stringify(generatedImages));
            renderImageGrid();
        }
    });
    
  // Replace the existing clearHistoryBtn event listener with this improved version
clearHistoryBtn.addEventListener('click', function() {
    const lang = translations[currentLanguage];
    const confirmClear = confirm(lang.clearHistoryConfirm || "Are you sure you want to clear all history and generated images?");
    
    if (confirmClear) {
        // Clear prompt history
        promptHistory = [];
        localStorage.setItem('promptHistory', JSON.stringify(promptHistory));
        
        // Clear generated images
        generatedImages = [];
        localStorage.setItem('generatedImages', JSON.stringify(generatedImages));
        
        // Update UI
        renderHistory();
        renderImageGrid();
        
        // Clear the current image display if needed
        imageContainer.innerHTML = `<p>${translations[currentLanguage].imagePlaceholder}</p>`;
        outputControls.style.display = 'none';
    }
});

// Also add this new translation key to both language objects in the translations object:
translations.en.clearHistoryConfirm = "Are you sure you want to clear all history and generated images?";
translations.id.clearHistoryConfirm = "Apakah Anda yakin ingin menghapus semua riwayat dan gambar yang dihasilkan?";
    
    // Render prompt history
    function renderHistory() {
        historyList.innerHTML = '';
        promptHistory.forEach(prompt => {
            const li = document.createElement('li');
            li.textContent = prompt.length > 50 ? prompt.substring(0, 50) + '...' : prompt;
            li.title = prompt;
            li.addEventListener('click', () => {
                promptInput.value = prompt;
            });
            historyList.appendChild(li);
        });
    }
    
    // Render image grid
    function renderImageGrid() {
        imageGrid.innerHTML = '';
        generatedImages.forEach((image, index) => {
            const gridItem = document.createElement('div');
            gridItem.className = 'grid-item';
            
            const img = document.createElement('img');
            img.src = image.url;
            img.alt = image.prompt;
            
            const gridActions = document.createElement('div');
            gridActions.className = 'grid-actions';
            
            const viewBtn = document.createElement('button');
            viewBtn.className = 'small-btn';
            viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
            viewBtn.addEventListener('click', () => {
                imageContainer.innerHTML = '';
                imageContainer.appendChild(img.cloneNode());
                outputControls.style.display = 'flex';
            });
            
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'small-btn';
            downloadBtn.innerHTML = '<i class="fas fa-download"></i>';
            downloadBtn.addEventListener('click', () => {
                const link = document.createElement('a');
                link.href = image.url;
                link.download = `devaka-ai-${index}.png`;
                link.click();
            });
            
            gridActions.appendChild(viewBtn);
            gridActions.appendChild(downloadBtn);
            
            gridItem.appendChild(img);
            gridItem.appendChild(gridActions);
            imageGrid.appendChild(gridItem);
        });
    }
    
    // Social share buttons
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const img = imageContainer.querySelector('img');
            if (!img) return;
            
            const platform = this.classList.contains('facebook') ? 'facebook' :
                            this.classList.contains('twitter') ? 'twitter' :
                            this.classList.contains('whatsapp') ? 'whatsapp' : 'tiktok';
            
            const prompt = promptInput.value.trim();
            const text = prompt ? `${prompt} - Generated by DEVAKA AI` : 'Check out this AI generated image from DEVAKA AI';
            const url = encodeURIComponent(img.src);
            
            let shareUrl = '';
            
            switch (platform) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
                    break;
                case 'tiktok':
                    // TikTok doesn't have a direct share API, so we'll just open their site
                    shareUrl = 'https://www.tiktok.com/';
                    break;
            }
            
            window.open(shareUrl, '_blank', 'width=600,height=400');
        });
    });
    
    // Initialize the app
    init();
});