<<<<<<< HEAD
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  ChevronLeft, 
  Award, 
  BookOpen, 
  Sparkles, 
  RefreshCw, 
  Layers, 
  Zap, 
  CheckCircle2, 
  ArrowUpRight 
} from "lucide-react";

// ── Cores da Paleta
const INK = "#172219";
const CREAM = "#fffdf7";

// ── Tipos do Quiz
interface Option {
  t: string;
  p: number;
}

interface Question {
  q: string;
  options: Option[];
}

interface Result {
  min: number;
  max: number;
  title: string;
  body: string;
  badge: string;
}

const QUESTIONS: Question[] = [
  {
    q: "Qual dessas frases mais define o momento do seu produto hoje?",
    options: [
      { t: "Já lancei, vendi bem, mas depois estagnei", p: 3 },
      { t: "Tenho vendas constantes, mas sem estratégia definida", p: 4 },
      { t: "Ainda vendo só quando apareço muito", p: 2 },
      { t: "Criei o produto, mas não sei como começar a vender", p: 1 },
    ],
  },
  {
    q: "Você sabe exatamente o caminho que sua cliente percorre até comprar de você?",
    options: [
      { t: "Mais ou menos, sei o perfil, mas não tenho mapeado", p: 3 },
      { t: "Não, só me procuram quando abro vagas", p: 2 },
      { t: "Sim, mas não tenho isso documentado ou automatizado", p: 4 },
      { t: "Nem sei como a maioria chega até mim", p: 1 },
    ],
  },
  {
    q: "Seu conteúdo atual prepara sua audiência para sua oferta?",
    options: [
      { t: "Acho que sim, mas não tenho certeza", p: 3 },
      { t: "Não, eu posto o que acho interessante no momento", p: 1 },
      { t: "Só no período que eu tô vendendo", p: 2 },
      { t: "Nunca pensei nisso assim", p: 0 },
    ],
  },
  {
    q: "Você analisa os dados das suas ações pra ajustar suas vendas?",
    options: [
      { t: "Não, olho só engajamento", p: 1 },
      { t: "Vejo quando tenho tempo", p: 2 },
      { t: "Tento, mas não sei como interpretar", p: 3 },
      { t: "Nunca acompanho nada", p: 0 },
    ],
  },
  {
    q: "Você consegue vender esse produto mais de uma vez sem precisar começar tudo do zero?",
    options: [
      { t: "Nunca tentei", p: 1 },
      { t: "Só com muito esforço", p: 2 },
      { t: "Preciso reformular toda a comunicação a cada vez", p: 3 },
      { t: "Consigo, mas não tenho fluxo constante", p: 4 },
    ],
  },
  {
    q: "O que você espera alcançar ao escalar seu produto?",
    options: [
      { t: "Vender mais e poder estruturar outros produtos e minha mentoria", p: 4 },
      { t: "Aumentar o faturamento, mesmo que eu trabalhe mais por agora", p: 3 },
      { t: "Ser mais reconhecida e influente no meu nicho", p: 2 },
      { t: "Só quero sair do zero de novo, estou perdida", p: 1 },
    ],
  },
  {
    q: "Hoje, quem te ajuda na parte estratégica do seu negócio?",
    options: [
      { t: "Tenho alguém que executa, mas a estratégia sou eu", p: 3 },
      { t: "Faço tudo sozinha, inclusive pensar e executar", p: 1 },
      { t: "Tenho apoio de uma consultora ou equipe estratégica", p: 4 },
      { t: "Já tentei ter ajuda, mas não deu certo ou parei", p: 2 },
    ],
  },
];

