import { useRef, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Star, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

import destGoa from "@/assets/dest-goa.jpg";
import destManali from "@/assets/dest-manali.jpg";
import destKerala from "@/assets/dest-kerala.jpg";
import destBali from "@/assets/dest-bali.jpg";
import destParis from "@/assets/dest-paris.jpg";

const destinations = [
	{ name: "Goa", country: "India", image: destGoa, rating: 4.7, price: "₹15,000" },
	{ name: "Manali", country: "India", image: destManali, rating: 4.6, price: "₹12,000" },
	{ name: "Kerala", country: "India", image: destKerala, rating: 4.8, price: "₹18,000" },
	{ name: "Jaipur", country: "India", image: destBali, rating: 4.5, price: "₹10,000" },
	{ name: "Ladakh", country: "India", image: destParis, rating: 4.9, price: "₹22,000" },
];

const appleEase: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const cardVariants = {
	hidden: { opacity: 0, y: 40 },
	show: { opacity: 1, y: 0 },
};

/* ---------- 3D tilt card wrapper ---------- */
const TiltCard = ({
	children,
	onClick,
}: {
	children: React.ReactNode;
	onClick: () => void;
}) => {
	const cardRef = useRef<HTMLDivElement>(null);

	const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
		const el = cardRef.current;
		if (!el) return;
		const rect = el.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 → 0.5
		const y = (e.clientY - rect.top) / rect.height - 0.5;
		el.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
	}, []);

	const handleMouseLeave = useCallback(() => {
		const el = cardRef.current;
		if (!el) return;
		el.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) translateY(0px)";
	}, []);

	return (
		<div
			ref={cardRef}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
			onClick={onClick}
			className="transition-transform duration-300 ease-out will-change-transform"
			style={{ transformStyle: "preserve-3d" }}
		>
			{children}
		</div>
	);
};

/* ---------- Main component ---------- */
const PopularDestinations = () => {
	const navigate = useNavigate();
	const sectionRef = useRef<HTMLDivElement>(null);

	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start end", "start 0.3"],
	});

	const headerOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
	const headerY = useTransform(scrollYProgress, [0, 0.4], [60, 0]);
	const sectionY = useTransform(scrollYProgress, [0, 1], [80, 0]);
	const sectionOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

	return (
		<section
			ref={sectionRef}
			className="py-28 md:py-32 bg-gradient-to-b from-white to-gray-100 overflow-hidden"
		>
			<div className="max-w-7xl mx-auto px-6">
				{/* Header */}
				<motion.div
					className="text-center mb-16"
					style={{ opacity: headerOpacity, y: headerY }}
				>
					<h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-3">
						Explore India
					</h2>
					<p className="font-body text-gray-500 text-lg max-w-xl mx-auto">
						Handpicked destinations loved by travelers
					</p>
				</motion.div>

				{/* Floating cards panel */}
				<motion.div
					style={{ y: sectionY, opacity: sectionOpacity }}
					className="bg-white rounded-3xl shadow-xl p-10"
				>
					{/* Staggered grid */}
					<motion.div
						className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
						initial="hidden"
						whileInView="show"
						viewport={{ once: true }}
						variants={{
							hidden: {},
							show: { transition: { staggerChildren: 0.12 } },
						}}
					>
						{destinations.map((dest) => (
							<motion.div
								key={dest.name}
								variants={cardVariants}
								transition={{ duration: 0.6, ease: appleEase }}
							>
								<TiltCard
									onClick={() =>
										navigate(`/destination/${dest.name.toLowerCase()}`)
									}
								>
									<div className="group cursor-pointer rounded-2xl overflow-hidden border border-gray-200 bg-white hover:shadow-2xl transition-all duration-500 hover:-translate-y-3">
										{/* Image with depth overlay */}
										<div className="aspect-[4/5] overflow-hidden relative">
											<img
												src={dest.image}
												alt={dest.name}
												className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
											/>
											{/* Lighting overlay on hover */}
											<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
										</div>

										{/* Info */}
										<div className="p-4">
											<div className="flex items-center justify-between mb-1">
												<h3 className="font-semibold text-gray-900">
													{dest.name}
												</h3>
												<div className="flex items-center gap-1 text-amber-500">
													<Star className="w-3.5 h-3.5 fill-current" />
													<span className="text-xs font-medium">
														{dest.rating}
													</span>
												</div>
											</div>
											<div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
												<MapPin className="w-3 h-3" />
												{dest.country}
											</div>
											<p className="text-sm font-semibold text-blue-600">
												From {dest.price}
											</p>
										</div>
									</div>
								</TiltCard>
							</motion.div>
						))}
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
};

export default PopularDestinations;