"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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

  const [editingSection, setEditingSection] = useState(null)
  const [skillModalOpen, setSkillModalOpen] = useState(false)
  const [skillType, setSkillType] = useState("technical")
  const [newSkill, setNewSkill] = useState("")
  const [resumeFile, setResumeFile] = useState(null)

  // Load profile from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user_profile")
    if (stored) {
      setProfile(JSON.parse(stored))
    }
  }, [])

  // Save profile to localStorage
  const saveProfile = (updated) => {
    setProfile(updated)
    localStorage.setItem("user_profile", JSON.stringify(updated))
    setEditingSection(null)
  }

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

  const handleResumeUpload = (file) => {
    setResumeFile(file)
    setProfile({ ...profile, resumeUploaded: true })
  }

  const handleAvatarUpload = (file) => {
    const reader = new FileReader()
    reader.onload = () => {
      setProfile({
        ...profile,
        personalInfo: {
          ...profile.personalInfo,
          avatar: reader.result,
        },
      })
    }
    reader.readAsDataURL(file)
  }

  // --- STYLING CONSTANTS ---
  const btnPrimary =
    "bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"

  const btnOutline =
    "border-slate-200 dark:border-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50"

  const inputFocus =
    "focus-visible:ring-slate-400 dark:focus-visible:ring-slate-500"

  return (
    <div className="space-y-6">
      {/* Personal Info Card */}
      <Card className="border-border/50">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="relative">
              <Avatar className="size-24 border-2 border-slate-300 dark:border-slate-600">
                {profile.personalInfo.avatar ? (
                  <AvatarImage src={profile.personalInfo.avatar} />
                ) : (
                  <AvatarFallback className="bg-slate-400 dark:bg-slate-700 text-white text-3xl font-bold">
                    {profile.personalInfo.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("") || "U"}
                  </AvatarFallback>
                )}
              </Avatar>

              <input
                type="file"
                id="avatarUpload"
                className="hidden"
                accept="image/*"
                onChange={(e) =>
                  e.target.files?.[0] &&
                  handleAvatarUpload(e.target.files[0])
                }
              />

              <label htmlFor="avatarUpload" className="absolute bottom-0 right-0">
                <Button size="icon" variant="outline" className={`size-6 ${btnOutline}`}>
                  <Upload className="size-4" />
                </Button>
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
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          personalInfo: {
                            ...profile.personalInfo,
                            name: e.target.value,
                          },
                        })
                      }
                    />

                    <Input
                      className={inputFocus}
                      placeholder="Title"
                      value={profile.personalInfo.title}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          personalInfo: {
                            ...profile.personalInfo,
                            title: e.target.value,
                          },
                        })
                      }
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <Input
                      className={inputFocus}
                      placeholder="Email"
                      value={profile.personalInfo.email}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          personalInfo: {
                            ...profile.personalInfo,
                            email: e.target.value,
                          },
                        })
                      }
                    />

                    <Input
                      className={inputFocus}
                      placeholder="Phone"
                      value={profile.personalInfo.phone}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          personalInfo: {
                            ...profile.personalInfo,
                            phone: e.target.value,
                          },
                        })
                      }
                    />
                  </div>

                  <Input
                    className={inputFocus}
                    placeholder="Location"
                    value={profile.personalInfo.location}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        personalInfo: {
                          ...profile.personalInfo,
                          location: e.target.value,
                        },
                      })
                    }
                  />

                  <Textarea
                    className={inputFocus}
                    placeholder="Summary"
                    value={profile.personalInfo.summary}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        personalInfo: {
                          ...profile.personalInfo,
                          summary: e.target.value,
                        },
                      })
                    }
                  />

                  <div className="flex justify-end gap-2">
                    <Button
                      onClick={() => setEditingSection(null)}
                      variant="outline"
                      className={btnOutline}
                    >
                      Cancel
                    </Button>

                    <Button
                      onClick={() => saveProfile(profile)}
                      className={btnPrimary}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-3xl font-bold">
                        {profile.personalInfo.name || "No Name"}
                      </h2>
                      <p className="text-lg text-slate-900 dark:text-slate-200 font-medium">
                        {profile.personalInfo.title || "No title"}
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
                      <Mail className="size-4" />
                      {profile.personalInfo.email || "Not provided"}
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="size-4" />
                      {profile.personalInfo.phone || "Not provided"}
                    </div>

                    <div className="flex items-center gap-2 col-span-2">
                      <MapPin className="size-4" />
                      {profile.personalInfo.location || "Not provided"}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mt-2">
                    {profile.personalInfo.summary || "No summary provided"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resume Upload */}
      <Card className="border-border/50">
        <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {profile.resumeUploaded
              ? "Resume uploaded"
              : "No resume uploaded yet"}
          </p>

          <input
            type="file"
            className="hidden"
            id="resumeUpload"
            accept=".pdf,.doc,.docx"
            onChange={(e) =>
              e.target.files?.[0] &&
              handleResumeUpload(e.target.files[0])
            }
          />

          <label htmlFor="resumeUpload">
            <Button className={`flex items-center gap-1 ${btnPrimary}`}>
              <Upload className="size-4" />
              {profile.resumeUploaded ? "Replace Resume" : "Upload Resume"}
            </Button>
          </label>
        </CardContent>
      </Card>

      {/* Skills Accordion */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Skills</CardTitle>
          <CardDescription>Technical and soft skills</CardDescription>
        </CardHeader>

        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {/* Technical */}
            <AccordionItem value="technical">
              <AccordionTrigger className="hover:no-underline flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Code className="size-5" />
                  <span className="font-semibold">Technical Skills</span>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className={btnOutline}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSkillType("technical")
                    setSkillModalOpen(true)
                  }}
                >
                  <Plus className="size-3" />
                </Button>
              </AccordionTrigger>

              <AccordionContent className="pt-2 flex flex-wrap gap-2">
                {profile.skills.technical.length ? (
                  profile.skills.technical.map((skill, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-3 py-1 border rounded-full text-sm"
                    >
                      <span>{skill}</span>
                      <button
                        onClick={() => removeSkill("technical", idx)}
                      >
                        ✕
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No technical skills added
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Soft */}
            <AccordionItem value="soft">
              <AccordionTrigger className="hover:no-underline flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Code className="size-5" />
                  <span className="font-semibold">Soft Skills</span>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className={btnOutline}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSkillType("soft")
                    setSkillModalOpen(true)
                  }}
                >
                  <Plus className="size-3" />
                </Button>
              </AccordionTrigger>

              <AccordionContent className="pt-2 flex flex-wrap gap-2">
                {profile.skills.soft.length ? (
                  profile.skills.soft.map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-3 py-1 border rounded-full text-sm">
                      <span>{skill}</span>
                      <button onClick={() => removeSkill("soft", idx)}>
                        ✕
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No soft skills added
                  </p>
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
            <DialogTitle>
              Add {skillType === "technical" ? "Technical" : "Soft"} Skill
            </DialogTitle>
          </DialogHeader>

          <Input
            className={inputFocus}
            placeholder="Skill name"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
          />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSkillModalOpen(false)}
              className={btnOutline}
            >
              Cancel
            </Button>
            <Button onClick={handleSkillAdd} className={btnPrimary}>
              Add Skill
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
