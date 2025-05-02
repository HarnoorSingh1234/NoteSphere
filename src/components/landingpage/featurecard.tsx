'use client'

import React, { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Card className="relative bg-white border border-gray-200 shadow-sm overflow-hidden dark:bg-black/40 dark:border-gray-800">
        {/* subtle dark-mode gradient overlay */}
        <div className="absolute inset-0 hidden dark:block bg-gradient-to-br from-purple-900/10 to-indigo-900/10 opacity-50" />
        <CardHeader>
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle className="text-gray-900 dark:text-white">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-400">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}