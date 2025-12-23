'use client';

import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './index.module.css';

export default function StartNow() {
  const benefits = [
    'Cadastro 100% gratuito',
    'Milhares de vagas disponíveis',
    'Cursos de qualificação grátis',
    'Acesso pelo celular ou computador',
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>Comece agora mesmo</h2>
          <p className={styles.description}>
            O Geração Emprego é a maior rede de empregos do Estado de Rondônia.
            Cadastre-se gratuitamente e encontre sua oportunidade.
          </p>

          <ul className={styles.benefits}>
            {benefits.map((benefit, index) => (
              <li key={index} className={styles.benefit}>
                <CheckCircle size={20} className={styles.checkIcon} />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          <div className={styles.actions}>
            <Link href="/tipo-cadastro" className={styles.primaryBtn}>
              Criar minha conta grátis
            </Link>
            <Link href="/vagas" className={styles.secondaryBtn}>
              Ver vagas disponíveis
            </Link>
          </div>
        </div>

        <div className={styles.mobileAppCard}>
          <div className={styles.cardHeader}>
            <span className={styles.phoneEmoji}>📱</span>
            <h3>Acesse pelo celular</h3>
            <p className={styles.comingSoon}>Em breve nos aplicativos</p>
          </div>

          <div className={styles.qrCodesContainer}>
            <div className={styles.qrCodeWrapper}>
              <div className={styles.qrCode}>
                <Image
                  src="/images/qr-appstore.svg"
                  alt="QR Code para App Store"
                  width={100}
                  height={100}
                  className={styles.qrImage}
                />
              </div>
              <div className={styles.storeInfo}>
                <Image
                  src="/images/apple-logo.svg"
                  alt="Apple"
                  width={20}
                  height={20}
                  className={styles.storeLogo}
                />
                <span>App Store</span>
              </div>
            </div>

            <div className={styles.qrCodeWrapper}>
              <div className={styles.qrCode}>
                <Image
                  src="/images/qr-playstore.svg"
                  alt="QR Code para Play Store"
                  width={100}
                  height={100}
                  className={styles.qrImage}
                />
              </div>
              <div className={styles.storeInfo}>
                <Image
                  src="/images/playstore-logo.svg"
                  alt="Google Play"
                  width={20}
                  height={20}
                  className={styles.storeLogo}
                />
                <span>Play Store</span>
              </div>
            </div>
          </div>

          <p className={styles.scanText}>
            Escaneie o QR Code para baixar o aplicativo
          </p>
        </div>
      </div>
    </section>
  );
}
