'use client';
import styles from './Vehicles.module.css';
import { motion } from 'motion/react';
import { Car, Truck, Bike, Users } from 'lucide-react';
import vehiclesContent from '@/data/vehicles.json';

const iconMap: Record<string, any> = {
  Car,
  Truck,
  Bike,
  Users,
};

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
            {vehiclesContent.title} <span className={styles.highlight}>{vehiclesContent.highlight}</span> {vehiclesContent.titleSuffix}
          </motion.h2>
          <motion.p 
            className={styles.subtitle}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {vehiclesContent.subtitle}
          </motion.p>
        </div>

        <div className={styles.grid}>
          {vehiclesContent.vehicles.map((vehicle, index) => {
            const IconComponent = iconMap[vehicle.icon];
            return (
              <motion.div 
                key={index} 
                className={styles.card}
                style={{ '--hover-color': vehicle.color } as React.CSSProperties}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={styles.iconWrapper} style={{ backgroundColor: vehicle.bg, color: vehicle.color }}>
                  <IconComponent size={48} className={styles.icon} />
                </div>
                <h3 className={styles.cardTitle}>{vehicle.type}</h3>
                <p className={styles.cardDescription}>{vehicle.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
