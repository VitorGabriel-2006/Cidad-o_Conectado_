"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProfileStore } from "@/store/useProfileStore";
import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { GlossaryTerm } from "@/components/features/accessibility/GlossaryTerm";
import { PerCapitaCalculator } from "./PerCapitaCalculator";
import { SocialPriorityIndicator } from "./SocialPriorityIndicator";
import { useA11yStore } from "@/store/useA11yStore";

const formVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const profileFormSchema = z.object({
  age: z
    .string()
    .min(1, { message: "A idade é obrigatória." })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Por favor, insira uma idade válida.",
    }),
  gender: z.string(),
  race: z.string(),
  education: z.string().min(1, { message: "A escolaridade é obrigatória." }),
  totalFamilyIncome: z.string().min(1, { message: "A renda familiar total é obrigatória." }),
  familyMembers: z
    .string()
    .min(1, { message: "O número de pessoas é obrigatório." })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Por favor, insira um número válido maior que 0.",
    }),
  individualIncome: z.string().min(1, { message: "Sua renda individual é obrigatória." }),
  occupation: z.enum(["CLT", "Autônomo", "MEI", "Desempregado", "Aposentado", "Outro", ""]),
  isStudent: z.boolean().optional(),
  isPregnant: z.boolean().optional(),
  isPcD: z.boolean().optional(),
  pcdType: z.string().optional(),
  cidCode: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const formatCurrency = (value: string) => {
  if (!value) return "";
  const digits = value.replace(/\D/g, "");
  if (digits === "") return "";
  
  const numberValue = parseInt(digits, 10) / 100;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numberValue);
};

