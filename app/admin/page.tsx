"use client";
/* eslint-disable @next/next/no-html-link-for-pages */

import { useState } from "react";

const orders = [
  { id:"WG-0264", client:"Mariah Gabi", title:"A coragem de pedir ajuda", service:"Pacote Plus", stage:"Revisão", date:"18 ago", value:"R$ 579,90" },
  { id:"WG-0263", client:"Bruno Fernandes", title:"Test drive", service:"Pacote Plus", stage:"Diagramação", date:"14 ago", value:"R$ 559,90" },
  { id:"WG-0262", client:"Clarissa Lima", title:"Gestão e Qualidade", service:"Pacote Completo", stage:"Aprovação", date:"09 ago", value:"R$ 329,90" },
  { id:"WG-0261", client:"Leonardo Lemos", title:"Reflexões sobre ESG", service:"E-book + DOI", stage:"Finalização", date:"05 ago", value:"R$ 389,90" },
];

export default function AdminPage(){
  const [tab,setTab]=useState("Visão geral");
  const [query,setQuery]=useState("");
  const [notice,setNotice]=useState("");
  const filtered=orders.filter(o=>`${o.client} ${o.title} ${o.id}`.toLowerCase().includes(query.toLowerCase()));
  const nav=["Visão geral","Pedidos","Calendário editorial","Clientes","Arquivos e aprovações","Conversas","Serviços e preços","Obras publicadas","Cursos e produtos","Financeiro e reembolsos"];
  function action(message:string){setNotice(message);setTimeout(()=>setNotice(""),2600)}
  return <main className="portal admin-layout">
    <aside className="sidebar"><a className="brand" href="/"><strong>WORGES</strong><span>ADMINISTRAÇÃO</span></a><nav>{nav.map(item=><button key={item} className={tab===item?"active":""} onClick={()=>setTab(item)}><i>◇</i>{item}</button>)}</nav><div className="sidebar-user"><span>PR</span><div><strong>Pryscila Borges</strong><small>Administradora</small></div></div></aside>
    <section className="portal-main">
      <header className="portal-top"><div><p className="eyebrow">PAINEL ADMINISTRATIVO</p><h1>{tab}</h1></div><div className="top-actions"><label>⌕ <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar pedido ou cliente"/></label><button onClick={()=>action("Novo pedido iniciado")}>＋ Novo pedido</button></div></header>
      {notice&&<div className="toast">✓ {notice}</div>}
      <div className="metrics"><article><span>Pedidos ativos</span><strong>18</strong><small>+4 neste mês</small></article><article><span>Aguardando aprovação</span><strong>6</strong><small>3 arquivos enviados hoje</small></article><article><span>Receita em agosto</span><strong>R$ 11.240</strong><small>Meta: R$ 15.000</small></article><article><span>Entregas próximas</span><strong>7</strong><small>Nos próximos 10 dias</small></article></div>
      <div className="dashboard-grid">
        <article className="dash-panel orders-panel"><div className="panel-title"><div><p className="eyebrow">FLUXO EDITORIAL</p><h2>Pedidos em andamento</h2></div><button onClick={()=>setTab("Pedidos")}>Ver todos →</button></div><div className="table-wrap"><table><thead><tr><th>Pedido</th><th>Cliente e obra</th><th>Serviço</th><th>Etapa</th><th>Entrega</th><th>Valor</th><th></th></tr></thead><tbody>{filtered.map(o=><tr key={o.id}><td><b>{o.id}</b></td><td><strong>{o.client}</strong><small>{o.title}</small></td><td>{o.service}</td><td><span className={`status ${o.stage.toLowerCase().replace("ç","c")}`}>{o.stage}</span></td><td>{o.date}</td><td>{o.value}</td><td><button onClick={()=>action(`${o.id} aberto para edição`)}>•••</button></td></tr>)}</tbody></table></div></article>
        <aside className="dash-panel timeline"><div className="panel-title"><div><p className="eyebrow">AGENDA</p><h2>Próximas datas</h2></div></div><div className="date-item"><b>05</b><div><strong>Entrega final — Reflexões sobre ESG</strong><small>Leonardo Lemos • 14h</small></div></div><div className="date-item"><b>09</b><div><strong>Retorno da autora — Gestão e Qualidade</strong><small>Clarissa Lima • até 18h</small></div></div><div className="date-item"><b>14</b><div><strong>Primeira prova — Test drive</strong><small>Bruno Fernandes • 10h</small></div></div><button className="outline" onClick={()=>setTab("Calendário editorial")}>Abrir calendário completo</button></aside>
      </div>
      <div className="dashboard-grid lower"><article className="dash-panel"><div className="panel-title"><div><p className="eyebrow">CONFERÊNCIA</p><h2>Arquivos aguardando retorno</h2></div><button onClick={()=>action("Área de uploads aberta")}>Enviar arquivo ＋</button></div><div className="file-row"><span>PDF</span><div><strong>Prova_02_Nunca_foi_so_cabelo.pdf</strong><small>Enviado ontem • aguardando autora</small></div><button onClick={()=>action("Lembrete enviado à autora")}>Lembrar autora</button></div><div className="file-row"><span>DOC</span><div><strong>Revisao_Test_drive_com_alteracoes.docx</strong><small>Enviado há 2 dias • visualizado</small></div><button onClick={()=>action("Conversa do pedido aberta")}>Abrir conversa</button></div></article><article className="dash-panel chat-panel"><div className="panel-title"><div><p className="eyebrow">MENSAGENS</p><h2>Conversas recentes</h2></div></div><div className="message"><span>MG</span><div><strong>Mariah Gabi <small>10:42</small></strong><p>Recebi a nova prova. Vou conferir o capítulo 4...</p></div></div><div className="message"><span>BF</span><div><strong>Bruno Fernandes <small>Ontem</small></strong><p>Podemos manter essa imagem na abertura?</p></div></div></article></div>
    </section>
  </main>
}
