'use client';

import { MessageCircle } from 'lucide-react';
import styles from './index.module.css';

export default function WhatsAppButton() {
  const phoneNumber = '5569999999999'; // Substituir pelo número real
  const message = 'Olá! Preciso de ajuda com o Geração Emprego.';

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      className={styles.button}
      onClick={handleClick}
      aria-label="Falar pelo WhatsApp"
      title="Precisa de ajuda? Fale conosco"
    >
      <MessageCircle size={24} />
      <span className={styles.text}>Ajuda</span>
    </button>
  );
}
