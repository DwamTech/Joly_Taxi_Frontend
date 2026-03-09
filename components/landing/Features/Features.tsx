'use client';
import styles from './Features.module.css';
import { motion } from 'motion/react';
import { Wallet, ShieldCheck, Car, Clock } from 'lucide-react';
import featuresContent from '@/data/features.json';

const iconMap: Record<string, any> = {
  Wallet,
  ShieldCheck,
  Car,
  Clock,
};

export default function Features() {
  return (
    <section id="features" className={styles.features}>
      <div className={styles.container}>
        <div className={styles.header}>
          <motion.h2 
            className={styles.title}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {featuresContent.title} <span className={styles.highlight}>{featuresContent.highlight}</span>
          </motion.h2>
          <motion.p 
            className={styles.subtitle}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {featuresContent.subtitle}
          </motion.p>
        </div>

        <div className={styles.grid}>
          {featuresContent.features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon];
            return (
              <motion.div 
                key={index} 
                className={styles.card}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={styles.iconContainer}>
                  <IconComponent size={32} className={styles[`icon${feature.iconColor.charAt(0).toUpperCase() + feature.iconColor.slice(1)}`]} />
                </div>
                <h3 className={styles.cardTitle}>{feature.title}</h3>
                <p className={styles.cardDescription}>{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
