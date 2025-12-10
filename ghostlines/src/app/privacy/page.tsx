import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldCheck, EyeOff, Server, Globe, AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy - GhostLine',
  description: 'Privacy Policy for GhostLine P2P Video. Australian Privacy Act compliant.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans selection:bg-emerald-500/30">
      <div className="max-w-3xl mx-auto pt-16">
        
        {/* Header */}
        <div className="mb-12 border-l-4 border-emerald-500 pl-6">
             <h1 className="text-5xl font-bold tracking-tighter mb-2">Privacy Policy</h1>
             <p className="text-xl text-zinc-400 font-mono">&quot;We can&apos;t see your data, even if we wanted to.&quot;</p>
             <p className="text-sm text-zinc-600 mt-2">Effective Date: December 2025 | Jurisdiction: New South Wales, Australia</p>
        </div>
        
        <div className="space-y-12 text-zinc-300 leading-relaxed">
          
          {/* Section 1: The Core Promise */}
          <section className="bg-zinc-900/40 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <ShieldCheck className="text-emerald-500" /> The Promise
            </h2>
            <p className="mb-4">
              Most privacy policies explain <em>how</em> they manage your data. 
              <strong> GhostLine</strong> is architected to make data collection <strong>technically impossible</strong>.
            </p>
            <p className="mb-4">
              This policy complies with the <strong>Australian Privacy Act 1988</strong> (Cth) and the 
              <strong> Australian Privacy Principles (APPs)</strong>. However, because we do not collect 
              personal information, most APPs do not apply to us.
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <li className="bg-black/50 p-4 rounded-lg border border-white/10">
                    <strong className="text-emerald-400 block mb-1">Zero Server Logs</strong>
                    We do not store who called whom, or when.
                </li>
                <li className="bg-black/50 p-4 rounded-lg border border-white/10">
                    <strong className="text-emerald-400 block mb-1">Client-Side Keys</strong>
                    Encryption keys are generated on your device and never leave it.
                </li>
            </ul>
          </section>

          {/* Section 2: What We Cannot See */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <EyeOff className="text-emerald-500" /> What We CANNOT See
            </h2>
            <div className="space-y-4">
                <p>
                    <strong>1. Your Encryption Keys</strong><br/>
                    The decryption key lives in the URL <em>hash fragment</em> (after the # symbol). 
                    Browsers do <strong>not</strong> send hash fragments to web servers. 
                    Our servers see <code className="bg-zinc-800 px-1 rounded">ghostline.app/call/123</code>, but they never see the key.
                </p>
                <p>
                    <strong>2. Your Video and Audio</strong><br/>
                    All media streams are <strong>Peer-to-Peer (WebRTC)</strong>. Video data flows directly 
                    between participants. It does not pass through our servers. WebRTC mandates DTLS-SRTP 
                    encryption for all media, meaning even if data were intercepted, it would be unreadable.
                </p>
                <p>
                    <strong>3. Your Identity</strong><br/>
                    We do not require accounts, emails, phone numbers, or any personally identifiable information.
                </p>
            </div>
          </section>

          {/* Section 3: What We DO Collect */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Server className="text-emerald-500" /> What We DO Collect
            </h2>
             <ul className="list-disc list-inside space-y-3 ml-4 marker:text-emerald-500">
              <li>
                <strong>Ephemeral Signaling Data</strong>: To connect two browsers, our signaling server 
                (PeerJS) temporarily holds a randomized Peer ID and your IP address. This data is 
                <strong> not logged</strong> and is discarded immediately upon disconnection.
              </li>
              <li>
                <strong>IP Address Exposure</strong>: WebRTC connections may reveal your IP address to 
                the other party in the call. This is inherent to P2P technology. Use a VPN if you require 
                IP anonymity.
              </li>
              <li>
                <strong>Hosting Provider Logs</strong>: Our hosting provider (Vercel) may collect standard 
                web server logs (IP addresses, access times, URLs visited). These logs are subject to 
                Vercel&apos;s privacy policy.
              </li>
            </ul>
          </section>

          {/* Section 4: Third Parties */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Third-Party Services</h2>
            <div className="overflow-hidden rounded-lg border border-white/10">
                <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-900 text-zinc-400">
                        <tr>
                            <th className="p-3">Service</th>
                            <th className="p-3">Purpose</th>
                            <th className="p-3">Data Access</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 bg-black/50">
                        <tr>
                            <td className="p-3">PeerJS (0.peerjs.com)</td>
                            <td className="p-3">WebRTC Signaling</td>
                            <td className="p-3 text-zinc-500">Peer ID, IP (ephemeral)</td>
                        </tr>
                        <tr>
                            <td className="p-3">Vercel</td>
                            <td className="p-3">Website Hosting</td>
                            <td className="p-3 text-zinc-500">Standard access logs</td>
                        </tr>
                        <tr>
                            <td className="p-3">Google/Twilio STUN</td>
                            <td className="p-3">NAT Traversal</td>
                            <td className="p-3 text-zinc-500">IP address (not logged by us)</td>
                        </tr>
                    </tbody>
                </table>
            </div>
          </section>

          {/* Section 5: Australian Privacy Rights */}
          <section className="bg-zinc-900/40 p-6 rounded-2xl border border-white/5">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Globe className="text-emerald-500" /> Your Rights (Australian Residents)
            </h2>
            <p className="mb-4">
              Under the <strong>Privacy Act 1988</strong>, you have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 marker:text-emerald-500">
                <li>Request access to personal information we hold about you (we hold none).</li>
                <li>Request correction of inaccurate information (not applicable).</li>
                <li>Lodge a complaint with the <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">Office of the Australian Information Commissioner (OAIC)</a>.</li>
            </ul>
          </section>

          {/* Section 6: Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Cookies and Tracking</h2>
            <p>
              GhostLine does <strong>not</strong> use cookies, analytics trackers, or any form of persistent 
              client-side storage. We do not track you across sessions or websites.
            </p>
          </section>

          {/* Contact */}
          <section className="border-t border-zinc-800 pt-8 mt-12">
            <h3 className="text-lg font-bold text-zinc-500 mb-2">Contact</h3>
            <p className="text-sm text-zinc-600">
              Questions? Found a vulnerability? Contact: <strong>contact@sreekarreddy.com</strong>
            </p>
             <p className="text-xs text-zinc-700 mt-4">
              Last updated: December 2025
            </p>
          </section>

          <div className="mt-12">
            <Link href="/" className="inline-flex items-center gap-2 text-emerald-500 hover:text-emerald-400 transition-colors font-mono uppercase tracking-widest text-sm">
                <span>← Return to GhostLine</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
