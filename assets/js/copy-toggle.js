/**
* Copy Toggle System - Switches to Product Manager copy via ?pm=1
* Default (no param) = uses HTML as-is (UX Designer)
* index.html?pm = PM mode, index.html?pm=0 = back to UX
*/
(function() {
'use strict';

const PM = {
title: 'Tin Yat Kwok \u2014 Senior Product Manager | 16 Years, 10+ Launched Products, 2.3M Users',
metaDescription: 'Senior Product Manager with 16 years shipping products from strategy to launch. Full-lifecycle ownership for teams that deliver outcomes.',
heroSubtitle: 'Strategy to shipped product.',
heroDescription: 'Market gaps to measurable outcomes. I own the full product journey so nothing falls between teams. Ten launched products. Millions of users. One consistent thread: outcomes that move the business.',
footerTitle: 'Senior Product Manager \u2014 Strategy to Launch',
heroCred: [
'16+ years shipping',
'Strategy to launch',
'Millions of users',
'10+ products launched'
],
sections: {
'why-work': {
title: 'Strategy that survives contact with reality',
description: 'You\u2019ve seen roadmaps that look great in Q1 planning and fall apart by Q2. Here\u2019s what changes when you hire someone who plans for what actually happens.'
},
'featured-case-studies': {
title: 'Strategy that became revenue',
description: 'Three products I led from market opportunity to live product\u2014each one driven by customer insight and measured by business outcomes.'
},
'selected-work': {
title: 'Selected Work',
description: 'Additional products where I drove strategy, alignment, and delivery across industries and platforms.'
},
'results': {
title: 'Business outcomes. Not shipped features.',
subtitle: 'These metrics come from products I\u2019ve led to market\u2014real business results, not vanity metrics.'
},
'process': {
title: 'From problem to measurable outcome',
description: 'A repeatable process for turning customer problems into shipped products\u2014proven across 16 years and three industries.'
},
'capabilities': {
title: 'What I bring to the table',
intro: 'Across 16 years, I\u2019ve built skills that transfer across industries. Whether it\u2019s finance, healthcare, or consumer tech\u2014the fundamentals of delivering outcomes hold.',
note: '\u201CProduct management is only successful when it delivers outcomes. My job isn\u2019t done when the feature ships\u2014it\u2019s done when customers and business see the value.\u201D'
}
},
splitCards: [
{
beforeTitle: 'Backlog Management',
beforeDesc: 'Stories get written, sprints get planned. But nobody can explain why these features matter to the business.',
afterTitle: 'Strategy to execution',
afterDesc: 'Customer research, market analysis, and roadmaps that teams can actually deliver on\u2014and leadership can defend.'
},
{
beforeTitle: 'Stakeholder Gridlock',
beforeDesc: 'Three VPs, two directors, and no alignment. The product goes nowhere while the market moves.',
afterTitle: 'Cross-functional leadership',
afterDesc: 'I create clarity across competing priorities\u2014engineering constraints, business goals, and customer needs all addressed.'
},
{
beforeTitle: 'Ideal-Customer Roadmap',
beforeDesc: 'Product plans built for a market that doesn\u2019t exist. Regulatory gaps discovered post-launch.',
afterTitle: 'Constraint-aware planning',
afterDesc: 'I plan with compliance, legacy systems, and resource limits baked in\u2014not discovered later.'
},
{
beforeTitle: 'HiPPO Decisions',
beforeDesc: 'The Highest Paid Person\u2019s Opinion drives the roadmap. Teams execute without conviction.',
afterTitle: 'Evidence-based prioritization',
afterDesc: 'I bring data to the debate\u2014customer research, competitive analysis, and business metrics that make the case.'
}
],
processSteps: [
{ title: 'Discover', desc: 'Market research, customer interviews, and competitive analysis. I define the problem before anyone touches a solution.' },
{ title: 'Define', desc: 'Product strategy, success metrics, and roadmap. I align stakeholders on what \u201Cdone\u201D looks like before the first sprint.' },
{ title: 'Design', desc: 'Partner with design on solutions. User flows, experience validation, and the feedback loops that catch wrong turns early.' },
{ title: 'Validate', desc: 'Customer research, pilot metrics, and stakeholder buy-in. If the data doesn\u2019t support it, I pivot\u2014not defend.' },
{ title: 'Deliver', desc: 'Launch planning, go-to-market coordination, and post-launch iteration. My job doesn\u2019t end at release.' }
],
capabilityCards: {
products: 'Product strategy, user research, roadmap planning, and feature prioritization that ties back to business goals.',
constraints: 'Regulatory compliance, stakeholder management, and risk assessment. I plan for the world the product actually launches into.',
platforms: 'Mobile, web, native apps\u2014experience across B2B and B2C platforms at scale.',
collaboration: 'Engineering, design, legal, marketing, and executives. I align diverse teams to shared outcomes.',
delivery: 'Discovery, experimentation, agile delivery, launch planning, and post-launch iteration. I own the full arc\u2014or the part you need me to.'
},
about: {
title: '16 years shipping products customers love',
p1: 'I started in product at banks and fintechs, learning how to ship in regulated, complex environments. Through product management across banking, trading, and platforms, I\u2019ve learned: the best PMs understand what happens <em>before</em> and <em>after</em> the launch.',
p2: '<strong>Product is the bridge between customer problems and business outcomes.</strong> The goal is value delivered\u2014not just features shipped. Everything else is noise if it doesn\u2019t move the needle.',
quote: 'I lead with customer empathy and business clarity. Not because I have all the answers, but because I know how to align teams around the right questions\u2014and guide them to solutions that work.'
},
cta: {
title: 'Ready to build something meaningful?',
description: 'I\u2019m open to senior Product Management opportunities where strategy, execution, and outcomes matter. If your team needs a PM who owns results\u2014not just roadmaps\u2014let\u2019s talk.'
}
};

const STORAGE_KEY = 'portfolioMode';

function isPMMode() {
const params = new URLSearchParams(window.location.search);
if (params.has('pm')) {
const val = params.get('pm');
if (val !== '0') {
sessionStorage.setItem(STORAGE_KEY, 'pm');
return true;
} else {
sessionStorage.setItem(STORAGE_KEY, 'ux');
return false;
}
}

return sessionStorage.getItem(STORAGE_KEY) === 'pm';
}

function setText(el, text, isHTML) {
if (!el) return;
if (isHTML) {
el.innerHTML = text;
} else {
el.textContent = text;
}
}

function applyPM() {
document.title = PM.title;

const metaDesc = document.querySelector('meta[name="description"]');
if (metaDesc) metaDesc.content = PM.metaDescription;

setText(document.querySelector('.hero-subtitle'), PM.heroSubtitle);
setText(document.querySelector('.hero-description'), PM.heroDescription, true);

const heroCredTexts = document.querySelectorAll('.hero-cred-text');
heroCredTexts.forEach((el, i) => {
if (PM.heroCred[i]) el.textContent = PM.heroCred[i];
});

const s = PM.sections;

const whyWork = document.querySelector('.why-work');
if (whyWork) {
setText(whyWork.querySelector('.section-title'), s['why-work'].title);
setText(whyWork.querySelector('.section-description'), s['why-work'].description);
}

const splitCards = document.querySelectorAll('.split-card');
splitCards.forEach((card, i) => {
if (!PM.splitCards[i]) return;
const before = card.querySelector('.split-before');
const after = card.querySelector('.split-after');
if (before) {
setText(before.querySelector('.split-title'), PM.splitCards[i].beforeTitle);
setText(before.querySelector('.split-desc'), PM.splitCards[i].beforeDesc);
}
if (after) {
setText(after.querySelector('.split-title'), PM.splitCards[i].afterTitle);
setText(after.querySelector('.split-desc'), PM.splitCards[i].afterDesc);
}
});

const caseStudies = document.querySelector('.featured-case-studies');
if (caseStudies) {
setText(caseStudies.querySelector('.section-title'), s['featured-case-studies'].title);
setText(caseStudies.querySelector('.section-description'), s['featured-case-studies'].description);
}

const selectedWork = document.querySelector('.selected-work');
if (selectedWork) {
setText(selectedWork.querySelector('.section-title'), s['selected-work'].title);
setText(selectedWork.querySelector('.section-description'), s['selected-work'].description);
}

const results = document.querySelector('.results-section');
if (results) {
setText(results.querySelector('.results-title'), s['results'].title);
setText(results.querySelector('.results-subtitle'), s['results'].subtitle);
}

const process = document.querySelector('.delivery-process');
if (process) {
setText(process.querySelector('.section-title'), s['process'].title);
setText(process.querySelector('.section-description'), s['process'].description);
}

const processSteps = document.querySelectorAll('.process-step');
processSteps.forEach((step, i) => {
if (!PM.processSteps[i]) return;
setText(step.querySelector('.process-step-title'), PM.processSteps[i].title);
setText(step.querySelector('.process-step-desc'), PM.processSteps[i].desc);
});

const caps = document.querySelector('.capabilities');
if (caps) {
setText(caps.querySelector('.capabilities-intro h2'), s['capabilities'].title);
setText(caps.querySelector('.capabilities-intro p:not(.section-kicker)'), s['capabilities'].intro);
setText(caps.querySelector('.capability-note p'), s['capabilities'].note);
}

const capCategories = ['products', 'constraints', 'platforms', 'collaboration', 'delivery'];
document.querySelectorAll('.capability-card').forEach((card, i) => {
if (!capCategories[i]) return;
setText(card.querySelector('.capability-card-desc'), PM.capabilityCards[capCategories[i]]);
});

const aboutSection = document.querySelector('.about-section');
if (aboutSection) {
const aboutContent = aboutSection.querySelector('.about-content-side');
setText(aboutContent.querySelector('h2'), PM.about.title);
const aboutPs = aboutContent.querySelectorAll(':scope > p:not(.section-kicker)');
setText(aboutPs[0], PM.about.p1, true);
setText(aboutPs[1], PM.about.p2, true);
setText(aboutContent.querySelector('.about-quote'), PM.about.quote);
}

setText(document.querySelector('.contact-title'), PM.cta.title);
setText(document.querySelector('.contact-description'), PM.cta.description);

setText(document.querySelector('.footer-title'), PM.footerTitle);

document.body.classList.add('mode-pm');
}

if (isPMMode()) {
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', applyPM);
} else {
applyPM();
}
}

})();
