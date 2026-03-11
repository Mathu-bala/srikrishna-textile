import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, PenLine, Heart, Calendar, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const EmotionDiary = () => {
    const [note, setNote] = useState('');
    const [diaries, setDiaries] = useState<any[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('textile_diary');
        if (saved) setDiaries(JSON.parse(saved));
    }, []);

    const saveNote = () => {
        if (!note.trim()) return;
        const newDiaries = [{ text: note, date: new Date().toLocaleDateString() }, ...diaries];
        setDiaries(newDiaries);
        localStorage.setItem('textile_diary', JSON.stringify(newDiaries));
        setNote('');
    };

    const deleteNote = (index: number) => {
        const newDiaries = diaries.filter((_, i) => i !== index);
        setDiaries(newDiaries);
        localStorage.setItem('textile_diary', JSON.stringify(newDiaries));
    };

    return (
        <Card className="glass-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Book className="text-pink-500" />
                    Emotion Diary
                </CardTitle>
                <CardDescription>Save memories associated with your purchased sarees.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <Input
                        placeholder="e.g., Wore the red silk for my son's graduation..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && saveNote()}
                    />
                    <Button onClick={saveNote} size="icon" className="bg-pink-500 hover:bg-pink-600 text-white"><PenLine size={18} /></Button>
                </div>

                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                    {diaries.length > 0 ? diaries.map((d, i) => (
                        <div key={i} className="p-3 rounded-lg border border-pink-100 bg-pink-50/30 group relative">
                            <div className="flex items-center gap-2 text-[10px] text-pink-400 font-bold mb-1">
                                <Calendar size={10} /> {d.date}
                            </div>
                            <div className="text-xs text-foreground/80 leading-relaxed italic">
                                "{d.text}"
                            </div>
                            <button
                                onClick={() => deleteNote(i)}
                                className="absolute top-2 right-2 text-pink-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                    )) : (
                        <div className="text-center py-10 text-muted-foreground text-xs italic">
                            Your first memory is waiting to be written.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default EmotionDiary;
