'use client';
import styles from './privacy.module.css';
import { motion } from 'motion/react';
import Navbar from '@/components/landing/Navbar/Navbar';
import Footer from '@/components/landing/Footer/Footer';

export default function PrivacyPage() {
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
            سياسة الخصوصية
          </motion.h1>
          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            نحترم خصوصيتك ونسعى لحماية بياناتك الشخصية وفق أفضل الممارسات.
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
            <h2 className={styles.cardTitle}>البيانات التي نجمعها</h2>
            <p className={styles.paragraph}>
              نجمع معلومات مثل بيانات الحساب الأساسية، معلومات الجهاز، وموقعك التقريبي عند الحاجة لتقديم الخدمة.
            </p>
          </motion.div>

          <motion.div
            className={styles.card}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className={styles.cardTitle}>كيفية استخدام البيانات</h2>
            <p className={styles.paragraph}>
              نستخدم بياناتك لتحسين التجربة، توفير الميزات الأساسية مثل تحديد المواقع والتواصل، ولضمان الأمان ومنع إساءة الاستخدام.
            </p>
          </motion.div>

          <motion.div
            className={styles.card}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className={styles.cardTitle}>مشاركة البيانات</h2>
            <p className={styles.paragraph}>
              لا نشارك بياناتك مع أطراف ثالثة إلا عند الضرورة لتقديم الخدمة أو وفق متطلبات قانونية.
            </p>
          </motion.div>

          <motion.div
            className={styles.card}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className={styles.cardTitle}>حماية البيانات</h2>
            <p className={styles.paragraph}>
              نطبّق تدابير تقنية وتنظيمية لحماية بياناتك من الوصول غير المصرح به أو التعديل أو الفقدان.
            </p>
          </motion.div>

          <motion.div
            className={styles.card}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className={styles.cardTitle}>حقوقك</h2>
            <p className={styles.paragraph}>
              يمكنك طلب الوصول إلى بياناتك أو تصحيحها أو حذفها وفق القوانين السارية. تواصل معنا لتحقيق ذلك.
            </p>
          </motion.div>

          <motion.div
            className={styles.card}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className={styles.cardTitle}>تواصل معنا</h2>
            <p className={styles.paragraph}>
              لأي استفسارات حول هذه السياسة، يمكنك مراسلتنا عبر البريد الإلكتروني أو من خلال مركز المساعدة داخل التطبيق.
            </p>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
