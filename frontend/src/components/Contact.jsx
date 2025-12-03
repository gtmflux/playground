import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, Mail, Linkedin, Twitter, Github } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

const Contact = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section id="contact" className="py-32 bg-zinc-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10" />
      
      {/* Orange glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px]" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-4">
            Get in Touch
          </span>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Let's Build Together
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Ready to automate your GTM? Book a call to discuss your project
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="bg-zinc-900/50 border-zinc-800 p-8 md:p-12 backdrop-blur-sm">
            {/* Calendly Embed Placeholder */}
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 rounded-lg p-12 border border-zinc-700/50 text-center">
                <Calendar className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Schedule a Call</h3>
                <p className="text-zinc-400 mb-6">Calendly integration will be embedded here</p>
                <Button
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg font-medium rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(249,115,22,0.4)]"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Book 30-min Call
                </Button>
              </div>

              {/* Contact Options */}
              <div className="grid md:grid-cols-2 gap-4">
                <a
                  href="mailto:vinay@example.com"
                  className="flex items-center gap-3 p-4 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 hover:border-orange-500/50 rounded-lg transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                    <Mail className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <div className="text-sm text-zinc-500">Email</div>
                    <div className="text-white font-medium">vinay@example.com</div>
                  </div>
                </a>

                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 hover:border-orange-500/50 rounded-lg transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                    <Linkedin className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <div className="text-sm text-zinc-500">LinkedIn</div>
                    <div className="text-white font-medium">Connect on LinkedIn</div>
                  </div>
                </a>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
