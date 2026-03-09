'use client';
import styles from './terms.module.css';
import { motion } from 'motion/react';
import Navbar from '@/components/landing/Navbar/Navbar';
import Footer from '@/components/landing/Footer/Footer';

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <section className={styles.hero}>
          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            الشروط والأحكام
          </motion.h1>
          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            باستخدامك لتطبيق مشوار مصر فإنك توافق على البنود التالية.
          </motion.p>
        </section>

        <section className={styles.content}>
          <motion.div
            className={styles.card}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className={styles.cardTitle}>التعاريف</h2>
            <p className={styles.paragraph}>
              يشير مصطلح التطبيق إلى خدمة مشوار مصر. المستخدم هو كل من يقوم بإنشاء حساب أو يستخدم خدماتنا.
            </p>
          </motion.div>

          <motion.div
            className={styles.card}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className={styles.cardTitle}>إنشاء الحساب</h2>
            <p className={styles.paragraph}>
              يلتزم المستخدم بتقديم بيانات صحيحة، والمحافظة على سرية معلومات الدخول وعدم مشاركة الحساب مع أطراف أخرى.
            </p>
          </motion.div>

          <motion.div
            className={styles.card}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className={styles.cardTitle}>الاستخدام المقبول</h2>
            <p className={styles.paragraph}>
              يحظر استخدام التطبيق لأي أنشطة غير قانونية أو مسيئة أو محاولة التحايل على أنظمة الأمان.
            </p>
          </motion.div>

          <motion.div
            className={styles.card}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className={styles.cardTitle}>المدفوعات</h2>
            <p className={styles.paragraph}>
              قد تتطلب بعض الخدمات رسوماً. يتم عرض أي مبالغ مستحقة بوضوح قبل الإتمام وتخضع لسياسات الاسترجاع المعمول بها.
            </p>
          </motion.div>

          <motion.div
            className={styles.card}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className={styles.cardTitle}>إنهاء أو إيقاف الخدمة</h2>
            <p className={styles.paragraph}>
              نحتفظ بالحق في إيقاف الحسابات المخالفة أو تعليق بعض الميزات عند الضرورة لحماية المستخدمين والخدمة.
            </p>
          </motion.div>

          <motion.div
            className={styles.card}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className={styles.cardTitle}>القانون والاختصاص</h2>
            <p className={styles.paragraph}>
              تخضع هذه الشروط للقوانين المعمول بها في بلد التشغيل، وأي نزاع يخضع للاختصاص القضائي للمحاكم المختصة.
            </p>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