export function CreateProfileForm() {
  const profile = useProfileStore((state) => state.profile);
  const setProfile = useProfileStore((state) => state.setProfile);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      age: "",
      gender: "Prefiro não informar",
      race: "Prefiro não informar",
      education: "",
      totalFamilyIncome: "",
      familyMembers: "",
      individualIncome: "",
      occupation: "",
      isStudent: false,
      isPregnant: false,
      isPcD: false,
      pcdType: "",
      cidCode: "",
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        age: profile.age || "",
        gender: profile.gender || "Prefiro não informar",
        race: profile.race || "Prefiro não informar",
        education: profile.education || "",
        totalFamilyIncome: profile.totalFamilyIncome || "",
        familyMembers: profile.familyMembers || "",
        individualIncome: profile.individualIncome || "",
        occupation: profile.occupation || "",
        isStudent: profile.isStudent || false,
        isPregnant: profile.isPregnant || false,
        isPcD: profile.isPcD || false,
        pcdType: profile.pcdType || "",
        cidCode: profile.cidCode || "",
      });
    }
  }, [profile, reset]);

  const watchedIncome = watch("totalFamilyIncome");
  const watchedMembers = watch("familyMembers");
  const isPcD = watch("isPcD");

  const calculatedPerCapita = useMemo(() => {
    if (watchedIncome === undefined || watchedIncome === "" || !watchedMembers) return undefined;
    const incomeValue = parseInt(watchedIncome.replace(/\D/g, ""), 10) / 100;
    const members = parseInt(watchedMembers, 10);
    if (isNaN(incomeValue) || isNaN(members) || members <= 0) return undefined;
    return incomeValue / members;
  }, [watchedIncome, watchedMembers]);

  const { announce } = useA11yStore();

  useEffect(() => {
    if (calculatedPerCapita !== undefined) {
      const formatted = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(calculatedPerCapita);
      announce(`Sua renda per capita atualizada é ${formatted}`);
    }
  }, [calculatedPerCapita, announce]);

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: "totalFamilyIncome" | "individualIncome") => {
    const rawValue = e.target.value;
    const formattedValue = formatCurrency(rawValue);
    setValue(fieldName, formattedValue, { shouldValidate: true });
  };

  function onSubmit(data: ProfileFormValues) {
    setIsSubmitting(true);
    
    const incomeValue = parseInt(data.totalFamilyIncome.replace(/\D/g, ""), 10) / 100;
    const members = parseInt(data.familyMembers, 10);
    const perCapitaIncome = members > 0 ? incomeValue / members : 0;

    setTimeout(() => {
      setProfile({
        age: data.age,
        gender: data.gender,
        race: data.race,
        education: data.education,
        totalFamilyIncome: data.totalFamilyIncome,
        familyMembers: data.familyMembers,
        individualIncome: data.individualIncome,
        occupation: data.occupation as any,
        perCapitaIncome,
        isStudent: data.isStudent ?? false,
        isPregnant: data.isPregnant ?? false,
        isPcD: data.isPcD ?? false,
        pcdType: data.pcdType,
        cidCode: data.cidCode,
      });
      setIsSubmitting(false);
      router.push("/beneficios");
    }, 800);
  }

  return (
    <motion.form 
      variants={formVariants}
      initial="hidden"
      animate="show"
      onSubmit={handleSubmit(onSubmit)} 
      className="space-y-6"
    >
      <SocialPriorityIndicator 
        previewIncome={calculatedPerCapita} 
        previewMembers={watchedMembers ? parseInt(watchedMembers, 10) : undefined} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="age">Idade *</Label>
          <Input id="age" type="number" placeholder="Ex: 35" {...register("age")} />
          {errors.age && (
            <p className="text-[0.8rem] font-medium text-destructive">
              {errors.age.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="totalFamilyIncome">Renda Familiar Total (Mensal) *</Label>
          <Input
            id="totalFamilyIncome"
            placeholder="R$ 0,00"
            {...register("totalFamilyIncome")}
            onChange={(e) => handleIncomeChange(e, "totalFamilyIncome")}
          />
          {errors.totalFamilyIncome ? (
            <p className="text-[0.8rem] font-medium text-destructive">
              {errors.totalFamilyIncome.message}
            </p>
          ) : (
            <p className="text-[0.8rem] text-muted-foreground">
              Somatório da renda de todos na casa.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="familyMembers">Pessoas na Residência *</Label>
          <Input 
            id="familyMembers" 
            type="number" 
            placeholder="Ex: 3" 
            {...register("familyMembers")} 
          />
          {errors.familyMembers ? (
            <p className="text-[0.8rem] font-medium text-destructive">
              {errors.familyMembers.message}
            </p>
          ) : (
            <p className="text-[0.8rem] text-muted-foreground">
              Incluindo você e crianças.
            </p>
          )}
        </div>

        <div className="md:col-span-2 mb-2">
          <PerCapitaCalculator 
            initialMembers={watchedMembers}
            onApply={(totalIncome, members) => {
              const rawString = Math.round(totalIncome * 100).toString();
              setValue("totalFamilyIncome", formatCurrency(rawString), { shouldValidate: true });
              setValue("familyMembers", members.toString(), { shouldValidate: true });
            }}
          />
        </div>

        <div className="space-y-2" id="tour-income">
          <Label htmlFor="individualIncome">Sua Renda Individual (Mensal) *</Label>
          <Input
            id="individualIncome"
            placeholder="R$ 0,00"
            {...register("individualIncome")}
            onChange={(e) => handleIncomeChange(e, "individualIncome")}
          />
          {errors.individualIncome ? (
            <p className="text-[0.8rem] font-medium text-destructive">
              {errors.individualIncome.message}
            </p>
          ) : (
            <p className="text-[0.8rem] text-muted-foreground">
              O quanto você ganha sozinho(a).
            </p>
          )}
        </div>

        <div className="space-y-2" id="tour-occupation">
          <Label htmlFor="occupation">Sua Ocupação *</Label>
          <Controller
            control={control}
            name="occupation"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value} name="occupation">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CLT">Trabalhador Assalariado (CLT)</SelectItem>
                  <SelectItem value="Autônomo">Autônomo (Sem CNPJ)</SelectItem>
                  <SelectItem value="MEI">Microempreendedor Individual (MEI)</SelectItem>
                  <SelectItem value="Desempregado">Desempregado</SelectItem>
                  <SelectItem value="Aposentado">Aposentado / Pensionista</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.occupation && (
            <p className="text-[0.8rem] font-medium text-destructive">
              {errors.occupation.message}
            </p>
          )}
        </div>

        {watchedIncome && watchedMembers && !errors.familyMembers && !errors.totalFamilyIncome && (
          <div className="md:col-span-2 p-3 bg-primary/10 rounded-lg border border-primary/20 text-center">
            <p className="text-sm font-medium text-primary">
              <GlossaryTerm termId="per-capita">Renda Per Capita</GlossaryTerm> Calculada:{" "}
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(calculatedPerCapita || 0)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Este valor será usado para recomendar benefícios sociais corretos.
            </p>
          </div>
        )}

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="education">Escolaridade *</Label>
          <Controller
            control={control}
            name="education"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value} name="education">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione sua escolaridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Analfabeto">Analfabeto</SelectItem>
                  <SelectItem value="Ensino Fundamental Incompleto">Ensino Fundamental Incompleto</SelectItem>
                  <SelectItem value="Ensino Fundamental Completo">Ensino Fundamental Completo</SelectItem>
                  <SelectItem value="Ensino Médio Incompleto">Ensino Médio Incompleto</SelectItem>
                  <SelectItem value="Ensino Médio Completo">Ensino Médio Completo</SelectItem>
                  <SelectItem value="Ensino Superior Incompleto">Ensino Superior Incompleto</SelectItem>
                  <SelectItem value="Ensino Superior Completo">Ensino Superior Completo</SelectItem>
                  <SelectItem value="Pós-graduação">Pós-graduação</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.education && (
            <p className="text-[0.8rem] font-medium text-destructive">
              {errors.education.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gênero</Label>
          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value} name="gender">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Feminino">Feminino</SelectItem>
                  <SelectItem value="Masculino">Masculino</SelectItem>
                  <SelectItem value="Não-binário">Não-binário</SelectItem>
                  <SelectItem value="Prefiro não informar">Prefiro não informar</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="race">Raça/Cor</Label>
          <Controller
            control={control}
            name="race"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value} name="race">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Branco">Branca</SelectItem>
                  <SelectItem value="Pardo">Parda</SelectItem>
                  <SelectItem value="Preto">Preta</SelectItem>
                  <SelectItem value="Amarelo">Amarela</SelectItem>
                  <SelectItem value="Indígena">Indígena</SelectItem>
                  <SelectItem value="Prefiro não informar">Prefiro não informar</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-4 md:col-span-2 mt-2 p-5 border border-border/40 rounded-xl bg-card/40 backdrop-blur-md shadow-sm">
          <Label className="text-base font-semibold">Informações Adicionais (Opcional)</Label>
          <p className="text-sm text-muted-foreground mt-0">Esses dados ajudam a encontrar benefícios específicos.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <Controller
              control={control}
              name="isStudent"
              render={({ field }) => (
                <div className="flex items-center space-x-2 py-2">
                  <Checkbox 
                    id="isStudent" 
                    checked={field.value} 
                    onCheckedChange={field.onChange} 
                  />
                  <Label htmlFor="isStudent" className="font-normal cursor-pointer leading-none flex-1">Sou Estudante</Label>
                </div>
              )}
            />
            <Controller
              control={control}
              name="isPregnant"
              render={({ field }) => (
                <div className="flex items-center space-x-2 py-2">
                  <Checkbox 
                    id="isPregnant" 
                    checked={field.value} 
                    onCheckedChange={field.onChange} 
                  />
                  <Label htmlFor="isPregnant" className="font-normal cursor-pointer leading-none flex-1">Sou Gestante</Label>
                </div>
              )}
            />
            <Controller
              control={control}
              name="isPcD"
              render={({ field }) => (
                <div className="flex items-center space-x-2 py-2">
                  <Checkbox 
                    id="isPcD" 
                    checked={field.value} 
                    onCheckedChange={field.onChange} 
                  />
                  <Label htmlFor="isPcD" className="font-normal cursor-pointer leading-none flex-1">Sou PcD</Label>
                </div>
              )}
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isPcD && (
          <motion.div
            initial={{ opacity: 0, height: 0, overflow: "hidden" }}
            animate={{ opacity: 1, height: "auto", overflow: "visible" }}
            exit={{ opacity: 0, height: 0, overflow: "hidden" }}
            transition={{ duration: 0.3 }}
            className="space-y-4 p-5 border border-primary/30 rounded-xl bg-primary/5"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Info className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-semibold">Detalhes da Condição (Opcional)</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pcdType">Família da Deficiência principal</Label>
                <Controller
                  control={control}
                  name="pcdType"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value} name="pcdType">
                      <SelectTrigger>
                        <SelectValue placeholder="Ex: Física, Visual, etc." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Física">Deficiência Física / Motora</SelectItem>
                        <SelectItem value="Visual">Deficiência Visual</SelectItem>
                        <SelectItem value="Auditiva">Deficiência Auditiva</SelectItem>
                        <SelectItem value="Intelectual">Deficiência Intelectual / Cognitiva</SelectItem>
                        <SelectItem value="Autismo">Transtorno do Espectro Autista (TEA)</SelectItem>
                        <SelectItem value="Multipla">Deficiência Múltipla</SelectItem>
                        <SelectItem value="DoencaCronica">Doença Crônica Grave</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cidCode"><GlossaryTerm termId="cid">Código CID</GlossaryTerm> (Se souber)</Label>
                <Input 
                  id="cidCode" 
                  placeholder="Ex: F84.0, Q90, G35..." 
                  {...register("cidCode")} 
                />
                <p className="text-[0.75rem] text-muted-foreground">
                  Ajuda a encontrar isenções específicas (IPI, ICMS).
                </p>
              </div>
            </div>

            <Alert className="mt-4 bg-background border-primary/20">
              <Info className="h-4 w-4 text-primary" />
              <AlertTitle className="text-primary font-semibold">Sobre Laudos Médicos e Isenções</AlertTitle>
              <AlertDescription className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Isenções de impostos para veículos (IPI/ICMS) exigem <strong>laudos emitidos por médicos do SUS</strong> ou clínicas credenciadas ao Detran (validade depende da condição, mas geralmente inferior a 1 ano).
                <br /><br />
                <strong>Você não precisa ser o motorista!</strong> O benefício de isenção de carro se estende a <strong>não-condutores</strong> (o veículo pode ser registrado no nome do PcD e dirigido por até 3 tutores legais autorizados).
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <Button id="tour-submit" type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Salvando perfil..." : profile ? "Atualizar Perfil" : "Criar Perfil Anônimo"}
      </Button>
    </motion.form>
  );
}
