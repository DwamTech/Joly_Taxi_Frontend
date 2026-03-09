 'use client';
import React from 'react';
import styles from './Vehicles.module.css';
import { motion } from 'motion/react';
import { Car, Truck, Bike, Users } from 'lucide-react';

const vehiclesData = [
  {
    type: 'اقتصادي',
    icon: <Car size={48} className={styles.icon} />,
    description: 'رحلات يومية بأسعار مناسبة للجميع.',
    color: '#38BDF8',
    bg: '#E0F2FE'
  },
  {
    type: 'عائلي',
    icon: <Users size={48} className={styles.icon} />,
    description: 'سيارات واسعة تناسب العائلة والأصدقاء.',
    color: '#F97316',
    bg: '#FFEDD5'
  },
  {
    type: 'توصيل طلبات',
    icon: <Truck size={48} className={styles.icon} />,
    description: 'نقل الأغراض والطرود بأمان وسرعة.',
    color: '#FCD34D',
    bg: '#FEF3C7'
  },
  {
    type: 'دراجة نارية',
    icon: <Bike size={48} className={styles.icon} />,
    description: 'للوصول السريع وتجنب الزحام المروري.',
    color: '#10B981',
    bg: '#D1FAE5'
  }
];

export default function Vehicles() {
  return (
    <section id="vehicles" className={styles.vehicles}>
      <div className={styles.container}>
        <div className={styles.header}>
          <motion.h2 
            className={styles.title}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            مركبات <span className={styles.highlight}>متنوعة</span> لجميع احتياجاتك
          </motion.h2>
          <motion.p 
            className={styles.subtitle}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            اختر المركبة التي تناسب مشوارك، سواء كنت بمفردك، مع عائلتك، أو تحتاج لتوصيل أغراضك.
          </motion.p>
        </div>

        <div className={styles.grid}>
          {vehiclesData.map((vehicle, index) => (
            <motion.div 
              key={index} 
              className={styles.card}
              style={{ '--hover-color': vehicle.color } as React.CSSProperties}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className={styles.iconWrapper} style={{ backgroundColor: vehicle.bg, color: vehicle.color }}>
                {vehicle.icon}
              </div>
              <h3 className={styles.cardTitle}>{vehicle.type}</h3>
              <p className={styles.cardDescription}>{vehicle.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
