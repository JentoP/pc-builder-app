'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {redirect} from "next/navigation";

type Processor = {
    id: string;
    name: string;
};

export default async function BuilderPage() {
    const [processors, setProcessors] = useState<Processor[]>([]);
    const [selectedProcessor, setSelectedProcessor] = useState<Processor | null>(null);
    const supabase = createClient();

    const {
        data: {user},
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/sign-in");
    }
    useEffect(() => {
        const fetchProcessors = async () => {
            const {data} = await supabase.from('processors').select('id, name');
            setProcessors(data || []);
        };
        fetchProcessors();
    }, []);

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">PC Builder</h1>

            <Card>
                <CardContent className="p-4">
                    <h2 className="text-lg font-semibold mb-2">Processor</h2>
                    <div className="space-y-2">
                        {processors.map((cpu) => (
                            <Button
                                key={cpu.id}
                                variant={selectedProcessor?.id === cpu.id ? 'default' : 'outline'}
                                onClick={() => setSelectedProcessor(cpu)}
                            >
                                {cpu.name}
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {selectedProcessor && (
                <div className="text-sm text-gray-600">
                    <p>Selected CPU: <strong>{selectedProcessor.name}</strong></p>
                </div>
            )}
        </div>
    );
}
