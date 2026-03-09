'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Navbar.module.css';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <Image src="/logo.png" alt="مشوار مصر" width={120} height={40} className={styles.logoImg} priority />
        </Link>
        
        <div className={`${styles.links} ${isOpen ? styles.open : ''}`}>
          <Link href="/" className={styles.link} onClick={() => setIsOpen(false)}>الرئيسية</Link>
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
