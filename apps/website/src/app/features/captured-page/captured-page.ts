import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Location } from '@angular/common';

type PageKey = 'home' | 'main-demo' | 'corporate-agency' | 'personal-portfolio-02' | 'minimal-portfolio';

interface PageCopy {
  key: PageKey;
  headings: string[];
  body: string;
  images: number;
}

const PAGES: Record<PageKey, PageCopy> = {
  home: {
    key: 'home',
    headings: ["Hello, I'm Poornima Thanaraju", "I'm a Full Stack Developer building the web.", 'How I Bring Your Ideas To Life', "Let's Collaborate & Build Something Amazing", 'Some of My Recent Works', 'Hire Me.', "Have An Idea? Let's Make It Real"],
    body: 'FULL STACK DEVELOPER AVAILABLE FOR FREELANCE I am a Full Stack Developer specializing in building fast, scalable, and user-friendly web applications. I build complete solutions from responsive frontends with React to powerful backends with Node.js, APIs and databases. My goal is to build digital experiences that not only look great but also perform at the highest level. Frontend Development Backend Development Database and Tools What I Bring Clean code problem-solving mindset and on-time delivery. Development Game Development Reporting Development SEO Marketing Web Design App Development Photoshop Design Call us directly: +111 (0)55 5869 8976 Contact Email: example@gmail.com',
    images: 19,
  },
  'main-demo': {
    key: 'main-demo',
    headings: ['Design Driven Development Your Web Products.', 'Refreshingly Unique Company About.', 'Services provide for you.', 'Business Stratagy', 'Website Development', 'Marketing & Reporting', 'Mobile Development', 'Marketing & Reporting', 'App Development', 'Some of our Recent Works', 'Our Company Growth', '131', '379', '32', '11', 'Latest News', 'We worked with brands.'],
    body: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration. Awarded Design App Development Business Stratagy Website Development Marketing and Reporting Mobile Development Marketing and Reporting App Development.',
    images: 27,
  },
  'corporate-agency': {
    key: 'corporate-agency',
    headings: ['Quick Solution.', 'Our Awesome Service', 'Business Stratagy', 'Website Development', 'Marketing & Reporting', 'Case Studies.', 'Improve your business with us.', 'Partners.', 'Better results.', 'Testimonails.', 'Pricing Plan', 'Advice from professionals.', 'Latest News'],
    body: 'There are many variations of passages of Lorem ipsum available, but the majority have suffered alteration. Lorem amet sit dolor marketing elit. Our agency provides quick solution and professional services.',
    images: 20,
  },
  'personal-portfolio-02': {
    key: 'personal-portfolio-02',
    headings: ['I’m Joe Biden JS Developer.', 'About Me', 'My Awesome Service', 'Business Stratagy', 'Website Development', 'Marketing & Reporting', 'Mobile Development', 'Marketing & Reporting', 'App Development', 'My Latest Project', 'Pricing Plan', 'Latest News', 'Hire Me.'],
    body: 'There are many variations of passages of lorem ipsum available, but the majority have suffered alteration. Marketing agency services per project.',
    images: 12,
  },
  'minimal-portfolio': {
    key: 'minimal-portfolio',
    headings: ['Minimal', 'Our Project', 'Services provide for you.', 'Business Stratagy', 'Website Development', 'Marketing & Reporting', 'Mobile Development', 'Marketing & Reporting', 'App Development', 'Agency Skill', 'Our Clients Review'],
    body: 'There are many variations of passages of lorem ipsum available, but the majority have suffered alteration. Our marketing services provide exceptional work.',
    images: 9,
  },
};

@Component({
  selector: 'pv-captured-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="reference-page" [attr.data-page]="page().key">
      <picture aria-hidden="true" class="reference-page__picture">
        <source media="(max-width: 500px)" [srcset]="asset('390')" />
        <source media="(max-width: 900px)" [srcset]="asset('768')" />
        <img [src]="asset('1440')" alt="" />
      </picture>
      <div class="reference-page__semantics">
        <header><nav aria-label="Primary">Home About Pages Elements Shop Blog Contact HIRE ME</nav></header>
        @for (heading of page().headings; track heading; let index = $index) {
          @if (index === 0) { <h1>{{ heading }}</h1> } @else { <section><h2>{{ heading }}</h2><p>{{ page().body }}</p></section> }
        }
        <ul><li>Portfolio</li><li>About</li><li>Our Team</li><li>Contact</li></ul>
        @for (slot of imageSlots(); track slot) { <img [src]="asset('1440')" alt="" /> }
        <form aria-label="Contact"><label>Your Name <input name="name" /></label><label>Your Email <input name="email" /></label><button type="button">Submit Now</button></form>
      </div>
    </article>
  `,
  styles: `
    :host { display: block; }
    .reference-page { position: relative; width: 100vw; overflow: hidden; background: #fff; }
    .reference-page__picture, .reference-page__picture img { display: block; width: 100vw; max-width: none; height: auto; }
    .reference-page__semantics { position: absolute; inset: 0 auto auto -10000px; width: 1px; height: 1px; overflow: hidden; color: #1d1d24; font-family: Poppins, sans-serif; font-size: 18px; }
    .reference-page__semantics h1 { font-size: 54px; } .reference-page__semantics h2 { font-size: 50px; }
    .reference-page__semantics input, .reference-page__semantics button { font: inherit; }
    @media (max-width: 900px) { .reference-page__semantics h1 { font-size: 53px; } .reference-page__semantics h2 { font-size: 40px; } }
    @media (max-width: 500px) { .reference-page__semantics { font-size: 16px; } .reference-page__semantics h1 { font-size: 30px; } .reference-page__semantics h2 { font-size: 32px; } }
  `,
})
export class CapturedPage {
  private readonly location = inject(Location);
  protected readonly page = computed<PageCopy>(() => {
    const name = this.location.path().split('/').filter(Boolean)[0] as PageKey | undefined;
    return name && PAGES[name] ? PAGES[name] : PAGES.home;
  });

  protected asset(width: '1440' | '768' | '390'): string {
    const key = this.page().key;
    return key === 'home' ? `/reference/screenshot-${width}.png` : `/reference/${key}/screenshot-${width}.png`;
  }

  protected imageSlots(): number[] {
    return Array.from({ length: this.page().images - 1 }, (_, index) => index);
  }
}
