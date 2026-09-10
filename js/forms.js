(function () {
  const WHATSAPP_NUMBER = "233240736896";

  window.purePowerWhatsApp = function (service) {
    const text = service
      ? `Hello Pure Power, I'd like to enquire about ${service}.`
      : "Hello Pure Power, I'd like to enquire about electrical services.";
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  document.querySelectorAll("[data-whatsapp]").forEach((el) => {
    const service = el.getAttribute("data-whatsapp");
    el.setAttribute("href", window.purePowerWhatsApp(service || ""));
  });

  const form = document.getElementById("quote-form");
  if (!form) return;

  const success = document.getElementById("form-success");
  const serviceSelect = form.querySelector("#service");

  serviceSelect?.addEventListener("change", () => {
    const wa = document.getElementById("form-whatsapp");
    if (wa)
      wa.setAttribute("href", window.purePowerWhatsApp(serviceSelect.value));
  });

  const showError = (field, message) => {
    const holder = form.querySelector(`[data-error-for="${field}"]`);
    if (holder) holder.textContent = message;
  };

  const clearErrors = () => {
    form.querySelectorAll("[data-error-for]").forEach((el) => {
      el.textContent = "";
    });
  };

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isValidPhone = (value) => /^[0-9+\s()-]{8,20}$/.test(value);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearErrors();

    const honeypot = form.querySelector("[name='website']");
    if (honeypot && honeypot.value) return;

    const data = Object.fromEntries(new FormData(form).entries());
    let valid = true;

    if (!data.name || data.name.trim().length < 2) {
      showError("name", "Please enter your full name.");
      valid = false;
    }
    if (!isValidPhone(data.phone || "")) {
      showError("phone", "Enter a valid phone number.");
      valid = false;
    }
    if (!isValidEmail(data.email || "")) {
      showError("email", "Enter a valid email address.");
      valid = false;
    }
    if (!data.service) {
      showError("service", "Select the service you need.");
      valid = false;
    }
    if (!data.message || data.message.trim().length < 12) {
      showError(
        "message",
        "Please describe the project in a little more detail.",
      );
      valid = false;
    }
    if ((data.name || "").length > 120 || (data.message || "").length > 2000) {
      showError("message", "Please shorten your message.");
      valid = false;
    }
    const captcha = form.querySelector(".g-recaptcha");
    const captchaReady = window.grecaptcha && captcha;
    if (!captchaReady || !window.grecaptcha.getResponse()) {
      showError(
        "captcha",
        captcha?.dataset.sitekey === "REPLACE_WITH_RECAPTCHA_SITE_KEY"
          ? "Add the Google reCAPTCHA site key before publishing this form."
          : "Please complete the reCAPTCHA check.",
      );
      valid = false;
    }

    if (!valid) return;

    const submitBtn = form.querySelector("[type='submit']");
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    try {
      const payload = new FormData(form);
      payload.append("_subject", "Pure Power quote request");
      const response = await fetch(form.action, {
        method: "POST",
        body: payload,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("Request failed");
      form.classList.add("is-hidden");
      success?.classList.add("is-visible");
    } catch (err) {
      showError(
        "message",
        "We could not send the form just now. Please call or WhatsApp us instead.",
      );
      submitBtn.disabled = false;
      submitBtn.textContent = "Request a Quote";
    }
  });
})();
