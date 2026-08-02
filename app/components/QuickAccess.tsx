"use client";

const items = [
  { number: "01", title: "Serviços", text: "Conheça todas as soluções editoriais", href: "#servicos", tone: "cyan" },
  { number: "02", title: "Obras publicadas", text: "Acesse o catálogo da Worges", href: "#obras", tone: "magenta" },
  { number: "03", title: "Coletâneas", text: "Veja temáticas e publique seu capítulo", href: "#capitulos", tone: "yellow" },
];

export default function QuickAccess() {
  function openAssistant() {
    window.dispatchEvent(new CustomEvent("worges:open-assistant"));
  }

  return (
    <section className="access-hub" aria-label="Acesso rápido">
      {items.map((item) => (
        <a className={`access-card ${item.tone}`} href={item.href} key={item.title}>
          <span>{item.number}</span>
          <div><strong>{item.title}</strong><small>{item.text}</small></div>
          <b>→</b>
        </a>
      ))}
      <button className="access-card assistant-access" onClick={openAssistant}>
        <span>04</span>
        <div><strong>Chat com a assistente</strong><small>Online para explicar pacotes e valores</small></div>
        <i>Online</i>
      </button>
    </section>
  );
}
