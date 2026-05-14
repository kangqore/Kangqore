import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import BookingWidget from '../components/scheduling/BookingWidget';
import { motion } from 'framer-motion';

const BookingPage = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const schedulingLinkId = searchParams.get('link');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-12 px-4 md:py-24">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <BookingWidget 
            eventTypeSlug={slug} 
            schedulingLinkId={schedulingLinkId} 
          />
        </motion.div>
        
        {/* Footer info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-400 font-medium">
            Powered by <span className="text-brand-blue font-bold">Kangqore Scheduling</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
