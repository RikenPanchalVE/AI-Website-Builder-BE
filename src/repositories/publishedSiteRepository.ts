import PublishedSite, { IPublishedSite } from "../models/PublishedSite";
import Project from "../models/Project";
import WebsiteSpecification from "../models/WebsiteSpecification";
import ApiError from "../utils/ApiError";
import fs from "fs";
import path from "path";
import { GENERATED_DIR } from "../config/constants";

interface ThemeData {
  style?: string;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  foregroundColor?: string;
  mutedColor?: string;
  mutedForegroundColor?: string;
  borderColor?: string;
  cardColor?: string;
  fontFamily?: string;
  borderRadius?: string;
  buttonStyle?: string;
  animations?: boolean | string;
}

interface SiteSpec {
  name?: string;
  description?: string;
  logo?: string | null;
  theme?: ThemeData;
  pages?: Array<{
    slug: string;
    title: string;
    sections: Array<{
      id: string;
      component: string;
      props: Record<string, any>;
      order: number;
    }>;
  }>;
  navigation?: {
    items?: Array<{ label: string; href: string; children?: Array<{ label: string; href: string }> }>;
  };
  footer?: {
    copyright?: string;
    links?: Array<{ label: string; href: string }>;
    socialMedia?: Record<string, string>;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

const esc = (str: unknown): string =>
  String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const ph = (text: string, w = 400, h = 400): string =>
  `https://placehold.co/${w}x${h}?text=${encodeURIComponent(text)}&bg=f3f4f6&color=9ca3af`;

const starsHtml = (rating: number): string => {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  let html = "";
  for (let i = 0; i < 5; i++) {
    if (i < full)
      html += '<svg class="si sf" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';
    else if (i === full && half)
      html += '<svg class="si sh" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';
    else
      html += '<svg class="si se" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>';
  }
  return `<span class="stars">${html}</span>`;
};

const brClass = (val?: string): string => {
  switch (val) {
    case "none": return "";
    case "small": return "r-sm";
    case "large": return "r-lg";
    case "0": return "";
    case "2px": return "r-sm";
    case "4px": return "r-sm";
    case "6px": return "r-sm";
    case "8px": return "r-md";
    case "10px": return "r-md";
    case "12px": return "r-md";
    case "16px": return "r-lg";
    case "20px": return "r-lg";
    case "24px": return "r-lg";
    default: return "r-md";
  }
};

const btnClass = (val?: string): string => {
  switch (val) {
    case "pill": return "b-pill";
    case "square": return "b-sq";
    default: return "b-def";
  }
};

const renderMobileNav = (
  items: Array<{ label: string; href: string; children?: Array<{ label: string; href: string }> }>
): string =>
  items.map(item => {
    if (item.children && item.children.length > 0)
      return `<div class="mnav-k">${esc(item.label)}</div><div class="mnav-s">${item.children.map(c => `<a href="${esc(c.href)}">${esc(c.label)}</a>`).join("")}</div>`;
    return `<a href="${esc(item.href)}" class="mnav-k">${esc(item.label)}</a>`;
  }).join("");

const renderNavigation = (
  siteName: string,
  navItems: Array<{ label: string; href: string; children?: Array<{ label: string; href: string }> }>,
  logo?: string | null
): string => {
  const items = navItems.map(item => {
    if (item.children && item.children.length > 0)
      return `<div class="nav-dd"><a href="${esc(item.href)}" class="nav-k">${esc(item.label)} <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" style="margin-left:2px;vertical-align:middle"><path d="M3 5l3 3 3-3"/></svg></a><div class="nav-dd-m">${item.children.map(c => `<a href="${esc(c.href)}" class="nav-dd-i">${esc(c.label)}</a>`).join("")}</div></div>`;
    return `<a href="${esc(item.href)}" class="nav-k">${esc(item.label)}</a>`;
  }).join("");

  const logoHtml = logo
    ? `<img src="${esc(logo)}" alt="${esc(siteName)}" style="height:32px;width:auto" />`
    : esc(siteName);

  return `
  <input type="checkbox" id="mtog" class="mtog" />
  <nav class="nav" id="main-nav">
    <div class="nav-in">
      <a href="/" class="nav-l">${logoHtml}</a>
      <div class="nav-ks">${items}</div>
      <div class="nav-a">
        <button class="nav-ab" aria-label="Search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg></button>
        <button class="nav-ab" aria-label="Account"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></button>
        <!-- TODO: Uncomment cart icon when eCommerce is implemented -->
        <!-- <a href="/cart" class="nav-ab" aria-label="Cart"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg><span class="cc" style="display:none">0</span></a> -->
        <!-- TODO: Uncomment wishlist icon when eCommerce is implemented -->
        <!-- <a href="/wishlist" class="nav-ab hid md:flex" aria-label="Wishlist"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg><span class="cc wish-h" style="display:none;background:var(--err);top:2px">0</span></a> -->
        <label for="mtog" class="ham" aria-label="Menu"><span></span><span></span><span></span></label>
      </div>
    </div>
  </nav>
  <div class="mnav" id="mnav">${renderMobileNav(navItems)}</div>`;
};

const renderFooter = (
  footer: { copyright?: string; links?: Array<{ label: string; href: string }>; socialMedia?: Record<string, string> },
  siteName: string
): string => {
  const links = footer.links || [];
  const socialMedia = footer.socialMedia || {};
  const ql = links.slice(0, 5);
  const sl = links.slice(5, 10);
  const socialLinks = Object.entries(socialMedia).filter(([, url]) => url && url !== "#");
  return `<footer class="footer"><div class="ftg">
    <div class="ftb"><div class="ftbn">${esc(siteName)}</div><p class="ftbd">Premium products and exceptional shopping experience. We bring you the best quality with outstanding customer service.</p>
      <div class="fts">
        ${socialMedia.facebook ? `<a href="${esc(socialMedia.facebook)}" aria-label="Facebook" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg></a>` : `<a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg></a>`}
        ${socialMedia.instagram ? `<a href="${esc(socialMedia.instagram)}" aria-label="Instagram" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5"/></svg></a>` : `<a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5"/></svg></a>`}
        ${socialMedia.twitter ? `<a href="${esc(socialMedia.twitter)}" aria-label="Twitter" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>` : `<a href="#" aria-label="Twitter"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>`}
        ${socialMedia.youtube ? `<a href="${esc(socialMedia.youtube)}" aria-label="YouTube" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>` : `<a href="#" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>`}
        ${socialMedia.linkedin ? `<a href="${esc(socialMedia.linkedin)}" aria-label="LinkedIn" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>` : ""}
      </div>
    </div>
    <div><div class="fth">Quick Links</div><ul class="ftl">${ql.length > 0 ? ql.map(l => `<li><a href="${esc(l.href)}">${esc(l.label)}</a></li>`).join("") : `<li><a href="/">Home</a></li><li><a href="/about_us">About</a></li><li><a href="/contact_us">Contact</a></li>`}</ul></div>
    <div><div class="fth">Customer Service</div><ul class="ftl">${sl.length > 0 ? sl.map(l => `<li><a href="${esc(l.href)}">${esc(l.label)}</a></li>`).join("") : `<li><a href="/contact_us">Contact Us</a></li><li><a href="/faq">FAQ</a></li><li><a href="/shipping">Shipping &amp; Returns</a></li><li><a href="/privacy_policy">Privacy Policy</a></li>`}</ul></div>
    <div><div class="fth">Contact Info</div><ul class="ftl">
      <li style="margin-bottom:14px"><a href="/contact_us" style="display:flex;align-items:center;gap:8px"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>Get in Touch</a></li>
      <li style="margin-bottom:14px"><a href="mailto:info@example.com" style="display:flex;align-items:center;gap:8px"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>info@example.com</a></li>
      <li style="display:flex;align-items:center;gap:8px;color:#9ca3af"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>(555) 123-4567</li>
    </ul></div>
  </div>
  <div class="ftbt">
    <div class="ftc">${esc(footer.copyright || `\u00a9 ${new Date().getFullYear()} ${esc(siteName)}. All rights reserved.`)}</div>
    <div class="ftp"><span class="ftpb">Visa</span><span class="ftpb">Mastercard</span><span class="ftpb">Amex</span><span class="ftpb">PayPal</span><span class="ftpb">Apple Pay</span></div>
  </div></footer>`;
};

const renderComponent = (component: string, props: Record<string, any>, theme?: ThemeData): string => {
  const p = props || {};
  const r = brClass(theme?.borderRadius);
  const b = btnClass(theme?.buttonStyle);
  const pri = theme?.primaryColor || "#1e3a5f";
  const sec = theme?.secondaryColor || "#2563eb";

  switch (component) {

    // TODO: Uncomment HeroEcommerce when eCommerce is implemented
    // case "HeroEcommerce":
    //   return `<section class="hero" style="background:${p.backgroundImage ? `url('${esc(p.backgroundImage)}') center/cover no-repeat` : `linear-gradient(135deg,${pri},${sec})`}">
    //     <div class="hero-ov"></div>
    //     <div class="hero-c">
    //       ${p.badge ? `<div class="hero-b">${esc(p.badge)}</div>` : ""}
    //       <h1 class="hero-t">${esc(p.headline)}</h1>
    //       <p class="hero-s">${esc(p.subheadline)}</p>
    //       <div class="hero-a">
    //         ${p.ctaText ? `<a href="${esc(p.ctaLink || "#")}" class="btn bp blg ${b}">${esc(p.ctaText)}</a>` : ""}
    //         ${p.ctaText2 ? `<a href="${esc(p.ctaLink2 || "#")}" class="btn bs2 blg ${b}" style="border-color:#fff;color:#fff">${esc(p.ctaText2)}</a>` : ""}
    //       </div>
    //     </div>
    //   </section>`;

    case "Hero1":
    case "Hero2":
    case "Hero3":
      return `<section class="hero" style="background:${p.backgroundImage ? `url('${esc(p.backgroundImage)}') center/cover no-repeat` : `linear-gradient(135deg,${pri},${sec})`}"><div class="hero-ov"></div><div class="hero-c">${p.badge ? `<div class="hero-b">${esc(p.badge)}</div>` : ""}<h1 class="hero-t">${esc(p.headline || p.title || "")}</h1><p class="hero-s">${esc(p.subheadline || p.description || "")}</p><div class="hero-a">${p.ctaText ? `<a href="${esc(p.ctaLink || "#")}" class="btn bp blg ${b}" style="padding:18px 40px;font-size:1.05rem">${esc(p.ctaText)}</a>` : ""}${p.secondaryCtaText ? `<a href="${esc(p.secondaryCtaLink || "#")}" class="btn bs2 blg ${b}" style="border-color:#fff;color:#fff;padding:18px 40px;font-size:1.05rem">${esc(p.secondaryCtaText)}</a>` : ""}</div></div></section>`;

    // TODO: Uncomment FeaturedCategories when eCommerce is implemented
    // case "FeaturedCategories":
    //   return `<section class="py16"><div class="ct">
    //     <div class="sh"><div><div class="sh-sub">Browse</div><h2 class="sh-t">${esc(p.title || "Shop by Category")}</h2>${p.subtitle ? `<p class="sh-d">${esc(p.subtitle)}</p>` : ""}</div></div>
    //     <div class="gr gc2 md:gc4 g6">
    //       ${(p.categories || []).map((c: any) => `<a href="${esc(c.href || "#")}" class="pc" data-category-filter="${esc(c.slug || c.name || '')}" style="text-decoration:none"><div class="pci" style="aspect-ratio:4/3"><img src="${esc(c.image || ph(c.name || "Category", 400, 300))}" alt="${esc(c.name)}" class="pcimg" /><div class="pco" style="border-radius:inherit"><span class="btn bw bsm ${b}">Shop Now</span></div></div><div class="pcbd tc"><div class="pcbn" style="white-space:normal">${esc(c.name)}</div>${c.count ? `<div class="pcbc">${esc(c.count)} items</div>` : ""}</div></a>`).join("")}
    //     </div>
    //   </div></section>`;

    // TODO: Uncomment BestSellers/FeaturedProducts when eCommerce is implemented
    // case "BestSellers":
    // case "FeaturedProducts":
    //   return `<section class="py16 bga"><div class="ct">
    //     <div class="sh"><div><div class="sh-sub">Top Picks</div><h2 class="sh-t">${esc(p.title || (component === "BestSellers" ? "Best Sellers" : "Featured Products"))}</h2>${p.subtitle ? `<p class="sh-d">${esc(p.subtitle)}</p>` : ""}</div></div>
    //     <div class="gr gc2 md:gc4 g6">
    //       ${(p.products || []).map((pr: any) => {
    //     const pid = `p_${esc(pr.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'item')}`;
    //     const prodData = JSON.stringify({ id: pid, name: pr.name, price: pr.price, image: pr.image || ph(pr.name || "Product"), category: pr.category || '' });
    //     return `<div class="pc" data-product-card data-searchable data-search-name="${esc(pr.name || '')}" data-search-category="${esc(pr.category || '')}" data-price="${esc(pr.price || '0')}" data-rating="${esc(pr.rating || '0')}"><div class="pci"><img src="${esc(pr.image || ph(pr.name || "Product"))}" alt="${esc(pr.name)}" class="pcimg" /><div class="pcb">${pr.isNew ? '<span class="badge bdg-n">New</span>' : ""}${pr.discount ? `<span class="badge bdg-s">-${esc(pr.discount)}%</span>` : ""}</div><div class="pco"><button class="btn bw bsm ${b}">Quick View</button><button class="btn bp bsm ${b}" data-add-to-cart='${prodData}'>Add to Cart</button></div></div><div class="pcbd">${pr.category ? `<div class="pcbc">${esc(pr.category)}</div>` : ""}<div class="pcbn">${esc(pr.name)}</div>${pr.rating ? `<div class="mb1">${starsHtml(pr.rating)}</div>` : ""}<div class="pcbp"><span class="cur" style="color:${pri}">$${esc(pr.price || "0")}</span>${pr.originalPrice ? `<span class="org">$${esc(pr.originalPrice)}</span>` : ""}</div><button class="btn bk bbl bsm ${b} mt4" data-add-to-cart='${prodData}'>Add to Cart</button></div></div>`;
    //   }).join("")}
    //     </div>
    //   </div></section>`;

    // TODO: Uncomment NewArrivals when eCommerce is implemented
    // case "NewArrivals":
    //   return `<section class="py16"><div class="ct">
    //     <div class="sh"><div><div class="sh-sub">Just In</div><h2 class="sh-t">${esc(p.title || "New Arrivals")}</h2>${p.subtitle ? `<p class="sh-d">${esc(p.subtitle)}</p>` : ""}</div></div>
    //     <div class="gr gc2 md:gc4 g6">
    //       ${(p.products || []).map((pr: any) => {
    //     const pid = `p_${esc(pr.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'item')}`;
    //     const prodData = JSON.stringify({ id: pid, name: pr.name, price: pr.price, image: pr.image || ph(pr.name || "Product"), category: pr.category || '' });
    //     return `<div class="pc" data-product-card data-searchable data-search-name="${esc(pr.name || '')}" data-search-category="${esc(pr.category || '')}" data-price="${esc(pr.price || '0')}" data-rating="${esc(pr.rating || '0')}"><div class="pci"><img src="${esc(pr.image || ph(pr.name || "Product"))}" alt="${esc(pr.name)}" class="pcimg" /><div class="pcb"><span class="badge bdg-n">New</span></div><div class="pco"><button class="btn bw bsm ${b}">Quick View</button><button class="btn bp bsm ${b}" data-add-to-cart='${prodData}'>Add to Cart</button></div></div><div class="pcbd"><div class="pcbn">${esc(pr.name)}</div>${pr.rating ? `<div class="mb1">${starsHtml(pr.rating)}</div>` : ""}<div class="pcbp"><span class="cur" style="color:${pri}">$${esc(pr.price || "0")}</span>${pr.originalPrice ? `<span class="org">$${esc(pr.originalPrice)}</span>` : ""}</div><button class="btn bk bbl bsm ${b} mt4" data-add-to-cart='${prodData}'>Add to Cart</button></div></div>`;
    //   }).join("")}
    //     </div>
    //   </div></section>`;

    // TODO: Uncomment FlashSale when eCommerce is implemented
    // case "FlashSale":
    //   return `<section class="py16" style="background:linear-gradient(135deg,#fef2f2,#fff1f2)"><div class="ct">
    //     <div class="d dc md:d jcsb mb10 g6">
    //       <div><div class="sh-sub" style="color:var(--err)">Limited Time</div><h2 class="sh-t" style="text-align:left;margin-bottom:0">${esc(p.title || "Flash Sale")}</h2></div>
    //       <div class="d g3">
    //         <div class="tc" style="background:#111827;color:#fff;width:64px;height:64px;border-radius:var(--rmd);display:flex;flex-direction:column;align-items:center;justify-content:center"><div style="font-size:1.25rem;font-weight:700">${esc(p.countdown?.hours || "00")}</div><div style="font-size:.625rem;text-transform:uppercase;opacity:.7">Hours</div></div>
    //         <div class="tc" style="background:#111827;color:#fff;width:64px;height:64px;border-radius:var(--rmd);display:flex;flex-direction:column;align-items:center;justify-content:center"><div style="font-size:1.25rem;font-weight:700">${esc(p.countdown?.minutes || "00")}</div><div style="font-size:.625rem;text-transform:uppercase;opacity:.7">Mins</div></div>
    //         <div class="tc" style="background:#111827;color:#fff;width:64px;height:64px;border-radius:var(--rmd);display:flex;flex-direction:column;align-items:center;justify-content:center"><div style="font-size:1.25rem;font-weight:700">${esc(p.countdown?.seconds || "00")}</div><div style="font-size:.625rem;text-transform:uppercase;opacity:.7">Secs</div></div>
    //       </div>
    //     </div>
    //     <div class="gr gc2 md:gc4 g6">
    //       ${(p.products || []).map((pr: any) => {
    //     const pid = `p_${esc(pr.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'item')}`;
    //     const prodData = JSON.stringify({ id: pid, name: pr.name, price: pr.price, image: pr.image || ph(pr.name || "Sale"), category: pr.category || '' });
    //     return `<div class="pc" data-product-card data-searchable data-search-name="${esc(pr.name || '')}" data-search-category="${esc(pr.category || '')}" data-price="${esc(pr.price || '0')}" data-rating="${esc(pr.rating || '0')}"><div class="pci"><img src="${esc(pr.image || ph(pr.name || "Sale"))}" alt="${esc(pr.name)}" class="pcimg" /><div class="pcb">${pr.discount ? `<span class="badge bdg-s">-${esc(pr.discount)}%</span>` : ""}</div><div class="pco"><button class="btn bw bsm ${b}">Quick View</button><button class="btn br bsm ${b}" data-add-to-cart='${prodData}'>Add to Cart</button></div></div><div class="pcbd"><div class="pcbn">${esc(pr.name)}</div><div class="pcbp"><span class="cur tr5">$${esc(pr.price || "0")}</span>${pr.originalPrice ? `<span class="org">$${esc(pr.originalPrice)}</span>` : ""}</div><button class="btn br bbl bsm ${b} mt4" data-add-to-cart='${prodData}'>Add to Cart</button></div></div>`;
    //   }).join("")}
    //     </div>
    //   </div></section>`;

    case "WhyChooseUs":
      return `<section class="py16 bga"><div class="ct">
        <div class="sh"><div><div class="sh-sub">Our Promise</div><h2 class="sh-t">${esc(p.title || "Why Choose Us")}</h2></div></div>
        <div class="gr gc2 md:gc4 g8">
          ${(p.features || []).map((f: any) => `<div class="tc p6" style="background:var(--bgc);border-radius:var(--rlg);border:1px solid var(--bdr);transition:all .4s cubic-bezier(.4,0,.2,1);box-shadow:0 1px 3px rgba(0,0,0,.04)" onmouseover="this.style.boxShadow='0 20px 60px rgba(0,0,0,.1)';this.style.transform='translateY(-8px)'" onmouseout="this.style.boxShadow='0 1px 3px rgba(0,0,0,.04)';this.style.transform='none'"><div style="width:72px;height:72px;border-radius:20px;background:linear-gradient(135deg,var(--c1l),var(--c2l));color:${pri};display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:1.75rem">${esc(f.icon || "\u2605")}</div><h3 class="fs mb3" style="font-size:1.125rem">${esc(f.title)}</h3><p class="ts" style="color:var(--ctxl);line-height:1.7">${esc(f.description)}</p></div>`).join("")}
        </div>
      </div></section>`;

    case "Portfolio1":
    case "Portfolio2":
      return `<section class="py16"><div class="ct">
        <div class="sh"><div><div class="sh-sub">Portfolio</div><h2 class="sh-t">${esc(p.title || "Our Portfolio")}</h2>${p.subtitle ? `<p class="sh-d">${esc(p.subtitle)}</p>` : ""}</div></div>
        <div class="gr gc1 md:gc3 g8">
          ${(p.projects || []).map((item: any) => `<div class="pc" style="text-decoration:none;display:block"><div class="pci" style="aspect-ratio:16/9"><img src="${esc(item.image || ph(item.title || "Project", 600, 400))}" alt="${esc(item.title)}" class="pcimg" /><div class="pco" style="border-radius:inherit"><span class="btn bw bsm ${b}">View Project</span></div></div><div class="pcbd" style="padding:24px">${item.category ? `<div class="pcbc" style="color:${pri};font-size:.75rem;font-weight:700;letter-spacing:.05em">${esc(item.category)}</div>` : ""}<h3 class="fs mb2" style="font-size:1.125rem">${esc(item.title)}</h3>${item.description ? `<p style="color:var(--ctxl);font-size:.9375rem;line-height:1.7;margin-bottom:16px">${esc(item.description)}</p>` : ""}<a href="${esc(item.href || "#" + (item.slug || ""))}" class="btn bs2 bsm ${b}" style="margin-top:8px">View Project \u2192</a></div></div>`).join("")}
        </div>
      </div></section>`;

    case "Pricing1":
    case "Pricing2":
      return `<section class="py16 bga"><div class="ct">
        <div class="sh tc"><div><div class="sh-sub">Pricing</div><h2 class="sh-t">${esc(p.title || "Our Pricing")}</h2>${p.subtitle ? `<p class="sh-d">${esc(p.subtitle)}</p>` : ""}</div></div>
        <div class="gr gc1 md:gc3 g8">
          ${(p.plans || []).map((plan: any) => `<div style="background:var(--bgc);border:2px solid ${plan.popular ? pri : 'var(--bdr)'};border-radius:var(--rlg);padding:40px 32px;text-align:center;position:relative;transition:all .4s cubic-bezier(.4,0,.2,1);box-shadow:0 1px 3px rgba(0,0,0,.04)" onmouseover="this.style.boxShadow='0 20px 60px rgba(0,0,0,.1)';this.style.transform='translateY(-8px)'" onmouseout="this.style.boxShadow='0 1px 3px rgba(0,0,0,.04)';this.style.transform='none'">${plan.popular ? `<div style="position:absolute;top:-14px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,var(--c1),var(--c2));color:#fff;padding:6px 20px;border-radius:var(--rpl);font-size:.75rem;font-weight:700;letter-spacing:.05em;text-transform:uppercase;box-shadow:0 4px 12px var(--c1d)">Most Popular</div>` : ""}<h3 class="txl fb mb4" style="font-size:1.25rem">${esc(plan.name)}</h3><div class="d jcc aic g1 mb4"><span class="tx3 fb" style="color:${pri};letter-spacing:-.03em">${esc(plan.price)}</span>${plan.period ? `<span style="color:var(--ctxlr);font-size:.875rem">/${esc(plan.period)}</span>` : ""}</div>${plan.description ? `<p style="color:var(--ctxl);font-size:.9375rem;margin-bottom:28px;line-height:1.6">${esc(plan.description)}</p>` : ""}<div style="text-align:left;margin-bottom:28px">${(plan.features || []).map((f: any) => `<div class="d aic g3 mb3" style="font-size:.9375rem"><span style="color:var(--c1);font-weight:700;font-size:1rem">\u2713</span><span style="color:var(--ctxl)">${esc(f)}</span></div>`).join("")}</div><a href="${esc(plan.ctaLink || "#")}" class="btn ${plan.popular ? 'bp blg' : 'bw blg'} bbl ${b}" style="width:100%">${esc(plan.ctaText || "Get Started")}</a></div>`).join("")}
        </div>
      </div></section>`;

    case "Testimonials":
      return `<section class="py16"><div class="ct">
        <div class="sh"><div><div class="sh-sub">Testimonials</div><h2 class="sh-t">${esc(p.title || "What Our Customers Say")}</h2></div></div>
        <div class="gr gc1 md:gc3 g8">
          ${(p.testimonials || []).map((t: any) => `<div class="tc2"><img src="${esc(t.avatar || ph(t.name || "User", 80, 80))}" alt="${esc(t.name)}" class="tca" />${t.rating ? `<div class="mb3 d jcc">${starsHtml(t.rating)}</div>` : ""}<p class="tcq">&ldquo;${esc(t.quote || t.content)}&rdquo;</p><div class="tcn">${esc(t.name)}</div>${t.title ? `<div class="tcr">${esc(t.title)}</div>` : ""}</div>`).join("")}
        </div>
      </div></section>`;

    case "BrandShowcase":
      return `<section class="py16 bga"><div class="ct tc">
        <div class="sh"><div><h2 class="sh-t">${esc(p.title || "Our Brands")}</h2></div></div>
        <div class="d dw jcc aic g12" style="gap:48px">
          ${(p.brands || []).map((brd: any) => `<div style="opacity:.4;transition:all .3s ease;cursor:default" onmouseover="this.style.opacity='1';this.style.transform='scale(1.05)'" onmouseout="this.style.opacity='.4';this.style.transform='scale(1)'">${brd.logo ? `<img src="${esc(brd.logo)}" alt="${esc(brd.name)}" style="height:44px" />` : `<div class="txl fb tgr4" style="font-size:1.5rem;letter-spacing:-.02em">${esc(brd.name)}</div>`}</div>`).join("")}
        </div>
      </div></section>`;

    case "NewsletterSignup":
      return `<section class="nlb" style="background:linear-gradient(135deg,${pri},${sec})"><div class="csm" style="position:relative;z-index:1">
        <h2 class="tx3 fb mb3" style="color:#fff;letter-spacing:-.02em">${esc(p.title || "Subscribe to Our Newsletter")}</h2>
        <p class="tl mb8" style="opacity:.9;max-width:520px;margin-left:auto;margin-right:auto;line-height:1.7">${esc(p.subtitle || "Get the latest updates on new products and upcoming sales")}</p>
        <div class="nlf"><input type="email" placeholder="${esc(p.placeholder || "Enter your email address")}" class="inp" style="font-size:1rem;padding:16px 20px" /><button class="btn bw blg ${b}">${esc(p.buttonText || "Subscribe")}</button></div>
        <p class="tx mt4" style="opacity:.6">We respect your privacy. Unsubscribe at any time.</p>
      </div></section>`;

    case "InstagramFeed":
      return `<section class="py16"><div class="ct tc">
        <div class="sh"><div><div class="sh-sub">Social</div><h2 class="sh-t">${esc(p.title || "Follow Us on Instagram")}</h2>${p.handle ? `<p class="sh-d">@${esc(p.handle)}</p>` : ""}</div></div>
        <div class="gr gc2 md:gc6 g3">
          ${(p.images || []).map((img: string) => `<div style="position:relative;overflow:hidden;border-radius:var(--rlg);aspect-ratio:1;cursor:pointer"><img src="${esc(img || ph("Instagram", 300, 300))}" alt="Instagram post" style="width:100%;height:100%;object-fit:cover;transition:transform .6s cubic-bezier(.4,0,.2,1)" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'" /><div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,.5) 100%);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .3s ease" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0'"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg></div></div>`).join("")}
        </div>
      </div></section>`;

    case "FAQPreview":
    case "FAQAccordion":
      return `<section class="py16 bga"><div class="cxs">
        <div class="sh"><div><div class="sh-sub">FAQ</div><h2 class="sh-t">${esc(p.title || "Frequently Asked Questions")}</h2></div></div>
        ${(p.faqs || p.items || []).map((f: any, i: number) => `<details class="fi" ${i === 0 ? "open" : ""}><summary class="ftt"><span>${esc(f.question || f.title)}</span><span class="fti">+</span></summary><div class="fc">${esc(f.answer || f.content)}</div></details>`).join("")}
      </div></section>`;

    case "ContactPreview":
    case "ContactForm":
      return `<section class="py16 bga"><div class="cxs">
        <div class="sh"><div><div class="sh-sub">Contact</div><h2 class="sh-t">${esc(p.title || "Send Us a Message")}</h2></div></div>
        <form style="display:flex;flex-direction:column;gap:20px">
          <div class="gr gc2 g5"><div class="fl-wrap"><input type="text" placeholder=" " class="inp" /><label>Your Name</label></div><div class="fl-wrap"><input type="email" placeholder=" " class="inp" /><label>Your Email</label></div></div>
          <div class="fl-wrap"><input type="text" placeholder=" " class="inp" /><label>Subject</label></div>
          <div class="fl-wrap"><textarea placeholder=" " class="inp txa"></textarea><label>Your Message</label></div>
          <div><button type="submit" class="btn bp blg ${b}">${esc(p.submitText || "Send Message")}</button></div>
        </form>
      </div></section>`;

    case "StoreLocator":
      return `<section class="py16"><div class="ct">
        <div class="sh"><div><div class="sh-sub">Visit Us</div><h2 class="sh-t">${esc(p.title || "Our Store Location")}</h2></div></div>
        <div class="gr gc1 md:gc2 g10">
          <div style="display:flex;flex-direction:column;gap:20px">
            ${p.address ? `<div class="d g4 ais"><div style="width:48px;height:48px;border-radius:50%;background:${pri}15;color:${pri};display:flex;align-items:center;justify-content:center;flex-shrink:0"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg></div><div><div class="fs mb1">Address</div><div style="color:var(--ctxl)">${esc(p.address)}</div></div></div>` : ""}
            ${p.phone ? `<div class="d g4 ais"><div style="width:48px;height:48px;border-radius:50%;background:${pri}15;color:${pri};display:flex;align-items:center;justify-content:center;flex-shrink:0"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg></div><div><div class="fs mb1">Phone</div><div style="color:var(--ctxl)">${esc(p.phone)}</div></div></div>` : ""}
            ${p.email ? `<div class="d g4 ais"><div style="width:48px;height:48px;border-radius:50%;background:${pri}15;color:${pri};display:flex;align-items:center;justify-content:center;flex-shrink:0"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg></div><div><div class="fs mb1">Email</div><div style="color:var(--ctxl)">${esc(p.email)}</div></div></div>` : ""}
            ${p.hours ? `<div class="d g4 ais"><div style="width:48px;height:48px;border-radius:50%;background:${pri}15;color:${pri};display:flex;align-items:center;justify-content:center;flex-shrink:0"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg></div><div><div class="fs mb1">Hours</div><div style="color:var(--ctxl)">${esc(p.hours)}</div></div></div>` : ""}
          </div>
          <div class="mp"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg><div class="fs">Interactive Map</div><div class="ts">${p.address ? esc(p.address) : "Location"}</div></div>
        </div>
      </div></section>`;

    // ─── SHOP PAGE ─────────────────────────────────────

    case "PageHero":
      return `<section class="ph"><div class="phi">${p.subtitle ? `<div class="ts fs mb3" style="color:${pri}">${esc(p.subtitle)}</div>` : ""}<h1 class="tx4 md:tx5 fb" style="letter-spacing:-.02em">${esc(p.title || "Page")}</h1>${p.description ? `<p class="tl mt3" style="opacity:.8">${esc(p.description)}</p>` : ""}</div></section>`;

    // TODO: Uncomment ShopHero when eCommerce is implemented
    // case "ShopHero":
    //   return `<section class="ph"><div class="phi"><nav class="brd" style="color:#9ca3af"><a href="/" style="color:#d1d5db">Home</a><span class="brd-s">/</span><span class="brd-c" style="color:#fff">${esc(p.title || "Shop")}</span></nav><h1 class="tx4 md:tx5 fb">${esc(p.title || "Shop")}</h1>${p.description ? `<p class="tl mt3" style="opacity:.8">${esc(p.description)}</p>` : ""}</div></section>`;

    // TODO: Uncomment ProductFilters when eCommerce is implemented
    // case "ProductFilters":
    //   return `<aside style="background:var(--bg);border:1px solid var(--bdr);border-radius:var(--rlg);padding:24px"><h3 class="fb txl mb6">Filters</h3>
    //     ${(p.categories || []).length > 0 ? `<div class="mb6"><h4 class="fs ts mb3" style="text-transform:uppercase;letter-spacing:.05em;color:var(--ctxl)">Category</h4><div style="display:flex;flex-wrap:wrap;gap:8px"><button data-category-filter="all" class="btn bs2 bsm ${b}" style="background:var(--c1);color:#fff">All</button>${p.categories.map((c: any) => `<button data-category-filter="${esc(c.slug || c.name || c)}" class="btn bs2 bsm ${b}">${esc(c.name || c)}</button>`).join("")}</div></div>` : ""}
    //     ${(p.priceRange || p.priceRanges) ? `<div class="mb6"><h4 class="fs ts mb3" style="text-transform:uppercase;letter-spacing:.05em;color:var(--ctxl)">Price</h4><div style="display:flex;flex-direction:column;gap:10px">${(p.priceRange || p.priceRanges || []).map((r: any) => `<label style="display:flex;align-items:center;gap:10px;font-size:.9375rem;color:var(--ctxl);cursor:pointer"><input type="checkbox" style="width:18px;height:18px;border-radius:4px;border:1.5px solid var(--bdr);accent-color:var(--c1)" /> ${esc(typeof r === "string" ? r : r.label || `${r.min} - ${r.max}`)}</label>`).join("")}</div></div>` : ""}
    //     ${(p.sortOptions || []).length > 0 ? `<div><h4 class="fs ts mb3" style="text-transform:uppercase;letter-spacing:.05em;color:var(--ctxl)">Sort By</h4><select data-sort-select class="inp sel">${p.sortOptions.map((o: any) => `<option value="${esc(o.value || o)}">${esc(o.label || o)}</option>`).join("")}</select></div>` : ""}
    //   </aside>`;

    // TODO: Uncomment ProductGrid when eCommerce is implemented
    // case "ProductGrid":
    //   return `<section class="py16"><div class="ct"><div style="display:flex;flex-direction:row;gap:32px"><div style="width:280px;flex-shrink:0" class="hid md:block">${renderComponent("ProductFilters", p.filters || {}, theme)}</div><div style="flex:1">
    //     <div class="d aic jcsb mb6" style="flex-wrap:wrap;gap:12px">
    //       <span data-result-count style="color:var(--ctxl);font-size:.9375rem">${esc(p.totalProducts || (p.products || []).length)} products</span>
    //       <div class="d aic g3">
    //         <input type="text" placeholder="Search products..." data-search-input class="inp" style="width:200px;padding:8px 12px;font-size:.875rem" />
    //         <select data-sort-select class="inp sel" style="width:160px;padding:8px 12px;font-size:.875rem">
    //           <option value="">Sort by</option>
    //           <option value="price_asc">Price: Low to High</option>
    //           <option value="price_desc">Price: High to Low</option>
    //           <option value="name">Name: A-Z</option>
    //           <option value="rating">Top Rated</option>
    //         </select>
    //       </div>
    //     </div>
    //     <div class="gr gc2 lg:gc3 g6" data-product-grid>
    //       ${(p.products || []).map((pr: any) => {
    //     const pid = `p_${esc(pr.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'item')}`;
    //     const prodData = JSON.stringify({ id: pid, name: pr.name, price: pr.price, image: pr.image || ph(pr.name || "Product"), category: pr.category || '' });
    //     return `<div class="pc" data-product-card data-searchable data-search-name="${esc(pr.name || '')}" data-search-category="${esc(pr.category || '')}" data-price="${esc(pr.price || '0')}" data-rating="${esc(pr.rating || '0')}"><div class="pci"><img src="${esc(pr.image || ph(pr.name || "Product"))}" alt="${esc(pr.name)}" class="pcimg" /><div class="pcb">${pr.isNew ? '<span class="badge bdg-n">New</span>' : ""}${pr.discount ? `<span class="badge bdg-s">-${esc(pr.discount)}%</span>` : ""}</div><div class="pco"><button class="btn bw bsm ${b}">Quick View</button><button class="btn bp bsm ${b}" data-add-to-cart='${prodData}'>Add to Cart</button></div></div><div class="pcbd">${pr.category ? `<div class="pcbc">${esc(pr.category)}</div>` : ""}<div class="pcbn">${esc(pr.name)}</div>${pr.rating ? `<div class="mb1">${starsHtml(pr.rating)}</div>` : ""}<div class="pcbp"><span class="cur" style="color:${pri}">$${esc(pr.price || "0")}</span>${pr.originalPrice ? `<span class="org">$${esc(pr.originalPrice)}</span>` : ""}</div><button class="btn bk bbl bsm ${b} mt4" data-add-to-cart='${prodData}'>Add to Cart</button></div></div>`;
    //   }).join("")}
    //     </div>
    //     <div data-pagination-container></div>
    //   </div></div></div></section>`;

    // ─── PRODUCT DETAILS ───────────────────────────────

    case "Breadcrumbs":
      return `<nav class="brd ct">${(p.items || []).map((item: any, i: number, arr: any[]) => `${i > 0 ? '<span class="brd-s">/</span>' : ""}${i < arr.length - 1 ? `<a href="${esc(item.href || "#")}">${esc(item.label)}</a>` : `<span class="brd-c">${esc(item.label)}</span>`}`).join("")}</nav>`;

    // TODO: Uncomment ProductDetails when eCommerce is implemented
    // case "ProductDetails": {
    //   const pd = p.product ? { ...p.product, hasWishlist: p.hasWishlist, shareLinks: p.shareLinks } : p;
    //   return `<section class="py16"><div class="ct"><div style="display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:start" data-product-card data-searchable data-search-name="${esc(pd.name || '')}" data-search-category="${esc(pd.category || '')}" data-price="${esc(pd.price || '0')}" data-rating="${esc(pd.rating || '0')}">
    //     <div><div style="border-radius:var(--rlg);overflow:hidden;border:1px solid var(--bdr)"><img src="${esc(pd.image || ph(pd.name || "Product", 600, 600))}" alt="${esc(pd.name)}" style="width:100%;aspect-ratio:1;object-fit:cover" /></div>
    //       ${pd.gallery && pd.gallery.length > 0 ? `<div class="d g3 mt4"><img src="${esc(pd.image || ph("Product"))}" alt="" style="width:80px;height:80px;object-fit:cover;border-radius:var(--rsm);border:2px solid ${pri};cursor:pointer" />${pd.gallery.map((img: string) => `<img src="${esc(img)}" alt="" style="width:80px;height:80px;object-fit:cover;border-radius:var(--rsm);border:1.5px solid var(--bdr);cursor:pointer;transition:border-color .25s" onmouseover="this.style.borderColor='${pri}'" onmouseout="this.style.borderColor='var(--bdr)'" />`).join("")}</div>` : ""}
    //     </div>
    //     <div>${pd.brand ? `<div style="font-size:.8125rem;font-weight:500;color:var(--ctxlr);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">${esc(pd.brand)}</div>` : ""}<h1 style="font-size:2rem;font-weight:700;letter-spacing:-.02em;margin-bottom:12px">${esc(pd.name)}</h1>
    //       ${pd.rating ? `<div class="d aic g2 mb4">${starsHtml(pd.rating)} <span style="color:var(--ctxl);font-size:.9375rem">(${esc(pd.reviewCount || 0)} reviews)</span></div>` : ""}
    //       <div class="d aic g3 mb6"><span style="font-size:1.75rem;font-weight:700;color:${pri}">$${esc(pd.price || "0")}</span>${pd.originalPrice ? `<span style="font-size:1.125rem;color:var(--ctxlr);text-decoration:line-through">$${esc(pd.originalPrice)}</span>` : ""}${pd.discount ? `<span class="badge bdg-s">-${esc(pd.discount)}% OFF</span>` : ""}</div>
    //       ${pd.shortDescription ? `<p style="color:var(--ctxl);line-height:1.7;margin-bottom:24px">${esc(pd.shortDescription)}</p>` : ""}
    //       ${pd.variants && pd.variants.length > 0 ? `<div class="mb6"><div class="fs ts mb3">${esc(pd.variantLabel || "Options")}</div><div class="d dw g2" data-color-group>${pd.variants.map((v: any) => `<button class="btn bs2 bsm ${b}" data-color-select="${esc(v.name || v)}">${esc(v.name || v)}</button>`).join("")}</div></div>` : ""}
    //       ${pd.sizes && pd.sizes.length > 0 ? `<div class="mb6"><div class="fs ts mb3">Size</div><div class="d dw g2" data-size-group>${pd.sizes.map((s: any) => `<button class="btn bs2 bsm ${b}" data-size-select="${esc(s.name || s)}" style="min-width:48px;height:48px;padding:0">${esc(s.name || s)}</button>`).join("")}</div></div>` : ""}
    //       ${pd.colors && pd.colors.length > 0 ? `<div class="mb6"><div class="fs ts mb3">Color</div><div class="d dw g3" data-color-group>${pd.colors.map((c: any) => `<div data-color-select="${esc(c.hex || c.color || c)}" style="width:32px;height:32px;border-radius:50%;border:2px solid var(--bdr);cursor:pointer;transition:all .2s;background:${esc(c.hex || c.color || c)}" title="${esc(c.name || c)}"></div>`).join("")}</div></div>` : ""}
    //       <div class="d aic g4 mb6"><div class="qty"><button class="qb" data-qty-minus>\u2212</button><div class="qv" data-qty>1</div><button class="qb" data-qty-plus>+</button></div>
    //       ${(() => {
    //       const pid = `p_${esc(pd.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'item')}`;
    //       const prodData = JSON.stringify({ id: pid, name: pd.name, price: pd.price, image: pd.image || ph(pd.name || "Product"), category: pd.category || '' });
    //       return `<button class="btn bp blg ${b}" style="flex:1" data-add-to-cart='${prodData}'>Add to Cart</button>`;
    //     })()}
    //       </div>
    //       ${pd.description ? `<div style="border-top:1px solid var(--bdr);padding-top:24px;margin-top:24px"><h3 class="fs mb3">Description</h3><div style="color:var(--ctxl);line-height:1.7;font-size:.9375rem">${esc(pd.description)}</div></div>` : ""}
    //     </div>
    //   </div></div></section>`;
    // }

    // TODO: Uncomment ProductReviews when eCommerce is implemented
    // case "ProductReviews":
    //   return `<section class="py16 bga"><div class="cxs"><div class="sh"><div><h2 class="sh-t" style="text-align:left">Customer Reviews</h2></div></div>
    //     <div style="display:flex;flex-direction:column;gap:24px">${(p.reviews || []).map((r: any) => `<div style="background:var(--bgc);border:1px solid var(--bdr);border-radius:var(--rlg);padding:24px"><div class="d aic g4 mb3"><img src="${esc(r.avatar || ph(r.author || "User", 48, 48))}" alt="" style="width:48px;height:48px;border-radius:50%;object-fit:cover" /><div><div class="fs">${esc(r.author || r.name)}</div>${r.date ? `<div style="font-size:.8125rem;color:var(--ctxlr)">${esc(r.date)}</div>` : ""}</div><div class="mla">${starsHtml(r.rating)}</div></div>${r.title ? `<div class="fs mb2">${esc(r.title)}</div>` : ""}<p style="color:var(--ctxl);font-size:.9375rem;line-height:1.7">${esc(r.content || r.comment)}</p></div>`).join("")}</div></div></section>`;

    // TODO: Uncomment RelatedProducts/RecentlyViewed when eCommerce is implemented
    // case "RelatedProducts":
    // case "RecentlyViewed":
    //   return `<section class="py16"><div class="ct"><div class="sh"><div><h2 class="sh-t" style="text-align:left">${esc(p.title || (component === "RelatedProducts" ? "Related Products" : "Recently Viewed"))}</h2></div></div>
    //     <div class="gr gc2 md:gc4 g6">${(p.products || []).map((pr: any) => {
    //     const pid = `p_${esc(pr.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'item')}`;
    //     const prodData = JSON.stringify({ id: pid, name: pr.name, price: pr.price, image: pr.image || ph(pr.name || "Product"), category: pr.category || '' });
    //     return `<div class="pc" data-product-card><div class="pci"><img src="${esc(pr.image || ph(pr.name || "Product"))}" alt="${esc(pr.name)}" class="pcimg" /><div class="pco"><button class="btn bw bsm ${b}">Quick View</button><button class="btn bp bsm ${b}" data-add-to-cart='${prodData}'>Add to Cart</button></div></div><div class="pcbd"><div class="pcbn">${esc(pr.name)}</div>${pr.rating ? `<div class="mb1">${starsHtml(pr.rating)}</div>` : ""}<div class="pcbp"><span class="cur" style="color:${pri}">$${esc(pr.price || "0")}</span>${pr.originalPrice ? `<span class="org">$${esc(pr.originalPrice)}</span>` : ""}</div><button class="btn bk bbl bsm ${b} mt4" data-add-to-cart='${prodData}'>Add to Cart</button></div></div>`;
    //   }).join("")}</div></div></section>`;

    // ─── OTHER PAGES ───────────────────────────────────

    // TODO: Uncomment CategoryGrid when eCommerce is implemented
    // case "CategoryGrid":
    //   return `<section class="py16"><div class="ct"><div class="sh"><div><div class="sh-sub">Categories</div><h2 class="sh-t">${esc(p.title || "Browse Categories")}</h2></div></div>
    //     <div class="gr gc2 md:gc3 lg:gc4 g6">${(p.categories || []).map((c: any) => `<a href="${esc(c.href || "#")}" class="pc" data-category-filter="${esc(c.slug || c.name || '')}" style="text-decoration:none"><div class="pci" style="aspect-ratio:4/3"><img src="${esc(c.image || ph(c.name || "Category", 400, 300))}" alt="${esc(c.name)}" class="pcimg" /><div class="pco" style="border-radius:inherit"><span class="btn bw bsm ${b}">Explore</span></div></div><div class="pcbd tc"><div class="pcbn" style="white-space:normal">${esc(c.name)}</div>${c.count ? `<div class="pcbc">${esc(c.count)} items</div>` : ""}</div></a>`).join("")}</div></div></section>`;

    case "AboutStory":
      return `<section class="py16"><div class="ct"><div style="display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center">
        <div>${p.subtitle ? `<div class="sh-sub" style="text-align:left;margin-bottom:12px">${esc(p.subtitle)}</div>` : ""}<h2 class="sh-t" style="text-align:left;margin-bottom:20px">${esc(p.title || "Our Story")}</h2><p style="color:var(--ctxl);line-height:1.85;margin-bottom:20px;font-size:1.05rem">${esc(p.paragraph1 || p.description || "")}</p>${p.paragraph2 ? `<p style="color:var(--ctxl);line-height:1.85;font-size:1.05rem">${esc(p.paragraph2)}</p>` : ""}${p.ctaText ? `<a href="${esc(p.ctaLink || "#")}" class="btn bp ${b} mt6" style="padding:16px 36px">${esc(p.ctaText)}</a>` : ""}</div>
        <div style="position:relative"><img src="${esc(p.image || ph("Our Story", 600, 400))}" alt="Our Story" style="width:100%;border-radius:var(--rlg);object-fit:cover;box-shadow:0 20px 60px rgba(0,0,0,.12)" /><div style="position:absolute;bottom:-20px;right:-20px;width:120px;height:120px;background:linear-gradient(135deg,var(--c1),var(--c2));border-radius:var(--rlg);z-index:-1;opacity:.3"></div></div>
      </div></div></section>`;

    case "AboutValues":
      return `<section class="py16 bga"><div class="ct"><div class="sh"><div><div class="sh-sub">Values</div><h2 class="sh-t">${esc(p.title || "Our Values")}</h2></div></div>
        <div class="gr gc1 md:gc3 g8">${(p.values || []).map((v: any) => `<div style="background:var(--bgc);border-radius:var(--rlg);padding:40px 32px;text-align:center;border:1px solid var(--bdr);transition:all .4s cubic-bezier(.4,0,.2,1);box-shadow:0 1px 3px rgba(0,0,0,.04)" onmouseover="this.style.boxShadow='0 20px 60px rgba(0,0,0,.1)';this.style.transform='translateY(-8px)'" onmouseout="this.style.boxShadow='0 1px 3px rgba(0,0,0,.04)';this.style.transform='none'"><div style="width:72px;height:72px;border-radius:20px;background:linear-gradient(135deg,var(--c1l),var(--c2l));color:${pri};display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:1.75rem">${esc(v.icon || "\ud83d\udc8e")}</div><h3 class="fs txl mb3">${esc(v.title)}</h3><p style="color:var(--ctxl);font-size:.9375rem;line-height:1.8">${esc(v.description)}</p></div>`).join("")}</div></div></section>`;

    case "TeamSection":
      return `<section class="py16"><div class="ct"><div class="sh"><div><div class="sh-sub">Team</div><h2 class="sh-t">${esc(p.title || "Meet Our Team")}</h2></div></div>
        <div class="gr gc2 md:gc4 g8">${(p.members || []).map((m: any) => `<div class="tc" style="background:var(--bgc);border-radius:var(--rlg);padding:32px 24px;border:1px solid var(--bdr);transition:all .4s cubic-bezier(.4,0,.2,1);box-shadow:0 1px 3px rgba(0,0,0,.04)" onmouseover="this.style.boxShadow='0 20px 60px rgba(0,0,0,.1)';this.style.transform='translateY(-8px)'" onmouseout="this.style.boxShadow='0 1px 3px rgba(0,0,0,.04)';this.style.transform='none'"><div style="width:130px;height:130px;border-radius:50%;margin:0 auto 20px;overflow:hidden;border:4px solid var(--c1l);box-shadow:0 8px 24px rgba(0,0,0,.1);transition:all .3s"><img src="${esc(m.avatar || ph(m.name || "Team", 300, 300))}" alt="${esc(m.name)}" style="width:100%;height:100%;object-fit:cover" /></div><div class="fs" style="font-size:1.1rem">${esc(m.name)}</div>${m.role ? `<div style="color:var(--c1);font-size:.875rem;margin-top:4px;font-weight:500">${esc(m.role)}</div>` : ""}${m.social ? `<div class="d jcc g3 mt3">${m.social.linkedin ? `<a href="${esc(m.social.linkedin)}" style="color:var(--ctxlr);transition:all .25s" onmouseover="this.style.color='${pri}'" onmouseout="this.style.color='var(--ctxlr)'">LinkedIn</a>` : ""}${m.social.twitter ? `<a href="${esc(m.social.twitter)}" style="color:var(--ctxlr);transition:all .25s" onmouseover="this.style.color='${pri}'" onmouseout="this.style.color='var(--ctxlr)'">Twitter</a>` : ""}</div>` : ""}</div>`).join("")}</div></div></section>`;

    case "CTABanner":
      return `<section class="py20 tc" style="background:${p.backgroundImage ? `url('${esc(p.backgroundImage)}') center/cover no-repeat` : `linear-gradient(135deg,${pri},${sec})`};position:relative;overflow:hidden"><div style="position:absolute;inset:0;background:rgba(0,0,0,.1)"></div><div style="position:absolute;top:-50%;right:-20%;width:600px;height:600px;border-radius:50%;background:rgba(255,255,255,.06);pointer-events:none"></div><div style="position:absolute;bottom:-30%;left:-10%;width:500px;height:500px;border-radius:50%;background:rgba(255,255,255,.04);pointer-events:none"></div><div class="csm" style="color:#fff;position:relative;z-index:1"><h2 class="tx3 fb mb4" style="letter-spacing:-.02em">${esc(p.headline || p.title || "Ready to Get Started?")}</h2><p class="tl mb8" style="opacity:.9;max-width:560px;margin-left:auto;margin-right:auto;line-height:1.7">${esc(p.subheadline || p.description || "")}</p>${p.ctaText ? `<a href="${esc(p.ctaLink || "#")}" class="btn bw blg ${b}" style="color:${pri};padding:18px 40px;font-size:1.05rem;box-shadow:0 8px 30px rgba(0,0,0,.15)">${esc(p.ctaText)}</a>` : ""}</div></section>`;

    case "ContactInfo":
      return `<section class="py16 bga"><div class="ct"><div class="sh"><div><div class="sh-sub">Get in Touch</div><h2 class="sh-t">${esc(p.title || "Contact Information")}</h2></div></div>
        <div class="gr gc1 md:gc3 g8">${p.address ? `<div style="background:var(--bgc);border:1px solid var(--bdr);border-radius:var(--rlg);padding:40px 32px;text-align:center;transition:all .4s cubic-bezier(.4,0,.2,1);box-shadow:0 1px 3px rgba(0,0,0,.04)" onmouseover="this.style.boxShadow='0 20px 60px rgba(0,0,0,.1)';this.style.transform='translateY(-8px)'" onmouseout="this.style.boxShadow='0 1px 3px rgba(0,0,0,.04)';this.style.transform='none'"><div style="width:64px;height:64px;border-radius:20px;background:linear-gradient(135deg,var(--c1l),var(--c2l));color:${pri};display:flex;align-items:center;justify-content:center;margin:0 auto 20px"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg></div><h3 class="fs mb2">Address</h3><p style="color:var(--ctxl);font-size:.9375rem;line-height:1.6">${esc(p.address)}</p></div>` : ""}${p.phone ? `<div style="background:var(--bgc);border:1px solid var(--bdr);border-radius:var(--rlg);padding:40px 32px;text-align:center;transition:all .4s cubic-bezier(.4,0,.2,1);box-shadow:0 1px 3px rgba(0,0,0,.04)" onmouseover="this.style.boxShadow='0 20px 60px rgba(0,0,0,.1)';this.style.transform='translateY(-8px)'" onmouseout="this.style.boxShadow='0 1px 3px rgba(0,0,0,.04)';this.style.transform='none'"><div style="width:64px;height:64px;border-radius:20px;background:linear-gradient(135deg,var(--c1l),var(--c2l));color:${pri};display:flex;align-items:center;justify-content:center;margin:0 auto 20px"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg></div><h3 class="fs mb2">Phone</h3><p style="color:var(--ctxl);font-size:.9375rem;line-height:1.6">${esc(p.phone)}</p></div>` : ""}${p.email ? `<div style="background:var(--bgc);border:1px solid var(--bdr);border-radius:var(--rlg);padding:40px 32px;text-align:center;transition:all .4s cubic-bezier(.4,0,.2,1);box-shadow:0 1px 3px rgba(0,0,0,.04)" onmouseover="this.style.boxShadow='0 20px 60px rgba(0,0,0,.1)';this.style.transform='translateY(-8px)'" onmouseout="this.style.boxShadow='0 1px 3px rgba(0,0,0,.04)';this.style.transform='none'"><div style="width:64px;height:64px;border-radius:20px;background:linear-gradient(135deg,var(--c1l),var(--c2l));color:${pri};display:flex;align-items:center;justify-content:center;margin:0 auto 20px"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg></div><h3 class="fs mb2">Email</h3><p style="color:var(--ctxl);font-size:.9375rem;line-height:1.6">${esc(p.email)}</p></div>` : ""}</div></div></section>`;

    case "MapEmbed":
      return `<section class="py16"><div class="ct"><div class="mp" style="min-height:400px"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg><div class="fs">Interactive Map</div>${p.address ? `<div class="ts">${esc(p.address)}</div>` : ""}</div></div></section>`;

    case "BlogPreview":
    case "BlogGrid":
      return `<section class="py16"><div class="ct"><div class="sh"><div><div class="sh-sub">Blog</div><h2 class="sh-t">${esc(p.title || "Latest Articles")}</h2>${p.subtitle ? `<p class="sh-d">${esc(p.subtitle)}</p>` : ""}</div></div>
        <div class="gr gc1 md:gc3 g8">${(p.posts || []).map((post: any) => `<article class="pc" style="text-decoration:none;display:block"><div class="pci" style="aspect-ratio:16/9"><img src="${esc(post.image || ph(post.title || "Blog", 600, 300))}" alt="${esc(post.title)}" class="pcimg" /></div><div class="pcbd" style="padding:24px">${post.category ? `<div class="pcbc" style="color:${pri};font-size:.75rem;font-weight:700;letter-spacing:.05em">${esc(post.category)}</div>` : ""}<h3 class="fs txl mb2" style="line-height:1.3">${esc(post.title)}</h3>${post.excerpt ? `<p style="color:var(--ctxl);font-size:.9375rem;line-height:1.7;margin-bottom:16px">${esc(post.excerpt)}</p>` : ""}<div class="d aic g4 tx" style="color:var(--ctxlr)">${post.author ? `<span>${esc(post.author)}</span>` : ""}${post.date ? `<span>${esc(post.date)}</span>` : ""}</div><a href="${esc(post.href || "#" + (post.slug || ""))}" class="btn bs2 bsm ${b}" style="margin-top:20px">Read More \u2192</a></div></article>`).join("")}</div></div></section>`;

    // TODO: Uncomment OrderTracking when eCommerce is implemented
    // case "OrderTracking":
    //   return `<section class="py16 bga"><div class="cxs tc"><div class="sh"><div><div class="sh-sub">Track Order</div><h2 class="sh-t">${esc(p.title || "Track Your Order")}</h2></div></div><p style="color:var(--ctxl);margin-bottom:32px">${esc(p.description || "Enter your order number to track its status")}</p><form class="d g3" style="max-width:480px;margin:0 auto"><input type="text" placeholder="Order number" class="inp" style="flex:1" /><button type="submit" class="btn bp ${b}">Track</button></form></div></section>`;

    // TODO: Uncomment WishlistGrid when eCommerce is implemented
    // case "WishlistGrid":
    //   return `<section class="py16"><div class="ct"><div class="sh"><div><h2 class="sh-t" style="text-align:left">${esc(p.title || "My Wishlist")}</h2></div></div>${(p.items || []).length === 0 ? `<div class="tc py16" style="color:var(--ctxlr)"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin:0 auto 16px;opacity:.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg><p>Your wishlist is empty</p><a href="/about" class="btn bp ${b} mt4">Browse</a></div>` : `<div class="gr gc2 md:gc4 g6">${(p.items || []).map((item: any) => {
    //     const pid = `p_${esc(item.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'item')}`;
    //     const prodData = JSON.stringify({ id: pid, name: item.name, price: item.price, image: item.image || ph(item.name || "Product"), category: item.category || '' });
    //     return `<div class="pc" data-product-card><div class="pci"><img src="${esc(item.image || ph(item.name || "Product"))}" alt="${esc(item.name)}" class="pcimg" /><div class="pco"><button class="btn bw bsm ${b}" data-toggle-wishlist='${prodData}'>Remove</button></div></div><div class="pcbd"><div class="pcbn">${esc(item.name)}</div><div class="pcbp"><span class="cur" style="color:${pri}">$${esc(item.price || "0")}</span></div><button class="btn bk bbl bsm ${b} mt4" data-add-to-cart='${prodData}'>Add to Cart</button></div></div>`;
    //   }).join("")}</div>`}</div></section>`;

    // TODO: Uncomment CartItems when eCommerce is implemented
    // case "CartItems":
    //   return `<div style="background:var(--bg);border:1px solid var(--bdr);border-radius:var(--rlg);overflow:hidden"><div class="tw2"><table class="tbl"><thead><tr><th>Product</th><th class="hid md:blk">Price</th><th>Quantity</th><th class="hid md:blk">Total</th><th>Remove</th></tr></thead><tbody>${(p.items || []).map((item: any) => `<tr data-cart-item data-item-id="${esc(item.id || '')}" data-item-variant="${esc(item.variant || '')}" data-item-size="${esc(item.size || '')}" data-item-price="${esc(item.price || '0')}"><td><div class="d aic g4"><img src="${esc(item.image || ph(item.name || "Product", 80, 80))}" alt="${esc(item.name)}" style="width:64px;height:64px;object-fit:cover;border-radius:var(--rsm)" /><div><div class="fs" style="font-size:.9375rem">${esc(item.name)}</div>${item.variant ? `<div style="font-size:.8125rem;color:var(--ctxlr)">${esc(item.variant)}</div>` : ""}</div></div></td><td class="hid md:blk" style="font-size:.9375rem">$${esc(item.price || "0")}</td><td><div class="qty"><button class="qb" data-qty-minus style="width:28px;height:28px">\u2212</button><div class="qv" data-qty style="width:32px;font-size:.875rem">${esc(item.quantity || 1)}</div><button class="qb" data-qty-plus style="width:28px;height:28px">+</button></div></td><td class="hid md:blk" style="font-weight:600;font-size:.9375rem" data-item-total>$${esc(item.total || item.price || "0")}</td><td><button data-remove-item style="color:var(--ctxlr);cursor:pointer;transition:color .25s;border:none;background:none;font-size:1.125rem" onmouseover="this.style.color='var(--err)'" onmouseout="this.style.color='var(--ctxlr)'">\u2715</button></td></tr>`).join("")}</tbody></table></div></div>`;

    // TODO: Uncomment CartSummary when eCommerce is implemented
    // case "CartSummary":
    //   return `<div style="background:var(--bga);border:1px solid var(--bdr);border-radius:var(--rlg);padding:24px"><h3 class="fb txl mb6">Order Summary</h3><div style="display:flex;flex-direction:column;gap:14px;font-size:.9375rem"><div class="d jcsb"><span style="color:var(--ctxl)">Subtotal</span><span class="fs">$${esc(p.subtotal || "0")}</span></div>${p.discount ? `<div class="d jcsb" style="color:var(--ok)"><span>Discount</span><span>-$${esc(p.discount)}</span></div>` : ""}<div class="d jcsb"><span style="color:var(--ctxl)">Shipping</span><span class="fs">${p.shipping === 0 || p.shipping === "0" ? '<span style="color:var(--ok)">Free</span>' : `$${esc(p.shipping || "0")}`}</span></div>${p.tax ? `<div class="d jcsb"><span style="color:var(--ctxl)">Tax</span><span class="fs">$${esc(p.tax)}</span></div>` : ""}<div style="border-top:1px solid var(--bdr);padding-top:14px" class="d jcsb"><span class="fb txl">Total</span><span class="fb txl" style="color:${pri}">$${esc(p.total || "0")}</span></div></div>${p.couponCode !== false && p.promoCode !== false ? `<div class="d g2 mt6"><input type="text" placeholder="${esc(p.couponCode?.placeholder || 'Promo code')}" class="inp" style="flex:1;font-size:.9375rem" /><button class="btn bs2 bsm ${b}" data-coupon-apply>${esc(p.couponCode?.buttonText || 'Apply')}</button></div>` : ""}<button class="btn bp bbl ${b}" style="margin-top:24px">Proceed to Checkout</button><a href="/shop" class="blk tc mt3" style="color:var(--ctxl);font-size:.9375rem;transition:color .25s" onmouseover="this.style.color='${pri}'" onmouseout="this.style.color='var(--ctxl)'">\u2190 Continue Shopping</a></div>`;

    // TODO: Uncomment CheckoutForm when eCommerce is implemented
    // case "CheckoutForm":
    //   return `<section class="py16"><div class="csm"><div class="sh"><div><h2 class="sh-t">${esc(p.title || "Checkout")}</h2></div></div>
    //     <div class="steps mb10"><div class="stp act"><div class="stpn">1</div><div class="stpl">Information</div></div><div class="stpline"></div><div class="stp"><div class="stpn">2</div><div class="stpl">Shipping</div></div><div class="stpline"></div><div class="stp"><div class="stpn">3</div><div class="stpl">Payment</div></div></div>
    //     <form style="display:flex;flex-direction:column;gap:20px"><div class="gr gc2 g5"><div class="fl-wrap"><input type="text" placeholder=" " class="inp" /><label>First name</label></div><div class="fl-wrap"><input type="text" placeholder=" " class="inp" /><label>Last name</label></div></div><div class="fl-wrap"><input type="email" placeholder=" " class="inp" /><label>Email address</label></div><div class="fl-wrap"><input type="text" placeholder=" " class="inp" /><label>Street address</label></div><div class="gr gc3 g5"><div class="fl-wrap"><input type="text" placeholder=" " class="inp" /><label>City</label></div><div class="fl-wrap"><input type="text" placeholder=" " class="inp" /><label>State</label></div><div class="fl-wrap"><input type="text" placeholder=" " class="inp" /><label>ZIP code</label></div></div><div style="border-top:1px solid var(--bdr);padding-top:24px;margin-top:8px"><div class="fs mb4">Payment Information</div><div class="fl-wrap mb4" style="margin-bottom:16px"><input type="text" placeholder=" " class="inp" /><label>Card number</label></div><div class="gr gc2 g5"><div class="fl-wrap"><input type="text" placeholder=" " class="inp" /><label>MM / YY</label></div><div class="fl-wrap"><input type="text" placeholder=" " class="inp" /><label>CVC</label></div></div></div><button type="submit" class="btn bp blg bbl ${b}" style="margin-top:16px">${esc(p.submitText || "Place Order")}</button></form></div></section>`;

    case "LegalContent":
      return `<section class="py16"><div class="cxs"><h1 class="tx3 fb mb4">${esc(p.title || "Privacy Policy")}</h1>${p.lastUpdated ? `<p style="color:var(--ctxlr);font-size:.9375rem;margin-bottom:32px">Last updated: ${esc(p.lastUpdated)}</p>` : ""}<div style="line-height:1.8">${(p.sections || p.content ? (p.sections || [{ title: "", content: p.content }]) : []).map((s: any) => `<div style="margin-bottom:24px">${s.title ? `<h2 class="txl fs mb3">${esc(s.title)}</h2>` : ""}<div style="color:var(--ctxl);line-height:1.8">${esc(s.content || s.text || "")}</div></div>`).join("")}</div></div></section>`;

    // ─── ADDITIONAL SECTIONS ────────────────────────────

    case "MenuHighlights":
      return `<section class="py16"><div class="ct"><div class="sh"><div><div class="sh-sub">Our Menu</div><h2 class="sh-t">${esc(p.title || "Menu Highlights")}</h2></div></div>
        <div class="gr gc1 md:gc2 g8">${(p.items || p.menuItems || []).map((item: any) => `<div class="d g4" style="background:var(--bgc);border:1px solid var(--bdr);border-radius:var(--rlg);overflow:hidden;transition:all .25s" onmouseover="this.style.boxShadow='var(--shl)';this.style.transform='translateY(-2px)'" onmouseout="this.style.boxShadow='none';this.style.transform='none'">${item.image ? `<img src="${esc(item.image)}" alt="${esc(item.name)}" style="width:120px;height:120px;object-fit:cover;flex-shrink:0" />` : ""}<div class="p4"><div class="d jcsb aic mb2"><div class="fs">${esc(item.name)}</div><div class="fb" style="color:${pri}">$${esc(item.price || "0")}</div></div><p class="ts" style="color:var(--ctxl);line-height:1.6">${esc(item.description || "")}</p>${item.badge ? `<span class="badge bdgp mt2">${esc(item.badge)}</span>` : ""}</div></div>`).join("")}</div></div></section>`;

    case "DailySpecials":
      return `<section class="py16 bga"><div class="ct"><div class="sh"><div><div class="sh-sub">Today</div><h2 class="sh-t">${esc(p.title || "Daily Specials")}</h2></div></div>
        <div class="gr gc2 md:gc3 g6">${(p.items || p.specials || []).map((item: any) => `<div class="pc"><div class="pci" style="aspect-ratio:4/3">${item.image ? `<img src="${esc(item.image)}" alt="${esc(item.name)}" class="pcimg" />` : `<div style="width:100%;height:100%;background:${pri}10;display:flex;align-items:center;justify-content:center;color:${pri};font-size:2rem">\ud83c\udf7d\ufe0f</div>`}</div><div class="pcbd"><div class="d jcsb aic mb2"><div class="pcbn">${esc(item.name)}</div><div class="fb" style="color:${pri}">$${esc(item.price || "0")}</div></div><p class="ts" style="color:var(--ctxl);line-height:1.6">${esc(item.description || "")}</p>${item.originalPrice ? `<div class="d aic g2 mt2"><span class="org">$${esc(item.originalPrice)}</span><span class="badge bdg-s">Save</span></div>` : ""}</div></div>`).join("")}</div></div></section>`;

    case "ChefTable":
      return `<section class="py16" style="background:linear-gradient(135deg,${pri},${sec})"><div class="ct tc" style="color:#fff"><div class="sh"><div><div class="sh-sub" style="color:#fff">Experience</div><h2 class="sh-t" style="color:#fff">${esc(p.title || "Chef's Table")}</h2></div></div><p style="max-width:640px;margin:0 auto 32px;opacity:.9;line-height:1.7">${esc(p.description || "An exclusive dining experience curated by our head chef.")}</p>${p.ctaText ? `<a href="${esc(p.ctaLink || "#")}" class="btn bw blg ${b}" style="color:${pri}">${esc(p.ctaText)}</a>` : ""}</div></section>`;

    case "ReservationForm":
      return `<section class="py16 bga"><div class="csm"><div class="sh"><div><div class="sh-sub">Reserve</div><h2 class="sh-t">${esc(p.title || "Make a Reservation")}</h2></div></div>
        <form style="display:flex;flex-direction:column;gap:20px;background:var(--bgc);border:1px solid var(--bdr);border-radius:var(--rlg);padding:32px"><div class="gr gc2 g5"><div class="fl-wrap"><input type="text" placeholder=" " class="inp" /><label>Full Name</label></div><div class="fl-wrap"><input type="tel" placeholder=" " class="inp" /><label>Phone Number</label></div></div><div class="fl-wrap"><input type="email" placeholder=" " class="inp" /><label>Email Address</label></div><div class="gr gc3 g5"><div class="fl-wrap"><input type="number" placeholder=" " class="inp" min="1" max="20" /><label>Guests</label></div><div class="fl-wrap"><input type="text" placeholder=" " class="inp" /><label>Preferred Date</label></div><div class="fl-wrap"><input type="text" placeholder=" " class="inp" /><label>Preferred Time</label></div></div><div class="fl-wrap"><textarea placeholder=" " class="inp txa"></textarea><label>Special Requests</label></div><button type="submit" class="btn bp blg ${b}">${esc(p.submitText || "Reserve Now")}</button></form></div></section>`;

    case "Services":
      return `<section class="py16"><div class="ct"><div class="sh"><div><div class="sh-sub">Services</div><h2 class="sh-t">${esc(p.title || "Our Services")}</h2></div></div>
        <div class="gr gc1 md:gc3 g8">${(p.services || []).map((svc: any) => `<div style="background:var(--bgc);border:1px solid var(--bdr);border-radius:var(--rlg);padding:32px;text-align:center;transition:all .25s" onmouseover="this.style.boxShadow='var(--shl)';this.style.transform='translateY(-4px)'" onmouseout="this.style.boxShadow='none';this.style.transform='none'"><div style="width:56px;height:56px;border-radius:50%;background:${pri}15;color:${pri};display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:1.5rem">${esc(svc.icon || "\u2726")}</div><h3 class="fs mb2">${esc(svc.name || svc.title)}</h3><p class="ts" style="color:var(--ctxl);line-height:1.6">${esc(svc.description || "")}</p>${svc.price ? `<div class="fb mt3" style="color:${pri}">From $${esc(svc.price)}</div>` : ""}</div>`).join("")}</div></div></section>`;

    case "AppointmentBooking":
      return `<section class="py16 bga"><div class="csm"><div class="sh"><div><div class="sh-sub">Book</div><h2 class="sh-t">${esc(p.title || "Book an Appointment")}</h2></div></div>
        <form style="display:flex;flex-direction:column;gap:20px;background:var(--bgc);border:1px solid var(--bdr);border-radius:var(--rlg);padding:32px"><div class="gr gc2 g5"><div class="fl-wrap"><input type="text" placeholder=" " class="inp" /><label>Your Name</label></div><div class="fl-wrap"><input type="email" placeholder=" " class="inp" /><label>Email Address</label></div></div><div class="fl-wrap"><input type="tel" placeholder=" " class="inp" /><label>Phone Number</label></div><div class="gr gc2 g5"><div class="fl-wrap"><input type="text" placeholder=" " class="inp" /><label>Preferred Date</label></div><div class="fl-wrap"><input type="text" placeholder=" " class="inp" /><label>Preferred Time</label></div></div><div class="fl-wrap"><textarea placeholder=" " class="inp txa"></textarea><label>Reason for Visit</label></div><button type="submit" class="btn bp blg ${b}">${esc(p.submitText || "Book Appointment")}</button></form></div></section>`;

    case "DoctorProfiles":
      return `<section class="py16"><div class="ct"><div class="sh"><div><div class="sh-sub">Doctors</div><h2 class="sh-t">${esc(p.title || "Meet Our Doctors")}</h2></div></div>
        <div class="gr gc2 md:gc4 g8">${(p.doctors || p.members || []).map((doc: any) => `<div class="tc"><div style="width:120px;height:120px;border-radius:var(--rlg);margin:0 auto 16px;overflow:hidden"><img src="${esc(doc.avatar || ph(doc.name || "Doctor", 300, 300))}" alt="${esc(doc.name)}" style="width:100%;height:100%;object-fit:cover" /></div><div class="fs">${esc(doc.name)}</div>${doc.specialty ? `<div style="color:${pri};font-size:.9375rem;font-weight:500;margin-top:2px">${esc(doc.specialty)}</div>` : ""}</div>`).join("")}</div></div></section>`;

    case "HealthResources":
      return `<section class="py16 bga"><div class="ct"><div class="sh"><div><div class="sh-sub">Resources</div><h2 class="sh-t">${esc(p.title || "Health Resources")}</h2></div></div>
        <div class="gr gc1 md:gc3 g8">${(p.resources || []).map((res: any) => `<article class="pc" style="text-decoration:none;display:block"><div class="pci" style="aspect-ratio:16/9">${res.image ? `<img src="${esc(res.image)}" alt="${esc(res.title)}" class="pcimg" />` : `<div style="width:100%;height:100%;background:${pri}10;display:flex;align-items:center;justify-content:center;color:${pri};font-size:2rem">\ud83d\udcc4</div>`}</div><div class="pcbd">${res.category ? `<div class="pcbc" style="color:${pri}">${esc(res.category)}</div>` : ""}<h3 class="fs mb2">${esc(res.title)}</h3><p class="ts" style="color:var(--ctxl);line-height:1.6">${esc(res.description || "")}</p></div></article>`).join("")}</div></div></section>`;

    case "CourseGrid":
      return `<section class="py16"><div class="ct"><div class="sh"><div><div class="sh-sub">Courses</div><h2 class="sh-t">${esc(p.title || "Browse Courses")}</h2></div></div>
        <div class="gr gc1 md:gc3 g8">${(p.courses || []).map((c: any) => `<div class="pc"><div class="pci" style="aspect-ratio:16/9">${c.image ? `<img src="${esc(c.image)}" alt="${esc(c.title)}" class="pcimg" />` : `<div style="width:100%;height:100%;background:${pri}10;display:flex;align-items:center;justify-content:center;color:${pri};font-size:2rem">\ud83d\udcda</div>`}</div><div class="pcbd">${c.category ? `<div class="pcbc" style="color:${pri}">${esc(c.category)}</div>` : ""}<h3 class="fs mb2">${esc(c.title)}</h3><p class="ts" style="color:var(--ctxl);line-height:1.6;margin-bottom:12px">${esc(c.description || "")}</p><div class="d aic jcsb"><div class="d aic g2">${c.duration ? `<span class="ts" style="color:var(--ctxlr)">\u23f1 ${esc(c.duration)}</span>` : ""}${c.level ? `<span class="badge bdgp">${esc(c.level)}</span>` : ""}</div>${c.price !== undefined ? `<div class="fb" style="color:${pri}">$${esc(c.price)}</div>` : ""}</div></div></div>`).join("")}</div></div></section>`;

    case "LearningPaths":
      return `<section class="py16 bga"><div class="ct"><div class="sh"><div><div class="sh-sub">Paths</div><h2 class="sh-t">${esc(p.title || "Learning Paths")}</h2></div></div>
        <div class="gr gc1 md:gc2 g8">${(p.paths || []).map((path: any) => `<div style="background:var(--bgc);border:1px solid var(--bdr);border-radius:var(--rlg);padding:28px;display:flex;gap:20px;transition:all .25s" onmouseover="this.style.boxShadow='var(--shl)';this.style.transform='translateY(-2px)'" onmouseout="this.style.boxShadow='none';this.style.transform='none'"><div style="width:64px;height:64px;border-radius:var(--rmd);background:${pri}15;color:${pri};display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:1.5rem">${esc(path.icon || "\ud83c\udfaf")}</div><div><h3 class="fs mb2">${esc(path.title)}</h3><p class="ts" style="color:var(--ctxl);line-height:1.6">${esc(path.description || "")}</p>${path.courses ? `<div class="ts mt2" style="color:var(--ctxlr)">${path.courses} courses</div>` : ""}</div></div>`).join("")}</div></div></section>`;

    case "StudentSuccess":
      return `<section class="py16"><div class="ct"><div class="sh"><div><div class="sh-sub">Success</div><h2 class="sh-t">${esc(p.title || "Student Success Stories")}</h2></div></div>
        <div class="gr gc1 md:gc3 g8">${(p.testimonials || p.students || []).map((s: any) => `<div class="tc2"><img src="${esc(s.avatar || ph(s.name || "Student", 80, 80))}" alt="${esc(s.name)}" class="tca" />${s.rating ? `<div class="mb3 d jcc">${starsHtml(s.rating)}</div>` : ""}<p class="tcq">&ldquo;${esc(s.quote || s.content || s.testimonial || "")}&rdquo;</p><div class="tcn">${esc(s.name)}</div>${s.role ? `<div class="tcr">${esc(s.role)}</div>` : ""}</div>`).join("")}</div></div></section>`;

    case "InstructorProfiles":
      return `<section class="py16 bga"><div class="ct"><div class="sh"><div><div class="sh-sub">Instructors</div><h2 class="sh-t">${esc(p.title || "Meet Our Instructors")}</h2></div></div>
        <div class="gr gc2 md:gc4 g8">${(p.instructors || p.members || []).map((inst: any) => `<div class="tc"><div style="width:100px;height:100px;border-radius:50%;margin:0 auto 16px;overflow:hidden;border:3px solid ${pri}20"><img src="${esc(inst.avatar || ph(inst.name || "Instructor", 300, 300))}" alt="${esc(inst.name)}" style="width:100%;height:100%;object-fit:cover" /></div><div class="fs">${esc(inst.name)}</div>${inst.specialty ? `<div style="color:var(--ctxl);font-size:.9375rem;margin-top:2px">${esc(inst.specialty)}</div>` : ""}</div>`).join("")}</div></div></section>`;

    case "PropertyGrid":
      return `<section class="py16"><div class="ct"><div class="sh"><div><div class="sh-sub">Properties</div><h2 class="sh-t">${esc(p.title || "Available Properties")}</h2></div></div>
        <div class="gr gc1 md:gc3 g8">${(p.properties || []).map((prop: any) => `<div class="pc"><div class="pci" style="aspect-ratio:16/10"><img src="${esc(prop.image || ph(prop.title || "Property", 600, 400))}" alt="${esc(prop.title)}" class="pcimg" />${prop.badge ? `<div class="pcb"><span class="badge bdg-n">${esc(prop.badge)}</span></div>` : ""}</div><div class="pcbd"><div class="d jcsb aic mb2"><div class="fb" style="color:${pri};font-size:1.125rem">$${esc(prop.price || "0")}</div>${prop.type ? `<span class="badge bdgp">${esc(prop.type)}</span>` : ""}</div><div class="pcbn" style="white-space:normal">${esc(prop.title)}</div><p class="ts" style="color:var(--ctxl);margin-bottom:12px">${esc(prop.address || "")}</p><div class="d aic g4" style="color:var(--ctxlr);font-size:.8125rem">${prop.beds ? `<span>${prop.beds} beds</span>` : ""}${prop.baths ? `<span>${prop.baths} baths</span>` : ""}${prop.sqft ? `<span>${prop.sqft} sqft</span>` : ""}</div></div></div>`).join("")}</div></div></section>`;

    case "PropertySearch":
      return `<section class="py16 bga"><div class="ct"><div class="sh"><div><div class="sh-sub">Search</div><h2 class="sh-t">${esc(p.title || "Find Your Perfect Home")}</h2></div></div>
        <form style="display:flex;flex-direction:column;gap:16px;background:var(--bgc);border:1px solid var(--bdr);border-radius:var(--rlg);padding:24px"><div class="gr gc2 md:gc4 g4"><div class="fl-wrap"><input type="text" placeholder=" " class="inp" /><label>Location</label></div><div class="fl-wrap"><select class="inp sel"><option>Property Type</option></select></div><div class="fl-wrap"><select class="inp sel"><option>Price Range</option></select></div><button type="submit" class="btn bp blg ${b}">Search</button></div></form></div></section>`;

    case "NeighborhoodGuide":
      return `<section class="py16"><div class="ct"><div class="sh"><div><div class="sh-sub">Explore</div><h2 class="sh-t">${esc(p.title || "Neighborhood Guide")}</h2></div></div>
        <div class="gr gc2 md:gc3 g6">${(p.neighborhoods || []).map((n: any) => `<a href="${esc(n.href || "#")}" class="pc" style="text-decoration:none"><div class="pci" style="aspect-ratio:4/3"><img src="${esc(n.image || ph(n.name || "Neighborhood", 400, 300))}" alt="${esc(n.name)}" class="pcimg" /><div class="pco" style="border-radius:inherit"><span class="btn bw bsm ${b}">Explore</span></div></div><div class="pcbd"><div class="pcbn" style="white-space:normal">${esc(n.name)}</div>${n.description ? `<p class="ts" style="color:var(--ctxl)">${esc(n.description)}</p>` : ""}</div></a>`).join("")}</div></div></section>`;

    case "AgentProfiles":
      return `<section class="py16 bga"><div class="ct"><div class="sh"><div><div class="sh-sub">Agents</div><h2 class="sh-t">${esc(p.title || "Our Agents")}</h2></div></div>
        <div class="gr gc2 md:gc4 g8">${(p.agents || p.members || []).map((agent: any) => `<div class="tc"><div style="width:100px;height:100px;border-radius:var(--rlg);margin:0 auto 16px;overflow:hidden"><img src="${esc(agent.avatar || ph(agent.name || "Agent", 300, 300))}" alt="${esc(agent.name)}" style="width:100%;height:100%;object-fit:cover" /></div><div class="fs">${esc(agent.name)}</div>${agent.title ? `<div style="color:${pri};font-size:.875rem;font-weight:500;margin-top:2px">${esc(agent.title)}</div>` : ""}</div>`).join("")}</div></div></section>`;

    case "DestinationGrid":
      return `<section class="py16"><div class="ct"><div class="sh"><div><div class="sh-sub">Destinations</div><h2 class="sh-t">${esc(p.title || "Explore Destinations")}</h2></div></div>
        <div class="gr gc2 md:gc3 g6">${(p.destinations || []).map((dest: any) => `<div class="pc"><div class="pci" style="aspect-ratio:4/3"><img src="${esc(dest.image || ph(dest.name || "Destination", 400, 300))}" alt="${esc(dest.name)}" class="pcimg" />${dest.price ? `<div class="pcb"><span class="badge bdg-n">From $${esc(dest.price)}</span></div>` : ""}<div class="pco"><button class="btn bw bsm ${b}">View Details</button></div></div><div class="pcbd"><div class="pcbn" style="white-space:normal">${esc(dest.name)}</div></div></div>`).join("")}</div></div></section>`;

    case "TravelDeals":
      return `<section class="py16 bga"><div class="ct"><div class="sh"><div><div class="sh-sub">Deals</div><h2 class="sh-t">${esc(p.title || "Travel Deals")}</h2></div></div>
        <div class="gr gc1 md:gc2 g8">${(p.deals || []).map((deal: any) => `<div class="d g6" style="background:var(--bgc);border:1px solid var(--bdr);border-radius:var(--rlg);overflow:hidden;transition:all .25s" onmouseover="this.style.boxShadow='var(--shl)';this.style.transform='translateY(-2px)'" onmouseout="this.style.boxShadow='none';this.style.transform='none'"><img src="${esc(deal.image || ph(deal.title || "Deal", 400, 300))}" alt="${esc(deal.title)}" style="width:200px;height:160px;object-fit:cover;flex-shrink:0" /><div class="p5"><div class="d jcsb aic mb2"><div class="fs">${esc(deal.title)}</div>${deal.discount ? `<span class="badge bdg-s">-${esc(deal.discount)}%</span>` : ""}</div><p class="ts mb3" style="color:var(--ctxl);line-height:1.5">${esc(deal.description || "")}</p><div class="d jcsb aic"><div>${deal.originalPrice ? `<span style="text-decoration:line-through;color:var(--ctxlr);font-size:.875rem">$${esc(deal.originalPrice)}</span> ` : ""}<span class="fb" style="color:${pri}">$${esc(deal.price || "0")}</span></div><a href="${esc(deal.href || "#")}" class="btn bp bsm ${b}">Book Now</a></div></div></div>`).join("")}</div></div></section>`;

    case "PackageGrid":
      return `<section class="py16"><div class="ct"><div class="sh"><div><div class="sh-sub">Packages</div><h2 class="sh-t">${esc(p.title || "Travel Packages")}</h2></div></div>
        <div class="gr gc1 md:gc3 g8">${(p.packages || []).map((pkg: any) => `<div class="pc"><div class="pci" style="aspect-ratio:16/10"><img src="${esc(pkg.image || ph(pkg.title || "Package", 600, 400))}" alt="${esc(pkg.title)}" class="pcimg" />${pkg.badge ? `<div class="pcb"><span class="badge bdg-s">${esc(pkg.badge)}</span></div>` : ""}</div><div class="pcbd"><div class="d jcsb aic mb2"><div class="pcbn" style="white-space:normal">${esc(pkg.title)}</div><div class="fb" style="color:${pri}">$${esc(pkg.price || "0")}</div></div>${pkg.duration ? `<div class="ts mb2" style="color:var(--ctxlr)">\u23f1 ${esc(pkg.duration)}</div>` : ""}<p class="ts" style="color:var(--ctxl);line-height:1.6">${esc(pkg.description || "")}</p><button class="btn bp bbl bsm ${b} mt4">View Package</button></div></div>`).join("")}</div></div></section>`;

    case "TravelGuides":
      return `<section class="py16 bga"><div class="ct"><div class="sh"><div><div class="sh-sub">Guides</div><h2 class="sh-t">${esc(p.title || "Travel Guides")}</h2></div></div>
        <div class="gr gc1 md:gc3 g8">${(p.guides || []).map((guide: any) => `<article class="pc" style="text-decoration:none;display:block"><div class="pci" style="aspect-ratio:16/9">${guide.image ? `<img src="${esc(guide.image)}" alt="${esc(guide.title)}" class="pcimg" />` : `<div style="width:100%;height:100%;background:${pri}10;display:flex;align-items:center;justify-content:center;color:${pri};font-size:2rem">\ud83d\uddfa\ufe0f</div>`}</div><div class="pcbd">${guide.destination ? `<div class="pcbc" style="color:${pri}">${esc(guide.destination)}</div>` : ""}<h3 class="fs mb2">${esc(guide.title)}</h3><p class="ts" style="color:var(--ctxl);line-height:1.6">${esc(guide.description || "")}</p></div></article>`).join("")}</div></div></section>`;

    default:
      return `<section class="py8 px6 tc" style="color:var(--ctxlr);border:2px dashed var(--bdr);border-radius:var(--rmd);margin:16px 24px"><p class="ts">Section: ${esc(component)}</p></section>`;
  }
};

const generateBaseCSS = (theme?: ThemeData): string => {
  const p = theme?.primaryColor || "#1e3a5f";
  const s = theme?.secondaryColor || "#2563eb";
  const f = theme?.fontFamily || "Inter";
  const bg = (theme as any)?.backgroundColor || "#ffffff";
  const fg = (theme as any)?.foregroundColor || "#1e293b";
  const muted = (theme as any)?.mutedColor || "#f1f5f9";
  const mutedFg = (theme as any)?.mutedForegroundColor || "#64748b";
  const border = (theme as any)?.borderColor || "#e2e8f0";
  const card = (theme as any)?.cardColor || "#ffffff";
  const style = theme?.style || "light";
  const br = theme?.borderRadius || "10px";
  const hexToRgb = (hex: string) => {
    const n = hex.replace("#", "");
    const full = n.length === 3 ? n.split("").map((c: string) => c + c).join("") : n;
    const v = Number.parseInt(full, 16);
    return { r: (v >> 16) & 255, g: (v >> 8) & 255, b: v & 255 };
  };
  const mixWithBlack = (hex: string, amount: number): string => {
    const { r, g, b } = hexToRgb(hex);
    const nr = Math.round(r * (1 - amount));
    const ng = Math.round(g * (1 - amount));
    const nb = Math.round(b * (1 - amount));
    return `#${((1 << 24) + (nr << 16) + (ng << 8) + nb).toString(16).slice(1)}`;
  };
  const mixWithWhite = (hex: string, amount: number): string => {
    const { r, g, b } = hexToRgb(hex);
    const nr = Math.round(r + (255 - r) * amount);
    const ng = Math.round(g + (255 - g) * amount);
    const nb = Math.round(b + (255 - b) * amount);
    return `#${((1 << 24) + (nr << 16) + (ng << 8) + nb).toString(16).slice(1)}`;
  };
  const isDark = style === "dark";
  const bgd = isDark ? mixWithBlack(p, 0.9) : mixWithBlack(p, 0.85);
  const navBg = isDark ? `rgba(0,0,0,.95)` : `rgba(255,255,255,.97)`;
  const heroOverlay = isDark ? mixWithBlack(p, 0.5) : mixWithBlack(p, 0.6);
  const brSm = br === "0" || br === "none" ? "0px" : br === "2px" || br === "4px" ? "3px" : br === "6px" || br === "8px" ? "6px" : br === "10px" || br === "12px" ? "8px" : br === "16px" || br === "20px" ? "12px" : br === "24px" ? "16px" : "6px";
  const brMd = br === "0" || br === "none" ? "0px" : br === "2px" || br === "4px" ? "4px" : br === "6px" ? "6px" : br === "8px" || br === "10px" ? "10px" : br === "12px" ? "12px" : br === "16px" ? "16px" : br === "20px" ? "20px" : br === "24px" ? "24px" : "10px";
  const brLg = br === "0" || br === "none" ? "0px" : br === "2px" || br === "4px" ? "6px" : br === "6px" || br === "8px" ? "10px" : br === "10px" || br === "12px" ? "14px" : br === "16px" ? "18px" : br === "20px" ? "22px" : br === "24px" ? "28px" : "16px";
  return `
  <style id="site-css">
    :root{--c1:${p};--c1l:${p}15;--c1d:${p}e6;--c2:${s};--c2l:${s}15;--ctx:${fg};--ctxl:${mutedFg};--ctxlr:${mutedFg}aa;--bdr:${border};--bg:${bg};--bga:${muted};--bgc:${card};--bgd:${bgd};--ok:#059669;--wrn:#d97706;--err:#dc2626;--shs:0 1px 2px rgba(0,0,0,.05);--shm:0 4px 6px -1px rgba(0,0,0,.07),0 2px 4px -2px rgba(0,0,0,.05);--shl:0 10px 15px -3px rgba(0,0,0,.08),0 4px 6px -4px rgba(0,0,0,.05);--shx:0 20px 25px -5px rgba(0,0,0,.08),0 8px 10px -6px rgba(0,0,0,.04);--rsm:${brSm};--rmd:${brMd};--rlg:${brLg};--rxl:${brLg};--rpl:9999px;--tr:.25s cubic-bezier(.4,0,.2,1);--fnt:'${f}',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth}
    body{font-family:var(--fnt);color:var(--ctx);background:var(--bg);line-height:1.6;-webkit-font-smoothing:antialiased}
    img{max-width:100%;height:auto;display:block}
    a{color:inherit;text-decoration:none}
    .tx{font-size:.75rem}.ts{font-size:.875rem}.tb{font-size:1rem}.tl{font-size:1.125rem}.txl{font-size:1.25rem}.tx2{font-size:1.5rem}.tx3{font-size:1.875rem}.tx4{font-size:2.25rem}.tx5{font-size:3rem}.tx6{font-size:3.75rem}
    .fl{font-weight:300}.fn{font-weight:400}.fm{font-weight:500}.fs{font-weight:600}.fb{font-weight:700}
    .lt{line-height:1.25}.ln{line-height:1.6}.lr{line-height:1.75}.tk{letter-spacing:-.025em}.tw{letter-spacing:.05em}.up{text-transform:uppercase}
    .ct{width:100%;max-width:1280px;margin:0 auto;padding:0 24px}.csm{max-width:960px;margin:0 auto;padding:0 24px}.cxs{max-width:720px;margin:0 auto;padding:0 24px}
    .d{display:flex}.dc{flex-direction:column}.dw{flex-wrap:wrap}.aic{align-items:center}.ais{align-items:flex-start}.aie{align-items:flex-end}.jcc{justify-content:center}.jcsb{justify-content:space-between}.jce{justify-content:flex-end}
    .g1{gap:4px}.g2{gap:8px}.g3{gap:12px}.g4{gap:16px}.g5{gap:20px}.g6{gap:24px}.g8{gap:32px}.g10{gap:40px}.g12{gap:48px}.f1{flex:1 1 0%}.ns{flex-shrink:0}
    .gr{display:grid}.gc1{grid-template-columns:repeat(1,1fr)}.gc2{grid-template-columns:repeat(2,1fr)}.gc3{grid-template-columns:repeat(3,1fr)}.gc4{grid-template-columns:repeat(4,1fr)}.gc6{grid-template-columns:repeat(6,1fr)}
    .p0{padding:0}.p2{padding:8px}.p3{padding:12px}.p4{padding:16px}.p5{padding:20px}.p6{padding:24px}.p8{padding:32px}.p10{padding:40px}
    .px3{padding-left:12px;padding-right:12px}.px4{padding-left:16px;padding-right:16px}.px5{padding-left:20px;padding-right:20px}.px6{padding-left:24px;padding-right:24px}.px8{padding-left:32px;padding-right:32px}
    .py2{padding-top:8px;padding-bottom:8px}.py3{padding-top:12px;padding-bottom:12px}.py4{padding-top:16px;padding-bottom:16px}.py6{padding-top:24px;padding-bottom:24px}.py8{padding-top:32px;padding-bottom:32px}.py10{padding-top:40px;padding-bottom:40px}.py12{padding-top:48px;padding-bottom:48px}.py16{padding-top:64px;padding-bottom:64px}.py20{padding-top:80px;padding-bottom:80px}.py24{padding-top:96px;padding-bottom:96px}
    .mt1{margin-top:4px}.mt2{margin-top:8px}.mt3{margin-top:12px}.mt4{margin-top:16px}.mt6{margin-top:24px}.mt8{margin-top:32px}.mt10{margin-top:40px}.mt12{margin-top:48px}
    .mb1{margin-bottom:4px}.mb2{margin-bottom:8px}.mb3{margin-bottom:12px}.mb4{margin-bottom:16px}.mb6{margin-bottom:24px}.mb8{margin-bottom:32px}.mb10{margin-bottom:40px}.mb12{margin-bottom:48px}
    .mr2{margin-right:8px}.mr3{margin-right:12px}.ml2{margin-left:8px}.mla{margin-left:auto}.mx{margin-left:auto;margin-right:auto}
    .rel{position:relative}.abs{position:absolute}.fx{position:fixed}.stk{position:sticky}.i0{top:0;right:0;bottom:0;left:0}.t0{top:0}.l0{left:0}.z10{z-index:10}.z20{z-index:20}.z50{z-index:50}
    .blk{display:block}.ib{display:inline-block}.hid{display:none}.oh{overflow:hidden}
    .wf{width:100%}.hf{height:100%}.mhs{min-height:100vh}
    .tw{color:#fff}.tgr4{color:var(--ctxlr)}.tgr5{color:var(--ctxl)}.tgr6{color:#4b5563}.tgr7{color:#374151}.tgr8{color:var(--ctx)}.tgr9{color:#111827}.tr5{color:var(--err)}.tr6{color:#b91c1c}.tg6{color:var(--ok)}.tc{text-align:center}.tnc{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.tln{text-decoration:line-through}.ti{font-style:italic}
    .bgw{background:var(--bgc)}.bga{background:var(--bga)}.bg1{background:var(--bga)}.bg2{background:var(--bdr)}.bgd{background:var(--bgd)}.bgp{background:var(--c1)}.bgs{background:var(--c2)}
    .bd{border:1px solid var(--bdr)}.bd0{border:0}.bdt{border-top:1px solid var(--bdr)}.bdb{border-bottom:1px solid var(--bdr)}.bdg2{border-color:var(--bdr)}.bdg3{border-color:var(--bdr)}.bdr5{border-color:var(--err)}.bdr2{border-color:var(--err)}.bd2{border-width:2px}
    .rn{border-radius:var(--rsm)}.rmd{border-radius:var(--rmd)}.rlg{border-radius:var(--rlg)}.rxl{border-radius:var(--rxl)}.rfl{border-radius:9999px}.r-sm{border-radius:var(--rsm)}.r-md{border-radius:var(--rmd)}.r-lg{border-radius:var(--rlg)}.r-xl{border-radius:var(--rxl)}
    .shs{box-shadow:var(--shs)}.shm{box-shadow:var(--shm)}.shl{box-shadow:var(--shl)}.shx{box-shadow:var(--shx)}
    .tr{transition:all var(--tr)}.trc{transition:color var(--tr),background-color var(--tr),border-color var(--tr)}
    .ho7:hover{opacity:.75}.ho8:hover{opacity:.8}.ho1:hover{opacity:1}.hbga:hover{background:var(--bga)}.hbg1:hover{background:var(--bga)}.htgr9:hover{color:var(--ctx)}.htw:hover{color:#fff}.hbd4:hover{border-color:var(--ctxlr)}
    .oc{object-fit:cover}.oi{object-fit:contain}.cp{cursor:pointer}
    .sn{list-style:none}.o6{opacity:.6}.o8{opacity:.8}.o9{opacity:.9}
    .sy2>*+*{margin-top:8px}.sy3>*+*{margin-top:12px}.sy4>*+*{margin-top:16px}.sy5>*+*{margin-top:20px}.sy6>*+*{margin-top:24px}.sy8>*+*{margin-top:32px}
    .stars{display:inline-flex;gap:1px}.si{width:16px;height:16px}.sf{color:#f59e0b;fill:#f59e0b}.sh{color:#f59e0b}.se{color:#d1d5db;fill:#d1d5db}
    .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;font-weight:600;font-size:.875rem;line-height:1.5;padding:12px 28px;border:2px solid transparent;cursor:pointer;transition:all .3s cubic-bezier(.4,0,.2,1);text-decoration:none;white-space:nowrap;font-family:var(--fnt);position:relative;overflow:hidden}
    .btn::before{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.15),transparent);transition:left .5s ease}
    .btn:hover::before{left:100%}
    .btn:active{transform:scale(.96)}
    .bp{background:linear-gradient(135deg,var(--c1),var(--c2));color:#fff;border-color:transparent;box-shadow:0 4px 15px var(--c1d)}
    .bp:hover{filter:brightness(1.1);box-shadow:0 8px 25px var(--c1d);transform:translateY(-2px)}
    .bs2{background:transparent;color:var(--c1);border-color:var(--c1)}.bs2:hover{background:var(--c1);color:#fff;box-shadow:0 8px 25px var(--c1d);transform:translateY(-2px)}
    .bw{background:var(--bgc);color:var(--c1);border-color:var(--bdr)}.bw:hover{background:var(--bga);border-color:var(--c1);transform:translateY(-1px)}
    .bk{background:#111827;color:#fff;border-color:#111827}.bk:hover{background:#1f2937;border-color:#1f2937;box-shadow:0 8px 25px rgba(0,0,0,.15);transform:translateY(-2px)}
    .br{background:var(--err);color:#fff;border-color:var(--err)}.br:hover{background:#b91c1c;box-shadow:0 8px 25px rgba(220,38,38,.3);transform:translateY(-2px)}
    .bsm{padding:8px 20px;font-size:.8125rem}.blg{padding:16px 36px;font-size:1rem;font-weight:700}.bbl{width:100%}.b-pill{border-radius:var(--rpl)}.b-sq{border-radius:0}.b-def{border-radius:var(--rmd)}
    .inp{width:100%;padding:14px 18px;border:1.5px solid var(--bdr);border-radius:var(--rmd);font-size:.9375rem;font-family:var(--fnt);color:var(--ctx);background:var(--bgc);transition:all .3s cubic-bezier(.4,0,.2,1);outline:none}
    .inp:focus{border-color:var(--c1);box-shadow:0 0 0 4px var(--c1l);transform:translateY(-1px)}
    .inp::placeholder{color:var(--ctxlr)}
    .txa{min-height:140px;resize:vertical}
    .sel{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;padding-right:40px}
    .fl-wrap{position:relative}.fl-wrap .inp{padding-top:22px;padding-bottom:8px}.fl-wrap label{position:absolute;top:16px;left:18px;font-size:.9375rem;color:var(--ctxlr);transition:all .25s cubic-bezier(.4,0,.2,1);pointer-events:none}
    .fl-wrap .inp:focus~label,.fl-wrap .inp:not(:placeholder-shown)~label{top:6px;left:18px;font-size:.75rem;color:var(--c1);font-weight:700;letter-spacing:.02em}
    .badge{display:inline-flex;align-items:center;padding:4px 12px;font-size:.75rem;font-weight:700;border-radius:var(--rpl);line-height:1.5;letter-spacing:.02em}.bdgp{background:var(--c1l);color:var(--c1);border:1px solid var(--c1l)}.bdgd{background:var(--err);color:#fff;box-shadow:0 2px 8px rgba(220,38,38,.2)}.bdgs{background:var(--ok);color:#fff;box-shadow:0 2px 8px rgba(5,150,105,.2)}.bdgw{background:var(--wrn);color:#fff;box-shadow:0 2px 8px rgba(217,119,6,.2)}.bdg-s{background:var(--err);color:#fff;box-shadow:0 2px 8px rgba(220,38,38,.2)}.bdg-n{background:var(--c1);color:#fff;box-shadow:0 2px 8px var(--c1d)}
    .pc{background:var(--bgc);border:1px solid var(--bdr);border-radius:var(--rlg);overflow:hidden;transition:all .4s cubic-bezier(.4,0,.2,1);box-shadow:0 1px 3px rgba(0,0,0,.04)}
    .pc:hover{box-shadow:0 20px 60px rgba(0,0,0,.1),0 8px 20px rgba(0,0,0,.06);transform:translateY(-8px);border-color:var(--c1l)}
    .pci{position:relative;overflow:hidden;aspect-ratio:1}.pcimg{width:100%;height:100%;object-fit:cover;transition:transform .6s cubic-bezier(.4,0,.2,1)}.pc:hover .pcimg{transform:scale(1.1)}
    .pco{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,.5) 100%);display:flex;align-items:center;justify-content:center;gap:12px;opacity:0;transition:all .4s ease}.pc:hover .pco{opacity:1}.pco .btn{padding:10px 20px;font-size:.8125rem;backdrop-filter:blur(8px)}
    .pcb{position:absolute;top:12px;left:12px;z-index:2;display:flex;flex-direction:column;gap:6px}
    .pcbd{padding:16px}.pcbc{font-size:.75rem;font-weight:500;color:var(--ctxlr);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px}.pcbn{font-size:.9375rem;font-weight:600;color:var(--ctx);margin-bottom:6px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pcbp{display:flex;align-items:center;gap:8px;margin-top:8px}.pcbp .cur{font-size:1.125rem;font-weight:700;color:var(--c1)}.pcbp .org{font-size:.875rem;color:var(--ctxlr);text-decoration:line-through}
    .hero{position:relative;width:100%;min-height:600px;display:flex;align-items:center;justify-content:center;text-align:center;color:#fff;overflow:hidden;background-attachment:fixed}
    .hero::before{content:'';position:absolute;top:-50%;right:-50%;width:100%;height:100%;background:radial-gradient(circle,rgba(255,255,255,.08) 0%,transparent 70%);z-index:0;animation:floatOrb 20s ease-in-out infinite}
    .hero::after{content:'';position:absolute;bottom:-30%;left:-30%;width:80%;height:80%;background:radial-gradient(circle,rgba(255,255,255,.05) 0%,transparent 70%);z-index:0;animation:floatOrb 15s ease-in-out infinite reverse}
    @keyframes floatOrb{0%,100%{transform:translate(0,0)}50%{transform:translate(30px,-40px)}}
    .hero-ov{position:absolute;inset:0;background:linear-gradient(135deg,${heroOverlay} 0%,rgba(0,0,0,.15) 50%,${heroOverlay} 100%);z-index:1}
    .hero-c{position:relative;z-index:2;max-width:780px;padding:100px 24px}
    .hero-b{display:inline-flex;align-items:center;gap:6px;padding:8px 20px;background:rgba(255,255,255,.12);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.18);border-radius:var(--rpl);font-size:.8125rem;font-weight:600;margin-bottom:24px;letter-spacing:.06em;text-transform:uppercase;animation:fadeInDown .8s ease-out both}
    .hero-t{font-size:4rem;font-weight:800;line-height:1.05;letter-spacing:-.04em;margin-bottom:20px;text-shadow:0 2px 20px rgba(0,0,0,.2);animation:fadeInUp .8s ease-out .1s both}
    .hero-s{font-size:1.3rem;opacity:.92;margin-bottom:40px;line-height:1.7;max-width:600px;margin-left:auto;margin-right:auto;text-shadow:0 1px 8px rgba(0,0,0,.1);animation:fadeInUp .8s ease-out .25s both}
    .hero-a{display:flex;gap:16px;justify-content:center;flex-wrap:wrap;animation:fadeInUp .8s ease-out .4s both}
    @keyframes fadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeInDown{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}
    .sh{display:flex;align-items:center;justify-content:center;margin-bottom:56px;flex-direction:column}
    .sh-sub{display:inline-block;font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.15em;color:var(--c1);margin-bottom:12px;padding:6px 16px;background:var(--c1l);border-radius:var(--rpl);border:1px solid var(--c1l)}
    .sh-t{font-size:2.5rem;font-weight:800;color:var(--ctx);letter-spacing:-.03em;margin-bottom:16px;text-align:center;position:relative;line-height:1.2}
    .sh-t::after{content:'';display:block;width:60px;height:4px;background:linear-gradient(90deg,var(--c1),var(--c2));border-radius:2px;margin:16px auto 0}
    .sh-d{font-size:1.1rem;color:var(--ctxl);max-width:560px;margin:0 auto;line-height:1.7;text-align:center}
    .tc2{background:var(--bgc);border:1px solid var(--bdr);border-radius:var(--rlg);padding:36px;text-align:center;transition:all .4s cubic-bezier(.4,0,.2,1);box-shadow:0 1px 3px rgba(0,0,0,.04);position:relative;overflow:hidden}
    .tc2::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,var(--c1),var(--c2));opacity:0;transition:opacity .3s}
    .tc2:hover{box-shadow:0 20px 60px rgba(0,0,0,.1);transform:translateY(-8px);border-color:var(--c1l)}
    .tc2:hover::before{opacity:1}
    .tca{width:72px;height:72px;border-radius:50%;object-fit:cover;margin:0 auto 20px;border:3px solid var(--c1l);box-shadow:0 4px 12px rgba(0,0,0,.08);transition:all .3s}
    .tc2:hover .tca{border-color:var(--c1);transform:scale(1.05)}
    .tcq{font-size:1.05rem;color:var(--ctxl);line-height:1.8;margin-bottom:20px;font-style:italic;position:relative}
    .tcn{font-weight:700;color:var(--ctx);font-size:1rem}.tcr{font-size:.8125rem;color:var(--ctxlr);margin-top:4px}
    .fi{border:1px solid var(--bdr);border-radius:var(--rmd);overflow:hidden;margin-bottom:12px;transition:all .3s ease;background:var(--bgc)}
    .fi:hover{border-color:var(--c1);box-shadow:0 4px 12px rgba(0,0,0,.04)}
    .ftt{width:100%;padding:20px 24px;display:flex;align-items:center;justify-content:space-between;background:transparent;border:none;cursor:pointer;font-size:1rem;font-weight:600;color:var(--ctx);text-align:left;font-family:var(--fnt);transition:all .25s ease}
    .ftt:hover{color:var(--c1)}
    .fti{width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:var(--c1l);color:var(--c1);flex-shrink:0;transition:all .35s cubic-bezier(.4,0,.2,1);font-size:1.125rem;line-height:1}
    .fi[open] .fti{background:var(--c1);color:#fff;transform:rotate(45deg)}
    .fc{padding:0 24px 20px;color:var(--ctxl);line-height:1.8}.ftt::-webkit-details-marker{display:none}.ftt::marker{display:none;content:''}
    .brd{display:flex;align-items:center;gap:10px;font-size:.875rem;color:var(--ctxlr);padding:20px 0;flex-wrap:wrap}.brd a{transition:all .25s ease;font-weight:500}.brd a:hover{color:var(--c1);transform:translateX(2px)}.brd-s{color:var(--ctxlr);margin:0 2px;opacity:.5}.brd-c{color:var(--ctx);font-weight:600}
    .tw2{overflow-x:auto;border-radius:var(--rlg);border:1px solid var(--bdr)}.tbl{width:100%;border-collapse:collapse}.tbl th{padding:16px 24px;font-size:.8125rem;font-weight:700;color:var(--ctxl);text-align:left;text-transform:uppercase;letter-spacing:.06em;background:var(--bga);border-bottom:1px solid var(--bdr)}.tbl td{padding:18px 24px;font-size:.9375rem;border-bottom:1px solid var(--bdr);vertical-align:middle}.tbl tbody tr{transition:background .25s ease}.tbl tbody tr:hover{background:var(--bga)}
    .qty{display:inline-flex;align-items:center;border:1.5px solid var(--bdr);border-radius:var(--rmd);overflow:hidden;background:var(--bgc)}.qb{display:flex;align-items:center;justify-content:center;width:40px;height:40px;border:none;background:transparent;cursor:pointer;font-size:1.125rem;color:var(--ctx);transition:all .25s ease}.qb:hover{background:var(--c1l);color:var(--c1)}.qv{width:48px;text-align:center;font-weight:700;font-size:.9375rem;border-left:1px solid var(--bdr);border-right:1px solid var(--bdr);padding:6px 0}
    .steps{display:flex;align-items:center;justify-content:center;gap:0}.stp{display:flex;align-items:center;gap:10px}.stpn{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.875rem;font-weight:700;background:var(--bga);color:var(--ctxlr);border:2px solid var(--bdr);transition:all .3s ease}.stp.act .stpn{background:linear-gradient(135deg,var(--c1),var(--c2));color:#fff;border-color:transparent;box-shadow:0 4px 12px var(--c1d)}.stp.dn .stpn{background:var(--ok);color:#fff;border-color:transparent}.stpl{font-size:.875rem;font-weight:600;color:var(--ctxlr)}.stp.act .stpl{color:var(--ctx)}.stpline{width:56px;height:2px;background:var(--bdr);margin:0 12px}
    .nlb{background:linear-gradient(135deg,var(--c1) 0%,var(--c2) 100%);padding:80px 24px;text-align:center;color:#fff;position:relative;overflow:hidden}
    .nlb::before{content:'';position:absolute;top:-50%;right:-20%;width:500px;height:500px;border-radius:50%;background:rgba(255,255,255,.06);pointer-events:none}
    .nlb::after{content:'';position:absolute;bottom:-30%;left:-10%;width:400px;height:400px;border-radius:50%;background:rgba(255,255,255,.04);pointer-events:none}
    .nlf{display:flex;gap:12px;max-width:520px;margin:0 auto}
    .nlf .inp{flex:1;background:var(--bgc);border:none;box-shadow:0 4px 20px rgba(0,0,0,.1)}@media(max-width:640px){.nlf{flex-direction:column}}
    .ph{background:var(--bgd);color:#fff;padding:80px 24px;position:relative;overflow:hidden}
    .ph::before{content:'';position:absolute;top:-50%;right:-20%;width:500px;height:500px;border-radius:50%;background:rgba(255,255,255,.05);pointer-events:none}
    .ph::after{content:'';position:absolute;bottom:-30%;left:-10%;width:400px;height:400px;border-radius:50%;background:rgba(255,255,255,.03);pointer-events:none}
    .phi{max-width:1280px;margin:0 auto;position:relative;z-index:1}
    .mp{background:var(--bga);border:2px dashed var(--bdr);border-radius:var(--rlg);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;color:var(--ctxlr);min-height:320px;transition:all .3s}.mp:hover{border-color:var(--c1)}
    .mp svg{width:48px;height:48px;opacity:.4;transition:all .3s}.mp:hover svg{opacity:.7;transform:scale(1.1)}
    .nav{position:sticky;top:0;z-index:1000;background:${navBg};backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid rgba(0,0,0,.05);transition:all .3s ease;box-shadow:none}
    .nav.sc{box-shadow:0 4px 30px rgba(0,0,0,.08);backdrop-filter:blur(24px)}
    .nav-in{display:flex;align-items:center;justify-content:space-between;padding:0 32px;height:76px;max-width:1280px;margin:0 auto}
    .nav-l{font-size:1.5rem;font-weight:800;color:var(--c1);letter-spacing:-.03em;display:flex;align-items:center;gap:10px;flex-shrink:0}
    .nav-ks{display:flex;align-items:center;gap:36px}
    .nav-k{font-size:.9375rem;font-weight:500;color:var(--ctx);transition:color .25s;position:relative;padding:4px 0}.nav-k:hover{color:var(--c1)}
    .nav-k::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:2.5px;background:linear-gradient(90deg,var(--c1),var(--c2));border-radius:2px;transition:width .3s cubic-bezier(.4,0,.2,1)}.nav-k:hover::after{width:100%}
    .nav-dd{position:relative}.nav-dd-m{position:absolute;top:100%;left:-16px;margin-top:14px;background:var(--bgc);border:1px solid var(--bdr);border-radius:var(--rmd);box-shadow:0 10px 40px rgba(0,0,0,.1);min-width:220px;padding:8px 0;opacity:0;visibility:hidden;transform:translateY(-8px);transition:all .25s ease;z-index:100}.nav-dd:hover .nav-dd-m{opacity:1;visibility:visible;transform:translateY(0)}
    .nav-dd-i{display:block;padding:10px 20px;font-size:.875rem;color:var(--ctx);transition:all .2s ease;border-radius:var(--rsm);margin:2px 8px}.nav-dd-i:hover{background:var(--c1l);color:var(--c1)}
    .nav-a{display:flex;align-items:center;gap:16px}
    .nav-ab{display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:50%;border:none;background:transparent;color:var(--ctx);cursor:pointer;transition:all var(--tr);position:relative}.nav-ab:hover{background:var(--bga);color:var(--c1)}.nav-ab svg{width:20px;height:20px}
    .cc{position:absolute;top:2px;right:0;width:18px;height:18px;background:var(--err);color:#fff;font-size:.6875rem;font-weight:700;border-radius:50%;display:flex;align-items:center;justify-content:center;line-height:1}
    .mtog{display:none}.ham{display:none;flex-direction:column;justify-content:center;gap:5px;width:32px;height:32px;cursor:pointer;background:none;border:none;padding:0}.ham span{display:block;width:100%;height:2.5px;background:var(--ctx);border-radius:2px;transition:all .35s cubic-bezier(.4,0,.2,1)}
    .mnav{display:none;position:fixed;top:76px;left:0;right:0;bottom:0;background:var(--bg);z-index:999;padding:24px;overflow-y:auto;transform:translateX(-100%);transition:transform .35s cubic-bezier(.4,0,.2,1);box-shadow:4px 0 20px rgba(0,0,0,.05)}
    .mnav.op{transform:translateX(0)}
    .mnav-k{display:block;padding:16px 0;font-size:1.125rem;font-weight:600;color:var(--ctx);border-bottom:1px solid var(--bdr);transition:all .25s}.mnav-k:hover{color:var(--c1);padding-left:8px}
    .mnav-s{padding-left:16px}.mnav-s a{display:block;padding:12px 0;font-size:.9375rem;color:var(--ctxl);transition:all .25s}.mnav-s a:hover{color:var(--c1);padding-left:8px}
    @media(max-width:768px){.nav-ks{display:none}.ham{display:flex}.mtog:checked~.mnav{display:block}.mtog:checked~label .ham span:nth-child(1){transform:translateY(7.5px) rotate(45deg)}.mtog:checked~label .ham span:nth-child(2){opacity:0;transform:translateX(-8px)}.mtog:checked~label .ham span:nth-child(3){transform:translateY(-7.5px) rotate(-45deg)}.gc2,.gc3,.gc4,.gc6{grid-template-columns:repeat(2,1fr)}.hero-t{font-size:2.5rem}.hero{min-height:480px}.hero-c{padding:80px 20px}.sh-t{font-size:2rem}.tx5{font-size:2.25rem}.tx3{font-size:1.5rem}}
    @media(min-width:769px){.mnav{display:none!important}}
    .footer{background:var(--bgd);color:var(--ctxl);padding:80px 24px 32px;position:relative;overflow:hidden}
    .footer::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,var(--c1),var(--c2),var(--c1))}
    .ftg{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:48px;max-width:1280px;margin:0 auto}
    .ftb{max-width:340px}.ftbn{font-size:1.5rem;font-weight:800;color:#fff;margin-bottom:16px;letter-spacing:-.02em}.ftbd{font-size:.875rem;line-height:1.8;color:var(--ctxlr)}
    .fth{font-size:.875rem;font-weight:700;color:#fff;margin-bottom:20px;text-transform:uppercase;letter-spacing:.08em}
    .ftl{list-style:none}.ftl li{margin-bottom:12px}.ftl a{font-size:.875rem;color:var(--ctxlr);transition:all .25s ease;display:inline-block}.ftl a:hover{color:#fff;transform:translateX(4px)}
    .fts{display:flex;gap:12px;margin-top:24px}.fts a{display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.06);color:var(--ctxlr);transition:all .3s ease;border:1px solid rgba(255,255,255,.08)}.fts a:hover{background:var(--c1);color:#fff;transform:translateY(-4px);box-shadow:0 8px 20px rgba(0,0,0,.2)}.fts svg{width:18px;height:18px}
    .ftbt{max-width:1280px;margin:48px auto 0;padding-top:28px;border-top:1px solid rgba(255,255,255,.08);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px}
    .ftc{font-size:.8125rem;color:var(--ctxlr)}
    .ftp{display:flex;gap:8px}.ftpb{display:inline-flex;align-items:center;justify-content:center;padding:6px 14px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:var(--rsm);font-size:.75rem;font-weight:600;color:var(--ctxlr);transition:all .25s}
    .ftpb:hover{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.15)}
    @media(max-width:768px){.ftg{grid-template-columns:1fr 1fr}.ftb{grid-column:1/-1}}@media(max-width:480px){.ftg{grid-template-columns:1fr}}
    @keyframes fiu{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
    @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
    @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
    ${theme?.animations ? (theme.animations === true ? `section{animation:fiu .7s cubic-bezier(.4,0,.2,1) both}` : theme.animations === "subtle" ? `section{animation:fiu .9s ease-out both}` : theme.animations === "full" ? `section{animation:fiu .5s cubic-bezier(.22,1,.36,1) both}` : `section{animation:fiu .7s cubic-bezier(.4,0,.2,1) both}`) : ""}
  </style>`;
};

const generatePageHtml = (
  page: { slug: string; title: string; sections: Array<{ id: string; component: string; props: Record<string, any>; order: number }> },
  siteName: string,
  navigation: { items?: Array<{ label: string; href: string; children?: Array<{ label: string; href: string }> }> } | undefined,
  footer: { copyright?: string; links?: Array<{ label: string; href: string }>; socialMedia?: Record<string, string> } | undefined,
  theme?: ThemeData,
  seo?: { metaTitle?: string; metaDescription?: string; keywords?: string[] },
  logo?: string | null
): string => {
  const fontName = theme?.fontFamily || "Inter";
  const sections = [...page.sections]
    .sort((a, b) => a.order - b.order)
    .map(s => renderComponent(s.component, s.props || {}, theme))
    .join("\n");

  const navItems = navigation?.items || [];
  const brandedNav = navItems.length > 0
    ? navItems
    : [{ label: "Home", href: "/" }, { label: "About", href: "/about_us" }, { label: "Contact", href: "/contact_us" }];

  const metaTitle = seo?.metaTitle || `${page.title} | ${siteName}`;
  const metaDescription = seo?.metaDescription || page.title;
  const keywords = seo?.keywords?.join(", ") || "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${esc(metaDescription)}">
  ${keywords ? `<meta name="keywords" content="${esc(keywords)}">` : ""}
  <meta property="og:title" content="${esc(metaTitle)}">
  <meta property="og:description" content="${esc(metaDescription)}">
  <meta property="og:type" content="website">
  <title>${esc(metaTitle)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, "+")}:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  ${generateBaseCSS(theme)}
</head>
<body>
  ${renderNavigation(siteName, brandedNav, logo)}
  <main>
    ${sections}
  </main>
  ${renderFooter(footer || {}, siteName)}
  <script>
    // TODO: Uncomment Store when eCommerce is implemented
    // var Store = {
    //   _key: 'site_store',
    //   _data: { cart: [], wishlist: [], recentlyViewed: [] },
    //   init: function() {
    //     try { var s = localStorage.getItem(this._key); if (s) this._data = JSON.parse(s); } catch(e) {}
    //   },
    //   save: function() { try { localStorage.setItem(this._key, JSON.stringify(this._data)); } catch(e) {} },
    //   getCart: function() { return this._data.cart; },
    //   getWishlist: function() { return this._data.wishlist; },
    //   addToCart: function(product) {
    //     var existing = this._data.cart.find(function(i){ return i.id === product.id && i.variant === product.variant && i.size === product.size; });
    //     if (existing) { existing.quantity += (product.quantity || 1); }
    //     else { product.quantity = product.quantity || 1; this._data.cart.push(product); }
    //     this.save(); this._updateUI(); this._showToast(product.name + ' added to cart');
    //   },
    //   removeFromCart: function(id, variant, size) {
    //     this._data.cart = this._data.cart.filter(function(i){ return !(i.id === id && i.variant === variant && i.size === size); });
    //     this.save(); this._updateUI();
    //   },
    //   updateCartQty: function(id, variant, size, qty) {
    //     var item = this._data.cart.find(function(i){ return i.id === id && i.variant === variant && i.size === size; });
    //     if (item) { item.quantity = Math.max(1, qty); this.save(); this._updateUI(); }
    //   },
    //   getCartTotal: function() {
    //     return this._data.cart.reduce(function(sum, i){ return sum + (parseFloat(i.price) || 0) * i.quantity; }, 0);
    //   },
    //   getCartCount: function() {
    //     return this._data.cart.reduce(function(sum, i){ return sum + i.quantity; }, 0);
    //   },
    //   toggleWishlist: function(product) {
    //     var idx = this._data.wishlist.findIndex(function(i){ return i.id === product.id; });
    //     if (idx >= 0) { this._data.wishlist.splice(idx, 1); this._showToast('Removed from wishlist'); }
    //     else { this._data.wishlist.push(product); this._showToast(product.name + ' added to wishlist'); }
    //     this.save(); this._updateUI();
    //   },
    //   isInWishlist: function(id) {
    //     return this._data.wishlist.some(function(i){ return i.id === id; });
    //   },
    //   moveToCart: function(id) {
    //     var item = this._data.wishlist.find(function(i){ return i.id === id; });
    //     if (item) { this.addToCart(item); this._data.wishlist = this._data.wishlist.filter(function(i){ return i.id !== id; }); this.save(); this._updateUI(); }
    //   },
    //   _updateUI: function() {
    //     var count = this.getCartCount();
    //     document.querySelectorAll('.cc').forEach(function(el){ el.textContent = count; el.style.display = count > 0 ? 'flex' : 'none'; });
    //     document.querySelectorAll('.wish-h').forEach(function(el){ el.textContent = Store.getWishlist().length; });
    //   },
    //   _showToast: function(msg) {
    //     var t = document.createElement('div');
    //     t.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#111827;color:#fff;padding:14px 24px;border-radius:12px;font-size:.875rem;font-weight:500;z-index:10000;box-shadow:0 10px 25px rgba(0,0,0,.15);animation:toastIn .3s ease;max-width:320px';
    //     t.textContent = msg;
    //     document.body.appendChild(t);
    //     setTimeout(function(){ t.style.opacity = '0'; t.style.transition = 'opacity .3s'; setTimeout(function(){ t.remove(); }, 300); }, 2500);
    //   }
    // };
    // Store.init();

    // ── Product Data ──
    var Products = {
      _data: [],
      init: function() {
        var els = document.querySelectorAll('[data-product]');
        var self = this;
        els.forEach(function(el) {
          try { self._data.push(JSON.parse(el.getAttribute('data-product'))); } catch(e) {}
        });
      },
      getAll: function() { return this._data; },
      getById: function(id) { return this._data.find(function(p){ return p.id === id; }); },
      search: function(q) {
        q = q.toLowerCase();
        return this._data.filter(function(p){ return (p.name || '').toLowerCase().indexOf(q) >= 0 || (p.category || '').toLowerCase().indexOf(q) >= 0; });
      },
      filter: function(opts) {
        var results = this._data;
        if (opts.category) results = results.filter(function(p){ return p.category === opts.category; });
        if (opts.minPrice) results = results.filter(function(p){ return parseFloat(p.price) >= opts.minPrice; });
        if (opts.maxPrice) results = results.filter(function(p){ return parseFloat(p.price) <= opts.maxPrice; });
        if (opts.search) results = this.search(opts.search);
        return results;
      },
      sort: function(items, by) {
        var arr = items.slice();
        switch(by) {
          case 'price_asc': arr.sort(function(a,b){ return parseFloat(a.price) - parseFloat(b.price); }); break;
          case 'price_desc': arr.sort(function(a,b){ return parseFloat(b.price) - parseFloat(a.price); }); break;
          case 'name': arr.sort(function(a,b){ return (a.name||'').localeCompare(b.name||''); }); break;
          case 'rating': arr.sort(function(a,b){ return (b.rating||0) - (a.rating||0); }); break;
          default: break;
        }
        return arr;
      }
    };

    // ── Pagination ──
    var Pagination = {
      render: function(container, items, perPage, renderFn) {
        var page = 1;
        var totalPages = Math.ceil(items.length / perPage);
        function show(p) {
          page = p;
          var start = (p - 1) * perPage;
          var pageItems = items.slice(start, start + perPage);
          renderFn(pageItems);
          var html = '';
          if (totalPages > 1) {
            html += '<div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-top:32px">';
            html += '<button class="pg-btn" data-page="' + (p-1) + '"' + (p===1?' disabled':'') + ' style="padding:8px 16px;border:1px solid var(--bdr);border-radius:var(--rmd);background:var(--bgc);cursor:pointer;font-size:.875rem">\u2190 Prev</button>';
            for (var i = 1; i <= totalPages; i++) {
              html += '<button class="pg-btn" data-page="' + i + '" style="width:36px;height:36px;border-radius:var(--rmd);border:1px solid ' + (i===p?'var(--c1)':'var(--bdr)') + ';background:' + (i===p?'var(--c1)':'var(--bgc)') + ';color:' + (i===p?'#fff':'var(--ctx)') + ';cursor:pointer;font-size:.875rem;font-weight:600">' + i + '</button>';
            }
            html += '<button class="pg-btn" data-page="' + (p+1) + '"' + (p===totalPages?' disabled':'') + ' style="padding:8px 16px;border:1px solid var(--bdr);border-radius:var(--rmd);background:var(--bgc);cursor:pointer;font-size:.875rem">Next \u2192</button>';
            html += '</div>';
          }
          container.innerHTML = html;
          container.querySelectorAll('.pg-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
              var pg = parseInt(this.getAttribute('data-page'));
              if (pg >= 1 && pg <= totalPages) show(pg);
            });
          });
        }
        show(1);
      }
    };

    // ── Interactive Components ──
    document.addEventListener('DOMContentLoaded', function() {
      // Nav scroll
      var nav = document.getElementById('main-nav');
      if (nav) {
        window.addEventListener('scroll', function() {
          if (window.scrollY > 10) nav.classList.add('sc');
          else nav.classList.remove('sc');
        });
      }
      // Mobile nav toggle
      var toggle = document.getElementById('mtog');
      var mnav = document.getElementById('mnav');
      if (toggle && mnav) {
        toggle.addEventListener('change', function() {
          if (this.checked) document.body.style.overflow = 'hidden';
          else document.body.style.overflow = '';
        });
        mnav.querySelectorAll('a').forEach(function(link) {
          link.addEventListener('click', function() {
            toggle.checked = false;
            document.body.style.overflow = '';
          });
        });
      }
      // Init products
      Products.init();
      // Store._updateUI(); // TODO: Uncomment when eCommerce is implemented
      // Add to Cart buttons
      // TODO: Uncomment when eCommerce is implemented
      // document.querySelectorAll('[data-add-to-cart]').forEach(function(btn) {
      //   btn.addEventListener('click', function(e) {
      //     e.preventDefault();
      //     var data = this.getAttribute('data-add-to-cart');
      //     try {
      //       var product = JSON.parse(data);
      //       var card = this.closest('.pc, .pcbd, [data-product-card]');
      //       if (card) {
      //         var colorEl = card.querySelector('[data-selected-color]');
      //         var sizeEl = card.querySelector('[data-selected-size]');
      //         var qtyEl = card.querySelector('[data-qty]');
      //         if (colorEl) product.variant = colorEl.getAttribute('data-selected-color');
      //         if (sizeEl) product.size = sizeEl.getAttribute('data-selected-size');
      //         if (qtyEl) product.quantity = parseInt(qtyEl.textContent) || 1;
      //       }
      //       Store.addToCart(product);
      //     } catch(err) { console.error('Add to cart error:', err); }
      //   });
      // });
      // Wishlist buttons
      // TODO: Uncomment when eCommerce is implemented
      // document.querySelectorAll('[data-toggle-wishlist]').forEach(function(btn) {
      //   btn.addEventListener('click', function(e) {
      //     e.preventDefault();
      //     try {
      //       var product = JSON.parse(this.getAttribute('data-toggle-wishlist'));
      //       Store.toggleWishlist(product);
      //       this.classList.toggle('wish-active');
      //     } catch(err) {}
      //   });
      // });
      // Quantity buttons
      // TODO: Uncomment when eCommerce is implemented
      // document.querySelectorAll('[data-qty-plus]').forEach(function(btn) {
      //   btn.addEventListener('click', function() {
      //     var el = this.parentElement.querySelector('[data-qty]');
      //     if (el) el.textContent = Math.max(1, parseInt(el.textContent) + 1);
      //   });
      // });
      // document.querySelectorAll('[data-qty-minus]').forEach(function(btn) {
      //   btn.addEventListener('click', function() {
      //     var el = this.parentElement.querySelector('[data-qty]');
      //     if (el) el.textContent = Math.max(1, parseInt(el.textContent) - 1);
      //   });
      // });
      // TODO: Uncomment color selectors when eCommerce is implemented
      // document.querySelectorAll('[data-color-select]').forEach(function(btn) {
      //   btn.addEventListener('click', function() {
      //     var group = this.closest('[data-color-group]');
      //     if (group) {
      //       group.querySelectorAll('[data-color-select]').forEach(function(b){ b.style.outline = 'none'; b.style.outlineOffset = '0'; });
      //       this.style.outline = '2px solid var(--c1)';
      //       this.style.outlineOffset = '2px';
      //       var card = this.closest('[data-product-card]');
      //       if (card) card.setAttribute('data-selected-color', this.getAttribute('data-color-select'));
      //     }
      //   });
      // });
      // TODO: Uncomment size selectors when eCommerce is implemented
      // document.querySelectorAll('[data-size-select]').forEach(function(btn) {
      //   btn.addEventListener('click', function() {
      //     var group = this.closest('[data-size-group]');
      //     if (group) {
      //       group.querySelectorAll('[data-size-select]').forEach(function(b){ b.style.background = 'var(--bgc)'; b.style.color = 'var(--ctx)'; b.style.borderColor = 'var(--bdr)'; });
      //       this.style.background = 'var(--c1)';
      //       this.style.color = '#fff';
      //       this.style.borderColor = 'var(--c1)';
      //       var card = this.closest('[data-product-card]');
      //       if (card) card.setAttribute('data-selected-size', this.getAttribute('data-size-select'));
      //     }
      //   });
      // });
      // Search
      document.querySelectorAll('[data-search-input]').forEach(function(input) {
        var debounce;
        input.addEventListener('input', function() {
          var self = this;
          clearTimeout(debounce);
          debounce = setTimeout(function() {
            var q = self.value.toLowerCase();
            document.querySelectorAll('[data-searchable]').forEach(function(el) {
              var name = (el.getAttribute('data-search-name') || '').toLowerCase();
              var cat = (el.getAttribute('data-search-category') || '').toLowerCase();
              el.style.display = (!q || name.indexOf(q) >= 0 || cat.indexOf(q) >= 0) ? '' : 'none';
            });
            var counter = document.querySelector('[data-result-count]');
            if (counter) {
              var visible = document.querySelectorAll('[data-searchable]:not([style*="display: none"]):not([style*="display:none"])').length;
              counter.textContent = visible + ' products';
            }
          }, 200);
        });
      });
      // Sort
      document.querySelectorAll('[data-sort-select]').forEach(function(select) {
        select.addEventListener('change', function() {
          var grid = document.querySelector('[data-product-grid]');
          if (!grid) return;
          var items = Array.from(grid.querySelectorAll('[data-searchable]'));
          var by = this.value;
          items.sort(function(a, b) {
            var pa = parseFloat(a.getAttribute('data-price') || '0');
            var pb = parseFloat(b.getAttribute('data-price') || '0');
            var na = a.getAttribute('data-search-name') || '';
            var nb = b.getAttribute('data-search-name') || '';
            var ra = parseFloat(a.getAttribute('data-rating') || '0');
            var rb = parseFloat(b.getAttribute('data-rating') || '0');
            switch(by) {
              case 'price_asc': return pa - pb;
              case 'price_desc': return pb - pa;
              case 'name': return na.localeCompare(nb);
              case 'rating': return rb - ra;
              default: return 0;
            }
          });
          items.forEach(function(item) { grid.appendChild(item); });
        });
      });
      // Category filter
      document.querySelectorAll('[data-category-filter]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var cat = this.getAttribute('data-category-filter');
          document.querySelectorAll('[data-category-filter]').forEach(function(b){ b.style.background = 'var(--bgc)'; b.style.color = 'var(--ctx)'; });
          this.style.background = 'var(--c1)';
          this.style.color = '#fff';
          document.querySelectorAll('[data-searchable]').forEach(function(el) {
            el.style.display = (!cat || cat === 'all' || el.getAttribute('data-search-category') === cat) ? '' : 'none';
          });
        });
      });
      // TODO: Uncomment coupon apply when eCommerce is implemented
      // document.querySelectorAll('[data-coupon-apply]').forEach(function(btn) {
      //   btn.addEventListener('click', function() {
      //     var input = this.previousElementSibling;
      //     if (input && input.value) {
      //       this.textContent = '✓ Applied';
      //       this.style.background = 'var(--ok)';
      //       this.style.color = '#fff';
      //       this.style.borderColor = 'var(--ok)';
      //     }
      //   });
      // });
      // TODO: Uncomment wishlist init when eCommerce is implemented
      // document.querySelectorAll('[data-toggle-wishlist]').forEach(function(btn) {
      //   try {
      //     var product = JSON.parse(btn.getAttribute('data-toggle-wishlist'));
      //     if (Store.isInWishlist(product.id)) btn.classList.add('wish-active');
      //   } catch(e) {}
      // });
    });
  </script>
  <style>
    /* TODO: Uncomment eCommerce CSS when eCommerce is implemented */
    /* @keyframes toastIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    [data-add-to-cart]:active { transform: scale(0.95); }
    .wish-active svg { fill: #ef4444 !important; color: #ef4444 !important; }
    [data-color-select]:hover { transform: scale(1.15); }
    [data-size-select]:hover { border-color: var(--c1) !important; }
    [data-category-filter] { cursor:pointer; transition:all var(--tr); }
    [data-qty-plus],[data-qty-minus] { cursor:pointer; user-select:none; }
    [data-qty-plus]:hover,[data-qty-minus]:hover { background:var(--bga); } */
  </style>
