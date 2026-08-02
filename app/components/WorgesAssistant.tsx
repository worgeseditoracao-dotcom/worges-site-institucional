"use client";

import { FormEvent, useState } from "react";
import { usePathname } from "next/navigation";

type CheckoutAction = { label: string; href: string };
type Message = { from: "bot" | "user"; text: string; action?: CheckoutAction };
type Reply = { text: string; action?: CheckoutAction; packages?: boolean; human?: boolean };

const packages = [
  { name: "E-book", price: "a partir de R$ 329,90", href: "/checkout?tipo=livro&pacote=E-book" },
  { name: "Autor Independente Essencial", price: "a partir de R$ 359,90", href: "/checkout?tipo=livro&pacote=Autor%20Independente%20Essencial" },
  { name: "Autor Independente Completo", price: "a partir de R$ 559,90", href: "/checkout?tipo=livro&pacote=Autor%20Independente%20Completo" },
  { name: "Autor Acadêmico", price: "R$ 629,90 até 300 páginas", href: "/checkout?tipo=livro&pacote=Autor%20Acad%C3%AAmico" },
  { name: "Capítulo — Publicação Simples", price: "R$ 197,90", href: "/checkout?tipo=capitulo&pacote=Publica%C3%A7%C3%A3o%20Simples" },
  { name: "Capítulo — Com Revisão", price: "R$ 239,90", href: "/checkout?tipo=capitulo&pacote=Publica%C3%A7%C3%A3o%20com%20Revis%C3%A3o" },
];

const initial: Message[] = [{
  from: "bot",
  text: "Olá! Sou a assistente editorial da Worges. Posso explicar os serviços, indicar o pacote mais adequado e encaminhar você ao checkout para concluir a contratação.",
}];

const quickOptions = ["Quero contratar", "Publicar um livro", "Publicar um capítulo", "Trabalho acadêmico", "Falar com a produtora"];

function answerFor(message: string): Reply {
  const text = message.toLowerCase();
  if (/reembolso|cancel|estorno|desconto|urgente|prazo especial|direito autoral|problema.*pagamento/.test(text)) {
    return { human: true, text: "Essa situação precisa de análise da produtora editorial. Posso registrar seu WhatsApp para que ela responda por mensagem." };
  }
  if (/cap[ií]tulo|colet[aâ]nea/.test(text)) {
    return { packages: true, text: "Para capítulos, você pode contratar a Publicação Simples por R$ 197,90 ou a Publicação com Revisão por R$ 239,90. O prazo é de até 8 dias úteis. Escolha uma opção abaixo para seguir ao checkout." };
  }
  if (/acad[eê]mic|tcc|disserta|tese|abnt/.test(text)) {
    return { text: "O Autor Acadêmico custa R$ 629,90 para obras de até 300 páginas e inclui diagramação, normalização ABNT, revisão, DOI, ISBN, ficha catalográfica, QR Code, conselho editorial e arquivo Kindle.", action: { label: "Contratar Autor Acadêmico", href: "/checkout?tipo=livro&pacote=Autor%20Acad%C3%AAmico" } };
  }
  if (/e-?book|digital/.test(text)) {
    return { text: "O E-book custa R$ 329,90 até 150 páginas e R$ 349,90 até 300 páginas. Inclui diagramação digital, capa, ISBN digital, ficha catalográfica, QR Code, conselho editorial e PDF final.", action: { label: "Contratar E-book", href: "/checkout?tipo=livro&pacote=E-book" } };
  }
  if (/essencial/.test(text)) {
    return { text: "O Autor Independente Essencial custa R$ 359,90 até 150 páginas, R$ 389,90 até 300 páginas e R$ 429,90 acima de 300.", action: { label: "Contratar pacote Essencial", href: "/checkout?tipo=livro&pacote=Autor%20Independente%20Essencial" } };
  }
  if (/completo|revis[aã]o|kindle|amazon/.test(text)) {
    return { text: "O Autor Independente Completo custa R$ 559,90 até 150 páginas, R$ 589,90 até 300 páginas e R$ 629,90 acima de 300. Inclui revisão, arquivo Kindle e ajustes finais.", action: { label: "Contratar pacote Completo", href: "/checkout?tipo=livro&pacote=Autor%20Independente%20Completo" } };
  }
  if (/pre[cç]o|valor|pacote|contratar|fechar/.test(text)) {
    return { packages: true, text: "Estes são os pacotes disponíveis. Você pode escolher um deles e seguir diretamente ao checkout seguro." };
  }
  if (/whats|humano|produtora|atendente|contato/.test(text)) {
    return { human: true, text: "Posso encaminhar seu projeto à produtora. O atendimento no WhatsApp é feito somente por mensagens; não realizamos ligações nem reuniões por vídeo." };
  }
  if (/doi|download|url|link/.test(text)) {
    return { text: "A página pública é gerada automaticamente. O DOI é gerado quando estiver incluído no pacote. O arquivo completo só fica disponível para download quando o autor autoriza na contratação." };
  }
  if (/atendimento|acompanhar|plataforma|como funciona/.test(text)) {
    return { text: "Após contratar, você acompanha etapas, datas, arquivos, aprovações e mensagens pela plataforma. Também terá atendimento por WhatsApp e e-mail." };
  }
  if (/livro/.test(text)) {
    return { packages: true, text: "Para recomendar com precisão, considere a quantidade de páginas, se precisa de revisão e se deseja somente e-book ou também arquivo para impressão. Você já pode comparar e contratar abaixo." };
  }
  return { text: "Posso ajudar com pacotes, valores, prazos, ISBN, DOI, capítulos, revisão e funcionamento da plataforma. Diga o tipo de projeto e a quantidade aproximada de páginas." };
}

