'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Product {
  handle: string;
  title: string;
  featured_image_url?: string;
  vendor: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products?limit=12');
        const data = await res.json();
        setProducts(data.products);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    }
    fetchProducts();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-8 sm:p-12 md:p-24 bg-gray-50 text-gray-800">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Product API
          </span>
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-gray-600 max-w-2xl">
          A modern, optimized, and scalable API for your products.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-7xl"
      >
        {products.map((product) => (
          <motion.div
            key={product.handle}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="bg-white rounded-lg shadow-md overflow-hidden group cursor-pointer"
          >
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
              {product.featured_image_url ? (
                <Image
                  src={product.featured_image_url}
                  alt={product.title}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 ease-in-out"
                />
              ) : (
                <span className="text-gray-500">No Image</span>
              )}
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold truncate group-hover:text-blue-600 transition-colors">
                {product.title}
              </h2>
              <p className="text-sm text-gray-500">{product.vendor}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </main>
  );
}