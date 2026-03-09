'use client';
import Image from 'next/image';
import styles from './Hero.module.css';
import { motion } from 'motion/react';
import heroContent from '@/data/hero.json';

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
            {heroContent.title} <span className={styles.highlight}>{heroContent.highlight}</span>
          </motion.h1>
          
          <motion.p 
            className={styles.description}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {heroContent.description}
          </motion.p>
          
          <motion.div 
            className={styles.buttons}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button className={styles.primaryBtn}>
              <Image src="/app-store.png" alt="App Store" width={24} height={24} className={styles.storeIconImg} />
              {heroContent.buttons.appStore.text}
              <span className={styles.soonBadge}>{heroContent.buttons.appStore.badge}</span>
            </button>
            <button className={styles.secondaryBtn}>
              <Image src="/google.png" alt="Google Play" width={24} height={24} className={styles.storeIconImg} />
              {heroContent.buttons.googlePlay.text}
              <span className={styles.soonBadge}>{heroContent.buttons.googlePlay.badge}</span>
            </button>
          </motion.div>

          <motion.div 
            className={styles.stats}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {heroContent.stats.map((stat, index) => (
              <div key={index} className={styles.statItem}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
        
        <motion.div 
          className={styles.imageContainer}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className={styles.blob}></div>
          <Image 
            src="/hero.jpg" 
            alt="مشوار مصر" 
            width={600}
            height={400}
            priority
            className={styles.heroImage}
          />
          
          <motion.div 
            className={styles.floatingCard}
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            <div className={styles.cardHeader}>
              <div className={styles.avatar}></div>
              <div>
                <p className={styles.cardTitle}>{heroContent.floatingCard.driverName}</p>
                <p className={styles.cardSubtitle}>{heroContent.floatingCard.status}</p>
              </div>
            </div>
            <div className={styles.cardPrice}>
              <span>{heroContent.floatingCard.priceLabel}</span>
              <span className={styles.priceValue}>{heroContent.floatingCard.priceValue}</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
