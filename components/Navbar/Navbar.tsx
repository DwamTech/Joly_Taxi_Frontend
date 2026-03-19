'use client';
import { useState } from 'react';
import styles from './Navbar.module.css';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <img src="/logo.png" alt="مشوار مصر" className={styles.logoImg} />
        </div>
        
        <div className={`${styles.links} ${isOpen ? styles.open : ''}`}>
          <a href="/" className={styles.link} onClick={() => setIsOpen(false)}>الرئيسية</a>
          <a href="#features" className={styles.link} onClick={() => setIsOpen(false)}>المميزات</a>
          <a href="#vehicles" className={styles.link} onClick={() => setIsOpen(false)}>المركبات</a>
          <a href="#how-it-works" className={styles.link} onClick={() => setIsOpen(false)}>كيف يعمل</a>
        </div>

        <div className={styles.actions}>
          <a href="#home" className={styles.downloadBtn}>حمل التطبيق</a>
          <button className={styles.mobileMenuBtn} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