const RESULTS: Result[] = [
  {
    min: 0,
    max: 11,
    title: "Seu produto ainda não está pronto",
    body: "Seu negócio está num momento de estruturação de base. Antes de focar em escalar, o caminho ideal é dar sustentação ao essencial — refinando o produto, alinhando a comunicação e mapeando como sua audiência chega até você. Construir a fundação correta agora poupará grandes retrabalhos e gargalos no futuro.",
    badge: "Fase de Fundação"
  },
  {
    min: 12,
    max: 20,
    title: "Você tem potencial, mas ainda está se estruturando",
    body: "Você já superou o obstáculo que a maioria enfrenta: criar um produto que realmente funciona. Agora, o desafio é implementar a estrutura que transforma a inovação em previsibilidade. No momento, suas vendas ocorrem em picos e demandam esforço intenso. Este é o ponto perfeito para automatizar processos e delegar tarefas operacionais.",
    badge: "Fase de Consolidação"
  },
  {
    min: 21,
    max: 28,
    title: "Seu produto está pronto para escalar",
    body: "Seu produto está totalmente validado e pronto para alcançar múltiplos canais e públicos. Ironicamente, este é o momento onde muitas empreendedoras travam por falta de processos consistentes. Sem uma engrenagem sólida de tráfego, nutrição e conversão, o crescimento se torna insustentável. Falta apenas estruturar e executar a tração estratégica.",
    badge: "Fase de Escala Ativa"
  },
];

