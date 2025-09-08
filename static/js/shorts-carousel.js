// Carrusel 3D para miniaturas tipo shorts
export function initShortsCarousel({ containerId, items }) {
    const wheel = document.getElementById(containerId);
    wheel.style.overflow = 'hidden';
        wheel.style.userSelect = 'none';
        wheel.style.webkitUserSelect = 'none';
    const radius = 480;
    const imgW = 220;
    const imgH = 390;
    let angle = 0;
    let autoRotate = true;
    // Pointer events para drag universal (touch + mouse)
    let dragging = false;
    let startX = 0;
    let lastAngle = 0;
    let velocity = 0;
    let lastMoveTime = 0;
    let dragMoved = false;
    // Pointer events solo para touch (móvil)
    wheel.addEventListener('pointerdown', (e) => {
        if (e.pointerType !== 'touch') return;
        dragging = true;
        autoRotate = false;
        startX = e.clientX;
        lastAngle = angle;
        velocity = 0;
        lastMoveTime = Date.now();
        dragMoved = false;
        wheel.setPointerCapture(e.pointerId);
    });
    wheel.addEventListener('pointermove', (e) => {
        if (!dragging || e.pointerType !== 'touch') return;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 3) dragMoved = true;
        const now = Date.now();
        velocity = (dx * 0.25 - (angle - lastAngle)) / (now - lastMoveTime) * 16;
        lastMoveTime = now;
        angle = lastAngle + dx * 0.25;
        renderWheel();
    });
    wheel.addEventListener('pointerup', (e) => {
        if (!dragging || e.pointerType !== 'touch') return;
        dragging = false;
        angle = ((angle % 360) + 360) % 360;
        renderWheel();
        // Si no hubo drag, simular click en miniatura
        if (!dragMoved && e.target.tagName === 'IMG' && e.target.parentElement.href) {
            window.open(e.target.parentElement.href, '_blank');
        }
        // Inercia
        let inertia = velocity;
        function animate() {
            if (dragging) return;
            if (Math.abs(inertia) > 0.1) {
                angle += inertia;
                inertia *= 0.92; // Valor smooth anterior
                renderWheel();
                requestAnimationFrame(animate);
            } else {
                autoRotate = true;
            }
        }
        animate();
    });
    wheel.addEventListener('pointercancel', (e) => {
        if (e.pointerType !== 'touch') return;
        dragging = false;
        dragMoved = false;
        renderWheel();
    });

    function renderWheel() {
        wheel.innerHTML = '';
        const n = items.length;
        for (let i = 0; i < n; i++) {
            const theta = ((360 / n) * i + angle) * Math.PI / 180;
            const x = Math.sin(theta) * radius + 550 - imgW/2;
            const z = Math.cos(theta) * radius;
            const scale = 0.5 + 0.7 * (z / radius);
            const opacity = 0.3 + 0.7 * (z / radius);
            const el = document.createElement('a');
            el.href = items[i].videoId ? `https://youtube.com/shorts/${items[i].videoId}` : '#';
            // Usar la miniatura de máxima resolución disponible en YouTube
            const thumbUrl = items[i].videoId
                ? `https://i.ytimg.com/vi/${items[i].videoId}/maxresdefault.jpg`
                : items[i].thumb;
            el.target = '_blank';
            el.style.position = 'absolute';
            el.style.left = `${x}px`;
            el.style.top = `${40 + (1-scale)*60}px`;
            el.style.transform = `scale(${scale})`;
            el.style.zIndex = Math.round(100 + z);
            el.style.opacity = opacity;
                el.innerHTML = `<img src="${thumbUrl}" style="width:${imgW}px; height:${imgH}px; object-fit:cover; border-radius:12px; box-shadow:0 2px 16px #0004; user-select:none; -webkit-user-select:none; transition:transform 0.6s cubic-bezier(.4,2,.3,1), left 0.6s cubic-bezier(.4,2,.3,1), top 0.6s cubic-bezier(.4,2,.3,1), opacity 0.6s cubic-bezier(.4,2,.3,1);" draggable="false" ondragstart="return false;"/>`;
            wheel.appendChild(el);
        }
    }

    wheel.addEventListener('mousedown', (e) => {
        dragging = true;
        autoRotate = false;
        startX = e.pageX;
        lastAngle = angle;
        velocity = 0;
        lastMoveTime = Date.now();
        dragMoved = false;
    });
    document.addEventListener('mousemove', (e) => {
        if (!dragging) return;
        const dx = e.pageX - startX;
        if (Math.abs(dx) > 3) dragMoved = true;
        const now = Date.now();
        velocity = (dx * 0.25 - (angle - lastAngle)) / (now - lastMoveTime) * 16;
        lastMoveTime = now;
        angle = lastAngle + dx * 0.25;
        renderWheel();
    });
    document.addEventListener('mouseup', (e) => {
        if (!dragging) return;
        dragging = false;
        angle = ((angle % 360) + 360) % 360;
        renderWheel();
        // Si no hubo drag, simular click en miniatura
        if (!dragMoved && e.target.tagName === 'IMG' && e.target.parentElement.href) {
            window.open(e.target.parentElement.href, '_blank');
        }
        // Inercia
        let inertia = velocity;
        const isMobile = /Android|iPhone|iPad|iPod|Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        function animate() {
            if (dragging) return;
            if (Math.abs(inertia) > 0.1) {
                angle += inertia;
                inertia *= 0.92; // Valor original smooth
                renderWheel();
                requestAnimationFrame(animate);
            } else {
                autoRotate = true;
            }
        }
        animate();
    });
    wheel.addEventListener('mouseenter', () => { autoRotate = false; });
    wheel.addEventListener('mouseleave', () => { if (!dragging) autoRotate = true; });

    function autoRotateLoop() {
        if (autoRotate && !dragging) {
            angle += 0.08;
            renderWheel();
        }
        requestAnimationFrame(autoRotateLoop);
    }

    renderWheel();
    autoRotateLoop();
}
