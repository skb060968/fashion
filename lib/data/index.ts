// lib/data/index.ts

import { siteInfo } from "./siteInfo"
import { hero } from "./hero"
import { about } from "./about"
import { aboutPage } from "./aboutPage"
import { experience } from "./experience"
import { achievements } from "./achievements"
import { skills } from "./skills"
import { services } from "./services"
import { footer } from "./footer"
import { servicesPage } from "./servicesPage"
import { process } from "./process"
import { contact } from "./contact"
import { faq } from "./faq"
import { dresses as shop } from "./shop"
import { collections } from "./collections"
import { journalPosts } from "./journal"
import { recognitions } from "./recognitions"
import { brandStory } from "./brandStory"


/**
 * Central content object used by pages/components.
 * Recommended for most imports:
 *   import { content } from "@/lib/data"
 */
export const content = {
  siteInfo,
  hero,
  about,
  aboutPage,
  experience,
  achievements,
  skills,
  services,
  footer,
  servicesPage,
  process,
  contact,
  faq,
  shop,
  collections,
  journalPosts,
  recognitions,
  brandStory,
}

/**
 * Named exports for selective direct imports.
 * Example:
 *   import { hero, footer } from "@/lib/data"
 */
export {
  siteInfo,
  hero,
  about,
  aboutPage,
  experience,
  achievements,
  skills,
  services,
  footer,
  servicesPage,
  process,
  contact,
  faq,
  shop,
  collections,
  journalPosts,
  recognitions,
  brandStory,
}
