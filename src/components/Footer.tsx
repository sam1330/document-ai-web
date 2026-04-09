import Link from "next/link";
import SocialIcon from "./ui/SocialIcon";


export default function Footer() {
    return (
      <footer className="bg-white border-t border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
            <div className="col-span-2">
              <Link href="/" className="text-2xl font-black tracking-tighter text-slate-900 mb-6 block">
                HAKU<span className="text-indigo-600">.</span>
              </Link>
              <p className="text-slate-500 mb-8 max-w-sm">
                Empowering job seekers with the world's most sophisticated AI resume analysis and application tools.
              </p>
              <div className="flex space-x-4">
                 <SocialIcon name="Twitter" />
                 <SocialIcon name="LinkedIn" />
                 <SocialIcon name="GitHub" />
              </div>
            </div>
            <div>
              <p className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-xs">Product</p>
              <ul className="space-y-4 text-slate-500 text-sm">
                <li><Link href="#features" className="hover:text-indigo-600">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-indigo-600">Pricing</Link></li>
                <li><Link href="#roadmap" className="hover:text-indigo-600">Roadmap</Link></li>
              </ul>
            </div>
            {/* <div>
              <p className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-xs">Company</p>
              <ul className="space-y-4 text-slate-500 text-sm">
                <li><Link href="/about" className="hover:text-indigo-600">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-indigo-600">Careers</Link></li>
                <li><Link href="/blog" className="hover:text-indigo-600">Blog</Link></li>
              </ul>
            </div> */}
            <div>
              <p className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-xs">Support</p>
              <ul className="space-y-4 text-slate-500 text-sm">
                <li><Link href="/faq" className="hover:text-indigo-600">FAQ</Link></li>
                <li><Link href="/contact" className="hover:text-indigo-600">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-indigo-600">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center text-slate-400 text-xs font-medium uppercase tracking-widest">
            <p>&copy; 2026 Haku AI. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-8">
               <Link href="/terms" className="hover:text-slate-600">Terms of Service</Link>
               <Link href="/cookies" className="hover:text-slate-600">Cookie Settings</Link>
            </div>
          </div>
        </div>
      </footer>
    )
}