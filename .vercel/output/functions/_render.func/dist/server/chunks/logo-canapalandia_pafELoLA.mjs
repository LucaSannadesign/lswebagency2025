import { f as createVNode, F as Fragment, _ as __astro_tag_component__ } from './astro/server_CxdTwKPW.mjs';
import 'clsx';

const frontmatter = {
  "title": "Logo Canapalandia",
  "slug": "logo-canaplandia",
  "permalink": "/portfolio/logo-canaplandia/",
  "description": "Progetto di creazione del logo per Canapalandia, un brand dedicato alla promozione della cultura e dell'informazione sulla canapa.",
  "publishDate": "2025-02-23T00:00:00.000Z",
  "updateDate": "2025-02-23T00:00:00.000Z",
  "category": "Brand Identity",
  "technologies": ["Illustrator", "Graphic Design"],
  "image": {
    "src": "/images/portfolio/logo-canapalandia.webp",
    "alt": "Logo Canapalandia realizzato da LS Web Agency",
    "width": 1024,
    "height": 768
  },
  "metadata": {
    "title": "Logo Canapalandia - Progetto di Branding",
    "description": "Scopri il progetto di creazione del logo Canapalandia realizzato da LS Web Agency per promuovere la cultura e l'informazione sulla canapa.",
    "keywords": ["branding", "logo design", "canapalandia", "progetto grafico", "grafica canapa"]
  },
  "readingTime": 1
};
function getHeadings() {
  return [{
    "depth": 2,
    "slug": "logo-canapalandia",
    "text": "Logo Canapalandia"
  }, {
    "depth": 3,
    "slug": "obiettivi-del-progetto",
    "text": "Obiettivi del Progetto"
  }, {
    "depth": 3,
    "slug": "tecnologie-e-strumenti-utilizzati",
    "text": "Tecnologie e Strumenti Utilizzati"
  }, {
    "depth": 3,
    "slug": "il-nostro-approccio",
    "text": "Il Nostro Approccio"
  }];
}
function _createMdxContent(props) {
  const _components = {
    a: "a",
    h2: "h2",
    h3: "h3",
    li: "li",
    p: "p",
    strong: "strong",
    ul: "ul",
    ...props.components
  };
  return createVNode(Fragment, {
    children: [createVNode(_components.h2, {
      id: "logo-canapalandia",
      children: "Logo Canapalandia"
    }), "\n", createVNode(_components.p, {
      children: ["Il progetto ", createVNode(_components.strong, {
        children: "Logo Canapalandia"
      }), " è stato ideato per rappresentare un brand dedicato alla promozione della cultura e dell’informazione sulla canapa. Il logo è stato progettato con un approccio grafico moderno e minimalista, per comunicare i valori di autenticità e sostenibilità che caratterizzano il brand."]
    }), "\n", createVNode(_components.h3, {
      id: "obiettivi-del-progetto",
      children: "Obiettivi del Progetto"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "Creare un logo che fosse riconoscibile e facilmente associabile al mondo della canapa."
      }), "\n", createVNode(_components.li, {
        children: "Rappresentare i valori di trasparenza, qualità e informazione che il brand vuole trasmettere."
      }), "\n", createVNode(_components.li, {
        children: "Garantire una versatilità del logo per diversi supporti di comunicazione (sito web, social media, materiale promozionale)."
      }), "\n"]
    }), "\n", createVNode(_components.h3, {
      id: "tecnologie-e-strumenti-utilizzati",
      children: "Tecnologie e Strumenti Utilizzati"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Adobe Illustrator"
        }), ": per la progettazione grafica del logo."]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Principi di branding"
        }), ": applicati per garantire una coerenza visiva forte e distintiva."]
      }), "\n"]
    }), "\n", createVNode(_components.h3, {
      id: "il-nostro-approccio",
      children: "Il Nostro Approccio"
    }), "\n", createVNode(_components.p, {
      children: "Abbiamo lavorato a stretto contatto con il team di Canapalandia per comprendere appieno la loro visione e i valori che desideravano trasmettere. Il risultato è un logo che combina elementi grafici evocativi e un font moderno, riflettendo l’identità del brand in modo autentico."
    }), "\n", createVNode(_components.p, {
      children: ["Se vuoi scoprire come possiamo aiutarti a dare vita al tuo brand con un logo unico e memorabile, ", createVNode(_components.a, {
        href: "https://lswebagency.com/contatti",
        children: "contattaci oggi stesso"
      }), "."]
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

const url = "src/content/data/portfolio/logo-canapalandia.mdx";
const file = "/Users/lucasanna/lswebagency2025/src/content/data/portfolio/logo-canapalandia.mdx";
const Content = (props = {}) => MDXContent({
  ...props,
  components: { Fragment: Fragment, ...props.components, },
});
Content[Symbol.for('mdx-component')] = true;
Content[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);
Content.moduleId = "/Users/lucasanna/lswebagency2025/src/content/data/portfolio/logo-canapalandia.mdx";
__astro_tag_component__(Content, 'astro:jsx');

export { Content, Content as default, file, frontmatter, getHeadings, url };
