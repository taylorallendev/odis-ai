"use client";

import React, { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  BrainCircuit,
  MessageCircle,
  Mic,
  FileText,
  Clock,
  Users,
  TrendingUp,
  CheckCircle,
  Play,
  Sparkles,
  ArrowRight,
  Activity,
  Heart,
  Shield,
  Award,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Container } from "@/src/components/ui/container";
import {
  DisplayHeading,
  Body,
  GradientText,
  Typography,
} from "@/src/components/ui/typography";
import { cn } from "@/src/lib/utils";

// Simplified AI Agents Overview
function AIAgentsOverview() {
  const [activeAgent, setActiveAgent] = useState(0);

  const agents = [
    {
      id: "scribe",
      name: "OdisAI Scribe Agent",
      description:
        "Transforms conversations into perfect medical documentation",
      icon: BrainCircuit,
      color: "from-teal-500 to-emerald-500",
      metrics: {
        accuracy: "99.1%",
        timeSaved: "3.2h daily",
        feature: "Real-time transcription",
      },
    },
    {
      id: "communication",
      name: "Client Communication Agent",
      description: "Automates personalized client engagement and follow-ups",
      icon: MessageCircle,
      color: "from-blue-500 to-indigo-500",
      metrics: {
        compliance: "87%",
        response: "92%",
        feature: "Multi-channel delivery",
      },
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAgent((prev) => (prev + 1) % agents.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const activeAgentData = agents[activeAgent];
  const Icon = activeAgentData.icon;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-8">
      <div className="text-center mb-8">
        <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 text-teal-700">
          <Sparkles className="w-4 h-4 mr-2" />
          AI Agent Technology
        </Badge>
        <DisplayHeading size="md" className="mb-3">
          Meet Your AI Colleagues
        </DisplayHeading>
        <Body className="text-gray-600 max-w-2xl mx-auto">
          Two specialized AI agents that work alongside you to eliminate
          documentation burden and enhance client communication.
        </Body>
      </div>

      {/* Agent Showcase */}
      <div className="relative h-80 mb-8 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 overflow-hidden">
        {/* Background gradient specific to active agent */}
        <motion.div
          key={activeAgent}
          className="absolute inset-0 opacity-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 1 }}
        >
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br",
              activeAgentData.color
            )}
          />
        </motion.div>

        {/* Central Agent Display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            key={activeAgent}
            className="text-center"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          >
            {/* Agent Icon */}
            <div
              className={cn(
                "w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg mb-6 mx-auto",
                `bg-gradient-to-r ${activeAgentData.color}`
              )}
            >
              <Icon className="h-10 w-10 text-white" />
            </div>

            {/* Agent Info */}
            <Typography variant="h3" className="text-gray-900 mb-2">
              {activeAgentData.name}
            </Typography>
            <Body className="text-gray-600 max-w-md mx-auto mb-6">
              {activeAgentData.description}
            </Body>

            {/* Agent Metrics */}
            <div className="flex items-center justify-center gap-6">
              {Object.entries(activeAgentData.metrics).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div className="font-bold text-lg text-gray-900">{value}</div>
                  <Typography
                    variant="caption"
                    className="text-gray-500 capitalize"
                  >
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </Typography>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Agent Selector */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
          {agents.map((agent, index) => (
            <button
              key={agent.id}
              onClick={() => setActiveAgent(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                activeAgent === index
                  ? `bg-gradient-to-r ${agent.color}`
                  : "bg-gray-300 hover:bg-gray-400"
              )}
            />
          ))}
        </div>
      </div>

      {/* Quick Demo CTA */}
      <div className="text-center">
        <Button
          size="lg"
          className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Play className="w-4 h-4 mr-2" />
          See Agents in Action
        </Button>
      </div>
    </div>
  );
}

// Simplified Live Metrics Dashboard
function LiveMetricsDashboard() {
  const [metrics, setMetrics] = useState({
    accuracy: 99.1,
    timeSaved: 3.2,
    compliance: 87.4,
    practices: 523,
    satisfaction: 98.7,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        accuracy: Math.min(99.9, prev.accuracy + (Math.random() - 0.5) * 0.1),
        timeSaved: Math.max(
          2.8,
          Math.min(3.8, prev.timeSaved + (Math.random() - 0.5) * 0.1)
        ),
        compliance: Math.max(
          85,
          Math.min(95, prev.compliance + (Math.random() - 0.5) * 0.5)
        ),
        practices: prev.practices + Math.floor(Math.random() * 2),
        satisfaction: Math.min(
          99.9,
          prev.satisfaction + (Math.random() - 0.5) * 0.1
        ),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const metricCards = [
    {
      title: "AI Accuracy",
      value: `${metrics.accuracy.toFixed(1)}%`,
      icon: BrainCircuit,
      color: "from-teal-500 to-emerald-600",
      description: "Veterinary transcription",
    },
    {
      title: "Time Saved Daily",
      value: `${metrics.timeSaved.toFixed(1)}h`,
      icon: Clock,
      color: "from-emerald-500 to-teal-600",
      description: "Per practice average",
    },
    {
      title: "Client Compliance",
      value: `${metrics.compliance.toFixed(0)}%`,
      icon: MessageCircle,
      color: "from-blue-500 to-indigo-600",
      description: "Follow discharge instructions",
    },
    {
      title: "Active Practices",
      value: metrics.practices.toLocaleString(),
      icon: Users,
      color: "from-indigo-500 to-blue-600",
      description: "Trusted nationwide",
    },
    {
      title: "User Satisfaction",
      value: `${metrics.satisfaction.toFixed(1)}%`,
      icon: Heart,
      color: "from-pink-500 to-purple-600",
      description: "Veterinarian rated",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {metricCards.map((metric, index) => {
        const Icon = metric.icon;

        return (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -2 }}
          >
            <Card className="relative overflow-hidden bg-white/90 backdrop-blur-sm border hover:border-teal-200 transition-all duration-300">
              {/* Subtle background gradient */}
              <div
                className={cn(
                  "absolute inset-0 opacity-5",
                  `bg-gradient-to-br ${metric.color}`
                )}
              />

              <CardContent className="p-4 relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      `bg-gradient-to-r ${metric.color}`
                    )}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>

                  <Badge
                    variant="outline"
                    className="text-xs bg-green-50 text-green-700 border-green-200"
                  >
                    <Activity className="h-3 w-3 mr-1" />
                    Live
                  </Badge>
                </div>

                <motion.div
                  key={metric.value}
                  initial={{ scale: 1.1, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-2xl font-bold text-gray-900 mb-1"
                >
                  {metric.value}
                </motion.div>

                <Typography
                  variant="body-sm"
                  className="text-gray-600 mb-1 font-medium"
                >
                  {metric.title}
                </Typography>

                <Typography variant="caption" className="text-gray-500">
                  {metric.description}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

// Main AI Capabilities Overview Component
export function AICapabilitiesOverview() {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="py-24 bg-gradient-to-b from-white via-gray-50/30 to-white"
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge className="mb-6 px-6 py-3 bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 text-teal-700 font-semibold">
              <Sparkles className="h-4 w-4 mr-2" />
              Revolutionary AI Technology
            </Badge>

            <DisplayHeading size="xl" className="mb-6">
              Transform Your Practice with{" "}
              <GradientText>Intelligent AI Agents</GradientText>
            </DisplayHeading>

            <Body
              size="xl"
              className="text-gray-600 max-w-4xl mx-auto leading-relaxed"
            >
              Meet your new AI colleagues that eliminate documentation burden
              and enhance patient engagement. Working together to give you more
              time with patients and less time with paperwork.
            </Body>
          </div>

          {/* Live Metrics Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16"
          >
            <LiveMetricsDashboard />
          </motion.div>

          {/* AI Agents Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-16"
          >
            <AIAgentsOverview />
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center"
          >
            <Card className="bg-gradient-to-r from-teal-600 via-blue-600 to-teal-600 text-white border-0 max-w-4xl mx-auto relative overflow-hidden">
              {/* Animated background */}
              <div className="absolute inset-0">
                <motion.div
                  className="absolute w-32 h-32 bg-white/10 rounded-full blur-2xl"
                  animate={{
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                  }}
                  transition={{ duration: 8, repeat: Infinity }}
                />
              </div>

              <CardContent className="relative z-10 p-12 text-center">
                <DisplayHeading size="lg" className="text-white mb-4">
                  Ready to Work with AI Agents?
                </DisplayHeading>
                <Body size="lg" className="text-teal-100 mb-8">
                  Join 500+ practices already working alongside OdisAI's
                  specialized agents. Experience the future of veterinary
                  practice management.
                </Body>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                  <Button
                    size="lg"
                    className="bg-white text-teal-600 hover:bg-gray-50 font-semibold px-8 py-4 shadow-xl"
                  >
                    <BrainCircuit className="mr-2 h-5 w-5" />
                    Meet Your AI Agents
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-teal-600  font-semibold px-8 py-4"
                  >
                    Watch Live Demo
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-8 text-sm text-teal-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>99.1% accuracy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>HIPAA compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    <span>500+ practices</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
