import { Card } from '@/components/ui/card'
import { computerFacts } from '@/utils/computerFacts'

export default function FunFactCardList() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {computerFacts.map((factObj, index) => (
                <Card
                    key={index}
                    className="bg-sidebar border rounded-lg p-4 shadow-sm flex flex-col justify-between h-full"
                >
                    <h3 className="text-lg font-semibold mb-2 text-purple-700">{factObj.fact}</h3>
                    <p className="text-sm text-muted-foreground">{factObj.details}</p>
                </Card>
            ))}
        </div>
    )
}