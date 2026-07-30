'use client'

import Link from 'next/link'
import { useLanguage } from '@/components/i18n/LanguageProvider'

const GUIDES = [
  {
    href: '#platform-terms',
    title: 'Platform Terms of Use',
    summary: 'The rules governing access to and use of Ehya Masaha.',
    points: [
      'Ehya Masaha is an electronic intermediary connecting space owners with space seekers; it is not the owner or operator of listed spaces unless explicitly stated.',
      'Users must be legally eligible, provide accurate information, protect their account credentials, and promptly report unauthorized use.',
      'Fraud, impersonation, unlawful activity, security circumvention, unauthorized data extraction, rights infringement, and fee avoidance are prohibited.',
      'Electronic records, approvals, notices, booking confirmations, and platform messages may be relied upon as evidence of transactions.',
      'Accounts may be restricted or terminated for legal, security, payment, fraud, or material policy violations.',
      'Saudi law applies, and material amendments will be published and notified as required by the official Arabic terms.',
    ],
  },
  {
    href: '#booking-terms',
    title: 'Booking & Service Terms',
    summary: 'The rules that apply when a space seeker books a space or an added service.',
    points: [
      'A booking is formed only after the platform confirms the request and the required payment process is completed.',
      'The space seeker must verify dates, times, capacity, intended use, prices, services, and cancellation rules before confirmation.',
      'The seeker must use the space lawfully, follow the owner’s published rules, protect the premises, and leave on time.',
      'The owner must provide the confirmed space and services in the advertised condition and at the agreed time.',
      'Changes, cancellations, no-shows, refunds, and force-majeure events are handled under the displayed policy and the official Arabic terms.',
      'Complaints should be submitted promptly with supporting information; direct off-platform arrangements are outside platform protections.',
    ],
  },
  {
    href: '#owner-terms',
    title: 'Space Owner Terms',
    summary: 'The obligations accepted by sellers and space owners when listing and operating a space.',
    points: [
      'The owner must have lawful ownership, authority, or a valid right to offer the space and must provide requested verification documents.',
      'Listings, photos, prices, availability, capacity, facilities, services, licenses, and safety information must be accurate and current.',
      'The owner remains responsible for the condition, readiness, safety, access, lawful operation, and delivery of the listed space.',
      'Confirmed bookings must be honored, and cancellations or changes must follow the published policy and platform procedures.',
      'Users obtained through Ehya Masaha may not be diverted off-platform to avoid fees, records, or platform safeguards.',
      'Payouts, deductions, refunds, suspensions, content rights, indemnities, and termination are governed by the official Arabic owner terms.',
    ],
  },
  {
    href: '#privacy',
    title: 'Privacy Policy',
    summary: 'How personal data is collected, used, shared, retained, and protected.',
    points: [
      'The platform may collect account, identity, contact, booking, payment, device, usage, support, and verification information.',
      'Data is used to provide services, verify users, process bookings and payments, prevent fraud, support users, comply with law, and improve the platform.',
      'Information may be shared only as needed with transaction counterparties, payment and technology providers, professional advisers, or competent authorities.',
      'Reasonable technical and organizational safeguards are used, while no online system can guarantee absolute security.',
      'Data is retained only for operational, contractual, dispute, fraud-prevention, and legal-compliance needs.',
      'Users may exercise applicable Saudi data-protection rights by contacting the addresses stated in the official Arabic privacy policy.',
    ],
  },
  {
    href: '#intellectual-property',
    title: 'Intellectual Property Policy',
    summary: 'Ownership and permitted use of the platform, brand, databases, and user content.',
    points: [
      'Ehya Masaha owns or licenses the platform, software, design, brand assets, databases, and platform-created content.',
      'Users receive a limited, personal, non-exclusive right to use the service; resale, copying, scraping, redistribution, reverse engineering, or unauthorized commercial reuse is prohibited.',
      'Users retain lawful ownership of their uploaded content while licensing the platform to use it as needed to operate, display, market, and improve the service.',
      'Users must not upload content that is misleading, unlawful, private, or infringing, and remain responsible for the rights they claim to hold.',
      'Rights holders may submit a supported infringement notice using the contact details in the official Arabic policy.',
    ],
  },
] as const

export default function LegalEnglishGuide() {
  const { locale } = useLanguage()
  if (locale !== 'en') return null

  return (
    <section dir="ltr" className="border-b border-[#DED5C7] bg-[#F8F5EE]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[26px] border border-[#D8C18F] bg-white p-6 shadow-[0_18px_50px_rgba(9,44,39,.06)] sm:p-8">
          <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#9A7628]">English reading guide</p>
          <h2 className="mt-2 text-3xl font-extrabold text-[#102F29]">Understand the legal documents before you transact</h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-[#56625D]">
            This English guide explains the main obligations in the five documents. The complete founder-approved
            legal text is the Arabic version shown below. If this guide and the Arabic text differ, the Arabic text controls.
            For a certified English legal version, contact Ehya Masaha before accepting.
          </p>
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {GUIDES.map(guide => (
              <article key={guide.href} className="rounded-2xl border border-[#E1D9CD] bg-[#FCFAF6] p-5">
                <h3 className="text-lg font-extrabold text-[#173C34]">{guide.title}</h3>
                <p className="mt-1 text-sm font-semibold text-[#8A6B2D]">{guide.summary}</p>
                <ul className="mt-4 space-y-2.5">
                  {guide.points.map(point => (
                    <li key={point} className="flex gap-2.5 text-sm leading-6 text-[#4C5853]">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B99A63]" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <Link href={guide.href} className="mt-5 inline-flex text-sm font-extrabold text-[#0E3B34] underline underline-offset-4">
                  Read the complete official Arabic document
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
