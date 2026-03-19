import { motion } from 'framer-motion';

/**
 * FadeIn - Reusable animated wrapper component
 * Provides smooth slide-up and fade-in animations with staggered children
 */
export default function FadeIn({
    children,
    delay = 0,
    direction = 'up',
    distance = 20,
    duration = 0.5,
    className = ''
}) {
    const directions = {
        up: { y: distance },
        down: { y: -distance },
        left: { x: distance },
        right: { x: -distance },
    };

    return (
        <motion.div
            initial={{ opacity: 0, ...directions[direction] }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.1, 0.25, 1] // Smooth easing
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/**
 * StaggerContainer - Wrapper for staggered animations on children
 */
export function StaggerContainer({
    children,
    delay = 0.1,
    className = ''
}) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: delay,
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/**
 * StaggerItem - Individual animated item for use inside StaggerContainer
 */
export function StaggerItem({
    children,
    direction = 'up',
    distance = 20,
    duration = 0.5,
    className = ''
}) {
    const directions = {
        up: { y: distance },
        down: { y: -distance },
        left: { x: distance },
        right: { x: -distance },
    };

    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, ...directions[direction] },
                visible: {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    transition: { duration, ease: [0.25, 0.1, 0.25, 1] }
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/**
 * AnimatedCard - Card with hover animations
 */
export function AnimatedCard({
    children,
    className = '',
    hoverScale = 1.02
}) {
    return (
        <motion.div
            whileHover={{ scale: hoverScale, y: -4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/**
 * AnimatedButton - Button with press animations
 */
export function AnimatedButton({
    children,
    onClick,
    className = '',
    disabled = false,
    type = 'button'
}) {
    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={className}
        >
            {children}
        </motion.button>
    );
}
