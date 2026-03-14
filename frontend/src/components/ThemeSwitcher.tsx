import { useState } from 'react';
import { Palette, Moon, Sun, Monitor, Check } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

const themes = [
    { id: 'purple', name: 'Neon Purple', color: 'hsl(262 83% 66%)' },
    { id: 'blue', name: 'Blue Ocean', color: 'hsl(217 91% 60%)' },
    { id: 'green', name: 'Green Nature', color: 'hsl(142 71% 58%)' },
    { id: 'pink', name: 'Pink Glow', color: 'hsl(330 81% 60%)' },
    { id: 'silver', name: 'Classic Silver', color: 'hsl(215 20% 65%)' },
] as const;

export const ThemeSwitcher = () => {
    const { mode, theme, setTheme, toggleMode } = useTheme();
    const { user } = useAuth();

    return (
        <div className="flex items-center gap-2">
            {/* Mode Toggle */}
            <Button
                variant="ghost"
                size="icon"
                onClick={toggleMode}
                className="rounded-full w-auto h-auto p-2 hover:bg-primary/10 hover:text-primary transition-all duration-300"
                title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
                {mode === 'dark' ? (
                    <Sun className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px] lg:w-[24px] lg:h-[24px] animate-in zoom-in duration-300" />
                ) : (
                    <Moon className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px] lg:w-[24px] lg:h-[24px] animate-in zoom-in duration-300" />
                )}
            </Button>

            {/* Theme Picker - Admin Only */}
            {user?.isAdmin && (
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full w-auto h-auto p-2 hover:bg-primary/10 hover:text-primary transition-all duration-300"
                            title="Change Accent Color"
                        >
                            <Palette className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px] lg:w-[24px] lg:h-[24px]" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 bg-card/90 backdrop-blur-xl border-border/50 p-3" align="end">
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase text-muted-foreground px-1">Choose Theme</h4>
                            <div className="grid gap-2">
                                {themes.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setTheme(t.id as any)}
                                        className={`flex items-center justify-between px-2 py-1.5 rounded-md transition-all ${theme === t.id
                                            ? 'bg-primary/10 text-primary'
                                            : 'hover:bg-muted/50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.3)]"
                                                style={{ backgroundColor: t.color }}
                                            />
                                            <span className="text-sm font-medium">{t.name}</span>
                                        </div>
                                        {theme === t.id && <Check size={14} />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            )}
        </div>
    );
};
