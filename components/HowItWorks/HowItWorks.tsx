 'use client';
import React from 'react';
import styles from './HowItWorks.module.css';
import { motion } from 'motion/react';

const steps = [
  {
    number: '01',
    title: 'حدد وجهتك',
    description: 'افتح التطبيق، اختر موقعك الحالي وحدد الوجهة التي ترغب بالذهاب إليها.',
  },
  {
    number: '02',
    title: 'اختر المركبة واقترح السعر',
    description: 'اختر نوع المركبة المناسب لك واقترح السعر الذي تراه مناسباً للرحلة.',
  },
  {
    number: '03',
    title: 'تفاوض مع الكباتن',
    description: 'تلقى عروضاً من الكباتن القريبين منك، اختر العرض الأفضل وانطلق.',
  }
];

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
            كيف يعمل <span className={styles.highlight}>التطبيق؟</span>
          </motion.h2>
          <motion.p 
            className={styles.subtitle}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            بخطوات بسيطة وسريعة، يمكنك طلب رحلتك والوصول إلى وجهتك بأمان وبأفضل سعر.
          </motion.p>

          <div className={styles.steps}>
            {steps.map((step, index) => (
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
                <img
                  src="/mobile.png"
                  alt="واجهة تطبيق مشوار مصر"
                  className={styles.screenImage}
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
          <div className={styles.scrollHint}>اسحب لأعلى لعمل تجربة كاملة</div>
        </motion.div>
      </div>
    </section>
  );
}
