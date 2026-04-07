/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Users, 
  MapPin, 
  Plane, 
  Train, 
  Clock, 
  CreditCard, 
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  Home,
  Calendar,
  Briefcase,
  ShieldCheck,
  Menu,
  X,
  Search
} from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  icon: ReactNode;
  content: string[];
  details?: string;
  category: 'General' | 'Eligibility' | 'Travel' | 'Claims' | 'Policy';
}

const Highlight = ({ text, query }: { text: string; query: string }) => {
  if (!query.trim()) return <>{text}</>;
  
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return (
    <>
      {parts.map((part, i) => 
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-yellow-200 text-slate-900 rounded-sm px-0.5">{part}</mark>
        ) : (
          part
        )
      )}
    </>
  );
};

const slides: Slide[] = [
  {
    id: 1,
    title: "Introduction & Purpose",
    category: "General",
    icon: <BookOpen className="w-8 h-8 text-blue-500" />,
    content: [
      "LTC is a concessional travel facility for Central Government employees.",
      "Purpose: To visit Home Town or any place in India during a block of four years.",
      "Current Block: 2022-2025 (Two-year blocks: 2022-23 and 2024-25).",
      "Travel expenses for employees and eligible family members are borne by the Government."
    ],
    details: "Employees can choose between Home Town LTC twice in 4 years, or Home Town once and Any Place in India once."
  },
  {
    id: 2,
    title: "Applicability (Rule 1)",
    category: "Eligibility",
    icon: <Users className="w-8 h-8 text-green-500" />,
    content: [
      "Applies to all persons appointed to civil services and posts.",
      "Includes civilian Government servants in the Defence Services.",
      "Applies to State Government employees on deputation with Central Government.",
      "Applies to persons appointed on contract basis.",
      "Applies to re-employed persons after retirement."
    ],
    details: "Officers of autonomous bodies on deputation are treated as temporary Govt servants for LTC."
  },
  {
    id: 3,
    title: "Exclusions (Rule 1)",
    category: "Eligibility",
    icon: <XCircle className="w-8 h-8 text-red-500" />,
    content: [
      "Not applicable to Govt servants not in whole-time employment.",
      "Not applicable to casual and daily rated employees.",
      "Not applicable to persons paid from contingencies.",
      "Not applicable to Railway servants (they have their own pass system).",
      "Not applicable to members of the Armed Forces.",
      "Not applicable to local recruits in Indian Missions abroad."
    ],
    details: "Railway employees may avail 'All India LTC' once in 4 years under specific conditions."
  },
  {
    id: 4,
    title: "Continuous Service (Rule 2)",
    category: "Eligibility",
    icon: <Clock className="w-8 h-8 text-teal-500" />,
    content: [
      "LTC is admissible after completion of one year's continuous service.",
      "For contract employees, total duration of contract is considered.",
      "For re-employed persons without break, previous service is treated as continuous.",
      "Administrative authority must certify likelihood of continued service (2 years for Hometown, 4 years for All India)."
    ]
  },
  {
    id: 5,
    title: "Scope of LTC (Rule 3)",
    category: "General",
    icon: <Briefcase className="w-8 h-8 text-indigo-500" />,
    content: [
      "LTC covers the Government servant himself and his family.",
      "Family members can travel in different groups at different times.",
      "Family members can visit different places under 'Any Place in India' LTC.",
      "Concession is counted against the block in which the outward journey commences."
    ]
  },
  {
    id: 6,
    title: "Definition of 'Family' (Rule 4)",
    category: "Eligibility",
    icon: <Home className="w-8 h-8 text-purple-500" />,
    content: [
      "Spouse (only one wife included).",
      "Two surviving unmarried children/stepchildren (wholly dependent).",
      "Married daughters (divorced/abandoned/separated/widowed) residing with and dependent on the employee.",
      "Parents and stepparents (wholly dependent).",
      "Unmarried minor brothers and dependent sisters (if parents are not alive/dependent)."
    ],
    details: "Restriction to two children does not apply to those born before 20.10.1997 or multiple births."
  },
  {
    id: 7,
    title: "Dependency Criteria (Rule 4)",
    category: "Eligibility",
    icon: <Info className="w-8 h-8 text-blue-400" />,
    content: [
      "Dependency is linked to the minimum family pension + dearness relief.",
      "Current limit: Income from all sources not exceeding ₹9000 + DA per month.",
      "Condition of dependency is NOT applicable to husband and wife.",
      "Parents/children must be 'wholly dependent' on the Government servant."
    ]
  },
  {
    id: 8,
    title: "Hometown Definition (Rule 4)",
    category: "Policy",
    icon: <MapPin className="w-8 h-8 text-orange-500" />,
    content: [
      "Hometown is the place declared by the employee and accepted by the Controlling Officer.",
      "It is the place where the employee would normally reside but for Government service.",
      "Criteria: Ownership of property, residence of near relatives, or permanent residence before joining service.",
      "Declaration once accepted is generally final."
    ]
  },
  {
    id: 9,
    title: "Change of Hometown (Rule 5)",
    category: "Policy",
    icon: <AlertTriangle className="w-8 h-8 text-amber-600" />,
    content: [
      "Change is allowed only ONCE in the entire service career.",
      "Must be authorized by the Head of Department (HoD).",
      "Allowed only in exceptional circumstances.",
      "If the employee is the HoD, the Administrative Ministry authorizes the change."
    ]
  },
  {
    id: 10,
    title: "Any Place in India Declaration (Rule 6)",
    category: "Policy",
    icon: <MapPin className="w-8 h-8 text-red-500" />,
    content: [
      "Intended place of visit must be declared in advance to the Controlling Officer.",
      "Change of destination is allowed before commencement of journey.",
      "Change after commencement allowed only in exceptional circumstances beyond control.",
      "HoD or Administrative Ministry can relax this rule."
    ]
  },
  {
    id: 11,
    title: "Admissibility during Leave (Rule 7)",
    category: "General",
    icon: <Calendar className="w-8 h-8 text-sky-500" />,
    content: [
      "Admissible during any period of leave, including Casual Leave.",
      "Admissible during Special Casual Leave and Vacation.",
      "Admissible during Child Care Leave (CCL) and Study Leave.",
      "NOT admissible during weekend holidays without any leave."
    ],
    details: "For vacation departments, vacation is treated as regular leave for LTC. Study leave must be for a period not exceeding 24 months."
  },
  {
    id: 12,
    title: "LTC during Training (Rule 7 Note 9)",
    category: "General",
    icon: <BookOpen className="w-8 h-8 text-indigo-600" />,
    content: [
      "Government servants on training are entitled to LTC.",
      "The period of training is treated as duty for LTC purposes.",
      "Headquarters for LTC is the place where the employee was posted before training.",
      "If training is for a long duration (> 6 months), the training center can be treated as headquarters."
    ],
    details: "This ensures that employees undergoing long-term training programs do not lose their LTC benefits."
  },
  {
    id: 13,
    title: "Technical Resignation (Rule 7 Note 4)",
    category: "Policy",
    icon: <ShieldCheck className="w-8 h-8 text-green-600" />,
    content: [
      "LTC entitlement is carried forward if a Govt servant joins another post via technical resignation.",
      "Treated as a fresh recruit from the date of initial appointment if resignation is within 8 years.",
      "Service continuity is maintained for the purpose of LTC blocks.",
      "Initial appointment date remains the reference for fresh recruit benefits."
    ],
    details: "This rule protects the seniority and benefits of employees moving between different Government departments."
  },
  {
    id: 14,
    title: "Deputationists & PSU Employees",
    category: "Eligibility",
    icon: <Briefcase className="w-8 h-8 text-slate-500" />,
    content: [
      "Deputationists can choose between PSU LTC rules or Central Govt rules.",
      "Choice should be the one more favorable to the employee.",
      "Fresh option allowed if PSU rules are revised during deputation.",
      "If PSU has no LTC, employee remains eligible for Central Govt LTC."
    ]
  },
  {
    id: 15,
    title: "Fresh Recruits Concessions",
    category: "General",
    icon: <CheckCircle2 className="w-8 h-8 text-emerald-500" />,
    content: [
      "Allowed Hometown LTC on 3 occasions in a block of 4 years.",
      "Any Place in India LTC allowed on the 4th occasion.",
      "This benefit is available for the first two blocks of 4 years (total 8 years).",
      "Blocks are calculated from the date of joining the Government."
    ]
  },
  {
    id: 16,
    title: "Special Dispensation Scheme",
    category: "Policy",
    icon: <Plane className="w-8 h-8 text-blue-500" />,
    content: [
      "Allows air travel to NER, J&K, Ladakh, and A&N for non-entitled employees.",
      "Conversion of one Hometown LTC in a 4-year block is allowed.",
      "Extended till 25th September, 2024.",
      "Reimbursement restricted to actual air fare or entitled class fare, whichever is less."
    ],
    details: "Fresh recruits also have additional conversion options for these regions."
  },
  {
    id: 17,
    title: "Husband & Wife Rules",
    category: "Eligibility",
    icon: <Users className="w-8 h-8 text-pink-500" />,
    content: [
      "If both are Govt servants, they can claim LTC separately.",
      "They can also claim as a family member of the other.",
      "Children can be claimed by either parent, but not both.",
      "If residing together, they serve as one unit for dependency purposes."
    ]
  },
  {
    id: 18,
    title: "Escort for Handicapped Employees",
    category: "Eligibility",
    icon: <Users className="w-8 h-8 text-blue-300" />,
    content: [
      "LTC allowed for an escort accompanying a single handicapped employee.",
      "Handicap must be such that the employee cannot travel alone.",
      "Prior approval and medical certification are required.",
      "Escort's fare is reimbursed as per the employee's entitlement."
    ]
  },
  {
    id: 19,
    title: "Suspended Employees",
    category: "Eligibility",
    icon: <AlertTriangle className="w-8 h-8 text-red-400" />,
    content: [
      "A suspended Government servant cannot avail LTC for self.",
      "Family members of the suspended employee remain entitled to LTC.",
      "Suspension period does not count as a break in service for LTC eligibility.",
      "Claim for family can be processed as per normal rules."
    ]
  },
  {
    id: 20,
    title: "Types of LTC (Rule 8)",
    category: "General",
    icon: <Calendar className="w-8 h-8 text-indigo-400" />,
    content: [
      "Hometown LTC: Admissible once in a block of 2 calendar years (e.g., 2022-23).",
      "Any Place in India LTC: Admissible once in a block of 4 calendar years (e.g., 2022-25).",
      "All India LTC is in lieu of one Hometown LTC.",
      "Distance between headquarters and destination does not affect admissibility."
    ]
  },
  {
    id: 21,
    title: "LTC for Self Only (Rule 8c)",
    category: "General",
    icon: <Users className="w-8 h-8 text-slate-600" />,
    content: [
      "If family lives away at Hometown, employee can choose LTC for self only every year.",
      "This is in lieu of all other LTC concessions (Hometown and All India) for self and family.",
      "Useful for employees posted far from family residence.",
      "Option must be exercised for the entire block."
    ]
  },
  {
    id: 22,
    title: "Counting Against Blocks (Rule 9)",
    category: "Policy",
    icon: <Clock className="w-8 h-8 text-orange-400" />,
    content: [
      "LTC is counted against the block in which the OUTWARD journey commences.",
      "Return journey can be performed after the block expires.",
      "Applies to carried forward LTC as well.",
      "Family members can travel in different groups within the same block."
    ]
  },
  {
    id: 23,
    title: "Carry Over of LTC (Rule 10)",
    category: "Policy",
    icon: <ChevronRight className="w-8 h-8 text-blue-600" />,
    content: [
      "LTC not used in a block can be used in the 1st year of the next block.",
      "Example: 2022-23 LTC can be used up to 31st Dec 2024.",
      "Hometown LTC must be carried forward to carry forward All India LTC.",
      "Outward journey must start on or before the last day of the grace year."
    ]
  },
  {
    id: 24,
    title: "Different Places for Family",
    category: "General",
    icon: <MapPin className="w-8 h-8 text-purple-400" />,
    content: [
      "Family members can visit different places of their choice.",
      "Not necessary to visit the same place as the Government servant.",
      "Applies to 'Any Place in India' LTC block.",
      "Each member's destination must be declared in advance."
    ]
  },
  {
    id: 25,
    title: "Travel Entitlements (Rule 12)",
    category: "Travel",
    icon: <Train className="w-8 h-8 text-blue-700" />,
    content: [
      "Entitlements are based on the Pay Matrix Level.",
      "Level 14 & above: Air (Business Class) / Rail (1st AC).",
      "Level 9 to 13: Air (Economy) / Rail (1st AC).",
      "Level 6 to 8: Rail (2nd AC). Air NOT allowed for LTC.",
      "Level 5 & below: Rail (3rd AC / Sleeper)."
    ],
    details: "Reimbursement is restricted to the entitled class by the shortest direct route. If an employee travels in a higher class, reimbursement is limited to the entitled class fare. If they travel in a lower class, actual fare is paid."
  },
  {
    id: 26,
    title: "Private Transport/Taxi",
    category: "Travel",
    icon: <Briefcase className="w-8 h-8 text-slate-700" />,
    content: [
      "Use of own/hired taxi allowed for disability of employee/family.",
      "Medical certificate and disability proof required.",
      "Reimbursement as per entitlement for journey on transfer.",
      "Must obtain necessary papers to avoid misuse."
    ]
  },
  {
    id: 27,
    title: "ITDC/STDC/IRCTC Tours",
    category: "Travel",
    icon: <Train className="w-8 h-8 text-orange-600" />,
    content: [
      "Tours conducted by ITDC, STDCs, and IRCTC qualify for LTC.",
      "Includes buses hired or chartered by these corporations.",
      "Reimbursement includes air fare if part of the IRCTC package.",
      "Subject to the employee's overall entitlement."
    ]
  },
  {
    id: 28,
    title: "Children's Fare Rules",
    category: "Travel",
    icon: <Users className="w-8 h-8 text-green-400" />,
    content: [
      "Children < 5 years: No air fare reimbursement for non-entitled employees.",
      "Children 5-12 years: Actual rail fare reimbursed as per ticket purchased.",
      "Railways now charge full fare for children if a separate berth is opted.",
      "LTC reimbursement follows the actual fare paid to Railways."
    ]
  },
  {
    id: 29,
    title: "Flexi-fare & Tejas Trains",
    category: "Travel",
    icon: <Train className="w-8 h-8 text-red-600" />,
    content: [
      "Flexi-fare (dynamic fare) in Rajdhani/Shatabdi/Duronto is admissible.",
      "Tejas Rajdhani Express trains are covered under LTC.",
      "Reimbursement of ticket fare of Tejas Express (Private) is NOT allowed.",
      "Dynamic fare not allowed if non-entitled employee travels by air."
    ]
  },
  {
    id: 30,
    title: "Authorized Travel Agents (ATAs)",
    category: "Travel",
    icon: <Plane className="w-8 h-8 text-sky-600" />,
    content: [
      "Air tickets MUST be booked through 3 ATAs only:",
      "1. Balmer Lawrie & Company (BLCL)",
      "2. Ashok Travels & Tours (ATT)",
      "3. IRCTC",
      "Self-booking allowed only through the official websites of these 3 ATAs."
    ],
    details: "Booking through platforms like MakeMyTrip, Yatra, etc., is strictly prohibited and will lead to rejection of the claim. Employees are encouraged to book at least 21 days in advance to get the 'Best Available Fare'."
  },
  {
    id: 31,
    title: "Air Travel (Non-Entitled)",
    category: "Travel",
    icon: <Plane className="w-8 h-8 text-slate-400" />,
    content: [
      "Non-entitled employees can travel by air but reimbursement is capped.",
      "Reimbursement = Actual air fare OR Entitled Rail/Bus fare (whichever is less).",
      "Mandatory booking through 3 ATAs is NO LONGER required for such cases.",
      "Exception: Special Dispensation Scheme still requires booking through ATAs."
    ]
  },
  {
    id: 32,
    title: "Registration with ATAs",
    category: "Travel",
    icon: <CreditCard className="w-8 h-8 text-blue-500" />,
    content: [
      "Employees without official email can register with ATAs using private email.",
      "Administrative office must send details (Name, Code, Email, Mobile) to ATAs.",
      "Allows digital booking through Self Booking Tools.",
      "Ensures compliance with mandatory booking rules."
    ]
  },
  {
    id: 33,
    title: "Reimbursement Principles",
    category: "Claims",
    icon: <CreditCard className="w-8 h-8 text-emerald-600" />,
    content: [
      "Reimbursement is for point-to-point journey on a through ticket.",
      "Must follow the shortest direct route.",
      "If a longer route is taken, reimbursement is restricted to the shortest route fare.",
      "Reservation and sleeper charges are reimbursable."
    ]
  },
  {
    id: 34,
    title: "Catering Charges",
    category: "Claims",
    icon: <Info className="w-8 h-8 text-orange-500" />,
    content: [
      "Reimbursement of catering charges is allowed for eligible trains.",
      "Applies where Railways provide an option to opt for catering.",
      "Employee must opt for catering services while booking the ticket.",
      "Catering must be part of the ticket fare."
    ]
  },
  {
    id: 35,
    title: "Cancellation Charges",
    category: "Claims",
    icon: <AlertTriangle className="w-8 h-8 text-red-500" />,
    content: [
      "Cancellation charges by airlines and ATAs are reimbursable.",
      "Allowed ONLY on grounds of official exigencies.",
      "Self-declared justification required if cancelled < 24 hours before travel.",
      "In other cases, cancellation charges are borne by the employee."
    ]
  },
  {
    id: 36,
    title: "Private Transport Limits",
    category: "Claims",
    icon: <MapPin className="w-8 h-8 text-slate-800" />,
    content: [
      "Journey by private transport to nearest station/airport is capped.",
      "Limit: 100 Kms for one side (Total 200 Kms for to and fro).",
      "Reimbursed as per entitlement for journey on transfer.",
      "Self-certification required; expenditure beyond 200 Kms borne by employee."
    ]
  },
  {
    id: 37,
    title: "Forfeiture of Claim",
    category: "Claims",
    icon: <Clock className="w-8 h-8 text-red-700" />,
    content: [
      "Claim must be submitted within 3 months if no advance drawn.",
      "Claim must be submitted within 1 month if advance was drawn.",
      "Failure leads to forfeiture of the claim.",
      "HoD can relax limit up to 6 months in exceptional cases."
    ]
  },
  {
    id: 38,
    title: "Grant of LTC Advance",
    category: "Claims",
    icon: <CreditCard className="w-8 h-8 text-indigo-600" />,
    content: [
      "Advance limited to 80% (4/5ths) of estimated reimbursement.",
      "Can be drawn separately for family members.",
      "Can be drawn for both ways if leave/absence < 90 days.",
      "Tickets must be produced within 10 days of drawing advance."
    ]
  },
  {
    id: 39,
    title: "Advance Refund & Adjustment",
    category: "Claims",
    icon: <AlertTriangle className="w-8 h-8 text-amber-700" />,
    content: [
      "Full refund required if outward journey not started within 30 days.",
      "If claim not submitted within 1 month, full advance must be refunded in one lump sum.",
      "Interest is charged on the entire advance from date of drawal if not settled on time.",
      "Difference in fare is adjusted during final settlement."
    ]
  },
  {
    id: 40,
    title: "Leave Encashment with LTC",
    category: "General",
    icon: <ShieldCheck className="w-8 h-8 text-emerald-700" />,
    content: [
      "Encashment of up to 10 days EL allowed at the time of LTC.",
      "Maximum 60 days in entire career.",
      "Available to both husband and wife (60 days each).",
      "No linkage to the number of days of leave actually availed."
    ]
  },
  {
    id: 41,
    title: "Encashment for 'Nil' Claims",
    category: "General",
    icon: <CheckCircle2 className="w-8 h-8 text-blue-800" />,
    content: [
      "Leave encashment allowed even if travel reimbursement is 'Nil'.",
      "Applies when employee travels by private vehicle in areas with public transport.",
      "Employee must declare they travelled to the destination.",
      "LTC must be sanctioned in advance as per procedure."
    ]
  },
  {
    id: 42,
    title: "Fraudulent Claims",
    category: "Policy",
    icon: <AlertTriangle className="w-8 h-8 text-red-800" />,
    content: [
      "Preferring a fraudulent claim leads to disciplinary proceedings.",
      "LTC is withheld during the pendency of proceedings.",
      "Penalty: Forfeiture of next two sets of LTC.",
      "PNR No. is mandatory for verification of rail claims."
    ]
  },
  {
    id: 43,
    title: "Interpretation & Relaxation",
    category: "Policy",
    icon: <Info className="w-8 h-8 text-slate-900" />,
    content: [
      "Doubts regarding rules are referred to DoPT for decision.",
      "Ministries/Departments have power to relax rules in cases of undue hardship.",
      "Relaxation requires written reasons and concurrence of DoPT.",
      "Existing instructions not contrary to these rules remain in force."
    ]
  }
];

