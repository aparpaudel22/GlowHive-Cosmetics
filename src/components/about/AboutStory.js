'use client';

import React from 'react';
import { motion } from 'framer-motion';

const AboutStory = () => {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="section-padding">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-3 py-1 text-xs font-semibold text-blush-dark bg-blush rounded-full mb-4">
              Our Journey
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-dark mb-4">
              Born from a{' '}
              <span className="text-gradient">Passion</span>{' '}
              for Clean Beauty
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the story behind GLOWHIVE and our commitment to creating beauty that cares.
            </p>
          </motion.div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image Side */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <div className="aspect-[4/3] bg-gradient-to-br from-blush to-gold/30 flex items-center justify-center">
                  <span className="text-9xl opacity-80">🌸</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-dark/10 to-transparent" />
              </div>
              {/* Decorative Elements */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gold rounded-full opacity-20 blur-2xl" />
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-blush rounded-full opacity-30 blur-2xl" />
            </motion.div>

            {/* Content Side */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="space-y-5 text-gray-600 leading-relaxed">
                <p className="text-base">
                  GLOWHIVE was founded in 2020 with a simple mission: to create premium skincare 
                  and makeup that actually works, without compromising on ethics or sustainability.
                </p>
                <p className="text-base">
                  What started as a small batch of handcrafted serums in a kitchen has grown into 
                  a beloved beauty brand trusted by thousands. Every product is carefully formulated 
                  with the finest natural ingredients, backed by science, and infused with love.
                </p>
                <div className="pt-2">
                  <p className="text-lg font-serif text-blush-dark font-medium italic">
                    "Because you deserve to glow inside and out."
                  </p>
                </div>
              </div>

              {/* Feature Icons */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center text-center p-4 bg-cream rounded-xl">
                  <span className="text-3xl mb-2">🌿</span>
                  <span className="text-xs font-medium text-dark">100% Cruelty-Free</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-cream rounded-xl">
                  <span className="text-3xl mb-2">♻️</span>
                  <span className="text-xs font-medium text-dark">Eco-Friendly</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 bg-cream rounded-xl">
                  <span className="text-3xl mb-2">🧪</span>
                  <span className="text-xs font-medium text-dark">Dermatologist Tested</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutStory;