import { f as createVNode, F as Fragment, _ as __astro_tag_component__ } from './astro/server_CxdTwKPW.mjs';
import 'clsx';

const frontmatter = {
  "title": "Tema Grafico Sito Arcipelago La Maddalena",
  "slug": "tema-grafico-sito-arcipelago-la-maddalena",
  "permalink": "/portfolio/tema-grafico-sito-arcipelago-la-maddalena/",
  "description": "Progettazione del tema grafico per il sito Arcipelago La Maddalena realizzato su piattaforma Drupal 7.",
  "publishDate": "2025-02-23T00:00:00.000Z",
  "updateDate": "2025-02-23T00:00:00.000Z",
  "category": "Web Design",
  "technologies": ["Drupal 7", "HTML", "CSS", "Design Grafico"],
  "image": {
    "src": "/images/portfolio/lamaddalenapark.webp",
    "alt": "Tema grafico per il sito Arcipelago La Maddalena",
    "width": 1024,
    "height": 768
  },
  "metadata": {
    "title": "Tema Grafico Sito Arcipelago La Maddalena - LS Web Agency",
    "description": "Progettazione e realizzazione del tema grafico per il sito ufficiale Arcipelago La Maddalena su Drupal 7.",
    "keywords": ["web design", "drupal 7", "arcipelago la maddalena", "tema grafico sito"]
  },
  "readingTime": 1
};
function getHeadings() {
  return [{
    "depth": 2,
    "slug": "tema-grafico-sito-arcipelago-la-maddalena",
    "text": "Tema Grafico Sito Arcipelago La Maddalena"
  }, {
    "depth": 3,
    "slug": "obiettivi-del-progetto",
    "text": "Obiettivi del Progetto"
  }, {
    "depth": 3,
    "slug": "tecnologie-utilizzate",
    "text": "Tecnologie Utilizzate"
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
      id: "tema-grafico-sito-arcipelago-la-maddalena",
      children: "Tema Grafico Sito Arcipelago La Maddalena"
    }), "\n", createVNode(_components.p, {
      children: ["La ", createVNode(_components.strong, {
        children: "LS Web Agency"
      }), " si è occupata della progettazione e della realizzazione del tema grafico per il sito ufficiale dell’", createVNode(_components.strong, {
        children: "Arcipelago La Maddalena"
      }), ", utilizzando la piattaforma ", createVNode(_components.strong, {
        children: "Drupal 7"
      }), "."]
    }), "\n", createVNode(_components.h3, {
      id: "obiettivi-del-progetto",
      children: "Obiettivi del Progetto"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "Creare un tema grafico che rispecchiasse l’identità visiva del territorio e dell’ente."
      }), "\n", createVNode(_components.li, {
        children: "Garantire un’interfaccia intuitiva e accessibile su tutti i dispositivi."
      }), "\n", createVNode(_components.li, {
        children: "Migliorare la user experience per i visitatori del sito."
      }), "\n"]
    }), "\n", createVNode(_components.h3, {
      id: "tecnologie-utilizzate",
      children: "Tecnologie Utilizzate"
    }), "\n", createVNode(_components.p, {
      children: "Il progetto è stato realizzato utilizzando:"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Drupal 7"
        }), " per la gestione avanzata dei contenuti."]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "HTML"
        }), " e ", createVNode(_components.strong, {
          children: "CSS"
        }), " per un design responsive e personalizzato."]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Design grafico"
        }), " per valorizzare l’aspetto visivo del sito."]
      }), "\n"]
    }), "\n", createVNode(_components.h3, {
      id: "il-nostro-approccio",
      children: "Il Nostro Approccio"
    }), "\n", createVNode(_components.p, {
      children: "Abbiamo progettato un tema grafico che si integra perfettamente con l’architettura del sito, con un’attenzione particolare all’esperienza utente e alla valorizzazione delle risorse naturali e culturali dell’arcipelago."
    }), "\n", createVNode(_components.p, {
      children: ["Se vuoi scoprire come possiamo aiutarti a migliorare la presenza online del tuo progetto, ", createVNode(_components.a, {
        href: "https://lucasanna.eu/contatti",
        children: "contattaci oggi stesso"
      }), "."]
    }), "\n", createVNode(_components.p, {
      children: [createVNode(_components.strong, {
        children: "LS Web Agency"
      }), " - Siti web che fanno la differenza."]
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

const url = "src/content/data/portfolio/la-maddalena-parco-web-site.mdx";
const file = "/Users/lucasanna/lswebagency2025/src/content/data/portfolio/la-maddalena-parco-web-site.mdx";
const Content = (props = {}) => MDXContent({
  ...props,
  components: { Fragment: Fragment, ...props.components, },
});
Content[Symbol.for('mdx-component')] = true;
Content[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);
Content.moduleId = "/Users/lucasanna/lswebagency2025/src/content/data/portfolio/la-maddalena-parco-web-site.mdx";
__astro_tag_component__(Content, 'astro:jsx');

export { Content, Content as default, file, frontmatter, getHeadings, url };
