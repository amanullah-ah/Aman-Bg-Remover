        // DOM Elements
        const welcomePage = document.getElementById('welcome-page');
        const mainPage = document.getElementById('main-page');
        const getStartedBtn = document.querySelector('.get-started-btn');
        const uploadSection = document.getElementById('upload-section');
        const uploadTrigger = document.getElementById('upload-trigger');
        const imageInput = document.getElementById('image-input');
        const loading = document.getElementById('loading');
        let scanImage = document.getElementById('scan-image');
        const resultSection = document.getElementById('result-section');
        const originalImage = document.getElementById('original-image');
        const processedImage = document.getElementById('processed-image');
        const downloadBtn = document.getElementById('download-btn');
        const shareBtn = document.getElementById('share-btn');
        const snowfall = document.getElementById('snowfall');
        
        // API Configuration
        const API_URL = "https://api.remove.bg/v1.0/removebg";
        const API_KEY = "baCvu9pz3VUevPNfhfVyRuaq";
        
        // Global Variables
        let currentProcessedImage = null;
        
        // Initialize the app
        function init() {
            // Create ambient particle effect
            createSnowfall();
            
            // Event Listeners
            getStartedBtn.addEventListener('click', showMainPage);
            uploadTrigger.addEventListener('click', () => imageInput.click());
            imageInput.addEventListener('change', handleImageUpload);
            downloadBtn.addEventListener('click', downloadImage);
            shareBtn.addEventListener('click', shareImage);
            
            // Drag and drop for image upload
            uploadSection.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadSection.classList.add('drag-over');
            });
            
            uploadSection.addEventListener('dragleave', () => {
                uploadSection.classList.remove('drag-over');
            });
            
            uploadSection.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadSection.classList.remove('drag-over');
                
                if (e.dataTransfer.files.length) {
                    imageInput.files = e.dataTransfer.files;
                    handleImageUpload();
                }
            });
            
        }
        
        // Create ambient particles
        function createSnowfall() {
            const snowflakeCount = 40; // reduced for cleaner look
            
            for (let i = 0; i < snowflakeCount; i++) {
                const snowflake = document.createElement('div');
                snowflake.classList.add('snowflake');
                
                // Random size between 2px and 5px
                const size = Math.random() * 3 + 2;
                snowflake.style.width = `${size}px`;
                snowflake.style.height = `${size}px`;
                
                // Random position
                snowflake.style.left = `${Math.random() * 100}vw`;
                
                // Random opacity
                snowflake.style.opacity = Math.random() * 0.5 + 0.2;
                
                // Random animation duration and delay
                const duration = Math.random() * 15 + 15;
                const delay = Math.random() * 5;
                snowflake.style.animation = `fall ${duration}s linear ${delay}s infinite`;
                
                snowfall.appendChild(snowflake);
            }
        }
        
        // Show main page and hide welcome page
        function showMainPage() {
            welcomePage.style.display = 'none';
            mainPage.style.display = 'block';
            
            // Add entrance animation
            mainPage.style.animation = 'fadeIn 0.5s ease';
        }
        
        // Handle image upload
        function handleImageUpload() {
            const file = imageInput.files[0];
            if (!file) return;
            
            // Validate file type and size
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                alert('Please upload a valid image file (JPG, PNG, or WEBP).');
                return;
            }
            
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size should be less than 5MB.');
                return;
            }
            
            // Show original image
            const reader = new FileReader();
            reader.onload = function(e) {
                originalImage.src = e.target.result;
                scanImage.src = e.target.result;
                
                // Show loading and hide upload section
                uploadSection.style.display = 'none';
                loading.style.display = 'block';
                resultSection.style.display = 'none';
                
                // Process image with API
                processImageWithAPI(file);
            };
            reader.readAsDataURL(file);
        }
        
        // Process image with Remove.bg API
        async function processImageWithAPI(file) {
            const formData = new FormData();
            formData.append('image_file', file);
            formData.append('size', 'auto');
            
            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'X-Api-Key': API_KEY
                    },
                    body: formData
                });
                
                if (!response.ok) {
                    throw new Error(`API Error: ${response.status}`);
                }
                
                const blob = await response.blob();
                const imageUrl = URL.createObjectURL(blob);
                
                // Set processed image
                processedImage.src = imageUrl;
                currentProcessedImage = imageUrl;
                
                // Show result section
                loading.style.display = 'none';
                resultSection.style.display = 'block';
                
            } catch (error) {
                console.error('Error processing image:', error);
                loading.innerHTML = `
                    <div style="color: #f43f5e; font-size: 1.1rem; padding: 20px;">
                        <i class="fas fa-exclamation-circle" style="font-size: 2.5rem; margin-bottom: 15px;"></i>
                        <p>Error processing image. Please try again.</p>
                        <p style="font-size: 0.9rem; margin-top: 8px; color: #d9cfb8;">${error.message}</p>
                    </div>
                `;
                
                // Show upload section again after 3 seconds
                setTimeout(() => {
                    loading.innerHTML = `
                        <div class="scan-container">
                            <img id="scan-image" class="scan-image" src="" alt="Scanning">
                            <div class="scan-overlay"></div>
                            <div class="scan-line"></div>
                        </div>
                        <div class="loading-text">Processing your image perfectly...</div>
                    `;
                    loading.style.display = 'none';
                    uploadSection.style.display = 'block';
                    scanImage = document.getElementById('scan-image');
                }, 3500);
            }
        }
        
        // Download processed image
        function downloadImage() {
            if (!currentProcessedImage) return;
            
            const link = document.createElement('a');
            link.href = currentProcessedImage;
            link.download = `ftgm-removed-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        
        // Share image
        function shareImage() {
            if (!currentProcessedImage) return;
            
            if (navigator.share) {
                // Use Web Share API if available
                navigator.share({
                    title: 'AMAN ULLAH Tools - Background Removed',
                    text: 'Check out this image with background removed using AMAN ULLAH Tools!',
                    url: currentProcessedImage
                });
            } else {
                // Fallback: Copy to clipboard
                const dummy = document.createElement('textarea');
                document.body.appendChild(dummy);
                dummy.value = `Check out my image with background removed using AMAN ULLAH Tools: ${currentProcessedImage}`;
                dummy.select();
                document.execCommand('copy');
                document.body.removeChild(dummy);
                
                alert('Link copied to clipboard!');
            }
        }
        
        // Initialize the app when DOM is loaded
        document.addEventListener('DOMContentLoaded', init);
