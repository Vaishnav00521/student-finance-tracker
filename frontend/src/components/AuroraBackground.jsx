import { motion } from 'framer-motion';

export default function AuroraBackground() {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Red orb - top right */}
            <motion.div
                className="aurora-orb aurora-orb-1"
                animate={{
                    x: [0, 50, -30, 20, 0],
                    y: [0, -40, 30, -20, 0],
                    scale: [1, 1.1, 0.95, 1.05, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Purple orb - bottom left */}
            <motion.div
                className="aurora-orb aurora-orb-2"
                animate={{
                    x: [0, -40, 30, -20, 0],
                    y: [0, 50, -30, 20, 0],
                    scale: [1, 0.95, 1.05, 0.98, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Blue orb - center */}
            <motion.div
                className="aurora-orb aurora-orb-3"
                animate={{
                    x: [0, 30, -20, 10, 0],
                    y: [0, 20, -30, 15, 0],
                    scale: [1, 1.05, 0.9, 1.02, 1],
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Zigzag pattern overlay */}
            <div className="zigzag-bg" />

            {/* Gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-transparent to-slate-950/50" />
        </div>
    );
}
