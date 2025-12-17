class SnowRenderer {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'snow-canvas';
        this.canvas.style.display = 'none';
        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.lastFrameTime = 0;
        this.running = false;
        this.targetOpacity = 0;
        this.currentOpacity = 0;
        this.active = false;

        this.resizeObserver = new ResizeObserver(() => {
            this.handleResize();
        });
        this.resizeObserver.observe(document.body);

        // Initialize particles
        for (let i = 0; i < 2000; i++) {
            this.particles.push({
                x: Math.random(),
                y: Math.random(),
                vx: Math.random() - 0.5,
                vy: (1 + Math.random() * 10) / 10,
                freqx: 1 + Math.random() * 5,
                freqy: 1 + Math.random() * 5,
                size: 0.1 + Math.random() * 1.4,
                phasex: Math.random() * 2 * Math.PI,
                phasey: Math.random() * 2 * Math.PI
            });
        }
        this.applyWinterRestrictions();
    }

    isWinter() {
        const month = new Date().getMonth();
        return month === 11 || month <= 1;
    }

    applyWinterRestrictions() {
        if (!this.isWinter()) {
            const style = document.createElement('style');
            style.id = 'snow-winter-restrictions';
            style.innerHTML = `
                #btn-snow, 
                #btn-snow-toolbar, 
                a[title="Let it snow"],
                button[title="Let it snow"] { 
                    display: none !important; 
                }
            `;
            document.head.appendChild(style);
        }
    }

    handleResize() {
        this.canvas.width = window.innerWidth * window.devicePixelRatio;
        this.canvas.height = window.innerHeight * window.devicePixelRatio;
        if (this.active || this.currentOpacity > 0.000001) {
            this.render();
        }
    }

    toggle() {
        if (!this.isWinter()) return false;

        this.active = !this.active;
        if (this.active) {
            this.targetOpacity = 1;
            this.canvas.style.display = 'block';
            if (!this.running) {
                this.start();
            }
        } else {
            this.targetOpacity = 0;
            // let opacity fade out
        }
        return this.active;
    }

    start() {
        this.running = true;
        this.animate();
    }

    isDarkMode() {
        const appElement = document.getElementById('vue-app');
        if (appElement) {
            const isDark = appElement.classList.contains('theme-dark') ||
                appElement.classList.contains('theme-shaddox') ||
                appElement.classList.contains('theme-dream') ||
                appElement.classList.contains('theme-lohere');
            // theme-butter is light
            // theme-default is light
            return isDark;
        }
        return false;
    }

    animate() {
        requestAnimationFrame(() => {
            this.render();
            if (this.active || Math.abs(this.currentOpacity) > 0.000001) {
                this.animate();
            } else {
                this.running = false;
                this.canvas.style.display = 'none';
                this.currentOpacity = 0;
            }
        });
    }


    render() {
        // Opacity transition
        this.currentOpacity += (this.targetOpacity - this.currentOpacity) * 0.05;

        this.ctx.globalAlpha = this.currentOpacity;

        const width = this.canvas.width;
        const height = this.canvas.height;
        const now = performance.now();
        const delta = (now - this.lastFrameTime) / 16;

        this.ctx.clearRect(0, 0, width, height);

        if (this.isDarkMode()) {
            this.ctx.fillStyle = "white";
        } else {
            // Light themes get lightblue snow
            this.ctx.fillStyle = "lightblue";
        }

        for (const p of this.particles) {
            const x = p.x * width;
            const y = p.y * height;

            const k = 2 * p.vx / p.size / width;
            const l = 2 * p.vy / p.size / height;

            this.ctx.beginPath();

            const oscillationX = (width / 200) * Math.sin(p.freqx * now * l + p.phasex);
            const oscillationY = (height / 200) * Math.sin(p.freqy * now * k + p.phasey);

            this.ctx.arc(
                x + oscillationX,
                y + oscillationY,
                p.size * window.devicePixelRatio,
                0,
                2 * Math.PI
            );
            this.ctx.fill();

            p.x += k * delta;
            p.y += l * delta;
            p.x %= 1;
            p.y %= 1;
        }

        this.lastFrameTime = now;
    }
}

const snowRenderer = new SnowRenderer();
window.snowRenderer = snowRenderer;