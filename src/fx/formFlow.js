import { launchConfetti } from './confetti.js';

export function initFormFlow() {
  // Evaluar imágenes de testimonios
  document.querySelectorAll('.nrv-testimonial-img').forEach(img => {
    const src = img.getAttribute('src');
    if (!src || src.trim() === '' || src.includes('placeholder')) {
      const proof = img.closest('.nrv-testimonial-proof');
      if (proof) {
        proof.style.display = 'none';
      }
    } else {
      img.addEventListener('error', () => {
        const proof = img.closest('.nrv-testimonial-proof');
        if (proof) {
          proof.style.display = 'none';
        }
      });
    }
  });

  const form = document.getElementById('nrv-contact-form');
  if (!form) return;

  let currentStep = 1;
  const steps = Array.from(form.querySelectorAll('[data-step]'));
  const btnPrev = document.getElementById('conv-btn-prev');
  const btnNext = document.getElementById('conv-btn-next');
  const btnSubmit = document.getElementById('conv-btn-submit');
  const progressBar = form.querySelector('[data-progress]');
  const currentStepSpan = document.getElementById('conv-current-step');
  const percentSpan = document.getElementById('conv-percent');
  const originalBtnHtml = btnSubmit ? btnSubmit.innerHTML : '';

  // Inicialización de Dropdown Custom Premium
  const customDropdown = form.querySelector('.custom-dropdown');
  if (customDropdown) {
    const trigger = customDropdown.querySelector('.custom-dropdown-trigger');
    const options = customDropdown.querySelectorAll('.custom-dropdown-option');
    const hiddenInput = customDropdown.querySelector('input[type="hidden"]');
    const placeholderSpan = customDropdown.querySelector('.custom-dropdown-placeholder');

    // Toggle al hacer click en el trigger
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      customDropdown.classList.toggle('open');
    });

    // Toggle al presionar Espacio o Enter estando enfocado en el trigger
    trigger.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        customDropdown.classList.toggle('open');
      }
    });

    // Cerrar dropdown al hacer click o presionar Enter en cualquier opción
    options.forEach(option => {
      const selectOption = () => {
        const val = option.getAttribute('data-value');
        const emoji = option.querySelector('.option-emoji')?.textContent || '';
        const text = option.querySelector('.option-text')?.textContent || '';

        // Quitar la clase seleccionada de todas las opciones
        options.forEach(opt => opt.classList.remove('selected'));
        // Agregar seleccionada a la actual
        option.classList.add('selected');

        // Actualizar el valor del input oculto
        hiddenInput.value = val;

        // Actualizar el trigger placeholder
        placeholderSpan.textContent = text;
        placeholderSpan.classList.add('has-value');

        // Limpiar el estado de error
        const wrap = customDropdown.closest('.conv-input-wrap');
        if (wrap) {
          wrap.classList.remove('nrv-field-error');
        }
        const errorMsg = form.querySelector('#objetivo-error');
        if (errorMsg) {
          errorMsg.style.display = 'none';
        }

        // Cerrar dropdown
        customDropdown.classList.remove('open');
        // Devolver el foco al trigger
        trigger.focus();
      };

      option.addEventListener('click', (e) => {
        e.stopPropagation();
        selectOption();
      });

      option.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          selectOption();
        }
      });
    });

    // Cerrar al hacer click fuera del dropdown
    document.addEventListener('click', (e) => {
      if (!customDropdown.contains(e.target)) {
        customDropdown.classList.remove('open');
      }
    });

    // Cerrar al presionar Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        customDropdown.classList.remove('open');
      }
    });
  }

  // Intercepción en tiempo real del número de teléfono (solo números, espacios, guiones y signos +)
  const phoneInput = form.querySelector('[data-phone-input]');
  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      phoneInput.value = phoneInput.value.replace(/[^0-9\s\-+]/g, '');
    });
  }

  // Lógica de presupuesto y moneda personalizado
  const budgetMontoInput = document.getElementById('presupuesto-monto');
  const budgetHiddenInput = document.getElementById('presupuesto-hidden');
  const currencyBtns = form.querySelectorAll('.currency-btn');

  if (budgetMontoInput && budgetHiddenInput) {
    let currentCurrency = 'USD';

    const updateBudgetValue = () => {
      const val = budgetMontoInput.value.trim();
      if (val) {
        budgetHiddenInput.value = `${val} ${currentCurrency}`;
      } else {
        budgetHiddenInput.value = '';
      }

      // Limpiar error si se ingresó un valor
      if (budgetHiddenInput.value) {
        const wrap = budgetHiddenInput.closest('.conv-input-wrap');
        if (wrap) {
          wrap.classList.remove('nrv-field-error');
        }
      }
    };

    budgetMontoInput.addEventListener('input', () => {
      let cursorPosition = budgetMontoInput.selectionStart;
      const originalLen = budgetMontoInput.value.length;

      // Obtener solo dígitos
      const rawValue = budgetMontoInput.value.replace(/[^0-9]/g, '');

      // Formatear con separador de miles (puntos)
      const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

      budgetMontoInput.value = formattedValue;

      // Ajustar posición del cursor para evitar saltos inesperados
      const newLen = formattedValue.length;
      cursorPosition = cursorPosition + (newLen - originalLen);
      budgetMontoInput.setSelectionRange(cursorPosition, cursorPosition);

      updateBudgetValue();
    });

    currencyBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        currencyBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCurrency = btn.getAttribute('data-currency') || 'USD';
        updateBudgetValue();
      });
    });
  }

  // Interacción de tarjetas de opciones (Rubro, Objetivo, Presupuesto, Plazo)
  const optionCards = form.querySelectorAll('.typeform-option-item');
  optionCards.forEach(card => {
    const input = card.querySelector('input');
    if (!input) return;

    input.addEventListener('change', () => {
      if (input.type === 'radio') {
        const name = input.name;
        // Quitar la clase seleccionada de todas las tarjetas con el mismo name
        form.querySelectorAll(`input[name="${name}"]`).forEach(otherInput => {
          const otherCard = otherInput.closest('.typeform-option-item');
          if (otherCard) {
            otherCard.classList.remove('selected');
          }
        });

        // Agregar la clase seleccionada a esta tarjeta
        card.classList.add('selected');

        // Lógica para Step 2 (Rubro) - opción "Otro"
        if (name === 'rubro') {
          const groupOtroRubro = document.getElementById('group_otro_rubro');
          const inputOtroRubro = form.querySelector('[name="otro_rubro"]');
          if (input.value === 'Otro') {
            if (groupOtroRubro) {
              groupOtroRubro.style.display = 'block';
              groupOtroRubro.offsetHeight; // Forzar reflujo
              groupOtroRubro.style.opacity = '1';
              groupOtroRubro.style.transform = 'translateY(0)';
            }
            if (inputOtroRubro) {
              inputOtroRubro.focus();
            }
          } else {
            if (groupOtroRubro) {
              groupOtroRubro.style.opacity = '0';
              groupOtroRubro.style.transform = 'translateY(-10px)';
              setTimeout(() => {
                const currentChecked = form.querySelector('input[name="rubro"]:checked');
                if (!currentChecked || currentChecked.value !== 'Otro') {
                  groupOtroRubro.style.display = 'none';
                }
              }, 300);
            }
            if (inputOtroRubro) {
              inputOtroRubro.value = '';
            }
          }
        }

        // Auto-avanzar/enviar para Step 3 al seleccionar presupuesto
        if (name === 'presupuesto') {
          setTimeout(() => {
            if (currentStep === 3) {
              if (validateStep(3)) {
                form.requestSubmit();
              }
            }
          }, 350);
        }
      }
    });
  });

  // Botones Aceptar (data-ok-btn)
  form.querySelectorAll('[data-ok-btn]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep < 3) {
        if (validateStep(currentStep)) {
          goToStep(currentStep + 1);
        }
      } else {
        if (validateStep(3)) {
          form.requestSubmit();
        }
      }
    });
  });

  // Hotkeys de teclado (A, B, C, D, E, F, G) para seleccionar opciones
  document.addEventListener('keydown', (e) => {
    // Si el usuario está escribiendo en un input o select, o si el dropdown custom está abierto, no interceptar
    const openDropdown = form.querySelector('.custom-dropdown.open');
    if (e.target.matches('input[type="text"], input[type="email"], input[type="tel"], textarea, select') || openDropdown) {
      return;
    }

    const key = e.key.toUpperCase();
    if (key >= 'A' && key <= 'G') {
      const activeStepEl = form.querySelector(`.conv-step[data-step="${currentStep}"]`);
      if (activeStepEl) {
        const option = activeStepEl.querySelector(`.typeform-option-item[data-key="${key}"]`);
        if (option) {
          e.preventDefault();
          const radioInput = option.querySelector('input[type="radio"]');
          if (radioInput) {
            radioInput.checked = true;
            radioInput.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
      }
    }
  });

  // Personalización dinámica de la pregunta de negocio en el Paso 2
  const nameInput = form.querySelector('[name="nombre"]');
  if (nameInput) {
    const updateNegocioQuestion = () => {
      const negocioQuestion = document.getElementById('question-negocio');
      if (negocioQuestion) {
        const nameVal = nameInput.value.trim().split(' ')[0];
        if (nameVal) {
          negocioQuestion.innerHTML = `¡Un gusto, ${nameVal}! ¿A qué se dedica tu negocio? *`;
        } else {
          negocioQuestion.innerHTML = `¡Un gusto! ¿A qué se dedica tu negocio? *`;
        }
      }
    };
    nameInput.addEventListener('change', updateNegocioQuestion);
    nameInput.addEventListener('input', updateNegocioQuestion);
  }

  // Navegación entre pasos
  function goToStep(targetStep) {
    if (targetStep < 1 || targetStep > 3) return;

    const currentStepEl = form.querySelector(`[data-step="${currentStep}"]`);
    const targetStepEl = form.querySelector(`[data-step="${targetStep}"]`);

    if (!currentStepEl || !targetStepEl) return;

    // Animación de salida del paso actual
    currentStepEl.style.opacity = '0';
    currentStepEl.style.transform = 'translateY(-15px)';

    setTimeout(() => {
      currentStepEl.classList.remove('active');
      currentStepEl.style.opacity = '';
      currentStepEl.style.transform = '';

      // Mostrar el nuevo paso comenzando desde invisible
      targetStepEl.style.display = 'block';
      targetStepEl.style.opacity = '0';
      targetStepEl.style.transform = 'translateY(15px)';
      
      // Forzar reflujo
      targetStepEl.offsetHeight;

      targetStepEl.classList.add('active');
      targetStepEl.style.display = '';
      targetStepEl.style.opacity = '';
      targetStepEl.style.transform = '';

      // Foco automático en campos de texto/select
      const firstInput = targetStepEl.querySelector('input[type="text"], input[type="email"], input[type="tel"], select');
      if (firstInput) {
        firstInput.focus();
      }
    }, 250);

    // Actualizar botones y estado
    updateNavigation(targetStep);
    currentStep = targetStep;
    updateProgress(currentStep);
  }

  function updateNavigation(step) {
    if (btnPrev) {
      if (step === 1) {
        btnPrev.classList.add('disabled');
      } else {
        btnPrev.classList.remove('disabled');
      }
    }

    if (btnNext && btnSubmit) {
      if (step === 3) {
        btnNext.style.display = 'none';
        btnSubmit.style.display = 'inline-flex';
      } else {
        btnNext.style.display = 'inline-flex';
        btnSubmit.style.display = 'none';
      }
    }
  }

  function updateProgress(step) {
    const percent = Math.round((step / 3) * 100);
    if (progressBar) {
      progressBar.style.width = `${percent}%`;
    }
    if (currentStepSpan) {
      currentStepSpan.textContent = step;
    }
    if (percentSpan) {
      percentSpan.textContent = `${percent}%`;
    }
  }

  // Validación de paso
  function validateStep(step) {
    const stepEl = form.querySelector(`[data-step="${step}"]`);
    if (!stepEl) return true;

    let isValid = true;

    // Limpiar errores previos en este paso
    stepEl.classList.remove('nrv-field-error');
    stepEl.querySelectorAll('.conv-input-wrap').forEach(wrap => {
      wrap.classList.remove('nrv-field-error');
    });

    // Ocultar mensajes de error específicos de este paso
    stepEl.querySelectorAll('.conv-error-msg').forEach(msg => {
      msg.style.display = 'none';
    });

    // Validar entradas de texto e inputs ocultos de selectores customizados
    const textInputs = stepEl.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="hidden"]');
    textInputs.forEach(input => {
      if (input.name === 'otro_rubro') {
        const rubroChecked = form.querySelector('input[name="rubro"]:checked');
        if (!rubroChecked || rubroChecked.value !== 'Otro') {
          return;
        }
      }

      if (input.hasAttribute('required') || input.name === 'otro_rubro') {
        const val = input.value.trim();
        const wrap = input.closest('.conv-input-wrap');
        
        if (!val) {
          isValid = false;
          if (wrap) wrap.classList.add('nrv-field-error');
        } else if (input.type === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(val)) {
            isValid = false;
            if (wrap) wrap.classList.add('nrv-field-error');
          }
        } else if (input.name === 'telefono') {
          const digits = val.replace(/[^0-9]/g, '');
          if (digits.length < 7) {
            isValid = false;
            if (wrap) wrap.classList.add('nrv-field-error');
          }
        }
      }
    });

    // Validar select (dropdown)
    const selectInputs = stepEl.querySelectorAll('select[required]');
    selectInputs.forEach(select => {
      const val = select.value.trim();
      const wrap = select.closest('.conv-input-wrap');
      if (!val) {
        isValid = false;
        if (wrap) wrap.classList.add('nrv-field-error');
      }
    });

    // Validar entradas de radio (tarjetas de opción) requeridas
    const radioInputs = stepEl.querySelectorAll('input[type="radio"]');
    const requiredRadioNames = new Set();
    radioInputs.forEach(radio => {
      if (radio.hasAttribute('required') || form.querySelector(`input[name="${radio.name}"][required]`)) {
        requiredRadioNames.add(radio.name);
      }
    });

    requiredRadioNames.forEach(name => {
      const checked = stepEl.querySelector(`input[name="${name}"]:checked`);
      if (!checked) {
        isValid = false;
        const errorMsg = stepEl.querySelector(`#${name}-error`);
        if (errorMsg) {
          errorMsg.style.display = 'flex';
        }
        stepEl.classList.add('nrv-field-error');
      }
    });

    if (!isValid) {
      stepEl.classList.add('shake');
      setTimeout(() => {
        stepEl.classList.remove('shake');
      }, 450);

      // Listeners para limpiar el estado de error al escribir
      textInputs.forEach(input => {
        const wrap = input.closest('.conv-input-wrap');
        const clearError = () => {
          if (input.value.trim()) {
            if (wrap) wrap.classList.remove('nrv-field-error');
          }
        };
        input.addEventListener('input', clearError);
      });

      // Listeners para limpiar el estado de error al cambiar select
      selectInputs.forEach(select => {
        const clearSelectError = () => {
          const wrap = select.closest('.conv-input-wrap');
          if (select.value) {
            if (wrap) wrap.classList.remove('nrv-field-error');
          }
        };
        select.addEventListener('change', clearSelectError);
      });

      // Listeners para limpiar el estado de error al seleccionar opción
      radioInputs.forEach(radio => {
        const clearRadioError = () => {
          stepEl.classList.remove('nrv-field-error');
          const errorMsg = stepEl.querySelector(`#${radio.name}-error`);
          if (errorMsg) {
            errorMsg.style.display = 'none';
          }
        };
        radio.addEventListener('change', clearRadioError);
      });
    }

    return isValid;
  }

  // Evento botón Siguiente
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (currentStep < 3) {
        if (validateStep(currentStep)) {
          goToStep(currentStep + 1);
        }
      }
    });
  }

  // Evento botón Atrás
  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentStep > 1) {
        goToStep(currentStep - 1);
      }
    });
  }

  // Tecla Enter global para avanzar (hace click en el botón Aceptar del paso activo)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      // Si el dropdown custom está abierto, no interferir con la selección de la opción
      if (form.querySelector('.custom-dropdown.open')) {
        return;
      }

      // Si el usuario está en un textarea, dejamos que funcione el comportamiento por defecto
      if (e.target.tagName === 'TEXTAREA') {
        return;
      }

      // Si el foco está en el botón Atrás o en un enlace de navegación, no forzar Aceptar
      if (e.target.id === 'conv-btn-prev' || e.target.tagName === 'A') {
        return;
      }

      e.preventDefault();
      const activeStepEl = form.querySelector(`.conv-step[data-step="${currentStep}"]`);
      if (activeStepEl) {
        const okBtn = activeStepEl.querySelector('[data-ok-btn]');
        if (okBtn) {
          okBtn.click();
        } else {
          // Fallback si no hay botón de ok en el paso
          if (currentStep < 3) {
            if (validateStep(currentStep)) {
              goToStep(currentStep + 1);
            }
          } else {
            if (btnSubmit) btnSubmit.click();
          }
        }
      }
    }
  });

  // Envío final del Formulario
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validar último paso
    if (!validateStep(3)) return;

    if (btnSubmit) {
      btnSubmit.disabled = true;
    }

    const loadingCard = document.getElementById('loading-card');
    const successCard = document.getElementById('success-card');

    // 1. Desvanecer formulario de manera suave y fluida
    form.style.transition = 'opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
    form.style.opacity = '0';
    form.style.transform = 'translateY(-15px)';

    // Iniciar fetch a la par de las animaciones
    const startTime = Date.now();

    // Recolectar datos cruzados de todos los pasos
    const nombre = form.querySelector('[name="nombre"]').value;
    const email = form.querySelector('[name="email"]').value;
    const telefono = form.querySelector('[name="telefono"]').value;
    const web = form.querySelector('[name="web"]').value || 'No indicó';
    
    const baseRubro = form.querySelector('[name="rubro"]:checked')?.value || '';
    const otroRubroVal = form.querySelector('[name="otro_rubro"]')?.value || '';
    const rubro = baseRubro === 'Otro' ? `Otro (${otroRubroVal})` : baseRubro;

    const objetivo = form.querySelector('[name="objetivo"]').value || '';
    const presupuesto = form.querySelector('[name="presupuesto"]')?.value || '';

    // Payload de envío para Web3Forms (Gmail)
    const WEB3FORMS_ACCESS_KEY = "7b0bf7ab-7b89-416c-8c57-38c26bfebd58";
    const payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: `🔥 NUEVO LEAD: ${nombre} (${rubro})`,
      from_name: "NRVERTEX",
      replyto: email, // Permite responder al correo directamente al cliente desde Gmail
      "👤 Nombre Completo": nombre,
      "📧 Correo Electrónico": email,
      "📞 Número de WhatsApp": telefono || 'No indicó',
      "🏢 Rubro del Negocio": rubro,
      "🌐 Sitio Web": web,
      "🎯 Objetivo Principal": objetivo,
      "💰 Presupuesto Estimado": presupuesto
    };

    const submitPromise = fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    }).then(res => {
      if (!res.ok) throw new Error(`HTTP Error Status: ${res.status}`);
      return res.json();
    });

    // Esperar a que se complete el fade-out del formulario para mostrar el loader
    setTimeout(() => {
      form.style.display = 'none';
      if (loadingCard) {
        loadingCard.style.display = 'flex';
        loadingCard.style.opacity = '1';
        loadingCard.style.transform = 'translateY(0)';
      }

      // Procesar el resultado de la promesa
      submitPromise
        .then(data => {
          const elapsed = Date.now() - startTime;
          const minDelay = 900; // Loader premium visible pero rápido (900ms)
          const remainingDelay = Math.max(0, minDelay - elapsed);

          setTimeout(() => {
            // 2. Desvanecer loader
            if (loadingCard) {
              loadingCard.style.transition = 'opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
              loadingCard.style.opacity = '0';
              loadingCard.style.transform = 'translateY(-15px)';
            }

            setTimeout(() => {
              if (loadingCard) loadingCard.style.display = 'none';

              // 3. Mostrar Success Card
              if (successCard) {
                successCard.style.display = 'flex';
                successCard.style.opacity = '0';
                successCard.style.transform = 'translateY(15px)';
                successCard.style.transition = 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                
                // Forzar reflujo
                successCard.offsetHeight;
                
                successCard.style.opacity = '1';
                successCard.style.transform = 'translateY(0)';
              }

              // Disparar confeti en el momento exacto en que la tarjeta de éxito aparece
              setTimeout(() => {
                launchConfetti();
              }, 200);

              // Resetear formulario para futuras interacciones
              form.reset();
              if (btnSubmit) {
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = originalBtnHtml;
              }
            }, 250);

          }, remainingDelay);
        })
        .catch(error => {
          console.error("Error submitting form:", error);
          
          // Ocultar loader
          if (loadingCard) {
            loadingCard.style.transition = 'opacity 0.25s ease';
            loadingCard.style.opacity = '0';
          }
          
          setTimeout(() => {
            if (loadingCard) loadingCard.style.display = 'none';
            
            // Mostrar formulario de nuevo y restaurar botón
            form.style.display = 'flex';
            form.offsetHeight; // Forzar reflujo
            form.style.opacity = '1';
            form.style.transform = 'translateY(0)';
            
            if (btnSubmit) {
              btnSubmit.disabled = false;
              btnSubmit.innerHTML = `
                <span class="material-symbols-outlined" style="font-size: 18px; margin-right: 8px;">error</span>
                Error. Reintentar
              `;
              setTimeout(() => {
                btnSubmit.innerHTML = originalBtnHtml;
              }, 3000);
            }
          }, 250);
        });

    }, 250);
  });
}
