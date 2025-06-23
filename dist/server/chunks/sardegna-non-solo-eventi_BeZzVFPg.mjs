import { f as createVNode, F as Fragment, _ as __astro_tag_component__ } from './astro/server_CROlnyxU.mjs';
import 'clsx';

const frontmatter = {
  "title": "Sardegna Non Solo Eventi",
  "slug": "sardegna-non-solo-eventi",
  "permalink": "/portfolio/sardegna-non-solo-eventi/",
  "canonical": "https://www.lswebagency.com/portfolio/sardegna-non-solo-eventi/",
  "description": "Progetto digitale dedicato alla promozione degli eventi culturali, artistici e gastronomici in Sardegna.",
  "publishDate": "2025-02-23T00:00:00.000Z",
  "updateDate": "2025-02-23T00:00:00.000Z",
  "category": "Web Design",
  "technologies": ["HTML", "CSS", "JavaScript", "Drupal 7"],
  "image": {
    "src": "/images/portfolio/sardegna-nonsolo-eventi.webp",
    "alt": "Progetto Sardegna Non Solo Eventi",
    "width": 1024,
    "height": 768
  },
  "metadata": {
    "title": "Sardegna Non Solo Eventi - LS Web Agency",
    "description": "Scopri il progetto Sardegna Non Solo Eventi realizzato da LS Web Agency: un portale dedicato alla promozione degli eventi culturali e artistici in Sardegna.",
    "keywords": ["eventi Sardegna", "portale eventi", "web design Sardegna", "Drupal 7"]
  },
  "readingTime": 2
};
function getHeadings() {
  return [{
    "depth": 2,
    "slug": "sardegna-non-solo-eventi",
    "text": "Sardegna Non Solo Eventi"
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
      id: "sardegna-non-solo-eventi",
      children: "Sardegna Non Solo Eventi"
    }), "\n", createVNode(_components.p, {
      children: [createVNode(_components.strong, {
        children: "Sardegna Non Solo Eventi"
      }), " è un progetto digitale ideato per promuovere e valorizzare la ricchezza culturale, artistica e gastronomica della Sardegna. Il sito web rappresenta un punto di riferimento per chi desidera scoprire e partecipare agli eventi più interessanti organizzati nell’isola."]
    }), "\n", createVNode(_components.h3, {
      id: "obiettivi-del-progetto",
      children: "Obiettivi del Progetto"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "Creare un portale web completo dedicato agli eventi locali in Sardegna."
      }), "\n", createVNode(_components.li, {
        children: "Fornire informazioni dettagliate e aggiornate sugli eventi culturali, artistici, musicali e gastronomici."
      }), "\n", createVNode(_components.li, {
        children: "Facilitare la ricerca di eventi tramite una navigazione intuitiva e un’interfaccia user-friendly."
      }), "\n"]
    }), "\n", createVNode(_components.h3, {
      id: "tecnologie-utilizzate",
      children: "Tecnologie Utilizzate"
    }), "\n", createVNode(_components.p, {
      children: "Per la realizzazione del progetto sono state utilizzate le seguenti tecnologie:"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "HTML"
        }), " e ", createVNode(_components.strong, {
          children: "CSS"
        }), " per la struttura e lo stile del sito."]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "JavaScript"
        }), " per migliorare l’interattività e la fruibilità del portale."]
      }), "\n", createVNode(_components.li, {
        children: [createVNode(_components.strong, {
          children: "Drupal 7"
        }), " come CMS per la gestione dinamica dei contenuti e delle categorie degli eventi."]
      }), "\n"]
    }), "\n", createVNode(_components.h3, {
      id: "il-nostro-approccio",
      children: "Il Nostro Approccio"
    }), "\n", createVNode(_components.p, {
      children: "Abbiamo sviluppato un sito web che rispecchia la vivacità e la varietà degli eventi organizzati in Sardegna, puntando su un design semplice e intuitivo che mette in evidenza i contenuti e facilita l’accesso alle informazioni da parte degli utenti."
    }), "\n", createVNode(_components.p, {
      children: ["Se vuoi scoprire di più su come possiamo supportare il tuo progetto web, ", createVNode(_components.a, {
        href: "https://lucasanna.eu/contatti",
        children: "contattaci oggi stesso"
      }), " per una consulenza personalizzata."]
    }), "\n", createVNode(_components.p, {
      children: [createVNode(_components.strong, {
        children: "LS Web Agency"
      }), " è specializzata nella creazione di siti web dedicati alla promozione territoriale e culturale, aiutandoti a valorizzare al meglio le tue iniziative."]
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

const url = "src/content/data/portfolio/sardegna-non-solo-eventi.mdx";
const file = "/Users/lucasanna/lswebagency2025/src/content/data/portfolio/sardegna-non-solo-eventi.mdx";
const Content = (props = {}) => MDXContent({
  ...props,
  components: { Fragment: Fragment, ...props.components, },
});
Content[Symbol.for('mdx-component')] = true;
Content[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);
Content.moduleId = "/Users/lucasanna/lswebagency2025/src/content/data/portfolio/sardegna-non-solo-eventi.mdx";
__astro_tag_component__(Content, 'astro:jsx');

export { Content, Content as default, file, frontmatter, getHeadings, url };
