import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const GuestBanner = () => {
  return (
    <motion.div
      initial={{ y: -48, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="w-full bg-brand/10 border-b border-brand/20 py-2.5 px-4 flex items-center justify-between"
    >
      <span className="text-sm text-text-secondary font-mono">
        🔒 You are currently viewing as a guest.
      </span>
      <Link to="/signin" className="text-brand text-sm font-mono font-bold hover:underline">
        Click here to login to save permanent notes →
      </Link>
    </motion.div>
  );
};
