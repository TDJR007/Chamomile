// star-background.js

function initializeStarBackground() {
    const starBackground = document.getElementById('star-background');
    if (!starBackground) return;

    generateStars(starBackground);
    generateMeteors(starBackground);

    // Regenerate stars on window resize
    window.addEventListener('resize', () => {
        // Clear existing stars
        while (starBackground.firstChild) {
            starBackground.removeChild(starBackground.firstChild);
        }
        generateStars(starBackground);
        generateMeteors(starBackground);
    });
}

function generateStars(container) {
    const numberOfStars = Math.floor((window.innerWidth * window.innerHeight) / 10000);

    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'star animate-pulse-subtle';
        
        const size = Math.random() * 3 + 1;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const opacity = Math.random() * 0.5 + 0.5;
        const animationDuration = Math.random() * 4 + 2;

        star.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${x}%;
            top: ${y}%;
            opacity: ${opacity};
            animation-duration: ${animationDuration}s;
        `;

        container.appendChild(star);
    }
}

function generateMeteors(container) {
    const numberOfMeteors = 4;

    for (let i = 0; i < numberOfMeteors; i++) {
        const meteor = document.createElement('div');
        meteor.className = 'meteor';
        
        const size = Math.random() * 2 + 1;
        const x = Math.random() * 100;
        const y = Math.random() * 20;
        const delay = Math.random() * 15;
        const animationDuration = Math.random() * 3 + 3;

        meteor.style.cssText = `
            width: ${size * 50}px;
            height: ${size * 2}px;
            left: ${x}%;
            top: ${y}%;
            opacity: 0; /* Start hidden */
        `;

        container.appendChild(meteor);

        // Start animation after delay
        setTimeout(() => {
            meteor.style.cssText = `
                width: ${size * 50}px;
                height: ${size * 2}px;
                left: ${x}%;
                top: ${y}%;
                animation: meteor ${animationDuration}s linear infinite;
                opacity: 1;
            `;
        }, delay * 1000);
    }
}