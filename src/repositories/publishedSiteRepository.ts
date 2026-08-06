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
  fontFamily?: string;
  borderRadius?: string;
  buttonStyle?: string;
  animations?: boolean;
}

interface SiteSpec {
  name?: string;
  description?: string;
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
  };
}

const e = (str: unknown): string =>
  String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const placeholder = (text: string, w = 400, h = 400): string =>
  `https://placehold.co/${w}x${h}?text=${encodeURIComponent(text)}`;

const stars = (rating: number): string => {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  let html = "";
  for (let i = 0; i < 5; i++) {
    if (i < full) html += "&#9733;";
    else if (i === full && half) html += "&#9733;";
    else html += "&#9734;";
  }
  return `<span class="text-yellow-400 text-lg">${html}</span>`;
};

const borderRadius = (val?: string): string => {
  switch (val) {
    case "none": return "rounded-none";
    case "small": return "rounded";
    case "large": return "rounded-2xl";
    default: return "rounded-lg";
  }
};

const btnStyle = (val?: string): string => {
  switch (val) {
    case "pill": return "rounded-full";
    case "square": return "rounded-none";
    default: return "rounded-lg";
  }
};

const renderComponent = (component: string, props: Record<string, any>, theme?: ThemeData): string => {
  const p = props || {};
  const br = borderRadius(theme?.borderRadius);
  const btn = btnStyle(theme?.buttonStyle);

  switch (component) {

    // ─── HOMEPAGE SECTIONS ────────────────────────────────

    case "HeroEcommerce":
      return `<section class="relative w-full min-h-[500px] flex items-center justify-center text-center text-white" style="background:${p.backgroundImage ? `url('${e(p.backgroundImage)}') center/cover` : p.backgroundColor || `linear-gradient(135deg, ${theme?.primaryColor || "#1e3a5f"}, ${theme?.secondaryColor || "#2563eb"})`}">
        <div class="absolute inset-0 bg-black/40"></div>
        <div class="relative z-10 max-w-3xl mx-auto px-6 py-24">
          <h1 class="text-4xl md:text-6xl font-bold mb-6">${e(p.headline)}</h1>
          <p class="text-lg md:text-xl mb-8 opacity-90">${e(p.subheadline)}</p>
          ${p.ctaText ? `<a href="${e(p.ctaLink || "#")}" class="inline-block bg-white text-gray-900 font-semibold px-8 py-3 ${btn} hover:bg-gray-100 transition">${e(p.ctaText)}</a>` : ""}
        </div>
      </section>`;

    case "FeaturedCategories":
      return `<section class="py-16 px-6 max-w-7xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-10">${e(p.title || "Shop by Category")}</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          ${(p.categories || []).map((c: any) => `
            <a href="${e(c.href || "#")}" class="group block ${br} overflow-hidden shadow-sm hover:shadow-lg transition">
              <img src="${e(c.image || placeholder(c.name || "Category", 400, 300))}" alt="${e(c.name)}" class="w-full h-48 object-cover group-hover:scale-105 transition duration-300" />
              <div class="p-4 text-center font-semibold">${e(c.name)}</div>
            </a>`).join("")}
        </div>
      </section>`;

    case "BestSellers":
      return `<section class="py-16 px-6 max-w-7xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-10">${e(p.title || "Best Sellers")}</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          ${(p.products || []).map((pr: any) => `
            <div class="group ${br} border border-gray-200 overflow-hidden hover:shadow-lg transition">
              <img src="${e(pr.image || placeholder(pr.name || "Product"))}" alt="${e(pr.name)}" class="w-full h-56 object-cover group-hover:scale-105 transition duration-300" />
              <div class="p-4">
                <h3 class="font-semibold text-sm mb-1 truncate">${e(pr.name)}</h3>
                ${pr.rating ? `<div class="mb-1">${stars(pr.rating)}</div>` : ""}
                <div class="flex items-center gap-2">
                  <span class="font-bold" style="color:${theme?.primaryColor || "#111827"}">$${e(pr.price || "0")}</span>
                  ${pr.originalPrice ? `<span class="text-gray-400 line-through text-sm">$${e(pr.originalPrice)}</span>` : ""}
                </div>
                <button class="mt-3 w-full bg-gray-900 text-white text-sm py-2 ${btn} hover:bg-gray-700 transition">Add to Cart</button>
              </div>
            </div>`).join("")}
        </div>
      </section>`;

    case "NewArrivals":
      return `<section class="py-16 px-6 max-w-7xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-10">${e(p.title || "New Arrivals")}</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          ${(p.products || []).map((pr: any) => `
            <div class="group ${br} border border-gray-200 overflow-hidden hover:shadow-lg transition">
              <img src="${e(pr.image || placeholder(pr.name || "Product"))}" alt="${e(pr.name)}" class="w-full h-56 object-cover group-hover:scale-105 transition duration-300" />
              <div class="p-4">
                <h3 class="font-semibold text-sm mb-1 truncate">${e(pr.name)}</h3>
                ${pr.rating ? `<div class="mb-1">${stars(pr.rating)}</div>` : ""}
                <div class="flex items-center gap-2">
                  <span class="font-bold" style="color:${theme?.primaryColor || "#111827"}">$${e(pr.price || "0")}</span>
                  ${pr.originalPrice ? `<span class="text-gray-400 line-through text-sm">$${e(pr.originalPrice)}</span>` : ""}
                </div>
                <button class="mt-3 w-full bg-gray-900 text-white text-sm py-2 ${btn} hover:bg-gray-700 transition">Add to Cart</button>
              </div>
            </div>`).join("")}
        </div>
      </section>`;

    case "FlashSale":
      return `<section class="py-16 px-6 bg-red-50">
        <div class="max-w-7xl mx-auto">
          <div class="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
            <h2 class="text-3xl font-bold">${e(p.title || "Flash Sale")}</h2>
            <div class="flex gap-2 text-center">
              <div class="bg-gray-900 text-white w-16 h-16 flex items-center justify-center rounded-lg"><div><div class="text-xl font-bold" id="fs-hours">${e(p.countdown?.hours || "00")}</div><div class="text-xs uppercase">Hours</div></div></div>
              <div class="bg-gray-900 text-white w-16 h-16 flex items-center justify-center rounded-lg"><div><div class="text-xl font-bold" id="fs-mins">${e(p.countdown?.minutes || "00")}</div><div class="text-xs uppercase">Mins</div></div></div>
              <div class="bg-gray-900 text-white w-16 h-16 flex items-center justify-center rounded-lg"><div><div class="text-xl font-bold" id="fs-secs">${e(p.countdown?.seconds || "00")}</div><div class="text-xs uppercase">Secs</div></div></div>
            </div>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            ${(p.products || []).map((pr: any) => `
              <div class="group ${br} border border-gray-200 overflow-hidden bg-white hover:shadow-lg transition">
                <div class="relative">
                  <img src="${e(pr.image || placeholder(pr.name || "Sale"))}" alt="${e(pr.name)}" class="w-full h-56 object-cover group-hover:scale-105 transition duration-300" />
                  ${pr.discount ? `<span class="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 ${btn}">-${e(pr.discount)}%</span>` : ""}
                </div>
                <div class="p-4">
                  <h3 class="font-semibold text-sm mb-1 truncate">${e(pr.name)}</h3>
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-red-600">$${e(pr.price || "0")}</span>
                    ${pr.originalPrice ? `<span class="text-gray-400 line-through text-sm">$${e(pr.originalPrice)}</span>` : ""}
                  </div>
                  <button class="mt-3 w-full bg-red-600 text-white text-sm py-2 ${btn} hover:bg-red-700 transition">Add to Cart</button>
                </div>
              </div>`).join("")}
          </div>
        </div>
      </section>`;

    case "FeaturedProducts":
      return `<section class="py-16 px-6 max-w-7xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-10">${e(p.title || "Featured Products")}</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          ${(p.products || []).map((pr: any) => `
            <div class="group ${br} border border-gray-200 overflow-hidden hover:shadow-lg transition">
              <img src="${e(pr.image || placeholder(pr.name || "Product"))}" alt="${e(pr.name)}" class="w-full h-56 object-cover group-hover:scale-105 transition duration-300" />
              <div class="p-4">
                <h3 class="font-semibold text-sm mb-1 truncate">${e(pr.name)}</h3>
                ${pr.rating ? `<div class="mb-1">${stars(pr.rating)}</div>` : ""}
                <span class="font-bold" style="color:${theme?.primaryColor || "#111827"}">$${e(pr.price || "0")}</span>
                <button class="mt-3 w-full bg-gray-900 text-white text-sm py-2 ${btn} hover:bg-gray-700 transition">Add to Cart</button>
              </div>
            </div>`).join("")}
        </div>
      </section>`;

    case "WhyChooseUs":
      return `<section class="py-16 px-6 bg-gray-50">
        <div class="max-w-7xl mx-auto">
          <h2 class="text-3xl font-bold text-center mb-10">${e(p.title || "Why Choose Us")}</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
            ${(p.features || []).map((f: any) => `
              <div class="text-center">
                <div class="w-16 h-16 mx-auto mb-4 flex items-center justify-center ${br} text-2xl" style="background:${theme?.primaryColor || "#2563eb"}20;color:${theme?.primaryColor || "#2563eb"}">
                  ${e(f.icon || "★")}
                </div>
                <h3 class="font-semibold mb-2">${e(f.title)}</h3>
                <p class="text-gray-500 text-sm">${e(f.description)}</p>
              </div>`).join("")}
          </div>
        </div>
      </section>`;

    case "Testimonials":
      return `<section class="py-16 px-6">
        <div class="max-w-7xl mx-auto">
          <h2 class="text-3xl font-bold text-center mb-10">${e(p.title || "What Our Customers Say")}</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            ${(p.testimonials || []).map((t: any) => `
              <div class="${br} border border-gray-200 p-6 text-center">
                <img src="${e(t.avatar || placeholder(t.name || "User", 80, 80))}" alt="${e(t.name)}" class="w-16 h-16 rounded-full mx-auto mb-4 object-cover" />
                <p class="text-gray-600 italic mb-4">"${e(t.quote || t.content)}"</p>
                ${t.rating ? `<div class="mb-3">${stars(t.rating)}</div>` : ""}
                <div class="font-semibold">${e(t.name)}</div>
                ${t.title ? `<div class="text-gray-400 text-sm">${e(t.title)}</div>` : ""}
              </div>`).join("")}
          </div>
        </div>
      </section>`;

    case "BrandShowcase":
      return `<section class="py-16 px-6 bg-gray-50">
        <div class="max-w-7xl mx-auto text-center">
          <h2 class="text-3xl font-bold mb-10">${e(p.title || "Our Brands")}</h2>
          <div class="flex flex-wrap justify-center items-center gap-12">
            ${(p.brands || []).map((b: any) => `
              <div class="opacity-60 hover:opacity-100 transition">
                ${b.logo ? `<img src="${e(b.logo)}" alt="${e(b.name)}" class="h-12" />` : `<div class="text-xl font-bold text-gray-400">${e(b.name)}</div>`}
              </div>`).join("")}
          </div>
        </div>
      </section>`;

    case "NewsletterSignup":
      return `<section class="py-16 px-6" style="background:${theme?.primaryColor || "#1e3a5f"}">
        <div class="max-w-2xl mx-auto text-center text-white">
          <h2 class="text-3xl font-bold mb-4">${e(p.title || "Subscribe to Our Newsletter")}</h2>
          <p class="mb-8 opacity-90">${e(p.subtitle || "Get the latest updates on new products and upcoming sales")}</p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <input type="email" placeholder="${e(p.placeholder || "Enter your email")}" class="px-5 py-3 rounded-lg text-gray-900 w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-white/50" />
            <button class="bg-white font-semibold px-8 py-3 ${btn} hover:bg-gray-100 transition" style="color:${theme?.primaryColor || "#1e3a5f"}">${e(p.buttonText || "Subscribe")}</button>
          </div>
        </div>
      </section>`;

    case "InstagramFeed":
      return `<section class="py-16 px-6">
        <div class="max-w-7xl mx-auto text-center">
          <h2 class="text-3xl font-bold mb-4">${e(p.title || "Follow Us on Instagram")}</h2>
          ${p.handle ? `<p class="text-gray-500 mb-10">@${e(p.handle)}</p>` : ""}
          <div class="grid grid-cols-2 md:grid-cols-6 gap-3">
            ${(p.images || []).map((img: string) => `
              <img src="${e(img || placeholder("Instagram", 300, 300))}" alt="Instagram post" class="w-full h-48 object-cover ${br} hover:opacity-80 transition cursor-pointer" />`).join("")}
          </div>
        </div>
      </section>`;

    case "FAQPreview":
      return `<section class="py-16 px-6 max-w-3xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-10">${e(p.title || "Frequently Asked Questions")}</h2>
        <div class="space-y-4">
          ${(p.faqs || []).map((f: any, i: number) => `
            <details class="${br} border border-gray-200 ${i === 0 ? "open" : ""}">
              <summary class="px-6 py-4 font-semibold cursor-pointer hover:bg-gray-50 transition list-none flex items-center justify-between">
                <span>${e(f.question)}</span>
                <span class="text-gray-400 text-xl">+</span>
              </summary>
              <div class="px-6 pb-4 text-gray-600 leading-relaxed">${e(f.answer)}</div>
            </details>`).join("")}
        </div>
      </section>`;

    case "ContactPreview":
      return `<section class="py-16 px-6 bg-gray-50">
        <div class="max-w-3xl mx-auto">
          <h2 class="text-3xl font-bold text-center mb-10">${e(p.title || "Contact Us")}</h2>
          <form class="space-y-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input type="text" placeholder="Your Name" class="w-full px-4 py-3 border border-gray-300 ${br} focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="email" placeholder="Your Email" class="w-full px-4 py-3 border border-gray-300 ${br} focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <input type="text" placeholder="Subject" class="w-full px-4 py-3 border border-gray-300 ${br} focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <textarea placeholder="Your Message" rows="5" class="w-full px-4 py-3 border border-gray-300 ${br} focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            <button type="submit" class="bg-gray-900 text-white font-semibold px-8 py-3 ${btn} hover:bg-gray-700 transition">${e(p.submitText || "Send Message")}</button>
          </form>
        </div>
      </section>`;

    case "StoreLocator":
      return `<section class="py-16 px-6">
        <div class="max-w-7xl mx-auto">
          <h2 class="text-3xl font-bold text-center mb-10">${e(p.title || "Visit Our Store")}</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div class="space-y-4">
              ${p.address ? `<div class="flex items-start gap-3"><span class="text-2xl">📍</span><span class="text-gray-600">${e(p.address)}</span></div>` : ""}
              ${p.phone ? `<div class="flex items-start gap-3"><span class="text-2xl">📞</span><span class="text-gray-600">${e(p.phone)}</span></div>` : ""}
              ${p.email ? `<div class="flex items-start gap-3"><span class="text-2xl">✉️</span><span class="text-gray-600">${e(p.email)}</span></div>` : ""}
              ${p.hours ? `<div class="flex items-start gap-3"><span class="text-2xl">🕐</span><span class="text-gray-600">${e(p.hours)}</span></div>` : ""}
            </div>
            <div class="bg-gray-200 ${br} h-64 flex items-center justify-center text-gray-400">
              <div class="text-center"><div class="text-4xl mb-2">🗺️</div><div>Map</div></div>
            </div>
          </div>
        </div>
      </section>`;

    case "PageHero":
      return `<section class="bg-gray-900 text-white py-20 px-6">
        <div class="max-w-7xl mx-auto">
          ${p.subtitle ? `<p class="text-sm font-semibold mb-3" style="color:${theme?.primaryColor || "#2563eb"}">${e(p.subtitle)}</p>` : ""}
          <h1 class="text-4xl md:text-5xl font-bold">${e(p.title || "Page")}</h1>
          ${p.backgroundImage ? `<div class="mt-6 ${br} overflow-hidden max-w-2xl"><img src="${e(p.backgroundImage)}" alt="" class="w-full h-48 object-cover" /></div>` : ""}
        </div>
      </section>`;

    case "BlogPreview":
      return `<section class="py-16 px-6 max-w-7xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-10">${e(p.title || "Latest Articles")}</h2>
        ${p.subtitle ? `<p class="text-gray-500 text-center mb-10 max-w-2xl mx-auto">${e(p.subtitle)}</p>` : ""}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          ${(p.posts || []).map((post: any) => `
            <article class="${br} border border-gray-200 overflow-hidden hover:shadow-lg transition">
              <img src="${e(post.image || placeholder(post.title || "Blog", 600, 300))}" alt="${e(post.title)}" class="w-full h-48 object-cover" />
              <div class="p-6">
                ${post.category ? `<div class="text-xs font-semibold mb-2" style="color:${theme?.primaryColor || "#2563eb"}">${e(post.category)}</div>` : ""}
                <h3 class="font-semibold text-lg mb-2">${e(post.title)}</h3>
                ${post.excerpt ? `<p class="text-gray-500 text-sm mb-4 leading-relaxed">${e(post.excerpt)}</p>` : ""}
                <a href="${e(post.href || "#" + (post.slug || ""))}" class="text-sm font-semibold hover:underline" style="color:${theme?.primaryColor || "#2563eb"}">Read More →</a>
              </div>
            </article>`).join("")}
        </div>
      </section>`;

    // ─── SHOP PAGE SECTIONS ──────────────────────────────

    case "ShopHero":
      return `<section class="bg-gray-900 text-white py-16 px-6">
        <div class="max-w-7xl mx-auto">
          <nav class="text-sm text-gray-400 mb-4"><a href="/" class="hover:text-white">Home</a> <span class="mx-2">/</span> <span class="text-white">${e(p.title || "Shop")}</span></nav>
          <h1 class="text-4xl font-bold">${e(p.title || "Shop")}</h1>
          ${p.description ? `<p class="text-gray-300 mt-3">${e(p.description)}</p>` : ""}
        </div>
      </section>`;

    case "ProductFilters":
      return `<aside class="bg-white border border-gray-200 ${br} p-6 space-y-6">
        <h3 class="font-bold text-lg mb-4">Filters</h3>
        ${(p.categories || []).length > 0 ? `
          <div>
            <h4 class="font-semibold text-sm mb-3">Category</h4>
            <div class="space-y-2">
              ${p.categories.map((c: any) => `
                <label class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" class="rounded" /> ${e(c.name || c)}
                </label>`).join("")}
            </div>
          </div>` : ""}
        ${(p.priceRange || p.priceRanges) ? `
          <div>
            <h4 class="font-semibold text-sm mb-3">Price</h4>
            <div class="space-y-2">
              ${(p.priceRange || p.priceRanges || []).map((r: any) => `
                <label class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" class="rounded" /> ${e(typeof r === "string" ? r : r.label || `${r.min} - ${r.max}`)}
                </label>`).join("")}
            </div>
          </div>` : ""}
        ${(p.sortOptions || []).length > 0 ? `
          <div>
            <h4 class="font-semibold text-sm mb-3">Sort By</h4>
            <select class="w-full border border-gray-300 ${br} px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              ${p.sortOptions.map((o: any) => `<option value="${e(o.value || o)}">${e(o.label || o)}</option>`).join("")}
            </select>
          </div>` : ""}
      </aside>`;

    case "ProductGrid":
      return `<section class="py-16 px-6 max-w-7xl mx-auto">
        <div class="flex flex-col md:flex-row gap-8">
          <div class="md:w-1/4">${renderComponent("ProductFilters", p.filters || {}, theme)}</div>
          <div class="md:w-3/4">
            <div class="flex items-center justify-between mb-6">
              <span class="text-gray-500 text-sm">${e(p.totalProducts || (p.products || []).length)} products</span>
            </div>
            <div class="grid grid-cols-2 lg:grid-cols-3 gap-6">
              ${(p.products || []).map((pr: any) => `
                <div class="group ${br} border border-gray-200 overflow-hidden hover:shadow-lg transition">
                  <img src="${e(pr.image || placeholder(pr.name || "Product"))}" alt="${e(pr.name)}" class="w-full h-56 object-cover group-hover:scale-105 transition duration-300" />
                  <div class="p-4">
                    ${pr.category ? `<div class="text-xs text-gray-400 mb-1">${e(pr.category)}</div>` : ""}
                    <h3 class="font-semibold text-sm mb-1 truncate">${e(pr.name)}</h3>
                    ${pr.rating ? `<div class="mb-1">${stars(pr.rating)}</div>` : ""}
                    <div class="flex items-center gap-2">
                      <span class="font-bold" style="color:${theme?.primaryColor || "#111827"}">$${e(pr.price || "0")}</span>
                      ${pr.originalPrice ? `<span class="text-gray-400 line-through text-sm">$${e(pr.originalPrice)}</span>` : ""}
                    </div>
                    <button class="mt-3 w-full bg-gray-900 text-white text-sm py-2 ${btn} hover:bg-gray-700 transition">Add to Cart</button>
                  </div>
                </div>`).join("")}
            </div>
            ${p.totalPages && p.totalPages > 1 ? `
              <div class="flex justify-center gap-2 mt-10">
                <button class="px-4 py-2 border border-gray-300 ${btn} hover:bg-gray-50 transition text-sm">Previous</button>
                ${Array.from({ length: Math.min(p.totalPages || 1, 5) }, (_, i) => `
                  <button class="w-10 h-10 flex items-center justify-center ${br} text-sm ${i === 0 ? "bg-gray-900 text-white" : "border border-gray-300 hover:bg-gray-50"} transition">${i + 1}</button>`).join("")}
                <button class="px-4 py-2 border border-gray-300 ${btn} hover:bg-gray-50 transition text-sm">Next</button>
              </div>` : ""}
          </div>
        </div>
      </section>`;

    // ─── PRODUCT DETAILS SECTIONS ─────────────────────────

    case "Breadcrumbs":
      return `<nav class="py-4 px-6 max-w-7xl mx-auto text-sm text-gray-500">
        ${(p.items || []).map((item: any, i: number, arr: any[]) => `
          ${i > 0 ? '<span class="mx-2">/</span>' : ""}
          ${i < arr.length - 1 ? `<a href="${e(item.href || "#")}" class="hover:text-gray-900 transition">${e(item.label)}</a>` : `<span class="text-gray-900">${e(item.label)}</span>`}
        `).join("")}
      </nav>`;

    case "ProductDetails":
      return `<section class="py-16 px-6 max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <img src="${e(p.image || placeholder(p.name || "Product", 600, 600))}" alt="${e(p.name)}" class="w-full ${br} object-cover" />
            ${p.gallery && p.gallery.length > 0 ? `
              <div class="flex gap-3 mt-4">
                <img src="${e(p.image || placeholder("Product"))}" alt="" class="w-20 h-20 object-cover ${br} border-2 border-gray-900 cursor-pointer" />
                ${p.gallery.map((img: string) => `<img src="${e(img)}" alt="" class="w-20 h-20 object-cover ${br} border border-gray-200 cursor-pointer hover:border-gray-900 transition" />`).join("")}
              </div>` : ""}
          </div>
          <div>
            ${p.brand ? `<div class="text-sm text-gray-500 mb-2">${e(p.brand)}</div>` : ""}
            <h1 class="text-3xl font-bold mb-4">${e(p.name)}</h1>
            ${p.rating ? `<div class="flex items-center gap-2 mb-4">${stars(p.rating)} <span class="text-gray-500 text-sm">(${e(p.reviewCount || 0)} reviews)</span></div>` : ""}
            <div class="flex items-center gap-3 mb-6">
              <span class="text-3xl font-bold" style="color:${theme?.primaryColor || "#111827"}">$${e(p.price || "0")}</span>
              ${p.originalPrice ? `<span class="text-gray-400 line-through text-xl">$${e(p.originalPrice)}</span>` : ""}
              ${p.discount ? `<span class="bg-red-100 text-red-600 text-sm font-semibold px-3 py-1 ${btn}">-${e(p.discount)}% OFF</span>` : ""}
            </div>
            ${p.shortDescription ? `<p class="text-gray-600 mb-6 leading-relaxed">${e(p.shortDescription)}</p>` : ""}
            ${p.variants && p.variants.length > 0 ? `
              <div class="mb-6">
                <div class="font-semibold text-sm mb-3">${e(p.variantLabel || "Options")}</div>
                <div class="flex flex-wrap gap-2">
                  ${p.variants.map((v: any) => `
                    <button class="px-4 py-2 border border-gray-300 ${br} text-sm hover:border-gray-900 transition">${e(v.name || v)}</button>`).join("")}
                </div>
              </div>` : ""}
            ${p.sizes && p.sizes.length > 0 ? `
              <div class="mb-6">
                <div class="font-semibold text-sm mb-3">Size</div>
                <div class="flex flex-wrap gap-2">
                  ${p.sizes.map((s: any) => `
                    <button class="w-12 h-12 flex items-center justify-center border border-gray-300 ${br} text-sm hover:border-gray-900 transition">${e(s.name || s)}</button>`).join("")}
                </div>
              </div>` : ""}
            ${p.colors && p.colors.length > 0 ? `
              <div class="mb-6">
                <div class="font-semibold text-sm mb-3">Color</div>
                <div class="flex flex-wrap gap-3">
                  ${p.colors.map((c: any) => `
                    <div class="w-8 h-8 ${br} border-2 border-gray-200 cursor-pointer hover:border-gray-900 transition" style="background:${e(c.hex || c.color || c)}" title="${e(c.name || c)}"></div>`).join("")}
                </div>
              </div>` : ""}
            <div class="flex items-center gap-4 mb-6">
              <div class="flex items-center border border-gray-300 ${br}">
                <button class="px-4 py-2 text-lg hover:bg-gray-50 transition">-</button>
                <span class="px-4 py-2 font-semibold">1</span>
                <button class="px-4 py-2 text-lg hover:bg-gray-50 transition">+</button>
              </div>
              <button class="flex-1 bg-gray-900 text-white font-semibold py-3 ${btn} hover:bg-gray-700 transition">Add to Cart</button>
            </div>
            ${p.description ? `<div class="border-t border-gray-200 pt-6 mt-6"><h3 class="font-semibold mb-3">Description</h3><div class="text-gray-600 leading-relaxed text-sm">${e(p.description)}</div></div>` : ""}
          </div>
        </div>
      </section>`;

    case "ProductReviews":
      return `<section class="py-16 px-6 max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-8">Customer Reviews</h2>
        <div class="space-y-6">
          ${(p.reviews || []).map((r: any) => `
            <div class="border border-gray-200 ${br} p-6">
              <div class="flex items-center gap-4 mb-3">
                <img src="${e(r.avatar || placeholder(r.author || "User", 48, 48))}" alt="" class="w-12 h-12 rounded-full object-cover" />
                <div>
                  <div class="font-semibold">${e(r.author || r.name)}</div>
                  ${r.date ? `<div class="text-gray-400 text-xs">${e(r.date)}</div>` : ""}
                </div>
                <div class="ml-auto">${stars(r.rating)}</div>
              </div>
              ${r.title ? `<div class="font-semibold mb-1">${e(r.title)}</div>` : ""}
              <p class="text-gray-600 text-sm leading-relaxed">${e(r.content || r.comment)}</p>
            </div>`).join("")}
        </div>
      </section>`;

    case "RelatedProducts":
      return `<section class="py-16 px-6 max-w-7xl mx-auto">
        <h2 class="text-2xl font-bold mb-8">${e(p.title || "Related Products")}</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          ${(p.products || []).map((pr: any) => `
            <div class="group ${br} border border-gray-200 overflow-hidden hover:shadow-lg transition">
              <img src="${e(pr.image || placeholder(pr.name || "Product"))}" alt="${e(pr.name)}" class="w-full h-56 object-cover group-hover:scale-105 transition duration-300" />
              <div class="p-4">
                <h3 class="font-semibold text-sm mb-1 truncate">${e(pr.name)}</h3>
                ${pr.rating ? `<div class="mb-1">${stars(pr.rating)}</div>` : ""}
                <span class="font-bold" style="color:${theme?.primaryColor || "#111827"}">$${e(pr.price || "0")}</span>
              </div>
            </div>`).join("")}
        </div>
      </section>`;

    case "RecentlyViewed":
      return `<section class="py-16 px-6 max-w-7xl mx-auto">
        <h2 class="text-2xl font-bold mb-8">${e(p.title || "Recently Viewed")}</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          ${(p.products || []).map((pr: any) => `
            <div class="group ${br} border border-gray-200 overflow-hidden hover:shadow-lg transition">
              <img src="${e(pr.image || placeholder(pr.name || "Product"))}" alt="${e(pr.name)}" class="w-full h-56 object-cover group-hover:scale-105 transition duration-300" />
              <div class="p-4">
                <h3 class="font-semibold text-sm mb-1 truncate">${e(pr.name)}</h3>
                <span class="font-bold" style="color:${theme?.primaryColor || "#111827"}">$${e(pr.price || "0")}</span>
              </div>
            </div>`).join("")}
        </div>
      </section>`;

    // ─── OTHER PAGE SECTIONS ──────────────────────────────

    case "CategoryGrid":
      return `<section class="py-16 px-6 max-w-7xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-10">${e(p.title || "Browse Categories")}</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          ${(p.categories || []).map((c: any) => `
            <a href="${e(c.href || "#")}" class="group block ${br} overflow-hidden shadow-sm hover:shadow-lg transition">
              <img src="${e(c.image || placeholder(c.name || "Category", 400, 300))}" alt="${e(c.name)}" class="w-full h-48 object-cover group-hover:scale-105 transition duration-300" />
              <div class="p-4 text-center">
                <div class="font-semibold">${e(c.name)}</div>
                ${c.count ? `<div class="text-gray-400 text-sm mt-1">${e(c.count)} items</div>` : ""}
              </div>
            </a>`).join("")}
        </div>
      </section>`;

    case "AboutStory":
      return `<section class="py-16 px-6 max-w-6xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            ${p.subtitle ? `<div class="text-sm font-semibold mb-3" style="color:${theme?.primaryColor || "#2563eb"}">${e(p.subtitle)}</div>` : ""}
            <h2 class="text-3xl font-bold mb-6">${e(p.title || "Our Story")}</h2>
            <p class="text-gray-600 leading-relaxed mb-4">${e(p.paragraph1 || p.description || "")}</p>
            ${p.paragraph2 ? `<p class="text-gray-600 leading-relaxed">${e(p.paragraph2)}</p>` : ""}
          </div>
          <div>
            <img src="${e(p.image || placeholder("Our Story", 600, 400))}" alt="Our Story" class="w-full ${br} object-cover shadow-lg" />
          </div>
        </div>
      </section>`;

    case "AboutValues":
      return `<section class="py-16 px-6 bg-gray-50">
        <div class="max-w-7xl mx-auto">
          <h2 class="text-3xl font-bold text-center mb-10">${e(p.title || "Our Values")}</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            ${(p.values || []).map((v: any) => `
              <div class="bg-white ${br} p-8 text-center shadow-sm">
                <div class="text-3xl mb-4">${e(v.icon || "💎")}</div>
                <h3 class="font-semibold text-lg mb-3">${e(v.title)}</h3>
                <p class="text-gray-500 text-sm leading-relaxed">${e(v.description)}</p>
              </div>`).join("")}
          </div>
        </div>
      </section>`;

    case "TeamSection":
      return `<section class="py-16 px-6 max-w-7xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-10">${e(p.title || "Meet Our Team")}</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          ${(p.members || []).map((m: any) => `
            <div class="text-center">
              <img src="${e(m.avatar || placeholder(m.name || "Team", 300, 300))}" alt="${e(m.name)}" class="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
              <div class="font-semibold">${e(m.name)}</div>
              ${m.role ? `<div class="text-gray-500 text-sm">${e(m.role)}</div>` : ""}
              ${m.social ? `
                <div class="flex justify-center gap-3 mt-3">
                  ${m.social.linkedin ? `<a href="${e(m.social.linkedin)}" class="text-gray-400 hover:text-gray-900 transition">in</a>` : ""}
                  ${m.social.twitter ? `<a href="${e(m.social.twitter)}" class="text-gray-400 hover:text-gray-900 transition">X</a>` : ""}
                </div>` : ""}
            </div>`).join("")}
        </div>
      </section>`;

    case "ContactInfo":
      return `<section class="py-16 px-6 bg-gray-50">
        <div class="max-w-7xl mx-auto">
          <h2 class="text-3xl font-bold text-center mb-10">${e(p.title || "Get in Touch")}</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            ${p.address ? `<div class="${br} bg-white p-8 shadow-sm"><div class="text-3xl mb-4">📍</div><h3 class="font-semibold mb-2">Address</h3><p class="text-gray-500 text-sm">${e(p.address)}</p></div>` : ""}
            ${p.phone ? `<div class="${br} bg-white p-8 shadow-sm"><div class="text-3xl mb-4">📞</div><h3 class="font-semibold mb-2">Phone</h3><p class="text-gray-500 text-sm">${e(p.phone)}</p></div>` : ""}
            ${p.email ? `<div class="${br} bg-white p-8 shadow-sm"><div class="text-3xl mb-4">✉️</div><h3 class="font-semibold mb-2">Email</h3><p class="text-gray-500 text-sm">${e(p.email)}</p></div>` : ""}
          </div>
        </div>
      </section>`;

    case "ContactForm":
      return `<section class="py-16 px-6">
        <div class="max-w-3xl mx-auto">
          <h2 class="text-3xl font-bold text-center mb-10">${e(p.title || "Send Us a Message")}</h2>
          <form class="space-y-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input type="text" placeholder="Your Name" class="w-full px-4 py-3 border border-gray-300 ${br} focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="email" placeholder="Your Email" class="w-full px-4 py-3 border border-gray-300 ${br} focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <input type="text" placeholder="Subject" class="w-full px-4 py-3 border border-gray-300 ${br} focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <textarea placeholder="Your Message" rows="5" class="w-full px-4 py-3 border border-gray-300 ${br} focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            <button type="submit" class="bg-gray-900 text-white font-semibold px-8 py-3 ${btn} hover:bg-gray-700 transition">${e(p.submitText || "Send Message")}</button>
          </form>
        </div>
      </section>`;

    case "MapEmbed":
      return `<section class="py-16 px-6">
        <div class="max-w-7xl mx-auto">
          <div class="bg-gray-200 ${br} h-96 flex items-center justify-center text-gray-400">
            <div class="text-center">
              <div class="text-5xl mb-3">🗺️</div>
              <div class="font-semibold">Map</div>
              ${p.address ? `<div class="text-sm mt-1">${e(p.address)}</div>` : ""}
            </div>
          </div>
        </div>
      </section>`;

    case "BlogGrid":
      return `<section class="py-16 px-6 max-w-7xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-10">${e(p.title || "Latest Articles")}</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          ${(p.posts || []).map((post: any) => `
            <article class="${br} border border-gray-200 overflow-hidden hover:shadow-lg transition">
              <img src="${e(post.image || placeholder(post.title || "Blog", 600, 300))}" alt="${e(post.title)}" class="w-full h-48 object-cover" />
              <div class="p-6">
                ${post.category ? `<div class="text-xs font-semibold mb-2" style="color:${theme?.primaryColor || "#2563eb"}">${e(post.category)}</div>` : ""}
                <h3 class="font-semibold text-lg mb-2">${e(post.title)}</h3>
                ${post.excerpt ? `<p class="text-gray-500 text-sm mb-4 leading-relaxed">${e(post.excerpt)}</p>` : ""}
                <div class="flex items-center gap-4 text-xs text-gray-400">
                  ${post.author ? `<span>${e(post.author)}</span>` : ""}
                  ${post.date ? `<span>${e(post.date)}</span>` : ""}
                </div>
              </div>
            </article>`).join("")}
        </div>
      </section>`;

    case "FAQAccordion":
      return `<section class="py-16 px-6 max-w-3xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-10">${e(p.title || "Frequently Asked Questions")}</h2>
        <div class="space-y-3">
          ${(p.items || p.faqs || []).map((item: any, i: number) => `
            <details class="${br} border border-gray-200" ${i === 0 ? "open" : ""}>
              <summary class="px-6 py-4 font-semibold cursor-pointer hover:bg-gray-50 transition list-none flex items-center justify-between">
                <span>${e(item.question || item.title)}</span>
                <span class="text-gray-400 text-xl">+</span>
              </summary>
              <div class="px-6 pb-4 text-gray-600 leading-relaxed">${e(item.answer || item.content)}</div>
            </details>`).join("")}
        </div>
      </section>`;

    case "OrderTracking":
      return `<section class="py-16 px-6 max-w-xl mx-auto text-center">
        <h2 class="text-3xl font-bold mb-6">${e(p.title || "Track Your Order")}</h2>
        <p class="text-gray-500 mb-8">${e(p.description || "Enter your order number to track its status")}</p>
        <form class="flex gap-3">
          <input type="text" placeholder="Order number" class="flex-1 px-4 py-3 border border-gray-300 ${br} focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button type="submit" class="bg-gray-900 text-white font-semibold px-6 py-3 ${btn} hover:bg-gray-700 transition">Track</button>
        </form>
      </section>`;

    case "WishlistGrid":
      return `<section class="py-16 px-6 max-w-7xl mx-auto">
        <h2 class="text-2xl font-bold mb-8">${e(p.title || "My Wishlist")}</h2>
        ${(p.items || []).length === 0 ? `
          <div class="text-center py-16 text-gray-400">
            <div class="text-5xl mb-4">♡</div>
            <p>Your wishlist is empty</p>
          </div>` : `
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            ${(p.items || []).map((item: any) => `
              <div class="group ${br} border border-gray-200 overflow-hidden hover:shadow-lg transition">
                <img src="${e(item.image || placeholder(item.name || "Product"))}" alt="${e(item.name)}" class="w-full h-56 object-cover group-hover:scale-105 transition duration-300" />
                <div class="p-4">
                  <h3 class="font-semibold text-sm mb-1 truncate">${e(item.name)}</h3>
                  <span class="font-bold" style="color:${theme?.primaryColor || "#111827"}">$${e(item.price || "0")}</span>
                  <button class="mt-3 w-full bg-gray-900 text-white text-sm py-2 ${btn} hover:bg-gray-700 transition">Add to Cart</button>
                </div>
              </div>`).join("")}
          </div>`}
      </section>`;

    case "CartItems":
      return `<div class="bg-white ${br} border border-gray-200 overflow-hidden">
        <table class="w-full text-left">
          <thead class="bg-gray-50 text-sm text-gray-500">
            <tr>
              <th class="px-6 py-3 font-semibold">Product</th>
              <th class="px-6 py-3 font-semibold hidden md:table-cell">Price</th>
              <th class="px-6 py-3 font-semibold">Quantity</th>
              <th class="px-6 py-3 font-semibold hidden md:table-cell">Total</th>
              <th class="px-6 py-3 font-semibold">Remove</th>
            </tr>
          </thead>
          <tbody>
            ${(p.items || []).map((item: any) => `
              <tr class="border-t border-gray-100">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-4">
                    <img src="${e(item.image || placeholder(item.name || "Product", 80, 80))}" alt="${e(item.name)}" class="w-16 h-16 object-cover ${br}" />
                    <div>
                      <div class="font-semibold text-sm">${e(item.name)}</div>
                      ${item.variant ? `<div class="text-gray-400 text-xs">${e(item.variant)}</div>` : ""}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm hidden md:table-cell">$${e(item.price || "0")}</td>
                <td class="px-6 py-4">
                  <div class="flex items-center border border-gray-300 ${br} w-fit">
                    <button class="px-3 py-1 text-sm hover:bg-gray-50 transition">-</button>
                    <span class="px-3 py-1 text-sm font-semibold">${e(item.quantity || 1)}</span>
                    <button class="px-3 py-1 text-sm hover:bg-gray-50 transition">+</button>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm font-semibold hidden md:table-cell">$${e(item.total || item.price || "0")}</td>
                <td class="px-6 py-4"><button class="text-gray-400 hover:text-red-500 transition text-sm">✕</button></td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>`;

    case "CartSummary":
      return `<div class="${br} border border-gray-200 p-6 bg-gray-50">
        <h3 class="font-bold text-lg mb-6">Order Summary</h3>
        <div class="space-y-3 text-sm">
          <div class="flex justify-between"><span class="text-gray-500">Subtotal</span><span class="font-semibold">$${e(p.subtotal || "0")}</span></div>
          ${p.discount ? `<div class="flex justify-between text-green-600"><span>Discount</span><span>-$${e(p.discount)}</span></div>` : ""}
          <div class="flex justify-between"><span class="text-gray-500">Shipping</span><span class="font-semibold">${p.shipping === 0 || p.shipping === "0" ? "Free" : `$${e(p.shipping || "0")}`}</span></div>
          ${p.tax ? `<div class="flex justify-between"><span class="text-gray-500">Tax</span><span class="font-semibold">$${e(p.tax)}</span></div>` : ""}
          <div class="border-t border-gray-200 pt-3 flex justify-between text-base font-bold">
            <span>Total</span>
            <span style="color:${theme?.primaryColor || "#111827"}">$${e(p.total || "0")}</span>
          </div>
        </div>
        ${p.promoCode !== false ? `
          <div class="flex gap-2 mt-6">
            <input type="text" placeholder="Promo code" class="flex-1 px-4 py-2 border border-gray-300 ${br} text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button class="px-4 py-2 border border-gray-900 ${btn} text-sm hover:bg-gray-900 hover:text-white transition">Apply</button>
          </div>` : ""}
        <button class="w-full mt-6 bg-gray-900 text-white font-semibold py-3 ${btn} hover:bg-gray-700 transition">Proceed to Checkout</button>
        <a href="/" class="block text-center mt-3 text-sm text-gray-500 hover:text-gray-900 transition">← Continue Shopping</a>
      </div>`;

    case "CheckoutForm":
      return `<section class="py-16 px-6 max-w-4xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-10">${e(p.title || "Checkout")}</h2>
        <div class="flex justify-center gap-4 mb-10">
          ${["Information", "Shipping", "Payment"].map((step, i) => `
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold ${i === 0 ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-500"}">${i + 1}</div>
              <span class="text-sm font-semibold ${i === 0 ? "text-gray-900" : "text-gray-400"}">${step}</span>
              ${i < 2 ? '<div class="w-12 h-px bg-gray-300"></div>' : ""}
            </div>`).join("")}
        </div>
        <form class="space-y-5">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input type="text" placeholder="First name" class="w-full px-4 py-3 border border-gray-300 ${br} focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" placeholder="Last name" class="w-full px-4 py-3 border border-gray-300 ${br} focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <input type="email" placeholder="Email" class="w-full px-4 py-3 border border-gray-300 ${br} focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="text" placeholder="Address" class="w-full px-4 py-3 border border-gray-300 ${br} focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <div class="grid grid-cols-2 md:grid-cols-3 gap-5">
            <input type="text" placeholder="City" class="w-full px-4 py-3 border border-gray-300 ${br} focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" placeholder="State" class="w-full px-4 py-3 border border-gray-300 ${br} focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" placeholder="ZIP code" class="w-full px-4 py-3 border border-gray-300 ${br} focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div class="border-t border-gray-200 pt-6 mt-6">
            <div class="font-semibold mb-4">Payment</div>
            <input type="text" placeholder="Card number" class="w-full px-4 py-3 border border-gray-300 ${br} focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <div class="grid grid-cols-2 gap-5 mt-4">
              <input type="text" placeholder="MM / YY" class="w-full px-4 py-3 border border-gray-300 ${br} focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" placeholder="CVC" class="w-full px-4 py-3 border border-gray-300 ${br} focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <button type="submit" class="w-full bg-gray-900 text-white font-semibold py-3 ${btn} hover:bg-gray-700 transition mt-6">${e(p.submitText || "Place Order")}</button>
        </form>
      </section>`;

    case "LegalContent":
      return `<section class="py-16 px-6 max-w-3xl mx-auto">
        <h1 class="text-3xl font-bold mb-8">${e(p.title || "Privacy Policy")}</h1>
        ${p.lastUpdated ? `<p class="text-gray-400 text-sm mb-8">Last updated: ${e(p.lastUpdated)}</p>` : ""}
        <div class="prose prose-gray max-w-none space-y-6">
          ${(p.sections || p.content ? (p.sections || [{ title: "", content: p.content }]) : []).map((s: any) => `
            <div>
              ${s.title ? `<h2 class="text-xl font-semibold mb-3">${e(s.title)}</h2>` : ""}
              <div class="text-gray-600 leading-relaxed">${e(s.content || s.text || "")}</div>
            </div>`).join("")}
        </div>
      </section>`;

    case "CTABanner":
      return `<section class="py-16 px-6 text-center" style="background:${p.backgroundImage ? `url('${e(p.backgroundImage)}') center/cover` : `linear-gradient(135deg, ${theme?.primaryColor || "#2563eb"}, ${theme?.secondaryColor || "#1e40af"})`}">
        <div class="relative z-10 max-w-2xl mx-auto text-white">
          <h2 class="text-3xl font-bold mb-4">${e(p.headline || p.title || "Ready to Get Started?")}</h2>
          <p class="text-lg mb-8 opacity-90">${e(p.subheadline || p.description || "")}</p>
          ${p.ctaText ? `<a href="${e(p.ctaLink || "#")}" class="inline-block bg-white font-semibold px-8 py-3 ${btn} hover:bg-gray-100 transition" style="color:${theme?.primaryColor || "#2563eb"}">${e(p.ctaText)}</a>` : ""}
        </div>
      </section>`;

    default:
      return `<section class="py-8 px-6 text-center text-gray-400 border border-dashed border-gray-300 ${br} mx-6 my-4">
        <p class="text-sm">Section: ${e(component)}</p>
      </section>`;
  }
};

const renderNavigation = (siteName: string, navItems: Array<{ label: string; href: string; children?: Array<{ label: string; href: string }> }>, theme?: ThemeData): string => {
  const items = navItems.map(item => {
    if (item.children && item.children.length > 0) {
      return `<div class="relative group">
        <button class="text-sm font-medium hover:opacity-70 transition flex items-center gap-1">${e(item.label)} <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg></button>
        <div class="absolute top-full left-0 mt-2 bg-white shadow-lg border border-gray-100 rounded-lg py-2 min-w-[180px] hidden group-hover:block z-50">
          ${item.children.map(c => `<a href="${e(c.href)}" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">${e(c.label)}</a>`).join("")}
        </div>
      </div>`;
    }
    return `<a href="${e(item.href)}" class="text-sm font-medium hover:opacity-70 transition">${e(item.label)}</a>`;
  }).join("");

  return `<nav class="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <a href="/" class="text-xl font-bold" style="color:${theme?.primaryColor || "#111827"}">${e(siteName)}</a>
      <div class="hidden md:flex items-center gap-6">${items}</div>
      <div class="flex items-center gap-4">
        <button class="text-gray-600 hover:text-gray-900 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </button>
        <button class="text-gray-600 hover:text-gray-900 transition relative">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
          <span class="absolute -top-1 -right-2 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">0</span>
        </button>
      </div>
    </div>
  </nav>`;
};

const renderFooter = (footer: { copyright?: string; links?: Array<{ label: string; href: string }> }, siteName: string, theme?: ThemeData): string => {
  return `<footer class="bg-gray-900 text-white py-12 px-6">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
        <div class="md:col-span-2">
          <div class="text-xl font-bold mb-4">${e(siteName)}</div>
          <p class="text-gray-400 text-sm leading-relaxed max-w-sm">Premium products and exceptional shopping experience.</p>
        </div>
        <div>
          <div class="font-semibold mb-4">Quick Links</div>
          <div class="space-y-2">
            ${(footer.links || []).slice(0, 5).map(l => `<a href="${e(l.href)}" class="block text-gray-400 text-sm hover:text-white transition">${e(l.label)}</a>`).join("")}
          </div>
        </div>
        <div>
          <div class="font-semibold mb-4">Customer Service</div>
          <div class="space-y-2 text-sm text-gray-400">
            <div>Contact Us</div>
            <div>Shipping & Returns</div>
            <div>FAQ</div>
            <div>Size Guide</div>
          </div>
        </div>
      </div>
      <div class="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="text-gray-500 text-sm">${e(footer.copyright || `© ${new Date().getFullYear()} ${e(siteName)}. All rights reserved.`)}</div>
        <div class="flex items-center gap-4 text-gray-500 text-sm">
          <span>Visa</span>
          <span>Mastercard</span>
          <span>PayPal</span>
          <span>Apple Pay</span>
        </div>
      </div>
    </div>
  </footer>`;
};

const generatePageHtml = (
  page: { slug: string; title: string; sections: Array<{ id: string; component: string; props: Record<string, any>; order: number }> },
  siteName: string,
  navigation: { items?: Array<{ label: string; href: string; children?: Array<{ label: string; href: string }> }> } | undefined,
  footer: { copyright?: string; links?: Array<{ label: string; href: string }> } | undefined,
  theme?: ThemeData
): string => {
  const fontName = theme?.fontFamily || "Inter";
  const sections = [...page.sections]
    .sort((a, b) => a.order - b.order)
    .map(s => renderComponent(s.component, s.props || {}, theme))
    .join("\n");

  const navItems = navigation?.items || [];
  const brandedNav = navItems.length > 0
    ? navItems
    : [{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: "About", href: "/about" }, { label: "Contact", href: "/contact" }];

  const primaryHex = theme?.primaryColor || "#1e3a5f";
  const secondaryHex = theme?.secondaryColor || "#2563eb";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${e(page.title)} | ${e(siteName)}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: '${primaryHex}',
            secondary: '${secondaryHex}'
          },
          fontFamily: {
            body: ['${fontName}', 'sans-serif']
          }
        }
      }
    }
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, "+")}:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: '${fontName}', sans-serif; }
    ${theme?.animations ? `
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    section { animation: fadeIn 0.6s ease-out; }` : ""}
    details[open] summary span:last-child { content: '−'; }
    details summary::-webkit-details-marker { display: none; }
  </style>
</head>
<body class="bg-white text-gray-900 antialiased">
  ${renderNavigation(siteName, brandedNav, theme)}
  <main>
    ${sections}
  </main>
  ${renderFooter(footer || {}, siteName, theme)}
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
  const theme = siteSpec.theme;
  const navigation = siteSpec.navigation;
  const footer = siteSpec.footer;

  const buildDir = path.join(GENERATED_DIR, projectId);
  fs.mkdirSync(buildDir, { recursive: true });

  const pages = siteSpec.pages || [];

  for (const page of pages) {
    const slug = page.slug || "index";
    const dir = slug === "home" || slug === "index"
      ? buildDir
      : path.join(buildDir, slug);
    fs.mkdirSync(dir, { recursive: true });

    const html = generatePageHtml(page, siteName, navigation, footer, theme);
    fs.writeFileSync(path.join(dir, "index.html"), html, "utf-8");
  }

  if (pages.length === 0) {
    const html = generatePageHtml(
      { slug: "home", title: siteName, sections: [] },
      siteName, navigation, footer, theme
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
