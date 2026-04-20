import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { FormWelcome } from "@/components/FormWelcome";
import { FormQuestionWithValidation } from "@/components/FormQuestionWithValidation";
import { FormComplete } from "@/components/FormComplete";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  type: "text" | "email" | "tel" | "textarea" | "select" | "date" | "file" | "checkbox";
  title: string;
  subtitle?: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
  multiple?: boolean;
  maxFiles?: number;
  accept?: string;
  groups?: { label: string; icon: string; options: string[] }[];
}

const questions: Question[] = [
  { id: "fullName",         type: "text",  title: "1. Full Name",                        required: true,  placeholder: "e.g. Ahmed Al Mansouri" },
  { id: "email",            type: "email", title: "2. Email ID",                          required: true,  placeholder: "example@email.com" },
  { id: "phone",            type: "tel",   title: "3. Contact Number",                   required: true,  placeholder: "+971 50 000 0000" },
  { id: "homeCountryPhone", type: "tel",   title: "4. Home Country Contact Number",      required: true,  placeholder: "+91 98000 00000" },
  { id: "nationality",      type: "text",  title: "5. Nationality",                      required: true,  placeholder: "e.g. Indian, Emirati…" },
  {
    id: "gender", type: "select", title: "6. Gender", required: true,
    options: ["Male", "Female", "Prefer not to say"],
  },
  { id: "dob",              type: "date",  title: "7. Date of Birth",                    required: true },
  { id: "occupation",       type: "text",  title: "8. Occupation",                       required: true,  placeholder: "e.g. Trader, Engineer, Student…" },
  {
    id: "leadSource", type: "select", title: "9. Lead Source", required: true,
    options: ["Instagram","TikTok","Facebook","WhatsApp","Friend / Referral","Google","YouTube","Walk-in","Other"],
  },
  {
    id: "adsPlatform", type: "select", title: "10. Ads Platform", required: false,
    options: ["Instagram","TikTok","Facebook","Google","YouTube","Snapchat","Other","Not Applicable"],
  },
  { id: "residenceAddress", type: "textarea", title: "11. Residence Address",            required: true,  placeholder: "Apartment, Building, Area, City…" },
  { id: "homeAddress",      type: "textarea", title: "12. Home Address / Native Address", required: true, placeholder: "House No., Street, City, Country…" },
  { id: "idProofFile",  type: "file", title: "13. ID Proof (National ID / Passport / Emirates ID)", required: true,  subtitle: "Upload a clear copy of your ID (PDF, JPG or PNG · Max 5 MB)", multiple: false, maxFiles: 1 },
  { id: "photoFile",    type: "file", title: "14. Photo (Attendee)",                     required: false, subtitle: "Passport size photo preferred (JPG or PNG) · Optional", multiple: false, maxFiles: 1, accept: "image/*" },
  {
    id: "preferredLanguage", type: "select", title: "15. Preferred Language", required: true,
    options: ["English", "Malayalam"],
  },
  {
    id: "modeOfStudy", type: "select", title: "16. Mode of Study", required: true,
    options: ["Online", "Offline"],
  },
  {
    id: "countryAttendance", type: "select", title: "17. Country of Attendance", required: true,
    options: ["United Arab Emirates","Saudi Arabia","Kuwait","Qatar","Bahrain","Oman","India","Pakistan","Philippines","United Kingdom","United States","Other"],
  },
  {
    id: "termsAgreed", type: "checkbox", title: "18. Terms & Conditions", required: true,
    subtitle: `PAYMENT AND REFUND POLICY\nEffective: 01st April 2026\n\nThis Payment and Refund Policy (the "Policy") governs the payment and refund terms between Delta International Management Development Training ("Delta" or "Company") and its students and customers ("You" or "Student") in respect of courses, supplements, and aligned or associated educational services (collectively, the "Service") provided by Delta whether through itself or any of its branches.\n\nPlease read this Policy carefully before registering for any Service. By completing the registration process and submitting payment, You acknowledge that You have read and understood this Policy.\n\n1. PAYMENT\n\n1.1 Fees for the Service must be paid in advance, or as per written directions issued by the administration team of Delta, before You commence attending classes or sessions whether in person or online.\n\n1.2 Payments may be made by cash, debit card, credit card, internet banking, or through approved installment or Buy-Now-Pay-Later ("BNPL") schemes including Tabby, Tamara, or such other schemes as Delta may specify from time to time.\n\n1.3 All payment arrangements must be confirmed in writing by the administration team or other authorised personnel of Delta prior to processing.\n\n2. FEES AND REMEDIES\n\n2.1 General Position\nDelta's courses and sessions represent a significant commitment of instructional resources, preparation, and scheduling. Accordingly, fees paid to Delta are non-refundable in all circumstances, including but not limited to:\n\na. Non-attendance without prior notice or a valid medical reason.\nb. Change of mind, personal scheduling conflicts, relocation, or similar personal reasons arising after enrollment.\nc. Partial attendance of a session or course where the Service has been delivered without defect.\nd. Dissatisfaction with the Service where the Service has been delivered as described and without defect.\n\nNo monetary refund will be issued by Delta under any circumstances. The sole remedy available to You, where applicable and at Delta's sole and absolute discretion, is a Replacement class as set out in Clauses 2.2 and 2.3 below.\n\n2.2 Remedy\nIf a material defect occurs in the delivery of a session or course, You may, at Delta's sole and absolute discretion, be offered a Replacement class as Your sole and exclusive remedy.\n\nProcess:\na. You must notify Delta in writing within three (3) working days of the affected session.\nb. Delta will review the request in its sole and absolute discretion.\nc. Where Delta determines that a material defect has occurred, Delta may arrange a replacement class within a reasonable time.\n\n2.3 Medical Absence\nIf You are unable to attend a session due to a medical reason, You may apply for a replacement class. Conditions:\na. Submit a valid medical certificate issued by a licensed medical professional.\nb. Certificate must be submitted within three (3) working days of the missed session.\nc. Delta reserves the right to verify authenticity and decline where not satisfied.\n\n2.4 Installments and BNPL Payments\nIf You pay via an approved installment plan or BNPL platform (Tabby, Tamara), Your obligations to that platform are governed by Your separate agreement with them. Delta is not a party to that agreement. Your liability to the BNPL provider continues regardless of attendance, withdrawal, or dispute.\n\n2.5 Direct Debit Mandates\nIf You have entered into a direct debit mandate, it will continue per the agreed schedule until the full course fee has been collected. You may not cancel a direct debit mandate unilaterally prior to full collection.\n\n2.6 Service Interruption by Delta\nIn the event Delta is unable to deliver a scheduled session due to reasons within Delta's control, Delta will use reasonable efforts to offer a replacement class. No monetary refund will be issued for any service interruption.\n\n3. REPLACEMENT CLASS\n\nA replacement class:\na. Entitles the Student to re-attend the specific session or class to which it relates.\nb. Is offered at a time determined by Delta, subject to scheduling availability.\nc. Is personal to the Student and non-transferable.\nd. Carries no monetary or cash value.\ne. May not be applied to a different course unless expressly agreed in writing by Delta.\nf. Shall be offered at Delta's sole and absolute discretion. Delta's decision is final.\n\n4. COMPLAINTS AND DISPUTE RESOLUTION\n\n4.1 Raise complaints with Delta's administration team in writing. Delta will acknowledge within four (4) working days.\n\n4.2 Unresolved disputes shall be referred to the competent courts of the Emirate of Dubai, UAE.\n\n5. DEFINITIONS\n\n"Replacement Class" means a non-monetary remedy, offered solely at Delta's discretion, entitling the Student to re-attend the specific session at a time determined by Delta, non-transferable, and carrying no cash or monetary value.\n\n"Defect" means a material difference between the Service as described at enrollment and as actually delivered, not attributable to the Student's conduct.\n\n"Force Majeure" means any event outside Delta's reasonable control including acts of God, government directives, pandemic restrictions, or natural disasters.\n\n6. POLICY UPDATES\n\nDelta reserves the right to update this Policy from time to time. Updates apply to enrollments made after publication. Prior enrollments remain governed by the version in effect at time of enrollment.\n\nFull details: deltainstitutions.com/termsandcondition`,
    options: ["I have read, understood, and agree to Delta Institutions' Terms & Conditions, including the No Refund Policy. I confirm all information provided is accurate."],
  },
];

