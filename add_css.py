css_additions = """
/* FLOATING CTA */
.floating-cta {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: var(--primary);
  color: white;
  padding: 16px 24px;
  border-radius: 50px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 10px 25px rgba(124, 58, 237, 0.4);
  z-index: 90;
  text-decoration: none;
  opacity: 0;
  transform: translateY(20px) scale(0.9);
  pointer-events: none;
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.floating-cta.visible {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: auto;
}
.floating-cta:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 15px 30px rgba(124, 58, 237, 0.6);
}

/* FORM MODAL (ALADDIN) */
.form-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 200;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s ease;
  padding: 20px;
  overflow-y: auto;
}
.form-modal-overlay.open {
  opacity: 1;
  pointer-events: auto;
}

.form-modal-container {
  background: var(--bg);
  border: 1px solid var(--border-light);
  border-radius: 24px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 40px;
  position: relative;
  /* Aladdin scale effect */
  transform: scale(0.8) translateY(100px);
  opacity: 0;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  margin: auto;
}
.form-modal-container::-webkit-scrollbar {
  width: 6px;
}
.form-modal-container::-webkit-scrollbar-thumb {
  background: var(--border-light);
  border-radius: 10px;
}
.form-modal-overlay.open .form-modal-container {
  transform: scale(1) translateY(0);
  opacity: 1;
}

.close-modal-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s;
}
.close-modal-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.form-header h2 {
  font-size: 28px;
  margin-bottom: 12px;
}
.form-header p {
  color: var(--text-muted);
  font-size: 14px;
  margin-bottom: 30px;
}

.custom-form .form-group {
  margin-bottom: 24px;
}
.custom-form label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #fff;
}
.custom-form input[type="text"],
.custom-form input[type="email"],
.custom-form input[type="tel"],
.custom-form textarea {
  width: 100%;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 14px 16px;
  color: white;
  font-family: inherit;
  font-size: 14px;
  transition: border-color 0.3s;
}
.custom-form input:focus, .custom-form textarea:focus {
  outline: none;
  border-color: var(--primary);
  background: rgba(124, 58, 237, 0.05);
}
.custom-form textarea {
  min-height: 80px;
  resize: vertical;
}

/* Custom Radios */
.radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.custom-radio {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500 !important;
}
.custom-radio input {
  display: none;
}
.radio-mark {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--border-light);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
}
.radio-mark::after {
  content: '';
  width: 10px;
  height: 10px;
  background: var(--primary);
  border-radius: 50%;
  transform: scale(0);
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.custom-radio input:checked + .radio-mark {
  border-color: var(--primary);
}
.custom-radio input:checked + .radio-mark::after {
  transform: scale(1);
}

.redirect-notice {
  font-size: 12px;
  color: var(--text-muted);
  text-align: center;
  margin-top: 10px;
}

@media (max-width: 768px) {
  .floating-cta {
    bottom: 16px;
    right: 16px;
    padding: 12px 20px;
    font-size: 14px;
  }
  .form-modal-container {
    padding: 24px;
  }
}
"""

with open('src/style.css', 'a', encoding='utf-8') as f:
    f.write(css_additions)
