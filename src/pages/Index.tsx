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
  { id: "photoFile",    type: "file", title: "14. Photo (Attendee)",                     required: true, subtitle: "Passport size photo preferred (JPG or PNG) · Optional", multiple: false, maxFiles: 1, accept: "image/*" },
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
  id: "termsAgreed", type: "checkbox", title: "18. Service Agreement", required: true,
  subtitle: `I hereby declare that I have read and agree to the terms and conditions stated in the company policy. I understand that Delta Digital Academy focuses solely on providing digital marketing education and training services and that the company is not responsible for any loss or damage as stated in the disclaimer. I acknowledge and willingly accept the company's policy of no refunds for products/services. By signing this declaration, I confirm that the personal information I have provided is correct to the best of my knowledge and belief.\n\nDelta Digital Academy only provides digital marketing education and training. The company will not be liable for any loss of any kind, including indirect or consequential loss or damage, loss of profits or revenue, punitive or special damages, arising out of how a student applies or misapplies the knowledge acquired. It is important to note that Delta Digital Academy does not offer refunds for its products/services under any circumstances.`,
  options: ["Disclaimer.. I hereby confirm that I have read, understood, and agree to Delta Digital Academy’s Terms & Conditions. I also confirm that all personal information provided by me is true and correct to the best of my knowledge and belief. Furthermore, I agree to and accept the Terms and Conditions outlined in the Student Guidelines of Delta Digital Academy."],
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
