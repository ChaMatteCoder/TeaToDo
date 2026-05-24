import { motion } from 'framer-motion';
import tagAsset from '../../assets/03.png';

export function HangingTag() {
  return (
    <motion.div
      className="absolute left-[54%] top-[-74px] z-10 hidden w-40 origin-top cursor-default xl:block 2xl:left-[56%]"
      initial={{ opacity: 0, y: -22, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: 5 }}
      transition={{ duration: 0.7, delay: 0.12, ease: 'easeOut' }}
      whileHover={{
        rotate: [5, -8, 7, -4, 3, 5],
        y: [0, 2, 0],
        transition: { duration: 0.95, ease: 'easeInOut' },
      }}
    >
      <img src={tagAsset} alt="" className="w-full drop-shadow-xl" />
    </motion.div>
  );
}
