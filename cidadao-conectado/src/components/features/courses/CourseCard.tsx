"use client";

import React from "react";
import { CourseModel } from "@/data/mockCourses";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, MapPin, Clock, BookOpenCheck, ExternalLink, HandCoins, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface CourseCardProps {
  course: CourseModel;
}

export function CourseCard({ course }: CourseCardProps) {
  const isEad = course.modality === "EAD";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col border-border/50 shadow-sm hover:border-primary/40 transition-all duration-300 relative overflow-hidden">
        {course.status === "Breve" && (
          <div className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10 animate-pulse">
            EM BREVE
          </div>
        )}
        {course.status === "Encerrado" && (
          <div className="absolute top-3 right-3 bg-muted-foreground text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
            ENCERRADO
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex gap-2 mb-2">
            <Badge variant={isEad ? "default" : "secondary"} className={isEad ? "bg-blue-600 hover:bg-blue-700" : "bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/40 dark:text-orange-400"}>
              {course.modality}
            </Badge>
            <Badge variant="outline" className="text-muted-foreground flex items-center gap-1 border-border/50">
              <MapPin className="w-3 h-3" />
              {course.state === "Nacional" ? "Todo Brasil" : `${course.city || ""}, ${course.state}`}
            </Badge>
          </div>
          <CardTitle className={`text-xl leading-tight ${course.status === "Encerrado" ? "text-muted-foreground" : ""}`}>
            {course.title}
          </CardTitle>
          <div className="text-sm font-medium text-muted-foreground mt-1">
            {course.provider} • {course.area}
          </div>
        </CardHeader>

        <CardContent className="flex-1 pb-4 flex flex-col gap-4">
          <p className="text-sm text-foreground/80">
            {course.description}
          </p>

          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 p-2 rounded-md">
              <Clock className="w-4 h-4 shrink-0" />
              <span>{course.hours} horas</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 p-2 rounded-md">
              {course.mecCertified ? (
                <>
                  <BookOpenCheck className="w-4 h-4 text-green-600 shrink-0" />
                  <span className="font-medium text-green-700 dark:text-green-500">MEC Certificado</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Certificado Livre</span>
                </>
              )}
            </div>
          </div>

          <div className="mt-2 p-3 bg-secondary/30 rounded-lg border border-border/40">
            <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Pré-Requisitos Escolar</h4>
            <p className="text-sm font-medium">{course.prerequisites}</p>
          </div>

          {course.extraAids && course.extraAids.length > 0 && (
            <div className="mt-auto bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 p-3 rounded-lg">
              <h4 className="text-xs font-bold text-green-800 dark:text-green-500 uppercase flex items-center gap-1.5 mb-1.5">
                <HandCoins className="w-4 h-4" />
                Auxílios e Benefícios Extras
              </h4>
              <ul className="text-sm text-green-700 dark:text-green-400 space-y-1">
                {course.extraAids.map((aid, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-green-500 shrink-0" />
                    {aid}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-2 border-t border-border/20">
          {course.status === "Aberto" ? (
            <Button 
              className="w-full font-semibold" 
              variant="default"
              nativeButton={false}
              render={<Link href={course.enrollmentLink} target="_blank" rel="noopener noreferrer" />}
            >
              <GraduationCap className="w-4 h-4 mr-2" />
              Fazer Inscrição
              <ExternalLink className="w-3 h-3 ml-2 opacity-50" />
            </Button>
          ) : (
            <Button 
              className="w-full font-semibold" 
              variant="secondary"
              disabled
            >
              {course.status === "Breve" ? "Inscrições em Breve" : "Turma Encerrada"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
