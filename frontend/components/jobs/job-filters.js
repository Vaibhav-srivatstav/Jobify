"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Clock, 
  FileText, 
  GraduationCap, 
  Wifi, 
  Building2, 
  Layers, 
  Globe, 
  Loader2 
} from "lucide-react"

// --- ANIMATED RADIO (UNCHANGED) ---
const AnimatedRadioGroup = ({ label, name, options, value, onChange }) => {
  return (
    <div className="relative overflow-hidden flex flex-col items-start gap-4 p-5 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white/50 dark:bg-black/20 shadow-sm w-fit min-w-[300px] transition-colors duration-300">
      <span className="relative z-10 text-xs font-extrabold uppercase tracking-wider text-black dark:text-white drop-shadow-sm">
        {label}
      </span>
      <div className="flex flex-wrap gap-4 relative z-10">
        {options.map((option) => {
          const isSelected = value === option.value;
          const colorStyles = {
            blue:   { ring: "ring-blue-400",   fill: "text-blue-600",   bg: "bg-blue-100",   explode: "bg-blue-200" },
            orange: { ring: "ring-orange-400", fill: "text-orange-600", bg: "bg-orange-100", explode: "bg-orange-200" },
            purple: { ring: "ring-purple-400", fill: "text-purple-600", bg: "bg-purple-100", explode: "bg-purple-200" },
            green:  { ring: "ring-emerald-400",fill: "text-emerald-600",bg: "bg-emerald-100",explode: "bg-emerald-200" },
            sky:    { ring: "ring-sky-400",    fill: "text-sky-600",    bg: "bg-sky-100",    explode: "bg-sky-200" },
            slate:  { ring: "ring-slate-400",  fill: "text-slate-600",  bg: "bg-slate-100",  explode: "bg-slate-200" },
            indigo: { ring: "ring-indigo-400", fill: "text-indigo-600", bg: "bg-indigo-100", explode: "bg-indigo-200" },
            rose:   { ring: "ring-rose-400",   fill: "text-rose-600",   bg: "bg-rose-100",   explode: "bg-rose-200" },
          };
          const style = colorStyles[option.color] || colorStyles.blue;
          
          return (
            <div key={option.value} className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="relative flex h-[40px] w-[40px] items-center justify-center">
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={isSelected}
                  onChange={() => onChange(option.value)}
                  className="peer z-20 h-full w-full cursor-pointer opacity-0 absolute inset-0"
                />
                <div className={`absolute h-full w-full rounded-full shadow-sm shadow-[#00000020] duration-300 peer-checked:scale-110 peer-checked:ring-2 ${style.bg} ${style.ring}`}></div>
                <div className={`absolute -z-10 h-full w-full scale-0 rounded-full duration-500 peer-checked:scale-[500%] opacity-20 ${style.explode}`}></div>
                <option.icon className={`absolute transition-all duration-300 w-5 h-5 ${isSelected ? style.fill : "text-zinc-500"}`} strokeWidth={2.5} />
              </div>
              <span className={`relative z-10 text-[10px] font-bold transition-colors ${isSelected ? "text-black dark:text-white" : "text-zinc-600 dark:text-zinc-400 group-hover:text-black dark:group-hover:text-white"}`}>
                {option.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- FIXED WAVE INPUT (Guaranteed to float up) ---
const WaveInput = ({ label, icon: Icon, value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  
  // Logic: Floating if focused OR if there is text in the input
  const isFloating = isFocused || (value && value.length > 0);
  
  const characters = label.split("");

  return (
    <div className="relative w-full h-[50px]">
      
      {/* Icon (Left aligned) */}
      <Icon className={`absolute left-0 top-3 h-5 w-5 transition-colors z-10 ${isFloating ? "text-[#5264AE]" : "text-zinc-400"}`} />

      {/* Input Field */}
      <input
        type="text"
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="
            absolute bottom-0 left-0 w-full h-full 
            bg-transparent 
            text-black dark:text-white text-base
            pl-8 pr-2 pt-2 
            border-none outline-none ring-0 focus:ring-0
            z-20
        "
      />

      {/* The Animated Bottom Bar (Split into Left/Right halves for expansion effect) */}
      <div className="absolute bottom-1 left-0 w-full h-[1px] bg-[#515151]"></div>
      
      {/* Left Half Bar */}
      <div 
        className={`absolute bottom-1 left-1/2 h-[2px] bg-[#5264AE] transition-all duration-300 ease-out ${isFloating ? "w-1/2 left-0" : "w-0"}`} 
      ></div>
      
      {/* Right Half Bar */}
      <div 
        className={`absolute bottom-1 right-1/2 h-[2px] bg-[#5264AE] transition-all duration-300 ease-out ${isFloating ? "w-1/2 right-0" : "w-0"}`} 
      ></div>

      {/* The Floating Label (Wave) */}
      <label className="absolute left-8 top-3 flex pointer-events-none z-10">
        {characters.map((char, index) => (
          <span
            key={index}
            style={{ transitionDelay: `${index * 50}ms` }}
            className={`
              transition-all duration-200 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] whitespace-pre
              ${isFloating 
                ? "-translate-y-[25px] text-[#5264AE] text-sm font-medium" 
                : "translate-y-0 text-[#999] text-lg font-normal"
              }
            `}
          >
            {char}
          </span>
        ))}
      </label>
    </div>
  );
};

// --- MAIN FORM ---
export function JobFilters({ onDeepSearch, isLoading }) {
  const [keyword, setKeyword] = useState("")
  const [location, setLocation] = useState("")
  
  const [jobType, setJobType] = useState("full time")
  const [remoteFilter, setRemoteFilter] = useState("remote")

  const handleSubmit = (e) => {
    e.preventDefault()
    onDeepSearch({ keyword, location, jobType, remoteFilter })
  }

  const jobTypeOptions = [
    { value: "full time", label: "Full Time", icon: Briefcase, color: "blue" },
    { value: "part time", label: "Part Time", icon: Clock, color: "orange" },
    { value: "contract", label: "Contract", icon: FileText, color: "purple" },
    { value: "internship", label: "Intern", icon: GraduationCap, color: "green" },
  ];

  const remoteOptions = [
    { value: "remote", label: "Remote", icon: Wifi, color: "sky" },
    { value: "on-site", label: "On-Site", icon: Building2, color: "slate" },
    { value: "hybrid", label: "Hybrid", icon: Layers, color: "indigo" },
    { value: "all", label: "Any", icon: Globe, color: "rose" },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto mb-10 space-y-6">
      <form onSubmit={handleSubmit} className="bg-white/60 dark:bg-zinc-900/60 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 backdrop-blur-xl shadow-sm">
        
        {/* Row 1: WAVE INPUTS */}
        <div className="flex flex-col md:flex-row gap-10 mb-8 px-2">
            <div className="flex-1">
                <WaveInput 
                    label="Job Title" 
                    icon={Search}
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
            </div>
            <div className="flex-1">
                <WaveInput 
                    label="Location" 
                    icon={MapPin}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
            </div>
        </div>

        {/* Row 2: Animated Radio Groups */}
        <div className="flex flex-wrap gap-6 justify-start">
            <AnimatedRadioGroup 
                label="Employment Type" 
                name="jobType"
                options={jobTypeOptions} 
                value={jobType} 
                onChange={setJobType} 
            />
            
            <AnimatedRadioGroup 
                label="Workplace Type" 
                name="remoteFilter"
                options={remoteOptions} 
                value={remoteFilter} 
                onChange={setRemoteFilter} 
            />
        </div>

        {/* Action Button */}
        <div className="mt-6 flex justify-end">
             <Button 
                type="submit" 
                disabled={isLoading} 
                className="ml-auto w-full sm:w-auto px-8 bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-colors border border-transparent dark:border-zinc-200"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="animate-spin size-4 mr-2" />
                        Searching...
                    </>
                ) : (
                    "Find Jobs"
                )}
            </Button>
            </div>
      </form>
    </div>
  )
}