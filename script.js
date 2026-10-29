
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initAsciiWaves();
  initRevealAnimations();
});

function initNavigation() {
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("navLinks");

  if (!toggle || !nav) return;

  toggle.setAttribute("aria-expanded", "false");

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
    });
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

function initAsciiWaves() {
  const canvas = document.getElementById("ascii-waves");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const chars = " .,:;-=+*#";
  const cellWidth = 13;
  const cellHeight = 17;

  let width = 0;
  let height = 0;
  let ratio = 1;
  let frame = null;
  let lastFrame = 0;
  let time = 0;

  const pointer = {
    x: -1000, y: -1000,
    targetX: -1000, targetY: -1000,
    active: false
  };

  function resize() {
    ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.font = '11px "DM Mono", monospace';
    ctx.textBaseline = "middle";
  }

  function draw(timestamp) {
    if (reducedMotion.matches) {
      stop();
      ctx.clearRect(0, 0, width, height);
      return;
    }

    if (timestamp - lastFrame < 33) {
      frame = requestAnimationFrame(draw);
      return;
    }

    lastFrame = timestamp;
    time += 0.014;

    pointer.x += (pointer.targetX - pointer.x) * 0.055;
    pointer.y += (pointer.targetY - pointer.y) * 0.055;

    ctx.clearRect(0, 0, width, height);

    const radius = Math.min(width * 0.25, 230);

    for (let y = 10; y < height; y += cellHeight) {
      for (let x = 6; x < width; x += cellWidth) {
        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const distance = Math.hypot(dx, dy);

        const wave1 = Math.sin(x * 0.010 + time);
        const wave2 = Math.cos(y * 0.014 - time * 0.8);
        const wave3 = Math.sin((x + y) * 0.004 + time * 0.7);
        const wave = (wave1 + wave2 + wave3) / 3;

        const influence = pointer.active
          ? Math.max(0, 1 - distance / radius)
          : 0;

        const offsetX = Math.sin(wave + time) * 2 - dx * influence * 0.035;
        const offsetY = wave * 7 - dy * influence * 0.035;

        const index = Math.min(
          chars.length - 1,
          Math.max(0, Math.floor((wave + 1) * 0.5 * chars.length))
        );

        const opacity = 0.05 + Math.abs(wave) * 0.07 + influence * 0.22;

        ctx.fillStyle = `rgba(255, 51, 79, ${Math.min(opacity, 0.38)})`;
        ctx.fillText(chars[index], x + offsetX, y + offsetY);
      }
    }

    frame = requestAnimationFrame(draw);
  }

  function start() {
    if (reducedMotion.matches || frame !== null) return;
    lastFrame = 0;
    frame = requestAnimationFrame(draw);
  }

  function stop() {
    if (frame !== null) {
      cancelAnimationFrame(frame);
      frame = null;
    }
  }

  window.addEventListener("resize", resize, { passive: true });

  window.addEventListener("pointermove", event => {
    if (event.pointerType === "touch") return;
    pointer.targetX = event.clientX;
    pointer.targetY = event.clientY;
    pointer.active = true;
  }, { passive: true });

  document.documentElement.addEventListener("mouseleave", () => {
    pointer.targetX = -1000;
    pointer.targetY = -1000;
    pointer.active = false;
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else start();
  });

  reducedMotion.addEventListener("change", () => {
    stop();
    if (reducedMotion.matches) {
      ctx.clearRect(0, 0, width, height);
    } else {
      start();
    }
  });

  resize();
  start();
}

function initRevealAnimations() {
  const sections = document.querySelectorAll("main > .section");

  if (
    !sections.length ||
    !("IntersectionObserver" in window) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.08,
    rootMargin: "0px 0px -35px 0px"
  });

  sections.forEach(section => {
    section.classList.add("reveal-section");
    observer.observe(section);
  });
}