export default function App() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSlides = useMemo(() => {
    if (!searchTerm.trim()) return slides;
    const query = searchTerm.toLowerCase();
    return slides.filter(s => 
      s.title.toLowerCase().includes(query) || 
      s.category.toLowerCase().includes(query) ||
      s.content.some(c => c.toLowerCase().includes(query)) ||
      (s.details && s.details.toLowerCase().includes(query))
    );
  }, [searchTerm]);

  // Reset to first slide when search changes
  useEffect(() => {
    setCurrentSlideIndex(0);
  }, [searchTerm]);

  const nextSlide = useCallback(() => {
    if (currentSlideIndex < filteredSlides.length - 1) {
      setDirection(1);
      setCurrentSlideIndex(prev => prev + 1);
    }
  }, [currentSlideIndex, filteredSlides.length]);

  const prevSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      setDirection(-1);
      setCurrentSlideIndex(prev => prev - 1);
    }
  }, [currentSlideIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const slide = filteredSlides[currentSlideIndex];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 overflow-hidden relative">
      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Left Sidebar */}
      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: isSidebarOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col border-r border-slate-200"
      >
        <div className="p-6 bg-[#D42F2F] text-white flex justify-between items-center border-b-2 border-[#FFD700]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            <span className="font-bold tracking-tight text-lg">Slide Index</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-slate-200">
          {filteredSlides.length > 0 ? (
            filteredSlides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => {
                  setDirection(idx > currentSlideIndex ? 1 : -1);
                  setCurrentSlideIndex(idx);
                  setIsSidebarOpen(false);
                }}
                className={`w-full p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                  idx === currentSlideIndex 
                    ? 'border-[#D42F2F] bg-red-50 ring-2 ring-red-100' 
                    : 'border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${idx === currentSlideIndex ? 'bg-[#D42F2F] text-white' : 'bg-slate-100 text-slate-400'}`}>
                  <span className="text-xs font-bold">{slides.indexOf(s) + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">
                    <Highlight text={s.category} query={searchTerm} />
                  </div>
                  <div className={`text-xs font-bold truncate ${idx === currentSlideIndex ? 'text-[#D42F2F]' : 'text-slate-700'}`}>
                    <Highlight text={s.title} query={searchTerm} />
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="text-center py-8 text-slate-400">
              <Search className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p className="text-sm">No matching rules found</p>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100">
          <div className="text-[10px] font-bold text-slate-400 uppercase mb-2">Progress</div>
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#D42F2F] transition-all duration-500" 
              style={{ width: `${((currentSlideIndex + 1) / Math.max(1, filteredSlides.length)) * 100}%` }}
            />
          </div>
          <div className="mt-2 text-[10px] font-bold text-slate-500 text-right">
            {filteredSlides.length > 0 ? Math.round(((currentSlideIndex + 1) / filteredSlides.length) * 100) : 0}% Complete
          </div>
        </div>
      </motion.aside>

      {/* Header */}
      <header className="bg-white border-b-4 border-[#FFD700] px-3 sm:px-6 py-3 sm:py-4 flex justify-between items-center shadow-md z-30 relative">
        {/* Menu Icon (Left) */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-[#D42F2F]" />
          </button>
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/b/b4/Emblem_of_India_with_transparent_background.png" 
            alt="National Emblem of India" 
            className="h-8 sm:h-12 w-auto object-contain hidden xs:block"
            referrerPolicy="no-referrer"
          />
          <div className="hidden lg:block">
            <h1 className="text-xl font-bold tracking-tight text-[#D42F2F]">LTC Rules Guide</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Department of Posts, India</p>
          </div>
        </div>

        {/* Search Bar (Center) */}
        <div className="flex-1 max-w-md mx-2 sm:mx-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 group-focus-within:text-[#D42F2F] transition-colors" />
            <input
              type="text"
              placeholder="Search rules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 sm:pl-10 pr-4 py-1.5 sm:py-2 bg-slate-50 border border-slate-200 rounded-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#D42F2F] transition-all"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-3 h-3 text-slate-500" />
              </button>
            )}
          </div>
        </div>

        {/* India Post Logo (Right) */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="text-right hidden xl:block">
            <div className="text-sm font-bold text-slate-400">
              {filteredSlides.length > 0 ? `Slide ${currentSlideIndex + 1} / ${filteredSlides.length}` : 'No results'}
            </div>
          </div>
          <img 
            src="https://upload.wikimedia.org/wikipedia/en/thumb/3/32/India_Post.svg/1280px-India_Post.svg.png" 
            alt="India Post Logo" 
            className="h-8 sm:h-10 w-auto object-contain rounded hidden sm:block"
            referrerPolicy="no-referrer"
          />
        </div>
      </header>

      {/* Main Presentation Area */}
      <main className="flex-1 relative flex items-center justify-center p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-white to-slate-100 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          {filteredSlides.length > 0 ? (
            <motion.div
              key={slide.id}
              custom={direction}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x < -100) nextSlide();
                else if (info.offset.x > 100) prevSlide();
              }}
              initial={{ opacity: 0, x: direction * 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -100 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-6xl bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl shadow-slate-300 border border-slate-100 overflow-hidden flex flex-col min-h-[400px] sm:min-h-[500px]"
            >
              {/* Slide Category Header */}
              <div className="px-5 sm:px-8 py-3 sm:py-4 bg-[#D42F2F] flex justify-between items-center">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/90">
                  Category: <Highlight text={slide.category} query={searchTerm} />
                </span>
                <div className="p-1.5 sm:p-2 bg-white rounded-lg sm:rounded-xl shadow-sm">
                  {slide.icon}
                </div>
              </div>

              {/* Slide Content */}
              <div className="flex-1 p-5 sm:p-8 md:p-12 lg:p-16">
                <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#D42F2F] mb-4 sm:mb-8 tracking-tight">
                  <Highlight text={slide.title} query={searchTerm} />
                </h2>
                
                <ul className="space-y-4 sm:space-y-6">
                  {slide.content.map((item, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                      className="flex items-start gap-3 sm:gap-4 group"
                    >
                      <div className="mt-1.5 w-3 h-3 sm:w-5 sm:h-5 rounded-full bg-red-50 flex-shrink-0 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                        <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#D42F2F]"></div>
                      </div>
                      <p className="text-sm sm:text-lg md:text-xl lg:text-2xl text-slate-700 leading-relaxed font-medium">
                        <Highlight text={item} query={searchTerm} />
                      </p>
                    </motion.li>
                  ))}
                </ul>

                {slide.details && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-6 sm:mt-12 p-4 sm:p-6 bg-amber-50 rounded-xl sm:rounded-2xl border border-amber-100 flex gap-3 sm:gap-4 items-start"
                  >
                    <Info className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg text-amber-800 font-semibold leading-relaxed">
                      <Highlight text={slide.details} query={searchTerm} />
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Slide Footer Navigation */}
              <div className="px-5 sm:px-8 py-4 sm:py-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                <p className="hidden sm:block text-xs text-slate-400 font-medium">
                  Use arrow keys, swipe, or buttons to navigate
                </p>
                <p className="sm:hidden text-[10px] text-slate-400 font-medium">
                  Swipe or use buttons
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={prevSlide}
                    disabled={currentSlideIndex === 0}
                    className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                  <button 
                    onClick={nextSlide}
                    disabled={currentSlideIndex === filteredSlides.length - 1}
                    className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-[#D42F2F] text-white hover:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md shadow-red-200 active:scale-95"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-12 bg-white rounded-3xl shadow-xl border border-slate-100 max-w-md"
            >
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-[#D42F2F] opacity-40" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">No Rules Found</h3>
              <p className="text-slate-500 mb-6">We couldn't find any rules matching "{searchTerm}". Try searching for something else.</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="px-6 py-2 bg-[#D42F2F] text-white rounded-full font-bold hover:bg-red-700 transition-colors"
              >
                Clear Search
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-slate-200">
        <motion.div 
          className="h-full bg-[#FFD700]"
          initial={{ width: 0 }}
          animate={{ width: `${filteredSlides.length > 0 ? ((currentSlideIndex + 1) / filteredSlides.length) * 100 : 0}%` }}
          transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
        />
      </div>

      {/* Footer Info */}
      <div className="bg-[#D42F2F] text-white py-2 sm:py-3 px-4 sm:px-6 text-center text-[10px] sm:text-sm font-medium border-t-2 border-[#FFD700]">
        Prepared by Kalandi Charan Sahoo, Office Assistant, Divisional Office, Dhenkanal Postal Division
      </div>
    </div>
  );
}
