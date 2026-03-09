 'use client';
import React from 'react';
import styles from './Hero.module.css';
import { motion } from 'motion/react';
import { Smartphone, MapPin } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <motion.h1 
            className={styles.title}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            مشوارك أسهل مع <span className={styles.highlight}>مشوار مصر</span>
          </motion.h1>
          
          <motion.p 
            className={styles.description}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            تطبيق النقل الذكي الذي يتيح لك التفاوض على سعر رحلتك. اختر سيارتك، حدد وجهتك، وانطلق بأمان وبأفضل الأسعار.
          </motion.p>
          
          <motion.div 
            className={styles.buttons}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button className={styles.primaryBtn}>
              <img src="/app-store.png" alt="App Store" className={styles.storeIconImg} />
              حمل التطبيق الآن
              <span className={styles.soonBadge}>Soon</span>
            </button>
            <button className={styles.secondaryBtn}>
              <img src="/google.png" alt="Google Play" className={styles.storeIconImg} />
              حمل التطبيق الآن
              <span className={styles.soonBadge}>Soon</span>
            </button>
          </motion.div>

          <motion.div 
            className={styles.stats}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className={styles.statItem}>
              <span className={styles.statValue}>+1M</span>
              <span className={styles.statLabel}>مستخدم</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>+50K</span>
              <span className={styles.statLabel}>كابتن</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>4.9</span>
              <span className={styles.statLabel}>تقييم</span>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className={styles.imageContainer}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className={styles.blob}></div>
          <img 
            src="/hero.jpg" 
            alt="مشوار مصر" 
            className={styles.heroImage}
            referrerPolicy="no-referrer"
          />
          
          <motion.div 
            className={styles.floatingCard}
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            <div className={styles.cardHeader}>
              <div className={styles.avatar}></div>
              <div>
                <p className={styles.cardTitle}>الكابتن أحمد</p>
                <p className={styles.cardSubtitle}>في الطريق إليك</p>
              </div>
            </div>
            <div className={styles.cardPrice}>
              <span>السعر المتفق عليه</span>
              <span className={styles.priceValue}>25 ر.س</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
