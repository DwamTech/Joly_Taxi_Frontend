import Image from 'next/image';
import styles from './Footer.module.css';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.bottom}>
          <div className={styles.footerSideLogo}>
            <Image src="/logo.png" alt="مشوار مصر" width={120} height={40} className={styles.footerLogo} />
          </div>
          
          <div className={styles.bottomCenter}>
            <p className={styles.copyright}> جميع الحقوق محفوظة . مشوار مصر .© 2026 </p>
            <div className={styles.centerLinks}>
              <a href="/privacy" className={styles.legalLink}>سياسة الخصوصية</a>
              <span className={styles.divider}>|</span>
              <a href="/terms" className={styles.legalLink}>الشروط والأحكام</a>
            </div>
            <div className={styles.socials}>
              <a href="#" className={styles.socialLink}><Facebook size={20} /></a>
              <a href="#" className={styles.socialLink}><Twitter size={20} /></a>
              <a href="#" className={styles.socialLink}><Instagram size={20} /></a>
              <a href="#" className={styles.socialLink}><Linkedin size={20} /></a>
            </div>
          </div>
          
          <div className={styles.bottomActions}>
            <div aria-label="حمل التطبيق" className={styles.downloadButtons}>
              <button className={styles.storeBtn}>
                <Image src="/app-store.png" alt="App Store" width={24} height={24} className={styles.storeIconImg} />
                <div className={styles.storeText}>
                  <span>حمل من</span>
                  <strong>App Store</strong>
                </div>
                <span className={styles.soonBadge}>Soon</span>
              </button>
              <button className={styles.storeBtn}>
                <Image src="/google.png" alt="Google Play" width={24} height={24} className={styles.storeIconImg} />
                <div className={styles.storeText}>
                  <span>احصل عليه من</span>
                  <strong>Google Play</strong>
                </div>
                <span className={styles.soonBadge}>Soon</span>
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </footer>
  );
}
