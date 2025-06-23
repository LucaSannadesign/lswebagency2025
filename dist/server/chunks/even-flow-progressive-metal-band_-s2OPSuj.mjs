import { f as createVNode, F as Fragment, _ as __astro_tag_component__ } from './astro/server_CROlnyxU.mjs';
import 'clsx';

const frontmatter = {
  "title": "Even Flow Band Web Site",
  "slug": "even-flow-band-web-site",
  "permalink": "/portfolio/tema-grafico-sito-arcipelago-la-maddalena/",
  "canonical": "https://www.lswebagency.com/portfolio/even-flow-band-web-site/",
  "description": "Sito web ufficiale per la band Even Flow, realizzato con un design dinamico e una user experience coinvolgente.",
  "publishDate": "2025-02-23T00:00:00.000Z",
  "updateDate": "2025-02-23T00:00:00.000Z",
  "category": "Web Design",
  "technologies": ["HTML", "CSS", "JavaScript", "WordPress"],
  "image": {
    "src": "/images/portfolio/even-flow-band-web-site.webp",
    "alt": "Progetto Even Flow Band Web Site",
    "width": 1024,
    "height": 768
  },
  "metadata": {
    "title": "Progetto Even Flow Band - LS Web Agency",
    "description": "Scopri il sito ufficiale degli Even Flow Band realizzato da LS Web Agency: design dinamico, user experience coinvolgente e personalizzata.",
    "keywords": ["web design", "even flow band", "sito web musicale", "progetto band musicale"]
  },
  "readingTime": 1
};
function getHeadings() {
  return [{
    "depth": 2,
    "slug": "even-flow-band-web-site",
    "text": "Even Flow Band Web Site"
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
      id: "even-flow-band-web-site",
      children: "Even Flow Band Web Site"
    }), "\n", createVNode(_components.p, {
      children: ["Il progetto ", createVNode(_components.strong, {
        children: "Even Flow Band Web Site"
      }), " rappresenta il punto di riferimento online per la band rock-progressive Even Flow. Il sito è stato progettato per riflettere l’energia e la passione musicale della band, offrendo ai fan una piattaforma dinamica e coinvolgente."]
    }), "\n", createVNode(_components.h3, {
      id: "obiettivi-del-progetto",
      children: "Obiettivi del Progetto"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "Creare un sito web che rispecchiasse l’identità visiva e musicale della band."
      }), "\n", createVNode(_components.li, {
        children: "Facilitare l’accesso alle informazioni su concerti, album e news."
      }), "\n", createVNode(_components.li, {
        children: "Assicurare una navigazione fluida su dispositivi desktop e mobile."
      }), "\n"]
    }), "\n", createVNode(_components.h3, {
      id: "tecnologie-utilizzate",
      children: "Tecnologie Utilizzate"
    }), "\n", createVNode(_components.p, {
      children: "Il sito è stato realizzato utilizzando:"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "HTML"
        }), " e ", createVNode(_components.strong, {
          children: "CSS"
        }), " per un design responsive e visivamente armonioso."]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "JavaScript"
        }), " per animazioni e interattività."]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "WordPress"
        }), " per una gestione dei contenuti semplice e veloce."]
      }), "\n"]
    }), "\n", createVNode(_components.h3, {
      id: "il-nostro-approccio",
      children: "Il Nostro Approccio"
    }), "\n", createVNode(_components.p, {
      children: "Abbiamo progettato un layout che combina elementi visivi potenti e una navigazione intuitiva, con particolare attenzione all’esperienza dell’utente. Il sito offre una vetrina per le produzioni musicali, i prossimi eventi live e le ultime notizie sulla band."
    }), "\n", createVNode(_components.p, {
      children: ["Se desideri scoprire il sito in azione, visita il ", createVNode(_components.a, {
        href: "https://www.bandevenflow.com",
        children: "sito ufficiale degli Even Flow"
      }), `target="_blank"`, `rel="nofollow noreferrer"`, "."]
    }), "\n", createVNode(_components.p, {
      children: [createVNode(_components.strong, {
        children: "LS Web Agency"
      }), " si è occupata di ogni aspetto del progetto, garantendo un risultato finale che riflette la forza artistica della band."]
    }), "\n", createVNode(_components.p, {
      children: ["Per saperne di più su come possiamo aiutare il tuo progetto musicale a emergere online, ", createVNode(_components.a, {
        href: "https://lucasanna.eu/contatti",
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

const url = "src/content/data/portfolio/even-flow-progressive-metal-band.mdx";
const file = "/Users/lucasanna/lswebagency2025/src/content/data/portfolio/even-flow-progressive-metal-band.mdx";
const Content = (props = {}) => MDXContent({
  ...props,
  components: { Fragment: Fragment, ...props.components, },
});
Content[Symbol.for('mdx-component')] = true;
Content[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);
Content.moduleId = "/Users/lucasanna/lswebagency2025/src/content/data/portfolio/even-flow-progressive-metal-band.mdx";
__astro_tag_component__(Content, 'astro:jsx');

export { Content, Content as default, file, frontmatter, getHeadings, url };
