import React, {useEffect, useRef, useState} from 'react';
import {
  ChipRow,
  CodeBlock,
  Hint,
  PlayRoot,
  Section,
  styles,
} from '@/components/shared/dataMarkupPlayKit';

const WC_SOURCE = `<my-card title="Hello">
  <span slot="body">Slot content</span>
</my-card>`;

export default function WebComponentsPlay() {
  const hostRef = useRef(null);
  const [shadow, setShadow] = useState(true);

  useEffect(() => {
    if (customElements.get('my-card')) return;
    class MyCard extends HTMLElement {
      static get observedAttributes() {
        return ['title'];
      }
      connectedCallback() {
        this.render();
      }
      attributeChangedCallback() {
        this.render();
      }
      render() {
        const title = this.getAttribute('title') || 'Card';
        const useShadow = this.getAttribute('data-shadow') !== 'false';
        if (useShadow) {
          const root = this.shadowRoot ?? this.attachShadow({mode: 'open'});
          root.innerHTML = `
            <style>
              :host { display: block; font-family: inherit; }
              .card {
                border: 1px solid var(--demo-border, #ccc);
                border-radius: 8px;
                padding: 0.75rem;
                background: var(--ifm-background-surface-color, #fff);
              }
              h4 { margin: 0 0 0.5rem; color: var(--ifm-color-primary, #7b68ee); font-size: 0.95rem; }
              ::slotted(*) { color: var(--ifm-color-content-secondary, #666); font-size: 0.875rem; }
            </style>
            <div class="card"><h4>${title}</h4><slot name="body">default</slot></div>`;
        } else {
          this.innerHTML = `<div class="card"><h4>${title}</h4><div>${this.textContent || 'light DOM'}</div></div>`;
        }
      }
    }
    customElements.define('my-card', MyCard);
  }, []);

  useEffect(() => {
    const el = hostRef.current?.querySelector('my-card');
    if (!el) return;
    el.setAttribute('title', shadow ? 'Shadow DOM' : 'Light DOM');
    el.setAttribute('data-shadow', shadow ? 'true' : 'false');
    if (!shadow) {
      el.innerHTML = 'light DOM content';
    }
  }, [shadow]);

  return (
    <PlayRoot title="Web Components" subtitle="Custom element + Shadow DOM + slot">
      <ChipRow
        value={shadow ? 'on' : 'off'}
        onChange={(id) => setShadow(id === 'on')}
        options={[
          {id: 'on', label: 'Shadow DOM'},
          {id: 'off', label: 'Light DOM'},
        ]}
      />
      <Section title="Разметка">
        <CodeBlock>{WC_SOURCE}</CodeBlock>
      </Section>
      <Section title="Preview">
        <div className={styles.previewFrame} ref={hostRef}>
          <my-card title="Shadow DOM">
            <span slot="body">Content from light DOM → slot</span>
          </my-card>
        </div>
      </Section>
      <Hint>Shadow DOM изолирует стили; слоты пробрасывают разметку из light DOM внутрь компонента.</Hint>
    </PlayRoot>
  );
}
