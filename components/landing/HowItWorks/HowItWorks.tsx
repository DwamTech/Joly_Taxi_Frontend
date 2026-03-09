'use client';
import Image from 'next/image';
import styles from './HowItWorks.module.css';
import { motion } from 'motion/react';
import howItWorksContent from '@/data/how-it-works.json';

export default function HowItWorks() {
  return (
    <section id="how-it-works" className={styles.howItWorks}>
      <div className={styles.container}>
        <div className={styles.content}>
          <motion.h2 
            className={styles.title}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {howItWorksContent.title} <span className={styles.highlight}>{howItWorksContent.highlight}</span>
          </motion.h2>
          <motion.p 
            className={styles.subtitle}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {howItWorksContent.subtitle}
          </motion.p>

          <div className={styles.steps}>
            {howItWorksContent.steps.map((step, index) => (
              <motion.div 
                key={index} 
                className={styles.step}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              >
                <div className={styles.stepNumber}>{step.number}</div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDescription}>{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div 
          className={styles.imageContainer}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.phoneMockup}>
            <div className={styles.screen}>
              <div className={styles.screenScroll}>
                <Image
                  src="/mobile.png"
                  alt="واجهة تطبيق مشوار مصر"
                  width={300}
                  height={600}
                  className={styles.screenImage}
                />
              </div>
            </div>
          </div>
          <div className={styles.scrollHint}>{howItWorksContent.scrollHint}</div>
        </motion.div>
      </div>
    </section>
  );
}
