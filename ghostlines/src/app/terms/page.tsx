import type { Metadata } from 'next'
import Link from 'next/link'
import { AlertTriangle, Scale, Gavel, Shield, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service - GhostLine',
  description: 'Terms of Service for GhostLine P2P Video. Governed by NSW, Australia law.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans selection:bg-rose-500/30">
      <div className="max-w-3xl mx-auto pt-16">
        
        {/* Header */}
        <div className="mb-12 border-l-4 border-rose-600 pl-6">
             <h1 className="text-5xl font-bold tracking-tighter mb-2">Terms of Service</h1>
             <p className="text-xl text-zinc-400 font-mono">Use it responsibly. Don&apos;t be evil.</p>
             <p className="text-sm text-zinc-600 mt-2">Effective Date: December 2025 | Jurisdiction: New South Wales, Australia</p>
        </div>
        
        <div className="space-y-12 text-zinc-300 leading-relaxed">
          
          {/* Section 1: Acceptance */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Gavel className="text-rose-500" /> 1. Acceptance of Terms
            </h2>
            <p className="mb-4">
              By accessing or using <strong>GhostLine</strong> (&quot;the Service&quot;), you agree to be bound by 
              these Terms of Service. If you do not agree, you must immediately discontinue use of the Service.
            </p>
            <p>
              This Service is provided by an individual developer based in <strong>New South Wales, Australia</strong>.
              These terms shall be governed by and construed in accordance with the laws of New South Wales.
            </p>
          </section>

          {/* Section 2: Service Description */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="text-zinc-400" /> 2. Description of Service
            </h2>
            <p className="mb-4">
              GhostLine is a <strong>Peer-to-Peer (P2P) video calling utility</strong> built on WebRTC technology. 
              The Service facilitates direct browser-to-browser connections. We act solely as a 
              <strong> signaling conduit</strong> to help peers discover each other.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 marker:text-zinc-500">
                <li>We do not host, store, or relay your video or audio data.</li>
                <li>We do not provide telecommunications &quot;carriage services&quot; under Australian law.</li>
                <li>We are not a telecommunications carrier and are not subject to data retention laws.</li>
            </ul>
          </section>

          {/* Section 3: Prohibited Use */}
          <section className="bg-zinc-900/40 p-6 rounded-2xl border border-rose-500/20 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <AlertTriangle className="text-rose-500" /> 3. Prohibited Uses
            </h2>
            <p className="mb-4">
              GhostLine is a tool for privacy, not for crime. You agree <strong>NOT</strong> to use this service for:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 marker:text-rose-500">
               <li>Distribution of child sexual abuse material (CSAM) or any illegal content.</li>
               <li>Harassment, stalking, threats, or doxxing.</li>
               <li>Planning or organizing violence or terrorism.</li>
               <li>Fraud, phishing, or distribution of malware.</li>
               <li>Interference with our signaling infrastructure (DDoS, etc.).</li>
               <li>Any activity that violates Australian law or the law of your jurisdiction.</li>
            </ul>
            <div className="mt-6 p-4 bg-rose-950/30 rounded-lg border border-rose-500/20">
                <p className="text-sm text-rose-300">
                    <strong>Important:</strong> Because we cannot technically monitor encrypted P2P calls, we cannot 
                    prevent illegal use. However, we will cooperate with law enforcement upon valid legal request 
                    (e.g., warrant) to the extent technically possible. Users engaging in illegal activity are 
                    solely responsible for their actions.
                </p>
            </div>
          </section>

          {/* Section 4: Your Responsibilities */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Users className="text-zinc-400" /> 4. Your Responsibilities
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-4 marker:text-zinc-500">
                <li>You are responsible for the security of your device and network.</li>
                <li>You must obtain consent before recording or sharing any call content.</li>
                <li>You acknowledge that P2P connections may expose your IP address to the other party.</li>
                <li>You should verify participant identity using the visual fingerprint feature.</li>
            </ul>
          </section>

          {/* Section 5: Liability */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Scale className="text-zinc-400" /> 5. Limitation of Liability
            </h2>
            <p className="mb-4">
              To the maximum extent permitted by law (including the <strong>Australian Consumer Law</strong>):
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
                <li>The Service is provided <strong>&quot;AS IS&quot;</strong> without any warranty, express or implied.</li>
                <li>We do not guarantee uninterrupted, secure, or error-free operation.</li>
                <li>We are <strong>not responsible</strong> for the content of any video call.</li>
                <li>We assume no liability for data loss, interception, or connection failures.</li>
                <li>Our total liability to you is limited to <strong>$0 AUD</strong> (free service).</li>
            </ul>
            <p className="mt-4 text-sm text-zinc-500">
              Note: Certain guarantees under Australian Consumer Law cannot be excluded. These terms do not 
              affect rights that cannot be excluded by law.
            </p>
          </section>

          {/* Section 6: Indemnification */}
          <section>
             <h2 className="text-2xl font-bold text-white mb-4">6. Indemnification</h2>
             <p>
                You agree to indemnify and hold harmless the developer of GhostLine from any claims, damages, 
                losses, or expenses arising from your use of the Service or your violation of these Terms.
             </p>
          </section>

          {/* Section 7: Open Source */}
          <section>
             <h2 className="text-2xl font-bold text-white mb-4">7. Open Source License</h2>
             <p>
                GhostLine source code is available under the MIT License. You are free to audit, fork, or modify 
                the code to verify our security claims. The MIT License applies to the code, not to these Terms 
                of Service.
             </p>
          </section>

          {/* Section 8: Modifications */}
          <section>
             <h2 className="text-2xl font-bold text-white mb-4">8. Modifications to Terms</h2>
             <p>
                We may update these Terms at any time. Continued use of the Service after changes constitutes 
                acceptance of the modified Terms. We recommend checking this page periodically.
             </p>
          </section>

          {/* Section 9: Dispute Resolution */}
          <section>
             <h2 className="text-2xl font-bold text-white mb-4">9. Dispute Resolution & Governing Law</h2>
             <p className="mb-4">
                These Terms are governed by the laws of <strong>New South Wales, Australia</strong>. 
                Any disputes shall be resolved in the courts of New South Wales.
             </p>
             <p>
                Before initiating legal proceedings, you agree to attempt good-faith resolution by contacting 
                us at <strong>sreekarreddy.edu@gmail.com</strong>.
             </p>
          </section>

          {/* Section 10: Severability */}
          <section>
             <h2 className="text-2xl font-bold text-white mb-4">10. Severability</h2>
             <p>
                If any provision of these Terms is found to be unenforceable, the remaining provisions shall 
                continue in full force and effect.
             </p>
          </section>

          {/* Footer */}
           <section className="border-t border-zinc-800 pt-8 mt-12">
             <p className="text-xs text-zinc-700">
              Last updated: December 2025
            </p>
          </section>

          <div className="mt-12">
            <Link href="/" className="inline-flex items-center gap-2 text-rose-500 hover:text-rose-400 transition-colors font-mono uppercase tracking-widest text-sm">
                <span>← Return to GhostLine</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
