import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface FeatureCardProps {
    title: string;
    description: string;
    icon?: ReactNode;
    badge?: string;
}

export default function FeatureCard({ title, description, icon, badge }: FeatureCardProps) {
    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className="p-6 rounded-2xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/10 backdrop-blur-xl relative overflow-hidden group shadow-xl"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-full blur-2xl group-hover:bg-violet-600/20 transition-all pointer-events-none" />

            {badge && (
                <span className="inline-block px-2.5 py-0.5 mb-4 text-[11px] font-semibold tracking-wider uppercase rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    {badge}
                </span>
            )}

            {icon && (
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-5 group-hover:scale-110 group-hover:border-violet-500/40 transition-all">
                    {icon}
                </div>
            )}

            <h3 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-violet-300 transition-colors">
                {title}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
                {description}
            </p>
        </motion.div>
    );
}
