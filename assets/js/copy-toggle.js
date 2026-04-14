/**
 * Copy Toggle System - Switches between UX Designer and Product Manager copy
 * Usage: index.html (default) = UX mode, index.html#prodmgr = PM mode
 */
(function() {
    'use strict';

    // Copy configurations
    const COPY_CONFIG = {
        ux: {
            title: 'Tin Yat Kwok | Senior UX Designer — Concepts to Shipped Products',
            metaDescription: 'Senior UX Designer with 16 years turning ideas into launched products. End-to-end delivery for teams that ship.',
            heroSubtitle: 'Senior UX Designer with 16 years turning ideas into launched products.',
            heroDescription: 'From concept sketches to production code, I design experiences that ship. Specialized in bringing clarity to messy requirements—regulatory constraints, legacy systems, and competing stakeholder needs included.',
            whyWorkSubtitle: 'Hire a designer who understands what it takes to ship—beyond the mockups.',
            shippedWorkSubtitle: 'Three projects demonstrating end-to-end delivery—from early concepts to launched features used by millions.',
            resultsSubtitle: 'These metrics come from shipped products in production—real users, real outcomes.',
            capabilitiesNote: '"Design is only successful when it ships. My job isn\'t done when the mockup looks good—it\'s done when users are successfully completing tasks in production."',
            aboutTitle: '16 years of learning how products actually ship',
            aboutText1: 'I started as a visual designer and grew into UX leadership by shipping—again and again. Banks, trading platforms, startups. What I\'ve learned: the best designers understand what happens <em>after</em> they hit "export."',
            aboutText2: '<strong>Design is a means to an end.</strong> The end is a product in users\' hands that solves their problem. Everything else—process, frameworks, awards—is noise if it doesn\'t ship.',
            aboutQuote: 'I design with implementation in mind. Not because I write code, but because I respect what it takes to build. That respect shapes every decision I make.',
            ctaTitle: 'Ready to ship something?',
            ctaDescription: 'I\'m open to senior UX opportunities where getting to launch matters as much as the design itself.',
            footerTitle: 'Senior UX Designer — End-to-End Delivery'
        },
        pm: {
            title: 'Tin Yat Kwok | Senior Product Manager — Strategy to Launch',
            metaDescription: 'Senior Product Manager with 16 years shipping products from concept to launch. End-to-end ownership for teams that deliver outcomes.',
            heroSubtitle: 'Senior Product Manager with 16 years shipping products from strategy to launch.',
            heroDescription: 'From market opportunity to shipped product, I lead cross-functional teams through the full product lifecycle—defining strategy, aligning stakeholders, and delivering measurable outcomes.',
            whyWorkSubtitle: 'Hire a product leader who ships outcomes—not just features.',
            shippedWorkSubtitle: 'Three projects demonstrating product ownership—from problem definition to measurable business outcomes.',
            resultsSubtitle: 'These metrics come from products I\'ve led to market—real business outcomes, not just outputs.',
            capabilitiesNote: '"Product management is only successful when it delivers outcomes. My job isn\'t done when the feature ships—it\'s done when customers and business see the value."',
            aboutTitle: '16 years shipping products customers love',
            aboutText1: 'I started in product at banks and fintechs, learning how to ship in regulated, complex environments. Through product management across banking, trading, and platforms, I\'ve learned: the best PMs understand what happens <em>before</em> and <em>after</em> the launch.',
            aboutText2: '<strong>Product is the bridge between customer problems and business outcomes.</strong> The goal is value delivered—not just features shipped. Everything else is noise if it doesn\'t move the needle.',
            aboutQuote: 'I lead with customer empathy and business clarity. Not because I have all the answers, but because I know how to align teams around the right questions—and guide them to solutions that work.',
            ctaTitle: 'Ready to build something meaningful?',
            ctaDescription: 'I\'m open to senior Product Management opportunities where strategy, execution, and outcomes matter.',
            footerTitle: 'Senior Product Manager — Strategy to Launch'
        }
    };

    // Value props config
    const VALUE_PROPS = {
        ux: [
            { title: 'Ship-ready designs', desc: 'Annotated specs, edge cases documented, and developer handoff that actually works.' },
            { title: 'Cross-functional alignment', desc: 'I bring product, engineering, and stakeholders along—design reviews that build consensus.' },
            { title: 'Real-world constraints', desc: 'Legacy systems, compliance needs, technical debt—I design with reality in mind.' },
            { title: 'Validated decisions', desc: 'Every major design backed by testing, metrics, or pilot data—not just intuition.' }
        ],
        pm: [
            { title: 'Strategy to execution', desc: 'Customer research, market analysis, product strategy, and roadmaps that teams can actually deliver on.' },
            { title: 'Cross-functional leadership', desc: 'I align engineering, design, and business stakeholders—creating clarity and momentum across teams.' },
            { title: 'Shipping with constraints', desc: 'Regulatory requirements, technical debt, competing priorities—I navigate complexity while keeping teams focused.' },
            { title: 'Data-informed decisions', desc: 'Every product decision backed by research, metrics, and customer validation—not assumptions.' }
        ]
    };

    // Capabilities config
    const CAPABILITIES = {
        ux: {
            products: 'Onboarding, core workflows, transaction flows, account management, platform features',
            constraints: 'Regulatory compliance, legacy system integration, accessibility requirements, localization',
            platforms: 'iOS/Android native, responsive web, hybrid apps, design systems at scale',
            collaboration: 'Product managers, engineers, legal/compliance, executives, multi-disciplinary teams',
            delivery: 'Research, testing, prototyping, design systems, handoff specs, post-launch iteration'
        },
        pm: {
            products: 'Product strategy, user research, roadmap planning, feature prioritization, go-to-market',
            constraints: 'Regulatory compliance, stakeholder management, resource planning, risk assessment',
            platforms: 'Mobile, web, native apps—experience across B2B and B2C platforms at scale',
            collaboration: 'Engineering, design, legal, marketing, executives—aligning diverse teams to outcomes',
            delivery: 'Discovery, experimentation, agile delivery, launch planning, post-launch iteration'
        }
    };

    // Delivery process config
    const PROCESS_STEPS = {
        ux: [
            { title: 'Understand', desc: 'User needs, business goals, technical constraints' },
            { title: 'Define', desc: 'Scope, success metrics, stakeholder alignment' },
            { title: 'Design', desc: 'Concepts, prototypes, iteration with feedback' },
            { title: 'Validate', desc: 'Usability testing, pilot metrics, stakeholder reviews' },
            { title: 'Ship', desc: 'Handoff, QA, launch, and post-release iteration' }
        ],
        pm: [
            { title: 'Discover', desc: 'Market research, customer needs, business goals, competitive analysis' },
            { title: 'Define', desc: 'Product strategy, success metrics, roadmap alignment, scope decisions' },
            { title: 'Design', desc: 'Partner with design on solutions, user flows, experience validation' },
            { title: 'Validate', desc: 'Customer research, pilot metrics, stakeholder buy-in, business case' },
            { title: 'Deliver', desc: 'Launch planning, go-to-market, post-launch optimization, iteration' }
        ]
    };

    const STORAGE_KEY = 'portfolioMode';

    function getMode() {
        const params = new URLSearchParams(window.location.search);
        const urlMode = params.get('pm');

        // URL param takes precedence and updates sessionStorage
        if (urlMode === '1') {
            sessionStorage.setItem(STORAGE_KEY, 'pm');
            return 'pm';
        } else if (urlMode === '0') {
            sessionStorage.setItem(STORAGE_KEY, 'ux');
            return 'ux';
        }

        // Fall back to sessionStorage, then default to 'ux'
        return sessionStorage.getItem(STORAGE_KEY) || 'ux';
    }

    function updateTextContent(selector, text, isHTML = false) {
        const el = document.querySelector(selector);
        if (!el) return;
        if (isHTML) {
            el.innerHTML = text;
        } else {
            el.textContent = text;
        }
    }

    function updateMode() {
        const mode = getMode();
        const copy = COPY_CONFIG[mode];

        // Update document title
        document.title = copy.title;

        // Update meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.content = copy.metaDescription;
        }

        // Update hero section
        updateTextContent('.hero-subtitle', copy.heroSubtitle);
        updateTextContent('.hero-description', copy.heroDescription, true);

        // Update section subtitles
        const whyWorkSection = document.querySelector('.why-work .section-description');
        if (whyWorkSection) whyWorkSection.textContent = copy.whyWorkSubtitle;

        const shippedWorkSection = document.querySelector('.featured-case-studies .section-description');
        if (shippedWorkSection) shippedWorkSection.textContent = copy.shippedWorkSubtitle;

        const resultsSubtitle = document.querySelector('.results-subtitle');
        if (resultsSubtitle) resultsSubtitle.textContent = copy.resultsSubtitle;

        // Update value props
        const valueProps = document.querySelectorAll('.value-prop');
        valueProps.forEach((prop, index) => {
            if (VALUE_PROPS[mode][index]) {
                const titleEl = prop.querySelector('.value-prop-title');
                const descEl = prop.querySelector('.value-prop-desc');
                if (titleEl) titleEl.textContent = VALUE_PROPS[mode][index].title;
                if (descEl) descEl.textContent = VALUE_PROPS[mode][index].desc;
            }
        });

        // Update capabilities note
        const capabilitiesNote = document.querySelector('.capability-note p');
        if (capabilitiesNote) capabilitiesNote.textContent = copy.capabilitiesNote;

        // Update capabilities table
        const capabilityRows = document.querySelectorAll('.capability-row');
        const categories = ['products', 'constraints', 'platforms', 'collaboration', 'delivery'];
        capabilityRows.forEach((row, index) => {
            if (categories[index]) {
                const listEl = row.querySelector('.capability-list');
                if (listEl) listEl.textContent = CAPABILITIES[mode][categories[index]];
            }
        });

        // Update process steps
        const processSteps = document.querySelectorAll('.process-step');
        processSteps.forEach((step, index) => {
            if (PROCESS_STEPS[mode][index]) {
                const titleEl = step.querySelector('.process-step-title');
                const descEl = step.querySelector('.process-step-desc');
                if (titleEl) titleEl.textContent = PROCESS_STEPS[mode][index].title;
                if (descEl) descEl.textContent = PROCESS_STEPS[mode][index].desc;
            }
        });

        // Update about section
        const aboutTitle = document.querySelector('.about-content-side h2');
        if (aboutTitle) aboutTitle.textContent = copy.aboutTitle;

        const aboutParagraphs = document.querySelectorAll('.about-content-side > p');
        if (aboutParagraphs[0]) aboutParagraphs[0].innerHTML = copy.aboutText1;
        if (aboutParagraphs[1]) aboutParagraphs[1].innerHTML = copy.aboutText2;

        const aboutQuote = document.querySelector('.about-quote');
        if (aboutQuote) aboutQuote.textContent = copy.aboutQuote;

        // Update CTA section
        updateTextContent('.contact-title', copy.ctaTitle);
        updateTextContent('.contact-description', copy.ctaDescription);

        // Update footer
        updateTextContent('.footer-title', copy.footerTitle);

        // Add mode class to body for any CSS overrides
        document.body.classList.remove('mode-ux', 'mode-pm');
        document.body.classList.add('mode-' + mode);
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateMode);
    } else {
        updateMode();
    }

        })();
