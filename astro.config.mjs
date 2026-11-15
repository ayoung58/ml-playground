// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'ML Playground',
      customCss: ['katex/dist/katex.min.css', './src/styles/custom.css'],
      // Wrap Starlight's defaults to add the collapse buttons for the sidebar and "On this page".
      components: {
        SiteTitle: './src/components/starlight/SiteTitle.astro',
        SocialIcons: './src/components/starlight/SocialIcons.astro',
      },
      head: [
        {
          // Restore the saved panel state before first paint so there is no layout flash.
          // Keys and attribute names must match src/components/starlight/PanelToggle.astro.
          tag: 'script',
          content: [
            'try{',
            "var r=document.documentElement;",
            "if(localStorage.getItem('ml-sidebar-collapsed')==='true')r.setAttribute('data-sidebar-collapsed','');",
            "if(localStorage.getItem('ml-toc-collapsed')==='true')r.setAttribute('data-toc-collapsed','');",
            '}catch(e){}',
          ].join(''),
        },
      ],
      sidebar: [
        { label: 'Start here', items: [{ slug: 'index' }] },
        { label: 'Foundations', items: [{ autogenerate: { directory: 'foundations' } }] },
        {
          label: 'Supervised learning',
          items: [{ autogenerate: { directory: 'supervised' } }],
        },
        { label: 'Gallery', items: [{ slug: 'gallery' }] },
      ],
    }),
    react(),
  ],
  markdown: {
    // Astro 7 defaults to the Sätteri processor, which ignores remark/rehype plugins.
    // The unified processor is needed for remark-math + rehype-katex.
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
  },
});
