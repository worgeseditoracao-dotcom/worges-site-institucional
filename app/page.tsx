const services = [
  { title: "E-book profissional", price: "a partir de R$ 269,90", text: "Diagramação editorial, ficha catalográfica e arquivo digital finalizado." },
  { title: "Livro para impressão", price: "a partir de R$ 289,90", text: "Miolo, capa física e arquivos prontos para impressão sob demanda." },
  { title: "Pacote Plus", price: "a partir de R$ 559,90", text: "Publicação completa com revisão, ISBN físico e digital e arquivo Kindle." },
];

const works = [
  ["Nunca foi só cabelo", "Janete Bernardo", "Memórias e identidade"],
  ["Mulheres Fortes", "Worges Editoração", "Fé e desenvolvimento"],
  ["Entre Algoritmos", "Frank Figueiredo César", "IA e advocacia"],
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Worges Editoração — página inicial">
          <strong>WORGES</strong><span>EDITORAÇÃO</span>
        </a>
        <nav aria-label="Navegação principal">
          <a href="#servicos">Serviços</a><a href="#obras">Obras publicadas</a><a href="#cursos">Cursos</a>
        </nav>
        <a className="header-cta" href="/cliente">Área do cliente <span>↗</span></a>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow">EDITORAÇÃO • PUBLICAÇÃO • ACOMPANHAMENTO</p>
          <h1>Seu livro,<br/><em>do original à</em><br/>publicação</h1>
          <div className="ornament"><span></span><i></i></div>
          <p className="lead">Transformamos seu manuscrito em uma obra profissional, pronta para alcançar leitores — com você acompanhando cada etapa.</p>
          <div className="hero-actions">
            <a className="button primary" href="#servicos">Conheça nossos serviços <span>→</span></a>
            <a className="button secondary" href="/cliente">Acompanhar minha obra <span>→</span></a>
          </div>
        </div>
        <div className="hero-art" aria-label="Livros e páginas em composição editorial sofisticada">
          <img src="https://raw.githubusercontent.com/worgeseditoracao-dotcom/plataforma-worges/main/public/hero-editorial.png" alt="Livros em tons vinho e grafite, com papéis marfim" />
        </div>
        <div className="feature-strip">
          <article><span className="feature-icon">▱</span><div><strong>Publicação completa</strong><small>Do manuscrito ao livro publicado</small></div></article>
          <article><span className="feature-icon">✒</span><div><strong>Acompanhamento editorial</strong><small>Cronograma e etapas transparentes</small></div></article>
          <article><span className="feature-icon">•••</span><div><strong>Atendimento em cada etapa</strong><small>Converse dentro do seu pedido</small></div></article>
        </div>
      </section>

      <section className="section services" id="servicos">
        <div className="section-heading"><div><p className="eyebrow">SERVIÇOS EDITORIAIS</p><h2>Escolha como sua obra<br/>vai ganhar o mundo.</h2></div><p>Planos completos para autores independentes, pesquisadores e organizadores de obras coletivas.</p></div>
        <div className="service-grid">{services.map((service, index) => <article className="service-card" key={service.title}><span>0{index + 1}</span><h3>{service.title}</h3><p>{service.text}</p><strong>{service.price}</strong><a href="/checkout">Contratar serviço →</a></article>)}</div>
      </section>

      <section className="section works" id="obras">
        <div className="section-heading"><div><p className="eyebrow">CATÁLOGO WORGES</p><h2>Obras que já<br/><em>ganharam forma.</em></h2></div><a className="text-link" href="#obras">Ver catálogo completo →</a></div>
        <div className="work-grid">{works.map((work, index) => <article className={`work-card work-${index + 1}`} key={work[0]}><div className="book-cover"><span>W</span><strong>{work[0]}</strong><small>{work[1]}</small></div><p>{work[2]}</p><h3>{work[0]}</h3><small>{work[1]}</small></article>)}</div>
      </section>

      <section className="section academy" id="cursos">
        <div><p className="eyebrow">WORGES ACADEMIA</p><h2>Conhecimento para<br/>publicar com segurança.</h2><p>Cursos, guias e materiais digitais para autores que querem compreender e conduzir melhor sua jornada editorial.</p><a className="button primary" href="/checkout">Ver cursos e materiais →</a></div>
        <div className="academy-card"><span>AULA EM DESTAQUE</span><h3>Da ideia ao livro publicado</h3><p>Um guia prático para organizar seu original, contratar serviços e preparar o lançamento.</p><strong>Curso completo • acesso digital</strong></div>
      </section>

      <section className="cta-band"><p className="eyebrow">COMECE SUA PUBLICAÇÃO</p><h2>Sua história merece<br/><em>uma edição à altura.</em></h2><a className="button primary" href="/checkout">Publicar meu livro →</a></section>
      <footer><a className="brand" href="#inicio"><strong>WORGES</strong><span>EDITORAÇÃO</span></a><p>Projetos editoriais feitos com rigor, cuidado e identidade.</p><div><a href="#servicos">Serviços</a><a href="/cliente">Área do cliente</a><a href="/admin">Administração</a></div><small>© 2026 Worges Editoração. Todos os direitos reservados.</small></footer>
    </main>
  );
}
