import { f as createVNode, F as Fragment, _ as __astro_tag_component__ } from './astro/server_CxdTwKPW.mjs';
import 'clsx';

const frontmatter = {
  "title": "Arte Senza Confini - Logo Design",
  "slug": "arte-senza-confini-logo-design",
  "permalink": "/portfolio/arte-senza-confini-logo-design/",
  "description": "Progetto di logo design realizzato per Arte Senza Confini, un brand che promuove l'arte senza limiti e barriere, con un'identità visiva distintiva e memorabile.",
  "publishDate": "2025-03-02T00:00:00.000Z",
  "updateDate": "2025-03-02T00:00:00.000Z",
  "category": "Branding & Logo Design",
  "technologies": ["Illustrator", "Photoshop", "Design Grafico"],
  "image": {
    "src": "/images/portfolio/logo-arte-senza-confini copia.webp",
    "alt": "Logo Arte Senza Confini",
    "width": 1024,
    "height": 768
  },
  "metadata": {
    "title": "Arte Senza Confini - Logo Design - LS Web Agency",
    "description": "Scopri il progetto di logo design per Arte Senza Confini: un'identità visiva unica che rappresenta l'arte senza limiti e barriere.",
    "keywords": ["logo design", "branding", "identità visiva", "design creativo"]
  },
  "readingTime": 1
};
function getHeadings() {
  return [{
    "depth": 1,
    "slug": "arte-senza-confini---logo-design",
    "text": "Arte Senza Confini - Logo Design"
  }, {
    "depth": 2,
    "slug": "obiettivi-del-progetto",
    "text": "Obiettivi del Progetto"
  }, {
    "depth": 2,
    "slug": "tecnologie-utilizzate",
    "text": "Tecnologie Utilizzate"
  }, {
    "depth": 2,
    "slug": "risultato-finale",
    "text": "Risultato Finale"
  }, {
    "depth": 3,
    "slug": "contatta-ls-web-agency",
    "text": "Contatta LS Web Agency"
  }];
}
function _createMdxContent(props) {
  const _components = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    hr: "hr",
    li: "li",
    p: "p",
    strong: "strong",
    ul: "ul",
    ...props.components
  };
  return createVNode(Fragment, {
    children: [createVNode(_components.h1, {
      id: "arte-senza-confini---logo-design",
      children: "Arte Senza Confini - Logo Design"
    }), "\n", createVNode(_components.p, {
      children: "Arte Senza Confini è un brand che promuove l’arte come espressione libera e inclusiva, senza confini né limiti. Il cliente desiderava un’identità visiva che rappresentasse questi valori in modo forte e riconoscibile."
    }), "\n", createVNode(_components.h2, {
      id: "obiettivi-del-progetto",
      children: "Obiettivi del Progetto"
    }), "\n", createVNode(_components.p, {
      children: "Il logo è stato progettato con l’obiettivo di:"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Comunicare un senso di libertà e apertura attraverso il design"
        }), "."]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Creare un’identità visiva distintiva e versatile per diversi contesti di utilizzo"
        }), "."]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Bilanciare estetica e leggibilità per un logo impattante e chiaro"
        }), "."]
      }), "\n"]
    }), "\n", createVNode(_components.h2, {
      id: "tecnologie-utilizzate",
      children: "Tecnologie Utilizzate"
    }), "\n", createVNode(_components.p, {
      children: ["Abbiamo sviluppato il logo utilizzando ", createVNode(_components.strong, {
        children: "Adobe Illustrator"
      }), " per la creazione vettoriale e ", createVNode(_components.strong, {
        children: "Photoshop"
      }), " per il perfezionamento grafico. L’approccio è stato studiato per garantire scalabilità e applicabilità su vari supporti."]
    }), "\n", createVNode(_components.h2, {
      id: "risultato-finale",
      children: "Risultato Finale"
    }), "\n", createVNode(_components.p, {
      children: "Il risultato è un logo iconico, moderno e versatile, capace di rappresentare la filosofia di Arte Senza Confini in ogni sua applicazione, dal digitale alla stampa."
    }), "\n", createVNode(_components.hr, {}), "\n", createVNode(_components.h3, {
      id: "contatta-ls-web-agency",
      children: "Contatta LS Web Agency"
    }), "\n", createVNode(_components.p, {
      children: "Se hai bisogno di un logo unico e su misura per il tuo brand, contattaci oggi stesso per una consulenza personalizzata!"
    })]
  });
}
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? createVNode(MDXLayout, {
    ...props,
    children: createVNode(_createMdxContent, {
      ...props
    })
  }) : _createMdxContent(props);
}

const url = "src/content/data/portfolio/logo-arte-senza-confini.mdx";
const file = "/Users/lucasanna/lswebagency2025/src/content/data/portfolio/logo-arte-senza-confini.mdx";
const Content = (props = {}) => MDXContent({
  ...props,
  components: { Fragment: Fragment, ...props.components, },
});
Content[Symbol.for('mdx-component')] = true;
Content[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);
Content.moduleId = "/Users/lucasanna/lswebagency2025/src/content/data/portfolio/logo-arte-senza-confini.mdx";
__astro_tag_component__(Content, 'astro:jsx');

export { Content, Content as default, file, frontmatter, getHeadings, url };
