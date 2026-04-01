/**
 * Substack subscribe form handler.
 * Opens Substack's subscribe page with the email pre-filled.
 * No PHP proxy needed — works on any static host.
 */

const SUBSTACK_URL = "https://theanthropicstack.substack.com";

function initForms(): void {
  document.querySelectorAll<HTMLFormElement>(".subscribe-form").forEach((form) => {
    form.addEventListener("submit", (e: SubmitEvent) => {
      e.preventDefault();

      const input = form.querySelector<HTMLInputElement>('input[type="email"]');
      const button = form.querySelector<HTMLButtonElement>("button");
      const btnText = button?.querySelector<HTMLElement>(".btn-text");

      if (!input || !button || !btnText) return;

      const email = input.value.trim();
      if (!email) return;

      // Show success state
      button.classList.add("success");
      input.value = "";

      // Open Substack with email pre-filled
      window.open(
        `${SUBSTACK_URL}/subscribe?email=${encodeURIComponent(email)}`,
        "_blank"
      );

      // Reset after 4 seconds
      setTimeout(() => {
        button.classList.remove("success");
        btnText.textContent = "Subscribe Now";
        button.disabled = false;
      }, 4000);
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initForms);
} else {
  initForms();
}