</body>
</html>`;
};

const CLIENT_DIST = path.join(__dirname, "..", "..", "..", "client", "dist");

const findAsset = (dir: string, pattern: RegExp): string | null => {
  try {
    const files = fs.readdirSync(path.join(dir, "assets"));
    const match = files.find((f) => pattern.test(f));
    return match ? `./assets/${match}` : null;
  } catch {
    return null;
  }
};

const copyClientAssets = (buildDir: string): void => {
  const assetsDir = path.join(buildDir, "assets");
  fs.mkdirSync(assetsDir, { recursive: true });
  try {
    const srcAssets = path.join(CLIENT_DIST, "assets");
    const files = fs.readdirSync(srcAssets);
    for (const file of files) {
      fs.copyFileSync(path.join(srcAssets, file), path.join(assetsDir, file));
    }
  } catch (err) {
    console.warn("Could not copy client assets:", err);
  }
  try {
    const favicon = path.join(CLIENT_DIST, "favicon.svg");
    if (fs.existsSync(favicon)) {
      fs.copyFileSync(favicon, path.join(buildDir, "favicon.svg"));
    }
  } catch {}
};

const generateShellHtml = (
  page: { slug: string; title: string },
  siteSpec: SiteSpec,
  projectId: string
): string => {
  const siteName = siteSpec.name || "My Store";
  const fontName = siteSpec.theme?.fontFamily || "Inter";
  const metaTitle = siteSpec.seo?.metaTitle
    ? `${siteSpec.seo.metaTitle} | ${siteName}`
    : `${page.title} | ${siteName}`;
  const metaDescription = siteSpec.seo?.metaDescription || page.title;

  const cssPath = findAsset(CLIENT_DIST, /\.css$/);
  const jsPath = findAsset(CLIENT_DIST, /generated-site.*\.js$/)
    || findAsset(CLIENT_DIST, /index-.*\.js$/);

  const siteDataForClient: Record<string, any> = {
    name: siteName,
    logo: siteSpec.logo || null,
    pages: siteSpec.pages || [],
    theme: siteSpec.theme,
    navigation: siteSpec.navigation,
    footer: siteSpec.footer,
    seo: siteSpec.seo,
    __basePath: `/generated-sites/${projectId}`,
  };

  const isHome = page.slug === "home" || page.slug === "index";
  const baseHref = isHome ? "./" : "../";

  const siteDataJson = JSON.stringify(siteDataForClient, null, 0);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <base href="${baseHref}">
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${esc(metaDescription)}">
  <meta property="og:title" content="${esc(metaTitle)}">
  <meta property="og:description" content="${esc(metaDescription)}">
  <meta property="og:type" content="website">
  <title>${esc(metaTitle)}</title>
  <link rel="icon" type="image/svg+xml" href="./favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, "+")}:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  ${cssPath ? `<link rel="stylesheet" href="${cssPath}">` : ""}
</head>
<body>
  <div id="app"></div>
  <script type="application/json" id="site-data">${siteDataJson}</script>
  <script>window.__INITIAL_PAGE__ = ${JSON.stringify(page.slug || "home")};</script>
  ${jsPath ? `<script type="module" src="${jsPath}"></script>` : ""}
</body>
</html>`;
};