export default function App() {
  const [screen, setScreen] = useState<"intro" | "registration" | "number" | "result">("intro");
  const [nome, setNome] = useState<string>("");
  const [whatsapp, setWhatsapp] = useState<string>("");
  const [instagram, setInstagram] = useState<string>("");
  const [step, setStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Array<number | null>>(Array(QUESTIONS.length).fill(null));
  const [justSelected, setJustSelected] = useState<number | null>(null);
  const [hasDownloaded, setHasDownloaded] = useState<boolean>(false);
  const [syncingSheets, setSyncingSheets] = useState<boolean>(false);

  const score = answers.reduce((s: number, a) => s + (a ?? 0), 0);
  const result = RESULTS.find((r) => score >= r.min && score <= r.max) || RESULTS[1];

  // Função para enviar os dados diretamente para a planilha do usuário (Google Sheets Web App)
  const sendLead = async (currentAnswers: Array<number | null> = answers) => {
    const webappUrl = (import.meta as any).env.VITE_SHEETS_WEBAPP_URL;
    if (!webappUrl) {
      console.warn("VITE_SHEETS_WEBAPP_URL não configurado nas variáveis de ambiente (.env).");
      return;
    }

    setSyncingSheets(true);
    try {
      // Mapeia cada resposta do questionário com o texto selecionado correspondente
      const respostasTexto = QUESTIONS.map((q, idx) => {
        const pValue = currentAnswers[idx];
        if (pValue === null) return "Não respondido";
        const opt = q.options.find((o) => o.p === pValue);
        return opt ? opt.t : "Não encontrado";
      });

      const currentScore = currentAnswers.reduce((s: number, a) => s + (a ?? 0), 0);
      const currentResult = RESULTS.find((r) => currentScore >= r.min && currentScore <= r.max) || RESULTS[1];

      const params: Record<string, string> = {
        "data": new Date().toLocaleString("pt-BR"),
        "nome do lead": nome,
        "whatsapp do lead": whatsapp,
        "instagram do lead": instagram,
        "pergunta 1": respostasTexto[0] || "Não respondido",
        "pergunta 2": respostasTexto[1] || "Não respondido",
        "pergunta 3": respostasTexto[2] || "Não respondido",
        "pergunta 4": respostasTexto[3] || "Não respondido",
        "pergunta 5": respostasTexto[4] || "Não respondido",
        "pergunta 6": respostasTexto[5] || "Não respondido",
        "pergunta 7": respostasTexto[6] || "Não respondido",
        "pontuação": String(currentScore),

        // Redundâncias para garantir cobertura máxima no script do usuário (chaves sem espaços etc)
        "nome": nome,
        "whatsapp": whatsapp,
        "instagram": instagram,
        "score": String(currentScore),
        "pontuacao": String(currentScore),
        "resultado": currentResult.title,
        "badge": currentResult.badge
      };

      // Gerador de query string para enriquecer o URL e apoiar e.parameter em no-cors
      const queryString = new URLSearchParams(params).toString();
      const urlWithParams = `${webappUrl}${webappUrl.includes("?") ? "&" : "?"}${queryString}`;

      console.log("Sincronizando lead de:", nome);

      // Enviamos por POST com as duas abordagens concomitantes:
      // 1. URL com parâmetros da Query (excelente para e.parameter do Google Apps Script)
      // 2. POST Body com JSON texto plano (para ler em e.postData.contents sem disparar preflight CORS)
      await fetch(urlWithParams, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain"
        },
        body: JSON.stringify(params)
      });

      console.log("Dados sincronizados com sucesso no Google Sheets!");
    } catch (err) {
      console.error("Erro ao sincronizar com Google Sheets:", err);
    } finally {
      setSyncingSheets(false);
    }
  };

  const pick = (p: number) => {
    setJustSelected(p);
    const next = [...answers];
    next[step] = p;
    setAnswers(next);

    setTimeout(() => {
      setJustSelected(null);
      if (step < QUESTIONS.length - 1) {
        setStep(step + 1);
      } else {
        setScreen("result");
        // Envia as perguntas preenchidas de forma assíncrona assim que terminar o quiz
        sendLead(next);
      }
    }, 280);
  };

  const goBack = () => {
    if (step === 0) {
      setScreen("registration");
    } else {
      setStep(step - 1);
    }
  };

  const restart = () => {
    setAnswers(Array(QUESTIONS.length).fill(null));
    setStep(0);
    setNome("");
    setWhatsapp("");
    setInstagram("");
    setScreen("intro");
    setHasDownloaded(false);
  };

  const handleDownload = () => {
    setHasDownloaded(true);
    const downloadUrl = (import.meta as any).env.VITE_DOWNLOAD_MATERIAL_URL || "https://docs.google.com/document/d/1yyvrj8A9y5vHLxurUYDZiSKoccg4TbMtfQkgxsp2LO0/edit?usp=sharing";
    window.open(downloadUrl, "_blank", "noopener,noreferrer");
  };

  const letters = ["A", "B", "C", "D"];

  return (
    <div className="min-h-screen flex flex-col justify-center p-6 sm:p-12 relative overflow-hidden" style={{ backgroundColor: CREAM, color: INK }}>
      {/* Detalhes estéticos no background - Minimalistas */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ backgroundColor: INK }}></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none" style={{ backgroundColor: INK }}></div>

      {/* Container Principal */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-2xl w-full mx-auto relative z-10 py-10">
        <AnimatePresence mode="wait">
          
          {/* TELA DE INTRO */}
          {screen === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full text-center sm:text-left"
              id="intro_screen"
            >
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.08] mb-6">
                Seja bem-vinda ao quiz!
              </h1>
              
              <p className="text-base sm:text-lg lg:text-xl leading-relaxed opacity-80 font-sans mb-6">
                Escalar é o sonho de toda infoprodutora ou mentora. Muitas tentam sozinhas e esbarram na
                dificuldade de tornar essa escala real. Em 7 perguntas, este quiz revela em que ponto o seu
                negócio está — e o que falta para crescer com estrutura.
              </p>
              
              <p className="text-xs sm:text-sm leading-relaxed opacity-50 mb-10 font-mono">
                Responda honestamente de acordo com o seu momento atual, sem pensar de mais. Tempo estimado: 2 minutos.
              </p>
              
              <div className="flex justify-center sm:justify-start">
                <button
                  id="btn_start_quiz"
                  onClick={() => setScreen("registration")}
                  className="group relative flex items-center gap-3 px-8 py-4 sm:px-10 sm:py-5 rounded-full text-base font-medium tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] outline-none cursor-pointer"
                  style={{ backgroundColor: INK, color: CREAM }}
                >
                  <span>Começar diagnóstico</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>
          )}

          {/* TELA DE CADASTRO */}
          {screen === "registration" && (
            <motion.div
              key="registration"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full text-left"
              id="registration_screen"
            >
              <button
                id="btn_back_to_intro"
                onClick={() => setScreen("intro")}
                className="flex items-center gap-1.5 font-mono text-xs tracking-wider uppercase opacity-60 hover:opacity-100 transition-opacity duration-200 py-2 mb-6 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight leading-snug mb-3">
                Queremos te conhecer melhor
              </h2>
              
              <p className="text-base leading-relaxed opacity-70 font-sans mb-8">
                Antes de iniciar o diagnóstico personalizado do seu produto, preencha seus dados de contato abaixo.
              </p>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (nome.trim() && whatsapp.trim() && instagram.trim()) {
                    setScreen("number");
                  }
                }}
                className="space-y-5"
              >
                <div>
                  <label htmlFor="reg_nome" className="block text-xs font-semibold uppercase tracking-wider opacity-65 mb-2 font-mono">
                    Nome Completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    id="reg_nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full bg-transparent border rounded-xl py-3.5 px-4 text-base focus:outline-none focus:border-opacity-100 transition-colors duration-300 font-sans"
                    style={{ borderColor: `${INK}30` }}
                  />
                </div>

                <div>
                  <label htmlFor="reg_whatsapp" className="block text-xs font-semibold uppercase tracking-wider opacity-65 mb-2 font-mono">
                    WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="tel"
                    id="reg_whatsapp"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full bg-transparent border rounded-xl py-3.5 px-4 text-base focus:outline-none focus:border-opacity-100 transition-colors duration-300 font-sans"
                    style={{ borderColor: `${INK}30` }}
                  />
                </div>

                <div>
                  <label htmlFor="reg_instagram" className="block text-xs font-semibold uppercase tracking-wider opacity-65 mb-2 font-mono">
                    Instagram <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-55 font-mono text-base">@</span>
                    <input
                      required
                      type="text"
                      id="reg_instagram"
                      value={instagram}
                      onChange={(e) => {
                        const val = e.target.value;
                        setInstagram(val.startsWith("@") ? val.substring(1) : val);
                      }}
                      placeholder="seu.perfil"
                      className="w-full bg-transparent border rounded-xl py-3.5 pl-9 pr-4 text-base focus:outline-none focus:border-opacity-100 transition-colors duration-300 font-sans"
                      style={{ borderColor: `${INK}30` }}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="group relative flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 sm:px-10 rounded-full text-base font-medium tracking-wide transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] outline-none cursor-pointer"
                    style={{ backgroundColor: INK, color: CREAM }}
                  >
                    <span>Iniciar Quiz</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* TELA DAS PERGUNTAS */}
          {screen === "number" && (
            <motion.div
              key={`question-${step}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
              id={`question_screen_${step}`}
            >
              {/* Barra de Progresso e Botão Voltar */}
              <div className="flex items-center justify-between mb-4">
                <button
                  id="btn_prev_question"
                  onClick={goBack}
                  className="flex items-center gap-1.5 font-mono text-xs tracking-wider uppercase opacity-60 hover:opacity-100 transition-opacity duration-200 py-2 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Voltar</span>
                </button>
                <span className="font-mono text-xs tracking-widest opacity-60">
                  {String(step + 1).padStart(2, "0")} / {String(QUESTIONS.length).padStart(2, "0")}
                </span>
              </div>

              {/* Linha de progresso estilizada */}
              <div className="h-[2px] w-full rounded-full mb-10 overflow-hidden" style={{ backgroundColor: `${INK}15` }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: INK }}
                  initial={{ width: `${(step / QUESTIONS.length) * 100}%` }}
                  animate={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                />
              </div>

              {/* Título da Pergunta */}
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight leading-snug mb-8">
                {QUESTIONS[step].q}
              </h2>

              {/* Alternativas */}
              <div className="flex flex-col gap-3.5">
                {QUESTIONS[step].options.map((o, i) => {
                  const isSelected = answers[step] === o.p;
                  const isJustSelected = justSelected === o.p;
                  
                  return (
                    <button
                      id={`opt_btn_${i}`}
                      key={i}
                      disabled={justSelected !== null}
                      onClick={() => pick(o.p)}
                      className={`group flex items-start gap-5 text-left w-full border rounded-2xl p-4 sm:p-5 text-sm sm:text-base leading-relaxed transition-all duration-300 outline-none cursor-pointer ${
                        isSelected 
                          ? "shadow-sm scale-[1.005]" 
                          : "hover:bg-opacity-5"
                      }`}
                      style={{
                        backgroundColor: isSelected ? INK : "transparent",
                        color: isSelected ? CREAM : INK,
                        borderColor: isSelected ? INK : `${INK}25`,
                        transform: isJustSelected ? "scale(0.99)" : ""
                      }}
                    >
                      <span 
                        className="flex-shrink-0 w-7 h-7 rounded-lg border flex items-center justify-center font-mono text-xs font-semibold tracking-wider transition-all duration-300"
                        style={{
                          borderColor: isSelected ? CREAM : `${INK}30`,
                          backgroundColor: isSelected ? `${CREAM}15` : "transparent",
                          color: isSelected ? CREAM : INK,
                        }}
                      >
                        {letters[i]}
                      </span>
                      <span className="flex-1 pt-0.5">{o.t}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* TELA DE RESULTADOS } */}
          {screen === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
              id="result_screen"
            >
              {/* Badge da Faixa */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[11px] uppercase tracking-wider border" style={{ borderColor: `${INK}30`, backgroundColor: `${INK}05` }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-pulse"></span>
                  <span>{result.badge}</span>
                </div>
                <div className="font-mono text-xs opacity-60">
                  Pontuação: <span className="font-bold">{score}</span> / 26
                </div>
              </div>

              {/* Título do Resultado */}
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight leading-tight mb-6">
                {result.title}
              </h1>

              {/* Descrição em formato editorial */}
              <p className="text-base sm:text-lg leading-relaxed opacity-80 mb-10">
                {result.body}
              </p>

              {/* CTAs de Ação */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-t pt-8" style={{ borderColor: `${INK}15` }}>
                {!hasDownloaded ? (
                  <button
                    id="btn_request_material"
                    onClick={handleDownload}
                    className="group flex items-center justify-center gap-2.5 w-full sm:w-auto px-7 py-4 rounded-full text-sm font-medium tracking-wide transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                    style={{ backgroundColor: INK, color: CREAM }}
                  >
                    <span>Quero meu material!</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                ) : (
                  <a
                    href="https://api.whatsapp.com/send?phone=5511914337611&text=Oii%2C%20quero%20implementar%20um%20funil%20para%20escalar%20minha%20mentoria!"
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-center gap-2.5 w-full sm:w-auto px-7 py-4 rounded-full text-sm font-medium tracking-wide transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-md text-white text-center"
                    style={{ color: "#fff", backgroundColor: "#064e3b" }}
                  >
                    <span>Chamar no WhatsApp</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                )}

                <button
                  id="btn_restart_quiz"
                  onClick={restart}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-mono uppercase tracking-widest opacity-60 hover:opacity-100 border border-transparent hover:border-gray-300 transition-all duration-300 w-full sm:w-auto cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refazer teste</span>
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
=======
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
>>>>>>> b4a3343a206ffe6eae31a4f0c2d1198573fa57b9
      </main>
    </div>
  );
}

<<<<<<< HEAD
=======
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
>>>>>>> b4a3343a206ffe6eae31a4f0c2d1198573fa57b9
