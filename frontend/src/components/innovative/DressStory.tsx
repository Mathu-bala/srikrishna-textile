import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, History, MapPin } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const stories = {
    kanchipuram: {
        title: "The Temple City's Gold",
        description: "Hand-woven from pure mulberry silk, these sarees originate from Kanchipuram, Tamil Nadu. The legends say the weavers are descendants of Sage Markanda, the master weaver for the Gods.",
        details: "Known for their heavy silk and gold-dipped silver zari.",
        origin: "Tamil Nadu",
        weaving: "Three-shuttle weaving"
    },
    banarasi: {
        title: "Elegance from Kashi",
        description: "Coming from the banks of the Ganges in Varanasi, these sarees are fine silk weaves with intricate floral and foliate motifs inspired by Mughal arts.",
        details: "Takes up to 6 months to weave one authentic saree.",
        origin: "Uttar Pradesh",
        weaving: "Jala & Jacquard"
    },
    chanderi: {
        title: "Lighter than Air",
        description: "A traditional ethnic fabric characterized by its lightweight, sheer texture and fine luxurious feel, produced in the historic town of Chanderi since the 13th century.",
        details: "Historically preferred by royalty for its subtle shimmer.",
        origin: "Madhya Pradesh",
        weaving: "Handloom Buttis"
    }
};

const DressStory = () => {
    return (
        <Card className="glass-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BookOpen className="text-secondary" />
                    Dress Story Mode
                </CardTitle>
                <CardDescription>Explore the cultural heritage behind every thread.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="kanchipuram" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-4 bg-muted/30">
                        <TabsTrigger value="kanchipuram">Kanchi</TabsTrigger>
                        <TabsTrigger value="banarasi">Banaras</TabsTrigger>
                        <TabsTrigger value="chanderi">Chanderi</TabsTrigger>
                    </TabsList>
                    {Object.entries(stories).map(([key, story]) => (
                        <TabsContent key={key} value={key} className="space-y-4 animate-fade-in">
                            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted/20 mb-4 group">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <History className="w-12 h-12 text-muted-foreground/30 group-hover:scale-110 transition-transform" />
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-primary">{story.title}</h3>
                            <p className="text-sm text-foreground/80 leading-relaxed italic border-l-2 border-accent pl-3">
                                "{story.description}"
                            </p>
                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <div className="flex items-center gap-2 text-xs">
                                    <MapPin size={14} className="text-secondary" />
                                    <span>Origin: <span className="font-semibold">{story.origin}</span></span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <History size={14} className="text-secondary" />
                                    <span>Style: <span className="font-semibold">{story.weaving}</span></span>
                                </div>
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default DressStory;
