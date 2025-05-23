import {
    Drawer,
    DrawerTrigger,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerClose
} from '@/components/ui/drawer'
import BuildDisplay from '@/components/BuildDisplay'
import Link from 'next/link'

export default function BuildDrawer() {
    return (
        <>
            <Drawer>
                <DrawerTrigger
                    className="border px-5 py-2 rounded-md text-sm hover:text-primary shadow text-purple-700 border-purple-700">
                    View Build
                </DrawerTrigger>
                <DrawerContent className="max-h-screen">
                    <DrawerHeader>
                        <div className="flex justify-between items-center">
                            <DrawerTitle>Current Build</DrawerTitle>
                            <DrawerClose className="px-4 py-1 rounded text-sm bg-red-600 text-white">Close</DrawerClose>
                        </div>
                        <DrawerDescription>
                            <span>This is your current build. </span>
                            <Link href="/builder" className="underline"> Click here </Link>
                            <span> to go to the build page.</span>
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="w-full h-full p-4">
                        <div className="h-full overflow-y-auto max-h-[50vh]">
                            <BuildDisplay />
                        </div>
                    </div>

                </DrawerContent>
            </Drawer>
        </>
    )
}