export default function WorgesAssistant() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initial);
  const [draft, setDraft] = useState("");
  const [showPackages, setShowPackages] = useState(false);
  const [handoff, setHandoff] = useState(false);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (pathname.startsWith("/admin")) return null;

  function send(text = draft) {
    const value = text.trim();
    if (!value) return;
    const reply = answerFor(value);
    setMessages((current) => [...current, { from: "user", text: value }, { from: "bot", text: reply.text, action: reply.action }]);
    setDraft("");
    if (reply.packages) setShowPackages(true);
    if (reply.human) setHandoff(true);
  }

  function handleQuickOption(option: string) {
    if (option === "Falar com a produtora") {
      setHandoff(true);
      return;
    }
    send(option);
  }

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const payload = {
      name: form.get("name"), phone: form.get("phone"), email: form.get("email"),
      projectType: form.get("projectType"), packageInterest: form.get("packageInterest"),
      projectSummary: form.get("projectSummary"), preferredTime: form.get("preferredTime"),
      consent: form.get("consent") === "on",
    };
    try {
      const response = await fetch("/api/leads", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || "Não foi possível enviar.");
      setSuccess(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível enviar.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className={`assistant-widget ${open ? "open" : ""}`}>
      {!open && <div className="assistant-float-label"><b>Assistente editorial</b><small>Pacotes, dúvidas e contratação</small></div>}
      {open && <section className="assistant-panel" aria-label="Assistente editorial Worges">
        <header><div><span>W</span><p><strong>Assistente editorial</strong><small>Online • pode encaminhar ao checkout</small></p></div><button onClick={() => setOpen(false)} aria-label="Fechar assistente">×</button></header>
        {!handoff ? <>
          <div className="assistant-messages" aria-live="polite">
            {messages.map((message, index) => <div key={index} className={`assistant-message ${message.from}`}><p>{message.text}</p>{message.action && <a href={message.action.href}>{message.action.label} →</a>}</div>)}
            {showPackages && <div className="assistant-package-list">
              <div className="assistant-package-title"><strong>Escolha seu pacote</strong><button onClick={() => setShowPackages(false)}>Ocultar</button></div>
              {packages.map((item) => <article key={item.name}><div><strong>{item.name}</strong><small>{item.price}</small></div><a href={item.href}>Contratar</a></article>)}
              <a className="compare-packages" href="/publicacao">Ver comparação completa →</a>
            </div>}
          </div>
          <div className="assistant-options">{quickOptions.map((option) => <button key={option} onClick={() => handleQuickOption(option)}>{option}</button>)}</div>
          <form className="assistant-compose" onSubmit={(event) => { event.preventDefault(); send(); }}><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Digite sua dúvida..." aria-label="Mensagem para a assistente"/><button aria-label="Enviar mensagem">→</button></form>
          <small className="assistant-disclaimer">Você pode consultar, escolher e contratar um pacote pelo checkout. Não envie documentos ou dados bancários neste chat.</small>
        </> : success ? <div className="handoff-success"><span>✓</span><h3>Contato registrado</h3><p>A produtora editorial receberá o resumo e falará com você pelo WhatsApp informado, por mensagem.</p><button onClick={() => { setHandoff(false); setSuccess(false); }}>Voltar à conversa</button></div> :
          <form className="handoff-form" onSubmit={submitLead}><button type="button" className="back" onClick={() => setHandoff(false)}>← Voltar</button><h3>Falar com a produtora</h3><p>Deixe os dados essenciais do projeto. O contato será feito somente por mensagem.</p><label>Nome<input name="name" required maxLength={120}/></label><label>WhatsApp com DDD<input name="phone" required inputMode="tel" placeholder="(93) 99999-9999"/></label><label>E-mail, se desejar<input name="email" type="email"/></label><label>Projeto<select name="projectType" required defaultValue=""><option value="" disabled>Selecione</option><option>Livro</option><option>Capítulo</option><option>Trabalho acadêmico</option><option>Outro projeto editorial</option></select></label><label>Pacote de interesse<select name="packageInterest" defaultValue="Ainda não sei"><option>Ainda não sei</option><option>E-book</option><option>Autor Independente Essencial</option><option>Autor Independente Completo</option><option>Autor Acadêmico</option><option>Publicação de capítulo</option></select></label><label>Conte brevemente sobre o projeto<textarea name="projectSummary" required maxLength={1000}/></label><label>Melhor período para mensagens<select name="preferredTime" defaultValue="Qualquer horário comercial"><option>Manhã</option><option>Tarde</option><option>Qualquer horário comercial</option></select></label><label className="consent"><input type="checkbox" name="consent" required/><span>Autorizo a Worges Editoração a usar este número exclusivamente para entrar em contato sobre meu projeto.</span></label>{error && <p className="form-error">{error}</p>}<button className="send-lead" disabled={sending}>{sending ? "Enviando..." : "Solicitar contato por WhatsApp"}</button><small>Não realizamos ligações nem reuniões por vídeo.</small></form>}
      </section>}
      <button className="assistant-launcher" onClick={() => setOpen(!open)} aria-label={open ? "Fechar assistente" : "Conversar com a assistente editorial"}><span>{open ? "×" : "W"}</span><b>{open ? "Fechar" : "Conversar agora"}</b></button>
    </div>
  );
}
