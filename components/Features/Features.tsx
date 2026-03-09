 'use client';
import React from 'react';
import styles from './Features.module.css';
import { motion } from 'motion/react';
import { Wallet, ShieldCheck, Car, Clock } from 'lucide-react';

const featuresData = [
  {
    icon: <Wallet size={32} className={styles.iconYellow} />,
    title: 'حدد سعرك بنفسك',
    description: 'مع مشوار مصر، أنت من يقرر سعر الرحلة. تفاوض مع الكباتن واختر العرض الأنسب لك.',
  },
  {
    icon: <ShieldCheck size={32} className={styles.iconBlue} />,
    title: 'رحلات آمنة وموثوقة',
    description: 'جميع الكباتن مسجلون وموثقون. يمكنك مشاركة مسار رحلتك مع عائلتك وأصدقائك.',
  },
  {
    icon: <Car size={32} className={styles.iconOrange} />,
    title: 'خيارات متعددة',
    description: 'سواء كنت تبحث عن سيارة اقتصادية، عائلية، أو حتى دراجة نارية، لدينا كل ما تحتاجه.',
  },
  {
    icon: <Clock size={32} className={styles.iconDark} />,
    title: 'متوفرون على مدار الساعة',
    description: 'نحن هنا لخدمتك في أي وقت وأي مكان. اطلب رحلتك الآن وسنصلك في دقائق.',
  },
];

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
            لماذا تختار <span className={styles.highlight}>مشوار مصر؟</span>
          </motion.h2>
          <motion.p 
            className={styles.subtitle}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            نقدم لك تجربة نقل فريدة تجمع بين الحرية في اختيار السعر والأمان التام.
          </motion.p>
        </div>

        <div className={styles.grid}>
          {featuresData.map((feature, index) => (
            <motion.div 
              key={index} 
              className={styles.card}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className={styles.iconContainer}>
                {feature.icon}
              </div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDescription}>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
