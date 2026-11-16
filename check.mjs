import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
const config=JSON.parse(fs.readFileSync('config.json','utf8'));
const tools=JSON.parse(fs.readFileSync('tools.json','utf8'));
const categories=new Set(['Product Listings','Product Photos','Customer Support','Email & SMS','Ads & Social','SEO & AI Search','Pricing & Inventory','Analytics']);
const slugs=new Set();
for(const t of tools){for(const key of ['name','slug','official_url','description','category','pricing_type','best_for','pros','featured','affiliate_url'])if(!(key in t))throw Error(`${t.name||'?'} missing ${key}`);if(slugs.has(t.slug))throw Error(`Duplicate slug: ${t.slug}`);slugs.add(t.slug);if(!categories.has(t.category))throw Error(`Invalid category: ${t.name}`);if(!['free','freemium','paid'].includes(t.pricing_type))throw Error(`Invalid pricing: ${t.name}`);if(!Array.isArray(t.pros)||t.pros.length!==3)throw Error(`Need 3 pros: ${t.name}`);for(const key of ['official_url','affiliate_url'])if(t[key]&&!/^https:\/\//.test(t[key]))throw Error(`Invalid URL: ${t.name} ${key}`)}
if(tools.length!==50)throw Error(`Expected 50 seeded tools, found ${tools.length}`);
execFileSync('node',['build.mjs'],{stdio:'inherit'});
const pages=[];function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=`${dir}/${e.name}`;if(e.isDirectory())walk(p);else if(e.name==='index.html')pages.push(p)}}walk('dist');
const routes=new Set(pages.map(p=>'/'+p.slice(5).replace(/index\.html$/,'')));
if(routes.size!==72)throw Error(`Expected 72 pages, found ${routes.size}`);
for(const p of pages){const h=fs.readFileSync(p,'utf8');if(!/<title>[^<]+<\/title>/.test(h)||!h.includes('rel="canonical"')||!h.includes('property="og:title"'))throw Error(`Missing metadata: ${p}`);for(const m of h.matchAll(/href="(\/[^"]*)"/g)){const href=m[1].split('#')[0];if(!href||href==='/styles.css'||href==='/search.js'||href==='/submit.js')continue;if(!routes.has(href))throw Error(`Broken internal link ${href} in ${p}`)}if(p.includes('/tools/')&&!h.includes('"SoftwareApplication"'))throw Error(`Missing tool schema ${p}`);if(p.includes('/categories/')&&!h.includes('"ItemList"'))throw Error(`Missing category schema ${p}`);if(p.includes('/guides/best-')&&!h.includes('"FAQPage"'))throw Error(`Missing guide schema ${p}`)}
for(const name of ['sitemap.xml','robots.txt','llms.txt'])if(!fs.existsSync(`dist/${name}`))throw Error(`Missing ${name}`);
console.log(`Checks passed: ${tools.length} tools, ${pages.length} pages, internal links and SEO files.`);
if(config.siteUrl.endsWith('.example'))console.warn('Before publishing: replace the placeholder siteUrl in config.json.');