const STORAGE = {
  step:  "enrollCurrentStep",
  index: "enrollCurrentQuestionIndex",
  ans:   "enrollAnswers",
};

const Index = () => {
  const [currentStep, setCurrentStep] = useState<"welcome" | "questions" | "complete">(
    (localStorage.getItem(STORAGE.step) as any) || "welcome",
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    parseInt(localStorage.getItem(STORAGE.index) || "0"),
  );
  const [answers, setAnswers] = useState<Record<string, any>>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE.ans) || "{}");
      delete saved.idProofFile;
      delete saved.photoFile;
      return saved;
    } catch { return {}; }
  });
  const [direction, setDirection] = useState<"left" | "right">("left");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // ── KEY FIX: track whether the last action was navigating back ──────────
  // This prevents auto-advance from firing when returning to a select question
  const navigatedBackRef = useRef(false);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE.step,  currentStep);
    localStorage.setItem(STORAGE.index, currentQuestionIndex.toString());
    const toSave = { ...answers };
    delete toSave.idProofFile;
    delete toSave.photoFile;
    localStorage.setItem(STORAGE.ans, JSON.stringify(toSave));
  }, [currentStep, currentQuestionIndex, answers]);

  const handleStart = () => { setCurrentStep("questions"); setCurrentQuestionIndex(0); };

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = async () => {
    const q   = questions[currentQuestionIndex];
    const ans = answers[q.id];

    if (q.required) {
      if (q.type === "file") {
        const ok = Array.isArray(ans) ? ans.length > 0 : ans instanceof File;
        if (!ok) { toast({ title: "Required", description: "Please upload the required file.", variant: "destructive" }); return; }
      } else if (!ans || ans?.trim?.() === "") {
        return;
      }
    }

    if (currentQuestionIndex < questions.length - 1) {
      setDirection("left");
      setCurrentQuestionIndex(i => i + 1);
    } else {
      // Last question — submit data immediately, then show success screen
      try {
        await handleSubmit();
        setCurrentStep("complete");
      } catch {
        // toast already shown in handleSubmit; stay on Q21
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep === "complete") {
      // ── Back from complete screen → go back to last question ──────────
      navigatedBackRef.current = true;
      setDirection("right");
      setCurrentStep("questions");
      setCurrentQuestionIndex(questions.length - 1);
      return;
    }
    if (currentQuestionIndex > 0) {
      navigatedBackRef.current = true;   // <── suppress auto-advance
      setDirection("right");
      setCurrentQuestionIndex(i => i - 1);
    }
  };

  // Auto-advance for select — but NOT when navigating back
  useEffect(() => {
    if (navigatedBackRef.current) {
      navigatedBackRef.current = false;  // clear the flag, don't advance
      return;
    }
    const q = questions[currentQuestionIndex];
    if (q?.type === "select" && answers[q.id]) {
      const t = setTimeout(handleNext, 350);
      return () => clearTimeout(t);
    }
  }, [answers, currentQuestionIndex]);   // eslint-disable-line

  /* ── file helpers ───────────────────────────────────────────────── */
  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((res, rej) => {
      const r = new FileReader();
      r.onload  = () => res((r.result as string).split(",")[1]);
      r.onerror = () => rej(new Error("Failed to read file"));
      r.readAsDataURL(file);
    });

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const toFile = async (raw: any) => {
        const f = Array.isArray(raw) ? raw[0] : raw;
        if (!(f instanceof File)) return null;
        return { name: f.name, data: await fileToBase64(f), mimeType: f.type, size: f.size };
      };

      const payload = {
        fullName:          answers.fullName          || "",
        email:             answers.email             || "",
        phone:             answers.phone             || "",
        homeCountryPhone:  answers.homeCountryPhone  || "",
        nationality:       answers.nationality       || "",
        gender:            answers.gender            || "",
        dob:               answers.dob               || "",
        occupation:        answers.occupation        || "",
        leadSource:        answers.leadSource        || "",
        adsPlatform:       answers.adsPlatform       || "",
        residenceAddress:  answers.residenceAddress  || "",
        homeAddress:       answers.homeAddress       || "",
        preferredLanguage: answers.preferredLanguage || "",
        modeOfStudy:       answers.modeOfStudy       || "",
        countryAttendance: answers.countryAttendance || "",
        termsAgreed:       answers.termsAgreed       ? "Yes" : "No",
        idProofFile:       await toFile(answers.idProofFile),
        photoFile:         await toFile(answers.photoFile),
      };

      const res    = await fetch("https://script.google.com/macros/s/AKfycbxRFTYBt0LxtINLCd40t-PrHE5X6rIdZdVb7cJ5UcembHxjfwACFv1uwdDha_BYY1DWTg/exec", {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (result.status === "success") {
        toast({ title: "Enrollment Submitted!", description: "Our team will contact you on WhatsApp shortly." });
        localStorage.removeItem(STORAGE.step);
        localStorage.removeItem(STORAGE.index);
        localStorage.removeItem(STORAGE.ans);
        return { success: true };
      }
      throw new Error(result.message || "Submission failed");
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed to submit", variant: "destructive" });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterAnother = () => {
    localStorage.removeItem(STORAGE.step);
    localStorage.removeItem(STORAGE.index);
    localStorage.removeItem(STORAGE.ans);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setDirection("left");
    setCurrentStep("welcome");
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer   = currentQuestion ? answers[currentQuestion.id] ?? "" : "";

  const canGoNext = currentQuestion
    ? !currentQuestion.required ||
      (currentQuestion.type === "file"
        ? Array.isArray(currentAnswer) ? currentAnswer.length > 0 : currentAnswer instanceof File
        : currentAnswer && currentAnswer?.trim?.() !== "")
    : false;

  if (currentStep === "welcome")  return <FormWelcome onStart={handleStart} />;
  if (currentStep === "complete") return <FormComplete onRegisterAnother={handleRegisterAnother} />;

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <FormQuestionWithValidation
        key={currentQuestionIndex}
        question={currentQuestion as any}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        value={currentAnswer}
        onChange={v => handleAnswerChange(currentQuestion.id, v)}
        onNext={handleNext}
        onPrevious={handlePrevious}
        canGoNext={canGoNext}
        isFirst={currentQuestionIndex === 0}
        isLast={currentQuestionIndex === questions.length - 1}
        allAnswers={answers}
        direction={direction}
        isSubmitting={loading}
      />
    </AnimatePresence>
  );
};

export default Index;
