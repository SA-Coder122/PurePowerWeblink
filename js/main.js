(function () {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();

(function () {
  const mobileCta = document.querySelector(".mobile-cta");
  const hero = document.querySelector(".hero, .page-hero");
  if (!mobileCta || !hero) return;

  const setVisibility = (visible) => {
    mobileCta.classList.toggle("is-visible", visible);
  };

  if (window.matchMedia("(min-width: 861px)").matches) {
    setVisibility(false);
    return;
  }

  const observer = new IntersectionObserver(
    ([entry]) => setVisibility(!entry.isIntersecting),
    { threshold: 0.05 },
  );
  observer.observe(hero);
})();

(function () {
  const metrics = document.querySelectorAll("[data-count]");
  if (!metrics.length) return;

  const animateMetric = (element) => {
    const metric = element.closest("[data-target]");
    const target = Number(metric?.dataset.target);
    if (!Number.isFinite(target) || target <= 0) return;

    const suffix = metric.dataset.suffix || "";
    const duration = 1200;
    const start = performance.now();

    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = `${Math.round(target * eased).toLocaleString()}${suffix}`;
      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateMetric(entry.target);
        currentObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.4 },
  );

  metrics.forEach((metric) => observer.observe(metric));
})();

(function () {
  const targets = document.querySelectorAll(
    ".section, .credential, .review-card, .banner",
  );
  if (!targets.length) return;

  targets.forEach((target) => target.classList.add("reveal-on-scroll"));

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    targets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
  );

  targets.forEach((target) => observer.observe(target));
})();

(function () {
  const track = document.querySelector("[data-testimonial-track]");
  if (!track) return;

  const cards = Array.from(track.children);
  cards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.classList.remove("reveal-on-scroll");
    clone.classList.add("is-visible");
    clone
      .querySelectorAll("a, button, input, select, textarea")
      .forEach((control) => {
        control.setAttribute("tabindex", "-1");
      });
    track.appendChild(clone);
  });

  const pause = () => track.style.setProperty("animation-play-state", "paused");
  const resume = () => track.style.removeProperty("animation-play-state");

  track.addEventListener("mouseenter", pause);
  track.addEventListener("mouseleave", resume);
  track.addEventListener("focusin", pause);
  track.addEventListener("focusout", resume);
})();
