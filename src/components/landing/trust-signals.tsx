import { motion } from "framer-motion";
import { Container } from "@/src/components/ui/container";
import { Badge } from "@/src/components/ui/badge";
import { Typography } from "@/src/components/ui/typography";
import { Shield, Award, Clock, Users, CheckCircle, Star } from "lucide-react";

const trustSignals = [
  {
    icon: Shield,
    title: "HIPAA Compliant",
    description: "Enterprise security",
    color: "text-teal-600",
    bgColor: "bg-teal-50",
  },
  {
    icon: Award,
    title: "SOC 2 Type II",
    description: "Certified secure",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: Clock,
    title: "99.9% Uptime",
    description: "Reliable platform",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
];

function TrustSignals() {
  return (
    <section className="py-12 bg-gradient-to-r from-teal-50/80 via-blue-50/40 to-emerald-50/80 border-y border-gray-100">
      <Container>
        <div className="text-center mb-8">
          <Badge
            variant="outline"
            className="mb-2 px-3 py-1 bg-white/80 backdrop-blur-sm border border-teal-200 text-teal-700"
          >
            <Star className="w-3 h-3 mr-1" />
            Trusted by Veterinary Professionals
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {trustSignals.map((signal, index) => {
            const Icon = signal.icon;

            return (
              <motion.div
                key={signal.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -2 }}
                className="group"
              >
                <div className="flex flex-col items-center text-center p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-white/50 hover:border-teal-200 hover:shadow-lg transition-all duration-300">
                  <div
                    className={`w-12 h-12 ${signal.bgColor} rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className={`w-6 h-6 ${signal.color}`} />
                  </div>

                  <Typography
                    variant="body-sm"
                    className="font-semibold text-gray-900 mb-1"
                  >
                    {signal.title}
                  </Typography>

                  <Typography variant="caption" className="text-gray-600">
                    {signal.description}
                  </Typography>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional trust indicators */}
        <div className="flex items-center justify-center gap-8 mt-8 pt-6 border-t border-white/50">
          <motion.div
            className="flex items-center gap-2 text-gray-600"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <Typography variant="caption" className="font-medium">
              GDPR Compliant
            </Typography>
          </motion.div>

          <motion.div
            className="flex items-center gap-2 text-gray-600"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
          >
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <Typography variant="caption" className="font-medium">
              Bank-Grade Encryption
            </Typography>
          </motion.div>

          <motion.div
            className="flex items-center gap-2 text-gray-600"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
          >
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <Typography variant="caption" className="font-medium">
              24/7 Monitoring
            </Typography>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

export { TrustSignals };
