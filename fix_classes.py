import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix duplicate class attributes - merge them into one
# Pattern: class="cta-trigger" class="btn-primary"
content = re.sub(r'class="cta-trigger" class="([^"]+)"', r'class="cta-trigger \1"', content)
# Pattern: class="cta-trigger" class="nav-cta desktop-only"  
content = re.sub(r'class="cta-trigger" class="(nav-cta[^"]*)"', r'class="cta-trigger \1"', content)
# Remove modal HTML that was injected (we will use a separate page instead)
modal_start = content.find('    <!-- FLOATING CTA -->')
if modal_start != -1:
    modal_end = content.find('\n  </div>\n  <script', modal_start)
    # keep the floating CTA button but remove the modal form block
    floating_start = modal_start
    modal_form_start = content.find('\n    <!-- FORM MODAL', modal_start)
    if modal_form_start != -1:
        modal_form_end = content.find('</div>\n', modal_form_start)
        if modal_form_end != -1:
            # Remove the modal form section (leave floating CTA)
            modal_form_end_full = modal_form_end + len('</div>\n')
            # Find the exact end of the modal div
            depth = 0
            i = modal_form_start
            in_modal = False
            for idx in range(modal_form_start, len(content)):
                if content[idx:idx+5] == '<div ':
                    depth += 1
                    in_modal = True
                elif content[idx:idx+6] == '</div>':
                    if in_modal:
                        depth -= 1
                        if depth == 0:
                            modal_form_end_full = idx + 6
                            break

            content = content[:modal_form_start] + content[modal_form_end_full:]

# Also change href="#form" to href="contacto.html" for CTAs (excluding floating)
content = content.replace('href="#form" class="floating-cta cta-trigger"', 'href="contacto.html" class="floating-cta cta-trigger"')
content = re.sub(r'href="#form" class="cta-trigger ([^"]+)"', r'href="contacto.html" class="cta-trigger \1"', content)
content = re.sub(r'href="#form" class="cta-trigger"', r'href="contacto.html" class="cta-trigger"', content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
