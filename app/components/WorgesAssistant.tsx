"use client";

import { FormEvent, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type Message = { from:"bot"|"user"; text:string };

const initial:Message[] = [{ from:"bot", text:"Olá! Sou a assistente virtual da Worges. Posso explicar os pacotes, indicar a melhor opção e mostrar como funciona a publicação. O que você deseja publicar?" }];

const quickOptions = ["Um livro","Um capítulo","Um trabalho acadêmico","Ver preços","Falar com a produtora"];

function answerFor(message:string){
  const text=message.toLowerCase();
  if(/reembolso|cancel|estorno|desconto|urgente|prazo especial|direito autoral|problema.*pagamento/.test(text)) return {human:true,text:"Essa situação precisa de análise da produtora editorial. Posso registrar seu WhatsApp para que ela conheça o projeto e responda por mensagem."};
  if(/cap[ií]tulo|colet[aâ]nea/.test(text)) return {text:"Para capítulos, temos Publicação Simples por R$ 197,90 e Publicação com Revisão por R$ 239,90. O prazo é de até 8 dias úteis. Você escolhe a coletânea e envia o arquivo em Word. Os pacotes incluem certificado, carta de aceite, ISBN da coletânea, ficha do livro e conselho editorial."};
  if(/acad[eê]mic|tcc|disserta|tese|abnt/.test(text)) return {text:"O Combo Autor Acadêmico custa R$ 629,90 para obras de até 300 páginas. Inclui diagramação, normalização ABNT, revisão, DOI, ISBN, ficha catalográfica, QR Code, conselho editorial e arquivo Kindle."};
  if(/e-?book|digital/.test(text)) return {text:"O serviço de E-book custa R$ 329,90 até 150 páginas e R$ 349,90 até 300 páginas. Inclui diagramação digital, capa, ISBN digital, ficha catalográfica, QR Code, conselho editorial e PDF final."};
  if(/essencial/.test(text)) return {text:"O Autor Independente Essencial custa R$ 359,90 até 150 páginas, R$ 389,90 até 300 páginas e R$ 429,90 acima de 300. Inclui diagramação, duas propostas de capa, ISBN digital ou impresso, ficha catalográfica, QR Code, conselho editorial e PDF para impressão."};
  if(/completo|revis[aã]o|kindle|amazon/.test(text)) return {text:"O Autor Independente Completo custa R$ 559,90 até 150 páginas, R$ 589,90 até 300 páginas e R$ 629,90 acima de 300. Além do pacote Essencial, inclui revisão ortográfica e gramatical, arquivo Kindle e ajustes finais."};
  if(/pre[cç]o|valor|pacote/.test(text)) return {text:"Temos E-book, Autor Independente Essencial, Autor Independente Completo, Combo Autor Acadêmico e publicação de capítulos. Para indicar com precisão, diga se é livro ou capítulo, a quantidade aproximada de páginas e se precisa de revisão."};
  if(/whats|humano|produtora|atendente|contato/.test(text)) return {human:true,text:"Posso encaminhar seu projeto à produtora. O atendimento no WhatsApp é feito somente por mensagens; não realizamos ligações nem reuniões por vídeo."};
  if(/doi|download|url|link/.test(text)) return {text:"A página pública é gerada automaticamente. O DOI também é gerado quando estiver incluído no pacote. O arquivo completo só fica disponível para download quando o autor autoriza na contratação; sem autorização, aparece apenas o perfil da publicação."};
  if(/atendimento|acompanhar|plataforma|como funciona/.test(text)) return {text:"Após a contratação, você terá atendimento pelo espaço reservado da plataforma, WhatsApp e e-mail. Pela plataforma poderá acompanhar etapas, datas, arquivos, aprovações e mensagens do pedido. O WhatsApp é exclusivo para mensagens."};
  if(/livro/.test(text)) return {text:"Para indicar o melhor pacote de livro, preciso saber: quantas páginas aproximadamente ele possui, se o texto precisa de revisão e se você quer apenas e-book ou também arquivo para impressão."};
  return {text:"Posso ajudar com pacotes, valores, prazos, ISBN, DOI, capítulos, revisão e funcionamento da plataforma. Conte se é um livro ou capítulo, quantas páginas possui e do que você precisa. Se o projeto for especial, encaminho à produtora."};
}

export default function WorgesAssistant(){
  const pathname=usePathname();
  const [open,setOpen]=useState(true);
  const [messages,setMessages]=useState<Message[]>(initial);
  const [draft,setDraft]=useState("");
  const [handoff,setHandoff]=useState(false);
  const [sending,setSending]=useState(false);
  const [success,setSuccess]=useState(false);
  const [error,setError]=useState("");
  const shouldHide=pathname.startsWith("/admin");

  useEffect(()=>{
    const openAssistant=()=>setOpen(true);
    window.addEventListener("worges:open-assistant",openAssistant);
    return()=>window.removeEventListener("worges:open-assistant",openAssistant);
  },[]);

  if(shouldHide) return null;

  function send(text=draft){
    const value=text.trim(); if(!value)return;
    const reply=answerFor(value);
    setMessages(current=>[...current,{from:"user",text:value},{from:"bot",text:reply.text}]);
    setDraft("");
    if(reply.human)setHandoff(true);
  }

  async function submitLead(event:FormEvent<HTMLFormElement>){
    event.preventDefault(); setSending(true); setError("");
    const form=new FormData(event.currentTarget);
    const payload={name:form.get("name"),phone:form.get("phone"),email:form.get("email"),projectType:form.get("projectType"),packageInterest:form.get("packageInterest"),projectSummary:form.get("projectSummary"),preferredTime:form.get("preferredTime"),consent:form.get("consent")==="on"};
    try{const response=await fetch("/api/leads",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(payload)});const data=await response.json() as {error?:string};if(!response.ok)throw new Error(data.error||"Não foi possível enviar.");setSuccess(true)}catch(e){setError(e instanceof Error?e.message:"Não foi possível enviar.")}finally{setSending(false)}
  }

  return <div id="assistente-worges" className={`assistant-widget ${open?"open":""}`}>
    {open&&<section className="assistant-panel" aria-label="Assistente virtual Worges">
      <header><div><span>W</span><p><strong>Assistente Worges</strong><small>Online agora</small></p></div><button onClick={()=>setOpen(false)} aria-label="Fechar assistente">×</button></header>
      {!handoff?<><div className="assistant-messages" aria-live="polite">{messages.map((message,index)=><p key={index} className={message.from}>{message.text}</p>)}</div><div className="assistant-options">{quickOptions.map(option=><button key={option} onClick={()=>option==="Falar com a produtora"?setHandoff(true):send(option)}>{option}</button>)}</div><form className="assistant-compose" onSubmit={e=>{e.preventDefault();send()}}><input value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Digite sua dúvida..." aria-label="Mensagem para a assistente"/><button aria-label="Enviar mensagem">→</button></form><small className="assistant-disclaimer">Atendimento virtual. Não envie documentos ou dados bancários neste chat.</small></>:success?<div className="handoff-success"><span>✓</span><h3>Contato registrado</h3><p>A produtora editorial receberá o resumo e falará com você pelo WhatsApp informado, por mensagem.</p><button onClick={()=>{setHandoff(false);setSuccess(false)}}>Voltar à conversa</button></div>:<form className="handoff-form" onSubmit={submitLead}><button type="button" className="back" onClick={()=>setHandoff(false)}>← Voltar</button><h3>Falar com a produtora</h3><p>Deixe os dados essenciais do projeto. O contato será feito somente por mensagem.</p><label>Nome<input name="name" required maxLength={120}/></label><label>WhatsApp com DDD<input name="phone" required inputMode="tel" placeholder="(93) 99999-9999"/></label><label>E-mail, se desejar<input name="email" type="email"/></label><label>Projeto<select name="projectType" required defaultValue=""><option value="" disabled>Selecione</option><option>Livro</option><option>Capítulo</option><option>Trabalho acadêmico</option><option>Outro projeto editorial</option></select></label><label>Pacote de interesse<select name="packageInterest" defaultValue="Ainda não sei"><option>Ainda não sei</option><option>E-book</option><option>Autor Independente Essencial</option><option>Autor Independente Completo</option><option>Combo Autor Acadêmico</option><option>Publicação de capítulo</option></select></label><label>Conte brevemente sobre o projeto<textarea name="projectSummary" required maxLength={1000}/></label><label>Melhor período para mensagens<select name="preferredTime" defaultValue="Qualquer horário comercial"><option>Manhã</option><option>Tarde</option><option>Qualquer horário comercial</option></select></label><label className="consent"><input type="checkbox" name="consent" required/><span>Autorizo a Worges Editoração a usar este número exclusivamente para entrar em contato sobre meu projeto.</span></label>{error&&<p className="form-error">{error}</p>}<button className="send-lead" disabled={sending}>{sending?"Enviando...":"Solicitar contato por WhatsApp"}</button><small>Não realizamos ligações nem reuniões por vídeo.</small></form>}
    </section>}
    <button className="assistant-launcher" onClick={()=>setOpen(!open)} aria-label={open?"Fechar assistente":"Conversar com a assistente Worges"}><span>{open?"×":"W"}</span><b>{open?"Fechar":"Posso ajudar?"}</b></button>
  </div>
}
