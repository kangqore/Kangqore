import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const PostDeliverySupport = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto py-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="max-w-4xl"
        >
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 text-sm font-semibold text-brand-blue tracking-widest uppercase">
            Beyond Delivery
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-8">
            True partnership begins <br className="hidden md:block" />
            <span className="bg-brand-gradient bg-clip-text text-transparent">after deployment.</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
            We don't just hand over the keys and walk away. Our engagement model ensures your solution scales, remains secure, and continuously aligns with your evolving business objectives.
          </p>
        </motion.div>
      </section>

      {/* Core Features */}
      <section className="px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <ShieldCheck className="w-8 h-8 text-brand-blue" />,
              title: "L3 Managed Support",
              desc: "Deep technical support ensuring high availability, security patching, and proactive issue resolution before they impact users."
            },
            {
              icon: <Clock className="w-8 h-8 text-brand-blue" />,
              title: "SLA Assurance",
              desc: "Guaranteed response and resolution times tailored to your critical business processes, keeping downtime to an absolute minimum."
            },
            {
              icon: <CheckCircle2 className="w-8 h-8 text-brand-blue" />,
              title: "Continuous Optimization",
              desc: "Regular audits, performance tuning, and architecture reviews to ensure the system evolves alongside your business growth."
            }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20 hover:shadow-lg transition-all"
            >
              <div className="mb-6 bg-white dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center shadow-sm">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="bg-gray-50 dark:bg-gray-900 rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-grid-gray-900/[0.04] dark:bg-grid-white/[0.02]" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
              We Don't Deliver Projects.<br />We Deliver Business Outcomes.
            </h2>
            <Link 
              to="/#trust-statement"
              className="inline-flex items-center gap-3 bg-brand-blue text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform"
            >
              Return to Core Philosophy
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default PostDeliverySupport;
