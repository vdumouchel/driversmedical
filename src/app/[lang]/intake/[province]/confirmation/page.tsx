"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function ConfirmationPage() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md text-center"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <svg
            className="h-8 w-8 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
          Application Submitted
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Thank you for completing your intake. A licensed physician or nurse will review
          your information and complete your driver&apos;s medical form. You&apos;ll
          receive an email when your form is ready.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