export const publish = async (projectId: string): Promise<IPublishedSite> => {
  const project = await Project.findOne({ projectId });
  if (!project) throw new ApiError(404, "Project not found");

  const spec = await WebsiteSpecification.findOne({ project: project._id }).sort({ version: -1 });
  if (!spec) throw new ApiError(400, "No website spec found");

  const siteSpec = (spec as unknown as SiteSpec);
  const siteName = siteSpec.name || project.name || "My Store";

  const buildDir = path.join(GENERATED_DIR, projectId);
  fs.mkdirSync(buildDir, { recursive: true });

  copyClientAssets(buildDir);

  const pages = siteSpec.pages || [];

  for (const page of pages) {
    const slug = page.slug || "index";
    const dir = slug === "home" || slug === "index"
      ? buildDir
      : path.join(buildDir, slug);
    fs.mkdirSync(dir, { recursive: true });

    const html = generateShellHtml(page, siteSpec, projectId);
    fs.writeFileSync(path.join(dir, "index.html"), html, "utf-8");
  }

  if (pages.length === 0) {
    const html = generateShellHtml(
      { slug: "home", title: siteName },
      siteSpec,
      projectId
    );
    fs.writeFileSync(path.join(buildDir, "index.html"), html, "utf-8");
  }

  const siteData = {
    projectId,
    version: spec.version,
    pages: spec.pages,
    publishedAt: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(buildDir, "site.json"), JSON.stringify(siteData, null, 2), "utf-8");

  const existing = await PublishedSite.findOne({ project: project._id });
  const url = `/generated-sites/${projectId}`;

  if (existing) {
    existing.version = spec.version;
    existing.buildPath = buildDir;
    existing.url = url;
    existing.publishedAt = new Date();
    await existing.save();
    project.publishedSite = existing._id;
    project.status = "published";
    await project.save();
    return existing;
  }

  const published = await PublishedSite.create({
    project: project._id,
    version: spec.version,
    buildPath: buildDir,
    url,
    publishedAt: new Date(),
  });

  project.publishedSite = published._id;
  project.status = "published";
  await project.save();

  return published;
};

export const get = async (projectId: string): Promise<IPublishedSite | null> => {
  const project = await Project.findOne({ projectId });
  if (!project) throw new ApiError(404, "Project not found");
  return PublishedSite.findOne({ project: project._id });
};
