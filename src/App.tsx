import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'motion/react';
import { Instagram, Mail, ArrowUp } from 'lucide-react';

const jM = [
  {
    id: 2,
    image: "/assets/capa contratar conteudo.png",
    url: "https://api.whatsapp.com/send?phone=5511914337611&text=Oii%2C%20quero%20contratar%20conte%C3%BAdo!",
    title: "Contratar Conteúdo"
  }
];

function HM() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#28140d] text-[#f5ebd6] font-neue selection:bg-white/10">
      <main className="relative max-w-2xl mx-auto px-6 py-16 flex flex-col items-center">
        {/* Header Image section (Scaled 50% larger than container) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full sm:w-[115%] sm:-mx-[7.5%] md:w-[150%] md:-mx-[25%] mb-4 select-none"
        >
          <img
            src="/assets/cabecalho digital.png"
            alt="Seja bem-vinda (o)"
            className="w-full h-auto"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Dynamic Buttons List */}
        <div className="w-full space-y-6">
          {jM.map((item, index) => (
            <motion.a
              key={item.id}
              href={item.url}
              target={item.url.startsWith("mailto") ? "_self" : "_blank"}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="block group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] transition-all duration-300 shadow-xl shadow-black/20"
            >
              <div className="aspect-[897/282] w-full">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover opacity-100 group-hover:opacity-90 transition-opacity"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#28140d]/40 to-transparent pointer-events-none" />
            </motion.a>
          ))}
        </div>

        {/* Footer info and returning buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 flex flex-col items-center space-y-8 w-full"
        >
          {/* Social Platforms Links */}
          <div className="flex space-x-6">
            <a
              href="https://www.instagram.com/digitalflly/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={20} className="text-[#f5ebd6]/90" />
            </a>
            <a
              href="mailto:atendimento@digitalflly.com"
              className="p-3 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] transition-colors"
              aria-label="E-mail"
            >
              <Mail size={20} className="text-[#f5ebd6]/90" />
            </a>
          </div>

          {/* Scoll to Top controls */}
          <button
            onClick={scrollToTop}
            className="flex items-center space-x-2 text-[#f5ebd6]/40 hover:text-[#f5ebd6] transition-colors text-xs uppercase tracking-widest cursor-pointer"
          >
            <ArrowUp size={16} />
            <span>Voltar ao topo</span>
          </button>

          {/* Legal and branding footer */}
          <footer className="text-center space-y-2 pt-8 border-t border-white/[0.05] w-full">
            <p className="text-[#f5ebd6]/30 text-[10px] uppercase tracking-widest">
              Todos os direitos reservados • Política de Privacidade
            </p>
            <p className="text-[#f5ebd6]/20 text-[10px] uppercase tracking-widest">
              Site feito com carinho por{" "}
              <span className="text-[#f5ebd6]/40">@digitalflly</span>
            </p>
          </footer>
        </motion.div>
      </main>
    </div>
  );
}

function YM() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#28140d] text-[#f5ebd6]">
      <h1 className="text-2xl font-sans">Página de Contato - Em breve</h1>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HM />} />
        <Route path="/contato" element={<YM />} />
      </Routes>
    </Router>
  );
}
