"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Mail,
  Phone,
  MapPin,
  Code,
  Edit2,
  Upload,
  Plus,
  Loader2,
  Save
} from "lucide-react"
import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

export function ProfileView() {
  const [profile, setProfile] = useState({
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      location: "",
      title: "",
      summary: "",
      avatar: "", 
    },
    skills: {
      technical: [],
      soft: [],
    },
    resumeUploaded: false,
  })

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editingSection, setEditingSection] = useState(null)
  
  // Skill Modal State
  const [skillModalOpen, setSkillModalOpen] = useState(false)
  const [skillType, setSkillType] = useState("technical")
  const [newSkill, setNewSkill] = useState("")

  // --- 1. FETCH DATA FROM BACKEND ---
  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/profile', {
        method: 'GET',
        credentials: 'include' 
      })
      
      if (res.ok) {
        const data = await res.json()
        
        setProfile({
            personalInfo: {
                name: data.name || "",
                email: data.email || "",
                phone: data.phone || "",
                location: data.location || "",
                title: data.experience?.[0]?.title || "", 
                summary: data.summary || "",
                avatar: data.avatar || "" 
            },
            skills: {
                technical: data.skills || [],
                soft: [] 
            },
            resumeUploaded: true 
        })
      }
    } catch (error) {
      console.error("Failed to fetch profile", error)
    } finally {
      setIsLoading(false)
    }
  }

  // --- 2. SAVE DATA TO BACKEND ---
  const saveProfile = async () => {
    setIsSaving(true)
    try {
        const backendPayload = {
            name: profile.personalInfo.name,
            email: profile.personalInfo.email,
            phone: profile.personalInfo.phone,
            location: profile.personalInfo.location,
            summary: profile.personalInfo.summary,
            skills: [...profile.skills.technical, ...profile.skills.soft],
            avatar: profile.personalInfo.avatar
        }

        const res = await fetch('http://localhost:5000/api/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(backendPayload)
        })

        if (res.ok) {
            setEditingSection(null)
        }
    } catch (error) {
        console.error("Failed to save", error)
    } finally {
        setIsSaving(false)
    }
  }

  // --- 3. SKILL HANDLERS ---
  const handleSkillAdd = () => {
    if (!newSkill.trim()) return
    const updatedSkills = {
      ...profile.skills,
      [skillType]: [...profile.skills[skillType], newSkill.trim()],
    }
    setProfile({ ...profile, skills: updatedSkills })
    setNewSkill("")
    setSkillModalOpen(false)
  }

  const removeSkill = (type, idx) => {
    const updated = [...profile.skills[type]]
    updated.splice(idx, 1)
    setProfile({ ...profile, skills: { ...profile.skills, [type]: updated } })
  }

  // --- 4. UPLOAD HANDLERS ---
 const handleResumeUpload = async (file) => {
    const formData = new FormData()
    formData.append('resume', file)
    
    // Optional: Add local loading state if you want (e.g., set a spinner on the button)
    setIsLoading(true); // Recommended: Turn on loading spinner

    try {
        const res = await fetch('http://localhost:5000/api/resume/upload', {
            method: 'POST',
            credentials: 'include',
            body: formData
        })
        
        if (res.ok) {
            const data = await res.json()
            const newProfileData = data.profile; // 🔥 The fresh data from AI
            
            // 1. UPDATE UI STATE (What the user sees)
            setProfile(prev => ({
                ...prev,
                personalInfo: {
                    ...prev.personalInfo,
                    name: newProfileData.name || prev.personalInfo.name,
                    email: newProfileData.email || prev.personalInfo.email,
                    phone: newProfileData.phone || prev.personalInfo.phone,
                    location: newProfileData.location || prev.personalInfo.location,
                    summary: newProfileData.summary || prev.personalInfo.summary,
                    title: newProfileData.experience?.[0]?.title || prev.personalInfo.title,
                    avatar: newProfileData.avatar || prev.personalInfo.avatar 
                },
                skills: {
                    ...prev.skills,
                    technical: newProfileData.skills || [], // AI skills go here
                    soft: prev.skills.soft 
                },
                resumeUploaded: true
            }))

            // -------------------------------------------------------
            // 🔥 FIXED: IMMEDIATE LOCAL STORAGE UPDATE
            // This enables the Job Cards to "see" the new skills immediately
            // -------------------------------------------------------
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const userObj = JSON.parse(storedUser);
                
                // Update the skills in local storage
                userObj.skills = newProfileData.skills || [];
                
                // Save it back
                localStorage.setItem("user", JSON.stringify(userObj));
                
                console.log("✅ LocalStorage updated with new Resume Skills:", userObj.skills);
            }
        }
    } catch (error) {
        console.error("Upload failed", error)
    } finally {
        setIsLoading(false); // Turn off loading spinner
    }
  }

  const handleAvatarUpload = (file) => {
    if (file.size > 2 * 1024 * 1024) {
        alert("File is too big! Please upload an image under 2MB.");
        return;
    }

    const reader = new FileReader()
    
    reader.onload = async () => {
      const base64Image = reader.result;

      setProfile(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          avatar: base64Image,
        },
      }))

      try {
        const res = await fetch('http://localhost:5000/api/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ avatar: base64Image }) 
        })

        if (!res.ok) console.error("Failed to save avatar to server")
      } catch (error) {
        console.error("Network error saving avatar", error)
      }
    }
    
    reader.readAsDataURL(file)
  }

  // --- STYLING CONSTANTS ---
  const btnPrimary = "bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
  const btnOutline = "border-slate-200 dark:border-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50"
  const inputFocus = "focus-visible:ring-slate-400 dark:focus-visible:ring-slate-500"

  if (isLoading) {
      return <div className="flex justify-center py-20"><Loader2 className="size-8 animate-spin" /></div>
  }

  return (
    <div className="space-y-6">
      {/* Personal Info Card */}
      <Card className="border-border/50">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            
            {/* Avatar Section */}
            <div className="relative">
              <Avatar className="size-24 border-2 border-slate-300 dark:border-slate-600">
                {profile.personalInfo.avatar ? (
                  <AvatarImage src={profile.personalInfo.avatar} />
                ) : (
                  <AvatarFallback className="bg-slate-400 dark:bg-slate-700 text-white text-3xl font-bold">
                    {profile.personalInfo.name
                      ? profile.personalInfo.name.split(" ").map((n) => n[0]).join("")
                      : "U"}
                  </AvatarFallback>
                )}
              </Avatar>

              <input
                type="file"
                id="avatarUpload"
                className="hidden"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])}
              />

              <label htmlFor="avatarUpload" className="absolute bottom-0 right-0 cursor-pointer">
                <div className={`size-6 flex items-center justify-center rounded-md border ${btnOutline} bg-background`}>
                  <Upload className="size-3" />
                </div>
              </label>
            </div>

            <div className="flex-1 space-y-4 w-full">
              {editingSection === "personal" ? (
                <div className="space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Input
                      className={inputFocus}
                      placeholder="Full Name"
                      value={profile.personalInfo.name}
                      onChange={(e) => setProfile({ ...profile, personalInfo: { ...profile.personalInfo, name: e.target.value } })}
                    />
                    <Input
                      className={inputFocus}
                      placeholder="Title"
                      value={profile.personalInfo.title}
                      onChange={(e) => setProfile({ ...profile, personalInfo: { ...profile.personalInfo, title: e.target.value } })}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <Input
                      className={inputFocus}
                      placeholder="Email"
                      value={profile.personalInfo.email}
                      onChange={(e) => setProfile({ ...profile, personalInfo: { ...profile.personalInfo, email: e.target.value } })}
                    />
                    <Input
                      className={inputFocus}
                      placeholder="Phone"
                      value={profile.personalInfo.phone}
                      onChange={(e) => setProfile({ ...profile, personalInfo: { ...profile.personalInfo, phone: e.target.value } })}
                    />
                  </div>

                  <Input
                    className={inputFocus}
                    placeholder="Location"
                    value={profile.personalInfo.location}
                    onChange={(e) => setProfile({ ...profile, personalInfo: { ...profile.personalInfo, location: e.target.value } })}
                  />

                  <Textarea
                    className={inputFocus}
                    placeholder="Summary"
                    value={profile.personalInfo.summary}
                    onChange={(e) => setProfile({ ...profile, personalInfo: { ...profile.personalInfo, summary: e.target.value } })}
                  />

                  <div className="flex justify-end gap-2">
                    <Button onClick={() => setEditingSection(null)} variant="outline" className={btnOutline}>
                      Cancel
                    </Button>
                    <Button onClick={saveProfile} className={btnPrimary} disabled={isSaving}>
                      {isSaving && <Loader2 className="size-4 mr-2 animate-spin" />}
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-3xl font-bold">{profile.personalInfo.name || "Your Name"}</h2>
                      <p className="text-lg text-slate-900 dark:text-slate-200 font-medium">
                        {profile.personalInfo.title || "Job Title"}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingSection("personal")}
                      className={`flex items-center gap-1 ${btnOutline}`}
                    >
                      <Edit2 className="size-4" /> Edit
                    </Button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 text-sm text-muted-foreground mt-2">
                    <div className="flex items-center gap-2">
                      <Mail className="size-4" /> {profile.personalInfo.email || "No email"}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="size-4" /> {profile.personalInfo.phone || "No phone"}
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <MapPin className="size-4" /> {profile.personalInfo.location || "No location"}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mt-2">
                    {profile.personalInfo.summary || "Add a summary to your profile..."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resume Upload */}
      <Card className="border-border/50">
        <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
          <p className="text-sm text-muted-foreground">
            {profile.resumeUploaded ? "Resume Uploaded" : "No resume uploaded yet"}
          </p>

          <input
            type="file"
            className="hidden"
            id="resumeUpload"
            accept=".pdf"
            onChange={(e) => e.target.files?.[0] && handleResumeUpload(e.target.files[0])}
          />

          <label htmlFor="resumeUpload">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer ${btnPrimary}`}>
              <Upload className="size-4" />
              {profile.resumeUploaded ? "Update Resume (PDF)" : "Upload Resume (PDF)"}
            </div>
          </label>
        </CardContent>
      </Card>

      {/* Skills Accordion */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
                <CardTitle>Skills</CardTitle>
                <CardDescription>Manage your technical expertise</CardDescription>
            </div>
            <Button size="sm" onClick={saveProfile} disabled={isSaving} variant="outline" className={btnOutline}>
                <Save className="size-4 mr-2"/> Save Skills
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Accordion type="single" collapsible className="w-full" defaultValue="technical">
            {/* Technical */}
            <AccordionItem value="technical">
              <AccordionTrigger className="hover:no-underline flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Code className="size-5" />
                  <span className="font-semibold">Technical Skills</span>
                </div>
                <div 
                    onClick={(e) => {
                        e.stopPropagation()
                        setSkillType("technical")
                        setSkillModalOpen(true)
                    }}
                    className={`size-6 flex items-center justify-center rounded-full border ${btnOutline}`}
                >
                  <Plus className="size-3" />
                </div>
              </AccordionTrigger>

              <AccordionContent className="pt-2 flex flex-wrap gap-2">
                {profile.skills.technical.length ? (
                  profile.skills.technical.map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-3 py-1 border rounded-full text-sm">
                      <span>{skill}</span>
                      <button onClick={() => removeSkill("technical", idx)} className="text-muted-foreground hover:text-red-500">
                        ✕
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No technical skills added</p>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Soft Skills */}
            <AccordionItem value="soft">
              <AccordionTrigger className="hover:no-underline flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Code className="size-5" />
                  <span className="font-semibold">Soft Skills</span>
                </div>
                <div 
                    onClick={(e) => {
                        e.stopPropagation()
                        setSkillType("soft")
                        setSkillModalOpen(true)
                    }}
                    className={`size-6 flex items-center justify-center rounded-full border ${btnOutline}`}
                >
                  <Plus className="size-3" />
                </div>
              </AccordionTrigger>

              <AccordionContent className="pt-2 flex flex-wrap gap-2">
                {profile.skills.soft.length ? (
                  profile.skills.soft.map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-3 py-1 border rounded-full text-sm">
                      <span>{skill}</span>
                      <button onClick={() => removeSkill("soft", idx)} className="text-muted-foreground hover:text-red-500">
                        ✕
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No soft skills added</p>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Skill Modal */}
      <Dialog open={skillModalOpen} onOpenChange={setSkillModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add {skillType === "technical" ? "Technical" : "Soft"} Skill</DialogTitle>
          </DialogHeader>
          <Input
            className={inputFocus}
            placeholder="Skill name (e.g. React, Leadership)"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setSkillModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSkillAdd} className={btnPrimary}>Add Skill</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}