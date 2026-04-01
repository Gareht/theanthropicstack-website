/**
 * Scroll-based reveal animations using IntersectionObserver.
 * Elements with .reveal fade+slide up when entering viewport.
 * Elements with .reveal-child are staggered at 120ms intervals
 * when their parent section's .reveal enters viewport.
 */

function initReveal(): void {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        entry.target.classList.add("visible");

        // Stagger child reveals within the same section
        if (entry.target.classList.contains("reveal")) {
          const section = entry.target.closest("section");
          if (section) {
            const children = section.querySelectorAll<HTMLElement>(".reveal-child");
            children.forEach((child, i) => {
              setTimeout(() => child.classList.add("visible"), i * 120);
            });
          }
        }

        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".reveal, .reveal-child").forEach((el) => {
    observer.observe(el);
  });
}

// Initialise
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initReveal);
} else {
  initReveal();
}
